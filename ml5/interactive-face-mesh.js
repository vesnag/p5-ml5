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
