import k from '../k.js';

export const cellWidth = k.width() / 7;
export const cellHeight = k.height() / 3;

export const margin = 100;
export default function grilla(x, y) {
  return {
    add() {
      this.use(k.pos(x * cellWidth + margin, y * cellHeight + margin));
    },
  };
}
