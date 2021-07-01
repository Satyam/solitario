export const baraja = {};

// Constantes
export const ROJO = 'rojo';
export const NEGRO = 'negro';
export const MAZO = 'mazo';
export const HUECO = 'hueco';
export const EN_HUECO = 'en hueco';
export const JUEGO = 'juego';
export const PILA = 'pila';
export const VISTA = 'vista';
export const REVERSO = 'reverso';

export const OFFSET_PILA = 80;

// Cards from https://www.me.uk/cards/makeadeck.cgi
export const palos = 'CDHS';
export const valores = 'A23456789TJQK';

export const numPalos = palos.length;
export const numValores = valores.length;

export const numCartas = numPalos * numValores;

for (let p = 0; p < numPalos; p++) {
  for (let v = 0; v < numValores; v++) {
    const palo = palos[p];
    const name = valores[v] + palo;
    baraja[name] = {
      name,
      palo,
      valor: v,
      color: palo === 'D' || palo === 'H' ? ROJO : NEGRO,
    };
  }
}
