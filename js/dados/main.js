import { beep, somVitoria } from './audio.js';
import { salas } from './dados/mapa.js';
import { inimigos } from './dados/inimigos.js';

const output = document.getElementById("output");
const input = document.getElementById("commandInput");

let jogador = {
  hp: 100, maxHp: 100,
  mp: 50, maxMp: 50,
  nivel: 1, xp: 0, xpProximo: 20,
  ouro: 10,
  danoMin: 2, danoMax: 4,
  pocoes: 2,
  local: "floresta",
  inventario: [],
  defendendo: false,
  furtivo: false
};

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function print(msg, classe = "") {
  const div = document.createElement("div");
  if (classe) div.className = classe;
  div.innerHTML = msg;
  output.appendChild(div);
  output.scrollTop = output.scrollHeight;
}

function atualizarHUD() {
  document.getElementById("hpText").textContent = `${jogador.hp}/${jogador.maxHp}`;
  document.getElementById("hpBar").style.width = `${Math.max(0, (jogador.hp / jogador.maxHp) * 100)}%`;
  document.getElementById("mpText").textContent = `${jogador.mp}/${jogador.maxMp}`;
  document.getElementById("mpBar").style.width = `${Math.max(0, (jogador.mp / jogador.maxMp) * 100)}%`;
  document.getElementById("lvlText").textContent = jogador.nivel;
  document.getElementById("xpText").textContent = `${jogador.xp}/${jogador.xpProximo}`;
  document.getElementById("goldText").textContent = jogador.ouro;
  document.getElementById("locText").textContent = jogador.local;
  document.getElementById("atkText").textContent = `${jogador.danoMin}-${jogador.danoMax}`;
}

function ganharXP(qtd) {
  jogador.xp += qtd;
  if (jogador.xp >= jogador.xpProximo) {
    jogador.xp -= jogador.xpProximo;
    jogador.nivel++;
    jogador.xpProximo = Math.floor(jogador.xpProximo * 1.6);
    jogador.maxHp += 20;
    jogador.hp = jogador.maxHp;
    jogador.maxMp += 15;
    jogador.mp = jogador.maxMp;
    jogador.danoMin += 2;
    jogador.danoMax += 3;
    somVitoria();
    print(`🎉 <strong>SUBIU DE NÍVEL!</strong> Você alcançou o Nível ${jogador.nivel}! HP, Mana e Ataque aumentaram!`, "msg-heal");
  }
}

function descreverLocal() {
  const sala = salas[jogador.local];
  print(`🌍 [${sala.nome}]`, "msg-room");
  print(sala.descricao);
  print(`🧭 Saídas: <strong>${sala.saidas.join(", ")}</strong> (use: <em>ir [local]</em>)`);

  if (sala.itensChao.length > 0) {
    print(`✨ Itens no chão: <strong>${sala.itensChao.join(", ")}</strong> (use: <em>pegar [item]</em>)`, "msg-loot");
  }
  if (sala.interagiveis.length > 0) {
    print(`🔍 Pontos de interesse: <strong>${sala.interagiveis.join(", ")}</strong> (use: <em>interagir [nome]</em>)`);
  }

  const inimigo = inimigos.find(e => e.hp > 0 && e.local === jogador.local);
  if (inimigo) {
    print(`⚔️ Inimigo presente: <strong>${inimigo.nome}</strong> (HP: ${inimigo.hp}/${inimigo.maxHp})`, "msg-combat");
  }
}

function checarVitoriaOuDerrotaInimigo(alvo) {
  if (alvo.hp <= 0) {
    print(`🏆 Você derrotou <strong>${alvo.nome}</strong>! (+${alvo.xp} XP, +${alvo.ouro} Ouro)`, "msg-loot");
    jogador.ouro += alvo.ouro;
    if (alvo.drop) {
      salas[jogador.local].itensChao.push(alvo.drop);
      print(`🗝️ ${alvo.nome} deixou cair: <strong>${alvo.drop}</strong>!`, "msg-loot");
    }
    ganharXP(alvo.xp);
    somVitoria();

    if (alvo.boss) {
      print(`👑 <strong>PARABÉNS!</strong> Você expurgou o Guardião Abissal e salvou o reino! Fim da jornada!`, "msg-heal");
      input.disabled = true;
    }
    return true;
  }
  return false;
}

function turnoDoInimigo() {
  const e = inimigos.find(e => e.hp > 0 && e.local === jogador.local);
  if (!e) return;

  if (jogador.furtivo) {
    print(`💨 ${e.nome} procura por você nas sombras, mas não consegue te atacar!`);
    return;
  }

  let dano = rand(Math.floor(e.dano * 0.7), e.dano);
  if (jogador.defendendo) {
    dano = Math.max(1, Math.floor(dano * 0.3));
    print(`🛡️ Sua defesa bloqueou a maior parte do golpe!`);
    jogador.defendendo = false;
  }

  jogador.hp = Math.max(0, jogador.hp - dano);
  beep(160, 150, "sawtooth");
  print(`💥 ${e.nome} te ataca causando <strong>${dano} de dano</strong>!`, "msg-combat");

  if (jogador.hp <= 0) {
    print("💀 Você caiu em combate... Sua jornada termina aqui. Recarregue a página para tentar novamente.", "msg-combat");
    beep(90, 500, "sawtooth");
    input.disabled = true;
  }
}

function handleCommand(cmd) {
  cmd = cmd.trim().toLowerCase();
  if (!cmd || input.disabled) return;

  let gastouTurno = true;
  const inimigoSala = inimigos.find(e => e.hp > 0 && e.local === jogador.local);

  if (cmd.startsWith("ir ")) {
    const destino = cmd.slice(3).trim();
    const salaAtual = salas[jogador.local];

    if (!salaAtual.saidas.includes(destino)) {
      print("Não há caminho para esse lugar a partir daqui.");
      gastouTurno = false;
    } else if (salas[destino].trancado && !jogador.inventario.includes("chave")) {
      print("🔒 O caminho para o Santuário está trancado! Você precisa de uma <strong>chave</strong>.");
      gastouTurno = false;
    } else {
      if (salas[destino].trancado) {
        salas[destino].trancado = false;
        print("🔓 Você destranca o portão pesado com a chave!", "msg-loot");
      }
      jogador.local = destino;
      jogador.furtivo = false;
      beep(240, 80, "sine");
      descreverLocal();
      gastouTurno = false;
    }

  } else if (cmd === "olhar") {
    descreverLocal();
    gastouTurno = false;

  } else if (cmd === "atacar") {
    if (inimigoSala) {
      let dano = rand(jogador.danoMin, jogador.danoMax);
      if (jogador.furtivo) {
        dano *= 2;
        jogador.furtivo = false;
        print(`🗡️ <strong>ATAQUE FURTIVO CRÍTICO!</strong>`, "msg-magic");
      }
      inimigoSala.hp -= dano;
      beep(320, 100);
      print(`⚔️ Você ataca ${inimigoSala.nome} causando <strong>${dano} de dano</strong>!`);
      checarVitoriaOuDerrotaInimigo(inimigoSala);
    } else {
      print("Não há inimigos aqui para atacar.");
      gastouTurno = false;
    }

  } else if (cmd === "defender") {
    jogador.defendendo = true;
    jogador.mp = Math.min(jogador.maxMp, jogador.mp + 8);
    beep(200, 100, "triangle");
    print("🛡️ Você assume postura defensiva (reduz o próximo dano em 70% e recupera +8 Mana).", "msg-heal");

  } else if (cmd === "usar magia") {
    if (jogador.mp < 15) {
      print("💧 Mana insuficiente! (Necessário: 15 MP). Use 'defender' para recuperar.", "msg-magic");
      gastouTurno = false;
    } else if (inimigoSala) {
      jogador.mp -= 15;
      jogador.furtivo = false;
      let dano = rand(jogador.danoMax + 3, jogador.danoMax + 6);
      inimigoSala.hp -= dano;
      beep(580, 180, "sine");
      print(`🔥 Você lança uma Bola de Fogo em ${inimigoSala.nome} causando <strong>${dano} de dano</strong>!`, "msg-magic");
      checarVitoriaOuDerrotaInimigo(inimigoSala);
    } else {
      print("Não há inimigos aqui para alvejar com magia.");
      gastouTurno = false;
    }

  } else if (cmd === "usar furtividade") {
    if (jogador.mp < 10) {
      print("💧 Mana insuficiente! (Necessário: 10 MP).");
      gastouTurno = false;
    } else {
      jogador.mp -= 10;
      jogador.furtivo = true;
      beep(120, 120, "sine");
      print("🥷 Você se oculta nas sombras. O inimigo não te verá neste turno e seu próximo ataque causará o DOBRO de dano!", "msg-magic");
    }

  } else if (cmd === "usar pocao") {
    if (jogador.pocoes > 0) {
      jogador.hp = Math.min(jogador.maxHp, jogador.hp + 40);
      jogador.pocoes--;
      beep(440, 150, "sine");
      print("🧪 Você bebe uma poção e recupera <strong>+40 HP</strong>!", "msg-heal");
    } else {
      print("Você não tem poções restantes.");
      gastouTurno = false;
    }

  } else if (cmd.startsWith("pegar ")) {
    const item = cmd.slice(6).trim();
    const sala = salas[jogador.local];
    if (sala.itensChao.includes(item)) {
      jogador.inventario.push(item);
      sala.itensChao = sala.itensChao.filter(obj => obj !== item);
      beep(380, 100);
      print(`🎒 Você guardou <strong>${item}</strong> no inventário.`, "msg-loot");
    } else {
      print("Esse item não está no chão (se for um objeto do cenário, tente: <em>interagir [nome]</em>).");
      gastouTurno = false;
    }

  } else if (cmd.startsWith("interagir ") || cmd.startsWith("abrir ") || cmd.startsWith("usar ")) {
    const alvo = cmd.split(" ").slice(1).join(" ");
    const sala = salas[jogador.local];

    if (!sala.interagiveis.includes(alvo)) {
      print("Não há nada com esse nome aqui para interagir.");
      gastouTurno = false;
    } else if (alvo === "bau") {
      print("📦 Você abre o baú antigo e encontra <strong>1 Poção</strong> e <strong>15 de Ouro</strong>!", "msg-loot");
      jogador.pocoes++;
      jogador.ouro += 15;
      sala.interagiveis = sala.interagiveis.filter(i => i !== "bau");
      somVitoria();
    } else if (alvo === "mercador") {
      if (jogador.ouro >= 20 && !jogador.inventario.includes("espada")) {
        jogador.ouro -= 20;
        jogador.inventario.push("espada");
        jogador.danoMin += 3;
        jogador.danoMax += 4;
        somVitoria();
        print("🗡️ O mercador te vende uma <strong>Espada de Aço</strong> por 20 de Ouro! Seu ataque subiu muito!", "msg-loot");
      } else if (jogador.ouro >= 10) {
        jogador.ouro -= 10;
        jogador.pocoes++;
        beep(400, 100);
        print("🧪 O mercador te vende <strong>1 Poção de Vida</strong> por 10 de Ouro!", "msg-heal");
      } else {
        print("💬 Mercador: <em>'Traga 20 de ouro para uma Espada nova, ou 10 de ouro para uma Poção!'</em>");
        gastouTurno = false;
      }
    } else if (alvo === "pedestal") {
      if (jogador.inventario.includes("tocha")) {
        print("🔥 Você acende o pedestal com sua tocha! Uma runa antiga restaura todo seu HP e Mana!", "msg-heal");
        jogador.hp = jogador.maxHp;
        jogador.mp = jogador.maxMp;
        sala.interagiveis = sala.interagiveis.filter(i => i !== "pedestal");
        somVitoria();
      } else {
        print("O pedestal possui uma pira apagada. Se você tivesse uma <strong>tocha</strong>, poderia acendê-lo.");
        gastouTurno = false;
      }
    } else if (alvo === "altar") {
      print("Um altar sombrio pulsa com energia abissal.");
      gastouTurno = false;
    }

  } else if (cmd === "inventario") {
    print(`📦 Itens: <strong>${jogador.inventario.join(", ") || "nenhum"}</strong> | 🧪 Poções: <strong>${jogador.pocoes}</strong> | 🪙 Ouro: <strong>${jogador.ouro}</strong>`);
    gastouTurno = false;

  } else if (cmd === "ajuda") {
    print("📜 <strong>Comandos disponíveis:</strong>");
    print("• <em>ir [local]</em> — move para outra área (ex: ir caverna)");
    print("• <em>interagir [objeto]</em> — interage com baú, mercador, pedestal");
    print("• <em>pegar [item]</em> — coleta itens do chão (ex: pegar tocha)");
    print("• <em>atacar</em> / <em>defender</em> / <em>usar magia</em> / <em>usar furtividade</em> / <em>usar pocao</em>");
    gastouTurno = false;

  } else {
    print("Comando não reconhecido. Digite <strong>ajuda</strong> ou use os botões abaixo.");
    gastouTurno = false;
  }

  if (gastouTurno && jogador.hp > 0) {
    turnoDoInimigo();
  }
  atualizarHUD();
}

// Eventos dos botões rápidos
document.querySelectorAll(".quick-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    if (input.disabled) return;
    const cmd = btn.getAttribute("data-cmd");
    print(`&gt; ${cmd}`, "msg-cmd");
    handleCommand(cmd);
    input.focus();
  });
});

// Evento da barra de digitação
input.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    const cmd = input.value;
    if (!cmd.trim()) return;
    print(`&gt; ${cmd}`, "msg-cmd");
    input.value = "";
    handleCommand(cmd);
  }
});

// Inicialização do Jogo
print("🎮 <strong>BEM-VINDO AO RPG TERMINAL - EDIÇÃO MODULAR</strong> 🇧🇷");
print("Dica: Derrote os monstros, compre uma espada na cabana e encontre a chave para o Santuário!");
descreverLocal();
atualizarHUD();