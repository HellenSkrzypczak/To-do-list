# 📌 Gerenciamento de Tarefas

Um sistema simples para **cadastrar, editar, remover e filtrar tarefas**, desenvolvido em **HTML, CSS e JavaScript (com jQuery)**.  
O backend é simulado utilizando o [json-server](https://github.com/typicode/json-server).  

---

## 🚀 Pré-requisitos

Antes de rodar o projeto, você precisa ter instalado:

- [Node.js](https://nodejs.org/) (inclui npm)  
- [json-server](https://github.com/typicode/json-server)  

Instale o json-server globalmente com:

```bash
    npm install -g json-server
```

## ▶️ Como Executar o Projeto

1. Clone este repositório:

```bash
    git clone https://github.com/HellenSkrzypczak/To-do-list.git
    cd To-do-list
```

2. Inicie o servidor fake com o arquivo db.json:

```bash
    json-server --watch db.json --port 3000
```
O servidor estará disponível em http://localhost:3000.

3. Abra o arquivo index.html diretamente no navegador

## 📦 Bibliotecas Utilizadas
As seguintes bibliotecas são carregadas via CDN no arquivo index.html:

- [jQuery]
- [Moment.js]
- [Toastr]
- [jQuery Confirm]
- [Line Awesome]

⚠️ É necessário estar conectado à internet para que as bibliotecas sejam carregadas.

## 🛠️ Funcionalidades

- ✅ Cadastrar novas tarefas
- ✏️ Editar tarefas existentes
- 🗑️ Remover tarefas
- 🔎 Filtrar tarefas por status e intervalo de datas
- 🔔 Notificações com Toastr
- ✅ Confirmações com jQuery Confirm

## 📂 Estrutura do Projeto

```bash
📁 projeto
│── index.html       # Página principal
│── style.css        # Estilos
│── main.js          # Script principal (módulos ES6)
│── cadastro.js      # Lógica de cadastro de tarefas
│── tarefas.js       # Operações de edição, remoção e listagem
│── db.json          # Banco fake usado pelo json-server
```

## 📌 Observações
Todas as alterações (cadastro, edição, exclusão) são refletidas no arquivo db.json.
