import Phaser from 'phaser';
import { baraja, HUECO, REVERSO } from './datos';

export default class Demo extends Phaser.Scene {
  constructor() {
    super('demo');
  }

  preload() {
    const loader = this.load;
    Object.keys(baraja).forEach((cardId) =>
      loader.image(cardId, `assets/cards/${cardId}.svg`)
    );
    loader.image(REVERSO, 'assets/cards/2B.svg');
    loader.image(HUECO, 'assets/cards/hueco.svg');
  }

  create() {
    const reverso = this.add.image(400, 300, REVERSO);
    reverso.scale = 0.5;
    this.add.image(200, 200, 'KD');
  }
}
