

var MenuScene = new Phaser.Scene("Menu")

MenuScene.init = function () {
  this._CONFIG = this.sys.game._CONFIG
  // this.storage = new Storage
  this.helper = new Helper
  this.transition = new Transition
  this.profile_elements = undefined
  this.cardpack_elements = undefined
}

MenuScene.create = function () {
  var t, e, i = {
    over: 1,
    down: 2
  };
  this.bg = this.add.image(0, 0, "bg-main").setOrigin(0), this.createProfileElements(), 0 === this.storage.data.cardpacks && (t = function () {
    this.startTransitionOut.call(this, this.goDifficulty)
  }, this.btn_play = this.helper.createBtn(this, this._CONFIG.centerX, this._CONFIG.centerY, "btn-play", t, i)), this.storage.data.cardpacks > 0 && this.createCardpackElements(), e = {
    string: "How To Play",
    size: 64,
    color: "0xFFFFFF",
    x: 0,
    y: -10
  }, t = function () {
    this.startTransitionOut.call(this, this.goHowto)
  }, this.btn_howto = this.helper.createBtnWithLabel(this, this._CONFIG.centerX, this._CONFIG.height - 230, "btn-wide", t, e, i), e = {
    string: "Dev Info & Credits",
    size: 64,
    color: "0xFFFFFF",
    x: 0,
    y: -15
  }, t = function () {
    this.startTransitionOut.call(this, this.goInfo)
  }, this.btn_info = this.helper.createBtnWithLabel(this, this._CONFIG.centerX, this._CONFIG.height - 100, "btn-wide", t, e, i), this.startScene()
}, MenuScene.createProfileElements = function () {
  "use strict";
  var t, e, i, s, n, r, a, o = 170;

  function l(i) {
    t.visible = !0, e.setTint(16771722)
  }

  function h(i) {
    t.visible = !1, e.setTint(16777215)
  }
  this.profile_elements = {}, (t = this.add.sprite(this._CONFIG.centerX - 21, 168, "bg-profileglow")).visible = !1, e = this.helper.createText(this, 340, 110, "Profile"), i = this.add.sprite(227, o, "bg-xpbar").setOrigin(0), s = this.add.sprite(i.x + 4, i.y + 4, "xpbar").setOrigin(0), n = this.add.sprite(150, o, "bg-level").setFrame(0), r = this.helper.createText(this, n.x, n.y - 70, "Level", 30, "0x333333"), a = this.helper.createText(this, n.x, n.y - 25, this.storage.data.level.toString(), 120, "0x333333"), n.setInteractive(), n.on("pointerover", l), i.on("pointerover", l), s.on("pointerover", l), n.on("pointerout", h), i.on("pointerout", h), s.on("pointerout", h);
  var c = this;

  function p(t) {
    c.helper.playClickSfx(c), c.startTransitionOut.call(c, c.goProfile)
  }
  n.on("pointerdown", p), i.on("pointerdown", p), s.on("pointerdown", p), this.profile_elements.bg_glow = t, this.profile_elements.txt_profile = e, this.profile_elements.bg_level = n, this.profile_elements.txt_label = r, this.profile_elements.txt_level = a, this.profile_elements.bg_xpbar = i, this.profile_elements.xpbar = s
}, MenuScene.createCardpackElements = function () {
  "use strict";
  var t, e, i;
  this.cardpack_elements = {}, e = {
    over: 1
  }, i = function () {
    this.startTransitionOut.call(this, this.goCardpack)
  }, t = this.helper.createBtn(this, this._CONFIG.centerX, this._CONFIG.centerY - 15, "btn-cardpack", i, e), this.cardpack_elements.btn = t
}, MenuScene.startScene = function () {
  "use strict";
  this.startTransitionIn(), this.setProfile(), this.storage.data.cardpacks > 0 ? this.startCardpackAnim() : this.startPlayJiggle()
}, MenuScene.setProfile = function () {
  "use strict";
  var t;
  t = Math.min(this.storage.data.xp / this.storage.data.xp_max, 1), this.storage.data.level >= this.storage.data.level_max && (t = 1), this.profile_elements.xpbar.displayWidth = 0, t > 0 && this.add.tween({
    targets: this.profile_elements.xpbar,
    delay: 500,
    displayWidth: Math.round(this.profile_elements.xpbar.width * t),
    ease: "Linear",
    duration: Math.round(500 * t)
  }), this.storage.data.level >= this.storage.data.level_max && (this.profile_elements.bg_level.setFrame(1), this.profile_elements.txt_level.setText("Max"), this.profile_elements.txt_level.setScale(.9), this.profile_elements.txt_level.x -= 70, this.profile_elements.txt_level.y += 5)
}, MenuScene.startCardpackAnim = function () {
  "use strict";
  this.add.tween({
    targets: this.cardpack_elements.btn,
    delay: 500,
    scaleX: 1.05,
    scaleY: 1.05,
    ease: "Linear",
    duration: 500,
    yoyo: !0,
    repeat: -1
  })
}, MenuScene.startPlayJiggle = function () {
  "use strict";
  this.add.tween({
    targets: this.btn_play,
    delay: 500,
    rotation: .15,
    ease: "Linear",
    duration: 100,
    yoyo: !0,
    repeat: -1,
    repeatDelay: 1e3
  })
}, MenuScene.startTransitionIn = function () {
  "use strict";
  this.transition.fadeInElements(this, this.getTransitionTargets(), function () {})
}, MenuScene.startTransitionOut = function (t) {
  "use strict";
  this.transition.fadeOutElements(this, this.getTransitionTargets(), t)
}, MenuScene.getTransitionTargets = function () {
  "use strict";
  var t = [this.profile_elements.bg_glow, this.profile_elements.txt_profile, this.profile_elements.bg_xpbar, this.profile_elements.xpbar, this.profile_elements.bg_level, this.profile_elements.txt_label, this.profile_elements.txt_level, this.btn_howto, this.btn_howto.data.label_obj, this.btn_info, this.btn_info.data.label_obj];
  return void 0 !== this.cardpack_elements ? t.push(this.cardpack_elements.btn) : t.push(this.btn_play), t
}, MenuScene.goProfile = function () {
  "use strict";
  this.scene.start("Profile")
}, MenuScene.goDifficulty = function () {
  "use strict";
  this.scene.start("Difficulty")
}, MenuScene.goCardpack = function () {
  "use strict";
  this.scene.start("Cardpack")
}, MenuScene.goHowto = function () {
  "use strict";
  this.scene.start("Howto")
}, MenuScene.goInfo = function () {
  "use strict";
  this.scene.start("Info")
};



export default MenuScene