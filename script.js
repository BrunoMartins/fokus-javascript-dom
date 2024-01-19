const html = document.querySelector('html');
const focoBt = document.querySelector('.app__card-button--foco');
const curtoBt = document.querySelector('.app__card-button--curto');
const longoBt = document.querySelector('.app__card-button--longo');
const banner = document.querySelector('.app__image');
const titulo = document.querySelector('.app__title');
const botoes = document.querySelectorAll('.app__card-button');
const startPauseBt = document.querySelector('#start-pause');
const musicaFocoInput = document.querySelector('#alternar-musica');
const iniciarOuPausarBt = document.querySelector ('#start-pause span');
const imagemBt = document.querySelector('#start-pause img');
const tempoNaTela = document.querySelector('#timer');
const musica = new Audio ('/sons/luna-rise-part-one.mp3');
musica.loop = true;
let tempoDecorridoEmSegundos = 1500;
let intervaloID = null;
const audioPlay = new Audio('/sons/play.wav');
const audioPause = new Audio('/sons/pause.mp3');
const audioTempoFinalizado = new Audio('./sons/beep.mp3');


musicaFocoInput.addEventListener('change', () => {// change serve para input checkbox
    if(musica.paused){
        musica.play();
        // para começar a mmúsica do começo - musica.currentTime = 0;
    }else{
        musica.pause();
    }
})


focoBt.addEventListener('click', () => {
     tempoDecorridoEmSegundos = 1500;
    alterarContexto('foco');
    focoBt.classList.add('active');
    
    
})

curtoBt.addEventListener('click', () =>{
    tempoDecorridoEmSegundos = 300;
    alterarContexto('descanso-curto');
    curtoBt.classList.add('active');
})

longoBt.addEventListener('click',() =>{
     tempoDecorridoEmSegundos = 900;
    alterarContexto('descanso-longo');
    longoBt.classList.add('active');
    
})

function alterarContexto(contexto){
    mostrarTempo();
    botoes.forEach(function (contexto){
        contexto.classList.remove('active') // percorrendo todos os elementos botoes e retira a classe active de todos eles, a classe será adicionada novamente ao ser clicado o botão.
    })

    html.setAttribute('data-contexto', contexto);
    banner.setAttribute('src',`/imagens/${contexto}.png`);
    switch (contexto) {
        case 'foco':
            titulo.innerHTML = `Otimize sua produtividade,<br>
            <strong class="app__title-strong">mergulhe no que importa.</strong>`;
            break;
        
        case 'descanso-curto' :
            titulo.innerHTML = `Que tal dar uma respirada? <strong class="app__title-strong"> Faça uma pausa curta!</strong>` ; 
            break;
            
        case 'descanso-longo':
            titulo.innerHTML = `Hora de voltar à superfície.
            <strong class="app__title-strong"> Faça uma pausa longa.</strong>`;    
            break;
    
        default:
            break;
    }
}

const contagemRegressiva = () =>{ // colocou em constante para jogar direto no evento de click
    if (tempoDecorridoEmSegundos <= 0){
        audioTempoFinalizado.play();
        alert('Tempo finalizado !');
        zerar();
        return;
    }
    tempoDecorridoEmSegundos-= 1;
    mostrarTempo();
    
}

startPauseBt.addEventListener('click', iniciarOuPausar); // evento de click deve vir depois da variavel criada caso for uma const

function iniciarOuPausar (){
    if (intervaloID){ //se intervaloID tiver algum valor
        audioPause.play();
        zerar();
        return;
    }
    audioPlay.play();
    intervaloID = setInterval(contagemRegressiva,1000) // 1000 = 1 segundo
    iniciarOuPausarBt.textContent = 'Pausar';
    imagemBt.setAttribute('src',`/imagens/pause.png`);
}

function zerar(){ // zerando o valor quando chega em 0 para não ficar preso em looping no alert
    clearInterval(intervaloID);
    iniciarOuPausarBt.textContent = 'Começar';
    imagemBt.setAttribute('src',`/imagens/play_arrow.png`);
    intervaloID = null;

}

function mostrarTempo(){
    const tempo = new Date(tempoDecorridoEmSegundos*1000);
    const tempoFormatado = tempo.toLocaleTimeString('pt-br', {minute: '2-digit',second: '2-digit'});
    tempoNaTela.innerHTML = `${tempoFormatado}`;
}

mostrarTempo();