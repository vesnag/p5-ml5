
# p5.js Global to Instance Mode Converter

This repository contains a script that automatically converts **p5.js** sketches from **global mode** to **instance mode**. The instance mode allows multiple sketches to run on the same page by prefixing p5.js functions with a `p.` instance.

The **`convert.js`** script uses an Abstract Syntax Tree (AST) to transform p5.js sketches by adding the necessary `p.` prefixes.

## Installation

Ensure that **Node.js** is installed. Then, install the required libraries:

```bash
npm install acorn astring
```

## Usage

1. Place the p5.js global mode sketch in a file (e.g., `inputFile.js`). An example sketch:

   ```javascript
   function setup() {
     createCanvas(400, 400);
     background(220);
   }

   function draw() {
     ellipse(mouseX, mouseY, 50, 50);
   }
   ```

2. Run the `convert.js` script using Node.js. Specify the input file (the original sketch) and the output file (the converted instance mode version):

   ```bash
   node convert.js inputFile.js outputFile.js
   ```

3. The output file will contain the converted sketch in instance mode:

   ```javascript
   let sketch = function(p) {
     p.setup = function() {
       p.createCanvas(400, 400);
       p.background(220);
     };

     p.draw = function() {
       p.ellipse(p.mouseX, p.mouseY, 50, 50);
     };
   };
   ```

## Linting

To lint the JavaScript files in the project, use the following command:
```
npx eslint ../p5-ml5-site/content/p5/**/*.js
```

## Limitations

- Functions that are not part of p5.js (e.g., `console.log`, `Math.random`) are not prefixed with `p.` and are automatically excluded.
- Custom global functions or third-party libraries may need to be added to the exclusion list manually in the script.
