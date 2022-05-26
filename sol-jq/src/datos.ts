// Types and constants related to cards.
export enum COLOR {
  ROJO = 'rojo',
  NEGRO = 'negro',
}

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
] as const;

type tValor = typeof valores[number];

const palos = ['C', 'D', 'H', 'S'] as const;

export const charPalos = {
  H: '&hearts;',
  D: '&diams;',
  S: '&spades;',
  C: '&clubs;',
};

type tPalo = typeof palos[number];
export const REVERSO = '2B';
export const HUECO = 'hueco';

export type tCardId = `${tValor}${tPalo}` | typeof REVERSO | typeof HUECO;

export type tCarta = {
  name: tCardId;
  palo: tPalo;
  valor: tValor;
  index: number;
  color: COLOR;
};

export const baraja = {} as Record<tCardId, tCarta>;

palos.forEach((palo) =>
  valores.forEach((valor, index) => {
    const name: tCardId = `${valor}${palo}` as tCardId;
    baraja[name] = {
      name,
      palo,
      valor,
      index,
      color: palo === 'D' || palo === 'H' ? COLOR.ROJO : COLOR.NEGRO,
    };
  })
);

// types and constants related to board playing positions and drag&drop.

export enum POS {
  HUECO = 'huecos',
  PILA = 'pilas',
  VISTA = 'vista',
  MAZO = 'mazo',
}

export enum SEL {
  MAZO = '.mazo',
  VISTA = '.vista',
  PILAS = '.pilas',
  HUECOS = '.huecos',
  DROPPABLE = '.droppable',
  DRAGGABLE = '.draggable',
  CELDA = '.celda',
  TOP = '.top',
  IMG = 'img',
  STACK = '.stack',
}

export enum EV {
  GAMEOVER_BEFORE = 'before_game_over',
  GAMEOVER_AFTER = 'after_game_over',
  JUGADA_BEFORE = 'before_jugada',
  JUGADA_AFTER = 'after_jugada',
  NEWGAME_BEFORE = 'before_new_game',
  NEWGAME_AFTER = 'after_new_game',
  UNDO_AFTER = 'after_undo',
  REDO_AFTER = 'after_redo',
}
export const numPilas = 4;
export const numHuecos = 7;

export type tDatos = {
  mazo: tCardId[];
  vista: tCardId[];
  pilas: tCardId[][];
  huecos: tCardId[][];
  firstShown: number[];
};
export const datos: tDatos = {
  mazo: [],
  vista: [],
  pilas: Array(numPilas).fill([]),
  huecos: Array(numHuecos).fill([]),
  firstShown: Array(numHuecos).fill(0),
};
