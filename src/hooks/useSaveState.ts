import { useSetRecoilState } from 'recoil';
import { saveSnapshot } from 'store/snapshots';

export const useSaveState = () => useSetRecoilState(saveSnapshot);

export default useSaveState;
