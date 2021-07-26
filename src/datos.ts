export enum POS {
  HUECO = 'hueco',
  PILA = 'pila',
  VISTA = 'vista',
  MAZO = 'mazo',
}

export const DRAG_TYPE = 'cardIds';

export type tDragItem = tCardId[];

export type tDropResult = {
  toPos: POS;
  toSlot: number;
};

export type tJugada = {
  cardIds: tCardId[];
  toPos: POS;
  toSlot: number;
  fromPos: POS;
  fromSlot: number;
};

export type tDropCollectedProps = { isOver: boolean; canDrop: boolean };
export type tDragCollectedProps = { isDragging: boolean };

export const numPilas = 4;
export const numHuecos = 7;

export enum COLOR {
  ROJO = 'rojo',
  NEGRO = 'negro',
}

// Cards from https://www.me.uk/cards/makeadeck.cgi

export const valores = [
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

export type tValor = typeof valores[number];

export const palos = ['C', 'D', 'H', 'S'] as const;

export type tPalo = typeof palos[number];

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

export type tHuecoState = {
  cardIds: tCardId[];
  firstShown: number;
};
export type tJuegoState = {
  mazo: tCardId[];
  vista: tCardId[];
  pilas: tCardId[][];
  huecos: tHuecoState[];
};

export type tStatsState = {
  jugadas: number;
  rondas: number;
  undos: number;
  redos: number;
};
export const numPalos = palos.length;
export const numValores = valores.length;

export const numCartas = numPalos * numValores;

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

export type tMoveCard = {
  cardId: tCardId;
  fromClassName: string;
  toClassName: string;
  duration?: number;
  idSprite?: string;
};
