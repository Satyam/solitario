import { useRecoilValue } from 'recoil';
import { huecoState, lastHiddenState } from 'store/huecos';
import CardStack from './CardStack';

const Hueco = ({ slot }: { slot: number }) => {
  const cartas = useRecoilValue(huecoState(slot));
  const lastHidden = useRecoilValue(lastHiddenState(slot));
  return <CardStack cartas={cartas} lastHidden={lastHidden} />;
};

export default Hueco;
