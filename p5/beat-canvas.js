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

const frequencyBands = [
  { label: 'Bass', freq: 'bass', color: COLORS.brightMagenta },
  { label: 'Low Mid', freq: 'lowMid', color: COLORS.deepLavender },
  { label: 'Mid', freq: 'mid', color: COLORS.royalPurple },
  { label: 'High Mid', freq: 'highMid', color: COLORS.violet },
  { label: 'Treble', freq: 'treble', color: COLORS.softPink },
];

let mic, fft;
let lastLogTime = 0;
const logInterval = 1000; // Log every 1000 milliseconds (1 second)

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(RGB, 255);
  mic = new p5.AudioIn();
  mic.start();
  fft = new p5.FFT(0.8, 1024);
  fft.setInput(mic);
  background(0);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(16);
}

function draw() {
  background(0, 25);
  let spectrum = fft.analyze();

  let currentTime = millis();
  if (currentTime - lastLogTime > logInterval) {
    console.log('Full Spectrum:', spectrum);
    let energies = {};
    frequencyBands.forEach(band => {
      energies[band.label] = fft.getEnergy(band.freq);
    });
    console.log('Frequency Bands:', energies);
    lastLogTime = currentTime;
  }

  let numBars = frequencyBands.length;
  let barWidth = width / numBars;

  frequencyBands.forEach((band, index) => {
    let amp = fft.getEnergy(band.freq);
    let y = map(amp, 0, 255, height, 0);
    fill(band.color);
    rect(index * barWidth, y, barWidth - 2, height - y);
    fill(255);
    text(`${band.label}: ${amp}`, index * barWidth + barWidth / 2, height - 20);
  });
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
