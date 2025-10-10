import { removerTarefa, filtroPorStatus, mudarStatusTarefa } from './tarefas/tarefas.js';
import { tarefasSubject } from './tarefas/tarefasSubject.js';
import { abrirModalEditar } from './modal.js';
import { validarIntervaloDatas } from './validacoes.js';
import { recarregarTarefas } from './main.js';

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

async function filtrarPorStatusOuDatas(status, dataInicio, dataFim) {
    if (!status && !dataInicio && !dataFim) {
        toastr.error("Informe um status ou um período de datas para filtrar!", "Erro");
        return null;
    }

    let tarefas = status 
        ? await filtroPorStatus(status) 
        : tarefasSubject.getValue();

    if (!tarefas) {
        toastr.error("Erro ao carregar as tarefas!", "Erro");
        return null;
    }

    if (dataInicio && dataFim) {
        if (!validarIntervaloDatas(dataInicio, dataFim)) {
            toastr.error("Informe uma data de início e fim válidas!", "Erro");
            return null;
        }
        tarefas = tarefas.filter(t => moment(t.data).isBetween(dataInicio, dataFim, undefined, '[]'));
    }

    return tarefas;
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

export function setarEventoOrdenacao(sortOption) {
    const selecOrdenarEl  = $('#ordenar');
    selecOrdenarEl.change(() => {
        const val = selecOrdenarEl.val();
        sortOption.next(val);
    });
}
 // MESSAGE HANDLER
export function handleActionResult({ ok, successMsg, errorMsg, reload = true }) {
    if (!ok) {
        toastr.error(errorMsg, "Erro");
        return false;
    }
    toastr.success(successMsg);
    if (reload) recarregarTarefas();
    return true;
}