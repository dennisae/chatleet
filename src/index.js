import "./style.css";
import "phaser";
import Flickity from "flickity";
import * as THREE from "three";
import TWEEN from "@tweenjs/tween.js";
import { TweenLite } from "gsap/TweenMax";
import SimplexNoise from "simplex-noise";
import OBJLoader from "./js/OBJLoader";
import MTLLoader from "./js/MTLLoader";
import Cookies from "js-cookie";
import Game1 from "./classes/game1/Game.js";
import Game2 from "./classes/game2/Game.js";

global.THREE = THREE;

{
  let stories;
  let story, storyGame;
  let dialogueCount = 0;
  let currentDialogue;
  const noise = new SimplexNoise();
  const $answerbox = document.querySelector(`.answers`);
  const $answerlist = document.querySelector(`.answers_list`);
  const $chatbox = document.querySelector(`.messages`);
  const $canvas = document.createElement(`canvas`);
  const $canvas2 = document.createElement(`canvas`);

  const naam = "emmaplasschaert";

  const parseStory = data => {
    if (!$chatbox) {
      return;
    }

    story = data.scenarios.scenario_1;
    const $naam = document.querySelector(`.chat_head_name`);
    if ($naam) {
      $naam.innerHTML = story.ontvanger;
    }

    story.premise.forEach(premise => {
      setTimeout(() => {
        const $loader = messageLoading(premise.character);
        $chatbox.appendChild($loader);
        setTimeout(() => {
          $chatbox.removeChild($loader);
          const $message = createMessage(premise);
          $chatbox.appendChild($message);
        }, 2500);
      }, premise.delay);
    });

    setTimeout(() => {
      createAnswersAndResponses(story.dialogues);
      setHeightChat();
    }, 8000);
  };

  const messageLoading = character => {
    const $li = document.createElement(`li`);
    $li.classList.add("dialoog");
    $li.innerHTML = `
      <div class="dialoog_avatar avatar_character">
        <img src="./assets/${character}.jpg" class="img_responsive">
      </div>
      <div class="spinner">
        <div class='bounce1'></div><div class='bounce2'></div><div class='bounce3'></div>
      </div>
    `;
    return $li;
  };

  const parse = async data => {
    stories = data.stories;
    stories.forEach(character => {
      createStory(character);
      createGames(character);
    });
  };

  const createGames = character => {
    const $ul = document.querySelector(`.games`);
    const $li = document.createElement(`li`);

    $li.classList.add(`game_item`);
    $li.classList.add(`carousel-cell`);

    if (character.game) {
      $li.innerHTML = `
      <a href="${character.game.link}">
        <article class="game">
          <img src="${character.picture.thumbnail}" alt="profile" class="cover_atleet img_responsive">
          <img src="${character.game.cover}" alt="cover" class="img_responsive game_image">
        </article>
      </a>
    `;
    } else {
      return;
    }
    if ($ul) {
      $ul.appendChild($li);
    }
  };

  const createIntro = () => {
    const $ul = document.querySelector(".message_intro");

    setTimeout(() => {
      const $li = document.createElement(`li`);
      $li.classList.add("dialoog");
      $li.innerHTML = `
      <div class="dialoog_avatar avatar_character">
              <img src="./assets/sporza.jpg" class="img_responsive">
        </div>
      <div class="spinner">
      <div class='bounce1'></div><div class='bounce2'></div><div class='bounce3'></div>
      </div>
    `;
      if ($ul) {
        $ul.appendChild($li);
      }
    }, 1000);

    setTimeout(() => {
      if ($ul) {
        $ul.innerHTML = ``;
      }
      const $li = document.createElement(`li`);
      $li.classList.add("dialoog");
      $li.classList.add("charactre");
      $li.innerHTML = `
        <div class="dialoog_avatar avatar_character">
              <img src="./assets/sporza.jpg" class="img_responsive">
        </div>
        <div class="dialoog_message_character">
          <p>Yoo, what’s up! Klaar om onze Belgische atleten te leren kennen?</p>
        </div>
    `;
      if ($ul) {
        $ul.appendChild($li);
      }
    }, 3000);

    setTimeout(() => {
      const $li = document.createElement(`li`);
      $li.classList.add("dialoog");
      $li.classList.add("other");
      $li.innerHTML = `
        <a href="#berichten" class="dialoog_message_other_scroll">
          Bring it on!
        </a>
    `;
      if ($ul) {
        $ul.appendChild($li);
        $li.addEventListener(`click`, e => {
          e.preventDefault();
          const $a = $li.childNodes[1];
          scrollTo(document.querySelector($a.getAttribute(`href`)));
        });
      }
    }, 5000);
  };

  const scrollTo = element => {
    window.scroll({
      behavior: `smooth`,
      left: 0,
      top: element.getBoundingClientRect().top + window.scrollY
    });
  };

  const createStory = character => {
    const $ul = document.querySelector(`.stories`);
    const $li = document.createElement(`li`);

    $li.classList.add(`story`);
    if (character.active === true) {
      $li.innerHTML = `
      <a href="index.php?page=${character.name.link}">
        <div class="story_card">
          <img src="${character.picture.thumbnail}" alt="${
        character.name.voornaam
      } ${character.name.achternaam}" class="img_responsive story_img"/>
          <div class="meta">
            <h3 class="story_naam">${character.name.voornaam} ${
        character.name.achternaam
      }</h3>
            <p class="story_bijtext">${character.premise}</p>
          </div>
          <div class="extra_info">
            ${
              Cookies.get(character.name.voornaam.toLowerCase()) === undefined
                ? '<div class="read_indicator"></div>'
                : "<div></div>"
            }
          </div>
        </div>
      </a>
    `;
    } else {
      $li.innerHTML = `
      <a>
        <div class="story_card">
          <img src="${character.picture.thumbnail}" alt="${character.name.voornaam} ${character.name.achternaam}" class="img_responsive story_img"/>
          <div class="meta">
            <h3 class="story_naam">${character.name.voornaam} ${character.name.achternaam}</h3>
            <p class="story_bijtext">${character.premise}</p>
          </div>
          <div class="extra_info">
            <div class="read_indicator"></div>
          </div>
        </div>
      </a>
    `;
    }

    if ($ul) {
      $ul.appendChild($li);
    }
  };

  const createAnswersAndResponses = dialogues => {
    $answerbox.innerHTML = ``;
    currentDialogue = dialogues[dialogueCount];

    if (!currentDialogue) {
      return;
    }

    currentDialogue.choices.forEach(choice => {
      const $choice = createChoice(choice);
      $answerbox.appendChild($choice);
    });

    const meme = document.querySelector(".meme-carousel");
    if (meme) {
      new Flickity(meme, {
        // options
        cellAlign: "left",
        draggable: true,
        prevNextButtons: false,
        pageDots: true
      });
    }

    const $btns = document.querySelectorAll(".dialoog_btn");
    $btns.forEach(btn => {
      btn.addEventListener("click", handleClickAnswer);
    });

    const $btnsImg = document.querySelectorAll(".dialoog_btn_img");
    $btnsImg.forEach(btn => {
      btn.addEventListener("click", handleClickAnswer);
    });
  };

  const handleClickAnswer = e => {
    e.currentTarget.style.backgroundColor = "#84ff00";
    e.currentTarget.style.color = "black";
    dialogueCount = e.currentTarget.dataset.id;
    const answer = e.currentTarget.innerHTML;

    setTimeout(() => {
      currentDialogue = story.dialogues[dialogueCount];
      $answerbox.innerHTML = ``;

      console.log(currentDialogue.choices.length === 0);

      if (currentDialogue.choices.length === 0) {
        const $li = document.createElement(`li`);
        $li.innerHTML = `
                <div class="dialoog_message_other">
                  <p>${answer}</p>
                </div>
              `;

        $li.classList.add("dialoog");
        $li.classList.add("other");
        $chatbox.appendChild($li);
        setHeightChat();
        setTimeout(() => {
          transitionAnimation();
        }, 2000);
      } else {
        const $li = document.createElement(`li`);
        $li.innerHTML = `
                <div class="dialoog_message_other">
                  <p>${answer}</p>
                </div>
              `;

        $li.classList.add("dialoog");
        $li.classList.add("other");
        $chatbox.appendChild($li);
        setHeightChat();
      }

      if (!currentDialogue) {
        return;
      }

      const delay = currentDialogue.replies.slice(-1).pop();
      currentDialogue.replies.forEach(reply => {
        setTimeout(() => {
          const $loader = messageLoading(reply.character);
          $chatbox.appendChild($loader);
          setHeightChat();
          setTimeout(() => {
            $chatbox.removeChild($loader);
            const $reply = createMessage(reply);
            $chatbox.appendChild($reply);
            setHeightChat();
          }, 2500);
        }, reply.delay);
      });

      setTimeout(() => {
        createAnswersAndResponses(story.dialogues);
        setHeightChat();
      }, delay.delay + 3000);
    }, 500);
  };

  const createMessage = message => {
    const $li = document.createElement(`li`);
    switch (message.type) {
      case `message`:
        if (message.user === "character") {
          $li.innerHTML = `
            <div class="dialoog_avatar avatar_${message.user}">
              <img src="./assets/${message.character}.jpg" class="img_responsive">
            </div>
            <div class="dialoog_message_${message.user}">
              <p>${message.text}</p>
            </div>
          `;
          $li.classList.add("dialoog");
          $li.classList.add(message.user);
        } else {
          $li.innerHTML = `
            <div class="dialoog_message_${message.user}">
              <p>${message.text}</p>
            </div>
          `;
          $li.classList.add("dialoog");
          $li.classList.add(message.user);
        }
        return $li;
        break;
      case `image`:
        if (message.user === "character") {
          $li.innerHTML = `
          <div class="dialoog_avatar avatar_${message.user}">
            <img src="./assets/${message.character}.jpg" class="img_responsive">
          </div>
          <div class="dialoog_message is-image">
            <img src="${message.src}" class="img_responsive">
          </div>

          `;
          $li.classList.add("dialoog");
          $li.classList.add(message.user);
        } else {
          $li.innerHTML = `

          <div class="dialoog_message is-image">
            <img src="${message.src}" class="img_responsive">
          </div>

          `;
          $li.classList.add("dialoog");
          $li.classList.add(message.user);
        }
        return $li;
        break;
      case `link`:
        if (message.user === "character") {
          $li.innerHTML = `
          <div class="dialoog_avatar avatar_${message.user}">
            <img src="./assets/${message.character}.jpg" class="img_responsive">
          </div>
          <div class="dialoog_message_${message.user} is-link">
            <a href="${message.link}" target="_blank">${message.link}</a>
          </div>
          `;
          $li.classList.add("dialoog");
          $li.classList.add(message.user);
        } else {
          $li.innerHTML = `
          <div class="dialoog_message_${message.user} is-link">
            <a href="${message.link}" target="_blank">${message.link}</a>
          </div>
          `;
          $li.classList.add("dialoog");
          $li.classList.add(message.user);
        }
        return $li;
        break;

      case `game`:
        $li.innerHTML = `
          <div class="dialoog_avatar avatar_${message.user}">
            <img src="./assets/${message.character}.jpg" class="img_responsive">
          </div>
          <div class="dialoog_message_${message.user}_game">
            <img src="${message.src}" class="game_img img_responsive">
            <div class="game_link_icon">
              <a href="index.php?page=introzeilen" class="game_link">Play now</a>
            </div>
          </div>
          `;
        $li.classList.add("dialoog");
        $li.classList.add(message.user);
        return $li;
        break;
    }
  };

  const createChoice = dialogue => {
    if (!dialogue) {
      return;
    }

    const $ul = document.querySelector(`.answers`);
    $ul.classList.remove("flex_row_choices_image");

    const $li = document.createElement(`li`);
    switch (dialogue.type) {
      case `message`:
        $li.innerHTML = `
        <button type="button" class="dialoog_btn" data-id="${dialogue.id}">
          ${dialogue.text}
        </button>
        `;
        $li.classList = `answer_item`;
        return $li;
        break;
      case `image`:
        $ul.classList.add("meme-carousel");

        $li.innerHTML = `
        <button type="button" class="dialoog_btn_img" data-id="${dialogue.id}">
          <img src="${dialogue.src}" class="img_responsive">
        </button>
        `;

        $li.classList.add("carousel-cell");
        $li.classList.add("answer_item_img");
        return $li;
        break;

      case `video`:
        $li.innerHTML = `
        <button type="button" class="dialoog_btn" data-id="${dialogue.id}">
          <video class="img_responsive" autoplay loop>
            <source src="${dialogue.src}" type="video/mp4">
          </video>
        </button>
        `;

        $li.classList = `is-videochoice`;
        $li.classList = `answer_item`;
        return $li;
        break;
    }
  };

  const setHeightChat = () => {
    scrollToBottomMessages();
  };

  window.onload = function() {
    setHeightChat();
  };

  const scrollToBottomMessages = () => {
    const $msgs = document.querySelector(`.dialoog_scroll`);
    if ($msgs) {
      $msgs.scroll({
        top: $msgs.scrollHeight - $msgs.clientHeight,
        behavior: "smooth"
      });
    }
  };

  const scrollToBottomStory = () => {
    const $fullstory = document.querySelector(`.fullstory_scroll`);

    if ($fullstory) {
      $fullstory.scroll({
        top: $fullstory.scrollHeight - $fullstory.clientHeight
      });
    }
  };

  const mainThreejs = canvas => {
    const scene = new THREE.Scene();
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });

    const fov = 75;
    const aspect = window.innerWidth / window.innerHeight;
    const near = 0.1;
    const far = 10000;

    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.z = 500;

    const createLights = () => {
      const sunLight = new THREE.PointLight(0xffffff, 0.5);
      sunLight.position.set(0, 300, 600);
      sunLight.color.convertSRGBToLinear();

      const ambientLight = new THREE.AmbientLight(0xe5d5d5);
      ambientLight.intensity = 0.6;

      scene.add(sunLight, ambientLight);
    };

    let particleSystem;
    const createBubbles = () => {
      const particles = new THREE.CircleGeometry(0.5, 50);
      for (let p = 0; p < 1000; p++) {
        const particle = new THREE.Vector3(
          Math.random() * 1000 - 250,
          Math.random() * 3100 - 500,
          Math.random() * 3000 - 500
        );

        particles.vertices.push(particle);
      }

      const particleMaterial = new THREE.ParticleBasicMaterial({
        color: 0xffffff,
        size: 5,
        map: THREE.ImageUtils.loadTexture("./assets/particle.png"),
        blending: THREE.AdditiveBlending,
        transparent: true,
        opacity: 0.7
      });
      particleSystem = new THREE.Points(particles, particleMaterial);

      scene.add(particleSystem);
    };

    let particleSystem2;
    const createParticles = () => {
      const particles = new THREE.CircleGeometry(0.5, 50);
      for (let p = 0; p < 1000; p++) {
        const particle = new THREE.Vector3(
          Math.random() * 1000 - 250,
          Math.random() * 3100 - 500,
          Math.random() * 3000 - 500
        );

        particles.vertices.push(particle);
      }

      const particleMaterial = new THREE.ParticleBasicMaterial({
        color: 0xffffff,
        size: 1,
        blending: THREE.AdditiveBlending,
        transparent: true,
        opacity: 0.5
      });
      particleSystem2 = new THREE.Points(particles, particleMaterial);

      scene.add(particleSystem2);
    };

    class Sea {
      constructor() {
        const geom = new THREE.PlaneGeometry(
          window.innerWidth + 200,
          200,
          15,
          8
        );

        geom.translate(0, -100, 0);

        const mat = new THREE.ShaderMaterial({
          uniforms: {
            color1: {
              value: new THREE.Color(0x002722)
            },
            color2: {
              value: new THREE.Color(0x316960)
            }
          },
          vertexShader: `
            varying vec2 vUv;

            void main() {
              vUv = uv;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
            }
          `,
          fragmentShader: `
            uniform vec3 color1;
            uniform vec3 color2;

            varying vec2 vUv;

            void main() {

              gl_FragColor = vec4(mix(color1, color2, vUv.y), 1.0);
            }
          `
        });

        this.mesh = new THREE.Mesh(geom, mat);
        this.mesh.castShadow = true;
        this.mesh.name = "Sea";
      }
    }

    class Light {
      constructor(w, h, x, y, z, opacity) {
        const geom = new THREE.PlaneGeometry(w, h, 15, 15);
        geom.translate(x, y, z);

        const texture = new THREE.TextureLoader().load(
          "./assets/lightstreak.png"
        );

        const mat = new THREE.MeshPhongMaterial({
          map: texture,
          transparent: true,
          opacity: opacity
        });

        this.mesh = new THREE.Mesh(geom, mat);
        this.mesh.name = "Light";
      }
    }

    class SeaWater {
      constructor() {
        const geom = new THREE.PlaneGeometry(
          window.innerWidth + 1000,
          2000,
          6,
          6
        );

        geom.translate(0, window.innerHeight / 2 - 1000, -300);
        geom.computeBoundingBox();

        const mat = new THREE.ShaderMaterial({
          uniforms: {
            color1: {
              value: new THREE.Color(0x181818)
            },
            color2: {
              value: new THREE.Color(0x316960)
            },
            bboxMin: {
              value: geom.boundingBox.min
            },
            bboxMax: {
              value: geom.boundingBox.max
            }
          },
          vertexShader: `
            uniform vec3 bboxMin;
            uniform vec3 bboxMax;

            varying vec2 vUv;

            void main() {
              vUv.y = (position.y - bboxMin.y) / (bboxMax.y - bboxMin.y);
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
            }
          `,
          fragmentShader: `
            uniform vec3 color1;
            uniform vec3 color2;

            varying vec2 vUv;

            void main() {

              gl_FragColor = vec4(mix(color1, color2, vUv.y), 1.0);
            }
          `
        });

        this.mesh = new THREE.Mesh(geom, mat);
        this.mesh.name = "Seawater";
      }
    }

    let sea, sky, seawater, light1, light2, light3, light4, group;
    const createHorizon = () => {
      sea = new Sea();
      sea.mesh.position.y = 10;
      sea.mesh.rotateX(-Math.PI / 4);

      sky = new Sky();

      seawater = new SeaWater();

      light1 = new Light(500, 500, 0, -60, -100, 0.16);
      light2 = new Light(500, 500, -100, -100, -100, 0.15);
      light3 = new Light(500, 500, 250, -190, -100, 0.18);
      light4 = new Light(500, 500, -250, -150, -100, 0.2);

      group = new THREE.Group();

      const mtlLoader = new MTLLoader();

      let boot;
      mtlLoader.load("./assets/boot2.mtl", function(materials) {
        materials.preload();

        const loaderObj = new OBJLoader();

        loaderObj.setMaterials(materials).load(
          "./assets/boot2.obj",

          function(object) {
            boot = object;

            boot.rotateX(Math.PI / 8);
            boot.position.z = 100;
            boot.position.y = -60;
            boot.position.x = -50;
            group.add(boot);
          }
        );
      });

      group.add(seawater.mesh);
      group.add(sea.mesh);
      group.add(sky.mesh);
      group.add(light1.mesh);
      group.add(light2.mesh);
      group.add(light3.mesh);
      group.add(light4.mesh);

      group.position.y = 2000;
      scene.add(group);
    };

    class Sky {
      constructor() {
        const geom = new THREE.PlaneGeometry(
          window.innerWidth + 200,
          window.innerHeight,
          6,
          6
        );

        geom.translate(0, window.innerHeight / 2, -50);

        const texture = new THREE.TextureLoader().load(
          "./assets/horizon-sky.jpg"
        );

        const mat = new THREE.MeshPhongMaterial({
          side: THREE.DoubleSide,
          map: texture,
          transparent: true
        });

        this.mesh = new THREE.Mesh(geom, mat);
        this.mesh.name = "Sky";
      }
    }

    class Card {
      constructor(x, image) {
        const geom = new THREE.PlaneGeometry(150, 90, 6, 6);
        geom.translate(x, 0, 0);

        const texture = new THREE.TextureLoader().load(image);

        const mat = new THREE.MeshPhongMaterial({
          shininess: 20,
          side: THREE.DoubleSide,
          map: texture
        });

        this.mesh = new THREE.Mesh(geom, mat);
        this.mesh.name = "card";
      }
    }

    class Chinese {
      constructor(x, y, xx, yy, image) {
        const geom = new THREE.PlaneGeometry(x, y, 6, 6);
        geom.translate(xx, yy, 10);

        const texture = new THREE.TextureLoader().load(image);

        const mat = new THREE.MeshPhongMaterial({
          side: THREE.DoubleSide,
          map: texture,
          transparent: true
        });

        this.mesh = new THREE.Mesh(geom, mat);
      }
    }

    class Year {
      constructor(x, y, xx, yy, image) {
        const geom = new THREE.PlaneGeometry(x, y, 6, 6);
        geom.translate(xx, yy, 0);

        const texture = new THREE.TextureLoader().load(image);

        const mat = new THREE.MeshPhongMaterial({
          side: THREE.DoubleSide,
          map: texture,
          transparent: true
        });

        this.mesh = new THREE.Mesh(geom, mat);
      }
    }

    let l;
    class PlanesStory {
      constructor(font, font2, nostalgie) {
        this.mesh = new THREE.Object3D();

        const vector = new THREE.Vector3();
        const vector2 = new THREE.Vector3();
        const vector3 = new THREE.Vector3();
        const vector4 = new THREE.Vector3();
        const vector5 = new THREE.Vector3();

        nostalgie.forEach((item, i) => {
          if (item.cardType === 1) {
            const theta = i * 2 + Math.PI;
            const y = i * 250;
            const p = new Card(item.cardAlign, item.image);
            p.mesh.position.setFromCylindricalCoords(200, theta, y);
            vector.x = p.mesh.position.x * 2;
            vector.y = p.mesh.position.y;
            vector.z = p.mesh.position.z * 2;
            p.mesh.lookAt(vector);
            p.mesh.rotateX(-Math.PI / 8);
            p.mesh.rotateZ(Math.PI / 30);
            const message = item.titel;
            const shapes = font.generateShapes(message, item.fontSize);
            const geometry = new THREE.ShapeBufferGeometry(shapes);
            geometry.computeBoundingBox();
            const xMid =
              -0.5 * (geometry.boundingBox.max.x - geometry.boundingBox.min.x);
            geometry.translate(xMid - item.titelAlign, -30, 10);
            const matLite = new THREE.MeshBasicMaterial({
              color: 0xffffff,
              transparent: true,
              side: THREE.DoubleSide
            });
            const text = new THREE.Mesh(geometry, matLite);
            text.position.setFromCylindricalCoords(220, theta, y);
            vector2.x = text.position.x * 2;
            vector2.y = text.position.y;
            vector2.z = text.position.z * 2;
            text.lookAt(vector2);
            //chinese
            const c = new Chinese(70, 18, 60, -20, item.texture2);
            c.mesh.position.setFromCylindricalCoords(210, theta, y);
            vector3.x = c.mesh.position.x * 2;
            vector3.y = c.mesh.position.y;
            vector3.z = c.mesh.position.z * 2;
            c.mesh.lookAt(vector3);
            //year
            l = new Year(60, 60, -70, 20, item.texture1);
            l.mesh.position.setFromCylindricalCoords(240, theta, y);
            vector4.x = l.mesh.position.x * 2;
            vector4.y = l.mesh.position.y;
            vector4.z = l.mesh.position.z * 2;
            l.mesh.lookAt(vector4);

            this.mesh.add(p.mesh);
            this.mesh.add(text);
            this.mesh.add(c.mesh);
            this.mesh.add(l.mesh);
          } else if (item.cardType === 2) {
            const theta = i * 2 + Math.PI;
            const y = i * 250;
            const p = new Card(item.cardAlign, item.image);
            p.mesh.position.setFromCylindricalCoords(200, theta, y);
            vector.x = p.mesh.position.x * 2;
            vector.y = p.mesh.position.y;
            vector.z = p.mesh.position.z * 2;
            p.mesh.lookAt(vector);
            p.mesh.rotateX(-Math.PI / 8);
            p.mesh.rotateZ(-Math.PI / 30);
            const message = item.titel;
            const shapes = font.generateShapes(message, item.fontSize);
            const geometry = new THREE.ShapeBufferGeometry(shapes);
            geometry.computeBoundingBox();
            const xMid =
              -0.5 * (geometry.boundingBox.max.x - geometry.boundingBox.min.x);
            geometry.translate(xMid - item.titelAlign, 10, 10);
            const matLite = new THREE.MeshBasicMaterial({
              color: 0xffffff,
              transparent: true,
              side: THREE.DoubleSide
            });
            const text = new THREE.Mesh(geometry, matLite);
            text.position.setFromCylindricalCoords(220, theta, y);
            vector2.x = text.position.x * 2;
            vector2.y = text.position.y;
            vector2.z = text.position.z * 2;
            text.lookAt(vector2);
            //chinese
            const c = new Chinese(50, 50, -90, 2, item.texture2);
            c.mesh.position.setFromCylindricalCoords(210, theta, y);
            vector3.x = c.mesh.position.x * 2;
            vector3.y = c.mesh.position.y;
            vector3.z = c.mesh.position.z * 2;
            c.mesh.lookAt(vector3);
            //year
            const k = new Year(60, 40, 80, -50, item.texture1);
            k.mesh.position.setFromCylindricalCoords(240, theta, y);
            vector4.x = k.mesh.position.x * 2;
            vector4.y = k.mesh.position.y;
            vector4.z = k.mesh.position.z * 2;
            k.mesh.lookAt(vector4);
            this.mesh.add(p.mesh);
            this.mesh.add(text);
            this.mesh.add(c.mesh);
            this.mesh.add(k.mesh);
          } else if (item.cardType === 3) {
            const theta = i * 2 + Math.PI;
            const y = i * 250;
            const p = new Card(item.cardAlign, item.image);
            p.mesh.position.setFromCylindricalCoords(200, theta, y);
            vector.x = p.mesh.position.x * 2;
            vector.y = p.mesh.position.y;
            vector.z = p.mesh.position.z * 2;
            p.mesh.lookAt(vector);
            p.mesh.rotateX(-Math.PI / 16);
            p.mesh.rotateY(-Math.PI / 8);
            const message = item.titel;
            const shapes = font.generateShapes(message, item.fontSize);
            const geometry = new THREE.ShapeBufferGeometry(shapes);
            geometry.computeBoundingBox();
            const xMid =
              -0.5 * (geometry.boundingBox.max.x - geometry.boundingBox.min.x);
            geometry.translate(xMid - item.titelAlign, 10, 10);
            const matLite = new THREE.MeshBasicMaterial({
              color: 0xffffff,
              transparent: true,
              side: THREE.DoubleSide
            });
            const text = new THREE.Mesh(geometry, matLite);
            text.position.setFromCylindricalCoords(220, theta, y);
            vector2.x = text.position.x * 2;
            vector2.y = text.position.y;
            vector2.z = text.position.z * 2;
            text.lookAt(vector2);

            //bijtext
            const message2 = item.tussentitel;
            const shapes2 = font2.generateShapes(message2, item.fontSize2);
            const geometry2 = new THREE.ShapeBufferGeometry(shapes2);
            geometry2.computeBoundingBox();
            const xMid2 =
              -0.5 *
              (geometry2.boundingBox.max.x - geometry2.boundingBox.min.x);
            geometry2.translate(xMid2 - item.titelAlign2, -25, 10);
            const matLite2 = new THREE.MeshBasicMaterial({
              color: 0xffffff,
              transparent: true,
              side: THREE.DoubleSide
            });
            const text2 = new THREE.Mesh(geometry2, matLite2);
            text2.position.setFromCylindricalCoords(220, theta, y);
            vector5.x = text2.position.x * 2;
            vector5.y = text2.position.y;
            vector5.z = text2.position.z * 2;
            text2.lookAt(vector2);

            //chinese
            const c = new Chinese(70, 18, 70, 20, item.texture2);
            c.mesh.position.setFromCylindricalCoords(210, theta, y);
            vector3.x = c.mesh.position.x * 2;
            vector3.y = c.mesh.position.y;
            vector3.z = c.mesh.position.z * 2;
            c.mesh.lookAt(vector3);

            //year
            l = new Year(60, 60, -80, -40, item.texture1);
            l.mesh.position.setFromCylindricalCoords(240, theta, y);
            vector4.x = l.mesh.position.x * 2;
            vector4.y = l.mesh.position.y;
            vector4.z = l.mesh.position.z * 2;
            l.mesh.lookAt(vector4);

            this.mesh.add(p.mesh);
            this.mesh.add(text);
            this.mesh.add(text2);
            this.mesh.add(c.mesh);
            this.mesh.add(l.mesh);
          }
        });
      }
    }

    let planesStory;
    const createPlanesStory = (font, font2, nostalgie) => {
      planesStory = new PlanesStory(font, font2, nostalgie);
      planesStory.mesh.rotation.y = Math.PI;

      scene.add(planesStory.mesh);
    };

    const makeRoughGround = (mesh, amp) => {
      mesh.geometry.vertices.forEach(function(vertex) {
        const time = Date.now();
        const distance =
          noise.noise2D(vertex.x + time * 0.0003, vertex.y + time * 0.0001) *
          amp;
        vertex.z = distance;
      });
      mesh.geometry.verticesNeedUpdate = true;
      mesh.geometry.normalsNeedUpdate = true;
      mesh.geometry.computeVertexNormals();
      mesh.geometry.computeFaceNormals();
    };

    const resizeRendererToDisplaySize = renderer => {
      const canvas = renderer.domElement;
      const pixelRatio = window.devicePixelRatio;
      const width = (canvas.clientWidth * pixelRatio) | 0;
      const height = (canvas.clientHeight * pixelRatio) | 0;
      const needResize = canvas.width !== width || canvas.height !== height;
      if (needResize) {
        renderer.setSize(width, height, false);
      }
      return needResize;
    };

    const render = () => {
      if (resizeRendererToDisplaySize(renderer)) {
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
      }

      if (planesStory) {
        planesStory.mesh.children.forEach(child => {
          if (child.name === "card") {
            makeRoughGround(child, 8);
          }
        });
      }

      makeRoughGround(sea.mesh, 12);

      renderer.render(scene, camera);
      renderer.setClearColor(0x000000, 0);
      renderer.shadowMap.enabled;
      renderer.gammaFactor = 2.2;
      renderer.gammaOutPut = true;

      TWEEN.update();

      requestAnimationFrame(render);
    };
    requestAnimationFrame(render);

    const init = () => {
      createLights();

      const url = `./assets/data/${naam}.json`;

      fetch(url)
        .then(r => r.json())
        .then(jsonData => {
          const loader = new THREE.FontLoader();
          loader.load("./assets/fonts/made_italic.json", function(madeitalic) {
            loader.load("./assets/fonts/sfprodisplay.json", function(
              sfprodisplay
            ) {
              createPlanesStory(madeitalic, sfprodisplay, jsonData.nostalgie);
              planesStory.mesh.position.y = 1000;
              planesStory.mesh.rotation.y = 4 + Math.PI;

              new TWEEN.Tween(planesStory.mesh.position)
                .to(
                  {
                    x: 0,
                    y: 0,
                    z: 0
                  },
                  2000
                )
                .easing(TWEEN.Easing.Cubic.InOut)
                .start();

              new TWEEN.Tween(planesStory.mesh.rotation)
                .to(
                  {
                    x: 0,
                    y: Math.PI,
                    z: 0
                  },
                  2000
                )
                .easing(TWEEN.Easing.Cubic.InOut)
                .start();
            });
          });
        });

      createHorizon();
      createBubbles();
      createParticles();

      const $upBtn = document.querySelector(`.btnup`);
      const $downBtn = document.querySelector(`.btndown`);

      if (!$upBtn && !$downBtn && !planesStory) {
        return;
      }

      let count = 0;
      let count3 = 1600;
      let count2 = 1;
      let angle = 0;
      let angle2 = 0;
      $upBtn.addEventListener(
        "click",
        function() {
          count -= 250;
          new TWEEN.Tween(planesStory.mesh.position)
            .to(
              {
                x: 0,
                y: count,
                z: 0
              },
              2000
            )
            .easing(TWEEN.Easing.Cubic.InOut)
            .onUpdate(() => {
              if (count2 === 12) {
                disableControls();
              }
            })
            .onComplete(() => {
              if (count2 === 12) {
                enableNotification();
              }
            })
            .start();

          angle = count2 * 2 + Math.PI;

          count2 += 1;
          new TWEEN.Tween(planesStory.mesh.rotation)
            .to(
              {
                x: 0,
                y: -angle,
                z: 0
              },
              2000
            )
            .easing(TWEEN.Easing.Cubic.InOut)
            .start();

          count3 -= 150;

          new TWEEN.Tween(group.position)
            .to(
              {
                x: 0,
                y: count3,
                z: 0
              },
              2000
            )
            .easing(TWEEN.Easing.Cubic.InOut)
            .start();

          new TWEEN.Tween(particleSystem.position)
            .to(
              {
                x: 0,
                y: count,
                z: 0
              },
              2000
            )
            .easing(TWEEN.Easing.Cubic.InOut)
            .start();

          new TWEEN.Tween(particleSystem2.position)
            .to(
              {
                x: 0,
                y: count,
                z: 0
              },
              2000
            )
            .easing(TWEEN.Easing.Cubic.InOut)
            .start();
        },
        true
      );

      $downBtn.addEventListener(
        "click",
        function() {
          if (count2 >= 2) {
            count += 250;
            new TWEEN.Tween(planesStory.mesh.position)
              .to(
                {
                  x: 0,
                  y: count,
                  z: 0
                },
                2000
              )
              .easing(TWEEN.Easing.Cubic.InOut)
              .start();

            count2 -= 1;
            angle = (12 - count2) * 2 - Math.PI + Math.PI;

            new TWEEN.Tween(planesStory.mesh.rotation)
              .to(
                {
                  x: 0,
                  y: angle,
                  z: 0
                },
                2000
              )
              .easing(TWEEN.Easing.Cubic.InOut)
              .start();

            count3 += 150;
            new TWEEN.Tween(group.position)
              .to(
                {
                  x: 0,
                  y: count3,
                  z: 0
                },
                2000
              )
              .easing(TWEEN.Easing.Cubic.InOut)
              .start();

            new TWEEN.Tween(particleSystem.position)
              .to(
                {
                  x: 0,
                  y: count,
                  z: 0
                },
                2000
              )
              .easing(TWEEN.Easing.Cubic.InOut)
              .start();

            new TWEEN.Tween(particleSystem2.position)
              .to(
                {
                  x: 0,
                  y: count,
                  z: 0
                },
                2000
              )
              .easing(TWEEN.Easing.Cubic.InOut)
              .start();
          } else {
            return;
          }
        },
        true
      );

      render();
    };
    init();
  };

  //threejs animation

  const waterAnimation = canvas => {
    const scene = new THREE.Scene();
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });

    const fov = 75;
    const aspect = window.innerWidth / window.innerHeight;
    const near = 0.1;
    const far = 10000;

    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.z = 500;

    const createLights = () => {
      const sunLight = new THREE.PointLight(0xffffff, 0.5);
      sunLight.position.set(0, 300, 600);
      sunLight.color.convertSRGBToLinear();

      const ambientLight = new THREE.AmbientLight(0xe5d5d5);
      ambientLight.intensity = 0.6;

      scene.add(sunLight, ambientLight);
    };

    class Sea {
      constructor() {
        const geom = new THREE.PlaneGeometry(
          window.innerWidth + 200,
          200,
          15,
          8
        );

        const mat = new THREE.ShaderMaterial({
          uniforms: {
            color1: {
              value: new THREE.Color(0x226965)
            },
            color2: {
              value: new THREE.Color(0xb1a6a4)
            }
          },
          vertexShader: `
            varying vec2 vUv;

            void main() {
              vUv = uv;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
            }
          `,
          fragmentShader: `
            uniform vec3 color1;
            uniform vec3 color2;

            varying vec2 vUv;

            void main() {

              gl_FragColor = vec4(mix(color1, color2, vUv.y), 1.0);
            }
          `
        });

        this.mesh = new THREE.Mesh(geom, mat);
        this.mesh.castShadow = true;
        this.mesh.name = "Sea";
      }
    }

    class Light {
      constructor(w, h, x, y, z, opacity) {
        const geom = new THREE.PlaneGeometry(w, h, 15, 15);
        geom.translate(x, y, z);

        const texture = new THREE.TextureLoader().load(
          "./assets/lightstreak.png"
        );

        const mat = new THREE.MeshPhongMaterial({
          map: texture,
          transparent: true,
          opacity: opacity
        });

        this.mesh = new THREE.Mesh(geom, mat);
        this.mesh.name = "Light";
      }
    }

    class SeaWater {
      constructor() {
        const geom = new THREE.PlaneGeometry(
          window.innerWidth + 1000,
          1000,
          6,
          6
        );

        geom.translate(0, -430, -100);
        geom.computeBoundingBox();

        const mat = new THREE.ShaderMaterial({
          uniforms: {
            color1: {
              value: new THREE.Color(0x181818)
            },
            color2: {
              value: new THREE.Color(0x7dd6c0)
            },
            bboxMin: {
              value: geom.boundingBox.min
            },
            bboxMax: {
              value: geom.boundingBox.max
            }
          },
          vertexShader: `
            uniform vec3 bboxMin;
            uniform vec3 bboxMax;

            varying vec2 vUv;

            void main() {
              vUv.y = (position.y - bboxMin.y) / (bboxMax.y - bboxMin.y);
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
            }
          `,
          fragmentShader: `
            uniform vec3 color1;
            uniform vec3 color2;

            varying vec2 vUv;

            void main() {

              gl_FragColor = vec4(mix(color1, color2, vUv.y), 0.1);
            }
          `
        });

        this.mesh = new THREE.Mesh(geom, mat);
        this.mesh.name = "Seawater";
      }
    }

    let sea, seawater, light1, light2, light3, light4, group;
    const createHorizon = () => {
      sea = new Sea();
      sea.mesh.rotateX(-Math.PI / 4);

      seawater = new SeaWater();

      light1 = new Light(500, 500, 0, -60, -100, 0.4);
      light2 = new Light(500, 500, -100, -100, -100, 0.45);
      light3 = new Light(500, 500, 250, -190, -100, 0.48);
      light4 = new Light(500, 500, -250, -150, -100, 0.42);

      group = new THREE.Group();

      const mtlLoader = new MTLLoader();

      let boot;
      mtlLoader.load("./assets/boot2.mtl", function(materials) {
        materials.preload();

        const loaderObj = new OBJLoader();

        loaderObj.setMaterials(materials).load(
          "./assets/boot2.obj",

          function(object) {
            boot = object;

            boot.rotateX(Math.PI / 8);
            boot.position.z = 60;
            boot.position.y = -30;
            boot.position.x = -50;
            group.add(boot);
          }
        );
      });

      group.add(seawater.mesh);
      group.add(sea.mesh);
      group.add(light1.mesh);
      group.add(light2.mesh);
      group.add(light3.mesh);
      group.add(light4.mesh);

      group.position.y = -canvas.clientHeight / 2 - 500;

      scene.add(group);
    };

    const makeRoughGround = (mesh, amp) => {
      mesh.geometry.vertices.forEach(function(vertex) {
        const time = Date.now();
        const distance =
          noise.noise2D(vertex.x + time * 0.0003, vertex.y + time * 0.0001) *
          amp;
        vertex.z = distance;
      });
      mesh.geometry.verticesNeedUpdate = true;
      mesh.geometry.normalsNeedUpdate = true;
      mesh.geometry.computeVertexNormals();
      mesh.geometry.computeFaceNormals();
    };

    const resizeRendererToDisplaySize = renderer => {
      const canvas = renderer.domElement;
      const pixelRatio = window.devicePixelRatio;
      const width = (canvas.clientWidth * pixelRatio) | 0;
      const height = (canvas.clientHeight * pixelRatio) | 0;
      const needResize = canvas.width !== width || canvas.height !== height;
      if (needResize) {
        renderer.setSize(width, height, false);
      }
      return needResize;
    };

    const render = () => {
      if (resizeRendererToDisplaySize(renderer)) {
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
      }

      makeRoughGround(sea.mesh, 20);

      renderer.render(scene, camera);
      renderer.setClearColor(0x000000, 0);
      renderer.shadowMap.enabled;
      renderer.gammaFactor = 2.2;
      renderer.gammaOutPut = true;

      TWEEN.update();

      requestAnimationFrame(render);
    };
    requestAnimationFrame(render);

    const init = () => {
      createLights();
      createHorizon();

      new TWEEN.Tween(group.position)
        .to(
          {
            x: 0,
            y: canvas.clientHeight + 800,
            z: 0
          },
          8000
        )
        .easing(TWEEN.Easing.Cubic.InOut)
        .onComplete(() => {
          water.pause();
          addNostalgia();
        })
        .start();

      render();
    };
    init();
  };

  let water;
  const transitionAnimation = () => {
    const $answerList = document.querySelector(`.answers_list`);
    $answerList.classList.add(`hide`);

    const $dialoogscroll = document.querySelector(`.dialoog_scroll`);
    $dialoogscroll.classList.add(`no_pointerevents`);

    const $fullstoryScroll = document.querySelector(`.fullstory_scroll`);
    const $div = document.createElement(`div`);
    $div.classList.add(`threecanvas`);
    $canvas2.id = `d`;

    $div.appendChild($canvas2);
    $fullstoryScroll.appendChild($div);

    //animatiecode
    setTimeout(() => {
      water = new Audio("./assets/sounds/water_flow.mp3");
      water.play();
      waterAnimation($canvas2);

      const $desktopMobileinside = document.querySelector(
        `.desktop_mobileinside`
      );
      const fade = TweenLite.to($desktopMobileinside, 1, { opacity: 0 });
      fade.duration(6);
    }, 2000);
  };

  let audio;
  const addNostalgia = () => {
    const $fullstoryScroll = document.querySelector(`.fullstory_scroll`);
    const $threecanvas = document.querySelector(`.threecanvas`);

    $fullstoryScroll.removeChild($threecanvas);

    const $main = document.querySelector(`.fullstory`);

    const $maindiv = document.createElement(`div`);
    $maindiv.classList.add(`fullstory_grid`);

    const $div = document.createElement(`div`);
    const $div2 = document.createElement(`div`);
    const $div3 = document.createElement(`div`);
    $div3.classList.add(`horizon_img`);
    const $img = document.createElement(`img`);
    $img.src = `./assets/horizon-sky.jpg`;
    $img.classList.add(`img_responsive`);
    $div.classList.add(`gradient`);
    $div2.classList.add(`threecanvas`);
    $canvas.id = `c`;

    $maindiv.appendChild($div);

    if ($main) {
      $main.appendChild($maindiv);
    }

    $div2.appendChild($canvas);

    if ($maindiv) {
      $maindiv.appendChild($div2);
    }

    scrollToBottomStory();

    const $swipe = document.createElement(`div`);
    $swipe.classList.add(`swipe`);
    const $swipeText = document.createElement(`p`);
    $swipeText.innerHTML = `Swipe</br><span>down</span>`;
    $swipe.appendChild($swipeText);

    const $parent2 = document.querySelector(`.fullstory_scroll`);
    $parent2.appendChild($swipe);

    const $chat = document.querySelector(".main_grid");

    window.addEventListener(
      "scroll",
      function() {
        if ($chat) {
          const bounding = $chat.getBoundingClientRect();
          if (bounding.y >= window.innerHeight) {
            $chat.classList.add("hide");
            $parent2.removeChild($swipe);
            enableControls();
            mainThreejs($canvas);

            audio = new Audio("./assets/sounds/voiceover.mp3");
            audio.play();
            audio.loop = true;
          }
        }
      },
      true
    );
  };

  const enableControls = () => {
    const $fullstory = document.querySelector(".fullstory");
    const $div = document.createElement(`div`);
    $div.classList.add("controls");
    const $btnUp = document.createElement(`button`);
    $btnUp.classList.add("btndown");
    const $btnDown = document.createElement(`button`);
    $btnDown.classList.add("btnup");

    $div.appendChild($btnUp);
    $div.appendChild($btnDown);
    if ($fullstory) {
      $fullstory.appendChild($div);
    }
  };

  const enableNotification = () => {
    audio.pause();

    const url = `./assets/data/${naam}.json`;
    fetch(url)
      .then(r => r.json())
      .then(jsonData => {
        const $fullstory = document.querySelector(".fullstory");
        const $div = document.createElement(`div`);
        $div.classList.add("notification");
        const $btnnotification = document.createElement(`div`);
        $btnnotification.classList.add("notificationbtn");

        const $extrainfo = document.createElement(`div`);
        $extrainfo.classList.add(`extra_info`);
        const $time = document.createElement(`div`);
        $time.classList.add(`time_indicator`);
        const today = new Date();
        const h = today.getHours();
        const m = String(today.getMinutes()).padStart(2, "0");
        console.log(m);

        $time.innerHTML = `${h}:${m}`;

        const $meta = document.createElement(`div`);
        $meta.classList.add(`meta`);
        const $titel = document.createElement(`h3`);
        $titel.classList.add(`notification_titel`);
        $titel.innerHTML = `${jsonData.character} heeft je een bericht gestuurd`;
        const $bijtext = document.createElement(`p`);
        $bijtext.classList.add(`notification_text`);
        $bijtext.innerHTML = `Druk om te openen`;

        const $img = document.createElement(`img`);
        $img.classList.add(`img_responsive`);
        $img.classList.add(`story_img`);
        $img.src = jsonData.image_profile;

        $div.appendChild($btnnotification);
        $btnnotification.addEventListener("click", () => {
          chatGame();
        });
        $btnnotification.appendChild($img);
        $btnnotification.appendChild($meta);
        $meta.appendChild($titel);
        $meta.appendChild($bijtext);
        $btnnotification.appendChild($extrainfo);
        $extrainfo.appendChild($time);
        if ($fullstory) {
          setTimeout(() => {
            console.log("notification");
            $fullstory.appendChild($div);
            const sound = new Audio("./assets/sounds/notification.mp3");
            sound.play();
          }, 2500);
        }
      });
  };

  const disableControls = () => {
    const $fullstory = document.querySelector(".fullstory");
    const $div = document.querySelector(`.controls`);

    if ($fullstory && $div) {
      $fullstory.removeChild($div);
    }
  };

  const chatGame = () => {
    const $fullstory = document.querySelector(`.fullstory`);
    const $fullstoryscroll = document.querySelector(`.fullstory_scroll`);
    const $chat = document.querySelector(".main_grid");

    const $desktopMobileinside = document.querySelector(
      `.desktop_mobileinside`
    );

    $desktopMobileinside.style.opacity = 1;

    if ($fullstory && $fullstoryscroll) {
      $fullstoryscroll.removeChild($fullstory);
    }

    if ($chat) {
      $chat.classList.remove("hide");
    }

    const url = `./assets/data/${naam}.json`;

    fetch(url)
      .then(r => r.json())
      .then(jsonData => {
        parseGameStory(jsonData);
      });
  };

  const parseGameStory = data => {
    if (!$chatbox) {
      return;
    }
    const $dialoogscroll = document.querySelector(`.dialoog_scroll`);
    if ($dialoogscroll) {
      $dialoogscroll.classList.remove(`no_pointerevents`);
    }
    if ($answerlist) {
      $answerlist.classList.add("hide");
    }
    $answerbox.innerHTML = ``;
    storyGame = data.scenarios.scenario_2;

    storyGame.premise.forEach(premise => {
      setTimeout(() => {
        const $loader = messageLoading(premise.character);
        $chatbox.appendChild($loader);
        setHeightChat();
        setTimeout(() => {
          $chatbox.removeChild($loader);
          const $message = createMessage(premise);
          $chatbox.appendChild($message);
          setHeightChat();
        }, 2500);
      }, premise.delay);
    });

    setTimeout(() => {
      setHeightChat();
    }, 10000);

    Cookies.set("emma", "emma", { expires: 7 });
  };

  const init = () => {
    if (Cookies.get("landingvisited") === undefined) {
      window.location.href = "index.php?page=landing";
      Cookies.set("landingvisited", "landingvisited", { expires: 7 });
    }

    const url2 = `./assets/data/${naam}.json`;

    fetch(url2)
      .then(r => r.json())
      .then(jsonData => {
        parseStory(jsonData);
      });

    const url = `./assets/data/stories.json`;
    fetch(url)
      .then(r => r.json())
      .then(jsonData => {
        parse(jsonData);
      })
      .then(() => {
        setTimeout(() => {
          const elem = document.querySelector(".main-carousel");
          if (elem) {
            new Flickity(elem, {
              // options
              cellAlign: "left",
              draggable: true,
              prevNextButtons: false,
              pageDots: false,
              resize: true
            });
          }
        }, 100);
      });

    const landing = document.querySelector(".landing-carousel");
    if (landing) {
      const landingflicky = new Flickity(landing, {
        // options
        cellAlign: "center",
        draggable: true,
        prevNextButtons: false,
        pageDots: true
      });

      landingflicky.on("change", function(index) {
        const $landingBottom = document.querySelector(".landing_bottom");
        if ($landingBottom) {
          const $landingbtn = document.createElement("a");
          $landingbtn.classList.add("landingbtn");
          $landingbtn.textContent = "Got it!";
          $landingbtn.href = "index.php";

          if (index === 2) {
            $landingBottom.appendChild($landingbtn);
          } else {
            return;
          }
        }
      });
    }

    createIntro();
    // addNostalgia();
    // enableControls();
    // mainThreejs($canvas);

    const $gameContainer = document.querySelector(".game_container");

    if ($gameContainer && window.location.href.indexOf("gamezeilen") > -1) {
      new Game1();
    }

    if ($gameContainer && window.location.href.indexOf("gamefietsen") > -1) {
      new Game2();
    }
  };

  init();
}
