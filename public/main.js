import { pegarTarefas, tarefas, editarTarefa, removerTarefa, filtroPorStatus, mudarStatusTarefa } from './tarefas.js';
import { inicializarCadastro, validacaoData, filtrarPorData } from './cadastro.js';

const listaTarefasEl = $('#lista-tarefas');
const btnFiltrarEl = $('#btnFiltrar');

async function main() {
    inicializarCadastro(listaTarefasEl);
    await pegarTarefas();
    renderizarTarefas(tarefas, listaTarefasEl);
    setarEventoAcaoEditar(tarefas, listaTarefasEl);
    excluirTarefa(listaTarefasEl, tarefas);
    statusAtual(listaTarefasEl, tarefas);
    filtrarTarefa(btnFiltrarEl, listaTarefasEl, tarefas);
}

function setarEventoAcaoEditar(tarefas, listaTarefasEl) {
    listaTarefasEl.on('click', '#btnEditar', function() {
        const index = $(this).closest('.tarefa').index();
        const tarefa = tarefas[index];
        abrirModalEditar(tarefa, tarefas, listaTarefasEl);
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

function botoesModalEditar(modal, tarefa, listaTarefasEl) {
    $("#btnConfirmar").off("click").on("click", async function(e) {
        e.preventDefault(); 

        const novaTarefa = await editarTarefa(tarefa.id, {
            titulo: $("#modalTitulo").val(),
            descricao: $("#modalDescricao").val(),
            data: $("#modalData").val(),
            status: $("#modalStatus").val()
        });

        if(novaTarefa){
            const tarefasAtualizadas = await pegarTarefas();
            renderizarTarefas(tarefasAtualizadas, listaTarefasEl);
            modal.close();
        }
        else { return toastr.error("Erro ao carregar as tarefas!", "ERRO") }    
    });

    $("#btnCancelar").off("click").on("click", function(e) {
        e.preventDefault();
        modal.close();
    });
}

function excluirTarefa(listaTarefasEl) {
    listaTarefasEl.on('click', '#btnExcluir', async function() {
        const resposta = confirm("Tem certeza que deseja excluir?");
        if (!resposta) { return; } 

        const id = $(this).closest('.tarefa').data('id');
        await removerTarefa(id);
        if(removerTarefa)
        {
            const tarefasAtualizadas = await pegarTarefas();
            renderizarTarefas(tarefasAtualizadas, listaTarefasEl);
        }
        else { return toastr.error("Erro ao carregar as tarefas!", "ERRO") }
    });    
}

function statusAtual(listaTarefasEl) {
    listaTarefasEl.on('change', '.input-status', async function() {  
        const id = $(this).closest('.tarefa').data('id');
        const status = $(this).val();

        const novoStatus = await mudarStatusTarefa(id, status);
        if(novoStatus){
            const tarefasAtualizadas = await pegarTarefas();
            renderizarTarefas(tarefasAtualizadas, listaTarefasEl);
        }
        else { return toastr.error("Erro ao carregar as tarefas!", "ERRO") }
    });
}

function filtrarTarefa(btnFiltrarEl, listaTarefasEl, tarefas) {
    btnFiltrarEl.click(async () => {
        const status = $('#status').val();
        const dataInicio = validacaoData($('#inpDataInicio').val());
        const dataFim = validacaoData($('#inpDataFim').val());
        
        if (!status && !dataInicio && !dataFim) {
             return toastr.error("Informe uma data ou status para filtrar!", "ERRO")
        }
        
        const tarefasFiltro = await filtroPorStatus(status)
        
        if(tarefasFiltro){
            renderizarTarefas(tarefasFiltro, listaTarefasEl);
        }    
        else { return toastr.error("Erro ao carregar as tarefas!", "ERRO") }
        
        if(dataInicio && dataFim)
        {
            let filtradas = tarefas;
            filtradas = filtrarPorData(filtradas, dataInicio, dataFim);
            renderizarTarefas(filtradas, listaTarefasEl);
        }
        else{ return toastr.error("Erro ao carregar as tarefas!", "ERRO")}
        
    });   
}

$('#btnLimparFiltro').click(() => {
    renderizarTarefas(tarefas, listaTarefasEl);
})

export function renderizarTarefas(lista, listaTarefasEl) {
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
                                <option value="pendente"  ${tarefa.status === "pendente"  ? "selected" : ""}>Pendente</option>
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

main()
