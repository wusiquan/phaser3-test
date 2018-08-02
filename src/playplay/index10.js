import '../scss/index.scss'
import Phaser from 'phaser'

let config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: 'example',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300 },
      debug: false
    }
  },
  scene: {
    preload,
    create,
    update
  }
}

let game = new Phaser.Game(config)

function preload() {
  this.load.image('sky', 'src/images/sky.png')
  // platform 400 x 32
  this.load.image('groud', 'src/images/platform.png')
  this.load.image('star', 'src/images/star.png')
  this.load.image('bomb', 'src/images/bomb.png')
  this.load.spritesheet('dude', 'src/images/dude.png', { frameWidth: 32, frameHeight: 48 })
}

let platforms
let player
let cursors
let stars
let score = 0
let scoreText
let bombs
let gameOver = false

function create() {
  this.add.image(400, 300, 'sky')
  // 如果dynamic的group, 能不能上来不动?
  platforms = this.physics.add.staticGroup()

  platforms.create(400, 568, 'groud').setScale(2).refreshBody()
  platforms.create(600, 400, 'groud')
  platforms.create(50, 250, 'groud')
  platforms.create(750, 220, 'groud')

  player = this.physics.add.sprite(100, 450, 'dude')
  player.setBounceY(0.2)
  player.setCollideWorldBounds(true)

  this.anims.create({
    key: 'left',
    frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
    frameRate: 10,
    repeat: -1
  })

  this.anims.create({
    key: 'turn',
    frames: [{ key: 'dude', frame: 4 }],
    frameRate: 20
  })

  this.anims.create({
    key: 'right',
    frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
    frameRate: 10,
    repeat: -1
  })

  cursors = this.input.keyboard.createCursorKeys()

  stars = this.physics.add.group({
    key: 'star',
    repeat: 11,
    setXY: {
      x: 12,
      y: 0,
      stepX: 70
    }
  })

  stars.children.iterate(function (child) {
    child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8))
  })

  bombs = this.physics.add.group();

  scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' })

  this.physics.add.collider(stars, platforms)
  this.physics.add.collider(player, platforms)
  this.physics.add.collider(bombs, platforms)

  this.physics.add.overlap(player, stars, collectStar, null, this)

  this.physics.add.collider(player, bombs, hitBomb, null, this);
}


function update() {
  if (gameOver) {
    return
  }

  if (cursors.left.isDown) {
    player.setVelocityX(-160);
    player.anims.play('left', true)
  } else if (cursors.right.isDown) {
    player.setVelocityX(160)
    player.anims.play('right', true)
  } else {
    player.setVelocityX(0)
    player.anims.play('turn')
  }

  if (cursors.up.isDown && player.body.touching.down) {
    player.setVelocityY(-330);
  }
}

function collectStar(player, star) {
  star.disableBody(true, true)

  score += 10
  scoreText.setText('Score: ' + score)

  if (stars.countActive(true) === 0) {
    stars.children.iterate(function (child) {
      child.enableBody(true, child.x, 0, true, true);
    })
  }

  var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
  var bomb = bombs.create(x, 16, 'bomb');
  bomb.setBounce(1);
  bomb.setCollideWorldBounds(true);
  bomb.setVelocity(Phaser.Math.Between(-70, 70), 20);
  bomb.allowGravity = false;
}

function hitBomb(player, bomb) {
  this.physics.pause();

  player.setTint(0xff0000);

  player.anims.play('turn');

  gameOver = true;
}
