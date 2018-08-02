import Phaser from 'phaser'

var BootScene = new Phaser.Scene('Boot')

BootScene.preload = function () {
  this.load.setPath(this.sys.game._URL + 'fonts')
  this.load.bitmapFont('supermercado', 'supermercado.png', 'supermercado.xml')
  this.load.setPath(this.sys.game._URL + "images/pixelmemory")
  this.load.image('bg-main', 'bg-main.png')
}

BootScene.create = function () {
  this.scene.start('Preload')
}

export default BootScene