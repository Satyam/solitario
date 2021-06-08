import k from './k.js';

k.loadSprite('bg', 'src/bg.svg');
k.loadSprite('hueco', 'src/hueco.svg');

export const cellWidth = k.width() / 7;
export const cellHeight = k.height() / 3;

export const margin = 100;
export const tablero = () => {
  // fondo
  k.add([
    k.sprite('bg'),
    k.scale(k.width() / 10, k.height() / 10),
    k.origin('topleft'),
    k.layer('bg'),
  ]);

  [
    // Fila superior
    [0, 0], // mazo
    [1, 0], // nueva carta

    [3, 0], // 4 pilas finales
    [4, 0],
    [5, 0],
    [6, 0],

    // Fila inferior
    [0, 1], // 7 posiciones de juego
    [1, 1],
    [2, 1],
    [3, 1],
    [4, 1],
    [5, 1],
    [6, 1],
  ].forEach(([x, y]) => {
    k.add([
      k.sprite('hueco'),
      // k.pos((x + 0.5) * cellWidth, (y + 0.5) * cellHeight),
      k.pos(x * cellWidth + margin, y * cellHeight + margin),
      k.layer('bg'),
    ]);
  });
};
