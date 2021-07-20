import './App.css';

import { UndoButton, RedoButton } from 'Components/UndoRedoButton';
import Mazo from 'Components/Mazo';
import Vista from 'Components/Vista';
import Hueco from 'Components/Hueco';
import Pila from 'Components/Pila';

import { useEffect } from 'react';
import {
  useAppDispatch,
  useAppSelector,
  newGameAction,
  selHasWon,
} from 'store';

import { numHuecos, numPilas, baraja } from 'datos';

import { slotsArray } from 'utils';

function App() {
  const dispatch = useAppDispatch();

  const isGameWon = useAppSelector(selHasWon);
  const doInit = () => {
    dispatch(newGameAction());
    // Image preload
    Object.keys(baraja).forEach((cardId) => {
      new Image().src = `assets/cards/${cardId}.svg`;
    });
  };
  useEffect(
    doInit,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <div className="App">
      <header>
        <button onClick={doInit}>Nuevo Juego</button>
        <UndoButton>Undo</UndoButton>
        <RedoButton>Redo</RedoButton>
        {isGameWon && <h3>Ganamos</h3>}
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
