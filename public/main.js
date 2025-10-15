import { inicializarCadastro } from './tarefas/cadastro.js';
import { tarefasSubject } from './tarefas/tarefasSubject.js';
import { configurarListaTarefas } from './tarefas/listaTarefas.js';
import { filtroPorStatus } from './tarefas/tarefas.js';
import { recarregarTarefas } from './tarefas/listaTarefas.js';


function main() {
  const listaTarefasEl = $("#lista-tarefas");
  const btnFiltrarEl = $("#btnFiltrar");
  const selectOrdenarEl = $("#ordenar");

  inicializarCadastro(listaTarefasEl);

  configurarListaTarefas({
    listaTarefasEl,
    selectOrdenarEl,
    btnFiltrarEl,
    tarefasSubject,
    recarregarTarefas,
    filtroPorStatus
  });

  recarregarTarefas();
}


main();