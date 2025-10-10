import { validarCamposObrigatorios, validarData } from './validacoes.js';
import { editarTarefa } from './tarefas/tarefas.js';
import { handleActionResult } from './eventHandlers.js';

export function abrirModalEditar(tarefa) {
    const modal = document.getElementById("modalEditar");

    $("#modalTitulo").val(tarefa.titulo);
    $("#modalDescricao").val(tarefa.descricao);
    $("#modalData").val(moment(tarefa.data).format("YYYY-MM-DD"));
    $("#modalStatus").val(tarefa.status);

    modal.showModal();
    botoesModalEditar(modal, tarefa); 
}

function botoesModalEditar(modal, tarefa) {
    $("#btnConfirmar").off("click").on("click", async function(e) {
        e.preventDefault(); 

        const titulo = $("#modalTitulo").val();
        const descricao = $("#modalDescricao").val();
        const data = $("#modalData").val();
        const status = $("#modalStatus").val();
        
        if (!validarCamposObrigatorios({ titulo, descricao, data })) {
            return toastr.error("Preencha todos os campos obrigatórios!", "ERRO");
        }

        if (!validarData(data)) {
            return toastr.error("Data inválida!", "ERRO");
        }

        const novaTarefa = await editarTarefa(tarefa.id, titulo, descricao, data, status);
        const ok = handleActionResult({
            ok: novaTarefa,
            successMsg: "Tarefa editada com sucesso!",
            errorMsg: "Erro ao editar tarefa!"
        });

        if (ok) modal.close();
    });

    $("#btnCancelar").off("click").on("click", function(e) {
        e.preventDefault();
        handleActionResult({
            ok: true,
            successMsg: "Edição cancelada!",
            errorMsg: "Erro ao cancelar edição!"
        });
        modal.close();
    });
}