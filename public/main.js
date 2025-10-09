import { editarTarefa, removerTarefa, filtroPorStatus, mudarStatusTarefa, pegarTarefas } from './tarefas.js';
import { inicializarCadastro } from './cadastro.js';
import { tarefasSubject } from './tarefasSubject.js';
import { OrdenacaoContext, NoSort, SortByDateAsc, SortByDateDesc, SortByTitleAsc, SortByTitleDesc, SortByStatus } from './ordenacaoStrategy.js';
import { validarCamposObrigatorios, validarData, validarIntervaloDatas } from './validacoes.js';

async function main() {
    const listaTarefasEl = $('#lista-tarefas');
    const btnFiltrarEl = $('#btnFiltrar');
    const ordenacaoContext = new OrdenacaoContext(new NoSort());
    const sortOption = new rxjs.BehaviorSubject('');

    // Atualiza lista automaticamente ao mudar ordenação ou tarefas
    rxjs.combineLatest([sortOption, tarefasSubject])
        .subscribe(([activeSort, tarefas]) => {
            const tarefasOrdenadas = ordenarTarefas(ordenacaoContext, activeSort, tarefas); 
            renderizarTarefas(tarefasOrdenadas, listaTarefasEl);
        });
        
    await recarregarTarefas();
    await inicializarCadastro(listaTarefasEl);
    setarEventoAcaoEditar(listaTarefasEl);
    setarEventoAcaoExcluirTarefa(listaTarefasEl);
    setarEventoAcaoAlterarStatusTarefa(listaTarefasEl);
    setarEventoAcaoFiltrarTarefa(btnFiltrarEl);
    setarEventoOrdenacao(sortOption);
    limparFiltro();
}

function handleActionResult({ ok, successMsg, errorMsg, reload = true }) {
    if (!ok) {
        toastr.error(errorMsg, "ERRO");
        return false;
    }
    toastr.success(successMsg);
    if (reload) recarregarTarefas();
    return true;
}

/* ========= EVENTOS ========= */

function setarEventoAcaoEditar(listaTarefasEl) {
    listaTarefasEl.on('click', '.btnEditar', function() { // alterado para class (melhor que id)
        const index = $(this).closest('.tarefa').index();
        const listaAtual = tarefasSubject.getValue();
        const tarefa = listaAtual[index];
        abrirModalEditar(tarefa);
    });
}

function abrirModalEditar(tarefa) {
    const modal = document.getElementById("modalEditar");

    $("#modalTitulo").val(tarefa.titulo);
    $("#modalDescricao").val(tarefa.descricao);
    $("#modalData").val(moment(tarefa.data).format("YYYY-MM-DD"));
    $("#modalStatus").val(tarefa.status);

    modal.showModal();
    botoesModalEditar(modal, tarefa); 
}

function botoesModalEditar(modal, tarefa) {
    $("#btnConfirmar").off("click").on("click", async function(e) {
        e.preventDefault(); 

        const titulo = $("#modalTitulo").val();
        const descricao = $("#modalDescricao").val();
        const data = $("#modalData").val();
        const status = $("#modalStatus").val();
        
        if (!validarCamposObrigatorios({ titulo, descricao, data })) {
            toastr.error("Preencha todos os campos!", "ERRO");
            return;
        }

        if (!validarData(data)) {
            toastr.error("Data inválida!", "ERRO");
            return;
        }

        const novaTarefa = await editarTarefa(tarefa.id, titulo, descricao, data, status);
        const ok = handleActionResult({
            ok: novaTarefa,
            successMsg: "Tarefa editada com sucesso!",
            errorMsg: "Erro ao editar tarefa!"
        });

        if (ok) modal.close();
    });

    $("#btnCancelar").off("click").on("click", function(e) {
        e.preventDefault();
        modal.close();
    });
}

function setarEventoAcaoExcluirTarefa(listaTarefasEl) {
    listaTarefasEl.on('click', '.btnExcluir', async function() {
        const id = $(this).closest('.tarefa').data('id');
        $.confirm({
            title: 'Confirmação',
            content: 'Deseja realmente excluir?',
            buttons: {
                Sim: async function () { 
                    handleActionResult({
                        ok: await removerTarefa(id),
                        successMsg: "Tarefa excluída!",
                        errorMsg: "Erro ao excluir a tarefa!"
                    });
                },  
                Cancelar: function () {
                    toastr.info('Ação cancelada!');
                }
            }
        });
    });    
}

function setarEventoAcaoAlterarStatusTarefa(listaTarefasEl) {
    listaTarefasEl.on('change', '.tarefa__status', async function() {  
        const id = $(this).closest('.tarefa').data('id');
        const status = $(this).val();

        handleActionResult({
            ok: await mudarStatusTarefa(id, status),
            successMsg: "Status alterado!",
            errorMsg: "Não foi possível alterar o Status!"
        });
    });
}

function setarEventoAcaoFiltrarTarefa(btnFiltrarEl) {
    btnFiltrarEl.click(async () => {
        const status = $('#status').val();
        const dataInicio = $('#inpDataInicio').val();
        const dataFim = $('#inpDataFim').val();
        
        if (!status && !dataInicio && !dataFim) {
            toastr.error("Informe um status ou um período de datas para filtrar!", "ERRO");
            return;
        }

        let tarefas = [];

        if (status) {
            const tarefasFiltradas = await filtroPorStatus(status);
            if (!tarefasFiltradas) {
                toastr.error("Erro ao carregar as tarefas!", "ERRO");
                return;
            }
            tarefas = tarefasFiltradas;
        } else {
            tarefas = tarefasSubject.getValue();
        }

        if (dataInicio && dataFim) {
            if (!validarIntervaloDatas(dataInicio, dataFim)) {
                toastr.error("Informe uma data de início e fim válidas!", "ERRO");
                return;
            }
            tarefas = tarefas.filter(t => moment(t.data).isBetween(dataInicio, dataFim, undefined, '[]'));
        }

        tarefasSubject.next(tarefas);
    });   
}

function limparFiltro() {
    $('#btnLimparFiltro').click(async () => {
        recarregarTarefas();
        $('#status').val("");
        $('#inpDataInicio').val("");
        $('#inpDataFim').val("");
    });    
}

function setarEventoOrdenacao(sortOption) {
    const selecOrdenarEl  = $('#ordenar');
    selecOrdenarEl.change(() => {
        const val = selecOrdenarEl.val();
        sortOption.next(val);
    });
}

/* ========= AUXILIARES ========= */

function ordenarTarefas(ordenacaoContext, sortOption, tarefas) {
    switch(sortOption) {
        case 'data-asc': ordenacaoContext.setStrategy(new SortByDateAsc()); break;
        case 'data-desc': ordenacaoContext.setStrategy(new SortByDateDesc()); break;
        case 'titulo-asc': ordenacaoContext.setStrategy(new SortByTitleAsc()); break;
        case 'titulo-desc': ordenacaoContext.setStrategy(new SortByTitleDesc()); break;
        case 'status': ordenacaoContext.setStrategy(new SortByStatus()); break;
        default: ordenacaoContext.setStrategy(new NoSort());
    }
    return ordenacaoContext.ordenar(tarefas);
}

function renderizarTarefas(lista, listaTarefasEl) {
    listaTarefasEl.empty();

    lista.forEach((tarefa) => {
        const li = $(`
            <li class="tarefa" data-id="${tarefa.id}">
                <div class="tarefa__header">
                    <div><h3><strong>${tarefa.titulo}</strong></h3></div>
        
                    <div class="tarefa__fields">
                        <div>
                            <p>${moment(tarefa.data, "YYYY-MM-DD").format("DD/MM/YYYY")}</p>
                        </div>
                        <div>
                            <select class="tarefa__status">
                                <option value="pendente"  ${tarefa.status === "pendente"  ? "selected" : "" }>Pendente</option>
                                <option value="andamento" ${tarefa.status === "andamento" ? "selected" : ""}>Em andamento</option>
                                <option value="concluida" ${tarefa.status === "concluida" ? "selected" : ""}>Concluída</option>
                            </select>
                        </div>
        
                        <div class="tarefa__actions">
                            <button class="btnEditar btn btn--icon" title="Editar"><i class="las la-pencil-alt"></i></button>
                            <button class="btnExcluir btn btn--icon" title="Excluir"><i class="las la-trash"></i></button>
                        </div>
                    </div>
                </div>
                <div>
                    <p class="tarefa__descricao">${tarefa.descricao}</p>
                </div>
            </li>
        `);

        listaTarefasEl.append(li);
    });
}

/* ========= CARREGAMENTO ========= */

export async function recarregarTarefas() {
    const tarefas = await pegarTarefas();
    if (!tarefas) {
        toastr.error("Erro ao carregar tarefas!", "ERRO");
        return;
    }
    tarefasSubject.next(tarefas);
}

main();
