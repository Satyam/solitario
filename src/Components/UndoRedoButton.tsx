import { MouseEventHandler } from 'react';
import {
  useAppDispatch,
  useAppSelector,
  undoAction,
  redoAction,
  selCanUndo,
  selCanRedo,
} from 'store';

export const UndoButton: React.FC = ({ children }) => {
  const canUndo = useAppSelector(selCanUndo);
  const dispatch = useAppDispatch();
  const onClick: MouseEventHandler<HTMLButtonElement> = (ev) => {
    ev.preventDefault();
    dispatch(undoAction());
  };
  return (
    <button disabled={!canUndo} onClick={onClick}>
      {children}
    </button>
  );
};

export const RedoButton: React.FC = ({ children }) => {
  const canRedo = useAppSelector(selCanRedo);
  const dispatch = useAppDispatch();
  const onClick: MouseEventHandler<HTMLButtonElement> = (ev) => {
    ev.preventDefault();
    dispatch(redoAction());
  };
  return (
    <button disabled={!canRedo} onClick={onClick}>
      {children}
    </button>
  );
};
