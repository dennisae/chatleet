class PreloadScene extends Phaser.Scene {
  constructor() {
    super({
      key: `preload`
    });
  }

  preload() {
    this.load.spritesheet("boat", "./assets/boat/boat.png", {
      frameWidth: 188,
      frameHeight: 782
    });
    this.load.spritesheet("object", "./assets/object/object.png", {
      frameWidth: 191,
      frameHeight: 781
    });
    this.load.spritesheet("sinkingBoat", "./assets/boat/sinking.png", {
      frameWidth: 188,
      frameHeight: 782
    });
    this.load.spritesheet("sinkingBoei", "./assets/sinking.png", {
      frameWidth: 196,
      frameHeight: 190
    });
    this.load.svg("boei", "./assets/boei.svg");
    this.load.image("background", "./assets/background.jpg");

    this.load.audio("ocean", "./assets/sounds/ocean.mp3");
    this.load.audio("boeihit", "./assets/sounds/boei_hit.mp3");
    this.load.audio("boathit", "./assets/sounds/boat_hit.mp3");
    this.load.audio("meeuw", "./assets/sounds/meeuw.mp3");
  }

  create() {
    this.scene.start(`start`);
  }

  update() {}
}

export default PreloadScene;
