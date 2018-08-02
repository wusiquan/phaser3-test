var LoadingBar = function () {
  this.margin_y = 50
}

LoadingBar.prototype.createLoadingLabel = function (scene) {
  var t = scene.helper.createText(scene, scene._CONFIG.centerX, scene._CONFIG.centerY + this.margin_y, "00 %")
  scene.load.on("progress", function (e) {
    t.text = Math.round(100 * e) + " %"
  })
  this.txt_percent = t
}

LoadingBar.prototype.createLoadingAnim = function (e) {
  var t = "spr-decks",
    a = e._CONFIG.centerX,
    r = e._CONFIG.centerY + this.margin_y,
    s = 0,
    i = 1;

  function n(e, t) {
    var a;
    a = 3 === t.frame.name ? Phaser.Math.Between(0, 2) : 3, t.setFrame(a)
  }

  function d(e, t) {
    return {
      targets: e,
      delay: t,
      scaleX: -1,
      ease: "Linear",
      duration: 500,
      hold: 500,
      yoyo: !0,
      repeat: -1,
      onRepeat: n
    }
  }
  this.card_1 = e.add.sprite(a - 140, r, t).setScale(s, i).setFrame(0), this.card_2 = e.add.sprite(a - 70, r, t).setScale(s, i).setFrame(1), this.card_3 = e.add.sprite(a + 0, r, t).setScale(s, i).setFrame(2), this.card_4 = e.add.sprite(a + 70, r, t).setScale(s, i).setFrame(0), this.card_5 = e.add.sprite(a + 140, r, t).setScale(s, i).setFrame(1), this.tween_1 = e.add.tween(d(this.card_1, 0)), this.tween_2 = e.add.tween(d(this.card_2, 50)), this.tween_3 = e.add.tween(d(this.card_3, 100)), this.tween_4 = e.add.tween(d(this.card_4, 150)), this.tween_5 = e.add.tween(d(this.card_5, 200))
}

LoadingBar.prototype.createProgressBar = function (e) {
  var t = e.add.graphics();
  e.load.on("progress", function (a) {
    t.clear(), t.fillStyle(16777215, 1), t.fillRect(0, 270, e.sys.game._CONFIG.width * a, 60)
  }), e.load.on("complete", function () {})
};

export default LoadingBar