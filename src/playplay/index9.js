import '../scss/index.scss'
import Phaser from 'phaser'

let gameOptions = {
  tileSize: 200,
  colors: {
    0: 0xFFFFFF,
    2: 0xFFFFFF,
    4: 0xFFEEEE,
    8: 0xFFDDDD,
    16: 0xFFCCCC,
    32: 0xFFBBBB,
    64: 0xFFAAAA,
    128: 0xFF9999,
    256: 0xFF8888,
    512: 0xFF7777,
    1024: 0xFF6666,
    // 2048: 0xFF5555,
    // 4096: 0xFF4444,
    // 8192: 0xFF3333,
    // 16384: 0xFF2222,
    // 32768: 0xFF1111,
    // 65536: 0xFF0000
  },
  tweenSpeed: 50
}

class PlayGame extends Phaser.Scene {
  constructor(o) {
    super(o)
  }

  preload() {
    this.load.image('tile', 'src/images/tile.png')
  }

  create() {
    this.fieldArray = []
    this.fieldGroup = this.add.group()

    let {
      tileSize
    } = gameOptions

    // 行
    for (let i = 0; i < 4; i++) {
      this.fieldArray[i] = []
      // 列
      for (let j = 0; j < 4; j++) {
        let two = this.add.sprite(j * tileSize + tileSize / 2, i * tileSize + tileSize / 2, 'tile')
        two.alpha = 0
        two.visible = false
        this.fieldGroup.add(two)

        let text = this.add.text(j * tileSize + tileSize / 2, i * tileSize + tileSize / 2, '2', {
          font: 'bold 64px Arial',
          align: 'center',
          color: 'black'
        })

        text.setOrigin(0.5)
        text.alpha = 0
        text.visible = false
        this.fieldGroup.add(text)
        this.fieldArray[i][j] = {
          tileValue: 0,
          tileSprite: two,
          tileText: text,
          canUpgrade: true
        }
      }
    }

    this.input.keyboard.on('keydown', this.handleKey, this)
    this.canMove = false
    this.addTwo()
    this.addTwo()
  }

  addTwo() {
    var emptyTiles = [];
    for (var i = 0; i < 4; i++) {
      for (var j = 0; j < 4; j++) {
        if (this.fieldArray[i][j].tileValue == 0) {
          emptyTiles.push({
            row: i,
            col: j
          })
        }
      }
    }
    var chosenTile = Phaser.Utils.Array.GetRandom(emptyTiles)
    let {
      row,
      col
    } = chosenTile
    this.fieldArray[row][col].tileValue = 2
    this.fieldArray[row][col].tileSprite.visible = true
    this.fieldArray[row][col].tileText.setText('2')
    this.fieldArray[row][col].tileText.visible = true

    this.tweens.add({
      targets: [this.fieldArray[row][col].tileSprite, this.fieldArray[row][col].tileText],
      alpha: 1,
      duration: gameOptions.tweenSpeed,
      onComplete: function (tween) {
        this.canMove = true
        // tween.parent.scene.canMove = true;
      },
      onCompleteScope: this
    })
  }

  handleKey(e) {
    let {
      game
    } = this.cache
    if (this.canMove) {
      let children = this.fieldGroup.getChildren()
      // 这里的循环在干嘛?
      switch (e.code) {
        case 'KeyA':
          // for (var i = 0; i < children.length; i++) {
          //   children[i].depth = children[i].x
          // }
          this.handleMove(0, -1)
          break

        case 'KeyD':
          // for (var i = 0; i < children.length; i++) {
          //   children[i].depth = game.config.width - children[i].x
          // }
          this.handleMove(0, 1)
          break
        
        case 'KeyW':
          // for (var i = 0; i < children.length; i++) {
          //   children[i].depth = children[i].y
          // }
          this.handleMove(-1, 0)
          break

        case 'KeyS':
          // for (var i = 0; i < children.length; i++) {
          //   children[i].depth = game.config.height - children[i].y
          // }
          this.handleMove(1, 0)
          break
      }
    }
  }

  // 
  handleMove(deltaRow, deltaCol) {
    this.canMove = false;
    var somethingMoved = false;
    this.movingTiles = 0;

    var {
      fieldArray
    } = this

    for (var i = 0; i < 4; i++) {
      for (var j = 0; j < 4; j++) {
        // 按正确的顺序遍历元素
        // 如向下移动，那么应该从row 3 -> row 1的顺序遍历
        // 如向右移动，那么应该从col 3 -> col 1的顺序遍历
        var colToWatch = deltaCol == 1 ? (4 - 1) - j : j
        var rowToWatch = deltaRow == 1 ? (4 - 1) - i : i
        var colToMerge
        var rowToMerge

        var tileValue = fieldArray[rowToWatch][colToWatch].tileValue

        // tileValue为0表示此tile实际已不存在
        if (tileValue != 0) {
          var colSteps = deltaCol
          var rowSteps = deltaRow

          
          while (this.isInsideBoard(rowToWatch + rowSteps, colToWatch + colSteps) && fieldArray[rowToWatch + rowSteps][colToWatch + colSteps].tileValue == 0) {
            colSteps += deltaCol
            rowSteps += deltaRow
          }

          colToMerge = colToWatch + colSteps
          rowToMerge = rowToWatch + rowSteps

          if (this.isInsideBoard(rowToMerge, colToMerge) &&
            (fieldArray[rowToMerge][colToMerge].tileValue == tileValue) && fieldArray[rowToMerge][colToMerge].canUpgrade && fieldArray[rowToWatch][colToWatch].canUpgrade) {
            fieldArray[rowToMerge][colToMerge].tileValue = tileValue * 2
            fieldArray[rowToMerge][colToMerge].canUpgrade = false
            fieldArray[rowToWatch][colToWatch].tileValue = 0
            this.moveTile(fieldArray[rowToWatch][colToWatch], rowToMerge, colToMerge, Math.abs(rowSteps + colSteps), true)
            somethingMoved = true
          } else {
            colSteps = colSteps - deltaCol
            rowSteps = rowSteps - deltaRow
            colToMerge = colToWatch + colSteps
            rowToMerge = rowToWatch + rowSteps

            if (colSteps != 0 || rowSteps != 0) {
              fieldArray[rowToMerge][colToMerge].tileValue = tileValue
              fieldArray[rowToWatch][colToWatch].tileValue = 0
              this.moveTile(fieldArray[rowToWatch][colToWatch], rowToMerge, colToMerge, Math.abs(rowSteps + colSteps), false)
              somethingMoved = true
            }
          }
        }
      }
    }
    if (!somethingMoved) {
      this.canMove = true;
    }
  }

  moveTile(tile, row, col, distance, changedNumber) {
    let {
      tileSize,
      tweenSpeed
    } = gameOptions

    this.movingTiles += 1

    this.tweens.add({
      targets: [tile.tileSprite, tile.tileText],
      x: col * tileSize + tileSize / 2,
      y: row * tileSize + tileSize / 2,
      duration: tweenSpeed * distance,
      onComplete: function () {
        this.movingTiles -= 1
        if (changedNumber) {
          this.transformTile(tile, row, col);
          return
        }
        if (this.movingTiles == 0) {
          this.resetTiles();
          this.addTwo();
        }
      },
      onCompleteScope: this
    })
  }

  transformTile(tile, row, col) {
    this.movingTiles++;
    tile.tileText.setText(this.fieldArray[row][col].tileValue.toString());
    tile.tileSprite.setTint(gameOptions.colors[this.fieldArray[row][col].tileValue]);
    this.tweens.add({
      targets: [tile.tileSprite],
      scaleX: 1.1,
      scaleY: 1.1,
      duration: gameOptions.tweenSpeed,
      yoyo: true,
      repeat: 1,
      onComplete: function (tween) {
        this.movingTiles--;
        if (this.movingTiles == 0) {
          this.resetTiles();
          this.addTwo();
        }
      },
      onCompleteScope: this
    })
  }

  resetTiles() {
      for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
          this.fieldArray[i][j].canUpgrade = true;
          this.fieldArray[i][j].tileSprite.x = j * gameOptions.tileSize + gameOptions.tileSize / 2;
          this.fieldArray[i][j].tileSprite.y = i * gameOptions.tileSize + gameOptions.tileSize / 2;
          this.fieldArray[i][j].tileText.x = j * gameOptions.tileSize + gameOptions.tileSize / 2;
          this.fieldArray[i][j].tileText.y = i * gameOptions.tileSize + gameOptions.tileSize / 2;
          if (this.fieldArray[i][j].tileValue > 0) {
            this.fieldArray[i][j].tileSprite.alpha = 1;
            this.fieldArray[i][j].tileSprite.visible = true;
            this.fieldArray[i][j].tileText.alpha = 1;
            this.fieldArray[i][j].tileText.visible = true;
            this.fieldArray[i][j].tileText.setText(this.fieldArray[i][j].tileValue.toString());
          } else {
            this.fieldArray[i][j].tileValue = 0;
            this.fieldArray[i][j].tileSprite.alpha = 0;
            this.fieldArray[i][j].tileSprite.visible = false;
            this.fieldArray[i][j].tileText.alpha = 0;
            this.fieldArray[i][j].tileText.visible = false;
          }
          this.fieldArray[i][j].tileSprite.setTint(gameOptions.colors[this.fieldArray[i][j].tileValue]);
        }
      }
    }

    isInsideBoard(row, col) {
      return row >= 0 && col >= 0 && row < 4 && col < 4
    }
}

let playGame = new PlayGame({
  key: 'PlayGame'
})

let gameConfig = {
  type: Phaser.AUTO,
  parent: 'phaser-example',
  width: gameOptions.tileSize * 4,
  height: gameOptions.tileSize * 4,
  backgroundColor: 0x444444,
  // physics: {
  //   default: 'arcade',
  //   arcade: {
  //     gravity: { y: 300 },
  //     debug: false
  //   }
  // },
  scene: [playGame]
}
new Phaser.Game(gameConfig)
