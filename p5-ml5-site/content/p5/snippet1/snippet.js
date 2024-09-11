function(p) {
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

  p.setup = function () {
    p.createCanvas(400, 400);
    x = p.width / 2;
    y = p.height / 2;
    xspeed = p.random(2, 5);
    yspeed = p.random(2, 5);
    p.noStroke();
    circleColor = p.random(colorPalette).rgb;
  };

  p.draw = function () {
    p.background(0);
    moveCircle();
    displayCircle();
    checkCollision();
    displayConfetti();
  };

  function moveCircle() {
    const distance = p.dist(p.mouseX, p.mouseY, x, y);
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
    p.fill(...circleColor);
    p.ellipse(x, y, radius * 2, radius * 2);
  }

  function checkCollision() {
    if (x + radius > p.width || x - radius < 0) {
      xspeed *= -1;
      changeCircleColor();
    }

    if (y + radius > p.height || y - radius < 0) {
      yspeed *= -1;
      changeCircleColor();
    }
  }

  function changeCircleColor() {
    if (!isClicked) {
      circleColor = p.random(colorPalette).rgb;
    }
  }

  p.mousePressed = function () {
    const distance = p.dist(p.mouseX, p.mouseY, x, y);
    if (distance < radius) {
      isClicked = true;
      generateConfetti();
      setTimeout(() => {
        isClicked = false;
      }, 100);
    }
  };

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
      this.size = p.random(5, 10);
      this.xspeed = p.random(-3, 3);
      this.yspeed = p.random(-3, 3);
      this.alpha = 255;
      this.color = p.random(colorPalette).rgb;
    }

    update() {
      this.x += this.xspeed;
      this.y += this.yspeed;
      this.alpha -= 5;
    }

    display() {
      p.fill(...this.color, this.alpha);
      p.rect(this.x, this.y, this.size, this.size);
    }

    isFinished() {
      return this.alpha <= 0;
    }
  }
}
