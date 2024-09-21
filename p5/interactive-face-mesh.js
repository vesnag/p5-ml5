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

const options = { maxFaces: 1, refineLandmarks: false, flipHorizontal: false };
let faceMesh;
let video;
let faces = [];

function preload() {
  faceMesh = ml5.faceMesh(options);
}

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();
  faceMesh.detectStart(video, gotFaces);
}

function draw() {
  image(video, 0, 0, width, height);

  noStroke();

  faces.forEach(face => {
    face.keypoints.forEach((keypoint, index) => {
      // Select a color from COLORS based on the keypoint index
      const colorKeys = Object.keys(COLORS);
      const color = COLORS[colorKeys[index % colorKeys.length]];
      fill(color);
      circle(keypoint.x, keypoint.y, 5);
    });
  });
}

function gotFaces(results) {
  faces = results;
}
