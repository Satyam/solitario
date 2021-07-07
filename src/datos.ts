import { Bodies } from 'matter';

export const enum COLOR {
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

export type CardId = `${VALOR}${PALO}`;

export type cartaType = {
  name: CardId;
  palo: PALO;
  valor: VALOR;
  index: number;
  color: COLOR;
};

// Constantes
export const MAZO = 'mazo';
export const HUECO = 'hueco';
export const EN_HUECO = 'en hueco';
export const JUEGO = 'juego';
export const CARTAS_EN_VIAJE = 'cartas en viaje';
export const CARTA_EN_VIAJE = 'carta en viaje';
export const PILA = 'pila';
export const VISTA = 'vista';
export const REVERSO = 'reverso';

export const OFFSET_PILA = 80;

export const numPalos = palos.length;
export const numValores = valores.length;

export const numCartas = numPalos * numValores;

export const baraja: Record<CardId, cartaType> = {} as Record<
  CardId,
  cartaType
>;

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
