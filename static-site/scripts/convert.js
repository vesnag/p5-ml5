const acorn = require('acorn');
const astring = require('astring');
const fs = require('fs');

const nonP5Functions = [
  'console', 'setTimeout', 'setInterval', 'clearTimeout', 'clearInterval',
  'Math', 'Date', 'JSON', 'window', 'document', 'alert', 'prompt', 'return',
];

const p5Functions = [
  'createCanvas', 'background', 'fill', 'stroke', 'noStroke', 'line', 'ellipse',
  'rect', 'text', 'textSize', 'textAlign', 'textWidth', 'noFill', 'color',
  'random', 'noise', 'map', 'dist', 'constrain', 'millis', 'frameCount',
  'push', 'pop', 'translate', 'rotate', 'scale',
];

const p5Properties = [
  'width', 'height', 'mouseX', 'mouseY', 'pmouseX', 'pmouseY',
  'frameCount', 'deltaTime', 'key', 'keyCode', 'keyIsPressed', 'mouseIsPressed',
];

const p5EventFunctions = [
  'setup', 'draw', 'mousePressed', 'mouseReleased', 'mouseMoved', 'mouseDragged',
  'keyPressed', 'keyReleased', 'windowResized',
];

const isP5Function = name => p5Functions.includes(name);
const isP5Property = name => p5Properties.includes(name);

const createP5MemberExpression = name => ({
  type: 'MemberExpression',
  object: { type: 'Identifier', name: 'p' },
  property: { type: 'Identifier', name },
  computed: false,
});

const transformAST = (node, currentFunctionParams = [], parent = null) => {
  if (!node) return node;

  if (node.type === 'FunctionDeclaration' || node.type === 'FunctionExpression') {
    const paramNames = node.params.map(param => param.name);
    const newFunctionParams = [...currentFunctionParams, ...paramNames];

    if (node.type === 'FunctionDeclaration' && node.id && p5EventFunctions.includes(node.id.name)) {
      return {
        type: 'ExpressionStatement',
        expression: {
          type: 'AssignmentExpression',
          operator: '=',
          left: createP5MemberExpression(node.id.name),
          right: {
            type: 'FunctionExpression',
            params: node.params,
            body: transformAST(node.body, [], node),
            id: null,
          },
        },
      };
    }

    node.body = transformAST(node.body, newFunctionParams, node);
    return node;
  }

  if (node.type === 'CallExpression') {
    node.callee = transformAST(node.callee, currentFunctionParams, node);
    node.arguments = node.arguments.map(arg => transformAST(arg, currentFunctionParams, node));
    return node;
  }

  if (node.type === 'MemberExpression') {
    node.object = transformAST(node.object, currentFunctionParams, node);
    node.property = transformAST(node.property, currentFunctionParams, node);
    return node;
  }

  if (node.type === 'Identifier') {
    if (currentFunctionParams.includes(node.name)) return node;

    const isPartOfMemberExpression = parent &&
      parent.type === 'MemberExpression' &&
      parent.property === node &&
      parent.object.type !== 'Identifier' &&
      parent.object.name !== 'p';

    if (isPartOfMemberExpression) return node;

    if (isP5Function(node.name) && !nonP5Functions.includes(node.name)) {
      return createP5MemberExpression(node.name);
    }

    if (isP5Property(node.name)) {
      return createP5MemberExpression(node.name);
    }
  }

  for (const [key, child] of Object.entries(node)) {
    if (Array.isArray(child)) {
      node[key] = child.map(c => (typeof c === 'object' && c !== null ? transformAST(c, currentFunctionParams, node) : c));
    } else if (child && typeof child === 'object') {
      node[key] = transformAST(child, currentFunctionParams, node);
    }
  }

  return node;
};

const convertToInstanceModeFromString = inputCode => {
  const ast = acorn.parse(inputCode, {
    ecmaVersion: 2020,
    sourceType: 'module',
  });

  const transformedAST = transformAST(ast);
  const transformedCode = astring.generate(transformedAST);

  return `
function(p) {
${transformedCode}
}
  `;
};

const convertToInstanceMode = (inputFile, outputFile) => {
  const inputCode = fs.readFileSync(inputFile, 'utf8');
  const instanceModeCode = convertToInstanceModeFromString(inputCode);
  fs.writeFileSync(outputFile, instanceModeCode, 'utf8');
  console.log(`Conversion complete! Output written to ${outputFile}`);
};

const [, , inputFile, outputFile] = process.argv;
if (inputFile && outputFile) {
  convertToInstanceMode(inputFile, outputFile);
} else {
  console.log('Usage: node convert.js <inputFile> <outputFile>');
}

module.exports = { convertToInstanceModeFromString };
