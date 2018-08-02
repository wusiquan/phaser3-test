var Helper = function () {}

Helper.prototype.createText = function (scene, x, y, text, o, i, a) {
  var s;
  o = o || 64, i = i || "0xFFFFFF";
  return (s = scene.add.bitmapText(x, y, "supermercado", text, o)).setTint(i),
    a && .5 !== a || (s.x -= .5 * s.width, s.y -= .5 * s.height),
    1 === a ? (s.x -= s.width, s.y -= s.height) : "object" == typeof a && (.5 === a.x && (s.x -= .5 * s.width),
    .5 === a.y && (s.y -= .5 * s.height),
    1 === a.x && (s.x -= s.width),
    1 === a.y && (s.y -= s.height)),
    s
}


Helper.prototype.createBtn = function (e, t, r, n, o, i, a) {
  var s;
  return (s = e.add.sprite(t, r, n)).data = a || {}, s.setInteractive(), s.on("pointerup", function (t) {
    e.helper.playClickSfx(e), o.call(e)
  }), i && i.over && (s.on("pointerover", function (e) {
    this.setFrame(i.over)
  }), s.on("pointerout", function (e) {
    this.setFrame(0)
  })), i && i.down && s.on("pointerdown", function (e) {
    this.setFrame(i.down)
  }), s
}

// ctx x y img callback label_config frames data
// Helper.prototype.createBtnWithLabel = function (e, t, r, n, o, i, a, s) {
//   var c, u;
//   return (i = i || {
//     string: "[n/a]",
//     size: 64,
//     color: "0xFFFFFF",
//     x: 0,
//     y: 0
//   }).x || (i.x = 0), i.y || (i.y = 0), 
//   c = e.add.sprite(t, r, n), 
//   u = this.createText(e, t + i.x, r + i.y, i.string, i.size, i.color), c.data = s || {}, c.data.label_obj = u, 
//   c.setInteractive(),

//   c.on("pointerup", function (t) {
//     e.helper.playClickSfx(e)
//     o.call(e)
//   })
  
//   a && a.over && (c.on("pointerover", function (e) {
//     this.setFrame(a.over)
//   }), c.on("pointerout", function (e) {
//     this.setFrame(0)
//   })), a && a.down && c.on("pointerdown", function (e) {
//     this.setFrame(a.down)
//   })
//   c
// }

Helper.prototype.createBtnWithLabel = function(ctx, x, y, img, callback, label_config, frames, data) {
	var btn;
	var text;
	var label_config = label_config || { string: '[n/a]', size: 64, color: '0xFFFFFF', x: 0, y: 0 };
	
	// Label position
	if(!label_config.x) {
		label_config.x = 0;
	}
  
  if(!label_config.y) {
		label_config.y = 0;
	}
	
	// Create...
	// ...sprite
	btn = ctx.add.sprite(x, y, img);
	// ...label
	text = this.createText(ctx, x + label_config.x, y + label_config.y, label_config.string, label_config.size, label_config.color);
	// ...data
	btn.data = data || {};
	btn.data.label_obj = text;
	
	// Inputs...
	// ...activate
	btn.setInteractive();
	// ...callback
	btn.on('pointerup', function(e) {
		ctx.helper.playClickSfx(ctx);
		callback.call(ctx);
	});
	
	// Frames...
	// ...hover
	if(frames && frames.over) {
		btn.on('pointerover', function(e) {
			this.setFrame(frames.over);
		});
		
		btn.on('pointerout', function(e) {
			this.setFrame(0);
		});
	}
	// ...click
	if(frames && frames.down) {
		btn.on('pointerdown', function(e) {
			this.setFrame(frames.down);
		});
	}
	
	// Return group
	return btn;
};

Helper.prototype.getAllCardFrames = function (e) {
  "use strict";
  for (var t = [], r = e.sys.game._BASECARDS_NUM, n = 0; n < r; n++) t.push(n);
  return e.storage.data.collection.forEach(function (r) {
    t.push(r + e.sys.game._BASECARDS_NUM)
  }, this), t
}

Helper.prototype.playSfx = function (e, t) {
  "use strict";
  e.sys.game.SOUND_ON && e.sound.play(t)
}

Helper.prototype.playClickSfx = function (e) {
  "use strict";
  this.playSfx(e, "btn_click")
}

Helper.prototype.goFullscreen = function () {
  "use strict";
  if (!this.checkDesktop() && !this.checkFsStatus()) {
    var e = document.getElementsByTagName("canvas")[0],
      t = e.requestFullscreen || e.msRequestFullscreen || e.mozRequestFullScreen || e.webkitRequestFullscreen;
    t && t.call(e)
  }
}

Helper.prototype.checkFsStatus = function () {
  "use strict";
  return !!document.fullscreenElement || (!!document.webkitFullscreenElement || !!document.mozFullScreenElement)
}

Helper.prototype.checkDesktop = function () {
  "use strict";
  return !(0 == window.screenX || "ontouchstart" in window || "onmsgesturechange" in window)
}

Helper.prototype.getDeviceName = function () {
  "use strict";
  var e = "n/a";

  function t(e) {
    return -1 != navigator.userAgent.indexOf(e)
  }
  return t("Android") ? e = "Android" : t("iPhone") && !window.MSStream ? e = "iPhone" : t("iPad") && !window.MSStream ? e = "iPad" : t("Opera Mini") ? e = "Opera Mini" : t("IEMobile") ? e = "IEMobile" : t("Mobile Safari") ? e = "Mobile Safari" : t("Mac OS") || t("Macintosh") ? e = "Mac OS" : t("Windows") && (e = "Windows"), e
}

Helper.prototype.randomIntBetween = function (e, t) {
  "use strict";
  if (!(void 0 === e || void 0 === t || e < 0 || t < 0)) {
    if (0 === e) {
      e = Math.round(e + 1), t = Math.round(t + 1);
      return Math.floor(Math.random() * t) + e - 1
    }
    e = Math.round(e), t = Math.round(t);
    return Math.floor(Math.random() * (t - e + 1) + e)
  }
}

Helper.prototype.shuffleArray = function (e) {
  "use strict";
  for (var t, r, n = e.length; 0 !== n;) t = Math.floor(Math.random() * n), r = e[n -= 1], e[n] = e[t], e[t] = r;
  return e
}

export default Helper