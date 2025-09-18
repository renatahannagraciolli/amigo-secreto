// app.js (substitua tudo por este arquivo)

(() => {
  // Estado
  const amigos = [];
  let meuNome = localStorage.getItem("meuNomeAS") || null;

  // Utils
  const $ = (s) => document.querySelector(s);
  const normalizar = (s) =>
    s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/\s+/g, " ").trim();

  // ----- Adicionar / Remover -----
  function adicionarAmigo() {
    const input = $("#amigo");
    const nomeBruto = input.value;
    const nome = nomeBruto.trim();

    if (!nome) {
      alert("Por favor, insira um nome.");
      input.focus();
      return;
    }

    const chave = normalizar(nome);
    const jaExiste = amigos.some((n) => normalizar(n) === chave);
    if (jaExiste) {
      alert("Esse nome já foi adicionado.");
      input.select();
      return;
    }

    amigos.push(nome);
    renderLista();
    input.value = "";
    input.focus();
  }

  function renderLista() {
    const ul = $("#listaAmigos");
    ul.innerHTML = "";
    amigos.forEach((nome, idx) => {
      const li = document.createElement("li");
      li.className = "name-item";

      const span = document.createElement("span");
      span.textContent = nome;

      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "button-remove";
      btn.textContent = "×";
      btn.setAttribute("aria-label", `Remover ${nome}`);
      btn.dataset.index = String(idx);

      li.appendChild(span);
      li.appendChild(btn);
      ul.appendChild(li);
    });
  }

  $("#listaAmigos").addEventListener("click", (e) => {
    const alvo = e.target;
    if (alvo instanceof HTMLElement && alvo.classList.contains("button-remove")) {
      const i = Number(alvo.dataset.index);
      if (!Number.isNaN(i)) {
        amigos.splice(i, 1);
        renderLista();
      }
    }
  });

  // ----- Seu nome -----
  function definirMeuNome(nome) {
    const nomeLimpo = (nome ?? "").trim();
    if (!nomeLimpo) {
      alert("Digite um nome válido.");
      return;
    }

    // Opcional: garantir que esteja na lista
    const existe = amigos.some((n) => normalizar(n) === normalizar(nomeLimpo));
    if (!existe) {
      const add = confirm(`"${nomeLimpo}" não está na lista. Deseja adicioná-lo agora?`);
      if (add) {
        amigos.push(nomeLimpo);
        renderLista();
      }
    }

    meuNome = nomeLimpo;
    localStorage.setItem("meuNomeAS", meuNome); // persiste pro próximo reload
    alert(`Seu nome foi definido como: ${meuNome}`);
  }

  function pedirMeuNomeSePreciso() {
    if (meuNome && normalizar(meuNome)) return true;
    const informado = prompt("Qual é o SEU nome (igual ao que está na lista)?");
    if (informado === null) return false; // cancelado
    const nome = informado.trim();
    if (!nome) {
      alert("Digite um nome válido.");
      return pedirMeuNomeSePreciso();
    }
    definirMeuNome(nome);
    return true;
  }

  // ----- Sorteio que nunca te tira -----
  function sortearAmigo() {
    if (!pedirMeuNomeSePreciso()) return;

    const res = $("#resultado");
    res.innerHTML = "";

    if (amigos.length === 0) {
      alert("Adicione amigos antes de sortear.");
      return;
    }

    const pool = amigos.filter((n) => normalizar(n) !== normalizar(meuNome));
    if (pool.length === 0) {
      alert("Não há ninguém para sortear além de você. Adicione mais amigos.");
      return;
    }

    const sorteado = pool[Math.floor(Math.random() * pool.length)];
    const li = document.createElement("li");
    li.textContent = `Sorteado: ${sorteado}`;
    res.appendChild(li);
  }

  // ----- QoL -----
  document.addEventListener("DOMContentLoaded", () => {
    $("#amigo")?.addEventListener("keydown", (e) => {
      if (e.key === "Enter") adicionarAmigo();
    });
  });

  // Expor para o HTML (onclick)
  window.adicionarAmigo = adicionarAmigo;
  window.sortearAmigo = sortearAmigo;
  window.definirMeuNome = definirMeuNome;
})();
