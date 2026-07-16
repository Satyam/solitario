import { incRondas } from './stats.js';
import { SEL, EV, datos, baraja, numHuecos, numPilas } from './datos.js';
import { renderMazo, renderPila, renderVista, renderHueco } from './render.js';
import {
  shuffle,
  canDropInSomePila,
  ExecutionQueue,
  fireEV,
  onEV,
} from './utils.js';

const Q = new ExecutionQueue();

export const initActions = () => {
  // Buttons
  document.getElementById('newGame').addEventListener('click', () => {
    fireEV(EV.NEWGAME_BEFORE);
  });
  document
    .getElementById('raise')
    .addEventListener('click', () => Q.add(raiseAll));
  // cards
  document.querySelector(SEL.MAZO).addEventListener('click', dealCard);
  document
    .querySelector(SEL.VISTA)
    .addEventListener('mousedown', raiseFromVista);
  document
    .querySelectorAll(SEL.HUECOS)
    .forEach(el => el.addEventListener('mousedown', raiseFromHueco));
  onEV(EV.GAMEOVER_BEFORE, () => Q.add(endAnimation));
  onEV(EV.JUGADA_AFTER, checkGameover);
  onEV(EV.NEWGAME_BEFORE, startNewGame);
  onEV(EV.NEWGAME_AFTER, checkGameover);
};

const startNewGame = () => {
  Q.add(() => {
    datos.vista = [];
    for (let slot = 0; slot < numPilas; slot++) datos.pilas[slot] = [];
    const cardIds = shuffle(Object.keys(baraja));
    for (let slot = 0; slot < numHuecos; slot++) {
      datos.huecos[slot] = cardIds.splice(0, slot + 1);
      datos.firstShown[slot] = slot;
    }
    // Place the remaining cards in the mazo.
    datos.mazo = cardIds;
    fireEV(EV.NEWGAME_AFTER);
  });
};

const checkGameover = () => {
  const gameover = datos.pilas.every(pila => pila.length === 13);
  document.querySelector('.gameover').toggleAttribute('hidden', !gameover);
  if (gameover) fireEV(EV.GAMEOVER_BEFORE);
};

const dealCard = ev => {
  fireEV(EV.JUGADA_BEFORE);
  if (datos.mazo.length) {
    datos.vista.unshift(datos.mazo.shift());
  } else {
    datos.mazo = datos.vista.reverse();
    datos.vista = [];
    incRondas();
  }
  renderMazo();
  renderVista();
  fireEV(EV.JUGADA_AFTER);
};

async function vistaToPila(toSlot) {
  if (toSlot === false) return false;
  fireEV(EV.JUGADA_BEFORE);
  datos.pilas[toSlot].unshift(datos.vista.shift());
  await animateMove(
    // $(SEL.VISTA).find(SEL.TOP),
    document.querySelector(`${SEL.VISTA} ${SEL.TOP}`),
    // $(SEL.PILAS)
    //   .eq(toSlot)
    //   .find(SEL.TOP)
    document
      .querySelectorAll(SEL.PILAS)
      .item(toSlot)
      .querySelector(SEL.TOP)
  );
  renderPila(toSlot);
  renderVista();
  fireEV(EV.JUGADA_AFTER);
  return true;
}

function raiseFromVista(ev) {
  if (ev.buttons === 4) {
    vistaToPila(canDropInSomePila(datos.vista[0]));
    return false;
  }
}

async function huecoToPila(fromSlot, toSlot) {
  if (toSlot === false) return false;
  fireEV(EV.JUGADA_BEFORE);
  datos.pilas[toSlot].unshift(datos.huecos[fromSlot].shift());
  await animateMove(
    // $(SEL.HUECOS)
    //   .eq(fromSlot)
    //   .find(SEL.IMG)
    //   .last(),
    document
      .querySelectorAll(SEL.HUECOS)
      .item(fromSlot)
      .querySelector('img:last-of-type'),
    // $(SEL.PILAS)
    //   .eq(toSlot)
    //   .find(SEL.TOP)
    document
      .querySelectorAll(SEL.PILAS)
      .item(toSlot)
      .querySelector(SEL.TOP)
  );
  renderHueco(fromSlot);
  renderPila(toSlot);
  fireEV(EV.JUGADA_AFTER);
  return true;
}

function raiseFromHueco(ev) {
  if (ev.buttons === 4) {
    const fromSlot = ev.currentTarget.dataset.slot;
    const toSlot = canDropInSomePila(datos.huecos[fromSlot][0]);
    huecoToPila(fromSlot, toSlot);
    // stop propagation
    return false;
  }
}

function animateMove(srcEl, destEl) {
  return new Promise(resolve => {
    const srcPos = srcEl.getBoundingClientRect();
    srcEl.style.position = 'relative';
    srcEl.style.zIndex = 10;
    const destPos = destEl.getBoundingClientRect();
    const anim = srcEl.animate(
      {
        left: `+=${destPos.left - srcPos.left}`,
        top: `+=${destPos.top - srcPos.top}`,
      },
      {
        duration: 300,
        easing: 'ease-in',
      }
    );
    anim.addEventListener('finish', () => {
      srcEl.remove();
      resolve();
    });
  });
}

async function raiseAll() {
  const chain = vistaToPila(canDropInSomePila(datos.vista[0]));
  const huecos = datos.huecos;
  for (let fromSlot = 0; fromSlot < numHuecos; fromSlot++) {
    chain.then(huecoToPila(fromSlot, canDropInSomePila(huecos[fromSlot][0])));
  }
}

function endAnimationOnePila(slot, pila) {
  return new Promise(resolve => {
    $(SEL.PILAS)
      .eq(slot)
      .find(SEL.TOP)
      .effect('bounce', { times: 3 }, Math.random() * 200 + 300, () => {
        pila.shift();
        renderPila(slot);
        resolve(pila.length ? endAnimationOnePila(slot, pila) : true);
      });
  });
}
function endAnimation() {
  return Promise.all(
    datos.pilas.map((pila, slot) => endAnimationOnePila(slot, pila))
  ).then(() => {
    fireEV(EV.GAMEOVER_AFTER);
  });
}
