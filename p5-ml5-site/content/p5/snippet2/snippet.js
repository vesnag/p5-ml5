function(p) {
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

  p.setup = function () {
    p.createCanvas(460, 460);
    p.noStroke();
    squareSize = p.width / GRID_SIZE;
    initializeSquares();
  };

  p.draw = function () {
    p.background(COLORS.white);
    drawGrid();
  };

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
      fadeSpeed: p.random(0.5, 2),
      fadeDirection: -1,
      delay: p.random(500, 2000),
      startTime: p.millis(),
    };
  }

  function drawGrid() {
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        const square = squares[row][col];
        updateSquare(square);
        p.fill(applyAlpha(square.color, square.alpha));
        p.rect(col * squareSize, row * squareSize, squareSize, squareSize);
      }
    }
  }

  function updateSquare(square) {
    if (p.millis() > square.startTime + square.delay) {
      square.alpha += square.fadeDirection * square.fadeSpeed;
      if (square.alpha <= 0 || square.alpha >= 255) {
        square.fadeDirection *= -1;
        square.startTime = p.millis();
        square.delay = p.random(500, 2000);
      }
      square.alpha = p.constrain(square.alpha, 0, 255);
    }
  }

  function applyAlpha(colorHex, alpha) {
    const col = p.color(colorHex);
    col.setAlpha(alpha);
    return col;
  }
}
