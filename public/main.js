import { pegarTarefas } from './tarefas/tarefas.js';
import { inicializarCadastro } from './tarefas/cadastro.js';
import { tarefasSubject } from './tarefas/tarefasSubject.js';
import { OrdenacaoContext, NoSort } from './ordenacao/ordenacaoStrategy.js';
import { ordenarTarefas } from './ordenacao/ordenarTarefas.js';
import { renderizarTarefas } from './tarefas/renderTarefas.js';
import { setarEventoAcaoEditar, setarEventoAcaoExcluirTarefa, setarEventoAcaoAlterarStatusTarefa, setarEventoAcaoFiltrarTarefa, limparFiltro, setarEventoOrdenacao } from './eventHandlers.js';

async function main() {
    const listaTarefasEl = $('#lista-tarefas');
    const btnFiltrarEl = $('#btnFiltrar');
    const ordenacaoContext = new OrdenacaoContext(new NoSort());
    const sortOption = new rxjs.BehaviorSubject('');

    rxjs.combineLatest([sortOption, tarefasSubject])
        .subscribe(([activeSort, tarefas]) => {
            const tarefasOrdenadas = ordenarTarefas(ordenacaoContext, activeSort, tarefas); 
            renderizarTarefas(tarefasOrdenadas, listaTarefasEl);
        });
        
    await recarregarTarefas();
    await inicializarCadastro(listaTarefasEl);
    setarEventoAcaoEditar(listaTarefasEl);
    setarEventoAcaoExcluirTarefa(listaTarefasEl);
    setarEventoAcaoAlterarStatusTarefa(listaTarefasEl);
    setarEventoAcaoFiltrarTarefa(btnFiltrarEl);
    setarEventoOrdenacao(sortOption);
    limparFiltro();
}

export async function recarregarTarefas() {
    try {
        const tarefas = await pegarTarefas();
        if (!tarefas) {
            toastr.error("Erro ao carregar tarefas!", "ERRO");
            return;
        }
        tarefasSubject.next(tarefas);
    } catch (err) {
        console.error(err);
        toastr.error("Erro inesperado ao carregar tarefas!", "ERRO");
    }
}

main();