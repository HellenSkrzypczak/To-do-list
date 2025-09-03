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
                <div class="div-header">
                    <div class="div-titulo"><label class="titulo"><strong>${inputTitulo}</strong></label></div>
                
                    <div class="div-data-section-btn">
                        <div class="div-data">
                            <p class="text">${data.format("DD/MM/YYYY")}</p>
                        </div>
                        <div>
                            <select id="status-tarefa" class="input-status">
                                <option value="pendente">Pendente</option>
                                <option value="andamento">Em andamento</option>
                                <option value="concluida">Concluída</option>
                            </select>
                        </div>
                        
                        <div class="div-btn">
                            <button id="btnEditar" class="btnTarefa"><i class="las la-pencil-alt"></i></button>
                            <button id="btnExcluir" class="btnTarefa"><i class="las la-trash"></i></button>
                        </div>
                    </div>
                </div>
                <div class="div-descricao">
                    <p class="tarefa-descricao">${inputDescricao}</p>
                </div>
            </li>
        `);
        
        $('#lista-tarefas').append(li);
        limparCampos();
    });

    $('#btnEditar').click(() => {

    });

    function limparCampos(){
        $('#inputTitulo').val("");
        $('#inputDescricao').val("");
        $('#inputData').val("");
    }
});