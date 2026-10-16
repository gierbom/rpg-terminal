export const salas = {
  "floresta": {
    nome: "Floresta Escura",
    descricao: "Árvores retorcidas bloqueiam a luz da lua. Há um baú antigo entre as raízes.",
    saidas: ["cabana", "caverna"],
    interagiveis: ["bau"],
    itensChao: []
  },
  "cabana": {
    nome: "Cabana Abandonada",
    descricao: "Uma cabana de madeira em ruínas. Um mercador misterioso descansa perto da lareira.",
    saidas: ["floresta"],
    interagiveis: ["mercador"],
    itensChao: ["tocha"]
  },
  "caverna": {
    nome: "Caverna Úmida",
    descricao: "Goteiras ecoam na escuridão. Ao fundo, há uma porta trancada e um pedestal brilhante.",
    saidas: ["floresta", "santuario"],
    interagiveis: ["pedestal"],
    itensChao: []
  },
  "santuario": {
    nome: "Santuário Profano",
    descricao: "Um salão colossal iluminado por chamas azuis. O ar é pesado e mortal.",
    saidas: ["caverna"],
    interagiveis: ["altar"],
    itensChao: [],
    trancado: true
  }
};