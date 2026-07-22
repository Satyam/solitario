import { Mazo } from './mazo.js';
import { Vista } from './vista.js';

export function test() {
  const sandbox1 = document.getElementById('test1');
  const sandbox2 = document.getElementById('test2');
  const mazo = new Mazo();
  mazo.push('4H', '3H', '2H');
  sandbox1.appendChild(mazo.el);
  const vista = new Vista();
  sandbox2.appendChild(vista.el);
  sandbox1.addEventListener('click', () => {
    vista.push(mazo.pop());
  });
}
