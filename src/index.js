import k from './k.js';
import './loadSprites.js';
import { baraja, barajar } from './baraja.js';
import { tablero } from './tablero.js';

k.scene('main', () => {
  k.layers(['bg', 'game', 'ui'], 'game');
  if (baraja.length === 0) barajar();

  tablero();
  const mazo = k.add([k.sprite('reverso'), k.pos(100, 100)]);

  mazo.clicks((...args) => {
    const carta = k.add([
      k.sprite(baraja.pop()),
      k.pos(100, 100),
      k.body(),
      k.rotate(0),
    ]);
    carta.action(() => {
      carta.move(200, 0);
      carta.angle -= 0.05;

      if (carta.pos.y >= k.height()) {
        k.destroy(carta);
      }
    });
  });
});

k.start('main');
