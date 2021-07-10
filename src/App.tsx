import React from 'react';
import './App.css';
import 'bulma/css/bulma.min.css';
import Navbar from './Navbar';
import { baraja, HUECO } from './datos';
import Sprite from 'Components/Sprite';
import Mazo from 'Components/Mazo';
import Vista from 'Components/Vista';
import Hueco from 'Components/Hueco';
import useInit from 'useInit';

function App() {
  useInit();

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
          <div className="column celda">
            <Sprite cardId={HUECO} />
          </div>
          <div className="column celda">
            <Sprite cardId={HUECO} />
          </div>
          <div className="column celda">
            <Sprite cardId={HUECO} />
          </div>
          <div className="column celda">
            <Sprite cardId={HUECO} />
          </div>
        </div>
        <div className="columns">
          {[0, 1, 2, 3, 4, 5, 6].map((slot) => (
            <div className="column celda">
              <Hueco slot={slot} />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;
