import { tCardId, baraja, SEL, DATA } from './datos.js';
import { shuffle } from './utils.js';
import {
  renderMazo,
  renderVista,
  renderPilas,
  renderHuecos,
} from './render.js';

export const initNewGame = (): void => {
  $(SEL.PILAS).data(DATA.cardIds, []);
  $(SEL.VISTA).data(DATA.cardIds, []);

  const cardIds = shuffle<tCardId[]>(Object.keys(baraja) as tCardId[]);

  $(SEL.HUECOS).each(function (slot) {
    $(this).data({
      cardIds: cardIds.splice(0, slot + 1),
      firstShown: slot,
    });
  });

  // Place the remaining cards in the mazo.
  $('#mazo').data(DATA.cardIds, cardIds);

  renderMazo();
  renderVista();
  renderPilas();
  renderHuecos();
};
