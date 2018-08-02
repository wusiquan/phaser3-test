import Phaser from 'phaser'
import Helper from './helper'
import LoadingBar from './loadingbar'
import Transition from './transition'

var PreloadScene = new Phaser.Scene("Preload")

PreloadScene.init = function () {
  this.helper = new Helper()
  this._URL = this.sys.game._URL
  this._CONFIG = this.sys.game._CONFIG
  
  // this.storage = new Storage
  this.transition = new Transition()
  // this.sys.game._COLLECTION_MAX = this.storage.data.collection_max
}

PreloadScene.preload = function () {
  let { _URL, _CONFIG } = this

  this.add.image(0, 0, "bg-main").setOrigin(0)
  
  this.loading_bar = new LoadingBar()
  this.loading_bar.createLoadingLabel(this)
  this.txt_loading = this.helper.createText(this, _CONFIG.centerX, _CONFIG.centerY - this.loading_bar.margin_y, "Loading Game...")
  this.load.setPath(_URL + 'audio')
  this.load.audio('btn_click', ['btn_click.ogg', 'btn_click.m4a'])
  this.load.audio("get_xp", ['get_xp.ogg', 'get_xp.m4a'])
  this.load.audio("game_lost", ['game_lost.ogg', 'game_lost.m4a'])
  this.load.audio("game_won", ["game_won.ogg", "game_won.m4a"])
  this.load.audio("pair_correct", ["pair_correct.ogg", "pair_correct.m4a"])
  this.load.audio("throw_card", ["throw_card.ogg", "throw_card.m4a"])
  this.load.audio("tap_card", ["tap_card.ogg", "tap_card.m4a"])
  this.load.setPath(this._URL + 'images/pixelmemory')
  this.load.image("btn-twitter", "btn-twitter.png")
  this.load.image("bg-profileglow", "bg-profileglow.png")
  this.load.image("bg-xpbar", "bg-xpbar.png")
  this.load.image("bg-uitopbar", "bg-uitopbar.png")
  this.load.image("xpbar", "img-xpbar.png")
  
  this.load.spritesheet("btn-play", "btn-play.png", {
    frameWidth: 214,
    frameHeight: 239,
    endFrame: 2
  })
  this.load.spritesheet("btn-wide", "btn-wide.png", {
    frameWidth: 468,
    frameHeight: 119,
    endFrame: 2
  })
  this.load.spritesheet("btn-small", "btn-small.png", {
    frameWidth: 225,
    frameHeight: 119,
    endFrame: 2
  })
  this.load.spritesheet("btn-cardpack", "btn-cardpack.png", {
    frameWidth: 368,
    frameHeight: 352,
    endFrame: 1
  })
  this.load.spritesheet("btn-collection", "btn-collection.png", {
    frameWidth: 368,
    frameHeight: 352,
    endFrame: 1
  })
  this.load.spritesheet("bg-level", "spr-levelbg.png", {
    frameWidth: 204,
    frameHeight: 214,
    endFrame: 1
  })
  this.load.spritesheet("spr-decks", "spr-decks.png", {
    frameWidth: 64,
    frameHeight: 64,
    endFrame: 3
  })
  this.load.spritesheet("spr-collection", "spr-collection.v2.png", {
    frameWidth: 368,
    frameHeight: 352,
    endFrame: this.sys.game._COLLECTION_MAX - 1
  })
  this.load.spritesheet("spr-explosion", "spr-explosion.png", {
    frameWidth: 512,
    frameHeight: 512,
    endFrame: 63
  })
  this.load.spritesheet("spr-cards", "spr-cards.v2.png", {
    frameWidth: 64,
    frameHeight: 64,
    endFrame: this.sys.game._BASECARDS_NUM - 1 + this.sys.game._COLLECTION_MAX
  })
}

PreloadScene.create = function () {
  this.startTransitionOut()
}

PreloadScene.startTransitionOut = function () {
  var elements = [this.txt_loading, this.loading_bar.txt_percent];
  this.transition.fadeOutElements(this, elements, () => {
    this.goIntro()
  })
}

PreloadScene.goIntro = function () {
  this.scene.start("Intro")
};

export default PreloadScene