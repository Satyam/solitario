import { useSetRecoilState } from 'recoil';
import { saveState } from 'store/undoStack';

//TODO https://github.com/facebookexperimental/Recoil/issues/451#issuecomment-655243901
export const useSaveState = () => useSetRecoilState(saveState);

export default useSaveState;
