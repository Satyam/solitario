import { datos } from './datos.js';

let jugadas = 0;
let rondas = 0;
let undos = 0;
let redos = 0;

export const renderStats = () => {
  $('.stats').html(`
    <div >Jugadas: ${jugadas}</div>
    <div>Rondas: ${rondas}</div>
    <div>Undos: ${undos}</div>
    <div>Redos: ${redos}</div>
  `);
  $('.gameover').toggle(datos.pilas.every((pila) => pila.length === 13));
};

export const initStats = () => {
  jugadas = 0;
  rondas = 0;
  undos = 0;
  redos = 0;
  renderStats();
};

export const incJugadas = () => {
  jugadas += 1;
  renderStats();
};

export const incRondas = () => {
  rondas += 1;
  renderStats();
};
export const incUndos = () => {
  undos += 1;
  renderStats();
};
export const incRedos = () => {
  redos += 1;
  renderStats();
};
