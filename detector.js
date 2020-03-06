let noise;
let fft;
let filter, filterFreq, filterWidth;
let width1 = 0
filterFreq = 10000

const ipcRenderer = require('electron').ipcRenderer

let laserfreq = document.getElementById('laserfreq')
let laserduty = document.getElementById('laserduty')
let lasersubmit = document.getElementById('detectorsubmit')

function setup() {
  let canvasWidth = document.getElementById('sketch-holder').offsetWidth
  width1 = canvasWidth
  let canvas = createCanvas(canvasWidth, 250);
  fill(255, 40, 255);

  canvas.parent('sketch-holder')

  filter = new p5.BandPass();

  noise = new p5.AudioIn();

  noise.disconnect(); // Disconnect soundfile from master output...
  filter.process(noise); // ...and connect to filter so we'll only hear BandPass.
  noise.start();

  fft = new p5.FFT();

  Plotly.plot('chart',[{
    y:[0,1,2,3,4,5,6,7,8],
    type:'line'
  }]);
}

function windowResized() {
  let canvasWidth = document.getElementById('sketch-holder').offsetWidth
  let height1 = canvasWidth/width1 * 250
  canvas = resizeCanvas(canvasWidth, height1);
  fill(255, 40, 255);
}

function startMic() {
  if (getAudioContext().state !== 'running') {
    getAudioContext().resume();
  }
}

function draw() {
  windowResized()
  
  background(30);

  startMic()

  filter.set(filterFreq, 5);

  // Draw every value in the FFT spectrum analysis where
  // x = lowest (10Hz) to highest (22050Hz) frequencies,
  // h = energy / amplitude at that frequency
  let spectrum = fft.analyze();
  noStroke();
  for (let i = 0; i < spectrum.length; i++) {
    let x = map(i, 0, spectrum.length, 0, width);
    let h = -height + map(spectrum[i], 0, 256, height, 0);
    rect(x, height, width / spectrum.length, h);
  }
  console.log(`Intensitas: ${Math.max(...spectrum)} dB`)
  
}

lasersubmit.addEventListener('click', (event) => {
  event.preventDefault() 

  let data = {
      laserfreq : laserfreq.value,
      laserduty : laserduty.value
  }
  ipcRenderer.send('submit-laser', data)

  console.log(data)

  filterFreq = Number(data.laserfreq)

  Plotly.newPlot('chart',[{
    y:fft.analyze(),
    type:'line'
  }]);
})