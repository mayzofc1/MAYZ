// Variaveis do Projeto Fokus

const html = document.querySelector("html");
const focoBtn = document.querySelector(".app__card-button--foco");
const curtoBtn = document.querySelector(".app__card-button--curto");
const longoBtn = document.querySelector(".app__card-button--longo");
const banner = document.querySelector('.app__image');
const titulo = document.querySelector('.app__title');
const btns =document.querySelectorAll('.app__card-button');
const musicInput = document.getElementById('alternar-musica');
const startPauseBtn = document.getElementById('start-pause');
const iniciarOuPausarBtn = document.querySelector('#start-pause span');
const imagemInputIniciarPausar = document.querySelector('.app__card-primary-butto-icon');
const tempoNaTela = document.getElementById('timer');

// Musicas

const music = new Audio('./sons/luna-rise-part-one.mp3');
const musicPlay = new Audio('./sons/play.wav');
const musicPause = new Audio('./sons/pause.mp3');
const musicEnd = new Audio('./sons/beep.mp3');

let tempoDecorridoEmSegundos = 2;
let intervaloId = null;

// Adiciona loop na musica e define o volume em 50%

music.loop = true;
music.volume = 0.5;
musicPlay.volume = 0.5;
musicPause.volume = 0.5;
musicEnd.volume = 0.5;

// Acionando Input de musica

musicInput.addEventListener('change', () => {
    if(music.paused) {
        music.play();
    } else {
        music.pause();
    }
});

// Acionamento dos buttons

focoBtn.addEventListener("click", () => {
    zerar();
    tempoDecorridoEmSegundos = 1;
    mostrarTempo();
    alterarContexto('foco');
    focoBtn.classList.add('active');
});

curtoBtn.addEventListener('click', () => {
    zerar();
    tempoDecorridoEmSegundos = 5 * 60;
    mostrarTempo();
    alterarContexto('descanso-curto');
    curtoBtn.classList.add('active');
});

longoBtn.addEventListener('click', () => {
    zerar();
    tempoDecorridoEmSegundos = 15 * 60;
    mostrarTempo();
    alterarContexto('descanso-longo');
    longoBtn.classList.add('active');
});

// Função para alterar o tema da pagina de acordo com o modo escolhido

function alterarContexto(contexto) {

    // Reseta a class active em todos os buttons

    btns.forEach(function (contexto) {
        contexto.classList.remove('active');
    });
    
    html.setAttribute('data-contexto', contexto);
    banner.setAttribute('src', `./imagens/${contexto}.png`);

    switch (contexto) {
        case 'foco':
            titulo.innerHTML = `
                Otimize sua produtividade,<br>
                <strong class="app__title-strong">mergulhe no que importa.</strong>
            `
            break;
        case 'descanso-curto':
            titulo.innerHTML = `
                Que tal dar uma respirada?<br>
                <strong class="app__title-strong">Faça uma pausa curta!</strong>
            `
            break;
        case 'descanso-longo':
            titulo.innerHTML = `
                Hora de voltar à superfície.<br>
                <strong class="app__title-strong">Faça uma pausa longa.</strong>
            `
            break;
        default:
            break;
    }
}

// Funcionamento do contador

const contagemRegressiva = () => {

    if (tempoDecorridoEmSegundos <= 0) {
        musicEnd.play();
        alert('Tempo Finalizado');
        const focoAtivo = html.getAttribute('data-contexto') == 'foco';
        if (focoAtivo) {
            const event = new CustomEvent('FocoFinalizado');
            document.dispatchEvent(event);
        }
        zerar();
        return;
    }

    tempoDecorridoEmSegundos -= 1
    mostrarTempo();
}

startPauseBtn.addEventListener('click', iniciarOuPausar); // Chamada do button

function iniciarOuPausar() {

    if (intervaloId) {
        zerar();
        musicPause.play();
        return;
    }

    intervaloId = setInterval(contagemRegressiva, 1000);
    musicPlay.play();
    iniciarOuPausarBtn.textContent = 'Pausar';
    imagemInputIniciarPausar.setAttribute('src', `./imagens/pause.png`);
}

function zerar() {

    clearInterval(intervaloId);
    iniciarOuPausarBtn.textContent = 'Começar';
    imagemInputIniciarPausar.setAttribute('src', `./imagens/play_arrow.png`);
    intervaloId = null;
}

// Mostrar tempo na tela

function mostrarTempo() {
    const tempo = new Date(tempoDecorridoEmSegundos * 1000);
    const tempoFormatado = tempo.toLocaleTimeString('pt-br', {minute: '2-digit', second: '2-digit'});
    tempoNaTela.innerHTML = `${tempoFormatado}`;
}

mostrarTempo();