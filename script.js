$(document).ready(function() {
    let  tarefas = [];
    const url = 'http://localhost:3000/tarefas';

    async function pegarTarefas() {
        try {
            const response = await fetch(url);
            tarefas = await response.json();
            renderizarTarefas(tarefas);
        } catch(error){
            console.log(error);
        };
    }
    pegarTarefas();

    async function criarTarefa(titulo, descricao, data, status) {   
        await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ titulo, descricao, data, status })
        });
    
        renderizarTarefas();
    }

    async function editarTarefa(id, dados) {
        try{
            await fetch(`${url}/${id}`, {
                method: "PATCH",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dados)
            });
        } catch(erro){
            console.log(error);
        }
    }

    async function removerTarefa(id) {
        try{
            await fetch(`${url}/${id}`, { method: "DELETE" });
        } catch(erro){
            console.log(error);
        }
    }

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

        const data = validacaoData(inputData);
        criarTarefa(inputTitulo, inputDescricao, data, status);        
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
                <li class="tarefa" data-id="${tarefa.id}">
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
        console.log(lista);
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
            e.preventDefault(); 

            editarTarefa(tarefa.id, {
                titulo: $("#modalTitulo").val(),
                descricao: $("#modalDescricao").val(),
                data: $("#modalData").val(),
                status: $("#modalStatus").val()
            });

            modal.close(); 
        });

        $("#btnCancelar").off("click").on("click", function(e) {
            e.preventDefault();
            modal.close();
        });
    });

    $('#lista-tarefas').on('click', '#btnExcluir', function() {
        const resposta = confirm("Tem certeza que deseja excluir?");
        if (!resposta) { return; } 

        const id = $(this).closest('.tarefa').data('id');
        removerTarefa(id);
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