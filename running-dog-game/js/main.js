//main.js
var game;
var gameConfig;
var score;
var lives;
var highScore = 0;
var coins;

window.onload = function() {
  gameConfig = {
    type: Phaser.AUTO,
    width: 800,
    height: 450,
    parent: "gameBoard",
    physics: {
      default: "arcade",
      arcade: {
        debug: false
      }
    },
    pixelArt: true,
    scene: [ BootGame, TitleScreen, Main, GameOver ],
    backgroundColor: 0x4488aa,
  }
  game = new Phaser.Game(gameConfig);
  window.focus;
}

let gameOptions = {
  platformSpeed: 350,
  spawnRange: [100, 250],
  platformSizeRange: [2, 10],
  playerGravity: 900,
  jumpForce: 400,
  playerStartPosition: 200,
  jumps: 1,
  backgroundScrollSpeed: 300,
}

 const randomTrueFalse = (weight) => {
   return ((Math.random() * 10) < weight);
 }

//Platform object class
class Platform extends Phaser.Physics.Arcade.Sprite {
  constructor(config) {
    super(config.scene, config.x, config.y, config.key);
    config.scene.add.existing(this);
    let hasSpawned = false;
    //update function
    config.scene.events.on('update', () => {
      if (this.x < gameConfig.width * 0.75) {
        if (!hasSpawned) {
          config.scene.buildPlatform(this.x + this.displayWidth + Phaser.Math.Between(gameOptions.spawnRange[0], gameOptions.spawnRange[1]));
          hasSpawned = true;
        }
        if (this.x < this.displayWidth * -1) {
          this.destroy();
        }
      }
    });
  }
}

class PlatformGroup extends Phaser.Physics.Arcade.Group {
  constructor(scene) {
    super(scene.physics.world, scene);
  }
}

class CoinGroup extends Phaser.Physics.Arcade.Group {
  constructor(scene) {
    super(scene.physics.world, scene);
  }
}

class SawGroup extends Phaser.Physics.Arcade.Group {
  constructor(scene) {
    super(scene.physics.world, scene);
  }
}

//Main gameplay scene
class Main extends Phaser.Scene {
  constructor() {
    super("Main");
  }
  
  preload() {
    
  }
  
  create() {
    //Parallax scrolling background.
    this.background1 = this.add.tileSprite(0, 0, 1280, 450, 'cloudPink');
    this.background1.setScale(2,2);
    this.background1.setOrigin(0,0)
    this.background2 = this.add.tileSprite(0, 0 + 23, gameConfig.width, gameConfig.height, 'city_01');
    this.background2.setScale(2,2);
    this.background2.setOrigin(0,0);
    this.background3 = this.add.tileSprite(0, 0 + 46, gameConfig.width, gameConfig.height, 'city_02');
    this.background3.setScale(2,2);
    this.background3.setOrigin(0,0);
    
    
    this.sawGroup = new SawGroup(this);
    this.flameGroup = new SawGroup(this);
    
    //number of consecutive jumps made by the player
    this.playerJumps = 0;
    lives = 2;
    
    //Gregory's run animation
    this.anims.create({
      key: 'running',
      frames: this.anims.generateFrameNumbers('gregoryRuns', {start: 0, end: 5}),
      frameRate: 10,
      repeat: -1
    });
    
    //Coin animation
    this.anims.create({
      key: 'coinShine',
      frames: this.anims.generateFrameNumbers('coin', {start: 0, end: 3}),
      frameRate: 12,
      repeat: -1
    });
    
    //Saw animation
    this.anims.create({
      key: 'sawSpin',
      frames: this.anims.generateFrameNumbers('saw', {start: 0, end: 7}),
      frameRate: 12,
      repeat: -1
    });
    
    //flame animation
    this.anims.create({
      key: 'flame',
      frames: [
        { key: 'flame1' },
        { key: 'flame2' },
        {key: 'flame3' }
      ],
      frameRate: 10,
      repeat: -1
    });
    
    this.anims.create({
      key: 'explosion',
      frames: [
        { key: 'expl1' },
        { key: 'expl2' },
        { key: 'expl3' },
        { key: 'expl4' },
        { key: 'expl5' },
        { key: 'expl6' },
        { key: 'expl7' },
        { key: 'expl8' },
        { key: 'expl9' },
        { key: 'expl10' },
        { key: 'expl11' },
      ],
      frameRate: 10,
      repeat: 0,
    });
    //explosion animation
    
    //adding the player
    this.player = this.physics.add.sprite(gameOptions.playerStartPosition, gameConfig.height / 2, "gregoryRuns", 1);
    this.player.setGravityY(gameOptions.playerGravity);
    this.player.setScale(2,2);
    this.player.setSize(8, 32);
    this.player.setOffset(10, 0);
    this.player.play('running');
    this.player.isInvincible = false;
    
    //Grouping the platform in a platforms group class
    this.platformGroup = new PlatformGroup(this);
    this.physics.add.collider(this.player, this.platformGroup);

    
    //adding the starting platform
    this.startingPlatform = this.physics.add.sprite(992, gameConfig.height * 0.8, 'startingPlatform');
    this.platformGroup.add(this.startingPlatform);
    this.startingPlatform.setOrigin(1,0);
    this.startingPlatform.setScale(2,2);
    this.startingPlatform.setImmovable(true);
    this.startingPlatform.setGravity(0, 0);
    this.startingPlatform.setVelocityX(-gameOptions.platformSpeed);
    
    //adding some coins to the starting platform
    this.coinGroup = new CoinGroup(this);
    this.physics.add.overlap(this.player, this.coinGroup, this.collectCoin, null, this);
    this.spawnCoins(
      Phaser.Math.Between(3, 15),
      this.startingPlatform.x - (this.startingPlatform.displayWidth / 2),
      this.startingPlatform.y - 32
    );
  
    // adding the second platform
    this.buildPlatform(this.startingPlatform.x + 200);

    //checking for input
    this.input.on("pointerdown", this.jump, this);
    
    //other colliders
    this.physics.add.collider(this.coinGroup, this.platformGroup);
    this.physics.add.collider(this.player, this.sawGroup, this.playerHit, null, this);
    this.physics.add.collider(this.platformGroup, this.flameGroup);
    this.physics.add.collider(this.player, this.flameGroup, this.playerHit, null, this);
    
    
    //hud, UI
    score = 0;
    coins = 0;
    this.scoreText = this.add.text(10, 8, 'Score ' + score, {
      fontFamily: 'doomed',
      fontSize: '16px',
      color: '#F9F9F9',
    });
    
    this.coinsText = this.add.text(680, 8, 'Coins ' + coins, {
      fontFamily: 'doomed',
      fontSize: '16px',
      color: '#F9F9F9',
    });
    
    //sounds
    this.coinSound = this.sound.add('coinsound');
    this.explosionSound = this.sound.add('explosionsound');
  }
  
  // the player jumps when on the ground
  jump() {
    if (this.player.body.touching.down) {
      this.player.setVelocity(0, gameOptions.jumpForce * -1);
    } else {
      this.player.setVelocity(0, gameOptions.jumpForce);
    }
    console.log(this.player);
  }
  
  //spawning coins. takes in the number of coins to spawn and the x and y coordinates
  spawnCoins(n, x, y) {
    for (let i = 0; i < n; i++) {
      let coin = this.physics.add.sprite(x + (i * 34), y - 64, 'coin', 1);
      this.coinGroup.add(coin);
      coin.setOrigin(0,1);
      coin.setScale(2,2)
      coin.setGravity(0, gameOptions.playerGravity);
      coin.setBounce(1,1);
        let offsetX = Phaser.Math.Between(-40, 40);
        let offsetY = Phaser.Math.Between(-40, 40);
      coin.setVelocity(-gameOptions.platformSpeed + offsetX, offsetY);
      coin.play('coinShine');
    }
  }
  
  spawnSaws(n, x, y) {
    let positions = [
      { xPos: x, yPos: y },
      { xPos: x + 32, yPos: y},
      { xPos: x, yPos: y - 32 },
      { xPos: x + 32, yPos: y - 32}
    ];
    for (let i = 0; i < n; i++) {
      let saw = this.physics.add.sprite(positions[i].xPos, positions[i].yPos, 'saw', 1);
      this.sawGroup.add(saw);
      saw.setOrigin(0,1);
      saw.setScale(2,2);
      saw.setGravity(0,0);
      saw.setImmovable(true);
      saw.setVelocityX(-gameOptions.platformSpeed);
      saw.play('sawSpin');
    }
  }
  
  spawnFlame(x, y) {
    let offsetX = Phaser.Math.Between(40, 60);
    let offsetY = Phaser.Math.Between(0, 10)
    let flamer = this.physics.add.sprite(x, y, 'flame1');
    this.flameGroup.add(flamer);
    flamer.setSize(4, 8)
    flamer.setScale(2,2);
    flamer.setOffset(4, 8)
    flamer.setGravity(0, gameOptions.playerGravity /2);
    flamer.setBounce(1,0.4);
    flamer.setVelocity((gameOptions.platformSpeed + offsetX) * -1, offsetY);
    flamer.play('flame');
  }
  
  //the core of the script: spawning platforms
  buildPlatform(xPos) {
    //randomly nfiguring the platform; adjust as needed
    let seed = Phaser.Math.Between(1, 999);
    let containsCoins = randomTrueFalse(4);
    let containsSaws = randomTrueFalse(4);
    
    let keyN = Phaser.Math.Between(1, 4);
    let heightBaseline = gameConfig.height * 0.8;
    
    let platform = new Platform({
      scene: this,
      x: xPos,
      y:  Phaser.Math.Between(heightBaseline, heightBaseline * 1.1),
      key: 'platform' + keyN,
    });
    
    //rendering the platform
    this.platformGroup.add(platform);
    platform.setScale(2,2);
    platform.setOrigin(0,0);
    platform.setImmovable(true);
    platform.setGravity(0,0);
    platform.setVelocityX(-gameOptions.platformSpeed);
    
    //configuring coins
    if (containsCoins) {
      let noCoins = Phaser.Math.Between(6, 24);
      let isHigh = randomTrueFalse(5);
      if (!isHigh) {
        let isArc = randomTrueFalse(5);
      } else {
        let isArc = false;
      }
      //rendering coins
      this.spawnCoins(noCoins, platform.x, platform.y);
      console.log('platform id ' + seed + 'containing rendered. contains ' + noCoins + ' coins.');
    }
    
    //configuring saws
    if (containsSaws) {
      let noSaws = Phaser.Math.Between(1,4);
      if (keyN > 3) {
        this.spawnSaws(noSaws, platform.x + (platform.displayWidth / 2), platform.y);
      }
    }
    
    //configuring flames
    if (keyN > 2) {
      this.spawnFlame(platform.x + platform.displayWidth / 2, platform.y - 64);
    }
  }
  
  collectCoin(player, coin) {
    coin.disableBody(true, true);
    coins += 1;
    score += 5;
    this.coinSound.play({
      loop: false,
      volume: 0.5,
      rate: 1,
      delay: 0
    });
  }
  
  playerHit(player, hazard) {
    console.log('player hit');
    this.player.setVelocity(0,0);
    this.player.play('explosion');
    this.explosionSound.play({
      loop: false,
      volume: 0.5,
      delay: 0,
      rate: 1,
    });
    //this.scene.pause("Main");
    let playerHead = this.physics.add.sprite(player.x, player.y, 'head');
    playerHead.setScale(2,2);
    playerHead.setGravity(0, gameOptions.playerGravity);
    playerHead.setVelocity(Phaser.Math.Between(50, -50), Phaser.Math.Between(-200, -400));
    this.physics.add.collider(playerHead, this.platformGroup);
  }
  
  gameOver() {
    this.scene.pause("Main");
    this.scene.launch("GameOver");
  }
  
  update() {
    //game over
    if (this.player.y > gameConfig.height) {
      this.gameOver();
    }
    
    //updating score
    score += 1;
    this.scoreText.setText('Score ' + score, { fontFamily: 'doomed' });
    this.coinsText.setText('Coins ' + coins, { fontFamily: 'doomed' });
    if (score > highScore) {
      highScore = score;
    }
    //scrolling the background;
    this.background1.tilePositionX -= 1;
    this.background2.tilePositionX += 1;
    this.background3.tilePositionX += 2;
    
    //Keeping the player character close to his start position.f
    this.player.x = gameOptions.playerStartPosition;
    if (this.player.body.touching.down) {
      if (this.player.x > gameOptions.playerStartPosition) {
        this.player.setVelocityX(0);
      } else if (this.player.x < gameOptions.playerStartPosition) {
        this.player.setVelocityX(gameOptions.platformSpeed);
      } else {
        //this.player.setVelocityX(gameOptions.platformSpeed);
      }
    } else {
      this.player.setVelocityX(0);
    }
  }
}

class GameOver extends Phaser.Scene {
  constructor() {
    super("GameOver");
  }
  
  create() {
    this.gameOverText = this.add.text(this.scale.width / 2.5, this.scale.height / 2.3, 'Game over.', {
      fontSize: '16px',
      fontFamily: 'doomed',
      color:'#DADAD8',
    });
    this.scoreText = this.add.text(this.scale.width / 2.5, this.scale.height / 2.1, 'Your score: ', {
      fontSize: '16px',
      fontFamily: 'doomed',
      color: '#DADAD8',
    });
    this.scoreText2 = this.add.text(this.scale.width / 2.5, this.scale.height / 1.9,
    (score + ' x ' + coins),
    {
      fontSize: '16px',
      fontFamily: 'doomed',
      color: '#DADAD8',
      stroke: '#1EA49D'
    });
    this.scoreText3 = this.add.text(this.scale.width / 2.5, this.scale.height / 1.7,
    (score * coins),
    {
      fontSize: '16px',
      fontFamily: 'doomed',
      color: '#DADAD8',
      stroke: '#1EA49D',
      strokeThickness: '4'
    });
    
    this.replayButton = this.add.text(this.scale.width / 2.5, this.scale.height / 1.5, "Play Again", {
      fontFamily: 'doomed',
      fontSize: '16px',
      color: '#FE6196',
      stroke: '#DADAD8',
      strokeThickness: '4',
    });
    this.replayButton.setInteractive();
    this.replayButton.on('pointerdown', () => {
      score = 0;
      coins = 0;
      this.scene.start("Main");
    });
  }
  
  update() {
    
  }
  
}

class BootGame extends Phaser.Scene {
  constructor() {
    super("BootGame");
  }
  
  preload() {
    const x = this.scale.width * 0.5;
    const y = this.scale.height * 0.5;
    //preload screen progress bar
    var progressBar = this.add.graphics();
    var progressBox = this.add.graphics();
    progressBar.moveTo(x,y);
    progressBox.moveTo(x,y);
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(x * 0.6, y, 320, 50);
    this.load.on('progress', function (value) {
      console.log(value);
      progressBar.clear();
      progressBar.fillStyle(0x69D2E7, 1);
      progressBar.fillRect(x * 0.6 + 10, y + 10, 300 * value, 30);
    });

    this.load.on('fileprogress', function (file) {
      console.log(file.src);
    });

    this.load.on('complete', function() {
      console.log('complete');
      progressBar.destroy();
      progressBox.destroy();
    });
    
    this.load.image('logoMain', 'sprites/logo.png');
    //base assets
    this.load.spritesheet('gregoryRuns', 'sprites/mohawk_run.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('springTileset', 'sprites/spring_.png', {frameWidth: 16, frameHeight: 16});
    this.load.image('startingPlatform', 'sprites/startingPlatform.png');
    this.load.image('platform1', 'sprites/green_4.png');
    this.load.image('platform2', 'sprites/green_6.png');
    this.load.image('platform3', 'sprites/green_8.png');
    this.load.image('platform4', 'sprites/green_12.png');
    this.load.image('head', 'sprites/head.png');
    
    //coins, items
    this.load.spritesheet('coin', 'sprites/shinycoin.png', { frameWidth: 16, frameHeight: 16});
    this.load.spritesheet('saw', 'sprites/blades.png', {frameWidth: 16, frameHeight: 16 });
    this.load.image('flame1', 'sprites/flame/fire1.png');
    this.load.image('flame2', 'sprites/flame/fire2.png');
    this.load.image('flame3', 'sprites/flame/fire3.png');
    //background items
    this.load.image('city_01', 'sprites/Parallax/city_01.png');
    this.load.image('city_02', 'sprites/Parallax/city_02.png');
    this.load.image('cloudPink', 'sprites/Parallax/Cloud2.png');
    this.load.image('cloudPurple', 'sprites/Parallax/Cloud4.png');
    this.load.image('heart', 'sprites/heart1.png');
    //explosion
    this.load.image("expl1", "sprites/explosion/explosion-01.png");
    this.load.image("expl2", "sprites/explosion/explosion-02.png");
    this.load.image("expl3", "sprites//explosion/explosion-03.png");
    this.load.image("expl4", "sprites/explosion/explosion-04.png");
    this.load.image("expl5", "sprites/explosion/explosion-05.png");
    this.load.image("expl6", "sprites/explosion/explosion-06.png");
    this.load.image("expl7", "sprites/explosion/explosion-07.png");
    this.load.image("expl8", "sprites/explosion/explosion-08.png");
    this.load.image("expl9", "sprites/explosion/explosion-09.png");
    this.load.image("expl10", "sprites/explosion/explosion-10.png");
    this.load.image("expl11", "sprites//explosion/explosion-11.png");
    //sounds
    this.load.audio('coinsound', 'assets/Coin.ogg');
    this.load.audio('explosionsound', 'assets/Explossion.ogg');
  }
  create() {
    console.log("game is booting...");
    this.scene.start("TitleScreen");
  }
}

class TitleScreen extends Phaser.Scene {
  constructor() {
    super("TitleScreen");
  }
  
  preload() {
    
  }
  
  create() {
    this.background1 = this.add.tileSprite(0, 0, 1280, 450, 'cloudPink');
    this.background1.setScale(2,2);
    this.background1.setOrigin(0,0)
    this.background2 = this.add.tileSprite(0, 0 + 23, gameConfig.width, gameConfig.height, 'city_01');
    this.background2.setScale(2,2);
    this.background2.setOrigin(0,0);
    this.background3 = this.add.tileSprite(0, 0 + 46, gameConfig.width, gameConfig.height, 'city_02');
    this.background3.setScale(2,2);
    this.background3.setOrigin(0,0);
    
    let logo = this.add.sprite(this.scale.width / 2, this.scale.height / 1.5, 'logoMain');
    let displayText = this.add.text(this.scale.width / 2.8, this.scale.height / 1.4, '[Tap or Click to Start]', {
      fontSize: '16px',
      stroke: '#FF2C69',
      strokeThickness: '4',
      color: '#DADAD8',
    });
    console.log('Gregory Runs for His Life');
    
    this.input.once('pointerdown', () => {
      this.scene.start('Main');
    });
  }

  update() {
    //scrolling the background;
    this.background1.tilePositionX -= 1;
    this.background2.tilePositionX += 1;
    this.background3.tilePositionX += 2;
  }
  
}