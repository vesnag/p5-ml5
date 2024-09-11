let sketch = function (p) {
  let x, y;
  let xspeed, yspeed;
  let radius = 50;
  let confetti = [];
  let slowFactor = 0.3;
  let circleColor;
  let isClicked = false;
  let colorPalette = [{
    name: 'lavenderPurple',
    rgb: [145, 81, 176]
  }, {
    name: 'lightPink',
    rgb: [203, 144, 210]
  }, {
    name: 'deepLavender',
    rgb: [114, 96, 195]
  }, {
    name: 'royalPurple',
    rgb: [105, 48, 161]
  }];

  p.setup = function () {
    p.createCanvas(400, 400);
    x = p.width / 2;
    y = p.height / 2;
    xspeed = p.random(-2, 2);
    yspeed = p.random(-2, 2);
    circleColor = p.color(255, 0, 0);
  };

  p.draw = function () {
    p.background(220);
    p.fill(circleColor);
    p.ellipse(x, y, radius, radius);
    x += xspeed;
    y += yspeed;

    if (x > p.width || x < 0) {
      xspeed *= -1;
    }
    if (y > p.height || y < 0) {
      yspeed *= -1;
    }
  };

  p.mousePressed = function () {
    if (p.dist(p.mouseX, p.mouseY, x, y) < radius / 2) {
      isClicked = !isClicked;
      circleColor = isClicked ? p.color(0, 255, 0) : p.color(255, 0, 0);
    }
  };
};
