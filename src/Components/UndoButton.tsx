import { MouseEventHandler } from 'react';
import { useSetRecoilState, useRecoilValue } from 'recoil';
import { snapshots, undoAction } from 'store/snapshots';

export const UndoButton: React.FC = ({ children }) => {
  const undo = useSetRecoilState(undoAction);
  const undoStack = useRecoilValue(snapshots);
  const onClick: MouseEventHandler<HTMLButtonElement> = (ev) => {
    ev.preventDefault();
    undo(undefined);
  };
  return (
    <button disabled={undoStack.length <= 1} onClick={onClick}>
      {children}
    </button>
  );
};

export default UndoButton;
