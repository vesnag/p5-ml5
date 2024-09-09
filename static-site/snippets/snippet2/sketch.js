let sketch = function (p) {
  let x = 0;
  let speed = 3;

  p.setup = function () {
    p.createCanvas(400, 400);
    p.background(255);
  };

  p.draw = function () {
    p.background(255);
    p.fill(150, 0, 255);
    p.ellipse(x, p.height / 2, 50, 50);
    x += speed;
    if (x > p.width || x < 0) {
      speed *= -1;
    }
  };
};
