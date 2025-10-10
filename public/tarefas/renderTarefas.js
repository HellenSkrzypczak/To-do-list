export function renderizarTarefas(lista, listaTarefasEl) {
    listaTarefasEl.empty();

    lista.forEach((tarefa) => {
        const li = $(`
            <li class="tarefa" data-id="${tarefa.id}">
                <div class="tarefa__header">
                    <div><h3><strong>${tarefa.titulo}</strong></h3></div>
        
                    <div class="tarefa__fields">
                        <div>
                            <p>${moment(tarefa.data, "YYYY-MM-DD").format("DD/MM/YYYY")}</p>
                        </div>
                        <div>
                            <select class="tarefa__status">
                                <option value="pendente"  ${tarefa.status === "pendente"  ? "selected" : "" }>Pendente</option>
                                <option value="andamento" ${tarefa.status === "andamento" ? "selected" : ""}>Em andamento</option>
                                <option value="concluida" ${tarefa.status === "concluida" ? "selected" : ""}>Concluída</option>
                            </select>
                        </div>
        
                        <div class="tarefa__actions">
                            <button class="btnEditar btn btn--icon" title="Editar"><i class="las la-pencil-alt"></i></button>
                            <button class="btnExcluir btn btn--icon" title="Excluir"><i class="las la-trash"></i></button>
                        </div>
                    </div>
                </div>
                <div>
                    <p class="tarefa__descricao">${tarefa.descricao}</p>
                </div>
            </li>
        `);

        listaTarefasEl.append(li);
    });
}