export default class SinkingBoat extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, "sinkingBoat");

    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.enableBody = true;
    this.body.allowGravity = false;

    this.setScale(0.3);

    this.createAnimations();
  }

  createAnimations() {
    this.scene.anims.create({
      key: `sinkingboat`,
      frames: this.scene.anims.generateFrameNumbers(`sinkingBoat`, {
        start: 0,
        end: 6
      }),
      frameRate: 4
    });
  }
}
