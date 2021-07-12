import './App.css';
import Mazo from 'Components/Mazo';
import Vista from 'Components/Vista';
import Hueco from 'Components/Hueco';
import useInit from 'useInit';
import Pila from 'Components/Pila';
import { useEffect } from 'react';

function App() {
  const init = useInit();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(init, []);
  return (
    <div className="App">
      <header>
        <button>Nuevo Juego</button>
      </header>
      <main>
        <div className="row">
          <div className="celda">
            <Mazo />
          </div>

          <div className="celda">
            <Vista />
          </div>

          <div className="celda">&nbsp;</div>
          {[0, 1, 2, 3].map((slot) => (
            <div key={slot} className="celda">
              <Pila slot={slot} />
            </div>
          ))}
        </div>
        <div className="row">
          {[0, 1, 2, 3, 4, 5, 6].map((slot) => (
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
