export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super({
      key: `gameover`
    });
  }
  create() {
    this.cameras.main.setBackgroundColor("#181818");
    this.afstand = localStorage.getItem("currentAfstand");

    this.scoreField = document.querySelector(".score");
    this.scoreField.innerHTML = `${this.afstand}`;

    this.jolienScoreField = document.querySelector(".scoreJolien");
    this.jolienScoreField.innerHTML = `${10000 - this.afstand}m`;

    const $restartbtn = document.querySelector(".game_over_btn1");
    $restartbtn.addEventListener("click", () => {
      this.scene.start("start");

      const $div = document.querySelector(`.game_over`);
      $div.style.visibility = `hidden`;
    });

    const $sharebtn = document.querySelector(".game_over_btn3");
    $sharebtn.addEventListener("click", () => {
      if (navigator.share) {
        navigator
          .share({
            title:
              "Probeer mijn score van 35m te verbeteren tegen Jolien D'Hoore in de ultieme olympische challenge",
            url: "https://joachimbauters.be/20192020/chatleet/",
            text:
              "Probeer mijn score van 35m te verbeteren tegen Jolien D'Hoore in de ultieme olympische challenge"
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
