
let sketch = function(p) {
const p.COLORS = {
  p.lavenderPurple: '#9151b0',
  p.lightPink: '#cb90d2',
  p.deepLavender: '#7260c3',
  p.royalPurple: '#6930a1',
  p.brightMagenta: '#8f49bb',
  p.softPink: '#efa1cb',
  p.white: '#FFFFFF',
  p.darkPurple: '#863591',
  p.violet: '#623eaa',
  p.rosePink: '#f774aa',
  p.deepRed: '#8f2968',
  p.darkRed: '#98254c'
};
const p.gridColors = [[p.COLORS.p.lavenderPurple, p.COLORS.p.lightPink, p.COLORS.p.deepLavender, p.COLORS.p.royalPurple, p.COLORS.p.brightMagenta], [p.COLORS.p.softPink, p.COLORS.p.brightMagenta, p.COLORS.p.white, p.COLORS.p.darkPurple, p.COLORS.p.violet], [p.COLORS.p.white, p.COLORS.p.white, p.COLORS.p.white, p.COLORS.p.white, p.COLORS.p.white], [p.COLORS.p.white, p.COLORS.p.white, p.COLORS.p.rosePink, p.COLORS.p.white, p.COLORS.p.white], [p.COLORS.p.deepRed, p.COLORS.p.white, p.COLORS.p.white, p.COLORS.p.white, p.COLORS.p.darkRed]];
const p.GRID_SIZE = 5;
let p.squareSize;
const p.squares = [];
function undefined() {
  p.createCanvas(460, 460);
  p.noStroke();
  p.squareSize = p.width / p.GRID_SIZE;
  p.initializeSquares();
}
function undefined() {
  p.background(p.COLORS.p.white);
  p.drawGrid();
}
function undefined() {
  for (let p.row = 0; p.row < p.GRID_SIZE; p.row++) {
    p.squares[p.row] = [];
    for (let p.col = 0; p.col < p.GRID_SIZE; p.col++) {
      p.squares[p.row][p.col] = p.createSquare(p.gridColors[p.row][p.col]);
    }
  }
}
function undefined(p.color) {
  return {
    p.color,
    p.alpha: 255,
    p.fadeSpeed: p.random(0.5, 2),
    p.fadeDirection: -1,
    p.delay: p.random(500, 2000),
    p.startTime: p.millis()
  };
}
function undefined() {
  for (let p.row = 0; p.row < p.GRID_SIZE; p.row++) {
    for (let p.col = 0; p.col < p.GRID_SIZE; p.col++) {
      const p.square = p.squares[p.row][p.col];
      p.updateSquare(p.square);
      p.fill(p.applyAlpha(p.square.p.color, p.square.p.alpha));
      p.rect(p.col * p.squareSize, p.row * p.squareSize, p.squareSize, p.squareSize);
    }
  }
}
function undefined(p.square) {
  if (p.millis() > p.square.p.startTime + p.square.p.delay) {
    p.square.p.alpha += p.square.p.fadeDirection * p.square.p.fadeSpeed;
    if (p.square.p.alpha <= 0 || p.square.p.alpha >= 255) {
      p.square.p.fadeDirection *= -1;
      p.square.p.startTime = p.millis();
      p.square.p.delay = p.random(500, 2000);
    }
    p.square.p.alpha = p.constrain(p.square.p.alpha, 0, 255);
  }
}
function undefined(p.colorHex, p.alpha) {
  const p.col = p.color(p.colorHex);
  p.col.p.setAlpha(p.alpha);
  return p.col;
}

};
