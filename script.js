$(document).ready(function() {
    let tarefas = [];

    $('#btnCadastrar').click(() => {
        const inputTitulo = $('#inputTitulo').val();
        const inputDescricao = $('#inputDescricao').val();
        const inputData = $('#inputData').val();
        
        if(!inputTitulo || !inputDescricao || !inputData)
        {
            alert("Preencha todos os campos!")
            return;
        }
        const data = moment(inputData, "YYYY-MM-DD");
        if (!data.isValid()) { alert("Data inválida!"); return; }

        tarefas.push({
            titulo: inputTitulo, 
            descricao: inputDescricao,
            data: data, 
            status: "pendente"  
        });

        renderizarTarefas(tarefas);  
              
    });

    function renderizarTarefas(lista) {
        limparCampos();
        $('#lista-tarefas').empty();

        lista.forEach((tarefa) => {
            const li = $(`
                <li class="tarefa">
                    <div class="div-header">
                        <div class="div-titulo"><label class="titulo"><strong>${tarefa.titulo}</strong></label></div>
            
                        <div class="div-data-section-btn">
                            <div class="div-data">
                                <p class="text">${tarefa.data.format("DD/MM/YYYY")}</p>
                            </div>
                            <div>
                                <select class="input-status" data-index="${index}>
                                    <option value="pendente"  ${tarefa.status === "pendente"  ? "selected" : ""}>Pendente</option>
                                    <option value="andamento" ${tarefa.status === "andamento" ? "selected" : ""}>Em andamento</option>
                                    <option value="concluida" ${tarefa.status === "concluida" ? "selected" : ""}>Concluída</option>
                                </select>
                            </div>
            
                            <div class="div-btn">
                                <button class="btnTarefa"><i class="las la-pencil-alt"></i></button>
                                <button class="btnTarefa"><i class="las la-trash"></i></button>
                            </div>
                        </div>
                    </div>
                    <div class="div-descricao">
                        <p class="tarefa-descricao">${tarefa.descricao}</p>
                    </div>
                </li>
            `);

            $('#lista-tarefas').append(li);
        });
        
    }

    function fitraPorStatus(status){
        const filtradas = tarefas.filter(tarefa => tarefa.status === status);
        renderizarTarefas(filtradas);
    };

    function limparCampos(){
        $('#inputTitulo').val("");
        $('#inputDescricao').val("");
        $('#inputData').val("");
        //
    }

    $('#lista-tarefas').on('change', '.input-status', function() {  
       const index = $(this).data(index);
       tarefas[index].status = $(this).val();
        
    });
    
    $('#btnFiltrar').click(() => {
        const status = $('#status').val();
    
        if(!status) {
            renderizarTarefas(tarefas);
        } else{
            fitraPorStatus(status);
        }
    });
});