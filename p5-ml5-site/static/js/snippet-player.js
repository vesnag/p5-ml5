let currentSketch = null;

const stopSnippet = () => {
  console.log('stopSnippet called');
  if (currentSketch) {
    currentSketch.remove();
    currentSketch = null;
    console.log('Current sketch removed');
  }

  document.getElementById('player-container').innerHTML = '<p class="text-softPink">Select a snippet to run</p>';
  document.getElementById('stop-button').classList.add('hidden');
  console.log('Stop button hidden');
};

const loadSketch = (sketchPath) => {
  console.log('loadSketch called with path:', sketchPath);
  stopSnippet(); // Ensure any existing sketch is stopped

  fetch(sketchPath)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.text();
    })
    .then(code => {
      console.log('Sketch code fetched successfully');
      console.log('Fetched code:', code); // Log the fetched code for debugging

      // Wrap the fetched code in a named function
      const wrappedCode = `return (${code});`;
      try {
        const sketchFunction = new Function(wrappedCode)();
        currentSketch = new p5(sketchFunction, 'player-container'); // Ensure the sketch is attached to the correct container
        document.getElementById('stop-button').classList.remove('hidden');
        console.log('New sketch loaded and stop button shown');
      } catch (error) {
        console.error('Error executing fetched code:', error);
      }
    })
    .catch(error => console.error('Error loading sketch:', error));
};

//
