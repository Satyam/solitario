import { EV } from './datos.js';

let jugadas = 0;
let rondas = 0;
let undos = 0;
let redos = 0;

export const initStats = () => {
  $(document)
    .on(EV.JUGADA_BEFORE, incJugadas)
    .on(EV.NEWGAME_BEFORE, resetStats)
    .on(EV.REDO_AFTER, incRedos)
    .on(EV.UNDO_AFTER, incUndos);
};

const renderStats = () => {
  $('.stats').html(`
    <div >Jugadas: ${jugadas}</div>
    <div>Rondas: ${rondas}</div>
    <div>Deshechos: ${undos}</div>
    <div>Rehechos: ${redos}</div>
  `);
};

const resetStats = () => {
  jugadas = 0;
  rondas = 0;
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
