let usuarios = [];
let mensagens = [];

let usuarioLogado = {
  name: "",
};

function mostrarTelaChat() {
  const divTelaLogin = document.querySelector(".container");
  const divTelaChat = document.querySelector(".esconder");

  divTelaLogin.classList.add("esconder");
  divTelaChat.classList.remove("esconder");
}

function mostrarTelaLogin() {
  const divTelaLogin = document.querySelector(".container");
  const divTelaChat = document.querySelector(".esconder");

  divTelaLogin.classList.remove("esconder");
  divTelaChat.classList.add("esconder");
}


function adicionarCadastro() {
  const inputCadastro = document.querySelector(".cadastro");

  const requisicao = {
    name: inputCadastro.value,
  };

  const promessa = axios.post(
    "https://mock-api.driven.com.br/api/v6/uol/participants",
    requisicao
  );

  promessa.then(function () {
    usuarioLogado.name = inputCadastro.value;

    mostrarTelaChat();
    avisarOnline();
    buscarMensagens();
  });

  promessa.catch(tratarErroLogin);
}

function avisarOnline() {
  setInterval(function () {
    const promessa = axios.post(
      "https://mock-api.driven.com.br/api/v6/uol/status",
      usuarioLogado
    );
    promessa.then();
  }, 5000);
}

function buscarMensagens() {
  setInterval(function () {
    const promessa = axios.get(
      "https://mock-api.driven.com.br/api/v6/uol/messages"
    );
    promessa.then(function (resposta) {
      const mensagens = resposta.data.filter(function (msg) {
        return msg.to.toLowerCase() == "todos";
      });
      montarTelaDoChat(mensagens);
    });
  }, 3000);
}

function montarTelaDoChat(mensagens) {
  const ul = document.querySelector(".chat");
  ul.innerHTML = "";

  for (let i = 0; i < mensagens.length; i++) {
    let cssClass = "";
    let destinarioDiv = `<div class="destinatario">${mensagens[i].to}</div>`;
    let remetenteDiv = '<div class="remetente">para</div>';

    if (mensagens[i].type == "status") {
      cssClass = "entrar-sair";
      destinarioDiv = '<div class="destinatario"></div>';
      remetenteDiv = '<div class="remetente"></div>';
    } else if (mensagens[i].type == "private_message") {
      cssClass = "mensagensReservadas";
    } else {
      cssClass = "mensagensNormais";
    }

    ul.innerHTML =
      ul.innerHTML +
      `
      <li class=${cssClass}>
        <div class="horario">(${mensagens[i].time})</div>
        <div class="usuario">${mensagens[i].from}</div>
        ${remetenteDiv}
        ${destinarioDiv}
        <div class="tipoMensagem"${mensagens[i].type}</div>
        <div class="mensagensEnviadas">${mensagens[i].text}</div>
      </li>
    
    `;
  }
  ul.scrollIntoView(false);
}

function enviarMensagens() {
  const mensagem = document.querySelector(".mensagem");

  const requisicao = {
    from: usuarioLogado.name,
    to: "todos",
    text: mensagem.value,
    type: "message",
  };

  const promessa = axios.post(
    "https://mock-api.driven.com.br/api/v6/uol/messages",
    requisicao
  );

  promessa.then();

  promessa.catch(function () {
    mostrarTelaLogin();
    window.location.reload();
  });
}

function tratarErroLogin(erro) {
  if (erro.response.status === 400) {
    alert("Esse usuário já existe. Tente outro nome");
  }
}
