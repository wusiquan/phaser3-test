import Phaser from 'phaser'

class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'Game' })
  }

  preload() {
    this.load.image('tiles', '../assets/tilemap1/tuxmon-sample-32px-extruded.png')
    this.load.tilemapTiledJSON('map', '../assets/tilemap1/tuxemon-town.json')
  }

  create() {
    const map = this.make.tilemap({ key: "map" })

    // Parameters are the name you gave the tileset in Tiled and then the key of the tileset image in
    // Phaser's cache (i.e. the name you used in preload)
    const tileset = map.addTilesetImage('tuxmon-sample-32px-extruded', 'tiles')

    // Parameters: layer name (or index) from Tiled, tileset, x, y
    const belowLayer = map.createStaticLayer("Below Player", tileset, 0, 0)
    const worldLayer = map.createStaticLayer("World", tileset, 0, 0)
    const aboveLayer = map.createStaticLayer("Above Player", tileset, 0, 0)

    // Phaser supports multiple cameras, but you can access the default camera like this:
    const camera = this.cameras.main;

    // Set up the arrows to control the camera
    const cursors = this.input.keyboard.createCursorKeys();
    this.controls = new Phaser.Cameras.Controls.FixedKeyControl({
      camera: camera,
      left: cursors.left,
      right: cursors.right,
      up: cursors.up,
      down: cursors.down,
      speed: 0.5
    })
    
    // Constrain the camera so that it isn't allowed to move outside the width/height of tilemap
    camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels)

    // Help text that has a "fixed" position on the screen
    this.add
      .text(16, 16, "Arrow keys to scroll", {
        font: "18px monospace",
        fill: "#ffffff",
        padding: { x: 20, y: 10 },
        backgroundColor: "#000000"
      })
      .setScrollFactor(0)
  }

  update(time, delta) {
    // Apply the controls to the camera each update tick of the game
    this.controls.update(delta)
  }
}

let gameConfig = {
  type: Phaser.AUTO,
  parent: 'phaser-example',
  width: 800,
  height: 600,
  pixelArt: true,
  // transparent: true,
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