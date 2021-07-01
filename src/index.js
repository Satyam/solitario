import k from './k.js';
import './loadSprites.js';

import mazo from './obj/mazo.js';
import vista from './obj/vista.js';
import juego from './obj/juego.js';
import huecos from './obj/hueco.js';
import pilas from './obj/pila.js';

k.scene('main', () => {
  mazo();
  vista();
  huecos();
  pilas();

  // Siempre último para que vaya sobre los demás
  juego();
});

k.start('main');
