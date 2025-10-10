import { NoSort, SortByDateAsc, SortByDateDesc, SortByTitleAsc, SortByTitleDesc, SortByStatus } from './ordenacaoStrategy.js';

export function ordenarTarefas(ordenacaoContext, sortOption, tarefas) {
    switch(sortOption) {
        case 'data-asc': ordenacaoContext.setStrategy(new SortByDateAsc()); break;
        case 'data-desc': ordenacaoContext.setStrategy(new SortByDateDesc()); break;
        case 'titulo-asc': ordenacaoContext.setStrategy(new SortByTitleAsc()); break;
        case 'titulo-desc': ordenacaoContext.setStrategy(new SortByTitleDesc()); break;
        case 'status': ordenacaoContext.setStrategy(new SortByStatus()); break;
        default: ordenacaoContext.setStrategy(new NoSort());
    }
    return ordenacaoContext.ordenar(tarefas);
}