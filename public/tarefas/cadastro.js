import { criarTarefa } from './tarefas.js';
import {recarregarTarefas} from '../main.js';
import { validarCamposObrigatorios, validarData } from '../validacoes.js';

export function limparCampos(){
    $('#inputTitulo').val("");
    $('#inputDescricao').val("");
    $('#inputData').val("");
}

export function inicializarCadastro() {
    $('#btnCadastrar').click(async () => {
        const titulo = $('#inputTitulo').val();
        const descricao = $('#inputDescricao').val();
        const valorData = $('#inputData').val();
        const status = "pendente";

        if (!validarCamposObrigatorios({ titulo, descricao, data: valorData })) return toastr.error("Preencha todos os campos!", "ERRO")

        const data = validarData(valorData);
        if (!data) return toastr.error("Data inválida!", "ERRO");
        
        
        const tarefasAtualizadas = await criarTarefa(titulo, descricao, data, status);
        if (!tarefasAtualizadas) return toastr.error("Erro ao criar a tarefa. Tente novamente.", "ERRO");
        await recarregarTarefas();

        limparCampos();   
        toastr.success("Tarefa criada com sucesso!");     
    });
}
