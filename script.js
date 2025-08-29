$(document).ready(function() {
    $('#btnCadastrar').click(() => {
        const inputTitulo = $('#inputTitulo').val();
        const inputDescricao = $('#inputDescricao').val();
        const inputData = $('#inputData').val();

        const data = moment(inputData, "YYYY-MM-DD");
        if (!data.isValid()) {
            alert("Data inválida!")
             return;
        }


        if(!inputTitulo || !inputDescricao)
        {
            alert("Preencha todos os campos!")
            return;
        }

        const li = $(`
            <li class="tarefa">
                <div class="div-tarefa-descri">
                    <span class="tarefa-titulo"><strong>${inputTitulo}</strong></span>
                    <span class="tarefa-descricao">${inputDescricao}</span>
                </div>

                <div class="div-tarefa">
                    <div class="div-data">
                        <span>${data.format("DD/MM/YYYY")}</span>
                    </div>
                    <div>
                        <select id="status-tarefa" name="status">
                            <option value="pendente">Pendente</option>
                            <option value="andamento">Em andamento</option>
                            <option value="concluida">Concluída</option>
                        </select>
                    </div>
                    
                    <button class="btnEditar"><img src="https://img.icons8.com/?size=100&id=71201&format=png&color=B8B8B8" alt="editar" class="btnImg"></button>
                    <button class="btnExcluir"><img src="https://img.icons8.com/?size=100&id=68064&format=png&color=B8B8B8" alt="excluir" class="btnImg"></button>
                </div>
                

            </li>
        `);
        
        $('#lista-tarefas').append(li);
        limparCampos();
    });

    function limparCampos(){
        $('#inputTitulo').val("");
        $('#inputDescricao').val("");
        $('#inputData').val("");
    }
});