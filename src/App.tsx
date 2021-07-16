import './App.css';
import Mazo from 'Components/Mazo';
import Vista from 'Components/Vista';
import Hueco from 'Components/Hueco';
import useInit from 'useInit';
import Pila from 'Components/Pila';
import { useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { isGameWon } from 'store/pilas';
import { numHuecos, numPilas } from 'datos';

function App() {
  const init = useInit();
  const isWon = useRecoilValue(isGameWon);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(init, []);
  return (
    <div className="App">
      <header>
        <button onClick={init}>Nuevo Juego</button>
        {isWon && <h3>Ganamos</h3>}
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
          {Array(numPilas)
            .fill(0)
            .map((_, slot) => (
              <div key={slot} className="celda">
                <Pila slot={slot} />
              </div>
            ))}
          {Array(numHuecos)
            .fill(0)
            .map((_, slot) => (
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
