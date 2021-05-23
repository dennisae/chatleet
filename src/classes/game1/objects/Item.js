export default class Item extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, `object`);

    scene.add.existing(this);
    scene.physics.add.existing(this);
    scene.sys.arcadePhysics.world.enableBody(this, 0);
    this.setCollideWorldBounds(false);
    this.onWorldBounds = false;
    this.body.onWorldBounds = false;
    this.disableBody(true, true);

    this.setScale(0.35);

    this.createAnimations();
  }

  createAnimations() {
    this.scene.anims.create({
      key: `forward2`,
      frames: this.scene.anims.generateFrameNumbers(`object`, {
        start: 0,
        end: 3
      }),
      frameRate: 4,
      repeat: -1
    });
  }

  update() {
    if (this.body.y > this.scene.game.config.height) {
      this.disableBody(true, true);
    }
  }
}
