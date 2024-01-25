const btnAdicionarTarefa = document.querySelector('.app__button--add-task');
const btnCancelarTarefa = document.querySelector('.app__form-footer__button--cancel');
const btnExcluirTarefa = document.querySelector('.app__form-footer__button--delete');
const formAdicionarTarefa = document.querySelector('.app__form-add-task');
const textarea = document.querySelector('.app__form-textarea');
const ulTarefas = document.querySelector('.app__section-task-list');
const paragrafoDescricaoTarefa = document.querySelector('.app__section-active-task-description');
const btnRemoverConcluidas = document.querySelector('#btn-remover-concluidas');
const btnRemoverTodas = document.querySelector('#btn-remover-todas');
let tarefaSelecionada = null;
let liTarefaSelecionada = null;



let tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];//ao invés de iniciar com um array vazio ele já verifica no inicio se tem algo guardado na localstorage caso não tenha, vai pro array vazio. É preciso converter a string de volta em um array.

function atualizarTarefas (){
    localStorage.setItem('tarefas',JSON.stringify(tarefas));//guardar as informações para não sumirem com o refresh do navegador
    //é preciso transformar o objeto em string e depois voltar para objeto para que as informações sejam armazenadas corretamente (json)

}



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
    paragrafo.textContent = tarefa.descricao;
    paragrafo.classList.add('app__section-task-list-item-description');
    paragrafo.contentEditable = false;
  
    const botao = document.createElement('button');
    botao.classList.add('app_button-edit');
  
    function salvarOuEditar() {
      if (paragrafo.contentEditable === 'false') {// Permite editar o parágrafo
        paragrafo.contentEditable = true;
        paragrafo.focus();
      } else {//Fecha a edição de parágrafo e vai salvar as novas informações
        paragrafo.contentEditable = false;
        const novaDescricao = paragrafo.textContent.trim();
  
        if (novaDescricao === '') {// Se estiver vazio volta para edição
          paragrafo.contentEditable = true;
          alert('Digite algo');
          paragrafo.focus();
          return;
        }
  
        paragrafo.textContent = novaDescricao;//Atualizando o parágrafo e o objeto
        tarefa.descricao = novaDescricao;
        atualizarTarefas();
      }
    }
  
    botao.onclick = salvarOuEditar;
  
    paragrafo.addEventListener('keydown', (event) => {
      // opção para utilizar o enter para salvar
      if (event.key === 'Enter') {
        event.preventDefault();
        salvarOuEditar();
      }
    });
  
    paragrafo.addEventListener('blur', (event) => {//Impede que saia do parágrafo sem salvar 
      if (paragrafo.contentEditable === 'true'){
        paragrafo.focus();
        event.preventDefault();
      }
    });
  
    const imagemBotao = document.createElement('img');
  
    imagemBotao.setAttribute('src', '/imagens/edit.png');
    botao.append(imagemBotao); //colocando a imagem dentro do botão
  
    li.append(svg);
    li.append(paragrafo);
    li.append(botao);

    if (tarefa.completa){
      li.classList.add('app__section-task-list-item-complete');
    botao.setAttribute('disabled','true');

    }else{
      li.onclick = () =>{

        document.querySelectorAll('.app__section-task-list-item-active')
          .forEach(elemento => {
            elemento.classList.remove('app__section-task-list-item-active')
          });//Seleciona todos com essa classe e remove de cada um
  
          if (tarefaSelecionada == tarefa){ //Caso clicar novamente na tarefa vai sair da seleção e limpar do campo em andamento
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

btnAdicionarTarefa.addEventListener('click', () =>{
    formAdicionarTarefa.classList.toggle('hidden');// se tem a classe ele tira, se não ele adiciona.
})

formAdicionarTarefa.addEventListener('submit', (evento)=> {
    evento.preventDefault();//previnir o evento padrão de recarregar a pagina ao enviar o formulário.
    const tarefa = {
        descricao: textarea.value
    };
    tarefas.push(tarefa);
    
    const elementoTarefa = criarElementoTarefa(tarefa);
    ulTarefas.append(elementoTarefa);
    atualizarTarefas();
    textarea.value = '';
    formAdicionarTarefa.classList.add('hidden');

})

btnCancelarTarefa.addEventListener('click', () =>{
    textarea.value = '';
    formAdicionarTarefa.classList.add('hidden');

})

btnExcluirTarefa.addEventListener('click', () =>{
  textarea.value = '';
  formAdicionarTarefa.classList.add('hidden');
})

tarefas.forEach(tarefa => {//Ao iniciar a navegação, vai pegar cada elemento armazenado no array tarefas e cria os elementos quando a página for carregada
    const elementoTarefa = criarElementoTarefa(tarefa);
    ulTarefas.append(elementoTarefa);
    
});

document.addEventListener('focoFinalizado', () => {//utilizando o evento que foi criado no script.js ou seja quando o timer do foco chega ao fim
  if(tarefaSelecionada && liTarefaSelecionada){
    liTarefaSelecionada.classList.remove('app__section-task-list-item-active');
    liTarefaSelecionada.classList.add('app__section-task-list-item-complete');
    liTarefaSelecionada.querySelector('button').setAttribute('disabled','true');
    tarefaSelecionada.completa = true; //como tarefaSelecionada é = tarefa, é o mesmo que dizer que tarefa.completa = true
    atualizarTarefas();//guardando essa nova propriedade completa no array tarefas
  }
})




function removerTarefas(somenteCompletas){//ao invés de function poderia ser uma const
  let seletor =  ".app__section-task-list-item";
  if (somenteCompletas) {
      seletor = ".app__section-task-list-item-complete";
  }
  document.querySelectorAll(seletor).forEach(elemento => {
      elemento.remove();
  });
  tarefas = somenteCompletas ? tarefas.filter(tarefa => !tarefa.completa) : [];
  atualizarTarefas();
}


btnRemoverConcluidas.onclick = () => removerTarefas(true);
btnRemoverTodas.onclick = () => removerTarefas(false);
