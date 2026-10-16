export const classesPersonagem = {
  "guerreiro": {
    nome: "Guerreiro",
    descricao: "Especialista em combate físico, alta resistência e dano corpo a corpo brutal.",
    hpMax: 130,
    mpMax: 30,
    danoMin: 4,
    danoMax: 7,
    habilidadesIniciais: ["investida"],
    bonusOuro: 5
  },
  "mago": {
    nome: "Mago",
    descricao: "Mestre das artes arcanas. Causa dano devastador com magias, mas possui baixa defesa.",
    hpMax: 80,
    mpMax: 100,
    danoMin: 1,
    danoMax: 3,
    habilidadesIniciais: ["bola de fogo", "escudo arcano"],
    bonusOuro: 15
  },
  "druida": {
    nome: "Druida",
    descricao: "Conectado aos espíritos da natureza. Capaz de curar ferimentos e invocar vinhas sufocantes.",
    hpMax: 100,
    mpMax: 70,
    danoMin: 3,
    danoMax: 5,
    habilidadesIniciais: ["cura natural", "vinhas espinhosas"],
    bonusOuro: 10
  },
  "ladino": {
    nome: "Ladino",
    descricao: "Ágil e mortal nas sombras. Especializado em ataques furtivos críticos e esquivas.",
    hpMax: 90,
    mpMax: 50,
    danoMin: 3,
    danoMax: 6,
    habilidadesIniciais: ["furtividade", "ataque surpresa"],
    bonusOuro: 25
  }
};
```eof

```javascript:js/dados/mapa.js
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
```eof

```javascript:js/dados/inimigos.js
export const inimigos = [
  { nome: "Goblin Batedor", hp: 12, maxHp: 12, dano: 6, xp: 15, ouro: 12, local: "floresta" },
  { nome: "Limo Ácido", hp: 18, maxHp: 18, dano: 10, xp: 22, ouro: 15, local: "pantano" },
  { nome: "Fera Sombria", hp: 25, maxHp: 25, dano: 14, xp: 35, ouro: 25, local: "caverna", drop: "chave" },
  { nome: "Morcego das Cavernas", hp: 15, maxHp: 15, dano: 9, xp: 18, ouro: 10, local: "minas" },
  { nome: "Yeti das Neves", hp: 45, maxHp: 45, dano: 18, xp: 55, ouro: 40, local: "pico" },
  { nome: "Golem de Pedra", hp: 60, maxHp: 60, dano: 22, xp: 70, ouro: 50, local: "ruinas" },
  { nome: "Espectro Arcano", hp: 40, maxHp: 40, dano: 25, xp: 65, ouro: 45, local: "torre" },
  { nome: "Sacerdote Caído", hp: 70, maxHp: 70, dano: 28, xp: 90, ouro: 80, local: "templo" },
  { nome: "Guardião Abissal (CHEFE)", hp: 120, maxHp: 120, dano: 35, xp: 300, ouro: 250, local: "santuario", boss: true }
];
