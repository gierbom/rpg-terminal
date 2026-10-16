// js/save.js

const CHAVE_SAVE = "rpg_terminal_save_data";

export function salvarJogo(jogador, salas, inimigos) {
  const dadosDoJogo = {
    jogador: jogador,
    // Salvamos uma cópia do estado atual das salas (objetos pegos, portas abertas, etc)
    salas: JSON.parse(JSON.stringify(salas)),
    // Salvamos o HP atual dos inimigos e quais foram derrotados
    inimigos: JSON.parse(JSON.stringify(inimigos)),
    timestamp: new Date().toISOString()
  };

  try {
    localStorage.setItem(CHAVE_SAVE, JSON.stringify(dadosDoJogo));
    return true;
  } catch (e) {
    console.error("Erro ao salvar o jogo:", e);
    return false;
  }
}

export function carregarJogo() {
  try {
    const dadosSalvos = localStorage.getItem(CHAVE_SAVE);
    if (!dadosSalvos) return null;
    return JSON.parse(dadosSalvos);
  } catch (e) {
    console.error("Erro ao carregar o save:", e);
    return null;
  }
}

export function apagarSave() {
  try {
    localStorage.removeItem(CHAVE_SAVE);
    return true;
  } catch (e) {
    console.error("Erro ao apagar o save:", e);
    return false;
  }
}
