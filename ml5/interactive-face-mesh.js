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

const faceMeshOptions = { maxFaces: 1, refineLandmarks: false, flipHorizontal: false };
let faceMesh, video, faces = [];
let mic, fft;
let bgColor = COLORS.white;
const colorKeys = Object.keys(COLORS);

class Particle {
  constructor(x, y, velocity, size, color) {
    this.pos = createVector(x, y);
    this.vel = velocity;
    this.size = size;
    this.color = color;
    this.lifespan = 255;
  }

  update() {
    this.pos.add(this.vel);
    this.lifespan -= 4;
  }

  display() {
    noStroke();
    fill(this.color.r, this.color.g, this.color.b, this.lifespan);
    ellipse(this.pos.x, this.pos.y, this.size);
  }

  isDead() {
    return this.lifespan < 0;
  }
}

let particles = [];

function preload() {
  faceMesh = ml5.faceMesh(faceMeshOptions);
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();
  faceMesh.detectStart(video, gotFaces);
  mic = new p5.AudioIn();
  mic.start();
  fft = new p5.FFT(0.8, 64);
  fft.setInput(mic);
}

function gotFaces(results) {
  faces = results;
  faceMesh.detectStart(video, gotFaces);
}

function draw() {
  const spectrum = fft.analyze();
  const amplitude = fft.getEnergy("bass");
  bgColor = getBackgroundColor(amplitude);
  background(bgColor);
  image(video, 0, 0, width, height);
  noStroke();
  faces.forEach(face => {
    face.keypoints.forEach((keypoint, index) => {
      fill(COLORS[colorKeys[index % colorKeys.length]]);
      circle(keypoint.x, keypoint.y, 5);
    });
  });
  drawFrequencyBars(spectrum);


  // Particle system
  const mouth = faces.length > 0 ? faces[0].keypoints[13] : null;
  if (mouth && amplitude > 100) {
    const vel = p5.Vector.random2D().mult(map(amplitude, 100, 255, 1, 5));
    const size = map(amplitude, 100, 255, 5, 15);
    const color = { r: 255, g: 0, b: 150 };
    particles.push(new Particle(mouth.x, mouth.y, vel, size, color));
  }


  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].display();
    if (particles[i].isDead()) {
      particles.splice(i, 1);
    }
  }
}

function getBackgroundColor(amplitude) {
  if (amplitude > 200) return COLORS.deepLavender;
  if (amplitude > 150) return COLORS.brightMagenta;
  if (amplitude > 100) return COLORS.lightPink;
  if (amplitude > 50) return COLORS.softPink;
  return COLORS.white;
}

function drawFrequencyBars(spectrum) {
  noStroke();
  const numBars = spectrum.length;
  const barWidth = width / numBars;
  for (let i = 0; i < numBars; i++) {
    const amplitude = spectrum[i];
    const y = map(amplitude, 0, 255, height, 0);
    fill(COLORS[colorKeys[i % colorKeys.length]]);
    rect(i * barWidth, y, barWidth - 2, height - y);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
