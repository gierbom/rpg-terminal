export const salas = {
  "vila": {
    nome: "Vila de Oakhaven",
    descricao: "Uma vila pacífica protegida por cercas de madeira. O ancião local e um ferreiro observam os viajantes.",
    saidas: ["floresta", "taverna"],
    interagiveis: ["anciao", "ferreiro"],
    itensChao: []
  },
  "taverna": {
    nome: "Taverna do Javali Sorridente",
    descricao: "Cheiro de cerveja barata e ensopado quente. Um bardo canta canções antigas no canto.",
    saidas: ["vila"],
    interagiveis: ["bardo", "estalajadeiro"],
    itensChao: ["copo de cerveja"]
  },
  "floresta": {
    nome: "Floresta Escura",
    descricao: "Árvores retorcidas bloqueiam a luz da lua. Trilha perigosa que leva mais fundo nas terras selvagens.",
    saidas: ["vila", "cabana", "pantano"],
    interagiveis: ["bau"],
    itensChao: []
  },
  "cabana": {
    nome: "Cabana Abandonada",
    descricao: "Uma cabana de madeira em ruínas perto de uma lareira fria.",
    saidas: ["floresta"],
    interagiveis: ["mercador"],
    itensChao: ["tocha"]
  },
  "pantano": {
    nome: "Pântano Venenoso",
    descricao: "Águas lodosas e borbulhantes exalam um gás tóxico. O solo cede sob os pés.",
    saidas: ["floresta", "caverna", "ruinas"],
    interagiveis: ["esqueleto"],
    itensChao: ["erva medicinal"]
  },
  "caverna": {
    nome: "Caverna Úmida",
    descricao: "Goteiras ecoam na escuridão. Ao fundo, há uma passagem secreta bloqueada.",
    saidas: ["pantano", "santuario", "minas"],
    interagiveis: ["pedestal"],
    itensChao: []
  },
  "minas": {
    nome: "Minas Abandonadas de Aço-Negro",
    descricao: "Trilhos enferrujados de mineração entram em galerias profundas e perigosas.",
    saidas: ["caverna", "pico"],
    interagiveis: ["carrinho"],
    itensChao: ["pedra de amolar"]
  },
  "pico": {
    nome: "Pico Nevado de Frostpeak",
    descricao: "Ventos gelados cortam a pele. O ar rarefeito dificulta a respiração.",
    saidas: ["minas", "templo"],
    interagiveis: ["estatua congelada"],
    itensChao: ["cristal de gelo"]
  },
  "ruinas": {
    nome: "Ruínas do Império Esquecido",
    descricao: "Pilares caídos cobertos por musgo místico e runas esquecidas.",
    saidas: ["pantano", "torre"],
    interagiveis: ["monolito"],
    itensChao: ["pergaminho antigo"]
  },
  "torre": {
    nome: "Torre do Arquimago Louco",
    descricao: "Livros flutuam no ar e faíscas mágicas estalam pelas paredes de pedra cinzenta.",
    saidas: ["ruinas"],
    interagiveis: ["grimorio"],
    itensChao: ["essencia arcana"]
  },
  "templo": {
    nome: "Templo do Sol Eclipsado",
    descricao: "Um altar colosso de obsidiana erguido sob uma lua negra permanente.",
    saidas: ["pico"],
    interagiveis: ["altar principal"],
    itensChao: []
  },
  "santuario": {
    nome: "Santuário Profano",
    descricao: "Um salão colossal iluminado por chamas azuis onde repousa a entidade final.",
    saidas: ["caverna"],
    interagiveis: ["trono"],
    itensChao: [],
    trancado: true
  }
};
