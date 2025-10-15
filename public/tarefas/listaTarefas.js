import { removerTarefa, mudarStatusTarefa, pegarTarefas } from './tarefas.js';
import { abrirModalEditar } from '../modal.js';
import { tarefasSubject } from './tarefasSubject.js';
import { OrdenacaoContext, NoSort } from '../ordenacao/ordenacaoStrategy.js';
import { ordenarTarefas } from '../ordenacao/ordenarTarefas.js';
import { filtrarPorStatusOuDatas } from './filtrarTarefas.js';

export function configurarListaTarefas({
    listaTarefasEl, 
    btnFiltrarEl, 
    selectOrdenarEl, 
    tarefasSubject, 
    recarregarTarefas, 
    filtroPorStatus}) {

    const ordenacaoContext = new OrdenacaoContext(new NoSort());
    const sortOption = new rxjs.BehaviorSubject('');

    setarEventoAcaoEditar(listaTarefasEl);
    setarEventoAcaoExcluirTarefa(listaTarefasEl);
    setarEventoAcaoAlterarStatusTarefa(listaTarefasEl);
    setarEventoOrdenacao(selectOrdenarEl, sortOption);

    configurarFiltro({
        btnFiltrarEl,
        tarefasSubject,
        recarregarTarefas,
        filtroPorStatus
    });

    renderizarListaTarefasOnChanges({
        ordenacaoContext,
        sortOption,
        tarefasSubject,
        listaTarefasEl
    })

}

export function renderizarListaTarefasOnChanges({ ordenacaoContext, sortOption, tarefasSubject, listaTarefasEl }) {
    rxjs
    .combineLatest([sortOption, tarefasSubject])
    .subscribe(([activeSort, tarefas]) => {
        const tarefasOrdenadas = ordenarTarefas(ordenacaoContext, activeSort, tarefas); 
        renderizarTarefas(tarefasOrdenadas, listaTarefasEl);
    }) 
}

export function configurarFiltro({ btnFiltrarEl }) {
    setarEventoAcaoFiltrarTarefa(btnFiltrarEl);
    limparFiltro();
}


export function setarEventoOrdenacao(selectOrdenarEl, sortOption) {
    selectOrdenarEl.change(() => {
        const val = selectOrdenarEl.val();
        sortOption.next(val);
    });
}

export function setarEventoAcaoEditar(listaTarefasEl) {
    listaTarefasEl.on('click', '.btnEditar', function() {
        const index = $(this).closest('.tarefa').index();
        const listaAtual = tarefasSubject.getValue();
        const tarefa = listaAtual[index];
        abrirModalEditar(tarefa);
    });
}

export function setarEventoAcaoExcluirTarefa(listaTarefasEl) {
    listaTarefasEl.on('click', '.btnExcluir', async function() {
        const id = $(this).closest('.tarefa').data('id');
        $.confirm({
            title: 'Confirmação',
            content: 'Deseja realmente excluir?',
            buttons: {
                Sim: async function () { 
                    try {
                        const ok = await removerTarefa(id);
                        handleActionResult({
                            ok,
                            successMsg: "Tarefa excluída!",
                            errorMsg: "Erro ao excluir a tarefa!"
                        });
                    } catch (err) {
                        toastr.error("Falha inesperada ao excluir a tarefa!", "Erro");
                        console.error(err);
                    }
                },  
                Cancelar: function () {
                    toastr.info('Ação cancelada!');
                }
            }
        });
    });    
}

export function setarEventoAcaoAlterarStatusTarefa(listaTarefasEl) {
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



export function setarEventoAcaoFiltrarTarefa(btnFiltrarEl) {
    btnFiltrarEl.click(async () => {
        const status = $('#status').val();
        const dataInicio = $('#inpDataInicio').val();
        const dataFim = $('#inpDataFim').val();

        const tarefas = await filtrarPorStatusOuDatas(status, dataInicio, dataFim);
        if (tarefas) tarefasSubject.next(tarefas);
    });
}

export function limparFiltro() {
    $('#btnLimparFiltro').click(() => {
        recarregarTarefas();
        $('#status, #inpDataInicio, #inpDataFim').val("");
    });
}


export function renderizarTarefas(lista, listaTarefasEl) {
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


export async function recarregarTarefas() {
    try {
        const tarefas = await pegarTarefas();
        if (!tarefas) {
            toastr.error("Erro ao carregar tarefas!", "ERRO");
            return;
        }
        tarefasSubject.next(tarefas);
    } catch (err) {
        console.error(err);
        toastr.error("Erro inesperado ao carregar tarefas!", "ERRO");
    }
}

export function handleActionResult({ ok, successMsg, errorMsg, reload = true }) {
    if (!ok) {
        toastr.error(errorMsg, "Erro");
        return false;
    }
    toastr.success(successMsg);
    if (reload) recarregarTarefas();
    return true;
}