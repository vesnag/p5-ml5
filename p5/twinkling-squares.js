const COLORS = {
  lavenderPurple: '#9151b0',
  lightPink: '#cb90d2',
  deepLavender: '#7260c3',
  royalPurple: '#6930a1',
  brightMagenta: '#8f49bb',
  softPink: '#efa1cb',
  white: '#FFFFFF',
  darkPurple: '#863591',
  violet: '#623eaa',
  rosePink: '#f774aa',
  deepRed: '#8f2968',
  darkRed: '#98254c',
};

const gridColors = [
  [COLORS.lavenderPurple, COLORS.lightPink, COLORS.deepLavender, COLORS.royalPurple, COLORS.brightMagenta],
  [COLORS.softPink, COLORS.brightMagenta, COLORS.white, COLORS.darkPurple, COLORS.violet],
  [COLORS.white, COLORS.white, COLORS.white, COLORS.white, COLORS.white],
  [COLORS.white, COLORS.white, COLORS.rosePink, COLORS.white, COLORS.white],
  [COLORS.deepRed, COLORS.white, COLORS.white, COLORS.white, COLORS.darkRed]
];

const GRID_SIZE = 5;
let squareSize;
const squares = [];

function setup() {
  createCanvas(460, 460);
  noStroke();
  squareSize = width / GRID_SIZE;
  initializeSquares();
}

function draw() {
  background(COLORS.white);
  drawGrid();
}

function initializeSquares() {
  for (let row = 0; row < GRID_SIZE; row++) {
    squares[row] = [];
    for (let col = 0; col < GRID_SIZE; col++) {
      squares[row][col] = createSquare(gridColors[row][col]);
    }
  }
}

function createSquare(color) {
  return {
    color,
    alpha: 255,
    fadeSpeed: random(0.5, 2),
    fadeDirection: -1,
    delay: random(500, 2000),
    startTime: millis(),
  };
}

function drawGrid() {
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      const square = squares[row][col];
      updateSquare(square);
      fill(applyAlpha(square.color, square.alpha));
      rect(col * squareSize, row * squareSize, squareSize, squareSize);
    }
  }
}

function updateSquare(square) {
  if (millis() > square.startTime + square.delay) {
    square.alpha += square.fadeDirection * square.fadeSpeed;
    if (square.alpha <= 0 || square.alpha >= 255) {
      square.fadeDirection *= -1;
      square.startTime = millis();
      square.delay = random(500, 2000);
    }
    square.alpha = constrain(square.alpha, 0, 255);
  }
}

function applyAlpha(colorHex, alpha) {
  const col = color(colorHex);
  col.setAlpha(alpha);
  return col;
}
