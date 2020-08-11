const ipcRenderer = require('electron').ipcRenderer

let laserfreq = document.getElementById('laserfreq')
let laserduty = document.getElementById('laserduty')

let range = document.getElementById('range')
let xaxis = document.getElementById('xaxis')
let yaxis = document.getElementById('yaxis')
let delay = document.getElementById('delay')

let abortbutton = document.getElementById('abortbutton')

let patsubmit = document.getElementById('patsubmit')

let abortMotor = false

let maxInt = 0
let filterFreq = 10000

let arrPat = []

function setup() {
  
    filter = new p5.BandPass();
  
    noise = new p5.AudioIn();
  
    noise.disconnect(); // Disconnect soundfile from master output...
    filter.process(noise); // ...and connect to filter so we'll only hear BandPass.
    noise.start();
  
    fft = new p5.FFT();
  }
  
  
  function startMic() {
    if (getAudioContext().state !== 'running') {
      getAudioContext().resume();
    }
  }
  
  function draw() {
  
    startMic()
  
    filter.set(filterFreq, 5);
    let spectrum = fft.analyze();
    noStroke();
    for (let i = 0; i < spectrum.length; i++) {
      let x = map(i, 0, spectrum.length, 0, width);
      let h = -height + map(spectrum[i], 0, 255, height, 0);
      rect(x, height, width / spectrum.length, h);
    }

    maxInt = fft.getEnergy(filterFreq-500, filterFreq+500)
  }

patsubmit.addEventListener('click', (event) => {
    event.preventDefault()

    let data = {
        laserfreq : laserfreq.value,
        laserduty : laserduty.value
    }

    let motorData = {
        xaxis : xaxis.value,
        yaxis : yaxis.value,
        delay : delay.value
    }

    if (range.value * 10 % 2 != 0) {
        alert('Range harus bernilai kelipatan 0.2')
    }
    else if (data.laserfreq == 0) {
        alert('Frekuensi harus diisi')
    }
    else if (data.laserduty == 0) {
        alert('Dutycycle harus diisi')
    }
    else {
        arrPat = []
        filterFreq = Number(data.laserfreq)
        ipcRenderer.send('submit-laser', data)
        ipcRenderer.send('stepmotor-savestep', range.value)

        function sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
          }
          
          async function runMotor(motorData) {
          
            let toRight = true
          
              for (let i = 0; i < motorData.yaxis; i++) {
                if(abortMotor) {
                  break
                }
          
                for (j = 0; j < motorData.xaxis-1; j++) {
                  if(abortMotor) {
                    break
                  }
          
                  if(i == 0 && j == 0) {
                    await sleep(motorData.delay)
                    arrPat.push(maxInt)
                    console.log('intencity', maxInt)
                  }
                  
                  if(toRight) {
                    ipcRenderer.send('stepmotor-right')
                    await sleep(motorData.delay)
                    arrPat.push(maxInt)
                    console.log('intencity', maxInt)
                  }
                  else{
                    ipcRenderer.send('stepmotor-left')
                    await sleep(motorData.delay)
                    arrPat.push(maxInt)
                    console.log('intencity', maxInt)
                  }
                }
                toRight = !toRight
                ipcRenderer.send('stepmotor-down')
                await sleep(motorData.delay)
                arrPat.push(maxInt)
                console.log('intencity', maxInt)
              }
              abortMotor = false;
              console.log("Capturing Done", arrPat)
          }
      
          runMotor(motorData);
    }

  })

abortbutton.addEventListener('click', (event) => {
    event.preventDefault() 
    console.log('abort button kepencet')
    abortMotor = true
  })