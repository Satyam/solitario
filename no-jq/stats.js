import { EV } from './datos.js';
import { onEV } from './utils.js';

let jugadas = 0;
let rondas = 1;
let undos = 0;
let redos = 0;

export const initStats = () => {
  onEV(EV.JUGADA_BEFORE, incJugadas);
  onEV(EV.NEWGAME_BEFORE, resetStats);
  onEV(EV.REDO_AFTER, incRedos);
  onEV(EV.UNDO_AFTER, incUndos);
};

const renderStats = () => {
  document.querySelector('.stats').innerHTML = `
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

export const incRondas = () => {
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
