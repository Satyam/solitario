import k from '../k.js';
import grilla from '../comp/grilla.js';
import draggable from '../comp/draggable.js';
import { JUEGO, HUECO, PILA, VISTA, EN_HUECO } from '../datos.js';

function juegoComp() {
  return {
    add() {
      this.hidden = true;
      this.on('dragEnd', () => {
        let dropped = false;
        console.log('soltado');
        k.every(EN_HUECO, (eh) => {
          if (!dropped && this.isOverlapped(eh)) {
            const h = eh.is(HUECO) ? eh : eh.parent;
            console.log('Soltado sobre hueco', h.slot(), this.cardId);
            console.log('drop', (dropped = h.drop(this.cardId)));
          }
        });
        k.every(PILA, (p) => {
          if (!dropped && this.isOverlapped(p)) {
            console.log('Soltado sobre pila', p.slot(), this.cardId);
            console.log('drop', (dropped = p.drop(this.cardId)));
          }
        });
        if (!dropped) {
          k.getFirst(VISTA).push(this.cardId);
        }
        this.hidden = true;
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
