import { Tablero } from './tablero.js';
import { NUM_TABLONES } from './constants.js';
import { Carta, Cartas } from './baraja.js';

export class Game {
  constructor() {
    // Buttons
    document.getElementById('newGame').addEventListener('click', () => {
      Tablero.fire(Tablero.NEWGAME_BEFORE);
    });
    document
      .getElementById('raise')
      .addEventListener('click', this.#raiseAll.bind(this));
    // cards
    tablero.mazo.el.addEventListener('click', this.#dealCard.bind(this));
    tablero.vista.el.addEventListener(
      'mousedown',
      this.#raiseFromVista.bind(this)
    );
    tablero.tablones.forEach((tablon) =>
      tablon.el.addEventListener('mousedown', this.#raiseFromTablon.bind(this))
    );

    Tablero.on(Tablero.GAMEOVER_BEFORE, this.#endAnimation.bind(this));
    Tablero.on(Tablero.JUGADA_AFTER, this.#checkGameover.bind(this));
    Tablero.on(Tablero.NEWGAME_BEFORE, this.#startNewGame.bind(this));
    Tablero.on(Tablero.NEWGAME_AFTER, this.#checkGameover.bind(this));
    Tablero.fire(Tablero.NEWGAME_BEFORE);
  }

  #dealCard() {
    if (tablero.mazo.top) {
      tablero.vista.push(tablero.mazo.pop());
      tablero.vista.top.reverso = false;
    }
  }
  #raiseAll() {}
  #raiseFromVista() {}
  #raiseFromTablon() {}
  #endAnimation() {}
  #checkGameover() {}

  #startNewGame() {
    tablero.mazo.clear();
    tablero.vista.clear();
    tablero.bases.forEach((base) => base.clear());
    tablero.tablones.forEach((tablon) => tablon.clear());

    const baraja = new Cartas(true).shuffle();

    // put some of the tablones
    tablero.tablones.forEach((tablon, slot) =>
      tablon.push(baraja.pop(slot + 1))
    );

    // Place the remaining cards in the mazo.
    tablero.mazo.push(baraja.cartas);
    Tablero.fire(Tablero.NEWGAME_AFTER);
  }
}
