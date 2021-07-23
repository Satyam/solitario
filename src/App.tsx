import './App.css';

import { UndoButton, RedoButton } from 'Components/UndoRedoButton';
import Mazo from 'Components/Mazo';
import Vista from 'Components/Vista';
import Hueco from 'Components/Hueco';
import Pila from 'Components/Pila';
import Stats from 'Components/Stats';
import { MdAutorenew, MdUndo, MdRedo } from 'react-icons/md';
import {
  useAppDispatch,
  useAppSelector,
  newGameAction,
  selHasWon,
  clearUndoAction,
} from 'store';

import { numHuecos, numPilas } from 'datos';

import { slotsArray } from 'utils';

function App() {
  const dispatch = useAppDispatch();

  const isGameWon = useAppSelector(selHasWon);
  const newGame = () => {
    dispatch(newGameAction());
    dispatch(clearUndoAction());
  };

  return (
    <div className="App">
      <header className="nav">
        <div className="leftNav">
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
        <div className="centerNav">
          <div className="heading">Solitario</div>
          <div className="celda heading">{isGameWon && 'Ganamos'}</div>
        </div>
        <div className="rightNav">
          <Stats />
        </div>
      </header>
      <main>
        <div className="grid">
          <div className="celda">
            <Mazo />
          </div>

          <div className="celda">
            <Vista />
          </div>

          <div className="celda">&nbsp;</div>
          {slotsArray(numPilas).map((slot) => (
            <div key={slot} className="celda">
              <Pila slot={slot} />
            </div>
          ))}
          {slotsArray(numHuecos).map((slot) => (
            <div key={slot} className="celda">
              <Hueco slot={slot} />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;
