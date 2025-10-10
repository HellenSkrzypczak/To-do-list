export function validarCamposObrigatorios({ titulo, descricao, data }) {
    return titulo?.trim() && descricao?.trim() && data?.trim();
}

export function validarData(data) {
    return moment(data, "YYYY-MM-DD", true).isValid();
}

export function validarIntervaloDatas(dataInicio, dataFim) {
    if (!validarData(dataInicio) || !validarData(dataFim)) return false;
    return moment(dataInicio).isSameOrBefore(moment(dataFim));
}
