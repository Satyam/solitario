import { Tablero } from './tablero.js';
import { Carta, Cartas } from './baraja.js';

export class Game {
  constructor() {
    // Buttons
    document.getElementById('newGame').addEventListener('click', () => {
      tablero.fire(Tablero.NEWGAME_BEFORE);
    });
    document
      .getElementById('raise')
      .addEventListener('click', this.#raiseAll.bind(this));
    setTimeout(this.#initListeners.bind(this));
  }

  #initListeners() {
    tablero.on(
      Tablero.GAMEOVER_BEFORE,
      tablero.bases.endAnimation.bind(tablero.bases)
    );
    tablero.on(Tablero.JUGADA_AFTER, this.#checkGameover.bind(this));
    tablero.on(Tablero.NEWGAME_BEFORE, this.#startNewGame.bind(this));
    tablero.on(Tablero.NEWGAME_AFTER, this.#checkGameover.bind(this));
    tablero.fire(Tablero.NEWGAME_BEFORE);
  }

  async #raiseAll() {
    loop: while (true) {
      if (await tablero.vista.raise()) continue;
      for await (const tablon of tablero.tablones) {
        if (await tablon.raise()) continue loop;
      }
      break;
    }
  }

  #checkGameover() {
    const gameover = tablero.bases.every((base) => base.cartas.length === 13);
    // To make it easy to test the end animation
    // const gameover =
    //   tablero.bases[0].cartas.length === 13 &&
    //   tablero.bases[1].cartas.length === 13;
    document.querySelector('.gameover').hidden = !gameover;
    if (gameover) tablero.fire(Tablero.GAMEOVER_BEFORE);
  }

  #startNewGame() {
    tablero.mazo.clear();
    tablero.vista.clear();
    tablero.bases.clear();
    tablero.tablones.clear();

    // put some of the tablones
    tablero.tablones.forEach((tablon, slot) => {
      tablon.push(tablero.baraja.pullRandom(slot + 1), true);
    });

    // Place the remaining cards in the mazo.
    tablero.mazo.push(tablero.baraja.pullRandom());
    tablero.fire(Tablero.NEWGAME_AFTER);
  }
}
