import { Entity } from "./entities.js";
import { Enemy } from "./entities.js";
import { Goat } from "./entities.js";

let canvas;
let context;
let backgroundMusic;
// background music https://opengameart.org/content/pleasant-creek
// shear music https://stan.store/SoundCentral
// to assign value to variable
// please allow audio to be played
let fpsInterval = 1000 / 30;
let now;
let sound;
let then = Date.now();
let lastDirectionChange = Date.now();

let player = new Entity("Player");
function drawBoxes() {
  for (let enemy of enemies) {
    context.strokeStyle = "red";
    context.strokeRect(enemy.x, enemy.y, enemy.width * 2, enemy.height * 2);
  }
  for (let goat of goats) {
    context.strokeStyle = "red";
    context.strokeRect(goat.x, goat.y, goat.width * 2, goat.height * 2);
  }
  context.strokeStyle = "red";
  context.strokeRect(player.x, player.y, player.width * 2, player.height * 2);
  for (let r = 0; r < collidables.length; r++) {
    for (let c = 0; c < collidables[0].length; c++) {
      let tile = collidables[r][c];
      if (tile !== -1) {
        let tileX = c * tileSize;
        let tileY = r * tileSize;
        let tileWidth = tileSize;
        let tileHeight = tileSize;
        context.strokeStyle = "red";
        context.strokeRect(tileX, tileY, tileWidth, tileHeight);
      }
    }
  }
}
let playerImage = new Image();
let enemyImage = new Image();
let goatImage = new Image();
let backgroundImage1 = new Image();
let tilesPerRow = 15;
let tilesPerCol = 15;
let tileSize = 32;
let distance;

let num_cols = 40;

let num_rows = 32;

let enemies = [];
let goats = [];

let enemyRunAwaySpeed = 2;
let run_away_radius = 300;
let run_toward_radius = 150;
let goatRunSpeed = 3;
let roundNumber = 1;

let moveLeft = false;
let moveUp = false;
let moveRight = false;
let moveDown = false;
let sheepSheared = 0;
let shearCounter;
let inputEnabled = false;
document.addEventListener("DOMContentLoaded", init, false);

let timer; // Timer in seconds
let timerText;
let timerInterval;
let smallTimer;
let smallTimerText;
let smallTimerInterval;
let request_id;
let MAX_SPEED = 3; // maximum speed for the enemys and goats


let mouseClicked = false;
document.addEventListener("mousedown", function (event) {});
document.addEventListener("mousedown", function (event) {
  if (event.button === 0 && !mouseClicked) {
    mouseClicked = true;
    // code to handle the mouse click
  }
});
document.addEventListener("mouseup", function (event) {
  if (event.button === 0) {
    mouseClicked = false;
  }
});
let volumeSlider = document.getElementById("volumeSlider");
volumeSlider.addEventListener("input", function () {
  backgroundMusic.volume = volumeSlider.value;
});

let layer1 = [
  [
    0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2,
  ],
  [
    15, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16,
    16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16,
    16, 17,
  ],
  [
    15, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16,
    16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16,
    16, 17,
  ],
  [
    15, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16,
    16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16,
    16, 17,
  ],
  [
    15, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16,
    16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16,
    16, 17,
  ],
  [
    15, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16,
    16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16,
    16, 17,
  ],
  [
    15, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16,
    16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16,
    16, 17,
  ],
  [
    15, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16,
    16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16,
    16, 17,
  ],
  [
    15, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16,
    16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16,
    16, 17,
  ],
  [
    15, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16,
    16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16,
    16, 17,
  ],
  [
    15, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16,
    16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16,
    16, 17,
  ],
  [
    15, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16,
    16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16,
    16, 17,
  ],
  [
    15, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16,
    16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16,
    16, 17,
  ],
  [
    15, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16,
    16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16,
    16, 17,
  ],
  [
    15, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16,
    16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16,
    16, 17,
  ],
  [
    15, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16,
    16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16,
    16, 17,
  ],
  [
    15, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16,
    16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16,
    16, 17,
  ],
  [
    15, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16,
    16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16,
    16, 17,
  ],
  [
    15, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16,
    16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16,
    16, 17,
  ],
  [
    15, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16,
    16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16,
    16, 17,
  ],
  [
    15, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16,
    16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16,
    16, 17,
  ],
  [
    15, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16,
    16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16,
    16, 17,
  ],
  [
    15, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16,
    16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16,
    16, 17,
  ],
  [
    15, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16,
    16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16,
    16, 17,
  ],
  [
    15, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16,
    16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16,
    16, 17,
  ],
  [
    15, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16,
    16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16,
    16, 17,
  ],
  [
    15, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16,
    16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16,
    16, 17,
  ],
  [
    15, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16,
    16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16,
    16, 17,
  ],
  [
    15, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16,
    16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16,
    16, 17,
  ],
  [
    15, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16,
    16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16,
    16, 17,
  ],
  [
    15, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16,
    16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16,
    16, 17,
  ],
  [
    30, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31,
    31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31,
    31, 32,
  ],
];
let collidables = [
  [
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1,
  ],
  [
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1,
  ],
  [
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 168, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1,
  ],
  [
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1,
  ],
  [
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1,
  ],
  [
    -1, -1, -1, -1, -1, 168, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1,
  ],
  [
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1,
  ],
  [
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 168, -1,
    -1, -1,
  ],
  [
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1,
  ],
  [
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 168, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1,
  ],
  [
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1,
  ],
  [
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1,
  ],
  [
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1,
  ],
  [
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 168, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1,
  ],
  [
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1,
  ],
  [
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1,
  ],
  [
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1,
  ],
  [
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1,
  ],
  [
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 168, -1,
    -1, -1,
  ],
  [
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 168, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1,
  ],
  [
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1,
  ],
  [
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1,
  ],
  [
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, 168, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1,
  ],
  [
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1,
  ],
  [
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1,
  ],
  [
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 168, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1,
  ],
  [
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1,
  ],
  [
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1,
  ],
  [
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1,
  ],
  [
    -1, -1, 168, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1,
  ],
  [
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1,
  ],
  [
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1,
  ],
];

function init() {
  canvas = document.querySelector("canvas");
  context = canvas.getContext("2d");
  player.x = canvas.width / 2;
  player.y = canvas.height / 2;
  player.centerx = player.x + player.width;
  player.centery = player.y + player.height;
  window.addEventListener("keydown", activate, false);
  window.addEventListener("keyup", deactivate, false);
  generateEnemies();
  generateGoats();
  startSmallTimer();

  console.log(enemies);

  loadSound("../static/shear.mp3");
  // loadBackgroundMusic("../static/background.mp3");
  // fixes a delay if something laads slowly
  load_assets(
    [
      { var: playerImage, url: "../static/player.png" },
      { var: backgroundImage1, url: "../static/farm.png" },
      { var: enemyImage, url: "../static/unsheered.png" },
      { var: goatImage, url: "../static/goat.png" },
    ],
    draw
  );

  // tile set taken from https://hcg-digital-arts.itch.io/farmgarden-tileset
  // sheep sprites taken and edited by me from https://www.spriters-resource.com/pc_computer/stardewvalley/sheet/112098/
}

function drawLines(player, enemy) {
  // // calculate the distance between the player and the enemy
  // let dx = player.centerx - enemy.centerx;
  // let dy = player.centery - enemy.centery;
  // let distance = Math.sqrt(dx * dx + dy * dy);
  // // calculate the angle
  // let angle = Math.atan2(dy, dx) * 180 / Math.PI;
  // // check if the player is within the specified distance
  // if (distance < 300) {
  //   // draw dx and dy
  //   context.beginPath();
  //   context.moveTo(player.centerx, player.centery);
  //   context.lineTo(enemy.centerx, enemy.centery);
  //   context.strokeStyle = "red";
  //   context.lineWidth = 2;
  //   context.stroke();
  //   context.beginPath();
  //   context.arc(player.centerx, player.centery, 5, 0, 2 * Math.PI, false);
  //   context.fillStyle = "red";
  //   context.fill();
  //   context.beginPath();
  //   context.arc(enemy.centerx, enemy.centery, 5, 0, 2 * Math.PI, false);
  //   context.fillStyle = "red";
  //   context.fill();
  //   // draw the distance and angle
  //   context.font = "15px Arial";
  //   context.fillStyle = "red";
  //   context.fillText(`Distance: ${distance.toFixed(2)}`, (player.centerx + enemy.centerx) / 2, (player.centery + enemy.centery) / 2);
  //   context.fillText(`Angle: ${angle.toFixed(2)}`, (player.centerx + enemy.centerx) / 2, (player.centery + enemy.centery) / 2 - 20);
  // }
}

function draw() {
  request_id = window.requestAnimationFrame(draw);

  // console.log(player.x)
  // console.log(player.y)
  // console.log(player.xChange)
  // console.log(player.yChange)
  // console.log(player.centerx)
  // console.log(player.centery)
  console.log(player.isColliding);
  let now = Date.now();
  let elapsed = now - then;
  if (elapsed <= fpsInterval) {
    return;
  }
  then = now - (elapsed % fpsInterval);

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "grey";
  context.fillRect(0, 0, canvas.width, canvas.height);

  drawBackground();
  drawPlayer();
  drawEnemies();
  drawBoxes();
  performPhysics();
  handlePlayerMovement();
  handleEnemyMovement();
  handleGoatMovement();
  updatePlayerPosition();
  endRoundWin();
}

function drawBackground() {
  for (let r = 0; r < 32; r += 1) {
    for (let c = 0; c < 40; c += 1) {
      let tile = layer1[r][c];
      if (tile >= 0) {
        let tileRow = Math.floor(tile / tilesPerRow);
        let tileCol = Math.floor(tile % tilesPerCol);
        context.drawImage(
          backgroundImage1,
          tileCol * tileSize,
          tileRow * tileSize,
          tileSize,
          tileSize,
          c * tileSize,
          r * tileSize,
          tileSize,
          tileSize
        );
      }
    }
  }

  for (let r = 0; r < 32; r += 1) {
    for (let c = 0; c < 40; c += 1) {
      let tile = collidables[r][c];
      if (tile >= 0) {
        let tileRow = Math.floor(tile / tilesPerRow);
        let tileCol = Math.floor(tile % tilesPerCol);
        context.drawImage(
          backgroundImage1,
          tileCol * tileSize,
          tileRow * tileSize,
          tileSize,
          tileSize,
          c * tileSize,
          r * tileSize,
          tileSize,
          tileSize
        );
      }
    }
  }
}

function drawPlayer() {
  context.drawImage(
    playerImage,
    player.frameX * player.width,

    player.frameY * player.height,

    player.width,
    player.height,

    player.x,
    player.y,

    player.width * 2,
    player.height * 2
  );
}

function generateEnemies() {
  for (let i = 0; i < 5; i += 1) {
    let enemy = new Enemy("Enemy" + i);
    do {
      enemy.x = randint(0, canvas.width - enemy.width);

      enemy.y = randint(0, canvas.height - enemy.height);
      enemy.centerx = enemy.x + enemy.width;
      enemy.centery = enemy.y + enemy.height;
    } while (entityCollidesOnSpawn(enemy)); // Ensure enemies don't spawn on other entities

    enemies.push(enemy);
  }
}
function generateGoats() {
  for (let i = 0; i < 2; i += 1) {
    let goat = new Goat("goat" + i);
    do {
      goat.x = randint(0, canvas.width - goat.width);

      goat.y = randint(0, canvas.height - goat.height);
      goat.centerx = goat.x + goat.width;
      goat.centery = goat.y + goat.height;
    } while (entityCollidesOnSpawn(goat)); // Ensure enemies don't spawn on other entities

    goats.push(goat);
  }
}

// function preventGoatCollide() {
//   for (let i = 0; i < goats.length - 1; i++) {
//     for (let j = i + 1; j < goats.length; j++) {
//       if (rectIntersect(goats[i].x, goats[i].y, goats[i].width * 2, goats[i].height * 2, goats[j].x, goats[j].y, goats[j].width * 2, goats[j].height * 2)) {
//         console.log(`goats ${i} and ${j} are colliding!`);
//         let gvCollision = {x: dx, y: dy};
//         let gdistance = Math.sqrt((dx)*(dx) + (dy)*(dy));
//         let gvCollisionNorm = {x: gvCollision.x / gdistance, y: gvCollision.y / gdistance};
//         let gvRelativeVelocity = {x: goats[i].xChange - goats[j].xChange, y: goats[i].yChange - goats[j].yChange};
//         let gspeed = gvRelativeVelocity.x * gvCollisionNorm.x + gvRelativeVelocity.y * gvCollisionNorm.y;

//         if (gspeed < 0) {
//             break;
//         }
//         let impulse = 6 * gspeed / (goats[i].mass + goats[j].mass);
//         goats[i].xChange -= (impulse * goats[j].mass * gvCollisionNorm.x);
//         goats[i].yChange -= (impulse * goats[j].mass * gvCollisionNorm.y);
//         goats[j].xChange += (impulse * goats[i].mass * gvCollisionNorm.x);
//         goats[j].yChange += (impulse * goats[i].mass * gvCollisionNorm.y);
//       }
//     }
//   }
// }

function drawEnemies() {
  for (let enemy of enemies) {
    let info = getInfo(player, enemy);

    if (info.distance < 50 && mouseClicked && enemy.state === false) {
      enemy.image = new Image();
      enemy.image.src = "/static/sheered.png";
      sheepSheared += 1;
      document.getElementById(
        "sheepShearedCounter"
      ).innerHTML = `Sheep Sheared: ${sheepSheared}`;
      enemy.state = true;
      playSoundOnClick();
    }

    context.drawImage(
      enemy.image,
      enemy.frameX * enemy.width,
      enemy.frameY * enemy.height,
      enemy.width,
      enemy.height,
      enemy.x,
      enemy.y,
      enemy.width * 2,
      enemy.height * 2
    );
  }
  for (let goat of goats) {
    context.drawImage(
      goatImage,
      goat.frameX * goat.width,
      goat.frameY * goat.height,
      goat.width,
      goat.height,
      goat.x,
      goat.y,
      goat.width * 2,
      goat.height * 2
    );
  }
}

function getInfo(entity1, entity2) {
  let dx = entity1.centerx - entity2.centerx;
  let dy = entity1.centery - entity2.centery;
  let distance = Math.sqrt(dx * dx + dy * dy);
  let angle = Math.atan2(dy, dx);
  return { distance, dx, dy, angle };
}

function handlePlayerMovement() {
  if (moveLeft) {
    player.xChange -= 0.5;
    player.frameY = 3;
  }
  if (moveRight) {
    player.xChange += 0.5;
    player.frameY = 1;
  }
  if (moveUp) {
    player.yChange -= 0.5;
    player.frameY = 2;
  }
  if (moveDown) {
    player.yChange += 0.5;
    player.frameY = 0;
  }

  // limit player speed
  let speed = Math.sqrt(
    player.xChange * player.xChange + player.yChange * player.yChange
  );
  if (speed > 7) {
    player.xChange = (player.xChange / speed) * 7;
    player.yChange = (player.yChange / speed) * 7;
  }

  if (
    moveLeft ||
    moveRight ||
    ((moveUp || moveDown) && !(moveLeft && moveRight) && !(moveUp && moveDown))
  ) {
    player.frameX = (player.frameX + 1) % 4;
  }
}

function handleEnemyMovement() {
  for (let enemy of enemies) {
    // calculate the distance between the player and the enemy

    let info = getInfo(player, enemy);

    // check if the player is within the run-toward radius

    if (info.distance < run_away_radius) {
      enemy.chased = true
      enemy.angle = info.angle;

      // make the enemy run away from the player

      enemy.xChange = -Math.cos(enemy.angle) * enemyRunAwaySpeed;

      enemy.yChange = -Math.sin(enemy.angle) * enemyRunAwaySpeed;
    } else {
      let now = Date.now();

      if (now - enemy.lastDirectionChange > 5000) {
        // It's been more than 5 seconds since the last direction change for this enemy, so change direction

        enemy.lastDirectionChange = now;
        enemy.move()
      }
    }
    enemy.chased = false;
    if (enemy.xChange > 0.5) {
      enemy.frameY = 1;
    } else if (enemy.xChange < -0.5) {
      enemy.frameY = 3;
    } else if (enemy.yChange > 0.5) {
      enemy.frameY = 0;
    } else if (enemy.yChange < -0.5) {
      enemy.frameY = 2;
    }
    enemy.frameX = (enemy.frameX + 1) % 4;
    updateEnemyPosition(enemy);
  }
}

function limitspeed(entity){
  let speed = Math.sqrt(
    entity.xChange * entity.xChange + entity.yChange * entity.yChange
  );
  if (speed > MAX_SPEED) {
    entity.xChange = (entity.xChange / speed) * MAX_SPEED;
    entity.yChange = (entity.yChange / speed) * MAX_SPEED;
  }
}
function handleGoatMovement() {
  for (let goat of goats) {
    // calculate the distance between the player and the goat

    let info = getInfo(player, goat);
    // check if the player is within the run-toward radius

    if (info.distance < run_toward_radius) {
      goat.chasing = true
      goat.angle = info.angle;
      // make the goat run away from the player
      goat.xChange = Math.cos(goat.angle) * goatRunSpeed;

      goat.yChange = Math.sin(goat.angle) * goatRunSpeed;
      detectCollisions(player, goat);
      if (player.isColliding) {
        let vCollision = { x: info.dx, y: info.dy };
        let distance = info.distance;
        let vCollisionNorm = {
          x: vCollision.x / distance,
          y: vCollision.y / distance,
        };
        let vRelativeVelocity = {
          x: goat.xChange - player.xChange,
          y: goat.yChange - player.yChange,
        };
        let speed =
          vRelativeVelocity.x * vCollisionNorm.x +
          vRelativeVelocity.y * vCollisionNorm.y;

        if (speed < 0) {
          break;
        }
        let impulse = (6 * speed) / (goat.mass + player.mass);
        player.xChange += impulse * goat.mass * vCollisionNorm.x;
        player.yChange += impulse * goat.mass * vCollisionNorm.y;
      }
    } else {
      let now = Date.now();

      if (now - goat.lastDirectionChange > 5000) {
        // It's been more than 5 seconds since the last direction change for this goat, so change direction

        goat.lastDirectionChange = now;
        goat.move()
      }
    }

    if (goat.xChange > 0.5) {
      goat.frameY = 1;
    } else if (goat.xChange < -0.5) {
      goat.frameY = 3;
    } else if (goat.yChange > 0.5) {
      goat.frameY = 0;
    } else if (goat.yChange < -0.5) {
      goat.frameY = 2;
    }
    goat.frameX = (goat.frameX + 1) % 4;

    updateGoatPosition(goat);
  }
}

function activate(event) {
  if (inputEnabled) {
    let key = event.key;
    if (key === "ArrowLeft") {
      moveLeft = true;
    } else if (key === "ArrowUp") {
      moveUp = true;
    } else if (key === "ArrowDown") {
      moveDown = true;
    } else if (key === "ArrowRight") {
      moveRight = true;
    }
  }
}

function deactivate(event) {
  let key = event.key;
  if (key === "ArrowLeft") {
    moveLeft = false;
    player.xChange = 0;
  } else if (key === "ArrowUp") {
    moveUp = false;
    player.yChange = 0;
  } else if (key === "ArrowDown") {
    moveDown = false;
    player.yChange = 0;
  } else if (key === "ArrowRight") {
    moveRight = false;
    player.xChange = 0;
  }
}

function updatePlayerPosition() {
  player.x += player.xChange;
  player.y += player.yChange;
  player.centerx += player.xChange;
  player.centery += player.yChange;
  checkCollisionsWithCollidables(player);
}

function updateEnemyPosition(enemy) {
  enemy.x += enemy.xChange;
  enemy.y += enemy.yChange;
  enemy.centerx += enemy.xChange;
  enemy.centery += enemy.yChange;
  limitspeed(enemy)
  checkCollisionsWithCollidables(enemy);
}
function updateGoatPosition(goat) {
  goat.x += goat.xChange;
  goat.y += goat.yChange;
  goat.centerx += goat.xChange;
  goat.centery += goat.yChange;
  limitspeed(goat)
  checkCollisionsWithCollidables(goat);
}
let restition;
function performPhysics() {
  for (let enemy of enemies) {
    if (enemy.x + enemy.width < 0) {
      enemy.x = canvas.width;
      enemy.centerx = enemy.width + canvas.width;
    } else if (enemy.x > canvas.width) {
      enemy.x = 0;
      enemy.centerx = enemy.height + 0;
    }
    if (enemy.y + enemy.height < 0) {
      enemy.y = canvas.height;
      enemy.centery = canvas.height;
    } else if (enemy.y > canvas.height) {
      enemy.y = 0;
      enemy.centery = enemy.height + 0;
    }
  }
  for (let goat of goats) {
    if (goat.x + goat.width < 0) {
      goat.x = canvas.width;
      goat.centerx = goat.width + canvas.width;
    } else if (goat.x > canvas.width) {
      goat.x = 0;
      goat.centerx = goat.height + 0;
    }
    if (goat.y + goat.height < 0) {
      goat.y = canvas.height;
      goat.centery = canvas.height;
    } else if (goat.y > canvas.height) {
      goat.y = 0;
      goat.centery = goat.height + 0;
    }
  }
  if (player.x + player.width < 0) {
    player.x = canvas.width;
    player.centerx = player.width + canvas.width;
  } else if (player.x > canvas.width) {
    player.x = 0;
    player.centerx = player.height + 0;
  }
  if (player.y + player.height < 0) {
    player.y = canvas.height;
    player.centery = canvas.height;
  } else if (player.y > canvas.height) {
    player.y = 0;
    player.centery = player.height + 0;
  }
  player.xChange *= 0.9;
  player.yChange *= 0.9;
}

function entityCollidesOnSpawn(entity) {
  // Check collision with player
  if (detectCollisions(player, entity)) {
    return true;
  }

  // Check collision with other enemies
  for (let otherEnemy of enemies) {
    if (entity !== otherEnemy && detectCollisions(entity, otherEnemy)) {
      return true;
    }
  }
  for (let otherGoat of goats) {
    if (entity !== otherGoat && detectCollisions(entity, otherGoat)) {
      return true;
    }
  }
  if(checkCollisionsWithCollidables(entity)){
    return true
  }
  // Add additional checks for other entities if needed

  return false;
}

function detectCollisions(entity1, entity2) {
  // Reset collision state of all objects
  entity1.isColliding = false;
  entity2.isColliding = false;

  // Compare entity1 with entity
  if (
    rectIntersect(
      entity1.x,
      entity1.y,
      entity1.width * 2,
      entity1.height * 2,
      entity2.x,
      entity2.y,
      entity2.width * 2,
      entity2.height * 2
    )
  ) {
    entity1.isColliding = true;
    entity2.isColliding = true;
  }
}

function rectIntersect(x1, y1, w1, h1, x2, y2, w2, h2) {
  // Check x and y for overlap
  if (x2 > w1 + x1 || x1 > w2 + x2 || y2 > h1 + y1 || y1 > h2 + y2) {
    return false;
  }
  return true;
}

function checkCollisionsWithCollidables(entity) {
  for (let r = 0; r < collidables.length; r++) {
    for (let c = 0; c < collidables[0].length; c++) {
      let tile = collidables[r][c];
      if (tile !== -1) {
        let tileX = c * tileSize;
        let tileY = r * tileSize;
        let tileWidth = tileSize;
        let tileHeight = tileSize;

        if (
          rectIntersect(
            entity.x,
            entity.y,
            entity.width * 2,
            entity.height * 2,
            tileX,
            tileY,
            tileWidth,
            tileHeight
          )
        ) {
    
          // Handle collision here
          if (entity.type === 0){
            entity.xChange -= entity.xChange*4.5;
            entity.yChange -= entity.yChange*4.5;
            inputEnabled = false;
          } else if (entity.type === 1 && entity.chased === false || entity.type == 2 && entity.chasing === false){
            let wanderAngle = Math.random() * 2 * Math.PI;
            entity.xChange = -entity.xChange*1.5;
            entity.yChange = -entity.yChange*1.5;
            entity.angle =  wanderAngle
          }
          inputEnabled = true
          return true
        }
      }
    }
  }
}

function randint(min, max) {
  return Math.round(Math.random() * (max - min)) + min;
}

function load_assets(assets, callback) {
  let num_assets = assets.length;
  let loaded = function () {
    console.log("loaded");
    num_assets = num_assets - 1;
    if (num_assets === 0) {
      callback();
    }
  };
  for (let asset of assets) {
    let element = asset.var;
    if (element instanceof HTMLImageElement) {
      console.log("img");
      element.addEventListener("load", loaded, false);
    } else if (element instanceof HTMLAudioElement) {
      console.log("audio");
      element.addEventListener("canplaythrough", loaded, false);
    }
    element.src = asset.url;
  }
}

function loadSound(url) {
  sound = new Audio(url);
  sound.addEventListener(
    "canplaythrough",
    function () {
      sound.play();
    },
    { once: true }
  );
}

function playSoundOnClick() {
  sound.play();
}

function loadBackgroundMusic(url) {
  backgroundMusic = new Audio(url);
  backgroundMusic.loop = true;
  backgroundMusic.volume = 0.1;
  backgroundMusic.play();
}

function endRoundWin() {
  // Check if all sheep have been sheared
  let allSheared = true;
  for (let enemy of enemies) {
    if (enemy.state === false) {
      allSheared = false;
      break;
    }
  }

  // If all sheep have been sheared, end the round and start a new one
  if (allSheared) {
    sendRoundTimeToServer(roundNumber, timer);
    clearInterval(timerInterval);
    // End the current round
    console.log("Round ended");

    // Increase the round number
    roundNumber++;
    if (roundNumber === 6) {
      stop("YOU WIN CHECK THE LEADERBOARD");
    } else {
      // Update the round number on the canvas
      document.getElementById("round").innerHTML = "Round " + roundNumber;
      // Increase the number of enemies
      let newEnemies = [];
      for (let i = 0; i < enemies.length + 3; i++) {
        let enemy = new Enemy("Enemy" + i);
        do {
          enemy.x = randint(0, canvas.width - enemy.width);

          enemy.y = randint(0, canvas.height - enemy.height);
          enemy.centerx = enemy.x + enemy.width;
          enemy.centery = enemy.y + enemy.height;
        } while (entityCollidesOnSpawn(enemy)); // Ensure enemies don't spawn on other entities

        newEnemies.push(enemy);
      }
      enemies = newEnemies;
      console.log(enemies);

      // Generate new goats
      generateGoats();
      // Reset the sheep sheared counter
      sheepSheared = 0;
      document.getElementById("sheepShearedCounter").innerHTML =
        "Sheep Sheared: " + sheepSheared;
      player.x = canvas.width / 2;
      player.y = canvas.height / 2;
      player.centerx = player.x + player.width;
      player.centery = player.y + player.height;
      startSmallTimer();
    }
  }
}

function startSmallTimer() {
  inputEnabled = false;
  smallTimer = 3;
  smallTimerText = document.getElementById("smallTimer");
  smallTimerText.innerHTML = "Round Starts in:" + smallTimer;
  smallTimerInterval = setInterval(updateSmallTimer, 1000);
  for (let enemy of enemies) {
    enemy.state = false;
  }
}

function updateSmallTimer() {
  smallTimer--;
  if (smallTimer < 0) {
    clearInterval(smallTimerInterval);
    startTimer();
    smallTimerText.innerHTML = null;
    inputEnabled = true;
  } else {
    smallTimerText.innerHTML = "Round Starts in:" + smallTimer;
  }
}

function startTimer() {
  timer = 30 + (roundNumber - 1) * 10; // Increase the timer by 10 seconds for each round
  timerText = document.getElementById("timer");
  timerText.innerHTML = "Timer: " + timer;
  timerInterval = setInterval(updateTimer, 1000);
}

function updateTimer() {
  timer--;
  if (timer < 0) {
    stop("GAME OVER");
    clearInterval(timerInterval);
  } else {
    timerText.innerHTML = "Timer: " + timer;
  }
}

function stop(outcome) {
  window.removeEventListener("keydown", activate, false);
  window.cancelAnimationFrame("keyup", deactivate, false);
  window.cancelAnimationFrame(request_id);
  let outcome_element = document.querySelector("#smallTimer");
  outcome_element.innerHTML = outcome;
  document.getElementById("restartButton").style.display = "block";
}

function sendRoundTimeToServer(roundNumber, timer) {
  let data = { roundNumber: roundNumber, timer: timer };
  fetch("/round-time", {
    method: "POST",
    headers: { "Content-Type": "application/json;odata=verbose" },
    body: JSON.stringify(data),
  })
    .then((response) => {
      console.log("Round time sent to server");
    })
    .catch((error) => {
      console.error("Error sending round time to server:", error);
    });
}
