const CHAVE_SAVE = "rpg_terminal_v2_save";

export function salvarJogo(jogador, salas, inimigos, missoes) {
  const dados = {
    jogador,
    salas: JSON.parse(JSON.stringify(salas)),
    inimigos: JSON.parse(JSON.stringify(inimigos)),
    missoes: JSON.parse(JSON.stringify(missoes)),
    timestamp: new Date().toISOString()
  };
  try {
    localStorage.setItem(CHAVE_SAVE, JSON.stringify(dados));
    return true;
  } catch (e) {
    return false;
  }
}

export function carregarJogo() {
  try {
    const salvo = localStorage.getItem(CHAVE_SAVE);
    return salvo ? JSON.parse(salvo) : null;
  } catch (e) {
    return null;
  }
}

export function apagarSave() {
  localStorage.removeItem(CHAVE_SAVE);
}
