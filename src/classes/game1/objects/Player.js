export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, `boat`);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setCollideWorldBounds(true);
    this.setScale(0.35);

    this.createAnimations();
  }

  createAnimations() {
    this.scene.anims.create({
      key: `forward`,
      frames: this.scene.anims.generateFrameNumbers(`boat`, {
        start: 0,
        end: 3
      }),
      frameRate: 4,
      repeat: -1
    });
  }
}
