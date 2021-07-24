import { UndoButton, RedoButton } from 'Components/UndoRedoButton';
import { MdAutorenew, MdUndo, MdRedo } from 'react-icons/md';
import { useAppDispatch, newGameAction, clearUndoAction } from 'store';

export const Toolbox = () => {
  const dispatch = useAppDispatch();

  const newGame = () => {
    dispatch(newGameAction());
    dispatch(clearUndoAction());
  };

  return (
    <div className="toolbox">
      <button onClick={newGame} title="New Game">
        <MdAutorenew />
      </button>
      <UndoButton>
        <MdUndo title="Undo" />
      </UndoButton>
      <RedoButton>
        <MdRedo title="Redo" />
      </RedoButton>
    </div>
  );
};

export default Toolbox;
