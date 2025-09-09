import { pegarTarefas, tarefas, editarTarefa, removerTarefa } from './tarefas.js';
import { inicializarCadastro, validacaoData, filtrarPorData, fitrarPorStatus } from './cadastro.js';
//import moment from 'moment';
const listaTarefasEl = $('#lista-tarefas');
const btnFiltrarEl = $('#btnFiltrar');

inicializarCadastro();
await pegarTarefas();

renderizarTarefas(tarefas, listaTarefasEl);
setarEventoAcaoEditar(listaTarefasEl, tarefas);
excluirTarefa(listaTarefasEl, tarefas);
statusAtual(listaTarefasEl, tarefas);
filtrarTarefa(btnFiltrarEl, listaTarefasEl, tarefas);

function setarEventoAcaoEditar(rootEl, tarefas) {
    rootEl.on('click', '#btnEditar', function() {
        const index = $(this).closest('.tarefa').index();
        const tarefa = tarefas[index];
        abrirModalEditar(tarefa, tarefas);
    });
}

function abrirModalEditar(tarefa, tarefas) {
    const modal = document.getElementById("modalEditar");

    $("#modalTitulo").val(tarefa.titulo);
    $("#modalDescricao").val(tarefa.descricao);
    $("#modalData").val(moment(tarefa.data).format("YYYY-MM-DD"));
    $("#modalStatus").val(tarefa.status);

    modal.showModal();
    botoesModalEditar(modal, tarefa, tarefas); 
}

function botoesModalEditar(modal, tarefa, tarefas) {
    $("#btnConfirmar").off("click").on("click", async function(e) {
        e.preventDefault(); 

        await editarTarefa(tarefa.id, {
            titulo: $("#modalTitulo").val(),
            descricao: $("#modalDescricao").val(),
            data: $("#modalData").val(),
            status: $("#modalStatus").val()
        });

        renderizarTarefas(tarefas, listaTarefasEl);
        modal.close(); 
    });

    $("#btnCancelar").off("click").on("click", function(e) {
        e.preventDefault();
        modal.close();
    });
}

function excluirTarefa(rootEl, tarefas) {
    rootEl.on('click', '#btnExcluir', async function() {
        const resposta = confirm("Tem certeza que deseja excluir?");
        if (!resposta) { return; } 

        const id = $(this).closest('.tarefa').data('id');
        await removerTarefa(id);
        renderizarTarefas(tarefas, listaTarefasEl);
    });    
}

function statusAtual(rootEl, tarefas) {
    rootEl.on('change', '.input-status', function() {  
        const index = $(this).closest('.tarefa').index();
        tarefas[index].status = $(this).val();
    });
}


function filtrarTarefa(btnFiltrarEl, listaTarefasEl, tarefas) {
    btnFiltrarEl.click(() => {
        const status = $('#status').val();
        const dataInicio = validacaoData($('#inpDataInicio').val());
        const dataFim = validacaoData($('#inpDataFim').val());
        
        if (!status && !dataInicio && !dataFim) {
            alert("Informe status ou data para filtrar!")
            renderizarTarefas(tarefas, listaTarefasEl);
        }
        
        let filtradas = tarefas;
        filtradas = fitrarPorStatus(filtradas, status);
        filtradas = filtrarPorData(filtradas, dataInicio, dataFim);

        renderizarTarefas(filtradas, listaTarefasEl);
    });   
}

$('#btnLimparFiltro').click(() => {
    renderizarTarefas(tarefas, listaTarefasEl);
})

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
