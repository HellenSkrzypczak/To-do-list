import { renderizarTarefas } from './main.js';
import { criarTarefa, pegarTarefas } from './tarefas.js';

export function limparCampos(){
    $('#inputTitulo').val("");
    $('#inputDescricao').val("");
    $('#inputData').val("");
}

export function inicializarCadastro(listaTarefasEl) {
    $('#btnCadastrar').click(async () => {
        const inputTitulo = $('#inputTitulo').val();
        const inputDescricao = $('#inputDescricao').val();
        const inputData = $('#inputData').val();
        const status = "pendente";

        const campos = validacaoCampos(inputTitulo, inputDescricao, inputData)
        if (!campos) return toastr.error("Preencha todos os campos!", "ERRO")

        const data = validacaoData(inputData)
        if (!data) return toastr.error("Data inválida!", "ERRO")
        
        
        const tarefasAtualizadas = await criarTarefa(inputTitulo, inputDescricao, data, status);
        if (!tarefasAtualizadas) return toastr.error("Erro ao carregar as tarefas!", "ERRO");

        const tarefas = await pegarTarefas();
        renderizarTarefas(tarefas, listaTarefasEl);
        limparCampos();
        toastr.success("Cadastrado com sucesso!");        
    });
}

export function validacaoData(data) {
    const anoAtual = moment().startOf("year");
    const dataValidada = moment(data, "YYYY-MM-DD", true);

    if (dataValidada.isSameOrAfter(anoAtual) && dataValidada.isValid()) {
        return dataValidada.format("YYYY-MM-DD");

    } else {
        return null;
    } 
}

export function validacaoCampos(titulo, descricao, data){
    return !!(titulo && descricao && data)
}

export function filtrarPorData(filtradas, dataI, dataF){
    if (!dataI || !dataF) return filtradas;

    return filtradas.filter(tarefa => {
        const dataTarefa = moment(tarefa.data, "YYYY-MM-DD");
        return dataTarefa.isBetween(dataI, dataF, undefined, '[]');
    });
}
