/*

The Game Project 7 - Make it awesome

*/

let character;

let floorPos_y;
let scrollPos;
let gameChar_world_x;

let game_score;
let flagpole;
let lives;

let clouds;
let mountains;
let collectables;
let canyons;
let trees_x;
let platforms;
let enemies;

let jumpSound;
let collectableSound;
let loseSound;
let levelCompletedSound;

let playedEndSound;

function preload() {
  soundFormats("mp3", "wav");

  // load jump sound
  jumpSound = loadSound("assets/jump.wav");
  jumpSound.setVolume(0.1);

  // load collectable sound
  collectableSound = loadSound("assets/collectable.wav");
  collectableSound.setVolume(0.1);

  // load lose sound
  loseSound = loadSound("assets/lose.wav");
  loseSound.setVolume(0.1);

  // load level completed sound
  levelCompletedSound = loadSound("assets/level_completed.wav");
  levelCompletedSound.setVolume(0.1);
}

function setup() {
  createCanvas(1024, 576);
  floorPos_y = (height * 3) / 4;
  lives = 3;

  startGame();
}

function draw() {
  // draw all scenario
  background(100, 155, 255);

  noStroke();
  fill(0, 155, 0);
  rect(0, floorPos_y, width, height / 4);

  fill(255);
  noStroke();
  textSize(16);
  text("score: " + game_score, 20, 20);

  renderLives();

  push();
  translate(scrollPos, 0);

  drawClouds();
  drawMountains();
  drawTrees();

  canyons.forEach((canyon) => {
    drawCanyon(canyon);
    checkCanyon(canyon);
  });

  platforms.forEach((platform) => {
    platform.draw();
  });

  collectables.forEach((collectable) => {
    if (!collectable.isFound) {
      drawCollectable(collectable);
      checkCollectables(collectable);
    }
  });

  renderFlagpole();

  for (let i = 0; i < enemies.length; i++) {
    enemies[i].draw();

    let touchedEnemy = enemies[i].checkContact(gameChar_world_x, character.y);

    if (touchedEnemy) {
      lives -= 1;
      if (lives > 0) {
        startGame();
        break;
      }
    }
  }

  pop();

  // win and lose
  textSize(40);
  fill(255);
  if (lives < 1) {
    if (!playedEndSound) {
      loseSound.play();
      playedEndSound = true;
    }
    text("Game over. Press space to continue.", 20, height - 40);
    return;
  } else if (flagpole.isReached) {
    if (!playedEndSound) {
      levelCompletedSound.play();
      playedEndSound = true;
    }
    text("Level complete. Press space to continue.", 20, height - 40);
    return;
  }

  drawGameChar();

  // character movement
  if (character.isLeft) {
    if (character.x > width * 0.2) {
      character.x -= 5;
    } else {
      scrollPos += 5;
    }
  }

  if (character.isRight) {
    if (character.x < width * 0.8) {
      character.x += 5;
    } else {
      scrollPos -= 5;
    }
  }

  if (character.y < floorPos_y) {
    let isInPlatform = false;
    for (let i = 0; i < platforms.length; i++) {
      if (platforms[i].checkContact(gameChar_world_x, character.y)) {
        isInPlatform = true;
        character.isFalling = false;
        break;
      }
    }
    if (!isInPlatform) {
      character.y += 2;
      character.isFalling = true;
    }
  } else {
    character.isFalling = false;
  }

  gameChar_world_x = character.x - scrollPos;

  checkPlayerDie();

  if (!flagpole.isReached) {
    checkFlagpole();
  }
}

// game controls
function keyPressed() {
  if (keyCode === 37) {
    character.isLeft = true;
  } else if (keyCode === 39) {
    character.isRight = true;
  } else if (keyCode === 32) {
    if (lives < 1 || flagpole.isReached) {
      startGame();
      lives = 3;
    } else if (!character.isFalling) {
      jumpSound.play();
      character.y -= 115;
    }
  }
}

function keyReleased() {
  if (keyCode === 37) {
    character.isLeft = false;
  } else if (keyCode === 39) {
    character.isRight = false;
  }
}

// draw functions
function drawGameChar() {
  if (character.isLeft && character.isFalling) {
    stroke(0);
    fill(17, 238, 85);
    rect(character.x - 18, character.y - 10, 12, 3);
    rect(character.x + 5, character.y - 10, 12, 3);
    triangle(
      character.x - 8,
      character.y - 35,
      character.x - 3,
      character.y - 30,
      character.x - 10,
      character.y - 28
    );
    ellipse(character.x, character.y - 18, 30, 30);
    triangle(
      character.x + 5,
      character.y - 35,
      character.x,
      character.y - 30,
      character.x + 7,
      character.y - 28
    );
    fill(250);
    ellipse(character.x - 8, character.y - 22, 15, 15);
    fill(108, 165, 128);
    ellipse(character.x - 11, character.y - 22, 8, 8);
    fill(0);
    ellipse(character.x - 12, character.y - 22, 2, 2);
  } else if (character.isRight && character.isFalling) {
    stroke(0);
    fill(17, 238, 85);
    rect(character.x - 18, character.y - 10, 12, 3);
    rect(character.x + 5, character.y - 10, 12, 3);
    triangle(
      character.x + 8,
      character.y - 35,
      character.x + 3,
      character.y - 30,
      character.x + 10,
      character.y - 28
    );
    ellipse(character.x, character.y - 18, 30, 30);
    triangle(
      character.x - 5,
      character.y - 35,
      character.x,
      character.y - 30,
      character.x - 7,
      character.y - 28
    );
    fill(250);
    ellipse(character.x + 8, character.y - 22, 15, 15);
    fill(108, 165, 128);
    ellipse(character.x + 11, character.y - 22, 8, 8);
    fill(0);
    ellipse(character.x + 12, character.y - 22, 2, 2);
  } else if (character.isLeft) {
    stroke(0);
    fill(17, 238, 85);
    rect(character.x - 6, character.y - 7, 3, 10);
    rect(character.x + 2, character.y - 7, 3, 10);
    triangle(
      character.x - 8,
      character.y - 35,
      character.x - 3,
      character.y - 30,
      character.x - 10,
      character.y - 28
    );
    ellipse(character.x, character.y - 18, 30, 30);
    triangle(
      character.x + 5,
      character.y - 35,
      character.x,
      character.y - 30,
      character.x + 7,
      character.y - 28
    );
    fill(250);
    ellipse(character.x - 8, character.y - 22, 15, 15);
    fill(108, 165, 128);
    ellipse(character.x - 11, character.y - 22, 8, 8);
    fill(0);
    ellipse(character.x - 12, character.y - 22, 2, 2);
  } else if (character.isRight) {
    stroke(0);
    fill(17, 238, 85);
    rect(character.x - 6, character.y - 7, 3, 10);
    rect(character.x + 2, character.y - 7, 3, 10);
    triangle(
      character.x + 8,
      character.y - 35,
      character.x + 3,
      character.y - 30,
      character.x + 10,
      character.y - 28
    );
    ellipse(character.x, character.y - 18, 30, 30);
    triangle(
      character.x - 5,
      character.y - 35,
      character.x,
      character.y - 30,
      character.x - 7,
      character.y - 28
    );
    fill(250);
    ellipse(character.x + 8, character.y - 22, 15, 15);
    fill(108, 165, 128);
    ellipse(character.x + 11, character.y - 22, 8, 8);
    fill(0);
    ellipse(character.x + 12, character.y - 22, 2, 2);
  } else if (character.isFalling || character.isPlummeting) {
    stroke(0);
    fill(17, 238, 85);
    rect(character.x - 18, character.y - 10, 12, 3);
    rect(character.x + 5, character.y - 10, 12, 3);
    triangle(
      character.x - 8,
      character.y - 35,
      character.x - 3,
      character.y - 30,
      character.x - 10,
      character.y - 28
    );
    triangle(
      character.x + 8,
      character.y - 35,
      character.x + 3,
      character.y - 30,
      character.x + 10,
      character.y - 28
    );
    ellipse(character.x, character.y - 18, 30, 30);
    fill(250);
    ellipse(character.x, character.y - 22, 15, 15);
    fill(108, 165, 128);
    ellipse(character.x, character.y - 22, 8, 8);
    fill(0);
    ellipse(character.x, character.y - 22, 2, 2);
  } else {
    stroke(0);
    fill(17, 238, 85);
    rect(character.x - 6, character.y - 7, 3, 10);
    rect(character.x + 2, character.y - 7, 3, 10);
    triangle(
      character.x - 8,
      character.y - 35,
      character.x - 3,
      character.y - 30,
      character.x - 10,
      character.y - 28
    );
    triangle(
      character.x + 8,
      character.y - 35,
      character.x + 3,
      character.y - 30,
      character.x + 10,
      character.y - 28
    );
    ellipse(character.x, character.y - 18, 30, 30);
    fill(250);
    ellipse(character.x, character.y - 22, 15, 15);
    fill(108, 165, 128);
    ellipse(character.x, character.y - 22, 8, 8);
    fill(0);
    ellipse(character.x, character.y - 22, 2, 2);
  }
}

function drawClouds() {
  for (let i = 0; i < clouds.length; i++) {
    const cloud = clouds[i];
    fill(255);
    ellipse(cloud.x_pos, cloud.y_pos, cloud.size * 0.7, cloud.size * 0.8);
    ellipse(
      cloud.x_pos + cloud.size * 0.4,
      cloud.y_pos + cloud.size * 0.1,
      cloud.size * 0.5,
      cloud.size * 0.6
    );
    ellipse(
      cloud.x_pos - cloud.size * 0.4,
      cloud.y_pos + cloud.size * 0.1,
      cloud.size * 0.5,
      cloud.size * 0.6
    );
    rect(
      cloud.x_pos - cloud.size * 0.4,
      cloud.y_pos + cloud.size * 0.25,
      cloud.size * 0.8,
      cloud.size * 0.15
    );
  }
}

function drawMountains() {
  for (let i = 0; i < mountains.length; i++) {
    const mountain = mountains[i];
    fill(120);
    triangle(
      mountain.x_pos - mountain.width / 2,
      floorPos_y,
      mountain.x_pos + mountain.width / 2,
      floorPos_y,
      mountain.x_pos,
      100
    );
    fill(255);
    triangle(
      mountain.x_pos - ((100 / 332) * mountain.width) / 2,
      200,
      mountain.x_pos + ((100 / 332) * mountain.width) / 2,
      200,
      mountain.x_pos,
      100
    );
  }
}

function drawTrees() {
  for (let i = 0; i < trees_x.length; i++) {
    const tree_x = trees_x[i];
    fill(54, 34, 4);
    rect(tree_x, floorPos_y - 150, 50, 150);
    fill(1, 50, 32);
    triangle(
      tree_x - 40,
      floorPos_y - 220,
      tree_x + 92,
      floorPos_y - 220,
      tree_x + 25,
      floorPos_y - 315
    );
    triangle(
      tree_x - 50,
      floorPos_y - 150,
      tree_x + 102,
      floorPos_y - 150,
      tree_x + 25,
      floorPos_y - 330
    );
  }
}

function drawCanyon(t_canyon) {
  for (let i = 0; i < canyons.length; i++) {
    fill(100, 155, 255);
    rect(t_canyon.x_pos, 432, t_canyon.width, 144);
    fill(135, 83, 40);
    triangle(
      t_canyon.x_pos,
      432,
      t_canyon.x_pos + 25,
      432,
      t_canyon.x_pos,
      572
    );
    triangle(
      t_canyon.x_pos + t_canyon.width,
      432,
      t_canyon.x_pos + t_canyon.width - 25,
      432,
      t_canyon.x_pos + t_canyon.width,
      572
    );
  }
}

function checkCanyon(t_canyon) {
  if (
    character.y >= floorPos_y &&
    gameChar_world_x > t_canyon.x_pos + 25 &&
    gameChar_world_x < t_canyon.x_pos - 25 + t_canyon.width
  ) {
    character.isPlummeting = true;
  }
  if (character.isPlummeting) {
    character.y += 5;
  }
}

function renderFlagpole() {
  push();
  strokeWeight(5);
  stroke(212, 175, 55);
  line(flagpole.x_pos, floorPos_y, flagpole.x_pos, floorPos_y - 250);
  noStroke();
  fill(194, 24, 7);
  if (flagpole.isReached) {
    rect(flagpole.x_pos, floorPos_y - 250, 50, 50);
  } else {
    rect(flagpole.x_pos, floorPos_y - 50, 50, 50);
  }
  pop();
}

function checkFlagpole() {
  const distance = abs(gameChar_world_x - flagpole.x_pos);
  if (distance < 15) {
    flagpole.isReached = true;
  }
}

function drawCollectable(t_collectable) {
  for (let i = 0; i < collectables.length; i++) {
    fill(197, 29, 52);
    ellipse(
      t_collectable.x_pos - t_collectable.size / 4,
      t_collectable.y_pos - t_collectable.size / 16,
      t_collectable.size / 2,
      t_collectable.size / 2
    );
    ellipse(
      t_collectable.x_pos + t_collectable.size / 4,
      t_collectable.y_pos - t_collectable.size / 16,
      t_collectable.size / 2,
      t_collectable.size / 2
    );
    triangle(
      t_collectable.x_pos - t_collectable.size / 2,
      t_collectable.y_pos,
      t_collectable.x_pos + t_collectable.size / 2,
      t_collectable.y_pos,
      t_collectable.x_pos,
      t_collectable.y_pos + t_collectable.size / 2
    );
    ellipse(
      t_collectable.x_pos,
      t_collectable.y_pos,
      t_collectable.size / 10,
      t_collectable.size / 10
    );
  }
}

function checkCollectables(t_collectable) {
  if (
    dist(
      gameChar_world_x,
      character.y,
      t_collectable.x_pos,
      t_collectable.y_pos
    ) < 30
  ) {
    collectableSound.play();
    t_collectable.isFound = true;
    game_score += 1;
  }
}

function checkPlayerDie() {
  if (character.y > height) {
    lives -= 1;

    if (lives > 0) {
      startGame();
    }
  }
}

function renderLives() {
  for (let i = 0; i < lives; i++) {
    fill(212, 175, 55);
    ellipse(width - 25 * (i + 1), 20, 15);
  }
}

// create functions
function createPlatforms(x, y, length) {
  return {
    x: x,
    y: y,
    length: length,
    draw: function () {
      fill(135, 83, 40);
      rect(this.x, this.y, this.length, 24);
      fill(0, 155, 0);
      rect(this.x, this.y, this.length, 6);
    },
    checkContact: function (characterX, characterY) {
      if (characterX > this.x && characterX < this.x + this.length) {
        const dist = this.y - characterY;
        return dist >= 0 && dist < 5;
      }
      return false;
    },
  };
}

function Enemy(x, y, range) {
  this.x = x;
  this.y = y;
  this.range = range;
  this.currentX = x;
  this.inc = 1;
  this.update = function () {
    this.currentX += this.inc;
    if (this.currentX >= this.x + this.range) {
      this.inc = -1;
    } else if (this.currentX < this.x) {
      this.inc = 1;
    }
  };
  this.draw = function () {
    this.update();
    const enemyIsRight = this.inc === 1;

    if (enemyIsRight) {
      stroke(0);
      fill(110, 70, 174);
      rect(this.currentX - 6, this.y - 7, 3, 10);
      rect(this.currentX + 2, this.y - 7, 3, 10);
      triangle(
        this.currentX + 8,
        this.y - 35,
        this.currentX + 3,
        this.y - 30,
        this.currentX + 10,
        this.y - 28
      );
      ellipse(this.currentX, this.y - 18, 30, 30);
      triangle(
        this.currentX - 5,
        this.y - 35,
        this.currentX,
        this.y - 30,
        this.currentX - 7,
        this.y - 28
      );
      fill(250);
      ellipse(this.currentX + 8, this.y - 22, 15, 15);
      fill(110, 70, 174);
      ellipse(this.currentX + 11, this.y - 22, 8, 8);
      fill(0);
      ellipse(this.currentX + 12, this.y - 22, 2, 2);
    } else {
      stroke(0);
      fill(110, 70, 174);
      rect(this.currentX - 6, this.y - 7, 3, 10);
      rect(this.currentX + 2, this.y - 7, 3, 10);
      triangle(
        this.currentX - 8,
        this.y - 35,
        this.currentX - 3,
        this.y - 30,
        this.currentX - 10,
        this.y - 28
      );
      ellipse(this.currentX, this.y - 18, 30, 30);
      triangle(
        this.currentX + 5,
        this.y - 35,
        this.currentX,
        this.y - 30,
        this.currentX + 7,
        this.y - 28
      );
      fill(250);
      ellipse(this.currentX - 8, this.y - 22, 15, 15);
      fill(110, 70, 174);
      ellipse(this.currentX - 11, this.y - 22, 8, 8);
      fill(0);
      ellipse(this.currentX - 12, this.y - 22, 2, 2);
    }
  };
  this.checkContact = function (characterX, characterY) {
    const distance = dist(characterX, characterY, this.currentX, this.y);
    return distance < 30;
  };
}

// game setup
function startGame() {
  playedEndSound = false;
  character = {
    x: width / 2,
    y: floorPos_y,
    isLeft: false,
    isRight: false,
    isFalling: false,
    isPlummeting: false,
  };

  scrollPos = 0;

  gameChar_world_x = character.x - scrollPos;

  trees_x = [-820, -410, -255, -100, 430, 1000, 1320, 1480, 1800, 2550, 2680];

  clouds = [
    { x_pos: -200, y_pos: 140, size: 105 },
    { x_pos: -300, y_pos: 80, size: 75 },
    { x_pos: -600, y_pos: 100, size: 85 },
    { x_pos: 200, y_pos: 120, size: 105 },
    { x_pos: 400, y_pos: 60, size: 60 },
    { x_pos: 800, y_pos: 100, size: 85 },
    { x_pos: 1200, y_pos: 125, size: 115 },
    { x_pos: 1400, y_pos: 50, size: 55 },
    { x_pos: 1810, y_pos: 100, size: 80 },
    { x_pos: 2208, y_pos: 130, size: 115 },
  ];

  mountains = [
    { x_pos: 340, width: 300 },
    { x_pos: 1100, width: 400 },
    { x_pos: 1850, width: 300 },
  ];

  canyons = [
    { x_pos: 0, width: 180 },
    { x_pos: 580, width: 340 },
    { x_pos: 1520, width: 200 },
    { x_pos: 2000, width: 420 },
  ];

  collectables = [
    { x_pos: -480, y_pos: 410, size: 20, isFound: false },
    { x_pos: 180, y_pos: 410, size: 20, isFound: false },
    { x_pos: 1080, y_pos: 410, size: 20, isFound: false },
    { x_pos: 1150, y_pos: 410, size: 20, isFound: false },
    { x_pos: 2550, y_pos: 210, size: 20, isFound: false },
  ];

  platforms = [];
  platforms.push(createPlatforms(100, floorPos_y - 90, 200));
  platforms.push(createPlatforms(725, floorPos_y - 15, 50));
  platforms.push(createPlatforms(2100, floorPos_y - 65, 200));
  platforms.push(createPlatforms(2380, floorPos_y - 140, 100));

  enemies = [];
  enemies.push(new Enemy(360, floorPos_y, 100));
  enemies.push(new Enemy(1200, floorPos_y, 120));
  enemies.push(new Enemy(2150, floorPos_y - 65, 90));

  game_score = 0;

  flagpole = { isReached: false, x_pos: 2700 };
}
