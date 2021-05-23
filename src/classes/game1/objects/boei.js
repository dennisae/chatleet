export default class Boei extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, rotation) {
    super(scene, x, y, `boei`);

    scene.add.existing(this);
    scene.physics.add.existing(this);
    scene.sys.arcadePhysics.world.enableBody(this, 0);
    this.setCollideWorldBounds(false);
    this.onWorldBounds = false;
    this.body.onWorldBounds = false;
    this.disableBody(true, true);

    this.angle = rotation;

    this.setScale(0.5);
  }

  update() {
    if (this.body.y > this.scene.game.config.height) {
      this.disableBody(true, true);
    }
  }
}
