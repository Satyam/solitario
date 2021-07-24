import './App.css';

import Mazo from 'Components/Mazo';
import Vista from 'Components/Vista';
import Hueco from 'Components/Hueco';
import Pila from 'Components/Pila';
import Stats from 'Components/Stats';
import Toolbox from 'Components/Toolbox';
import { useAppSelector, selHasWon } from 'store';

import { numHuecos, numPilas } from 'datos';

import { slotsArray } from 'utils';

function App() {
  const isGameWon = useAppSelector(selHasWon);

  return (
    <div className="App">
      <header className="nav">
        <div className="leftNav">
          <Toolbox />
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
