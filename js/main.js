import { beep, somVitoria } from './audio.js';
import { salas as salasOriginais } from './dados/mapa.js';
import { inimigos as inimigosOriginais } from './dados/inimigos.js';
import { missoes as missoesOriginais } from './dados/quests.js';
import { classesPersonagem } from './dados/classes.js';
import { salvarJogo, carregarJogo, apagarSave } from './save.js';

const output = document.getElementById("output");
const input = document.getElementById("commandInput");

let salas = JSON.parse(JSON.stringify(salasOriginais));
let inimigos = JSON.parse(JSON.stringify(inimigosOriginais));
let missoes = JSON.parse(JSON.stringify(missoesOriginais));

let jogador = null;
let aguardandoSelecaoClasse = false;

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
  if (!jogador) return;
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
    jogador.xpProximo = Math.floor(jogador.xpProximo * 1.5);
    jogador.maxHp += 25;
    jogador.hp = jogador.maxHp;
    jogador.maxMp += 15;
    jogador.mp = jogador.maxMp;
    jogador.danoMin += 2;
    jogador.danoMax += 3;
    somVitoria();
    print(`🎉 <strong>SUBIU DE NÍVEL!</strong> Nível ${jogador.nivel} alcançado!`, "msg-heal");
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

    if (alvo.local === "pantano" && missoes["purificar_pantano"].ativa && !missoes["purificar_pantano"].concluida) {
      missoes["purificar_pantano"].concluida = true;
      jogador.ouro += missoes["purificar_pantano"].recompensaOuro;
      ganharXP(missoes["purificar_pantano"].recompensaXp);
      print(`📜 <strong>Missão Concluída:</strong> A Praga do Pântano! Recompensa recebida!`, "msg-quest");
    }

    if (alvo.boss) {
      print(`👑 <strong>PARABÉNS!</strong> Você expurgou o Guardião Abissal e salvou o reino!`, "msg-heal");
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
    print(`💨 ${e.nome} procura por você nas sombras sem sucesso!`);
    return;
  }

  let dano = rand(Math.floor(e.dano * 0.7), e.dano);
  if (jogador.defendendo) {
    dano = Math.max(1, Math.floor(dano * 0.3));
    print(`🛡️ Sua defesa bloqueou grande parte do ataque!`);
    jogador.defendendo = false;
  }

  jogador.hp = Math.max(0, jogador.hp - dano);
  beep(160, 150, "sawtooth");
  print(`💥 ${e.nome} te ataca causando <strong>${dano} de dano</strong>!`, "msg-combat");

  if (jogador.hp <= 0) {
    print("💀 Você caiu em combate... Digite <strong>reiniciar</strong> para tentar de novo.", "msg-combat");
    apagarSave();
    input.disabled = true;
  }
}

function iniciarSelecaoClasse() {
  aguardandoSelecaoClasse = true;
  print("⚔️ <strong>ESCOLHA SUA CLASSE DE HERÓI:</strong>");
  for (let key in classesPersonagem) {
    let c = classesPersonagem[key];
    print(`• <strong>${c.nome.toUpperCase()}</strong>: ${c.descricao} (HP: ${c.hpMax} | MP: ${c.mpMax})<br><em>Digite: escolher ${key}</em>`);
  }
}

function processarComando(cmd) {
  cmd = cmd.trim().toLowerCase();
  if (!cmd) return;

  if (input.disabled) {
    if (cmd === "reiniciar") {
      apagarSave();
      location.reload();
    }
    return;
  }

  if (aguardandoSelecaoClasse) {
    if (cmd.startsWith("escolher ")) {
      let escolha = cmd.slice(9).trim();
      if (classesPersonagem[escolha]) {
        let template = classesPersonagem[escolha];
        jogador = {
          classe: template.nome,
          hp: template.hpMax, maxHp: template.hpMax,
          mp: template.mpMax, maxMp: template.mpMax,
          nivel: 1, xp: 0, xpProximo: 30,
          ouro: template.bonusOuro,
          danoMin: template.danoMin, danoMax: template.danoMax,
          pocoes: 3,
          local: "vila",
          inventario: [],
          habilidades: [...template.habilidadesIniciais],
          defendendo: false,
          furtivo: false
        };
        aguardandoSelecaoClasse = false;
        print(`✨ Você escolheu a classe <strong>${template.nome}</strong>! Sua jornada começa na Vila de Oakhaven.`, "msg-heal");
        salvarJogo(jogador, salas, inimigos, missoes);
        descreverLocal();
        atualizarHUD();
      } else {
        print("Classe inválida. Escolha entre: guerreiro, mago, druida, ladino.");
      }
    } else {
      print("Por favor, digite <em>escolher [guerreiro/mago/druida/ladino]</em> para iniciar.");
    }
    return;
  }

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
        print("🔓 Você destranca o portão!", "msg-loot");
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
      print("Não há inimigos aqui.");
      gastouTurno = false;
    }

  } else if (cmd === "defender") {
    jogador.defendendo = true;
    jogador.mp = Math.min(jogador.maxMp, jogador.mp + 10);
    beep(200, 100, "triangle");
    print("🛡️ Postura defensiva ativada (reduz dano e recupera 10 Mana).", "msg-heal");

  } else if (cmd.startsWith("usar ")) {
    const habOuItem = cmd.slice(5).trim();
    if (habOuItem === "pocao" || habOuItem === "poção") {
      if (jogador.pocoes > 0) {
        jogador.hp = Math.min(jogador.maxHp, jogador.hp + 45);
        jogador.pocoes--;
        beep(440, 150, "sine");
        print("🧪 Poção usada (+45 HP).", "msg-heal");
      } else {
        print("Sem poções.");
        gastouTurno = false;
      }
    } else if (habOuItem === "bola de fogo" || habOuItem === "magia") {
      if (jogador.mp < 20) {
        print("💧 Mana insuficiente (20 MP necessário).");
        gastouTurno = false;
      } else if (inimigoSala) {
        jogador.mp -= 20;
        let dano = rand(15, 25);
        inimigoSala.hp -= dano;
        beep(580, 180, "sine");
        print(`🔥 Bola de Fogo em ${inimigoSala.nome} causa <strong>${dano} de dano</strong>!`, "msg-magic");
        checarVitoriaOuDerrotaInimigo(inimigoSala);
      } else {
        print("Sem alvos para magia aqui.");
        gastouTurno = false;
      }
    } else if (habOuItem === "cura natural") {
      if (jogador.mp < 15) {
        print("💧 Mana insuficiente (15 MP necessário).");
        gastouTurno = false;
      } else {
        jogador.mp -= 15;
        jogador.hp = Math.min(jogador.maxHp, jogador.hp + 35);
        beep(500, 120, "sine");
        print("🌿 Magia druídica restaura <strong>+35 HP</strong>!", "msg-heal");
      }
    } else if (habOuItem === "furtividade" || habOuItem === "ataque surpresa") {
      if (jogador.mp < 12) {
        print("💧 Mana insuficiente.");
        gastouTurno = false;
      } else {
        jogador.mp -= 12;
        jogador.furtivo = true;
        beep(120, 120, "sine");
        print("🥷 Você se oculta nas sombras para o próximo ataque!", "msg-magic");
      }
    } else {
      print("Habilidade ou item desconhecido.");
      gastouTurno = false;
    }

  } else if (cmd.startsWith("pegar ")) {
    const item = cmd.slice(6).trim();
    const sala = salas[jogador.local];
    if (sala.itensChao.includes(item)) {
      jogador.inventario.push(item);
      sala.itensChao = sala.itensChao.filter(i => i !== item);
      beep(380, 100);
      print(`🎒 Você pegou: <strong>${item}</strong>.`, "msg-loot");
    } else {
      print("Item não encontrado no chão.");
      gastouTurno = false;
    }

  } else if (cmd.startsWith("interagir ")) {
    const alvo = cmd.slice(10).trim();
    const sala = salas[jogador.local];
    if (!sala.interagiveis.includes(alvo)) {
      print("Nada com esse nome para interagir.");
      gastouTurno = false;
    } else if (alvo === "anciao") {
      print("👴 Ancião: <em>'Herói, o Pântano foi tomado por criaturas vis. Ajude-nos e será recompensado!'</em>");
      if (!missoes["purificar_pantano"].ativa) {
        missoes["purificar_pantano"].ativa = true;
        print("📜 <strong>Nova Missão Aceita:</strong> A Praga do Pântano!", "msg-quest");
      }
      gastouTurno = false;
    } else if (alvo === "ferreiro") {
      if (jogador.ouro >= 30 && !jogador.inventario.includes("espada mítica")) {
        jogador.ouro -= 30;
        jogador.inventario.push("espada mítica");
        jogador.danoMin += 4;
        jogador.danoMax += 6;
        somVitoria();
        print("⚒️ O Ferreiro forja uma Espada Mítica para você! Seu ataque aumentou drasticamente!", "msg-loot");
      } else {
        print("⚒️ Ferreiro: <em>'Traga-me 30 de ouro para forjar uma arma lendária.'</em>");
      }
      gastouTurno = false;
    } else if (alvo === "bardo") {
      print("🎶 O bardo toca uma melodia revigorante. Você ganha +10 de Mana!");
      jogador.mp = Math.min(jogador.maxMp, jogador.mp + 10);
      gastouTurno = false;
    } else if (alvo === "mercador") {
      if (jogador.ouro >= 12) {
        jogador.ouro -= 12;
        jogador.pocoes++;
        print("🧪 Você comprou 1 Poção de Vida.", "msg-heal");
      } else {
        print("Mercador: <em>'Você precisa de 12 de ouro.'</em>");
      }
      gastouTurno = false;
    } else if (alvo === "bau") {
      print("📦 O baú continha <strong>20 de Ouro</strong> e <strong>1 Poção</strong>!", "msg-loot");
      jogador.ouro += 20;
      jogador.pocoes++;
      sala.interagiveis = sala.interagiveis.filter(i => i !== "bau");
      somVitoria();
    } else {
      print("Você interage com " + alvo + ", mas nada de especial acontece.");
      gastouTurno = false;
    }

  } else if (cmd === "inventario") {
    print(`📦 Inventário: <strong>${jogador.inventario.join(", ") || "vazio"}</strong> | 🧪 Poções: <strong>${jogador.pocoes}</strong> | 🪙 Ouro: <strong>${jogador.ouro}</strong>`);
    print(`⚡ Habilidades: <strong>${jogador.habilidades.join(", ")}</strong>`);
    gastouTurno = false;

  } else if (cmd === "missoes" || cmd === "missões") {
    print("📜 <strong>Missões Ativas:</strong>");
    for (let k in missoes) {
      let m = missoes[k];
      if (m.ativa) {
        let status = m.concluida ? "✅ (Concluída)" : "⏳ (Em Andamento)";
        print(`• <strong>${m.titulo}</strong> ${status}: ${m.descricao}`);
      }
    }
    gastouTurno = false;

  } else if (cmd === "ajuda") {
    print("📜 <strong>Comandos:</strong> ir [local], olhar, atacar, defender, pegar [item], interagir [nome], usar [item/hab], inventario, missoes, reiniciar");
    gastouTurno = false;

  } else {
    print("Comando inválido. Digite <strong>ajuda</strong>.");
    gastouTurno = false;
  }

  if (gastouTurno && jogador.hp > 0) {
    turnoDoInimigo();
  }

  if (jogador && jogador.hp > 0) {
    salvarJogo(jogador, salas, inimigos, missoes);
  }

  atualizarHUD();
}

document.querySelectorAll(".quick-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    if (input.disabled) return;
    const cmd = btn.getAttribute("data-cmd");
    print(`&gt; ${cmd}`, "msg-cmd");
    processarComando(cmd);
    input.focus();
  });
});

input.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    const cmd = input.value;
    if (!cmd.trim()) return;
    print(`&gt; ${cmd}`, "msg-cmd");
    input.value = "";
    processarComando(cmd);
  }
});

print("🎮 <strong>BEM-VINDO AO RPG TERMINAL - EDIÇÃO ÉPICA EXPANDIDA</strong> 🇧🇷");
const jogoSalvo = carregarJogo();
if (jogoSalvo) {
  jogador = jogoSalvo.jogador;
  salas = jogoSalvo.salas;
  inimigos = jogoSalvo.inimigos;
  missoes = jogoSalvo.missoes;
  print("📂 <strong>Progresso carregado com sucesso!</strong>", "msg-heal");
  descreverLocal();
  atualizarHUD();
} else {
  iniciarSelecaoClasse();
}
