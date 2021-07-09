import React from 'react';
import './App.css';
import 'bulma/css/bulma.min.css';
import Navbar from './Navbar';
import { baraja } from './datos';
import Sprite from 'Components/Sprite';
import Mazo from 'Components/Mazo';
import Vista from 'Components/Vista';
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
          <div className="column celda">
            <Sprite cardId="3C" />
          </div>
          <div className="column celda">
            <Sprite cardId="4C" />
          </div>
          <div className="column celda">
            <Sprite cardId="5C" />
          </div>
          <div className="column celda">
            <Sprite cardId="6C" />
          </div>
          <div className="column celda">
            <Sprite cardId="7C" />
          </div>
        </div>
        <div className="columns">
          <div className="column celda">
            <Sprite cardId="AD" />
          </div>
          <div className="column celda" style={{ position: 'relative' }}>
            <Sprite cardId="2D" />
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
