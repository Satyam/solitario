import { init } from 'store/globals';
import { useSetRecoilState } from 'recoil';
import { baraja } from 'datos';
import { useState } from 'react';
import { saveState } from 'store/undoStack';

const useInit = () => {
  const [firstTime, setFirstTime] = useState(true);
  const resetState = useSetRecoilState(init);
  const saveStateAction = useSetRecoilState(saveState);

  return () => {
    resetState(undefined);
    saveStateAction(true);
    if (firstTime) {
      setFirstTime(false);
      // Image preload
      Object.keys(baraja).forEach((cardId) => {
        new Image().src = `assets/cards/${cardId}.svg`;
      });
    }
  };
};

export default useInit;
