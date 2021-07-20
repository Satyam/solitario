import { MouseEventHandler } from 'react';
import {
  useAppDispatch,
  useAppSelector,
  undoAction,
  redoAction,
  selCanUndo,
  selCanRedo,
  selUndoAction,
  selRedoAction,
} from 'store';

export const UndoButton: React.FC = ({ children }) => {
  const canUndo = useAppSelector(selCanUndo);
  const actionToUndo = useAppSelector(selUndoAction);
  const dispatch = useAppDispatch();
  const onClick: MouseEventHandler<HTMLButtonElement> = (ev) => {
    ev.preventDefault();
    dispatch(undoAction(actionToUndo));
  };
  return (
    <button disabled={!canUndo} onClick={onClick}>
      {children}
    </button>
  );
};

export const RedoButton: React.FC = ({ children }) => {
  const canRedo = useAppSelector(selCanRedo);
  const actionToRedo = useAppSelector(selRedoAction);
  const dispatch = useAppDispatch();
  const onClick: MouseEventHandler<HTMLButtonElement> = (ev) => {
    ev.preventDefault();
    dispatch(redoAction(actionToRedo));
  };
  return (
    <button disabled={!canRedo} onClick={onClick}>
      {children}
    </button>
  );
};
