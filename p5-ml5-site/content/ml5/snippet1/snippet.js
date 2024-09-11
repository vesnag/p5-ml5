function(p) {
  p.setup = function () {
    p.createCanvas(400, 400);
    p.background(200);
    p.textSize(32);
    p.fill(0);
    p.text('Hello ML 1', 10, 30);
  };

  p.draw = function () {
    // No need to draw anything continuously for this example
  };
}
