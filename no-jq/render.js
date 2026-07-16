import {
  REVERSO,
  HUECO,
  POS,
  SEL,
  EV,
  datos,
  numPilas,
  numHuecos,
  baraja,
} from './datos.js';
import { enableDraggable, setDraggable } from './dragdrop.js';
import { onEV } from './utils.js';

let topMazo;
let topVista;

const topPilas = Array(numPilas);
const topHuecos = Array(numHuecos);
const s = getComputedStyle(document.documentElement);
const cardHeight = parseInt(s.getPropertyValue('--cardHeight'), 10);
const shortCardHeight = parseInt(s.getPropertyValue('--shortCardHeight'), 10);

const imgSrc = cardId => `assets/cards/${cardId}.svg`;

const cardImg = (cardId, className = '', draggable = false) => {
  const img = document.createElement('img');
  img.className = `card ${className}`;
  img.draggable = draggable;
  img.src = imgSrc(cardId);
  return img;
};

const createDiv = (className, contents) => {
  const div = document.createElement('div');
  div.className = className ?? '';
  switch (typeof contents) {
    case 'undefined':
      return div;
    case 'string':
      div.innerHTML = contents;
      break;
    case 'object':
      if (contents instanceof HTMLElement) {
        div.appendChild(contents);
        break;
      }
      if (Array.isArray(contents)) {
        contents.forEach(el => {
          if (el instanceof HTMLElement) {
            div.appendChild(el);
          } else {
            debugger;
          }
        });
        break;
      }
    default:
      debugger;
  }

  return div;
};

const createGuessContainer = () => createDiv('celda guess');

const createContainer = (name, draggable, droppable) =>
  createDiv(
    `celda ${name} ${droppable ? 'droppable' : ''}`,
    createDiv('cardContainer single', [
      cardImg(HUECO, 'behind'),
      cardImg(REVERSO, 'top', draggable),
    ])
  );

const emptyHuecoStackPosition = () => {
  const div = createDiv('stack', cardImg(HUECO));
  div.dataset.start = 0;
  div.dataset.cardid = HUECO;
  div.draggable = true;
  return div;
};

const emptyHuecoContainer = () =>
  createDiv(
    `celda ${POS.HUECO} droppable`,
    createDiv('cardContainer', emptyHuecoStackPosition())
  );

const setCardId = (el, cardId) => {
  // debugger;
  if (el.nodeName == 'IMG') {
    el.setAttribute('src', imgSrc(cardId));
  }
  el.querySelectorAll('img').forEach(el =>
    el.setAttribute('src', imgSrc(cardId))
  );
};

export const initBoard = () => {
  // Image preload
  Object.keys(baraja).forEach(cardId => {
    new Image().src = `assets/cards/${cardId}.svg`;
  });
  const boardEl = document.querySelector('.grid');
  boardEl.appendChild(createContainer(POS.MAZO));
  boardEl.appendChild(createContainer(POS.VISTA, true));
  boardEl.appendChild(createGuessContainer());
  for (let slot = 0; slot < numPilas; slot++) {
    boardEl.appendChild(createContainer(POS.PILA, true, true));
  }
  for (let slot = 0; slot < numHuecos; slot++) {
    boardEl.appendChild(emptyHuecoContainer());
  }
  onEV(EV.NEWGAME_AFTER, renderAll);
  onEV(EV.UNDO_AFTER, renderAll);
  onEV(EV.REDO_AFTER, renderAll);
};

export const renderMazo = () => {
  const cardId = datos.mazo.length ? REVERSO : HUECO;
  if (cardId === topMazo) return;
  topMazo = cardId;
  setCardId(document.querySelector(SEL.MAZO).querySelector(SEL.TOP), cardId);
};

const renderVoP = (containerEl, cardIdTop = HUECO, cardIdNext = HUECO) => {
  const imgTop = containerEl.querySelector(SEL.TOP);
  const imgBehind = containerEl.querySelector('.behind');
  if (imgTop) {
    setCardId(imgTop, cardIdTop);
  } else {
    // Never gets here
    debugger;
    document
      .querySelectorAll(`${cardIdTop}.draggable.top`)
      .forEach(el => setDraggable(el.appendTo(containerEl.children())));
    enableDraggable(imgTop, cardIdTop !== HUECO);
  }
  setCardId(imgBehind, cardIdNext);
};

export const renderVista = () => {
  const cardId = datos.vista[0] || HUECO;
  if (cardId === topVista) return;
  topVista = cardId;
  renderVoP(document.querySelector(SEL.VISTA), cardId, datos.vista[1]);
};

export const renderPila = slot => {
  const cardId = datos.pilas[slot][0] || HUECO;
  if (cardId === topPilas[slot]) return;
  topPilas[slot] = cardId;
  renderVoP(
    document.querySelectorAll(SEL.PILAS).item(slot),
    cardId,
    datos.pilas[slot][1]
  );
};

const renderPilas = () => {
  for (let slot = 0; slot < numPilas; slot++) renderPila(slot);
};
const renderHuecoStack = (el, cardIds, firstShown, stackLength) => {
  const [cardId, ...rest] = cardIds;
  const index = stackLength - rest.length;
  const isVisible = index > firstShown;
  // Ajusto la carta existente
  el.dataset.start = rest.length;
  el.dataset.cardid = cardId || HUECO;
  el.classList.toggle('draggable', isVisible);
  el.classList.toggle('offset', index > 1);
  if (!el.querySelector(SEL.IMG)) {
    el.appendChild(cardImg(HUECO));
  }
  setCardId(el, isVisible ? cardId || HUECO : REVERSO);
  // ajuste hecho
  if (rest.length) {
    let next = el.querySelector(SEL.STACK);
    // If there is no place to render the rest, create a stack position and carry on
    if (!next) {
      next = el.appendChild(emptyHuecoStackPosition());
    }
    renderHuecoStack(next, rest, firstShown, stackLength);
  } else {
    // remove further stack positions.
    const surplus = el.querySelector(SEL.STACK);
    if (surplus) surplus.remove();
  }
};

const renderOneHueco = (h, slot) => {
  const cardIds = datos.huecos[slot];
  const cardId = cardIds[0];
  if (cardId === topHuecos[slot]) return;
  topHuecos[slot] = cardId;
  let stack = h.querySelector(SEL.STACK);
  if (!stack) {
    // Never gets here
    debugger;
    stack = h.appendChild(emptyHuecoStackPosition());
  }
  renderHuecoStack(
    stack,
    cardIds.slice(0).reverse(),
    datos.firstShown[slot],
    cardIds.length
  );
  h.querySelector('.cardContainer').style.height =
    ((cardIds.length || 1) - 1) * shortCardHeight + cardHeight;
  setDraggable(h.querySelector(SEL.DRAGGABLE));
  enableDraggable(h, cardIds.length > 0);
};

const renderHuecos = () => {
  document.querySelectorAll(SEL.HUECOS).forEach((el, slot) => {
    renderOneHueco(el, slot);
  });
};

function fixFirstShown(slot) {
  const lastCardIndex = datos.huecos[slot].length - 1;
  const firstShown = datos.firstShown[slot];
  if (firstShown > lastCardIndex) {
    datos.firstShown[slot] = lastCardIndex;
  }
  if (firstShown === -1 && lastCardIndex !== -1) {
    datos.firstShown[slot] = 0;
  }
}

export const renderHueco = slot => {
  fixFirstShown(slot);
  renderOneHueco(document.querySelectorAll(SEL.HUECOS).item(slot), slot);
};

const renderAll = () => {
  renderMazo();
  renderVista();
  renderHuecos();
  renderPilas();
};
