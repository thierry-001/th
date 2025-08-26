// --------------------
// Quiz de opinião (sem respostas certas)
const perguntas = [
  {
    pergunta: "1. Quando alguém comete um erro público, você:",
    opcoes: [
      "Prefere entender o contexto antes de julgar.",
      "Critica de forma construtiva.",
      "Acredita que deve ser cancelado.",
      "Ignora, não é problema seu."
    ]
  },
  {
    pergunta: "2. O que você faria se fosse “cancelado”?",
    opcoes: [
      "Tentaria explicar meu lado.",
      "Aceitaria as críticas e mudaria.",
      "Ficaria revoltado e revidaria.",
      "Sumiria da internet por um tempo."
    ]
  },
  {
    pergunta: "3. Quando alguém te critica, você geralmente…",
    opcoes: [
      "Leva na boa e tenta melhorar.",
      "Ri e finge que não ligou.",
      "Fica pensando nisso o dia todo.",
      "Dá uma resposta na hora."
    ]
  },
  {
    pergunta: "4. Como você reage quando alguém discorda de você?",
    opcoes: [
      "Troca ideias numa boa.",
      "Faz piada pra quebrar o clima.",
      "Insiste no seu ponto.",
      "Deixa quieto."
    ]
  }
];

let indice = 0;
let respostas = [];

// --------------------
// Funções do Quiz
function iniciarQuiz() {
  indice = 0;
  respostas = [];
  document.getElementById("resultado-quiz").textContent = "";
  mostrarPergunta();
}

function mostrarPergunta() {
  const quizDiv = document.getElementById("quiz-container");
  if (indice < perguntas.length) {
    const q = perguntas[indice];
    quizDiv.innerHTML = `
      <p><strong>${q.pergunta}</strong></p>
      ${q.opcoes.map(opcao => `<button onclick="responder('${opcao}')">${opcao}</button>`).join("")}
    `;
  } else {
    quizDiv.innerHTML = `
      <p>Obrigado por participar! Suas respostas mostram seu jeito de lidar com situações do cancelamento. Não existe resposta certa ou errada, o importante é refletir.</p>
      <button onclick="iniciarQuiz()">Recomeçar Quiz</button>
    `;
    console.log("Respostas do usuário:", respostas);
  }
}

function responder(opcao) {
  respostas.push(opcao);
  indice++;
  mostrarPergunta();
}

// --------------------
// Sua voz tem espaço (enquete simplificada)
function adicionarSugestao() {
  const input = document.getElementById("sugestao-enquete");
  const texto = input.value.trim();
  if (!texto) return;

  let sugestoes = JSON.parse(localStorage.getItem("sugestoes")) || [];
  sugestoes.push({ texto: texto, curtidas: 0 });
  localStorage.setItem("sugestoes", JSON.stringify(sugestoes));

  exibirSugestoes();
  input.value = "";
  contarVisitante();
}

function exibirSugestoes() {
  const lista = document.getElementById("sugestoes-lista");
  lista.innerHTML = "";
  let sugestoes = JSON.parse(localStorage.getItem("sugestoes")) || [];

  sugestoes.forEach((item, index) => {
    const li = document.createElement("li");
    li.textContent = item.texto;
    li.classList.add("nova-msg");

    const curtir = document.createElement("button");
    curtir.textContent = `❤️ ${item.curtidas}`;
    curtir.style.marginLeft = "10px";
    curtir.onclick = () => {
      item.curtidas++;
      curtir.textContent = `❤️ ${item.curtidas}`;
      let todos = JSON.parse(localStorage.getItem("sugestoes"));
      todos[index].curtidas = item.curtidas;
      localStorage.setItem("sugestoes", JSON.stringify(todos));
    };
    li.appendChild(curtir);
    lista.appendChild(li);
  });
}

// Limpar lista (com senha)
function limparSugestoes() {
  const senha = prompt("Digite a senha para limpar as mensagens:");
  if (senha === "2007") {
    localStorage.removeItem("sugestoes");
    exibirSugestoes();
    alert("Mensagens apagadas com sucesso!");
  } else {
    alert("Senha incorreta. Ação negada.");
  }
}

// --------------------
// Emojis da apresentação
const reacoes = [
  { emoji: "😃", label: "Ótimo" },
  { emoji: "🙂", label: "Bom" },
  { emoji: "😐", label: "Regular" }
];

reacoes.forEach(r => {
  if (localStorage.getItem("reacao-" + r.label) === null) {
    localStorage.setItem("reacao-" + r.label, 0);
  }
});

function votarEmoji(label) {
  let cont = parseInt(localStorage.getItem("reacao-" + label)) || 0;
  cont++;
  localStorage.setItem("reacao-" + label, cont);
  atualizarReacoes();
}

function atualizarReacoes() {
  const container = document.getElementById("emoji-container");
  if (!container) return;
  container.innerHTML = "";

  reacoes.forEach(r => {
    let cont = parseInt(localStorage.getItem("reacao-" + r.label)) || 0;
    const btn = document.createElement("button");
    btn.textContent = `${r.emoji} ${r.label} (${cont})`;
    btn.style.fontSize = "1.2em";
    btn.style.margin = "5px";
    btn.onclick = () => votarEmoji(r.label);
    container.appendChild(btn);
  });

  // Botão Limpar Reações
  const btnLimpar = document.createElement("button");
  btnLimpar.textContent = "Limpar";
  btnLimpar.onclick = () => {
    const senha = prompt("Digite a senha para limpar as reações:");
    if (senha === "2007") {
      reacoes.forEach(r => localStorage.setItem("reacao-" + r.label, 0));
      atualizarReacoes();
      alert("Reações limpas!");
    } else {
      alert("Senha incorreta. Ação negada.");
    }
  };
  btnLimpar.style.marginTop = "10px";
  container.appendChild(document.createElement("br"));
  container.appendChild(btnLimpar);
}

// --------------------
// Minijogo rápido
const frasesMini = [
  { texto: "Influenciador postou comentário ofensivo", tipo: "Cancelamento" },
  { texto: "Ator pediu desculpas após piada polêmica", tipo: "Crítica" },
  { texto: "Empresa alterou produto após protestos", tipo: "Crítica" }
];

function startMiniGame() {
  const container = document.getElementById("jogo-container");
  container.innerHTML = "";

  const criticaZone = document.createElement("div");
  criticaZone.className = "dropzone";
  criticaZone.textContent = "Crítica";

  const cancelamentoZone = document.createElement("div");
  cancelamentoZone.className = "dropzone";
  cancelamentoZone.textContent = "Cancelamento";

  container.appendChild(criticaZone);
  container.appendChild(cancelamentoZone);

  frasesMini.forEach(f => {
    const fraseDiv = document.createElement("div");
    fraseDiv.className = "frase";
    fraseDiv.textContent = f.texto;

    // Drag desktop
    fraseDiv.draggable = true;
    fraseDiv.addEventListener("dragstart", e => {
      e.dataTransfer.setData("tipo", f.tipo);
      e.dataTransfer.setData("texto", f.texto);
    });

    // Touch mobile
    fraseDiv.addEventListener("touchstart", e => {
      e.preventDefault();
      const touch = e.targetTouches[0];
      fraseDiv.style.position = "absolute";
      fraseDiv.style.zIndex = 1000;
      moveAt(touch.pageX, touch.pageY);
      function moveAt(pageX, pageY) {
        fraseDiv.style.left = pageX - fraseDiv.offsetWidth / 2 + "px";
        fraseDiv.style.top = pageY - fraseDiv.offsetHeight / 2 + "px";
      }
      function onTouchMove(e) {
        const touch = e.targetTouches[0];
        moveAt(touch.pageX, touch.pageY);
      }
      document.addEventListener("touchmove", onTouchMove);

      fraseDiv.addEventListener("touchend", e => {
        document.removeEventListener("touchmove", onTouchMove);
        [criticaZone, cancelamentoZone].forEach(zone => {
          const rect = zone.getBoundingClientRect();
          const touch = e.changedTouches[0];
          if (
            touch.clientX > rect.left &&
            touch.clientX < rect.right &&
            touch.clientY > rect.top &&
            touch.clientY < rect.bottom
          ) {
            if(f.tipo === zone.textContent) alert(`✔️ Correto! "${f.texto}" classificado como ${f.tipo}.`);
            else alert(`❌ Errado! "${f.texto}" era ${f.tipo}.`);
            zone.appendChild(fraseDiv);
            fraseDiv.style.position = "";
            fraseDiv.style.left = "";
            fraseDiv.style.top = "";
          }
        });
      }, { once: true });
    });

    container.appendChild(fraseDiv);
  });

  // Drag desktop para zonas
  [criticaZone, cancelamentoZone].forEach(zone => {
    zone.addEventListener("dragover", e => e.preventDefault());
    zone.addEventListener("dragenter", e => zone.classList.add("over"));
    zone.addEventListener("dragleave", e => zone.classList.remove("over"));
    zone.addEventListener("drop", e => {
      e.preventDefault();
      zone.classList.remove("over");
      const tipo = e.dataTransfer.getData("tipo");
      const texto = e.dataTransfer.getData("texto");
      if(tipo === zone.textContent) alert(`✔️ Correto! "${texto}" classificado como ${tipo}.`);
      else alert(`❌ Errado! "${texto}" era ${tipo}.`);
      const fraseDivs = document.querySelectorAll(".frase");
      let fraseDiv = Array.from(fraseDivs).find(div => div.textContent === texto);
      if (fraseDiv) zone.appendChild(fraseDiv);
    });
  });
}

// --------------------
// Música de fundo
function configurarMusica() {
  const musica = document.getElementById("musica-fundo");
  if (musica) musica.volume = 0.5;
}

// Contador de visitantes
function contarVisitante() {
  let contador = parseInt(localStorage.getItem("visitantes")) || 0;
  contador++;
  localStorage.setItem("visitantes", contador);
  const elem = document.getElementById("num-visitantes");
  if(elem) elem.textContent = contador;
}

// --------------------
// Inicialização
window.onload = () => {
  configurarMusica();
  atualizarReacoes();
  exibirSugestoes();
  const contadorDisplay = document.getElementById("num-visitantes");
  if (contadorDisplay) contadorDisplay.textContent = localStorage.getItem("visitantes") || 0;
};
