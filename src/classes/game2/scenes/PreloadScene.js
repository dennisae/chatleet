class PreloadScene extends Phaser.Scene {
  constructor() {
    super({
      key: `preload`
    });
  }

  preload() {
    this.load.spritesheet("bike1", "./assets/bike/bike1.png", {
      frameWidth: 612,
      frameHeight: 536
    });
    this.load.spritesheet("bike2", "./assets/bike/bike2.png", {
      frameWidth: 612,
      frameHeight: 536
    });
    this.load.image("background", "./assets/background2.png");
  }

  create() {
    this.scene.start(`start`);
  }

  update() {}
}

export default PreloadScene;
