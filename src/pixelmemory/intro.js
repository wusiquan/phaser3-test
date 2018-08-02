import Helper from './helper'
import Transition from './transition'

var IntroScene = new Phaser.Scene("Intro");

IntroScene.init = function() {
    this._CONFIG = this.sys.game._CONFIG
    // this.storage = new Storage,
    this.helper = new Helper()
    this.transition = new Transition()
    // this.ajax = new Ajax
}

IntroScene.create = function() {
    var data;
    this.bg = this.add.image(0, 0, "bg-main").setOrigin(0);
    this.card_1 = this.add.sprite(.1 * this._CONFIG.width, -100, "spr-decks").setAlpha(.6).setFrame(1)
    this.card_2 = this.add.sprite(.4 * this._CONFIG.width, -100, "spr-decks").setAlpha(.6).setFrame(0)
    this.card_3 = this.add.sprite(.8 * this._CONFIG.width, -100, "spr-decks").setAlpha(.6).setFrame(2)
    this.title = this.helper.createText(this, this._CONFIG.centerX, .25 * this._CONFIG.height, "Pixel Memory!", 92)
    this.btn_play = this.helper.createBtn(this, this._CONFIG.centerX, this._CONFIG.centerY, "btn-play", this.startTransitionOut, {
      over: 1,
      down: 2
    })
    data = {
      string: "@wusiquan",
      size: 64,
      color: "0xFFFFFF",
      x: 30,
      y: -10
    }
    this.btn_twitter = this.helper.createBtnWithLabel(this, this._CONFIG.centerX, this._CONFIG.height - 100, "btn-twitter", this.goTwitter, data)
    this.btn_twitter.setScale(.5)
    this.startScene()
}

IntroScene.startScene = function() {
  // this.ajax.addOnlinePlayer(this, this.storage.data.level, this.helper.getDeviceName()),
  this.startTransitionIn()
  this.startBackgroundAnim()
  this.startPlayJiggle()
}

IntroScene.startPlayJiggle = function() {
  this.add.tween({
    targets: this.btn_play,
    delay: 500,
    rotation: .15,
    ease: "Linear",
    duration: 100,
    yoyo: true,
    repeat: -1,
    repeatDelay: 1000
  })
}

IntroScene.startBackgroundAnim = function() {
  var h = this._CONFIG.height;
  function fall(card, delay) {
    return {
      targets: card,
      delay: delay,
      y: h + 100,
      ease: "Linear",
      duration: 2000,
      yoyo: false,
      repeat: -1,
      repeatDealy: 1000
    }
  }
  function flip(card, delay) {
    return {
      targets: card,
      delay: delay,
      scaleX: -1,
      ease: "Linear",
      duration: 500,
      yoyo: true,
      repeat: -1
    }
  }
  this.twn_1a = this.add.tween(fall(this.card_1, 500))
  this.twn_2a = this.add.tween(fall(this.card_2, 1500))
  this.twn_3a = this.add.tween(fall(this.card_3, 1000))
  this.twn_1b = this.add.tween(flip(this.card_1, 500))
  this.twn_2b = this.add.tween(flip(this.card_2, 1500))
  this.twn_3b = this.add.tween(flip(this.card_3, 1000))
}

IntroScene.startTransitionIn = function() {
  var gameObjects = [this.title, this.btn_play, this.btn_twitter, this.btn_twitter.data.label_obj];
  this.transition.fadeInElements(this, gameObjects, function() {})
}

IntroScene.startTransitionOut = function() {
  var gameObjects = [this.title, this.btn_play, this.btn_twitter, this.btn_twitter.data.label_obj];
  this.transition.fadeOutElements(this, gameObjects, this.goMenu)
}

IntroScene.goTwitter = function() {
  // window.open("http://www.baidu.com", "_blank")
}

IntroScene.goMenu = function() {  
  this.scene.start("Menu")
}

export default IntroScene