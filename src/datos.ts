export const DRAG_TYPE = 'cartas';

export type dragItem = CardId[];

export type dropResult = CardId[];

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

export type VALOR = typeof valores[number];

export const palos = ['C', 'D', 'H', 'S'] as const;

export type PALO = typeof palos[number];

export const REVERSO = '2B';
export const HUECO = 'hueco';

export type CardId = `${VALOR}${PALO}` | '2B' | 'hueco';

export type cartaType = {
  name: CardId;
  palo: PALO;
  valor: VALOR;
  index: number;
  color: COLOR;
};

export const CARTA_HEIGHT = 168;
export const CARTA_WIDTH = 120;
export const OFFSET_PILA = 40;

export const numPalos = palos.length;
export const numValores = valores.length;

export const numCartas = numPalos * numValores;

export const baraja = {} as Record<CardId, cartaType>;

palos.forEach((palo) =>
  valores.forEach((valor, index) => {
    const name: CardId = `${valor}${palo}` as CardId;
    baraja[name] = {
      name,
      palo,
      valor,
      index,
      color: palo === 'D' || palo === 'H' ? COLOR.ROJO : COLOR.NEGRO,
    };
  })
);
