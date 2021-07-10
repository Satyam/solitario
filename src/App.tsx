import './App.css';
import 'bulma/css/bulma.min.css';
import Navbar from './Navbar';
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
        <Navbar />
      </header>
      <main>
        <div className="columns">
          <div className="column">
            <div className="celda">
              <Mazo />
            </div>
          </div>
          <div className="column">
            <div className="celda">
              <Vista />
            </div>
          </div>
          <div className="column"></div>
          {[0, 1, 2, 3].map((slot) => (
            <div key={slot} className="column">
              <div className="celda">
                <Pila slot={slot} />
              </div>
            </div>
          ))}
        </div>
        <div className="columns">
          {[0, 1, 2, 3, 4, 5, 6].map((slot) => (
            <div key={slot} className="column">
              <div className="celda">
                <Hueco slot={slot} />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;
