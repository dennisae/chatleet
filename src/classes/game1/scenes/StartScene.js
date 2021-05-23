import Player from "../objects/Player.js";
import Item from "../objects/Item.js";
import Boei from "../objects/Boei.js";
import SinkingBoat from "../objects/sinkingBoat";

class StartScene extends Phaser.Scene {
  constructor() {
    super({
      key: `start`
    });

    this.value = 2500;
    this.speed = 2500;
    this.score = 0;
    this.punten = 0;
    this.schade = 100;
    this.levelSpeed = 5;

    this.playing = false;
  }

  create() {
    this.background = this.add.tileSprite(
      window.innerWidth / 2,
      window.innerHeight / 2,
      window.innerWidth,
      window.innerHeight,
      "background"
    );

    this.oceansound = this.sound.add("ocean");
    this.meeuwsound = this.sound.add("meeuw");

    this.scoreTextField = this.add.text(20, 35, `Afstand: 0m`, {
      fontSize: `24px`,
      fill: `#FFFFFF`,
      fontFamily: "sfprodisplay"
    });

    this.schadeTextField = this.add.text(20, 75, `Leven: 100%`, {
      fontSize: `24px`,
      fill: `#FFFFFF`,
      fontFamily: "sfprodisplay"
    });

    this.puntenTextField = this.add.text(20, 115, `Boeien: 0`, {
      fontSize: `24px`,
      fill: `#FFFFFF`,
      fontFamily: "sfprodisplay"
    });

    this.items = this.physics.add.staticGroup();
    this.items.createIfNull = false;

    this.boeien = this.physics.add.staticGroup();
    this.boeien.createIfNull = false;

    this.createPlayer();
    this.initItems();
    this.initBoeien();

    this.timedEvent = this.time.addEvent({
      delay: this.value,
      callback: this.addItem,
      callbackScope: this,
      loop: true
    });

    this.timedEvent2 = this.time.addEvent({
      delay: this.value,
      callback: this.addBoei,
      callbackScope: this,
      loop: true
    });

    this.createCollideItem();
    this.createCollideBoei();
  }

  createPlayer() {
    this.player = new Player(
      this,
      this.sys.game.canvas.width / 2,
      this.sys.game.canvas.height / 4 + this.sys.game.canvas.height / 2
    );
    this.player.body.setAllowGravity(false);
    this.player.anims.play(`forward`, true);

    this.input.on("pointermove", pointer => {
      this.player.x = pointer.x;
    });

    this.input.on("drag", dragX => {
      this.player.x = dragX;
    });
  }

  addItem() {
    this.item = this.items.getFirstDead();
    this.item.enableBody(
      true,
      Phaser.Math.Between(0, this.game.config.width),
      -Phaser.Math.Between(200, 1000),
      true,
      true
    );
    this.item.anims.play(`forward2`, true);

    this.timedEvent.reset({
      delay: this.speed,
      callback: this.addItem,
      callbackScope: this,
      repeat: 1
    });

    this.createCollideItem();
  }

  addBoei() {
    this.boei = this.boeien.getFirstDead();
    this.boei.enableBody(
      true,
      Phaser.Math.Between(0, this.game.config.width),
      -Phaser.Math.Between(200, 1000),
      true,
      true
    );

    this.timedEvent2.reset({
      delay: this.speed,
      callback: this.addBoei,
      callbackScope: this,
      repeat: 1
    });

    this.createCollideBoei();
    this.createCollideBoeiandItem();
  }

  initItems() {
    for (let i = 0; i < 100; i++) {
      //const scale = Math.random() * 0.1 + 0.07;

      const sprite = new Item(
        this,
        Phaser.Math.Between(0, this.game.config.width),
        -200
      );

      this.items.add(sprite);
    }
    this.items.runChildUpdate = true;
  }

  initBoeien() {
    for (let i = 0; i < 100; i++) {
      //const scale = Math.random() * 0.1 + 0.07;

      const sprite = new Boei(
        this,
        Phaser.Math.Between(0, this.game.config.width),
        -200,
        Phaser.Math.Between(0, 360)
      );
      this.boeien.add(sprite);
    }
    this.boeien.runChildUpdate = true;
  }

  createCollideItem() {
    this.physics.add.overlap(this.player, this.item, this.hitItem, null, this);
  }

  createCollideBoei() {
    this.physics.add.overlap(this.player, this.boei, this.hitBoei, null, this);
  }

  createCollideBoeiandItem() {
    this.physics.add.overlap(
      this.item,
      this.boei,
      this.hitBoeiAndBoat,
      null,
      this
    );
  }

  hitItem(obj1, obj2) {
    obj2.disableBody(true, true);

    this.schade -= 25;
    if (this.punten >= 5) {
      this.punten -= 2;
      this.five = this.add.text(obj2.x, obj2.y, `-2`, {
        fontSize: `50px`,
        fill: `#FFFFFF`,
        fontFamily: "made"
      });

      setTimeout(() => {
        this.five.destroy();
      }, 400);
    }

    if (this.levelSpeed >= 7) {
      this.levelSpeed -= 1;
    }

    this.sound.play("boathit", {
      mute: false,
      volume: 0.1,
      rate: 1,
      detune: 0,
      seek: 0,
      loop: false,
      delay: 0
    });

    if (this.schade === 0) {
      obj1.disableBody(true, true);
      this.sinkingBoat = new SinkingBoat(this, obj1.x, obj1.y);
      this.sinkingBoat.anims.play("sinkingboat", true);
    }
  }

  hitBoei(obj1, obj2) {
    obj2.disableBody(true, true);
    this.punten += 1;

    this.sound.play("boeihit", {
      mute: false,
      volume: 0.1,
      rate: 1,
      detune: 0,
      seek: 0,
      loop: false,
      delay: 0
    });

    this.plusOne = this.add.text(obj2.x, obj2.y, `+1`, {
      fontSize: `50px`,
      fill: `#FFFFFF`,
      fontFamily: "made"
    });

    setTimeout(() => {
      this.plusOne.destroy();
    }, 400);
  }

  hitBoeiAndBoat(obj1, obj2) {
    obj2.disableBody(true, true);
  }

  checkDamage() {
    if (this.schade <= 0) {
      setTimeout(() => {
        this.gameOver();
      }, 2000);
    }
  }

  gameOver() {
    localStorage.setItem("currentBoeien", this.punten);
    this.value = 2500;
    this.speed = 2500;
    this.score = 0;
    this.schade = 100;
    this.levelSpeed = 5;

    this.playing = false;

    this.scene.start(`gameover`);
  }

  update() {
    if (!this.playing) {
      this.playing = true;
      this.oceansound.play({
        mute: false,
        volume: 0.1,
        rate: 1,
        detune: 0,
        seek: 0,
        loop: true,
        delay: 0
      });

      this.meeuwsound.play({
        mute: false,
        volume: 0.05,
        rate: 1,
        detune: 0,
        seek: 0,
        loop: true
      });
    }
    this.value += 1;

    this.score += (0.05 * this.levelSpeed) / 4;

    this.levelSpeed += 0.002;
    this.speed -= 0.1;

    this.background.tilePositionY -= this.levelSpeed;

    this.scoreTextField.setText(`Afstand: ${Math.round(this.score)}m`);
    this.schadeTextField.setText(`Leven: ${Math.round(this.schade)}%`);
    this.puntenTextField.setText(`Boeien: ${Math.round(this.punten)}`);

    this.checkDamage();
  }
}

export default StartScene;
