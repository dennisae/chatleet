import PreloadScene from "./scenes/PreloadScene.js";
import StartScene from "./scenes/StartScene.js";
import GameOverScene from "./scenes/GameOverScene.js";

class Game extends Phaser.Game {
  constructor() {
    super({
      type: Phaser.AUTO,
      width: window.innerWidth,
      height: window.innerHeight,
      title: `games`,
      scene: [PreloadScene, StartScene, GameOverScene],
      url: `http://www.devine.be`,
      version: `1.0`,
      parent: document.querySelector(".game_container"),
      scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH
      },
      physics: {
        default: `arcade`,
        arcade: {
          debug: false,
          gravity: { y: 100 }
        }
      },
      audio: {
        disableWebAudio: true
      }
    });
  }
}

export default Game;
