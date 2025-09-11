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

        if(!inputTitulo || !inputDescricao || !inputData)
        {
            return toastr.error("Preencha todos os campos!", "ERRO")
        }

        const data = validacaoData(inputData)
        if (!data){
            return toastr.error("Data invalida!", "ERRO");
        }

        const tarefasAtualizadas = await criarTarefa(inputTitulo, inputDescricao, data, status);
        if (tarefasAtualizadas) {
            const tarefas = await pegarTarefas();
            renderizarTarefas(tarefas, listaTarefasEl);
            limparCampos()
            return toastr.success("Cadastrado com sucesso!");    
        }     
        else { return toastr.error("Erro ao carregar as tarefas!", "ERRO") } 
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

export function filtrarPorData(filtradas, dataI, dataF){
    if (!dataI || !dataF) return filtradas;

    return filtradas.filter(tarefa => {
        const dataTarefa = moment(tarefa.data, "YYYY-MM-DD");
        return dataTarefa.isBetween(dataI, dataF, undefined, '[]');
    });
}
