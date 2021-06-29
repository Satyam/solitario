import k from './k.js';
import { baraja, HUECO, REVERSO } from './datos.js';

Object.keys(baraja).forEach((cardId) =>
  k.loadSprite(cardId, `cards/${cardId}.svg`)
);

k.loadSprite(REVERSO, 'cards/2B.svg');
k.loadSprite(HUECO, 'src/hueco.svg');
