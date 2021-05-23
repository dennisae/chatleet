export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, "bike1");

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setScale(0.2);

    this.setCollideWorldBounds(true);

    this.createAnimations();
  }

  createAnimations() {
    this.scene.anims.create({
      key: `bikeforward`,
      frames: this.scene.anims.generateFrameNumbers(`bike1`, {
        start: 0,
        end: 3
      }),
      frameRate: 10,
      repeat: -1
    });
  }
}
