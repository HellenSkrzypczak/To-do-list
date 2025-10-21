import { filtroPorStatus } from "./tarefas.js";
import { validarIntervaloDatas } from "../validacoes.js";

export function configurarFiltro({ btnFiltrarEl, tarefasSubject, recarregarTarefas }) {
    setarEventoAcaoFiltrarTarefa(btnFiltrarEl, tarefasSubject);
    limparFiltro({ recarregarTarefas });
}

function setarEventoAcaoFiltrarTarefa(btnFiltrarEl, tarefasSubject) {
    btnFiltrarEl.click(async () => {
        const status = $('#status').val();
        const dataInicio = $('#inpDataInicio').val();
        const dataFim = $('#inpDataFim').val();

        const tarefas = await filtrarPorStatusOuDatas(status, dataInicio, dataFim);
        if (tarefas) tarefasSubject.next(tarefas);
    });
}

async function filtrarPorStatusOuDatas(status, dataInicio, dataFim, tarefasSubject) {
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

export function limparFiltro({ recarregarTarefas }) {
    $('#btnLimparFiltro').click(() => {
        recarregarTarefas();
        $('#status, #inpDataInicio, #inpDataFim').val("");
    });
}