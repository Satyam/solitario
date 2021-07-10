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
          <div className="column celda">
            <Mazo />
          </div>
          <div className="column celda">
            <Vista />
          </div>
          <div className="column celda"></div>
          {[0, 1, 2, 3].map((slot) => (
            <div key={slot} className="column celda">
              <Pila slot={slot} />
            </div>
          ))}
        </div>
        <div className="columns">
          {[0, 1, 2, 3, 4, 5, 6].map((slot) => (
            <div key={slot} className="column celda">
              <Hueco slot={slot} />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;
