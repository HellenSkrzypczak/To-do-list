import { filtroPorStatus } from "./tarefas.js";
import { validarIntervaloDatas } from "../validacoes.js";


export async function filtrarPorStatusOuDatas(status, dataInicio, dataFim) {
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