// Define color variables
const lavenderPurple = '#9151b0';
const lightPink = '#cb90d2';
const deepLavender = '#7260c3';
const royalPurple = '#6930a1';
const brightMagenta = '#8f49bb';
const softPink = '#efa1cb';
const white = '#FFFFFF';
const darkPurple = '#863591';
const violet = '#623eaa';
const rosePink = '#f774aa';
const deepRed = '#8f2968';
const darkRed = '#98254c';

// Define gridColors array using the named color variables
const gridColors = [
  [lavenderPurple, lightPink, deepLavender, royalPurple, brightMagenta], // Row 1
  [softPink, brightMagenta, white, darkPurple, violet], // Row 2
  [white, white, white, white, white], // Row 3
  [white, white, rosePink, white, white], // Row 4
  [deepRed, white, white, white, darkRed]  // Row 5
];

let gridSize = 5;
let squareSize;
let squares = []; // Array to store square objects with fade info

function setup() {
  createCanvas(460, 460);
  noStroke();

  // Calculate square size dynamically based on canvas and grid size
  squareSize = width / gridSize;

  // Initialize each square with its color, random fade-in/out timing, and alpha
  for (let row = 0; row < gridSize; row++) {
    squares[row] = [];
    for (let col = 0; col < gridSize; col++) {
      squares[row][col] = {
        color: gridColors[row][col],
        alpha: 255,
        fadeSpeed: random(0.5, 2), // Random fade speed for each square
        fadeDirection: -1, // Start with fading out
        delay: random(500, 2000), // Random delay before starting to fade
        startTime: millis() // Record when the square starts its fade
      };
    }
  }
}

function draw() {
  background(255); // White background

  // Loop through grid and apply fade animation to each square
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      let square = squares[row][col];

      // Check if enough time has passed for the square to start fading
      if (millis() > square.startTime + square.delay) {
        // Update alpha based on fade direction (in or out)
        square.alpha += square.fadeDirection * square.fadeSpeed;

        // Reverse fade direction when fully transparent or fully visible
        if (square.alpha <= 0 || square.alpha >= 255) {
          square.fadeDirection *= -1;
          square.startTime = millis(); // Reset the start time after a complete fade
          square.delay = random(500, 2000); // New random delay before next fade
        }

        // Clamp alpha between 0 and 255 to prevent overflow
        square.alpha = constrain(square.alpha, 0, 255);
      }

      // Apply the fade and draw the square
      fill(colorWithAlpha(square.color, square.alpha));
      rect(col * squareSize, row * squareSize, squareSize, squareSize);
    }
  }
}

// Helper function to apply alpha to a color
function colorWithAlpha(c, alpha) {
  let col = color(c);
  col.setAlpha(alpha);
  return col;
}
