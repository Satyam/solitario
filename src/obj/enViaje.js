import k from '../k.js';
import {
  HUECO,
  PILA,
  CARTAS_EN_VIAJE,
  CARTA_EN_VIAJE,
  OFFSET_PILA,
} from '../datos.js';

export function cartaEnViaje(cardId, index) {
  return {
    update() {
      this.pos = k.mousePos().add(k.vec2(0, index * OFFSET_PILA));
    },
  };
}

export function enViajeComp(cartas) {
  return {
    add() {
      cartas.forEach((cardId, index) => {
        k.add([k.sprite(cardId), cartaEnViaje(cardId, index), CARTA_EN_VIAJE]);
      });

      k.mouseRelease(() => {
        let dropped = false;
        console.log('soltado');
        // k.every(EN_HUECO, (eh) => {
        //   // Ojo!: Ver qué pasa si la pila en HUECO está vacía
        //   // Puede que deba hacer otro loop sobre HUECO mismo, además de EN_HUECO
        //   if (!dropped && this.isOverlapped(eh)) {
        //     const h = eh.is(HUECO) ? eh : eh.parent;
        //     console.log('Soltado sobre hueco', h.slot(), this.cardId);
        //     console.log('drop', (dropped = h.drop(this.cardId)));
        //   }
        // });
        k.every(PILA, (p) => {
          if (!dropped && cartas.length === 1 && p.hasPt(k.mousePos())) {
            console.log('Soltado sobre pila', p.slot(), this.cardId);
            console.log('drop', (dropped = p.drop(cartas[0])));
          }
        });
        // if (!dropped) {
        //   k.getFirst(VISTA).push(this.cardId);
        // }
      });
      this.on('destroy', () => {
        k.every(CARTA_EN_VIAJE, (c) => k.destroy(c));
      });
    },
  };
}

export default function (cardIds, topCard) {
  console.log('enViaje', cardIds, topCard);
  return k.add([
    k.area(topCard.pos, topCard.pos.add(k.vec2(topCard.width, topCard.height))),
    k.color(k.rgb(1, 0, 0)),
    enViajeComp(cardIds),
    CARTAS_EN_VIAJE,
  ]);
}
