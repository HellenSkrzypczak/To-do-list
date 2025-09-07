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

        data = validacaoData(inputData);

        tarefas.push({
            titulo: inputTitulo, 
            descricao: inputDescricao,
            data: data, 
            status: "pendente"  
        });

        renderizarTarefas(tarefas);        
    });

    function validacaoData(data) {
        const anoAtual = moment().startOf("year");
        const dataValidada = moment(data, "YYYY-MM-DD", true);

        if (dataValidada.isSameOrAfter(anoAtual) && dataValidada.isValid()) {
            return dataValidada;

        } else {
            //alert("Data inválida!");
            return false;
        }
        
    }

    function renderizarTarefas(lista) {
        limparCampos();
        $('#lista-tarefas').empty();

        lista.forEach((tarefa) => {
            const li = $(`
                <li class="tarefa">
                    <div class="div-header">
                        <div class="div-titulo"><h3 class="titulo"><strong>${tarefa.titulo}</strong></h3></div>
            
                        <div class="div-data-section-btn">
                            <div class="div-data">
                                <p class="text">${moment(tarefa.data, "YYYY-MM-DD").format("DD/MM/YYYY")}</p>
                            </div>
                            <div>
                                <select class="input-status">
                                    <option value="pendente"  ${tarefa.status === "pendente"  ? "selected" : ""}>Pendente</option>
                                    <option value="andamento" ${tarefa.status === "andamento" ? "selected" : ""}>Em andamento</option>
                                    <option value="concluida" ${tarefa.status === "concluida" ? "selected" : ""}>Concluída</option>
                                </select>
                            </div>
            
                            <div class="div-btn">
                                <button id="btnEditar" data-modal="modal" class="btnTarefa"><i class="las la-pencil-alt"></i></button>
                                <button id="btnExcluir" class="btnTarefa"><i class="las la-trash"></i></button>
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

    function filtrarPorData(filtradas, dataI, dataF){
        if (!dataI || !dataF) return filtradas;

        return filtradas.filter(tarefa => {
            const dataTarefa = moment(tarefa.data, "YYYY-MM-DD");
            return dataTarefa.isBetween(dataI, dataF, undefined, '[]');
        });
    }

    function fitrarPorStatus(filtradas, status){
        if(!status) return filtradas;

        return filtradas.filter(tarefa => tarefa.status === status);
        
    };

    function limparCampos(){
        $('#inputTitulo').val("");
        $('#inputDescricao').val("");
        $('#inputData').val("");
        $('#inpDataInicio').val("");
        $('#inpDataFim').val("");
        $('#status').val("");
    }

    $('#lista-tarefas').on('click', '#btnEditar', function() {
        const index = $(this).closest('.tarefa').index();
        const tarefa = tarefas[index];

        const modal = document.getElementById("modalEditar");
        
        $("#modalTitulo").val(tarefa.titulo);
        $("#modalDescricao").val(tarefa.descricao);
        $("#modalData").val(moment(tarefa.data, "YYYY-MM-DD").format("YYYY-MM-DD"));
        $("#modalStatus").val(tarefa.status);

        modal.showModal();

        // Remove eventos anteriores para evitar duplicação
        $("#btnConfirmar").off("click").on("click", function(e) {
            e.preventDefault(); // previne comportamento padrão do form

            // Atualiza os dados da tarefa
            tarefa.titulo = $("#modalTitulo").val();
            tarefa.descricao = $("#modalDescricao").val();
            tarefa.data = $("#modalData").val();
            tarefa.status = $("#modalStatus").val();

            modal.close();       // fecha o modal
            renderizarTarefas(tarefas); // atualiza a lista
            alert("Tarefa atualizada!");
        });

        $("#btnCancelar").off("click").on("click", function(e) {
            e.preventDefault();
            alert("Edição cancelada!");
            modal.close(); // apenas fecha
        });
    });

    

    $('#lista-tarefas').on('click', '#btnExcluir', function() {
        const resposta = confirm("Tem certeza que deseja excluir?");
        if (!resposta) { return; } 

        tarefas.splice($(this).closest('.tarefa').index());
        renderizarTarefas();
    });

    $('#lista-tarefas').on('change', '.input-status', function() {  
       const index = $(this).closest('.tarefa').index();
       novoStatus = $(this).val();
       tarefas[index].status = novoStatus; 
    });
    

    $('#btnFiltrar').click(() => {
        const status = $('#status').val();
        const dataInicio = validacaoData($('#inpDataInicio').val());
        const dataFim = validacaoData($('#inpDataFim').val());
        
        if (!status && !dataInicio && !dataFim) {
            alert("Informe status ou data para filtrar!")
            renderizarTarefas(tarefas);
        }
        
        let filtradas = tarefas;
        filtradas = fitrarPorStatus(filtradas, status);
        filtradas = filtrarPorData(filtradas, dataInicio, dataFim);

        renderizarTarefas(filtradas);
    });

    $('#btnLimparFiltro').click(() => {
        renderizarTarefas(tarefas);
    })
});