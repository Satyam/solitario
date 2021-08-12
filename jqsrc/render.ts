import { REVERSO, HUECO, SEL, datos, tCardId } from './datos.js';
import { imgSrc, cardImg } from './utils.js';

export const renderMazo = () => {
  $(SEL.MAZO)
    .children()
    .prop('src', imgSrc(datos.mazo.length ? REVERSO : HUECO));
};

export const renderVista = () => {
  $(SEL.VISTA)
    .children()
    .prop('src', imgSrc(datos.vista[0] || HUECO));
};

export const renderPilas = () => {
  $(SEL.PILAS).each(function (slot) {
    $(this)
      .children()
      .prop('src', imgSrc(datos.pilas[slot][0] || HUECO));
  });
};

export const renderPila = (slot: number) => {
  $(SEL.PILAS)
    .eq(slot)
    .children()
    .prop('src', imgSrc(datos.pilas[slot][0] || HUECO));
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
  const cardIds = datos.huecos[slot];
  h.html(
    cardIds.length
      ? renderHuecoStack(cardIds, datos.firstShown[slot], 0)
      : cardImg(HUECO)
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
