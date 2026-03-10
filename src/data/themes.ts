export const DRAWING_THEMES = [
  "A cidade do futuro",
  "Floresta encantada",
  "Carnaval dos sonhos",
  "O fundo do oceano",
  "Vida no sertão",
  "Noite estrelada no Rio",
  "Animais da Amazônia",
  "Festival de cores",
  "O último pôr do sol",
  "Música que se vê",
  "Lendas do folclore",
  "Sabores do Brasil",
  "Tempestade de emoções",
  "Jardim secreto",
  "Dança das sombras",
  "O primeiro voo",
  "Memórias de infância",
  "Natureza em resistência",
  "Sonho de liberdade",
  "O circo chegou",
];

export function getRandomTheme(): string {
  return DRAWING_THEMES[Math.floor(Math.random() * DRAWING_THEMES.length)];
}
