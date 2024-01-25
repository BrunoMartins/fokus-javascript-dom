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

const temposIniciais = {
    foco: 1500,//sem aspas pq nao tem carac especiais
    'descanso-curto': 300,
    'descanso-longo': 900
};


musicaFocoInput.addEventListener('change', () => {// change serve para input checkbox
    if(musica.paused){
        musica.play();
        // para começar a mmúsica do começo - musica.currentTime = 0;
    }else{
        musica.pause();
    }
})


focoBt.addEventListener('click', () => {
    definirTempoInicial('foco');
    alterarContexto('foco');
    focoBt.classList.add('active');
    
    
})

curtoBt.addEventListener('click', () =>{
    definirTempoInicial('descanso-curto');
    alterarContexto('descanso-curto');
    curtoBt.classList.add('active');
})

longoBt.addEventListener('click',() =>{
    definirTempoInicial('descanso-longo');
    alterarContexto('descanso-longo');
    longoBt.classList.add('active');
    
})

function definirTempoInicial(contexto) {
    tempoDecorridoEmSegundos = temposIniciais[contexto];//quando o objeto é dinamico usamos []
    mostrarTempo();
}

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
        const focoAtivo = html.getAttribute('data-contexto') == 'foco';//verificando se foco esta ativo
        if (focoAtivo){
            const evento = new CustomEvent('focoFinalizado');
            document.dispatchEvent(evento);//se o tempo acabar e estiver selecionado o foco, um evento personalziado chamado focoFinalizado será disparado
        }
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

function zerar() {
    clearInterval(intervaloID);
    iniciarOuPausarBt.textContent = 'Começar';
    imagemBt.setAttribute('src', `/imagens/play_arrow.png`);
    intervaloID = null;
    
    if (tempoDecorridoEmSegundos <= 0){
        const contexto = html.getAttribute('data-contexto');
    tempoDecorridoEmSegundos = temposIniciais[contexto] || 10; // Se o contexto não for encontrado em temposIniciais, define como 10 segundos

    mostrarTempo();

    }   
   
}

function mostrarTempo(){
    const tempo = new Date(tempoDecorridoEmSegundos*1000);
    const tempoFormatado = tempo.toLocaleTimeString('pt-br', {minute: '2-digit',second: '2-digit'});
    tempoNaTela.innerHTML = `${tempoFormatado}`;
}

mostrarTempo();