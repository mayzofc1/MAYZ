// Variáveis
const btnAdicionarTarefa = document.querySelector('.app__button--add-task');
const formAdicionarTarefa = document.querySelector('.app__form-add-task');
const textArea = document.querySelector('.app__form-textarea');
const ulTarefas = document.querySelector('.app__section-task-list');
const paragrafoDescricaoTarefa = document.querySelector('.app__section-active-task-description');
const btnCancelar = document.querySelector('.app__form-footer__button--cancel');
const btnDelete = document.querySelector('.app__form-footer__button--delete');
const btnRemoverConcluidas = document.getElementById('btn-remover-concluidas');
const btnRemoverTodas = document.getElementById('btn-remover-todas');

// Recupera tarefas do localStorage ou cria array vazio
let tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];
let tarefaSelecionada = null;
let liTarefaSelecionada = null;

// Cria elemento visual na tela
function criarElementoTarefa(tarefa) {
    const li = document.createElement('li');
    li.classList.add('app__section-task-list-item');

    const svg = document.createElement('svg');
    svg.innerHTML = `
        <svg class="app__section-task-icon-status" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="12" fill="#FFF"></circle>
            <path d="M9 16.1719L19.5938 5.57812L21 6.98438L9 18.9844L3.42188 13.4062L4.82812 12L9 16.1719Z" fill="#01080E"></path>
        </svg>
    `;

    const paragrafo = document.createElement('p');
    paragrafo.classList.add('app__section-task-list-item-description');
    paragrafo.textContent = tarefa.descricao;

    const button = document.createElement('button');
    button.classList.add('app_button-edit');

    const imagemButton = document.createElement('img');
    imagemButton.setAttribute('src', './imagens/edit.png');
    button.append(imagemButton);

    button.onclick = () => {
        const novoNome = prompt("Qual é o novo nome da tarefa?");
        if (novoNome) {
            // Atualiza o texto no parágrafo
            const nomeFormatado = novoNome.trim().charAt(0).toUpperCase() + novoNome.trim().slice(1);
            paragrafo.textContent = nomeFormatado;

            // Atualiza no array e no localStorage
            tarefa.descricao = nomeFormatado;
            localStorage.setItem('tarefas', JSON.stringify(tarefas));
        }
    };

    li.append(svg);
    li.append(paragrafo);
    li.append(button);

    if (tarefa.completa) {
        li.classList.add('app__section-task-list-item-complete');
        button.setAttribute('disabled', 'disabled');
    } else {
        li.onclick = () => {
            document.querySelectorAll('.app__section-task-list-item-active')
                .forEach(element => {
                    element.classList.remove('app__section-task-list-item-active');
                });
            if(tarefaSelecionada == tarefa) {
                paragrafoDescricaoTarefa.textContent = '';
                tarefaSelecionada = null;
                liTarefaSelecionada = null;
                return;
                }
            tarefaSelecionada = tarefa;
            liTarefaSelecionada = li;
            paragrafoDescricaoTarefa.textContent = tarefa.descricao;
            li.classList.add('app__section-task-list-item-active');
        }
    }

    return li;
}

// Mostra/oculta o formulário
btnAdicionarTarefa.addEventListener('click', () => {
    formAdicionarTarefa.classList.toggle('hidden');
});

btnCancelar.addEventListener('click', () => {
    formAdicionarTarefa.classList.toggle('hidden');
});

btnDelete.addEventListener('click', () => {
    formAdicionarTarefa.classList.toggle('hidden');
    textArea.value = '';
});



// Adiciona nova tarefa
formAdicionarTarefa.addEventListener('submit', (event) => {
    event.preventDefault();

    const descricaoFormatada = textArea.value.trim().charAt(0).toUpperCase() + textArea.value.trim().slice(1);

    const tarefa = {
        descricao: descricaoFormatada,
    };

    tarefas.push(tarefa);
    const elementoTarefa = criarElementoTarefa(tarefa);
    ulTarefas.append(elementoTarefa);

    localStorage.setItem('tarefas', JSON.stringify(tarefas));

    textArea.value = '';
    formAdicionarTarefa.classList.add('hidden');
});

function atualizarTarefa() {
    localStorage.setItem('tarefas', JSON.stringify(tarefas));
}

// Carrega tarefas salvas
tarefas.forEach(tarefa => {
    const elementoTarefa = criarElementoTarefa(tarefa);
    ulTarefas.append(elementoTarefa);
});

document.addEventListener('FocoFinalizado', () => {
    if(tarefaSelecionada && liTarefaSelecionada) {
        liTarefaSelecionada.classList.remove('app__section-task-list-item-active');
        liTarefaSelecionada.classList.add('app__section-task-list-item-complete');
        liTarefaSelecionada.querySelector('button').setAttribute('disabled', 'disabled');
        tarefaSelecionada.completa = true;
        atualizarTarefa();
    }
});

btnRemoverConcluidas.onclick = () => {
    const seletor = ".app__section-task-list-item-complete";
    document.querySelectorAll(seletor).forEach(element => {
        element.remove();
    });
    tarefas = tarefas.filter(element => !element.completa);
    atualizarTarefa();
}

btnRemoverTodas.onclick = () => {
    const seletor = '.app__section-task-list-item';
    document.querySelectorAll(seletor).forEach(element => {
        element.remove();
    });
    tarefas = [];
    atualizarTarefa();
}