import { init } from 'store/globals';
import { useSetRecoilState } from 'recoil';
import { baraja } from 'datos';
import { useState } from 'react';
import { saveSnapshot } from 'store/snapshots';

const useInit = () => {
  const [firstTime, setFirstTime] = useState(true);
  const resetState = useSetRecoilState(init);
  const saveState = useSetRecoilState(saveSnapshot);

  return () => {
    resetState(undefined);
    saveState(undefined);
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
