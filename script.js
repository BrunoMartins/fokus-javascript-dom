const html = document.querySelector('html');
const focoBt = document.querySelector('.app__card-button--foco');
const curtoBt = document.querySelector('.app__card-button--curto');
const longoBt = document.querySelector('.app__card-button--longo');
const banner = document.querySelector('.app__image');
const titulo = document.querySelector('.app__title');
const botoes = document.querySelectorAll('.app__card-button');
const startPauseBt = document.querySelector('#start-pause');
const musicaFocoInput = document.querySelector('#alternar-musica');
const musica = new Audio ('/sons/luna-rise-part-one.mp3');
musica.loop = true;
let tempoDecorridoEmSegundos = 5;
let intervaloID = null;

musicaFocoInput.addEventListener('change', () => {// change serve para input checkbox
    if(musica.paused){
        musica.play();
        // para começar a mmúsica do começo - musica.currentTime = 0;
    }else{
        musica.pause();
    }
})


focoBt.addEventListener('click', () => {
    alterarContexto('foco');
    focoBt.classList.add('active');
    
})

curtoBt.addEventListener('click', () =>{
    alterarContexto('descanso-curto');
    curtoBt.classList.add('active');
})

longoBt.addEventListener('click',() =>{
    alterarContexto('descanso-longo');
    longoBt.classList.add('active');
    
})

function alterarContexto(contexto){
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
        zerar();
        alert('Tempo finalizado !');
        return;
    }
    tempoDecorridoEmSegundos-= 1;
    console.log(tempoDecorridoEmSegundos);
}

startPauseBt.addEventListener('click', iniciarOuPausar); // evento de click deve vir depois da variavel criada caso for uma const

function iniciarOuPausar (){
    if (intervaloID){ //se intervaloID tiver algum valor
        zerar();
        return;
    }
    intervaloID = setInterval(contagemRegressiva,1000) // 1000 = 1 segundo
}

function zerar(){ // zerando o valor quando chega em 0 para não ficar preso em looping no alert
    clearInterval(intervaloID);
    intervaloID = null;

}