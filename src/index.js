import k from './k.js';
import './loadSprites.js';

import mazo from './obj/mazo.js';
import vista from './obj/vista.js';
import juego from './obj/juego.js';

k.scene('main', () => {
  // k.layers(['bg', 'game', 'ui'], 'game');

  mazo();
  vista();
  juego();
});

k.start('main');
