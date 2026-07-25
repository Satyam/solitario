import { Board } from './board.js';
import { NUM_PILAS } from './constants.js';
import { Carta, Cartas } from './baraja.js';

export class Game {
  constructor() {
    // Buttons
    document.getElementById('newGame').addEventListener('click', () => {
      Board.fire(Board.NEWGAME_BEFORE);
    });
    document
      .getElementById('raise')
      .addEventListener('click', this.#raiseAll.bind(this));
    // cards
    board.mazo.el.addEventListener('click', this.#dealCard.bind(this));
    board.vista.el.addEventListener(
      'mousedown',
      this.#raiseFromVista.bind(this)
    );
    board.pilas.forEach((pila) =>
      pila.el.addEventListener('mousedown', this.#raiseFromHueco.bind(this))
    );

    Board.on(Board.GAMEOVER_BEFORE, this.#endAnimation.bind(this));
    Board.on(Board.JUGADA_AFTER, this.#checkGameover.bind(this));
    Board.on(Board.NEWGAME_BEFORE, this.#startNewGame.bind(this));
    Board.on(Board.NEWGAME_AFTER, this.#checkGameover.bind(this));
    Board.fire(Board.NEWGAME_BEFORE);
  }

  #dealCard() {
    if (board.mazo.top) {
      board.vista.push(board.mazo.pop());
      board.vista.top.reverso = false;
    }
  }
  #raiseAll() {}
  #raiseFromVista() {}
  #raiseFromHueco() {}
  #endAnimation() {}
  #checkGameover() {}

  #startNewGame() {
    board.mazo.clear();
    board.vista.clear();
    board.bases.forEach((base) => base.clear());
    board.pilas.forEach((pila) => pila.clear());

    const baraja = new Cartas(true).shuffle();

    // put some of the pilas
    board.pilas.forEach((pila, slot) => pila.push(baraja.pop(slot + 1)));

    // Place the remaining cards in the mazo.
    board.mazo.push(baraja.cartas);
    Board.fire(Board.NEWGAME_AFTER);
  }
}
