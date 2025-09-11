import { pegarTarefas, tarefas, editarTarefa, removerTarefa, filtroPorStatus, mudarStatusTarefa } from './tarefas.js';
import { inicializarCadastro, validacaoData, filtrarPorData,  validacaoCampos} from './cadastro.js';

const listaTarefasEl = $('#lista-tarefas');
const btnFiltrarEl = $('#btnFiltrar');


async function main() {
    inicializarCadastro(listaTarefasEl);
    await pegarTarefas();
    renderizarTarefas(tarefas, listaTarefasEl);
    setarEventoAcaoEditar(listaTarefasEl);
    setarEventoAcaoExcluirTarefa(listaTarefasEl);
    setarEventoAcaoAlterarStatusTarefa(listaTarefasEl);
    setarEventoAcaoFiltrarTarefa(btnFiltrarEl, listaTarefasEl);
    limparFiltro(listaTarefasEl);
}

function setarEventoAcaoEditar(listaTarefasEl) {
    listaTarefasEl.on('click', '#btnEditar', function() {
        const index = $(this).closest('.tarefa').index();
        const tarefa = tarefas[index];
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

function botoesModalEditar(modal, tarefa, listaTarefasEl) {
    $("#btnConfirmar").off("click").on("click", async function(e) {
        e.preventDefault(); 

        const titulo = $("#modalTitulo").val();
        const descricao = $("#modalDescricao").val();
        const data = $("#modalData").val();
        const status = $("#modalStatus").val();
        
        if (!validacaoCampos(titulo, descricao, data)) return toastr.error("Preencha todos os campos!", "ERRO")
        if (!validacaoData(data)) return toastr.error("Data inválida!", "ERRO")

        const novaTarefa = await editarTarefa(tarefa.id, {titulo, descricao, data, status});
        if(!novaTarefa) return toastr.error("Erro ao carregar as tarefas!", "ERRO")

        const tarefasAtualizadas = await pegarTarefas();
        renderizarTarefas(tarefasAtualizadas, listaTarefasEl);
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
                    await removerTarefa(id);
                    if(removerTarefa)
                    {
                        const tarefasAtualizadas = await pegarTarefas();
                        renderizarTarefas(tarefasAtualizadas, listaTarefasEl);
                        return toastr.success("Tarefa excluida!");
                    }
                    else { return toastr.error("Erro ao carregar as tarefas!", "ERRO") }
                    
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
        if(novoStatus){
            const tarefasAtualizadas = await pegarTarefas();
            renderizarTarefas(tarefasAtualizadas, listaTarefasEl);
        }
        else { return toastr.error("Erro ao carregar as tarefas!", "ERRO") }
    });
}

function setarEventoAcaoFiltrarTarefa(btnFiltrarEl, listaTarefasEl) {
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
        else return;
    });   
}

function limparFiltro(listaTarefasEl) {
    $('#btnLimparFiltro').click(async () => {
        const tarefas = await pegarTarefas();
        renderizarTarefas(tarefas, listaTarefasEl);
        limparCamposFiltro();
    })    
}
function limparCamposFiltro() {
    $('#status').val("");
    $('#inpDataInicio').val("");
    $('#inpDataFim').val("");
}
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
