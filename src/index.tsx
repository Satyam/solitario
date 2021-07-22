import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from 'App';
import { store } from 'store';
import { Provider } from 'react-redux';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { baraja } from 'datos';

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <DndProvider backend={HTML5Backend}>
        <App />
      </DndProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// Image preload
Object.keys(baraja).forEach((cardId) => {
  new Image().src = `assets/cards/${cardId}.svg`;
});
