const url = 'http://localhost:3000/tarefas';
let  tarefas = [];

export { tarefas };

export async function pegarTarefas() {
    try {
        const response = await fetch(url);
        tarefas = await response.json();
        return tarefas;
    } catch(error){
        console.log(error);
    };
}

export async function criarTarefa(titulo, descricao, data, status) {   
    try {
        await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ titulo, descricao, data, status })
        });
        return pegarTarefas();
    }catch (error) {
        console.log(error);
    }
}

export async function editarTarefa(id, dados) {
    try{
        await fetch(`${url}/${id}`, {
            method: "PATCH",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        });
        return pegarTarefas();
    }catch(erro){
        console.log(error);
    }
}

export async function removerTarefa(id) {
    try{
        await fetch(`${url}/${id}`, { method: "DELETE" });
        return pegarTarefas();
    }catch(erro){
        console.log(error);
    }
}




