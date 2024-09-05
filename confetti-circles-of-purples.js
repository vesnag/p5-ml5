let x, y;         // Variables for the circle's position
let xspeed, yspeed; // Variables for the speed of the circle
let radius = 50;   // Radius of the circle
let confetti = []; // Array to store the confetti particles
let slowFactor = 0.3;  // Slowdown factor when hovering over the circle
let circleColor;   // Variable to store the current color of the circle
let isClicked = false; // Track if the circle is clicked

// Extended color palette extracted from the image, focusing on purples
let colorPalette = [
  [255, 255, 255],  // White
  [231, 98, 179],   // Pinkish Purple
  [232, 99, 180],   // Pinkish Purple
  [236, 181, 221],  // Light Purple
  [233, 100, 181],  // Pinkish Purple
  [235, 96, 179],   // Pinkish Purple
  [237, 180, 221],  // Light Purple
  [230, 102, 177],  // Pinkish Purple
  [230, 180, 209],  // Light Pink
  [231, 187, 210]   // Light Pink
];

function setup() {
  createCanvas(600, 400);  // Create a 600x400 canvas
  x = width / 2;           // Start circle in the middle of the canvas
  y = height / 2;
  xspeed = random(2, 5);   // Random initial speed for x
  yspeed = random(2, 5);   // Random initial speed for y
  noStroke();              // Remove the outline of the circle
  circleColor = random(colorPalette);  // Set initial random color for the circle
}

function draw() {
  background(0);          // Set background to black

  // Check if the mouse is over the circle and apply slowdown
  let d = dist(mouseX, mouseY, x, y);
  let tempXspeed = xspeed;
  let tempYspeed = yspeed;

  if (d < radius) {
    tempXspeed *= slowFactor;  // Slow down temporarily
    tempYspeed *= slowFactor;
  }

  // Move the circle using the temporary speed values
  x += tempXspeed;
  y += tempYspeed;

  // Draw the circle with the current color
  fill(circleColor[0], circleColor[1], circleColor[2]);
  ellipse(x, y, radius * 2, radius * 2);

  // Check if the circle hits the edges of the canvas
  if (x + radius > width || x - radius < 0) {
    xspeed *= -1;          // Reverse the horizontal direction
    changeColor();         // Change the color when it hits the wall
  }

  if (y + radius > height || y - radius < 0) {
    yspeed *= -1;          // Reverse the vertical direction
    changeColor();         // Change the color when it hits the wall
  }

  // Display and update the confetti particles
  for (let i = confetti.length - 1; i >= 0; i--) {
    confetti[i].update();
    confetti[i].display();
    if (confetti[i].isFinished()) {
      confetti.splice(i, 1);  // Remove the confetti if it has faded out
    }
  }
}

// Function to change the color of the circle
function changeColor() {
  if (!isClicked) {
    circleColor = random(colorPalette);  // Set a new random color from the palette
  }
}

// Detect mouse click and check if the click is inside the circle
function mousePressed() {
  let d = dist(mouseX, mouseY, x, y);  // Distance between the mouse and the circle's center
  if (d < radius) {
    isClicked = true; // Track that the circle was clicked
    // If the circle is clicked, create confetti particles
    for (let i = 0; i < 100; i++) {
      confetti.push(new Confetti(x, y));
    }
    setTimeout(() => { isClicked = false; }, 100); // Reset after 100ms
  }
}

// Confetti particle class
class Confetti {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = random(5, 10);   // Random size for confetti
    this.xspeed = random(-3, 3); // Random horizontal speed
    this.yspeed = random(-3, 3); // Random vertical speed
    this.alpha = 255;            // Opacity starts at 255 (fully visible)
    // Set color of confetti using the color palette
    this.color = random(colorPalette);
  }

  // Update the confetti particle's position and fade it out
  update() {
    this.x += this.xspeed;
    this.y += this.yspeed;
    this.alpha -= 5;  // Reduce opacity to fade out the confetti
  }

  // Display the confetti particle
  display() {
    fill(this.color[0], this.color[1], this.color[2], this.alpha);
    rect(this.x, this.y, this.size, this.size);  // Draw each confetti as a small square
  }

  // Check if the confetti has faded out
  isFinished() {
    return this.alpha <= 0;
  }
}
