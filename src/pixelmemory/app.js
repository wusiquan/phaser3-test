// https://blog.csdn.net/qq_34334685/article/details/79385622
// 游戏 http://browsergameshub.com/gameapps/PixelMemory/
// 他的一些phaser3踩坑经验 http://browsergameshub.com/phaser3-lessons-and-code-pt1/
import Phaser from 'phaser'
import BootScene from './boot'
import PreloadScene from './preload'
import IntroScene from './intro'
import MenuScene from './menu'

let App = function () {}

App.prototype.start = function () {
  let scenes = []
  scenes.push(BootScene)
  scenes.push(PreloadScene)
  scenes.push(IntroScene)
  scenes.push(MenuScene)
  // scenes.push(ProfileScene)
  // scenes.push(HowtoScene)
  // scenes.push(InfoScene)
  // scenes.push(CardpackScene)
  // scenes.push(CollectionScene)
  // scenes.push(DifficultyScene)
  // scenes.push(DecksScene)
  // scenes.push(PlayScene)
  // scenes.push(RedirectScene)

  let config = {
    type: Phaser.AUTO,
    width: 576,
    height: 960,
    parent: 'phaser-app',
    scene: scenes,
    title: 'PixelMemory!'
  }
  let game = new Phaser.Game(config)
  game._URL = 'src/'
  game._BASECARDS_NUM = 27
  game._COLLECTION_MAX = -1
  game._CONFIG = config 
  game._CONFIG.centerX = Math.round(.5 * config.width)
  game._CONFIG.centerY = Math.round(.5 * config.height)
  game.SOUND_ON = true
}

export default App