export default class Player2 extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, "bike2");

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setScale(0.2);

    this.setCollideWorldBounds(true);

    this.createAnimations();
  }

  createAnimations() {
    this.scene.anims.create({
      key: `bikeforward2`,
      frames: this.scene.anims.generateFrameNumbers(`bike2`, {
        start: 0,
        end: 3
      }),
      frameRate: 10,
      repeat: -1
    });
  }
}
