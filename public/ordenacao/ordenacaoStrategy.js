class SortStrategy {
    ordenar(tarefas) { return tarefas; }
}

export class NoSort extends SortStrategy{
    ordenar(tarefas){
        return Array.isArray(tarefas) ? tarefas.slice() : tarefas;
    }
}

export class SortByDateAsc extends SortStrategy{
    ordenar(tarefas) {
        return tarefas.toSorted((a,b) => new Date(a.data) - new Date(b.data));
    }
}

export class SortByDateDesc extends SortStrategy{
    ordenar(tarefas) {
        return tarefas.toSorted((a,b) => new Date(b.data) - new Date(a.data));
    }
}

export class SortByTitleAsc extends SortStrategy{
    ordenar(tarefas){
        return tarefas.toSorted((a,b) => (a.titulo || '').localeCompare(b.titulo || '') );
    }
}

export class SortByTitleDesc extends SortStrategy{
    ordenar(tarefas) {
        return tarefas.toSorted((a,b) => (b.titulo || '').localeCompare(a.titulo || '') );
    }
}

export class SortByStatus extends SortStrategy {
    ordenar(tarefas) {
        const order = { pendente: 0, andamento: 1, concluida: 2};
        return tarefas.toSorted((a,b) => (order[a.status] ?? 99) - (order[b.status] ?? 99))
    }
}

export class OrdenacaoContext {
    constructor(strategy = new NoSort()) {
        this.strategy = strategy;
    }
    setStrategy(strategy) {
        this.strategy = strategy;
    }
    ordenar(tarefas) {
        return this.strategy.ordenar(tarefas);
    }
}