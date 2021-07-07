import Phaser from 'phaser';

import Demo from './scene';

const config = {
  type: Phaser.AUTO,
  backgroundColor: '#125555',
  // width: window.innerWidth,
  // height: window.innerHeight,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  zoom: 2,
  scene: Demo,
};

const game = new Phaser.Game(config);

export default game;
