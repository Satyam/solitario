import { useEffect } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { mazoBarajar, mazoState } from 'store/mazo';
import { vistaState } from 'store/vista';
import { HUECO, REVERSO } from 'datos';
import Sprite from './Sprite';

const Mazo = () => {
  const [cartas, setCartas] = useRecoilState(mazoState);
  const [vista, setVista] = useRecoilState(vistaState);
  const sacar = () => {
    const l = cartas.length;
    if (l) {
      const cardId = cartas[l - 1];
      setVista([...vista, cardId]);
      setCartas(cartas.slice(0, -1));
    } else {
      setCartas([...vista].reverse());
      setVista([]);
    }
  };

  const barajar = useSetRecoilState(mazoBarajar);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => barajar(), []);
  return <Sprite cardId={cartas.length ? REVERSO : HUECO} onClick={sacar} />;
};

export default Mazo;
