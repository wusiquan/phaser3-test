var PlayScene = new Phaser.Scene("Play");
PlayScene.init = function() {
    "use strict";
    this._CONFIG = this.sys.game._CONFIG,
    this.storage = new Storage,
    this.helper = new Helper,
    this.transition = new Transition,
    this.ajax = new Ajax,
    this._MARGIN = 35,
    this._COLS = this.sys.game._COLS,
    this._ROWS = this.sys.game._ROWS,
    this._DECK = this.sys.game._DECK,
    this._SIZE = 0,
    this._DIFFICULTY = "",
    this._XP = 0,
    this._TOTALPAIRS = this._COLS * this._ROWS * .5,
    this.pairs_found = 0,
    this.guesses_left = this.calcTotalGuesses(),
    this.outro_count = 0,
    this.allow_play = !1,
    this.cards_open = [],
    this.card_data = [],
    this.cleaning_scene = !1,
    this.sys.game._COLS = void 0,
    this.sys.game._ROWS = void 0,
    this.sys.game._DECK = void 0,
    this.checked_cards = []
}
,
PlayScene.calcTotalGuesses = function() {
    "use strict";
    var t = 10;
    switch (this._COLS) {
    case 4:
        t = 25,
        this._DIFFICULTY = "Easy",
        this._XP = 50;
        break;
    case 5:
        t = 35,
        this._DIFFICULTY = "Medium",
        this._XP = 70;
        break;
    case 6:
        t = 45,
        this._DIFFICULTY = "Hard",
        this._XP = 90
    }
    return this.storage.data.level + 1 === this.storage.data.level_max ? this._XP = Math.min(this._XP, this.storage.data.xp_max - this.storage.data.xp) : this.storage.data.level >= this.storage.data.level_max ? this._XP = 0 : 1 === this.storage.data.level && 0 === this.storage.data.xp && (this._XP = 100),
    t
}
,
PlayScene.create = function() {
    "use strict";
    this.bg = this.add.image(0, 0, "bg-main").setOrigin(0),
    this.createUi(),
    this.createCards(),
    this.createProfileOverlay(),
    this.createMenuOverlay(),
    this.createWinnerScreen(),
    this.createLoserScreen(),
    this.startScene()
}
,
PlayScene.createUi = function() {
    "use strict";
    var t, e, i, s, n, a = "0xE5E5E5", h = this._MARGIN + 15, r = this._MARGIN + 5;
    this.ui = {
        width: this._CONFIG.width - 2 * this._MARGIN,
        height: 100,
        elements: {}
    },
    this.ui.elements = {},
    t = this.add.image(this._MARGIN, this._MARGIN, "bg-uitopbar").setOrigin(0),
    e = this.helper.createText(this, h, r, "Pairs Found: " + this.pairs_found, 44, a, {
        x: 0,
        y: 0
    }),
    i = this.helper.createText(this, h, r + 44, "Guesses Left: " + this.guesses_left, 44, a, {
        x: 0,
        y: 0
    }),
    n = {
        string: "Menu",
        size: 64,
        color: "0xFFFFFF",
        x: 0,
        y: -15
    },
    (s = this.helper.createBtnWithLabel(this, this._CONFIG.width - 110, this._MARGIN + .5 * this.ui.height, "btn-small", this.showMenu, n, {
        over: 1,
        down: 2
    })).displayWidth *= .65,
    s.displayHeight *= .75,
    this.ui.elements.bg = t,
    this.ui.elements.txt_pairs = e,
    this.ui.elements.txt_guesses = i,
    this.ui.elements.btn_menu = s
}
,
PlayScene.createCards = function() {
    "use strict";
    var t, e, i, s;
    this.cards = [],
    this.decks = [],
    this.positions = [];
    var n = this._MARGIN + 10 * (6 - this._COLS) + 5
      , a = this._MARGIN + this.ui.height + 10
      , h = this._CONFIG.width - 2 * n
      , r = (this._CONFIG.height - a - this._MARGIN - 15 * (this._ROWS - 1)) / this._ROWS
      , l = r + (h - this._COLS * r) / (this._COLS - 1)
      , c = r + 15;
    n += .5 * r,
    a += .5 * r;
    for (var o = 0; o < this._COLS; o++) {
        this.cards.push([]),
        this.decks.push([]),
        this.positions.push([]);
        for (var u = 0; u < this._ROWS; u++)
            i = n + o * l,
            s = a + u * c,
            (t = this.add.sprite(i, s, "spr-cards")).displayWidth = 0,
            t.displayHeight = r,
            t.visible = !1,
            this.cards[o].push(t),
            (e = this.add.sprite(this._CONFIG.width + r + 15, this._CONFIG.height + r + 15, "spr-decks")).displayWidth = r,
            e.displayHeight = r,
            e.visible = !0,
            e.setFrame(this._DECK),
            this.decks[o].push(e),
            this.positions[o].push({
                col: o,
                row: u,
                x: i,
                y: s
            })
    }
    this._SIZE = r
}
,
PlayScene.getCardRotation = function() {
    "use strict";
    return this.helper.randomIntBetween(0, 10) / 100 * (1 === Math.round(Math.random()) ? 1 : -1)
}
,
PlayScene.createMenuOverlay = function() {
    "use strict";
    var t, e, i, s, n, a;
    (t = this.add.graphics({
        x: this._MARGIN,
        y: this._MARGIN
    })).fillStyle(3355443, .8),
    t.fillRect(0, 0, this._CONFIG.width - 2 * this._MARGIN, this._CONFIG.height - 2 * this._MARGIN),
    e = this.helper.createText(this, this._CONFIG.centerX, 80, "Menu Screen", 84),
    a = {
        string: "Exit",
        size: 64,
        color: "0xFFFFFF",
        x: 0,
        y: -15
    },
    i = this.helper.createBtnWithLabel(this, this._CONFIG.centerX, .35 * this._CONFIG.height, "btn-small", this.clickExit, a, {
        over: 1,
        down: 2
    }),
    (a = {
        string: "[audio]",
        size: 54,
        color: "0xFFFFFF",
        x: 0,
        y: -10
    }).string = this.sys.game.SOUND_ON ? "Audio ON" : "Audio OFF",
    (s = this.helper.createBtnWithLabel(this, this._CONFIG.centerX, .5 * this._CONFIG.height, "btn-small", this.clickAudio, a, {
        over: 1,
        down: 2
    })).data.width = s.data.label_obj.width,
    a = {
        string: "Continue",
        size: 64,
        color: "0xFFFFFF",
        x: 0,
        y: -15
    },
    n = this.helper.createBtnWithLabel(this, this._CONFIG.centerX, .65 * this._CONFIG.height, "btn-small", this.closeMenu, a, {
        over: 1,
        down: 2
    }),
    t.visible = !1,
    e.visible = !1,
    i.visible = !1,
    i.data.label_obj.visible = !1,
    s.visible = !1,
    s.data.label_obj.visible = !1,
    n.visible = !1,
    n.data.label_obj.visible = !1,
    this.ui.elements.bg_overlay = t,
    this.ui.elements.title_overlay = e,
    this.ui.elements.btn_exit = i,
    this.ui.elements.btn_audio = s,
    this.ui.elements.btn_continue = n
}
,
PlayScene.createProfileOverlay = function() {
    "use strict";
    var t, e, i, s, n, a, h, r, l = 470;
    this.ui.profile = {},
    t = this.add.sprite(this._CONFIG.centerX - 21, 468, "bg-profileglow"),
    e = this.helper.createText(this, this._CONFIG.centerX, 200, "Adding XP...", 84),
    i = this.helper.createText(this, 340, 410, "Profile"),
    s = this.add.sprite(227, l, "bg-xpbar").setOrigin(0),
    n = this.add.sprite(s.x + 4, s.y + 4, "xpbar").setOrigin(0),
    a = this.add.sprite(150, l, "bg-level").setFrame(0),
    h = this.helper.createText(this, a.x, a.y - 70, "Level", 30, "0x333333"),
    r = this.helper.createText(this, a.x, a.y - 25, this.storage.data.level.toString(), 120, "0x333333"),
    t.visible = !1,
    e.visible = !1,
    e.visible = !1,
    i.visible = !1,
    s.visible = !1,
    n.visible = !1,
    a.visible = !1,
    h.visible = !1,
    r.visible = !1,
    this.ui.profile.bg_glow = t,
    this.ui.profile.title = e,
    this.ui.profile.txt_profile = i,
    this.ui.profile.bg_level = a,
    this.ui.profile.txt_label = h,
    this.ui.profile.txt_level = r,
    this.ui.profile.bg_xpbar = s,
    this.ui.profile.xpbar = n
}
,
PlayScene.createWinnerScreen = function() {
    "use strict";
    var t, e, i, s, n, a, h, r, l, c = this.calcTotalGuesses() - this.guesses_left;
    this.ui.winner_screen = {},
    (t = this.add.graphics({
        x: this._MARGIN,
        y: this._MARGIN
    })).fillStyle(3355443, .8),
    t.fillRect(0, 0, this._CONFIG.width - 2 * this._MARGIN, this._CONFIG.height - 2 * this._MARGIN),
    e = this.helper.createText(this, this._CONFIG.centerX, 150, "Game Won", 94),
    i = this.helper.createText(this, this._CONFIG.centerX, 240, "You found all pairs!", 54),
    s = this.helper.createText(this, this._CONFIG.centerX, 400, "Difficulty: " + this._DIFFICULTY, 64),
    a = this.helper.createText(this, this._CONFIG.centerX, 500, "XP Gained: " + this._XP, 64),
    n = this.helper.createText(this, this._CONFIG.centerX, 600, "Total Guesses: " + c, 64),
    h = this.helper.createText(this, this._CONFIG.centerX, 700, "New Record!", 64),
    l = {
        string: "Continue",
        size: 64,
        color: "0xFFFFFF",
        x: 0,
        y: -15
    },
    r = this.helper.createBtnWithLabel(this, this._CONFIG.centerX, this._CONFIG.height - 100, "btn-small", this.clickExit, l, {
        over: 1,
        down: 2
    }),
    t.visible = !1,
    e.visible = !1,
    i.visible = !1,
    s.visible = !1,
    n.visible = !1,
    a.visible = !1,
    h.visible = !1,
    r.visible = !1,
    r.data.label_obj.visible = !1,
    this.ui.winner_screen.bg = t,
    this.ui.winner_screen.title = e,
    this.ui.winner_screen.txt_main = i,
    this.ui.winner_screen.txt_difficulty = s,
    this.ui.winner_screen.txt_guesses = n,
    this.ui.winner_screen.txt_xp = a,
    this.ui.winner_screen.txt_record = h,
    this.ui.winner_screen.btn_continue = r
}
,
PlayScene.createLoserScreen = function() {
    "use strict";
    var t, e, i, s, n, a, h, r, l;
    this.ui.loser_screen = {},
    (t = this.add.graphics({
        x: this._MARGIN,
        y: this._MARGIN
    })).fillStyle(3355443, .8),
    t.fillRect(0, 0, this._CONFIG.width - 2 * this._MARGIN, this._CONFIG.height - 2 * this._MARGIN),
    e = this.helper.createText(this, this._CONFIG.centerX, 150, "Game Lost", 94),
    i = this.helper.createText(this, this._CONFIG.centerX, 240, "No more guesses left!", 54),
    s = this.helper.createText(this, this._CONFIG.centerX, 380, "Difficulty: " + this._DIFFICULTY, 64),
    a = this.helper.createText(this, this._CONFIG.centerX, 480, "XP Gained: 0", 64),
    n = this.helper.createText(this, this._CONFIG.centerX, 580, "Pairs Found: " + this.pairs_found, 64),
    l = {
        string: "Try Again",
        size: 64,
        color: "0xFFFFFF",
        x: 0,
        y: -10
    },
    h = this.helper.createBtnWithLabel(this, this._CONFIG.centerX, this._CONFIG.height - 235, "btn-small", this.clickPlayAgain, l, {
        over: 1,
        down: 2
    }),
    l = {
        string: "Exit",
        size: 64,
        color: "0xFFFFFF",
        x: 0,
        y: -15
    },
    r = this.helper.createBtnWithLabel(this, this._CONFIG.centerX, this._CONFIG.height - 100, "btn-small", this.clickExit, l, {
        over: 1,
        down: 2
    }),
    t.visible = !1,
    e.visible = !1,
    i.visible = !1,
    s.visible = !1,
    n.visible = !1,
    a.visible = !1,
    h.visible = !1,
    h.data.label_obj.visible = !1,
    r.visible = !1,
    r.data.label_obj.visible = !1,
    this.ui.loser_screen.bg = t,
    this.ui.loser_screen.title = e,
    this.ui.loser_screen.txt_main = i,
    this.ui.loser_screen.txt_difficulty = s,
    this.ui.loser_screen.txt_xp = a,
    this.ui.loser_screen.txt_pairs = n,
    this.ui.loser_screen.btn_playagain = h,
    this.ui.loser_screen.btn_continue = r
}
,
PlayScene.startScene = function() {
    "use strict";
    this.setCardData(),
    this.startTransitionIn()
}
,
PlayScene.setCardData = function() {
    "use strict";
    var t = 0
      , e = this.helper.getAllCardFrames(this)
      , i = [];
    for (this.card_data = [],
    this.storage.data.cards_new.forEach(function(t) {
        t += this.sys.game._BASECARDS_NUM,
        i.push(t),
        e.splice(e.indexOf(t), 1)
    }, this),
    e = this.helper.shuffleArray(e); i.length < this._TOTALPAIRS; )
        i.push(e[t]),
        t++;
    i = i.concat(i),
    i = this.helper.shuffleArray(i),
    t = 0;
    for (var s = 0; s < this.cards.length; s++) {
        this.card_data[s] = [];
        for (var n = 0; n < this.cards[s].length; n++)
            this.card_data[s][n] = i[t],
            this.decks[s][n] = this.setupCard(this.decks[s][n], this._DECK, s, n, "show_card"),
            this.cards[s][n] = this.setupCard(this.cards[s][n], i[t], s, n),
            t++
    }
}
,
PlayScene.setupCard = function(t, e, i, s, n) {
    "use strict";
    var a = this;
    return t.setFrame(e),
    t.data = {
        col: i,
        row: s
    },
    "show_card" === n && (t.setInteractive(),
    t.on("pointerdown", function(t) {
        a.allow_play && (a.helper.playSfx(a, "tap_card"),
        a.turnDeck(i, s))
    })),
    t
}
,
PlayScene.turnDeck = function(t, e) {
    "use strict";
    this.allow_play = !1,
    this.add.tween(this.getTurnTweenConfig(this.decks[t][e], 0, function() {
        this.turnDeckCallback.call(this, t, e)
    }))
}
,
PlayScene.turnDeckCallback = function(t, e) {
    "use strict";
    this.cards[t][e].visible = !0,
    this.decks[t][e].visible = !1,
    this.add.tween(this.getTurnTweenConfig(this.cards[t][e], this._SIZE, function() {
        this.turnDeckDone.call(this, t, e)
    }))
}
,
PlayScene.turnDeckDone = function(t, e) {
    "use strict";
    this.cards_open.push({
        frame: this.card_data[t][e],
        col: t,
        row: e
    }),
    this.cards_open.length < 2 ? this.allow_play = !0 : this.checkOpenPair()
}
,
PlayScene.getTurnTweenConfig = function(t, e, i) {
    "use strict";
    return {
        targets: t,
        displayWidth: e,
        duration: 100,
        ease: "Linear",
        onComplete: i,
        callbackScope: this
    }
}
,
PlayScene.checkOpenPair = function() {
    "use strict";
    this.checkFirstMatchEver(),
    this.cards_open[0].frame === this.cards_open[1].frame ? this.handleCorrectPair() : this.handleWrongPair()
}
,
PlayScene.checkFirstMatchEver = function() {
    "use strict";
    -1 == this.checked_cards.indexOf(this.cards_open[0].frame) && -1 == this.checked_cards.indexOf(this.cards_open[1].frame) && this.cards_open[0].frame === this.cards_open[1].frame && (this.guesses_left += 3,
    this.ui.elements.txt_guesses.text = "Guesses Left: " + this.guesses_left,
    this.playFirstMatchEverAnim()),
    this.checked_cards.push(this.cards_open[0].frame),
    this.checked_cards.push(this.cards_open[1].frame)
}
,
PlayScene.playFirstMatchEverAnim = function() {
    "use strict";
    var t = this.helper.createText(this, this._CONFIG.centerX, this._CONFIG.centerY, "+3 Bonus Guesses", 84, "0x66FF33");
    this.add.tween({
        targets: t,
        y: 100,
        duration: 2e3,
        ease: "Linear",
        callbackScope: this,
        onComplete: function() {
            t.destroy()
        }
    }),
    this.add.tween({
        targets: t,
        alpha: .1,
        duration: 2e3,
        ease: "Power2"
    })
}
,
PlayScene.handleCorrectPair = function() {
    "use strict";
    this.pairs_found++,
    this.ui.elements.txt_pairs.text = "Pairs Found: " + this.pairs_found,
    this.playCorrectPairAnim(),
    this.checkGameWon() ? this.startWinnerOutro() : this.allow_play = !0,
    this.cards_open = []
}
,
PlayScene.playCorrectPairAnim = function() {
    "use strict";
    var t = "0xFFFFFF"
      , e = this.cards_open[0]
      , i = this.cards[e.col][e.row].x + .4 * this._SIZE
      , s = this.cards[e.col][e.row].y - .4 * this._SIZE
      , n = this.cards_open[1]
      , a = this.cards[n.col][n.row].x + .4 * this._SIZE
      , h = this.cards[n.col][n.row].y - .4 * this._SIZE;
    function r(t) {
        var e = ["Yeah!", "Yay!", "Nice!", "Cool!", "Sweet!", "Easy!"];
        return e[t.randomIntBetween(0, e.length - 1)]
    }
    this.helper.playSfx(this, "pair_correct");
    var l = this.helper.createText(this, i, s, r(this.helper), 64, t).setRotation(this.getCardRotation())
      , c = this.helper.createText(this, a, h, r(this.helper), 64, t).setRotation(this.getCardRotation())
      , o = 0;
    this.add.tween({
        targets: [l, c],
        delay: 500,
        ease: "Linear",
        duration: 500,
        alpha: 0,
        onComplete: function() {
            ++o >= 2 && (l.destroy(),
            c.destroy(),
            l = void 0,
            c = void 0)
        },
        callbackScope: this
    })
}
,
PlayScene.checkGameWon = function() {
    "use strict";
    return this.pairs_found >= this._TOTALPAIRS
}
,
PlayScene.startWinnerOutro = function() {
    "use strict";
    function t(t) {
        var e = [{
            x: 1,
            y: 1
        }, {
            x: 1,
            y: -1
        }, {
            x: -1,
            y: -1
        }, {
            x: -1,
            y: 1
        }]
          , i = this.helper.randomIntBetween(0, 3)
          , s = (this._CONFIG.width + 200) * e[i].x
          , n = (this._CONFIG.height + 200) * e[i].y
          , a = this.helper.randomIntBetween(4, 6)
          , h = 20 * this.getCardRotation();
        return {
            targets: t,
            delay: 1e3,
            duration: 1500 + this.helper.randomIntBetween(0, 300),
            ease: "Linear",
            props: {
                x: {
                    value: "+=" + s
                },
                y: {
                    value: "+=" + n
                },
                scaleX: {
                    value: a
                },
                scaleY: {
                    value: a
                },
                rotation: {
                    value: "+=" + h
                }
            },
            onComplete: this.startXpAnim,
            callbackScope: this
        }
    }
    for (var e = 0; e < this._COLS; e++)
        for (var i = 0; i < this._ROWS; i++)
            this.add.tween(t.call(this, this.cards[e][i])),
            this.add.tween(t.call(this, this.decks[e][i]));
    this.add.tween({
        targets: [this.ui.elements.bg, this.ui.elements.txt_pairs, this.ui.elements.txt_guesses, this.ui.elements.btn_menu, this.ui.elements.btn_menu.data.label_obj],
        delay: 1e3,
        duration: 500,
        ease: "Linear",
        alpha: 0
    })
}
,
PlayScene.startXpAnim = function() {
    "use strict";
    if (this.outro_count++,
    !(this.outro_count < 4 * this._TOTALPAIRS))
        if (this.storage.data.level >= this.storage.data.level_max)
            this.showWinnerScreen();
        else {
            var t, e, i, s, n = 60, a = !1, h = [{
                x: 1,
                y: 1
            }, {
                x: 1,
                y: -1
            }, {
                x: -1,
                y: -1
            }, {
                x: -1,
                y: 1
            }], r = (this.helper.randomIntBetween(0, 3),
            [this.ui.profile.bg_glow, this.ui.profile.title, this.ui.profile.txt_profile, this.ui.profile.bg_level, this.ui.profile.txt_label, this.ui.profile.txt_level, this.ui.profile.bg_xpbar, this.ui.profile.xpbar]), l = [];
            r.forEach(function(t) {
                l.push({
                    x: t.x,
                    y: t.y
                })
            }, this),
            r.forEach(function(t) {
                t.visible = !0
            }, this),
            this.add.tween({
                targets: r,
                duration: 500,
                ease: "Linear",
                alpha: 1,
                onComplete: function t() {
                    this.helper.playSfx(this, "get_xp");
                    for (var e = 0; e < r.length; e++)
                        r[e].x = l[e].x + this.helper.randomIntBetween(1, 3) * h[this.helper.randomIntBetween(0, 3)].x,
                        r[e].y = l[e].y + this.helper.randomIntBetween(1, 3) * h[this.helper.randomIntBetween(0, 3)].y;
                    if (a)
                        for (e = 0; e < r.length; e++)
                            r[e].data && r[e].data.is_max ? (r[e].setText("Max"),
                            r[e].setScale(.9),
                            r[e].x = l[e].x - 60,
                            r[e].y = l[e].y + 5) : (r[e].x = l[e].x,
                            r[e].y = l[e].y);
                    else
                        this.time.delayedCall(1e3 / n, t, [], this)
                },
                callbackScope: this
            }),
            t = Math.min(this.storage.data.xp / this.storage.data.xp_max, 1),
            this.ui.profile.xpbar.displayWidth = Math.round(this.ui.profile.xpbar.width * t),
            (e = this.storage.data.xp + this._XP) >= this.storage.data.xp_max ? (i = this.ui.profile.xpbar.width,
            s = this._XP - (this.storage.data.xp_max - this.storage.data.xp)) : (t = Math.min(e / this.storage.data.xp_max, 1),
            i = Math.round(this.ui.profile.xpbar.width * t),
            s = 0),
            this.add.tween({
                targets: this.ui.profile.xpbar,
                delay: 500,
                displayWidth: i,
                ease: "Linear",
                duration: Math.round(5e3 * Math.min((i - this.ui.profile.xpbar.displayWidth) / this.ui.profile.xpbar.width, 1)),
                onComplete: function n() {
                    s > 0 ? (this.ui.profile.txt_level.setText((this.storage.data.level + 1).toString()),
                    this.ui.profile.xpbar.displayWidth = 0,
                    e = s,
                    s = 0,
                    t = Math.min(e / this.storage.data.xp_max, 1),
                    i = Math.round(this.ui.profile.xpbar.width * t),
                    this.add.tween({
                        targets: this.ui.profile.xpbar,
                        displayWidth: i,
                        ease: "Linear",
                        duration: Math.round(5e3 * Math.min(i / this.ui.profile.xpbar.width, 1)),
                        onComplete: n,
                        callbackScope: this
                    })) : (a = !0,
                    e === this.storage.data.xp_max && (this.storage.data.level + 1 === this.storage.data.level_max ? (this.ui.profile.xpbar.displayWidth = this.ui.profile.xpbar.width,
                    this.ui.profile.bg_level.setFrame(1),
                    this.ui.profile.txt_level.data = {
                        is_max: !0
                    }) : (this.ui.profile.txt_level.setText((this.storage.data.level + 1).toString()),
                    this.ui.profile.xpbar.displayWidth = 0)),
                    this.time.delayedCall(1e3, c, [], this))
                },
                callbackScope: this
            })
        }
    function c() {
        r.forEach(function(t) {
            t.visible = !1
        }, this),
        this.showWinnerScreen()
    }
}
,
PlayScene.showWinnerScreen = function() {
    "use strict";
    var t = this.calcTotalGuesses() - this.guesses_left
      , e = this.ui.winner_screen.txt_xp.y + .5 * this.ui.winner_screen.txt_xp.height
      , i = this.ui.winner_screen.txt_guesses.y + .5 * this.ui.winner_screen.txt_guesses.height;
    this.helper.playSfx(this, "game_won"),
    this.storage.addXp(this._XP),
    this.storage.gamePlayed(),
    this.storage.gameWon(),
    this.ui.winner_screen.bg.visible = !0,
    this.ui.winner_screen.title.visible = !0,
    this.ui.winner_screen.txt_main.visible = !0,
    this.ui.winner_screen.txt_difficulty.visible = !0,
    this.ui.winner_screen.txt_xp.destroy(),
    this.ui.winner_screen.txt_xp = this.helper.createText(this, this._CONFIG.centerX, e, "XP Gained: " + this._XP, 64),
    this.ui.winner_screen.txt_guesses.destroy(),
    this.ui.winner_screen.txt_guesses = this.helper.createText(this, this._CONFIG.centerX, i, "Wrong Guesses: " + t, 64),
    this.ui.winner_screen.btn_continue.visible = !0,
    this.ui.winner_screen.btn_continue.data.label_obj.visible = !0,
    this._XP < 100 ? this.storage.checkNewRecord(this._DIFFICULTY, t) && this.triggerNewRecordAnim() : 100 === this._XP && (this.storage.checkNewRecord(this._DIFFICULTY, t),
    this.triggerBonusXpAnim()),
    this.ajax.addGameWon(this, this.storage.data.level, this.helper.getDeviceName())
}
,
PlayScene.triggerNewRecordAnim = function() {
    "use strict";
    this.ui.winner_screen.txt_record.visible = !0,
    this.blinkText(this.ui.winner_screen.txt_guesses),
    this.blinkText(this.ui.winner_screen.txt_record)
}
,
PlayScene.triggerBonusXpAnim = function() {
    "use strict";
    this.ui.winner_screen.txt_record.destroy(),
    this.ui.winner_screen.txt_record = this.helper.createText(this, this._CONFIG.centerX, 700, "1st Win Bonus XP!", 64),
    this.blinkText(this.ui.winner_screen.txt_xp, "0x4CFF00"),
    this.blinkText(this.ui.winner_screen.txt_record, "0x4CFF00")
}
,
PlayScene.blinkText = function(t, e) {
    "use strict";
    var i, s = !1, n = t.tint;
    e = e || "0xFFD800";
    (function a() {
        0,
        i = (s = !s) ? e : n,
        t.setTint(i),
        this.cleaning_scene ? t.setTint(n) : this.time.delayedCall(250, a, [], this)
    }
    ).call(this)
}
,
PlayScene.handleWrongPair = function() {
    "use strict";
    this.guesses_left--,
    this.ui.elements.txt_guesses.text = "Guesses Left: " + this.guesses_left,
    this.guesses_left <= 5 && this.ui.elements.txt_guesses.setTint(16738816),
    this.checkGameLost() ? this.startLoserOutro() : this.time.delayedCall(750, function() {
        this.turnCard(this.cards_open[0].col, this.cards_open[0].row),
        this.turnCard(this.cards_open[1].col, this.cards_open[1].row),
        this.cards_open = [],
        this.allow_play = !0
    }, [], this)
}
,
PlayScene.turnCard = function(t, e) {
    "use strict";
    this.helper.playSfx(this, "throw_card"),
    this.add.tween(this.getTurnTweenConfig(this.cards[t][e], 0, function() {
        this.turnCardCallback.call(this, t, e)
    }))
}
,
PlayScene.turnCardCallback = function(t, e) {
    "use strict";
    this.cards[t][e].visible = !1,
    this.decks[t][e].visible = !0,
    this.add.tween(this.getTurnTweenConfig(this.decks[t][e], this._SIZE, this.turnCardDone))
}
,
PlayScene.turnCardDone = function() {
    "use strict"
}
,
PlayScene.checkGameLost = function() {
    "use strict";
    return this.guesses_left <= 0
}
,
PlayScene.startLoserOutro = function() {
    "use strict";
    function t(t) {
        return {
            targets: t,
            delay: 500,
            duration: 1e3 + this.helper.randomIntBetween(0, 200),
            ease: "Linear",
            props: {
                y: {
                    value: "+=" + this._CONFIG.height
                },
                rotation: {
                    value: "+=" + 20 * this.getCardRotation()
                }
            },
            onComplete: this.showLoserScreen,
            callbackScope: this
        }
    }
    for (var e = 0; e < this._COLS; e++)
        for (var i = 0; i < this._ROWS; i++)
            this.add.tween(t.call(this, this.cards[e][i])),
            this.add.tween(t.call(this, this.decks[e][i]));
    this.add.tween({
        targets: [this.ui.elements.bg, this.ui.elements.txt_pairs, this.ui.elements.txt_guesses, this.ui.elements.btn_menu, this.ui.elements.btn_menu.data.label_obj],
        duration: 500,
        ease: "Linear",
        alpha: 0
    })
}
,
PlayScene.showLoserScreen = function() {
    "use strict";
    if (this.outro_count++,
    !(this.outro_count < 4 * this._TOTALPAIRS)) {
        var t = this.ui.loser_screen.txt_pairs.y + .5 * this.ui.loser_screen.txt_pairs.height;
        this.helper.playSfx(this, "game_lost"),
        this.storage.gamePlayed(),
        this.ui.loser_screen.bg.visible = !0,
        this.ui.loser_screen.title.visible = !0,
        this.ui.loser_screen.txt_main.visible = !0,
        this.ui.loser_screen.txt_difficulty.visible = !0,
        this.ui.loser_screen.txt_xp.visible = !0,
        this.ui.loser_screen.txt_pairs.destroy(),
        this.ui.loser_screen.txt_pairs = this.helper.createText(this, this._CONFIG.centerX, t, "Pairs Found: " + this.pairs_found, 64),
        this.ui.loser_screen.btn_playagain.visible = !0,
        this.ui.loser_screen.btn_playagain.data.label_obj.visible = !0,
        this.ui.loser_screen.btn_continue.visible = !0,
        this.ui.loser_screen.btn_continue.data.label_obj.visible = !0,
        this.ajax.addGameLost(this, this.storage.data.level, this.helper.getDeviceName())
    }
}
,
PlayScene.showMenu = function() {
    "use strict";
    this.time.delayedCall(250, function() {
        this.ui.elements.btn_menu.setFrame(0)
    }, [], this),
    this.time.delayedCall(250, function() {
        this.ui.elements.btn_continue.setFrame(0)
    }, [], this),
    this.allow_play && (this.allow_play = !1,
    this.toggleMenu(!0))
}
,
PlayScene.closeMenu = function() {
    "use strict";
    this.time.delayedCall(250, function() {
        this.ui.elements.btn_menu.setFrame(0)
    }, [], this),
    this.time.delayedCall(250, function() {
        this.ui.elements.btn_continue.setFrame(0)
    }, [], this),
    this.allow_play || (this.allow_play = !0,
    this.toggleMenu(!1))
}
,
PlayScene.toggleMenu = function(t) {
    "use strict";
    this.ui.elements.bg.visible = !t,
    this.ui.elements.txt_pairs.visible = !t,
    this.ui.elements.txt_guesses.visible = !t,
    this.ui.elements.btn_menu.visible = !t,
    this.ui.elements.btn_menu.data.label_obj.visible = !t,
    this.ui.elements.bg_overlay.visible = t,
    this.ui.elements.title_overlay.visible = t,
    this.ui.elements.btn_audio.visible = t,
    this.ui.elements.btn_audio.data.label_obj.visible = t,
    this.ui.elements.btn_exit.visible = t,
    this.ui.elements.btn_exit.data.label_obj.visible = t,
    this.ui.elements.btn_continue.visible = t,
    this.ui.elements.btn_continue.data.label_obj.visible = t
}
,
PlayScene.clickAudio = function() {
    "use strict";
    this.allow_play = !1,
    this.sys.game.SOUND_ON = !this.sys.game.SOUND_ON;
    var t = this.ui.elements.btn_audio.data.width;
    this.sys.game.SOUND_ON ? (this.ui.elements.btn_audio.data.label_obj.text = "Audio ON",
    this.ui.elements.btn_audio.data.label_obj.x = this._CONFIG.centerX - .5 * t) : (this.ui.elements.btn_audio.data.label_obj.text = "Audio OFF",
    this.ui.elements.btn_audio.data.label_obj.x = this._CONFIG.centerX - .5 * t - 5),
    this.time.delayedCall(250, function() {
        this.ui.elements.btn_audio.setFrame(0)
    }, [], this)
}
,
PlayScene.clickExit = function() {
    "use strict";
    this.allow_play = !1,
    this.cleaning_scene = !0,
    this.startTransitionOut(this.goMenu)
}
,
PlayScene.clickPlayAgain = function() {
    "use strict";
    this.sys.game._COLS = this._COLS,
    this.sys.game._ROWS = this._ROWS,
    this.sys.game._DECK = this._DECK,
    this.startTransitionOut(this.goPlay)
}
,
PlayScene.startTransitionIn = function() {
    "use strict";
    this.transition.fadeInElements(this, this.getTransitionTargets(), function() {});
    var t = 0;
    function e(t, e, i, s, n) {
        return {
            targets: t.decks[i][s],
            delay: e,
            duration: 500,
            x: n.x,
            y: n.y,
            angle: -720,
            ease: "Linear",
            onStart: function() {
                t.time.delayedCall(e, t.helper.playSfx, [t, "tap_card"], t)
            },
            onComplete: function() {
                (function(t, e) {
                    var i = this._COLS * this._ROWS
                      , s = this.getCardRotation();
                    this.cards[t][e].setRotation(s),
                    this.decks[t][e].setRotation(s),
                    this.intro_count++,
                    this.intro_count >= i && (this.allow_play = !0)
                }
                ).call(t, i, s)
            },
            callbackScope: t
        }
    }
    this.intro_count = 0;
    for (var i = 0; i < this.decks.length; i++)
        for (var s = 0; s < this.decks[i].length; s++)
            t++,
            this.add.tween(e(this, 100 * t, i, s, this.positions[i][s]))
}
,
PlayScene.startTransitionOut = function(t) {
    "use strict";
    this.transition.fadeOutElements(this, this.getTransitionTargets(), t)
}
,
PlayScene.getTransitionTargets = function() {
    "use strict";
    return [this.ui.elements.bg, this.ui.elements.txt_pairs, this.ui.elements.txt_guesses, this.ui.elements.btn_menu, this.ui.elements.btn_menu.data.label_obj, this.ui.elements.bg_overlay, this.ui.elements.title_overlay, this.ui.elements.btn_exit, this.ui.elements.btn_exit.data.label_obj, this.ui.elements.btn_audio, this.ui.elements.btn_audio.data.label_obj, this.ui.elements.btn_continue, this.ui.elements.btn_continue.data.label_obj, this.ui.loser_screen.bg, this.ui.loser_screen.title, this.ui.loser_screen.txt_main, this.ui.loser_screen.txt_difficulty, this.ui.loser_screen.txt_xp, this.ui.loser_screen.txt_pairs, this.ui.loser_screen.btn_playagain, this.ui.loser_screen.btn_playagain.data.label_obj, this.ui.loser_screen.btn_continue, this.ui.loser_screen.btn_continue.data.label_obj, this.ui.winner_screen.bg, this.ui.winner_screen.title, this.ui.winner_screen.txt_main, this.ui.winner_screen.txt_difficulty, this.ui.winner_screen.txt_xp, this.ui.winner_screen.txt_guesses, this.ui.winner_screen.txt_record, this.ui.winner_screen.btn_continue, this.ui.winner_screen.btn_continue.data.label_obj]
}
,
PlayScene.goMenu = function() {
    "use strict";
    this.scene.start("Menu")
}
,
PlayScene.goPlay = function() {
    "use strict";
    this.scene.start("Redirect")
}
;
