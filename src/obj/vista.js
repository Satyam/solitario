import k from '../k.js';
import grilla from '../comp/grilla.js';
import { MAZO, VISTA, HUECO, JUEGO } from '../datos.js';

export function vistaComp() {
  const cartas = [];
  let dragSensed = false;

  return {
    add() {
      k.on('popped', MAZO, (_, cardId) => {
        this.push(cardId);
      });
      k.mouseDown(() => {
        if (dragSensed || cartas.length === 0 || !this.hasPt(k.mousePos()))
          return;
        dragSensed = true;
        const j = k.getFirst(JUEGO);
        if (j.grab(this.getTop())) {
          cartas.pop();
          this.changeSprite(this.getTop() || HUECO);
        }
      });
      k.mouseRelease(() => {
        dragSensed = false;
      });
    },
    push(cardId) {
      cartas.push(cardId);
      this.changeSprite(cardId);
    },
    vuelta() {
      const ret = Array.from(cartas).reverse();
      cartas.length = 0;
      this.changeSprite(HUECO);
      return ret;
    },
    getTop() {
      const l = cartas.length;
      return l ? cartas[l - 1] : null;
    },
  };
}

export default function () {
  k.add([k.sprite(HUECO), grilla(1, 0), vistaComp(), VISTA]);
}
