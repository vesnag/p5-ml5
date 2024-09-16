const { convertToInstanceModeFromString } = require('../convert');

test('convert p5.js sketch to instance mode', () => {
  const inputCode = `
const COLORS = {
  lavenderPurple: '#9151b0',
  lightPink: '#cb90d2',
  deepLavender: '#7260c3',
  royalPurple: '#6930a1',
  brightMagenta: '#8f49bb'
};
let squareSize;
function setup() {
  createCanvas(400, 400);
  noStroke();
  squareSize = width / 5;
}
function draw() {
  background(COLORS.white);
}
`;

  const expectedOutput = `
function(p) {
const COLORS = {
  lavenderPurple: '#9151b0',
  lightPink: '#cb90d2',
  deepLavender: '#7260c3',
  royalPurple: '#6930a1',
  brightMagenta: '#8f49bb'
};
let squareSize;
p.setup = function() {
  p.createCanvas(400, 400);
  p.noStroke();
  squareSize = p.width / 5;
};
p.draw = function() {
  p.background(COLORS.white);
};
}
  `;

  const outputCode = convertToInstanceModeFromString(inputCode).trim();

  const normalize = str =>
    str
      .replace(/\s+/g, ' ')
      .replace(/function\s+\(/g, 'function(')
      .trim();

  expect(normalize(outputCode)).toBe(normalize(expectedOutput));
});
