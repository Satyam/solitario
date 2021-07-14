import { mazoState } from 'store/mazo';
import { huecoState, firstShownState } from 'store/huecos';
import { vistaState } from 'store/vista';
import { pilaState } from 'store/pilas';
import { useResetRecoilState, useSetRecoilState } from 'recoil';
import { getRandomInt } from 'utils';
import {
  CardId,
  numCartas,
  numPalos,
  numValores,
  valores,
  palos,
  baraja,
} from 'datos';
import { useState } from 'react';

const useInit = () => {
  const [firstTime, setFirstTime] = useState(true);
  const setMazo = useSetRecoilState(mazoState);
  const setHueco = [
    useSetRecoilState(huecoState(0)),
    useSetRecoilState(huecoState(1)),
    useSetRecoilState(huecoState(2)),
    useSetRecoilState(huecoState(3)),
    useSetRecoilState(huecoState(4)),
    useSetRecoilState(huecoState(5)),
    useSetRecoilState(huecoState(6)),
  ];

  const setFirstShown = [
    useSetRecoilState(firstShownState(0)),
    useSetRecoilState(firstShownState(1)),
    useSetRecoilState(firstShownState(2)),
    useSetRecoilState(firstShownState(3)),
    useSetRecoilState(firstShownState(4)),
    useSetRecoilState(firstShownState(5)),
    useSetRecoilState(firstShownState(6)),
  ];

  const resetVista = useResetRecoilState(vistaState);

  const resetPila = [
    useResetRecoilState(pilaState(0)),
    useResetRecoilState(pilaState(1)),
    useResetRecoilState(pilaState(2)),
    useResetRecoilState(pilaState(3)),
  ];

  return () => {
    if (firstTime) {
      setFirstTime(false);
      // Image preload
      Object.keys(baraja).forEach((cardId) => {
        new Image().src = `assets/cards/${cardId}.svg`;
      });
    }

    resetVista();
    resetPila.forEach((r) => {
      r();
    });
    const cardIds: CardId[] = [];
    while (cardIds.length < numCartas) {
      let p = getRandomInt(numPalos - 1);
      let v = getRandomInt(numValores - 1);
      const cardId = `${valores[v]}${palos[p]}` as CardId;
      if (!cardIds.includes(cardId)) {
        cardIds.push(cardId);
      }
    }

    for (let slot = 0; slot < 7; slot++) {
      setFirstShown[slot](slot);
      setHueco[slot](cardIds.splice(0, slot + 1));
    }
    setMazo(cardIds);
  };
};

export default useInit;
