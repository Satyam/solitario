import { MouseEventHandler } from 'react';
import { MdAutorenew, MdUndo, MdRedo, MdTrendingUp } from 'react-icons/md';
import {
  useAppDispatch,
  useAppSelector,
  newGameAction,
  clearUndoAction,
  raiseAction,
  undoAction,
  redoAction,
  selCanUndo,
  selCanRedo,
} from 'store';

export const Toolbox = () => {
  const dispatch = useAppDispatch();
  const canUndo = useAppSelector(selCanUndo);
  const canRedo = useAppSelector(selCanRedo);

  const newGame: MouseEventHandler<HTMLButtonElement> = (ev) => {
    ev.preventDefault();
    dispatch(newGameAction());
    dispatch(clearUndoAction());
  };
  const undo: MouseEventHandler<HTMLButtonElement> = (ev) => {
    ev.preventDefault();
    dispatch(undoAction());
  };
  const redo: MouseEventHandler<HTMLButtonElement> = (ev) => {
    ev.preventDefault();
    dispatch(redoAction());
  };
  const raise: MouseEventHandler<HTMLButtonElement> = (ev) => {
    ev.preventDefault();
    dispatch(raiseAction());
  };

  return (
    <div className="toolbox">
      <button onClick={newGame} title="New Game">
        <MdAutorenew />
      </button>
      <button disabled={!canUndo} onClick={undo}>
        <MdUndo title="Undo" />
      </button>
      <button disabled={!canRedo} onClick={redo}>
        <MdRedo title="Redo" />
      </button>
      <button onClick={raise}>
        <MdTrendingUp title="Raise" />
      </button>
    </div>
  );
};

export default Toolbox;
