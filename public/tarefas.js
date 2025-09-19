import { tarefasSubject } from "./tarefasSubject.js";

const URL = 'http://localhost:3000/tarefas';

export async function pegarTarefas() {
    try{
        const response = await fetch(URL);
        const tarefas = await response.json();
        tarefasSubject.next(tarefas);
        return tarefas;
    } catch(error){
        console.log(error);
        return null
    };
}

export async function criarTarefa(titulo, descricao, data, status) {   
    try {
        const response = await fetch(URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ titulo, descricao, data, status })
        });
        if (response.ok){
            const responseTarefas = await fetch(URL);
            const tarefasAtualizadas = await responseTarefas.json();
            tarefasSubject.next(tarefasAtualizadas);
            return true;
        }
        return false;
    } catch(error) {
        console.log(error);
        return false
    }
}

export async function editarTarefa(id, titulo, descricao, data, status) {
    try{
        const response = await fetch(`${URL}/${id}`, {
            method: "PATCH",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({titulo, descricao, data, status})
        });
        if (response.ok){
            const responseTarefas = await fetch(URL);
            const tarefasAtualizadas = await responseTarefas.json();
            tarefasSubject.next(tarefasAtualizadas);
            return true;
        }
        return false;
    } catch(error){
        console.log(error);
        return false
    }
}

export async function removerTarefa(id) {
    try{
        const response = await fetch(`${URL}/${id}`, { method: "DELETE" });
        if (response.ok){
            const responseTarefas = await fetch(URL);
            const tarefasAtualizadas = await responseTarefas.json();
            tarefasSubject.next(tarefasAtualizadas);
            return true;
        }
        return false;
    } catch(error){
        console.log(error);
        return false
    }
}

export async function filtroPorStatus(status) {
    try {
        const response = await fetch(`${URL}?status=${status}`);
        const tarefasFiltro = await response.json();
        return tarefasFiltro
    } catch(error){
        console.log(error);
        return false
    };
}

export async function mudarStatusTarefa(id, status) {
    try {
        const response = await fetch(`${URL}/${id}`, {
            method: "PATCH",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({status})
        });
        if (response.ok){
            const responseTarefas = await fetch(URL);
            const tarefasAtualizadas = await responseTarefas.json();
            tarefasSubject.next(tarefasAtualizadas);
            return true;
        }
        return false;
    } catch(error){
        console.log(error);
        return false
    }
}