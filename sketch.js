/*

The Game Project 7 - Make it awesome

*/

var gameChar_x;
var gameChar_y;
var floorPos_y;
var scrollPos;
var gameChar_world_x;

var isLeft;
var isRight;
var isFalling;
var isPlummeting;

var clouds;
var mountains;
var collectables;
var canyons;
var trees_x;

var game_score;

var flagpole;

var lives;

var jumpSound;
var collectableSound;
var loseSound;
var levelCompletedSound;

var playedEndSound;

function preload() {
	soundFormats('mp3', 'wav');

	// load jump sound
	jumpSound = loadSound('assets/jump.wav');
	jumpSound.setVolume(0.1);

	// load collectable sound
	collectableSound = loadSound('assets/collectable.wav');
	collectableSound.setVolume(0.1);

	// load lose sound
	loseSound = loadSound('assets/lose.wav');
	loseSound.setVolume(0.1);

	// load level completed sound
	levelCompletedSound = loadSound('assets/level_completed.wav');
	levelCompletedSound.setVolume(0.1);
}

function setup() {
	createCanvas(1024, 576);
	floorPos_y = height * 3 / 4;
	lives = 3;

	startGame();
}

function draw() {
	background(100, 155, 255);

	noStroke();
	fill(0, 155, 0);
	rect(0, floorPos_y, width, height / 4);

	fill(255);
	noStroke();
	textSize(16);
	text('score: ' + game_score, 20, 20);

	renderLives();

	push();
	translate(scrollPos, 0);

	drawClouds();

	drawMountains();

	drawTrees();

	for (var i = 0; i < canyons.length; i++) {
		drawCanyon(canyons[i]);
		checkCanyon(canyons[i]);
	}

	for (var i = 0; i < collectables.length; i++) {
		if (!collectables[i].isFound) {
			drawCollectable(collectables[i]);
			checkCollectables(collectables[i]);
		}
	}

	renderFlagpole();

	pop();

	// win and lose
	textSize(40);
	fill(255);
	if (lives < 1) {
		if (!playedEndSound) {
			loseSound.play();
			playedEndSound = true;
		}
		text('Game over. Press space to continue.', 20, height - 40);
		return;
	} else if (flagpole.isReached) {
		if (!playedEndSound) {
			levelCompletedSound.play();
			playedEndSound = true;
		}
		text('Level complete. Press space to continue.', 20, height - 40);
		return;
	}

	drawGameChar();

	// character movement
	if (isLeft) {
		if (gameChar_x > width * 0.2) {
			gameChar_x -= 5;
		}
		else {
			scrollPos += 5;
		}
	}

	if (isRight) {
		if (gameChar_x < width * 0.8) {
			gameChar_x += 5;
		}
		else {
			scrollPos -= 5;
		}
	}

	if (gameChar_y < floorPos_y) {
		gameChar_y += 2;
		isFalling = true;
	} else {
		isFalling = false;
	}

	gameChar_world_x = gameChar_x - scrollPos;

	checkPlayerDie();

	if (!flagpole.isReached) {
		checkFlagpole();
	}
}

// game controls
function keyPressed() {
	if (keyCode === 37) {
		isLeft = true;
	} else if (keyCode === 39) {
		isRight = true;
	}
}

function keyReleased() {
	if (keyCode === 37) {
		isLeft = false;
	} else if (keyCode === 39) {
		isRight = false;
	} else if (keyCode === 32 && gameChar_y === floorPos_y) {
		jumpSound.play();
		gameChar_y -= 100;
	}
}

// draw functions
function drawGameChar() {
	if (isLeft && isFalling) {
		stroke(0);
		fill(17, 238, 85);
		rect(gameChar_x - 18, gameChar_y - 10, 12, 3);
		rect(gameChar_x + 5, gameChar_y - 10, 12, 3);
		triangle(gameChar_x - 8, gameChar_y - 35, gameChar_x - 3, gameChar_y - 30, gameChar_x - 10, gameChar_y - 28);
		ellipse(gameChar_x, gameChar_y - 18, 30, 30);
		triangle(gameChar_x + 5, gameChar_y - 35, gameChar_x, gameChar_y - 30, gameChar_x + 7, gameChar_y - 28);
		fill(250);
		ellipse(gameChar_x - 8, gameChar_y - 22, 15, 15)
		fill(108, 165, 128);
		ellipse(gameChar_x - 11, gameChar_y - 22, 8, 8);
		fill(0);
		ellipse(gameChar_x - 12, gameChar_y - 22, 2, 2);
	}
	else if (isRight && isFalling) {
		stroke(0);
		fill(17, 238, 85);
		rect(gameChar_x - 18, gameChar_y - 10, 12, 3);
		rect(gameChar_x + 5, gameChar_y - 10, 12, 3);
		triangle(gameChar_x + 8, gameChar_y - 35, gameChar_x + 3, gameChar_y - 30, gameChar_x + 10, gameChar_y - 28);
		ellipse(gameChar_x, gameChar_y - 18, 30, 30);
		triangle(gameChar_x - 5, gameChar_y - 35, gameChar_x, gameChar_y - 30, gameChar_x - 7, gameChar_y - 28);
		fill(250);
		ellipse(gameChar_x + 8, gameChar_y - 22, 15, 15)
		fill(108, 165, 128);
		ellipse(gameChar_x + 11, gameChar_y - 22, 8, 8);
		fill(0);
		ellipse(gameChar_x + 12, gameChar_y - 22, 2, 2);
	}
	else if (isLeft) {
		stroke(0);
		fill(17, 238, 85);
		rect(gameChar_x - 6, gameChar_y - 7, 3, 10);
		rect(gameChar_x + 2, gameChar_y - 7, 3, 10);
		triangle(gameChar_x - 8, gameChar_y - 35, gameChar_x - 3, gameChar_y - 30, gameChar_x - 10, gameChar_y - 28);
		ellipse(gameChar_x, gameChar_y - 18, 30, 30);
		triangle(gameChar_x + 5, gameChar_y - 35, gameChar_x, gameChar_y - 30, gameChar_x + 7, gameChar_y - 28);
		fill(250);
		ellipse(gameChar_x - 8, gameChar_y - 22, 15, 15)
		fill(108, 165, 128);
		ellipse(gameChar_x - 11, gameChar_y - 22, 8, 8);
		fill(0);
		ellipse(gameChar_x - 12, gameChar_y - 22, 2, 2);

	}
	else if (isRight) {
		stroke(0);
		fill(17, 238, 85);
		rect(gameChar_x - 6, gameChar_y - 7, 3, 10);
		rect(gameChar_x + 2, gameChar_y - 7, 3, 10);
		triangle(gameChar_x + 8, gameChar_y - 35, gameChar_x + 3, gameChar_y - 30, gameChar_x + 10, gameChar_y - 28);
		ellipse(gameChar_x, gameChar_y - 18, 30, 30);
		triangle(gameChar_x - 5, gameChar_y - 35, gameChar_x, gameChar_y - 30, gameChar_x - 7, gameChar_y - 28);
		fill(250);
		ellipse(gameChar_x + 8, gameChar_y - 22, 15, 15)
		fill(108, 165, 128);
		ellipse(gameChar_x + 11, gameChar_y - 22, 8, 8);
		fill(0);
		ellipse(gameChar_x + 12, gameChar_y - 22, 2, 2);

	}
	else if (isFalling || isPlummeting) {
		stroke(0);
		fill(17, 238, 85);
		rect(gameChar_x - 18, gameChar_y - 10, 12, 3);
		rect(gameChar_x + 5, gameChar_y - 10, 12, 3);
		triangle(gameChar_x - 8, gameChar_y - 35, gameChar_x - 3, gameChar_y - 30, gameChar_x - 10, gameChar_y - 28);
		triangle(gameChar_x + 8, gameChar_y - 35, gameChar_x + 3, gameChar_y - 30, gameChar_x + 10, gameChar_y - 28);
		ellipse(gameChar_x, gameChar_y - 18, 30, 30);
		fill(250);
		ellipse(gameChar_x, gameChar_y - 22, 15, 15)
		fill(108, 165, 128);
		ellipse(gameChar_x, gameChar_y - 22, 8, 8);
		fill(0);
		ellipse(gameChar_x, gameChar_y - 22, 2, 2);

	}
	else {
		stroke(0);
		fill(17, 238, 85);
		rect(gameChar_x - 6, gameChar_y - 7, 3, 10);
		rect(gameChar_x + 2, gameChar_y - 7, 3, 10);
		triangle(gameChar_x - 8, gameChar_y - 35, gameChar_x - 3, gameChar_y - 30, gameChar_x - 10, gameChar_y - 28);
		triangle(gameChar_x + 8, gameChar_y - 35, gameChar_x + 3, gameChar_y - 30, gameChar_x + 10, gameChar_y - 28);
		ellipse(gameChar_x, gameChar_y - 18, 30, 30);
		fill(250);
		ellipse(gameChar_x, gameChar_y - 22, 15, 15)
		fill(108, 165, 128);
		ellipse(gameChar_x, gameChar_y - 22, 8, 8);
		fill(0);
		ellipse(gameChar_x, gameChar_y - 22, 2, 2);

	}
}

function drawClouds() {
	for (let i = 0; i < clouds.length; i++) {
		const cloud = clouds[i];
		fill(255);
		ellipse(cloud.x_pos, cloud.y_pos, (cloud.size) * 0.7, (cloud.size) * 0.8)
		ellipse(cloud.x_pos + (cloud.size) * 0.4, cloud.y_pos + (cloud.size) * 0.1, (cloud.size) * 0.5, (cloud.size) * 0.6)
		ellipse(cloud.x_pos - (cloud.size) * 0.4, cloud.y_pos + (cloud.size) * 0.1, (cloud.size) * 0.5, (cloud.size) * 0.6)
		rect(cloud.x_pos - (cloud.size) * 0.4, cloud.y_pos + (cloud.size) * 0.25, (cloud.size) * 0.8, (cloud.size) * 0.15)
	}
}

function drawMountains() {
	for (let i = 0; i < mountains.length; i++) {
		const mountain = mountains[i];
		fill(120);
		triangle(mountain.x_pos - (mountain.width) / 2, floorPos_y, mountain.x_pos + (mountain.width) / 2, floorPos_y, mountain.x_pos, 100);
		fill(255);
		triangle(mountain.x_pos - ((100 / 332) * mountain.width) / 2, 200, mountain.x_pos + ((100 / 332) * mountain.width) / 2, 200, mountain.x_pos, 100);
	}
}

function drawTrees() {
	for (let i = 0; i < trees_x.length; i++) {
		const tree_x = trees_x[i]
		fill(54, 34, 4);
		rect(tree_x, floorPos_y - 150, 50, 150);
		fill(1, 50, 32);
		triangle(tree_x - 40, floorPos_y - 220, tree_x + 92, floorPos_y - 220, tree_x + 25, floorPos_y - 315);
		triangle(tree_x - 50, floorPos_y - 150, tree_x + 102, floorPos_y - 150, tree_x + 25, floorPos_y - 330);
	}
}

function drawCanyon(t_canyon) {
	for (let i = 0; i < canyons.length; i++) {
		fill(100, 155, 255);
		rect(t_canyon.x_pos, 432, t_canyon.width, 144);
		fill(135, 83, 40);
		triangle(t_canyon.x_pos, 432, t_canyon.x_pos + 25, 432, t_canyon.x_pos, 572);
		triangle(t_canyon.x_pos + t_canyon.width, 432, t_canyon.x_pos + t_canyon.width - 25, 432, t_canyon.x_pos + t_canyon.width, 572);
	}
}

function checkCanyon(t_canyon) {
	if (gameChar_y >= floorPos_y && gameChar_world_x > (t_canyon.x_pos + 25) && gameChar_world_x < (t_canyon.x_pos - 25 + t_canyon.width)) {
		isPlummeting = true;
	}
	if (isPlummeting) {
		gameChar_y += 5;
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
	var distance = abs(gameChar_world_x - flagpole.x_pos);
	if (distance < 15) {
		flagpole.isReached = true;
	}
}

function drawCollectable(t_collectable) {
	for (let i = 0; i < collectables.length; i++) {
		fill(197, 29, 52);
		ellipse(t_collectable.x_pos - (t_collectable.size) / 4, t_collectable.y_pos - (t_collectable.size) / 16, (t_collectable.size) / 2, (t_collectable.size) / 2);
		ellipse(t_collectable.x_pos + (t_collectable.size) / 4, t_collectable.y_pos - (t_collectable.size) / 16, (t_collectable.size) / 2, (t_collectable.size) / 2);
		triangle(t_collectable.x_pos - (t_collectable.size) / 2, t_collectable.y_pos, t_collectable.x_pos + (t_collectable.size) / 2, t_collectable.y_pos, t_collectable.x_pos, t_collectable.y_pos + (t_collectable.size) / 2);
		ellipse(t_collectable.x_pos, t_collectable.y_pos, (t_collectable.size) / 10, (t_collectable.size) / 10)
	}
}

function checkCollectables(t_collectable) {
	if (dist(gameChar_world_x, gameChar_y, t_collectable.x_pos, t_collectable.y_pos) < 30) {
		collectableSound.play();
		t_collectable.isFound = true;
		game_score += 1;
	}
}

function checkPlayerDie() {
	if (gameChar_y > height) {
		lives -= 1;

		if (lives > 0) {
			startGame();
		}
	}
}

function renderLives() {
	for (var i = 0; i < lives; i++) {
		fill(212, 175, 55);
		ellipse(width - 25 * (i + 1), 20, 15);
	}
}

// game setup
function startGame() {
	playedEndSound = false;
	gameChar_x = width / 2;
	gameChar_y = floorPos_y;

	scrollPos = 0;

	gameChar_world_x = gameChar_x - scrollPos;

	isLeft = false;
	isRight = false;
	isFalling = false;
	isPlummeting = false;

	trees_x = [-820, -410, -255, -100, 430, 660, 1000, 1320, 1480, 1800, 2300, 2550];
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
		{ x_pos: 2208, y_pos: 130, size: 115 }
	];
	mountains = [
		{ x_pos: 340, width: 300 },
		{ x_pos: 1900, width: 400 }
	];
	canyons = [
		{ x_pos: 0, width: 180 },
		{ x_pos: 780, width: 100 },
		{ x_pos: 2380, width: 120 }
	];
	collectables = [
		{ x_pos: -480, y_pos: 410, size: 20, isFound: false },
		{ x_pos: 180, y_pos: 410, size: 20, isFound: false },
		{ x_pos: 1080, y_pos: 410, size: 20, isFound: false },
		{ x_pos: 1150, y_pos: 410, size: 20, isFound: false },
		{ x_pos: 2250, y_pos: 410, size: 20, isFound: false }
	];

	game_score = 0;

	flagpole = { isReached: false, x_pos: 2700 };
}
