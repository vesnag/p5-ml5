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
  'noStroke', 'stroke', 'line', 'color', 'textSize', 'textWidth', 'noFill',
  'constrain', 'millis', 'setAlpha'
];

// List of p5.js properties
const p5Properties = ['width', 'height', 'mouseX', 'mouseY'];

// List of p5.js event functions that need to be assigned to `p`
const p5EventFunctions = [
  'setup', 'draw', 'mousePressed', 'mouseReleased', 'keyPressed', 'keyReleased'
];

// Check if a name is a p5.js function
function isP5Function(name) {
  return p5Functions.includes(name);
}

// Check if a name is a p5.js property
function isP5Property(name) {
  return p5Properties.includes(name);
}

// Transform the AST to add `p.` prefix to p5.js functions and properties
function transformAST(node, currentFunctionParams = [], parent = null) {
  if (node === null) return node;

  // Handle function declarations and expressions
  if (
    node.type === 'FunctionDeclaration' ||
    node.type === 'FunctionExpression'
  ) {
    const paramNames = node.params.map(param => param.name);
    const newFunctionParams = currentFunctionParams.concat(paramNames);

    // If it's an event function like 'setup' or 'draw', and needs to be attached to 'p'
    if (
      node.type === 'FunctionDeclaration' &&
      p5EventFunctions.includes(node.id.name)
    ) {
      // Transform function setup() {} into p.setup = function() {}
      return {
        type: 'ExpressionStatement',
        expression: {
          type: 'AssignmentExpression',
          operator: '=',
          left: {
            type: 'MemberExpression',
            object: { type: 'Identifier', name: 'p' },
            property: { type: 'Identifier', name: node.id.name },
            computed: false,
          },
          right: {
            type: 'FunctionExpression',
            params: node.params,
            body: transformAST(node.body, [], node),
            id: null,
          },
        },
      };
    } else {
      // For other functions, recursively transform the body with the new parameter scope
      node.body = transformAST(node.body, newFunctionParams, node);
      return node;
    }
  }

  // Handle function calls
  if (node.type === 'CallExpression') {
    // Transform the callee
    node.callee = transformAST(node.callee, currentFunctionParams, node);
    // Transform the arguments
    node.arguments = node.arguments.map(arg =>
      transformAST(arg, currentFunctionParams, node)
    );
    return node;
  }

  // Handle member expressions
  if (node.type === 'MemberExpression') {
    node.object = transformAST(node.object, currentFunctionParams, node);
    node.property = transformAST(node.property, currentFunctionParams, node);
    return node;
  }

  // Handle identifiers
  if (node.type === 'Identifier') {
    // Do not modify function parameters
    if (!currentFunctionParams.includes(node.name)) {
      // Avoid modifying properties of other objects (e.g., COLORS.white)
      if (
        !(
          parent &&
          parent.type === 'MemberExpression' &&
          parent.property === node &&
          parent.object.type !== 'Identifier' &&
          parent.object.name !== 'p'
        )
      ) {
        if (isP5Function(node.name) && !nonP5Functions.includes(node.name)) {
          // Prefix p5.js functions
          return {
            type: 'MemberExpression',
            object: { type: 'Identifier', name: 'p' },
            property: { type: 'Identifier', name: node.name },
            computed: false,
          };
        } else if (isP5Property(node.name)) {
          // Prefix p5.js properties
          return {
            type: 'MemberExpression',
            object: { type: 'Identifier', name: 'p' },
            property: { type: 'Identifier', name: node.name },
            computed: false,
          };
        }
      }
    }
  }

  // Recursively transform child nodes
  for (const key in node) {
    if (node.hasOwnProperty(key)) {
      const child = node[key];
      if (Array.isArray(child)) {
        node[key] = child.map(c =>
          typeof c === 'object' ? transformAST(c, currentFunctionParams, node) : c
        );
      } else if (child && typeof child === 'object') {
        node[key] = transformAST(child, currentFunctionParams, node);
      }
    }
  }

  return node;
}

// Function to convert p5.js sketch code to instance mode (input/output as strings)
function convertToInstanceModeFromString(inputCode) {
  // Parse the code into an AST
  const ast = acorn.parse(inputCode, {
    ecmaVersion: 2020,
    sourceType: 'module',
  });

  // Transform the AST
  const transformedAST = transformAST(ast);

  // Generate the modified code from the AST
  const transformedCode = astring.generate(transformedAST);

  // Wrap the transformed code in the p5 instance mode function
  return `
function(p) {
${transformedCode}
}
  `;
}

// Export the function for testing
module.exports = { convertToInstanceModeFromString };
