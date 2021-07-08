import React from 'react';
import './App.css';
import 'bulma/css/bulma.min.css';
import Navbar from './Navbar';
import { baraja } from './datos';
import Sprite from 'Components/Sprite';

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
          <div className="column">
            <Sprite cardId="AC" x={0} y={0} />
          </div>
          <div className="column">
            <Sprite cardId="2C" x={0} y={0} />
          </div>
          <div className="column">
            <Sprite cardId="3C" x={0} y={0} />
          </div>
          <div className="column">
            <Sprite cardId="4C" x={0} y={0} />
          </div>
          <div className="column">
            <Sprite cardId="5C" x={0} y={0} />
          </div>
          <div className="column">
            <Sprite cardId="6C" x={0} y={0} />
          </div>
          <div className="column">
            <Sprite cardId="7C" x={0} y={0} />
          </div>
        </div>
        <div className="columns">
          <div className="column">
            <Sprite cardId="AD" x={0} y={0} />
          </div>
          <div className="column">
            <Sprite cardId="2D" x={0} y={0} />
          </div>
          <div className="column">
            <Sprite cardId="3D" x={0} y={0} />
          </div>
          <div className="column">
            <Sprite cardId="4D" x={0} y={0} />
          </div>
          <div className="column">
            <Sprite cardId="5D" x={0} y={0} />
          </div>
          <div className="column">
            <Sprite cardId="6D" x={0} y={0} />
          </div>
          <div className="column">
            <Sprite cardId="7D" x={0} y={0} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
