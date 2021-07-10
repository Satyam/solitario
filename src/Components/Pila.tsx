import { useRecoilValue } from 'recoil';
import { pilaState } from 'store/pilas';
import Sprite from './Sprite';
import { HUECO } from 'datos';

const Pila = ({ slot }: { slot: number }) => {
  const cardId = useRecoilValue(pilaState(slot))[0];
  return <Sprite cardId={cardId || HUECO} />;
};

export default Pila;
