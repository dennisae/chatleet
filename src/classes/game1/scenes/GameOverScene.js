export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super({
      key: `gameover`
    });
  }
  create() {
    this.cameras.main.setBackgroundColor("#181818");
    this.boeien = localStorage.getItem("currentBoeien");

    this.scoreField = document.querySelector(".score");
    this.scoreField.innerHTML = `${this.boeien}`;

    this.emmaScoreField = document.querySelector(".scoreEmma");
    this.emmaScoreField.innerHTML = `${500 - this.boeien}`;

    const $restartbtn = document.querySelector(".game_over_btn1");
    $restartbtn.addEventListener("click", () => {
      this.scene.start("start");

      const $div = document.querySelector(`.game_over`);
      $div.style.visibility = `hidden`;
    });

    const $sharebtn = document.querySelector(".game_over_btn3");
    $sharebtn.addEventListener("click", () => {
      console.log("share");
      if (navigator.share) {
        navigator
          .share({
            title:
              "Probeer mijn score van 35m te verbeteren tegen Emma Plaschaert in de ultieme olympische challenge",
            url: "https://joachimbauters.be/20192020/chatleet/"
          })
          .then(() => {
            console.log("Thanks for sharing!");
          })
          .catch(console.error);
      } else {
        console.log("share not supported");
      }
    });

    this.createHtml();
  }

  createHtml() {
    const $div = document.querySelector(`.game_over`);
    $div.style.visibility = `visible`;
  }
}
