import { POS, EV, datos, baraja, charPalos, COLOR } from './datos.js';
import { canDropInSomeHueco, canDropInSomePila, onEV, offEV } from './utils.js';
let guessOn = false;

export function initGuess() {
  const hintEl = document.getElementById('hint');
  const setOnDemand = () => {
    guessOn = false;
    hideHint();
    hintEl.removeEventListener('click', guessNext);
    hintEl.classList.remove('buttonPressed');
    hintEl
      .querySelector('img')
      .setAttribute('src', 'assets/icons/quiz_black_24dp.svg');
    onEV(EV.JUGADA_AFTER, hideHint);
    onEV(EV.NEWGAME_AFTER, hideHint);
    offEV(EV.JUGADA_AFTER, guessNext);
    offEV(EV.NEWGAME_AFTER, guessNext);
  };

  function setPermanent() {
    guessOn = true;
    hintEl.classList.add('buttonPressed');
    hintEl
      .querySelector('img')
      .setAttribute('src', 'assets/icons/quiz_white_24dp.svg');
    guessNext();
    offEV(EV.JUGADA_AFTER, hideHint);
    offEV(EV.NEWGAME_AFTER, hideHint);
    onEV(EV.JUGADA_AFTER, guessNext);
    onEV(EV.NEWGAME_AFTER, guessNext);
  }

  hintEl.addEventListener('dblclick', () => {
    if (guessOn) setOnDemand();
    else setPermanent();
  });
  setOnDemand();
}

function hideHint() {
  if (guessOn) return;
  document.querySelector('.guess').style.visibility = 'hidden';
}

function checkAnyKingAround() {
  const cartaPila = baraja[datos.vista[0]];
  return (
    (cartaPila && cartaPila.valor === 'K') ||
    datos.huecos.some((hueco, slot) => {
      const length = hueco.length;
      if (length) {
        const firstShown = datos.firstShown[slot];
        for (let index = 0; index < length - (firstShown || 1); index++) {
          const carta = baraja[hueco[index]];
          if (carta && carta.valor === 'K') return true;
        }
      }
      return false;
    })
  );
}

function guessFirstHuecoToPila() {
  const cardsToCheck = [];
  datos.huecos.forEach((hueco, slot) => {
    if (hueco[0]) {
      cardsToCheck.push({
        fromPos: POS.HUECO,
        fromCardId: hueco[0],
        fromSlot: slot,
        firstShown: datos.firstShown[slot],
        isLast: hueco.length === 1,
      });
    }
  });
  cardsToCheck.sort((a, b) => b.firstShown - a.firstShown);
  cardsToCheck.forEach(move => {
    const fromCardId = move.fromCardId;
    if (move.isLast) {
      const fromCarta = baraja[fromCardId];
      // except for aces and twos, others only are worth it if there is a king to fill the hueco
      if (fromCarta.index > 1 && !checkAnyKingAround()) return false;
    }
    const toSlot = canDropInSomePila(fromCardId);
    if (toSlot !== false) {
      move.toPos = POS.PILA;
      move.toSlot = toSlot;
      move.toCardId = datos.pilas[toSlot][0];
    }
  });
  return cardsToCheck.filter(move => typeof move.toPos !== 'undefined');
}

function guessVistaToPila() {
  const cardId = datos.vista[0];
  if (cardId) {
    const toSlot = canDropInSomePila(cardId);
    if (toSlot !== false) {
      return [
        {
          fromCardId: cardId,
          fromPos: POS.VISTA,
          fromSlot: 0,
          firstShown: 0,
          toPos: POS.PILA,
          toSlot,
          toCardId: datos.pilas[toSlot][0],
        },
      ];
    }
  }
  return [];
}

function guessVistaToHueco() {
  const cardId = datos.vista[0];
  if (cardId) {
    const toSlot = canDropInSomeHueco(cardId);
    if (toSlot !== false) {
      return [
        {
          fromCardId: cardId,
          fromPos: POS.VISTA,
          fromSlot: 0,
          firstShown: 0,
          toPos: POS.HUECO,
          toSlot,
          toCardId: datos.huecos[toSlot][0],
        },
      ];
    }
  }
  return [];
}

function guessHuecoToHueco() {
  const cardsToCheck = [];
  datos.huecos.forEach((hueco, slot) => {
    const firstShown = datos.firstShown[slot];
    const fromIndex = hueco.length - firstShown - 1;
    if (hueco[firstShown]) {
      cardsToCheck.push({
        fromPos: POS.HUECO,
        fromCardId: hueco[fromIndex],
        fromSlot: slot,
        firstShown,
        isLast: hueco.length === fromIndex + 1,
      });
    }
  });
  // sort in decreasing order by firstShown so it lists the longest stack to uncover first
  cardsToCheck.sort((a, b) => b.firstShown - a.firstShown);
  cardsToCheck.forEach(move => {
    const fromCardId = move.fromCardId;
    if (move.isLast) {
      const fromCarta = baraja[fromCardId];
      // except for aces and twos, others only are worth it if there is a king to fill the hueco
      if (
        fromCarta.valor === 'K' ||
        (fromCarta.index > 1 && !checkAnyKingAround())
      )
        return false;
    }
    const toSlot = canDropInSomeHueco(fromCardId);
    if (toSlot !== false) {
      move.toPos = POS.HUECO;
      move.toSlot = toSlot;
      move.toCardId = datos.huecos[toSlot][0];
    }
  });
  return cardsToCheck.filter(move => typeof move.toPos !== 'undefined');
}

function formatGuess(guess) {
  function formatPos(pos, slot) {
    switch (pos) {
      case POS.HUECO:
        return `<td>hueco</td><td align="center">${slot + 1}</td>`;
      case POS.VISTA:
        return '<td colspan="2">vista</td>';
      case POS.PILA:
        return `<td>pila</td><td align="center">${slot + 1}</td>`;
    }
  }

  function formatCardId(cardId) {
    if (cardId) {
      const carta = baraja[cardId];
      const valor = carta.valor.replace('T', '10');
      const palo = charPalos[carta.palo];
      return (
        valor +
        (carta.color === COLOR.ROJO
          ? `<span style="color: red;">${palo}</span>`
          : palo)
      );
    }
    return 'vacío';
  }
  return `<tr class="desde"><td>De:</td>${formatPos(
    guess.fromPos,
    guess.fromSlot
  )}<td align="right">${formatCardId(guess.fromCardId)}</td></tr>  
  <tr class="hasta"><td>A:</td>${formatPos(
    guess.toPos,
    guess.toSlot
  )}<td align="right">${formatCardId(guess.toCardId)}</td></tr>`;
}

function guessNext() {
  const guesses = guessFirstHuecoToPila().concat(
    guessHuecoToHueco(),
    guessVistaToPila(),
    guessVistaToHueco()
  );

  const guessEl = document.querySelector('.guess');
  guessEl.style.visibility = 'visible';
  guessEl.innerHTML(
    guesses.length
      ? `<table>
  <tr><th></th><th>Donde</th><th>Columna</th><th>Carta</th></tr>
  ${guesses.map(formatGuess).join('\n')}</table>`
      : '<p class="noHint">No hay sugerencias</p>'
  );
}
