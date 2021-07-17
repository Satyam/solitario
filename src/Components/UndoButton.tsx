import { MouseEventHandler } from 'react';
import { useSetRecoilState, useRecoilValue } from 'recoil';
import { canUndo, undoAction } from 'store/undoStack';

export const UndoButton: React.FC = ({ children }) => {
  const undo = useSetRecoilState(undoAction);
  const disabled = !useRecoilValue(canUndo);
  const onClick: MouseEventHandler<HTMLButtonElement> = (ev) => {
    ev.preventDefault();
    undo(undefined);
  };
  return (
    <button disabled={disabled} onClick={onClick}>
      {children}
    </button>
  );
};

export default UndoButton;
