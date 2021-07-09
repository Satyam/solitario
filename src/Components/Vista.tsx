import { HUECO } from 'datos';
import { useRecoilValue } from 'recoil';
import { vistaTop } from 'store/vista';
import Sprite from './Sprite';

const Vista = () => {
  const cardId = useRecoilValue(vistaTop);

  return <Sprite cardId={cardId || HUECO} />;
};

export default Vista;
