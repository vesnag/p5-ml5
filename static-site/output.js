
let sketch = function(p) {
let p.x, p.y;
let p.xspeed, p.yspeed;
let p.radius = 50;
let p.confetti = [];
let p.slowFactor = 0.3;
let p.circleColor;
let p.isClicked = false;
let p.colorPalette = [{
  p.name: 'lavenderPurple',
  p.rgb: [145, 81, 176]
}, {
  p.name: 'lightPink',
  p.rgb: [203, 144, 210]
}, {
  p.name: 'deepLavender',
  p.rgb: [114, 96, 195]
}, {
  p.name: 'royalPurple',
  p.rgb: [105, 48, 161]
}, {
  p.name: 'brightMagenta',
  p.rgb: [143, 73, 187]
}, {
  p.name: 'softPink',
  p.rgb: [239, 161, 203]
}, {
  p.name: 'white',
  p.rgb: [255, 255, 255]
}, {
  p.name: 'darkPurple',
  p.rgb: [134, 53, 145]
}, {
  p.name: 'violet',
  p.rgb: [98, 62, 170]
}, {
  p.name: 'rosePink',
  p.rgb: [247, 116, 170]
}, {
  p.name: 'deepRed',
  p.rgb: [143, 41, 104]
}, {
  p.name: 'darkRed',
  p.rgb: [152, 37, 76]
}];
function undefined() {
  p.createCanvas;
  p.x = p.width / 2;
  p.y = p.height / 2;
  p.xspeed = p.random;
  p.yspeed = p.random;
  p.noStroke;
  p.circleColor = p.random.p.rgb;
}
function undefined() {
  p.background;
  p.moveCircle;
  p.displayCircle;
  p.checkCollision;
  p.displayConfetti;
}
function undefined() {
  const p.distance = p.dist;
  let p.tempXspeed = p.xspeed;
  let p.tempYspeed = p.yspeed;
  if (p.distance < p.radius) {
    p.tempXspeed *= p.slowFactor;
    p.tempYspeed *= p.slowFactor;
  }
  p.x += p.tempXspeed;
  p.y += p.tempYspeed;
}
function undefined() {
  p.fill;
  p.ellipse;
}
function undefined() {
  if (p.x + p.radius > p.width || p.x - p.radius < 0) {
    p.xspeed *= -1;
    p.changeCircleColor;
  }
  if (p.y + p.radius > p.height || p.y - p.radius < 0) {
    p.yspeed *= -1;
    p.changeCircleColor;
  }
}
function undefined() {
  if (!p.isClicked) {
    p.circleColor = p.random.p.rgb;
  }
}
function undefined() {
  const p.distance = p.dist;
  if (p.distance < p.radius) {
    p.isClicked = true;
    p.generateConfetti;
    setTimeout(() => {
      p.isClicked = false;
    }, 100);
  }
}
function undefined() {
  for (let p.i = 0; p.i < 100; p.i++) {
    p.confetti.p.push(new p.Confetti(p.x, p.y));
  }
}
function undefined() {
  for (let p.i = p.confetti.p.length - 1; p.i >= 0; p.i--) {
    p.confetti[p.i].p.update();
    p.confetti[p.i].p.display();
    if (p.confetti[p.i].p.isFinished()) {
      p.confetti.p.splice(p.i, 1);
    }
  }
}
class undefined {
  p.constructor(p.x, p.y) {
    this.p.x = p.x;
    this.p.y = p.y;
    this.p.size = p.random;
    this.p.xspeed = p.random;
    this.p.yspeed = p.random;
    this.p.alpha = 255;
    this.p.color = p.random.p.rgb;
  }
  p.update() {
    this.p.x += this.p.xspeed;
    this.p.y += this.p.yspeed;
    this.p.alpha -= 5;
  }
  p.display() {
    p.fill;
    p.rect;
  }
  p.isFinished() {
    return this.p.alpha <= 0;
  }
}

};
