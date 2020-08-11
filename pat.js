const ipcRenderer = require('electron').ipcRenderer

const detector = require('./detector.js')

let laserfreq = document.getElementById('laserfreq')
let laserduty = document.getElementById('laserduty')

let range = document.getElementById('range')
let xaxis = document.getElementById('xaxis')
let yaxis = document.getElementById('yaxis')
let delay = document.getElementById('delay')

let abortbutton = document.getElementById('abortbutton')

let patsubmit = document.getElementById('patsubmit')

let abortMotor = false

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
        ipcRenderer.send('submit-laser', data)
        ipcRenderer.send('stepmotor-savestep', range.value)

        function sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
          }
          
          async function runMotor(data) {
          
            let toRight = true
          
              for (let i = 0; i < data.yaxis; i++) {
                if(abortMotor) {
                  break
                }
          
                for (j = 0; j < data.xaxis-1; j++) {
                  if(abortMotor) {
                    break
                  }
          
                  if(i == 0 && j == 0) {
                    await sleep(data.delay)
                    console.log('intencity', detector.intencity)
                  }
                  
                  if(toRight) {
                    ipcRenderer.send('stepmotor-right')
                    await sleep(data.delay)
                    console.log('intencity', detector.intencity)
                  }
                  else{
                    ipcRenderer.send('stepmotor-left')
                    await sleep(data.delay)
                    console.log('intencity', detector.intencity)
                  }
                }
                toRight = !toRight
                ipcRenderer.send('stepmotor-down')
                await sleep(data.delay)
                console.log('intencity', detector.intencity)
              }
              abortMotor = false;
          }
      
          runMotor(data);
    }

  })

abortbutton.addEventListener('click', (event) => {
    event.preventDefault() 
    console.log('abort button kepencet') 
    abortMotor = true
  })

ipcRenderer.on('arrPat-done', (event, data) => {
    console.log('ini adalah arrPat',data);
  })