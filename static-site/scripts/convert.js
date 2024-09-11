const acorn = require('acorn');
const astring = require('astring');
const fs = require('fs');

const nonP5Functions = [
  'console', 'setTimeout', 'setInterval', 'clearTimeout', 'clearInterval',
  'Math', 'Date', 'JSON', 'window', 'document', 'alert', 'prompt'
];

function transformAST(node, nonP5Functions) {
  if (node.type === 'Identifier' && !nonP5Functions.includes(node.name)) {
    return {
      type: 'MemberExpression',
      object: { type: 'Identifier', name: 'p' },
      property: { type: 'Identifier', name: node.name },
      computed: false
    };
  }

  if (node.type === 'FunctionDeclaration' || node.type === 'FunctionExpression') {
    if (node.id && node.id.name) {
      node.id = { type: 'Identifier', name: node.id.name };
    }
  }

  for (const key in node) {
    if (node[key] && typeof node[key] === 'object') {
      node[key] = transformAST(node[key], nonP5Functions);
    }
  }

  return node;
}

function convertToInstanceMode(inputFile, outputFile) {
  let code = fs.readFileSync(inputFile, 'utf8');
  const ast = acorn.parse(code, { ecmaVersion: 2020 });
  const transformedAST = transformAST(ast, nonP5Functions);
  const transformedCode = astring.generate(transformedAST);
  let instanceModeCode = `
let sketch = function(p) {
${transformedCode}
};
`;
  fs.writeFileSync(outputFile, instanceModeCode);
  console.log(`Conversion complete! Output written to ${outputFile}`);
}

const inputFile = process.argv[2];
const outputFile = process.argv[3];
convertToInstanceMode(inputFile, outputFile);
