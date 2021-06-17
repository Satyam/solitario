import { MAZO, VISTA, HUECO } from '../datos.js';
import k from '../k.js';
import grilla from '../comp/grilla.js';

export function vistaComp() {
  const cartas = [];

  return {
    add() {
      k.on('popped', MAZO, (_, id) => {
        console.log('en vista', id);
        cartas.push(id);
        this.changeSprite(id);
      });
    },
    vuelta() {
      const ret = Array.from(cartas).reverse();
      cartas.length = 0;
      this.changeSprite(HUECO);
      return ret;
    },
  };
}

export default function () {
  k.add([k.sprite(HUECO), grilla(1, 0), vistaComp(), VISTA]);
}
