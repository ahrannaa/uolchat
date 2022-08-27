let usuarios = [];
let usuarioLogado = {
  name: "",
};
let mensagens = [];

function adicionarCadastro() {
  const inputCadastro = document.querySelector(".cadastro");

  const requisicao = { 
    name: inputCadastro.value, 
  };

  const promessa = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants",requisicao);
  
  promessa.then(function() {
    usuarioLogado.name = inputCadastro.value
    location.href = 'chat.html';
    avisarOnline()
    buscarMensagens()
  });
  
  promessa.catch(deuErro);
}



function avisarOnline() {
  setInterval(function (){
    const promessa = axios.post('https://mock-api.driven.com.br/api/v6/uol/status', usuarioLogado)
    promessa.then(function() {
      console.log("usuário online")
    })
    //promessa.catch(usuarioInativo)
  }, 5000)
}

function buscarMensagens(){
  const promessa = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages')
  promessa.then(function(resposta) {
    montarTelaDoChat(resposta.data)
    //console.log(resposta.data)
  })
}

function montarTelaDoChat(mensagens) {
  const ul = document.querySelector('.chat')

  for (let i = 0; i < mensagens.length; i++) {

    ul.innerHTML = ul.innerHTML + `
      <li>
        <div class="horario">${mensagens[i].time}</div>
        <div class="usuario">${mensagens[i].from}</div>
        <div class="destinatario">${mensagens[i].to}</div>
        <div class="tipoMensagem"${mensagens[i].type}</div>
        <div class="mensagens">${mensagens[i].text}</div>
      </li>
    
    `
  }
}

function enviarMensagens(){

  const mensagem = document.querySelector('.mensagemEnviada')
    
  const requisicao = {
      // from: usuarioLogado.name,
      from: "Tereza",
      to: "Todos",
      text: mensagem.value,
      type: "message"
	  }

   const promessa = axios.post('https://mock-api.driven.com.br/api/v6/uol/messages', requisicao)
    promessa.then(function(){
    console.log('deu certo')
   }
   )}

function deuErro(erro) {
  if (erro.response.status === 400) {
    alert("Esse usuário já existe. Tente outro nome");
  }
}

function usuarioInativo(err){
  alert("Usuario offline");
}