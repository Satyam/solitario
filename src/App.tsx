import React from 'react';
import './App.css';
import 'bulma/css/bulma.min.css';
import Navbar from './Navbar';
import { baraja, HUECO } from './datos';
import Sprite from 'Components/Sprite';
import Mazo from 'Components/Mazo';
import Vista from 'Components/Vista';
import CardStack from 'Components/CardStack';

function App() {
  // Image preload
  Object.keys(baraja).forEach((cardId) => {
    new Image().src = `assets/cards/${cardId}.svg`;
  });

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
          <div className="column celda">
            <Sprite cardId="AD" />
          </div>
          <div className="column celda" style={{ position: 'relative' }}>
            <CardStack />
          </div>
          <div className="column celda">
            {[0, 1, 2, 3].map((index) => (
              <Sprite key={index} cardId={'3H'} index={index} />
            ))}
          </div>
          <div className="column celda">
            <Sprite cardId="4D" />
          </div>
          <div className="column celda">
            <Sprite cardId="5D" />
          </div>
          <div className="column celda">
            <Sprite cardId="6D" />
          </div>
          <div className="column celda">
            <Sprite cardId="7D" />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
