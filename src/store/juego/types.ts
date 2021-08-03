import { tCardId, POS } from 'datos';

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

export type tJugada = {
  cardIds: tCardId[];
  toPos: POS;
  toSlot: number;
  fromPos: POS;
  fromSlot: number;
  anim?: boolean;
};
