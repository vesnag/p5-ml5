let currentSketch = null;

const stopSnippet = () => {
  console.log('stopSnippet called');
  if (currentSketch) {
    currentSketch.remove();
    currentSketch = null;
    console.log('Current sketch removed');
  }

  document.getElementById('canvas-container').innerHTML = '';
  document.getElementById('select-message').style.display = 'flex';
  document.getElementById('stop-button').classList.add('hidden');
  console.log('Stop button hidden');
};

const loadSketch = (sketchPath) => {
  console.log('loadSketch called with path:', sketchPath);
  stopSnippet();

  fetch(sketchPath)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.text();
    })
    .then(code => {
      console.log('Sketch code fetched successfully');
      console.log('Fetched code:', code);

      const wrappedCode = `return (${code});`;
      try {
        const sketchFunction = new Function(wrappedCode)();
        currentSketch = new p5(sketchFunction, 'canvas-container');
        document.getElementById('select-message').style.display = 'none';
        document.getElementById('stop-button').classList.remove('hidden');
        console.log('New sketch loaded and stop button shown');
      } catch (error) {
        console.error('Error executing fetched code:', error);
        console.error('Fetched code:', code);
      }
    })
    .catch(error => console.error('Error loading sketch:', error));
};

const loadSketchAndScroll = (sketchPath) => {
  loadSketch(sketchPath);
  document.getElementById('snippet-player').scrollIntoView({ behavior: 'smooth' });
};
