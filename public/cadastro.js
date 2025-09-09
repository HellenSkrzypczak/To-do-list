import { criarTarefa } from './tarefas.js';
//import moment from 'moment';

export function validacaoData(data) {
    const anoAtual = moment().startOf("year");
    const dataValidada = moment(data, "YYYY-MM-DD", true);

    if (dataValidada.isSameOrAfter(anoAtual) && dataValidada.isValid()) {
        return dataValidada.format("YYYY-MM-DD");

    } else {
        return null;
    } 
}

export function inicializarCadastro() {
    $('#btnCadastrar').click(async () => {
    const inputTitulo = $('#inputTitulo').val();
    const inputDescricao = $('#inputDescricao').val();
    const inputData = $('#inputData').val();
    const status = "pendente";

    if(!inputTitulo || !inputDescricao || !inputData)
    {
        alert("Preencha todos os campos!")
        return;
    }

    const data = validacaoData(inputData)
    if (!data) return;

    await criarTarefa(inputTitulo, inputDescricao, data, status);     
    limparCampos();   
    });
}

export function limparCampos(){
    $('#inputTitulo').val("");
    $('#inputDescricao').val("");
    $('#inputData').val("");
}

export function filtrarPorData(filtradas, dataI, dataF){
    if (!dataI || !dataF) return filtradas;

    return filtradas.filter(tarefa => {
        const dataTarefa = moment(tarefa.data, "YYYY-MM-DD");
        return dataTarefa.isBetween(dataI, dataF, undefined, '[]');
    });
}

export function fitrarPorStatus(filtradas, status){
    if(!status) return filtradas;

    return filtradas.filter(tarefa => tarefa.status === status);
    
}