import k from './k.js';
import './loadSprites.js';

import mazo from './obj/mazo.js';
import vista from './obj/vista.js';

k.scene('main', () => {
  k.layers(['bg', 'game', 'ui'], 'game');

  mazo();
  vista();

  // mazo.on('popped', (id) => {
  //   console.log(id, cartas[id]);
  //   const carta = k.add([
  //     k.sprite(id),
  //     k.pos(300, 100),
  //     draggable(true),
  //     k.color(),
  //     { name: id },
  //   ]);
  // });
});

k.start('main');
