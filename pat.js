const ipcRenderer = require('electron').ipcRenderer
const {dialog} = require('electron').remote
const fs = require('fs')

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

//Define RAW array
let arrPat = []

//Define array for Ploting
let arrNormal = []
let arrNearest = []

function assignArray(x, y, array) {
  array.pop()
  let result = []
  let arrayTemp = []
  let counter = 0
  let reverse = false

  for (i = 0; i < array.length; i++) {
      counter++
      arrayTemp.push(array[i])
      if (counter == x) {
          counter = 0
          if(reverse) {
              result.push(arrayTemp.reverse())
              reverse = false
          }
          else {
              result.push(arrayTemp)
              reverse = true
          }
          arrayTemp = []
      }
  }
  console.log('assign array jalan', array)
  return result.reverse()
}

function assignArrayNearest(array) {
  let result = []
  for (let i = 0; i < array.length; i++) {
    let arrayTemp = []
    for (let j = 0; j < array[i].length; j++) {
      arrayTemp.push(array[i][j])
      arrayTemp.push(array[i][j])
    }
    result.push(arrayTemp)
    result.push(arrayTemp)
  }
  return result
}

function convertCSV(array) {
  let result = []
  array.forEach(element => {
    result.push(element.join(","))
  });

  return result.join('\n')
}

function plotHeatmap(array, title, div) {
  var data = [ {
    z: array,
    type: 'heatmap',
    zsmooth: 'best'
  }];
  
  var layout = {
    title: title,
    xaxis: {
      scaleanchor: "y",
      constrain: "domain",
      constraintoward: "left",
      showgrid: false, 
      zeroline: false,
      visible: false
    },
    yaxis: {
      scaleanchor: "x",
      constrain: "domain",
      showgrid: false, 
      zeroline: false,
      visible: false
    },
    width: 900,
    height: 900
  };
  
  Plotly.newPlot(div, data, layout);
}

function setup() {
  
    // filter = new p5.BandPass();
  
    noise = new p5.AudioIn();
  
    // noise.disconnect(); // Disconnect soundfile from master output...
    // filter.process(noise); // ...and connect to filter so we'll only hear BandPass.
    noise.start();
  
    fft = new p5.FFT();
    fft.setInput(noise);
  }
  
  
  function startMic() {
    if (getAudioContext().state !== 'running') {
      getAudioContext().resume();
    }
  }
  
  function draw() {
  
    startMic()
  
    // filter.set(filterFreq, 5);
    // let spectrum = fft.analyze();
    // noStroke();
    // for (let i = 0; i < spectrum.length; i++) {
    //   let x = map(i, 0, spectrum.length, 0, width);
    //   let h = -height + map(spectrum[i], 0, 255, height, 0);
    //   rect(x, height, width / spectrum.length, h);
    // }

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
        
        function saveDialog() {
          return new Promise((resolve, reject) => {
            dialog.showSaveDialog((filename) => {
              if(filename == undefined) {
                reject("no name")
              }
              else {
                resolve(filename)
              }
            })
          })
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
            if(abortMotor) {
              console.log("Capturing Done", assignArray(motorData.xaxis, motorData.yaxis, arrPat))
            }
            else{
              const options = {
                filters: [
                  { name: 'CSV', extensions: ['csv'] },
                  { name: 'All Files', extensions: ['*'] }
                ]
              }
              const path = dialog.showSaveDialogSync(options)
              console.log("SAVE DIALOG", path)
              arrNormal =  assignArray(motorData.xaxis, motorData.yaxis, arrPat)
              arrNearest = assignArrayNearest(arrNormal)
              let csvData = convertCSV(arrNormal)
              let csvDataNearest = convertCSV(arrNearest)
              fs.writeFileSync(path+".csv", csvData, 'utf8')
              fs.writeFileSync(path+"-Nearest.csv", csvDataNearest, 'utf8')
              console.log("Capturing Done", "CSV sukses")
              plotHeatmap(arrNormal, "Normal", "plotnormal")
              plotHeatmap(arrNearest, "Nearest", "plotnearest")
            }
            abortMotor = false;
        }
    
        runMotor(motorData);
    }

  })

abortbutton.addEventListener('click', (event) => {
    event.preventDefault() 
    console.log('abort button kepencet')
    abortMotor = true
  })