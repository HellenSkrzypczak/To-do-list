export function validarCamposObrigatorios({ titulo, descricao, data }) {
    return titulo?.trim() && descricao?.trim() && data?.trim();
}

export function validarData(data) {
    const anoAtual = moment().startOf("year");
    const dataValidada = moment(data, "YYYY-MM-DD", true);

    if (dataValidada.isSameOrAfter(anoAtual) && dataValidada.isValid()) {
        return dataValidada.format("YYYY-MM-DD");

    } else {
        return null;
    } 
}

export function validarIntervaloDatas(dataInicio, dataFim) {
    if (!validarData(dataInicio) || !validarData(dataFim)) return false;
    return moment(dataInicio).isSameOrBefore(moment(dataFim));
}
