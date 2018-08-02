import Helper from './helper'
import Transition from './transition'

var InfoScene = new Phaser.Scene("Info");
InfoScene.init = function () {
  this._CONFIG = this.sys.game._CONFIG
  // this.storage = new Storage,
  this.helper = new Helper()
  this.transition = new Transition()
}

InfoScene.create = function () {
  var t, e;
  this.bg = this.add.image(0, 0, "bg-main").setOrigin(0)
  this.title = this.helper.createText(this, this._CONFIG.centerX, 100, "Dev Info & Credits", 74)
  
  this.text_array = []
  this.text_array.push(this.helper.createText(this, this._CONFIG.centerX, 220, "Developed by:", 54))
  this.text_array.push(this.helper.createText(this, this._CONFIG.centerX, 274, "James Pierce", 34))
  this.text_array.push(this.helper.createText(this, this._CONFIG.centerX, 328, "james@browsergameshub.com", 34))
  this.text_array.push(this.helper.createText(this, this._CONFIG.centerX, 428, "CC0 Asset Authors:", 54))
  this.text_array.push(this.helper.createText(this, this._CONFIG.centerX, 482, 'Play Button by "GDquest"', 34))
  this.text_array.push(this.helper.createText(this, this._CONFIG.centerX, 536, 'Explosion Sprite by "Sinestesia"', 34))
  this.text_array.push(this.helper.createText(this, this._CONFIG.centerX, 590, "Audio from www.freesfx.co.uk", 34))
  this.text_array.push(this.helper.createText(this, this._CONFIG.centerX, 690, "More Free Games:", 54))
  this.text_array.push(this.helper.createText(this, this._CONFIG.centerX, 744, "www.BrowserGamesHub.com", 34))
  e = {
    string: "Back to Menu",
    size: 64,
    color: "0xFFFFFF",
    x: 0,
    y: -15
  },
  t = {
    over: 1,
    down: 2
  }
  this.btn_back = this.helper.createBtnWithLabel(this, this._CONFIG.centerX, this._CONFIG.height - 100, "btn-wide", this.startTransitionOut, e, t)
  
  this.startScene()
}

InfoScene.startScene = function () {
  this.startTransitionIn()
}

InfoScene.startTransitionIn = function () {
  this.transition.fadeInElements(this, this.getTransitionTargets(), function () {})
}

InfoScene.startTransitionOut = function () {
  this.transition.fadeOutElements(this, this.getTransitionTargets(), this.goMenu)
}

InfoScene.getTransitionTargets = function () {
  var t = [this.title, this.btn_back, this.btn_back.data.label_obj];
  return t = t.concat(this.text_array)
}

InfoScene.goTwitter = function () {
  // window.open("https://twitter.com/thejamespierce", "_blank")
}

InfoScene.goMenu = function () {
  this.scene.start("Menu")
}

export default InfoScene