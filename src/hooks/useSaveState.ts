import { useSetRecoilState } from 'recoil';
import { saveSnapshot } from 'store/snapshots';

//TODO https://github.com/facebookexperimental/Recoil/issues/451#issuecomment-655243901
export const useSaveState = () => useSetRecoilState(saveSnapshot);

export default useSaveState;
