import { REVERSO, HUECO, SEL, DATA, tCardId } from './datos.js';
import { imgSrc, cardImg } from './utils.js';

export const renderMazo = () => {
  const mazo = $(SEL.MAZO);
  mazo
    .children()
    .prop('src', imgSrc(mazo.data(DATA.cardIds).length ? REVERSO : HUECO));
};

export const renderVista = () => {
  const vista = $(SEL.VISTA);
  vista.children().prop('src', imgSrc(vista.data(DATA.cardIds)[0] || HUECO));
};

export const renderPilas = () => {
  $(SEL.PILAS).each(function () {
    const p = $(this);
    p.children().prop('src', imgSrc(p.data(DATA.cardIds)[0] || HUECO));
  });
};

export const renderPila = (slot: number) => {
  const pila = $(SEL.PILAS).eq(slot);
  pila.children().prop('src', imgSrc(pila.data(DATA.cardIds)[0] || HUECO));
};

const renderHuecoStack = (
  cardIds: tCardId[],
  firstShown: number,
  index: number
): string => {
  const [cardId, ...rest] = cardIds;

  return rest.length
    ? `<div><div class="short">${cardImg(
        index < firstShown ? REVERSO : cardId
      )}</div>${renderHuecoStack(rest, firstShown, index + 1)}</div>`
    : cardImg(cardId);
};

const renderOneHueco = (h: JQuery, slot: number) => {
  const cardIds = h.data(DATA.cardIds);
  const firstShown = h.data(DATA.firstShown);
  h.html(
    cardIds.length ? renderHuecoStack(cardIds, firstShown, 0) : cardImg(HUECO)
  );
};
export const renderHuecos = () => {
  $(SEL.HUECOS).each(function (slot) {
    renderOneHueco($(this), slot);
  });
};
export const renderHueco = (slot: number) => {
  renderOneHueco($(SEL.HUECOS).eq(slot), slot);
};
