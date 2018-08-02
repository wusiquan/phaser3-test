var Transition = function () {}

Transition.prototype.fadeOutElements = function (scene, gameObjects, cb, duration) {
  if ("boolean" != typeof scene.allow_trans || false !== scene.allow_trans) {
    scene.allow_trans = false
    var o = {
      targets: gameObjects,
      delay: 0,
      alpha: 0,
      ease: "Linear",
      duration: duration || 500,
      onComplete: function () {
        scene.allow_trans = true
        cb.call(scene)
      },
      callbackScope: scene
    }
    this.twn_fade_out = scene.add.tween(o)
  }
}

Transition.prototype.fadeInElements = function (scene, gameObjects, cb, duration) {
    var o = {
      targets: gameObjects,
      delay: 0,
      alpha: 1,
      ease: "Linear",
      duration: duration || 500,
      onComplete: cb,
      callbackScope: scene
    };
    gameObjects.forEach(function (gameObject) {
      gameObject.setAlpha(0)
    }, scene)
    this.twn_fade_in = scene.add.tween(o)
  }

  Transition.prototype.fadeInVeil = function () {
    
  }

  Transition.prototype.fadeOutVeil = function () {
    
  }

  export default Transition