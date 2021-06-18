import k from '../k.js';
import grilla from '../comp/grilla.js';
import draggable from '../comp/draggable.js';
import { JUEGO, HUECO } from '../datos.js';

function juegoComp() {
  return {
    add() {
      this.hidden = true;
      this.on('dragEnd', () => {
        this.hidden = true;
      });
    },
    grab(id) {
      this.drag(id);
      this.changeSprite(id);
      this.hidden = false;
      return id;
    },
  };
}
export default function () {
  k.add([k.sprite(HUECO), grilla(1, 0), draggable(), juegoComp(), JUEGO]);
}
