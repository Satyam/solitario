import { mazoState } from 'store/mazo';
import { huecoState, firstShownState } from 'store/huecos';
import { vistaState } from 'store/vista';
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

  useResetRecoilState(vistaState)();

  if (firstTime) {
    setFirstTime(false);
    // Image preload
    Object.keys(baraja).forEach((cardId) => {
      new Image().src = `assets/cards/${cardId}.svg`;
    });
  }

  const cartas: CardId[] = [];
  while (cartas.length < numCartas) {
    let p = getRandomInt(numPalos - 1);
    let v = getRandomInt(numValores - 1);
    const cardId = `${valores[v]}${palos[p]}` as CardId;
    if (!cartas.includes(cardId)) {
      cartas.push(cardId);
    }
  }

  for (let slot = 0; slot < 7; slot++) {
    setFirstShown[slot](slot);
    setHueco[slot](cartas.splice(0, slot + 1));
  }
  setMazo(cartas);
};

export default useInit;
