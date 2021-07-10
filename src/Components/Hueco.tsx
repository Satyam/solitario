import { useRecoilValue } from 'recoil';
import { huecoState, firstShownState } from 'store/huecos';
import CardStack from './CardStack';

const Hueco = ({ slot }: { slot: number }) => {
  const cartas = useRecoilValue(huecoState(slot));
  const firstShown = useRecoilValue(firstShownState(slot));
  return <CardStack cartas={cartas} firstShown={firstShown} />;
};

export default Hueco;
