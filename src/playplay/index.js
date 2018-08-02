import Phaser from 'phaser'

class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'Game' })
  }

  create() {
  }
}

let gameConfig = {
  type: Phaser.AUTO,
  parent: 'phaser-example',
  width: 640,
  height: 800,
  transparent: true,
  // physics: {
  //   default: 'arcade',
  //   arcade: {
  //     gravity: { y: 300 },
  //     debug: false
  //   }
  // },
  scene: [ GameScene ]
}
new Phaser.Game(gameConfig)