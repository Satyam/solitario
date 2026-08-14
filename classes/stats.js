import { Tablero } from './tablero.js';

let jugadas = 0;
let rondas = 1;
let undos = 0;
let redos = 0;
const el = document.querySelector('.stats');

export function initStats() {
  tablero.on(Tablero.JUGADA_BEFORE, incJugadas);
  tablero.on(Tablero.NEWGAME_BEFORE, resetStats);
  tablero.on(Tablero.REDO_AFTER, incRedos);
  tablero.on(Tablero.UNDO_AFTER, incUndos);
  tablero.on(Tablero.NEW_RONDA, incRondas);
}

const renderStats = () => {
  el.innerHTML = `
    <div >Jugadas: ${jugadas}</div>
    <div>Rondas: ${rondas}</div>
    <div>Deshechos: ${undos}</div>
    <div>Rehechos: ${redos}</div>
  `;
};

const resetStats = () => {
  jugadas = 0;
  rondas = 1;
  undos = 0;
  redos = 0;
  renderStats();
};

const incJugadas = () => {
  jugadas += 1;
  renderStats();
};

const incRondas = () => {
  rondas += 1;
  renderStats();
};

const incUndos = () => {
  undos += 1;
  renderStats();
};

const incRedos = () => {
  redos += 1;
  renderStats();
};
