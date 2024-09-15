const acorn = require('acorn');
const astring = require('astring');
const fs = require('fs');

// List of functions and objects to ignore (non-p5 functions)
const nonP5Functions = [
  'console', 'setTimeout', 'setInterval', 'clearTimeout', 'clearInterval',
  'Math', 'Date', 'JSON', 'window', 'document', 'alert', 'prompt', 'return'
];

// List of known global p5 functions and properties
const p5Functions = [
  'createCanvas', 'text', 'fill', 'background', 'ellipse', 'rect', 'random', 'dist',
  'width', 'height', 'mouseX', 'mouseY', 'noStroke', 'stroke', 'line', 'color',
  'textSize', 'textWidth', 'noFill', 'mousePressed', 'mouseReleased',
  'keyPressed', 'keyReleased', 'windowResized', 'constrain', 'millis', 'setAlpha'
];

// Check if a node represents a function that needs to be attached to "p"
function isEventFunction(funcName) {
  return ['setup', 'draw', 'mousePressed', 'mouseReleased', 'keyPressed', 'keyReleased'].includes(funcName);
}

// Traverse and transform the AST to add the "p." prefix to p5 functions, except inside classes and custom objects
function transformAST(node, parentType, currentFunctionParams = []) {
  if (node === null) return node;

  // If the node is an identifier (variable or function), check if it needs transformation
  if (node.type === 'Identifier' && !nonP5Functions.includes(node.name)) {
    // Do not modify function parameters
    if (!currentFunctionParams.includes(node.name)) {
      if (p5Functions.includes(node.name) && parentType !== 'MemberExpression' && parentType !== 'ClassBody') {
        // Transform p5.js functions and variables into "p." prefixed versions
        return {
          type: 'MemberExpression',
          object: { type: 'Identifier', name: 'p' },
          property: { type: 'Identifier', name: node.name },
          computed: false
        };
      }
    }
  }

  if (node.type === 'FunctionDeclaration') {
    if (isEventFunction(node.id?.name)) {
      // Attach setup, draw, and event functions to the p object
      node.type = 'ExpressionStatement';
      node.expression = {
        type: 'AssignmentExpression',
        operator: '=',
        left: {
          type: 'MemberExpression',
          object: { type: 'Identifier', name: 'p' },
          property: { type: 'Identifier', name: node.id.name },
          computed: false
        },
        right: {
          type: 'FunctionExpression',
          id: null,
          params: node.params,
          body: node.body,
          generator: false,
          async: false
        }
      };
      delete node.id; // Remove the function name since it’s now an assignment
    }
  }

  if (node.type === 'FunctionExpression' || node.type === 'FunctionDeclaration') {
    // Collect the parameter names for the current function
    const paramNames = node.params.map(param => param.name);
    currentFunctionParams.push(...paramNames);
  }

  if (node.type === 'MemberExpression' && node.object.type === 'ThisExpression') {
    // Skip transformations for "this" object properties
    return node;
  }

  // Recursively transform all child nodes
  for (const key in node) {
    if (node[key] && typeof node[key] === 'object') {
      if (Array.isArray(node[key])) {
        node[key] = node[key].map(child => transformAST(child, node.type, currentFunctionParams));
      } else {
        node[key] = transformAST(node[key], node.type, currentFunctionParams);
      }
    }
  }

  return node;
}

// Function to convert p5.js sketch to instance mode
function convertToInstanceMode(inputFile, outputFile) {
  // Read the input file
  let code = fs.readFileSync(inputFile, 'utf8');

  // Parse the code into an AST
  const ast = acorn.parse(code, { ecmaVersion: 2020, sourceType: 'module' });

  // Transform the AST
  const transformedAST = transformAST(ast);

  // Generate the modified code from the AST
  const transformedCode = astring.generate(transformedAST);

  // Wrap the transformed code in the p5 instance mode function
  const instanceModeCode = `
function(p) {
${transformedCode}
}
`;

  // Write the transformed code to the output file
  fs.writeFileSync(outputFile, instanceModeCode, 'utf8');
  console.log(`Conversion complete! Output written to ${outputFile}`);
}

// CLI usage: node convert.js inputSketch.js outputSketch.js
const inputFile = process.argv[2];
const outputFile = process.argv[3];
if (inputFile && outputFile) {
  convertToInstanceMode(inputFile, outputFile);
} else {
  console.log('Usage: node convert.js <inputFile> <outputFile>');
}
