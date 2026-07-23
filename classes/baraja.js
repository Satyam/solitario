// Types and constants related to cards.
export const COLOR = {
  ROJO: 'rojo',
  NEGRO: 'negro',
};
// Cards from https://www.me.uk/cards/makeadeck.cgi
const valores = [
  'A',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  'T',
  'J',
  'Q',
  'K',
];
const palos = ['C', 'D', 'H', 'S'];
export const charPalos = {
  H: '&hearts;',
  D: '&diams;',
  S: '&spades;',
  C: '&clubs;',
};
export const REVERSO = 'back';
export const HUECO = 'hueco';
export const baraja = {};
palos.forEach((palo) =>
  valores.forEach((valor, index) => {
    const name = `${valor}${palo}`;
    baraja[name] = {
      name,
      palo,
      valor,
      index,
      color: palo === 'D' || palo === 'H' ? COLOR.ROJO : COLOR.NEGRO,
    };
  })
);
