import { editarTarefa, removerTarefa, filtroPorStatus, mudarStatusTarefa, pegarTarefas } from './tarefas.js';
import { inicializarCadastro, validacaoData, filtrarPorData,  validacaoCampos} from './cadastro.js';
import { tarefasSubject } from './tarefasSubject.js';

const listaTarefasEl = $('#lista-tarefas');
const btnFiltrarEl = $('#btnFiltrar');

async function main() {
    recarregarTarefas()
    inicializarCadastro(listaTarefasEl);
    setarEventoAcaoEditar(listaTarefasEl);
    setarEventoAcaoExcluirTarefa(listaTarefasEl);
    setarEventoAcaoAlterarStatusTarefa(listaTarefasEl);
    setarEventoAcaoFiltrarTarefa(btnFiltrarEl, listaTarefasEl);
    limparFiltro();
}

tarefasSubject.subscribe((tarefas) => {
    renderizarTarefas(tarefas, listaTarefasEl);
});

function setarEventoAcaoEditar(listaTarefasEl) {
    listaTarefasEl.on('click', '#btnEditar', function() {
        const index = $(this).closest('.tarefa').index();
        const listaAtual = tarefasSubject.getValue();
        const tarefa = listaAtual[index];
        abrirModalEditar(tarefa, listaTarefasEl);
    });
}

function abrirModalEditar(tarefa, listaTarefasEl) {
    const modal = document.getElementById("modalEditar");

    $("#modalTitulo").val(tarefa.titulo);
    $("#modalDescricao").val(tarefa.descricao);
    $("#modalData").val(moment(tarefa.data).format("YYYY-MM-DD"));
    $("#modalStatus").val(tarefa.status);

    modal.showModal();
    botoesModalEditar(modal, tarefa, listaTarefasEl); 
}

function botoesModalEditar(modal, tarefa) {
    $("#btnConfirmar").off("click").on("click", async function(e) {
        e.preventDefault(); 

        const titulo = $("#modalTitulo").val();
        const descricao = $("#modalDescricao").val();
        const data = $("#modalData").val();
        const status = $("#modalStatus").val();
        
        if (!validacaoCampos(titulo, descricao, data)){
            toastr.error("Preencha todos os campos!", "ERRO");
            return
        } 
        if (!validacaoData(data)) return toastr.error("Data inválida!", "ERRO");
        
        const novaTarefa = await editarTarefa(tarefa.id, titulo, descricao, data, status);
        if(!novaTarefa) return toastr.error("Erro ao editar tarefa!", "ERRO");
        recarregarTarefas();

        modal.close();
    });

    $("#btnCancelar").off("click").on("click", function(e) {
        e.preventDefault();
        modal.close();
    });
}

function setarEventoAcaoExcluirTarefa(listaTarefasEl) {
    listaTarefasEl.on('click', '#btnExcluir', async function() {
        const id = $(this).closest('.tarefa').data('id');
        $.confirm({
            title: 'Confirmação',
            content: 'Deseja realmente excluir?',
            buttons: {
                Sim: async function () { 
                    const removerTarefasOK = await removerTarefa(id);
                    if(!removerTarefasOK) return toastr.error("Erro ao excluir a tarefa!", "ERRO");
                    recarregarTarefas();
                    toastr.success("Tarefa excluida!");             
                },  
                Cancelar: function () {
                   return toastr.success('Cancelado com sucesso!');
                }
            }
        });
    });    
}

function setarEventoAcaoAlterarStatusTarefa(listaTarefasEl) {
    listaTarefasEl.on('change', '.input-status', async function() {  
        const id = $(this).closest('.tarefa').data('id');
        const status = $(this).val();
        
        const novoStatus = await mudarStatusTarefa(id, status);
        if(!novoStatus) return toastr.error("Não foi possível alterar o Status!", "ERRO");
        recarregarTarefas();
        toastr.success("Status alterado!");
    });
}

function setarEventoAcaoFiltrarTarefa(btnFiltrarEl) {
    btnFiltrarEl.click(async () => {
        const status = $('#status').val();
        const dataInicio = $('#inpDataInicio').val();
        const dataFim = $('#inpDataFim').val();
        
        if(!status && !dataInicio && !dataFim) return toastr.error("Informe um status ou um período de datas para filtrar!", "ERRO");

        let tarefas = []

        if(status){
            const tarefasFiltradas = await filtroPorStatus(status);
            if(!tarefasFiltradas) return toastr.error("Erro ao carregar as tarefas!", "ERRO");
            tarefas = tarefasFiltradas;
        }
        else{
            tarefas = tarefasSubject.getValue();
        } 

        if (dataInicio && dataFim){
            if(validacaoData(dataInicio) && validacaoData(dataFim)){
                tarefas = filtrarPorData(tarefas, dataInicio, dataFim);
            }
            else {
                return toastr.error("Informe uma data de inicio e fim validas!", "ERRO");
            }
        }

        tarefasSubject.next(tarefas)
    });   
}

function limparFiltro() {
    $('#btnLimparFiltro').click(async () => {
        recarregarTarefas();
        $('#status').val("");
        $('#inpDataInicio').val("");
        $('#inpDataFim').val("");
    })    
}
function renderizarTarefas(lista, listaTarefasEl) {
    listaTarefasEl.empty();

    lista.forEach((tarefa) => {
        const li = $(`
            <li class="tarefa" data-id="${tarefa.id}">
                <div class="div-header">
                    <div class="div-titulo"><h3 class="titulo"><strong>${tarefa.titulo}</strong></h3></div>
        
                    <div class="div-data-section-btn">
                        <div class="div-data">
                            <p class="text">${moment(tarefa.data, "YYYY-MM-DD").format("DD/MM/YYYY")}</p>
                        </div>
                        <div>
                            <select class="input-status">
                                <option value="pendente"  ${tarefa.status === "pendente"  ? "selected" : "" }>Pendente</option>
                                <option value="andamento" ${tarefa.status === "andamento" ? "selected" : ""}>Em andamento</option>
                                <option value="concluida" ${tarefa.status === "concluida" ? "selected" : ""}>Concluída</option>
                            </select>
                        </div>
        
                        <div class="div-btn">
                            <button id="btnEditar" data-modal="modal" class="btnTarefa" title="Editar"><i class="las la-pencil-alt"></i></button>
                            <button id="btnExcluir" class="btnTarefa"><i class="las la-trash" title="Excluir"></i></button>
                        </div>
                    </div>
                </div>
                <div class="div-descricao">
                    <p class="tarefa-descricao">${tarefa.descricao}</p>
                </div>
            </li>
        `);

        listaTarefasEl.append(li);
    });
}

export async function recarregarTarefas() {
    const tarefas = await pegarTarefas();
    if(!tarefas) return toastr.error("Erro a carregar tarefas!", "ERRO");
    tarefasSubject.next(tarefas);
}

main()