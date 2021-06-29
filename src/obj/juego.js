import k from '../k.js';
import grilla from '../comp/grilla.js';
import draggable from '../comp/draggable.js';
import { JUEGO, HUECO, MAZO } from '../datos.js';

function juegoComp() {
  let cardId = null;
  return {
    add() {
      this.hidden = true;
      this.on('dragEnd', () => {
        this.hidden = true;
        console.log('soltado');
        k.every(HUECO, (h) => {
          if (this.isOverlapped(h)) {
            console.log('j soltado sobre hueco', h.slot(), this.cardId);
          }
        });
      });
    },
    grab(cardId) {
      this.cardId = cardId;
      this.drag(cardId);
      this.changeSprite(cardId);
      this.hidden = false;
      return cardId;
    },
  };
}
export default function () {
  k.add([k.sprite(HUECO), grilla(1, 0), draggable(), juegoComp(), JUEGO]);
}
