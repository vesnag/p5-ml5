let x, y;
let xspeed, yspeed;
let radius = 50;
let confetti = [];
let slowFactor = 0.3;
let circleColor;
let isClicked = false;

let colorPalette = [
  { name: 'lavenderPurple', rgb: [145, 81, 176] }, // #9151b0
  { name: 'lightPink', rgb: [203, 144, 210] },     // #cb90d2
  { name: 'deepLavender', rgb: [114, 96, 195] },   // #7260c3
  { name: 'royalPurple', rgb: [105, 48, 161] },    // #6930a1
  { name: 'brightMagenta', rgb: [143, 73, 187] },  // #8f49bb
  { name: 'softPink', rgb: [239, 161, 203] },      // #efa1cb
  { name: 'white', rgb: [255, 255, 255] },         // #FFFFFF
  { name: 'darkPurple', rgb: [134, 53, 145] },     // #863591
  { name: 'violet', rgb: [98, 62, 170] },          // #623eaa
  { name: 'rosePink', rgb: [247, 116, 170] },      // #f774aa
  { name: 'deepRed', rgb: [143, 41, 104] },        // #8f2968
  { name: 'darkRed', rgb: [152, 37, 76] }          // #98254c
];

function setup() {
  createCanvas(600, 400);
  x = width / 2;
  y = height / 2;
  xspeed = random(2, 5);
  yspeed = random(2, 5);
  noStroke();
  circleColor = random(colorPalette).rgb;
}

function draw() {
  background(0);
  moveCircle();
  displayCircle();
  checkCollision();
  displayConfetti();
}

function moveCircle() {
  const distance = dist(mouseX, mouseY, x, y);
  let tempXspeed = xspeed;
  let tempYspeed = yspeed;

  if (distance < radius) {
    tempXspeed *= slowFactor;
    tempYspeed *= slowFactor;
  }

  x += tempXspeed;
  y += tempYspeed;
}

function displayCircle() {
  fill(...circleColor);
  ellipse(x, y, radius * 2, radius * 2);
}

function checkCollision() {
  if (x + radius > width || x - radius < 0) {
    xspeed *= -1;
    changeCircleColor();
  }

  if (y + radius > height || y - radius < 0) {
    yspeed *= -1;
    changeCircleColor();
  }
}

function changeCircleColor() {
  if (!isClicked) {
    circleColor = random(colorPalette).rgb;
  }
}

function mousePressed() {
  const distance = dist(mouseX, mouseY, x, y);
  if (distance < radius) {
    isClicked = true;
    generateConfetti();
    setTimeout(() => {
      isClicked = false;
    }, 100);
  }
}

function generateConfetti() {
  for (let i = 0; i < 100; i++) {
    confetti.push(new Confetti(x, y));
  }
}

function displayConfetti() {
  for (let i = confetti.length - 1; i >= 0; i--) {
    confetti[i].update();
    confetti[i].display();
    if (confetti[i].isFinished()) {
      confetti.splice(i, 1);
    }
  }
}

class Confetti {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = random(5, 10);
    this.xspeed = random(-3, 3);
    this.yspeed = random(-3, 3);
    this.alpha = 255;
    this.color = random(colorPalette).rgb;
  }

  update() {
    this.x += this.xspeed;
    this.y += this.yspeed;
    this.alpha -= 5;
  }

  display() {
    fill(...this.color, this.alpha);
    rect(this.x, this.y, this.size, this.size);
  }

  isFinished() {
    return this.alpha <= 0;
  }
}
