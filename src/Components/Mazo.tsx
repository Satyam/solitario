import { useEffect } from 'react';
import { useRecoilState, useSetRecoilState, useResetRecoilState } from 'recoil';
import { mazoBarajar, mazoState } from 'store/mazo';
import { vistaState } from 'store/vista';
import { HUECO, REVERSO } from 'datos';
import Sprite from './Sprite';
import { saveSnapshot } from 'store/snapshots';

const Mazo = () => {
  const [cardIds, setCardIds] = useRecoilState(mazoState);
  const resetVista = useResetRecoilState(vistaState);
  const [vista, setVista] = useRecoilState(vistaState);
  const barajar = useSetRecoilState(mazoBarajar);
  const saveState = useSetRecoilState(saveSnapshot);
  const sacar = () => {
    const l = cardIds.length;
    if (l) {
      const [cardId, ...resto] = cardIds;
      setVista([cardId, ...vista]);
      setCardIds(resto);
    } else {
      setCardIds([...vista].reverse());
      resetVista();
    }
    saveState(false);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => barajar(), []);
  return <Sprite cardId={cardIds.length ? REVERSO : HUECO} onClick={sacar} />;
};

export default Mazo;
