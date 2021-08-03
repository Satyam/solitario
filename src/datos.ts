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
  HUECO = 'hueco',
  PILA = 'pila',
  VISTA = 'vista',
  MAZO = 'mazo',
}

export const numPilas = 4;
export const numHuecos = 7;

export const DRAG_TYPE = 'cardIds';

export type tDragItem = tCardId[];

export type tDropResult = {
  toPos: POS;
  toSlot: number;
};

export type tDropCollectedProps = { isOver: boolean; canDrop: boolean };
export type tDragCollectedProps = { isDragging: boolean };

// various
export const SPRITE_ID = 'sprite';
export const ANIM_DURATION = 200;
