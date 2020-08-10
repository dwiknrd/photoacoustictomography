const ipcRenderer = require('electron').ipcRenderer
let range = document.getElementById('range')
let xaxis = document.getElementById('xaxis')
let yaxis = document.getElementById('yaxis')
let runbutton = document.getElementById('runbutton')
let abortbutton = document.getElementById('abortbutton')
let savestepbutton = document.getElementById('savestepbutton')
let plusY = document.getElementById('plusY')
let minY = document.getElementById('minY')
let plusX = document.getElementById('plusX')
let minX = document.getElementById('minX')
let delay = document.getElementById('delay')

let abortMotor = false

runbutton.addEventListener('click', (event) => {
    event.preventDefault() 
  
    let data = {
        xaxis : xaxis.value,
        yaxis : yaxis.value,
        delay : delay.value
    }
    console.log("motornya jalan")
    // ipcRenderer.send('stepmotor-run-calibrate', data)

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
              console.log('capture')
            }
            
            if(toRight) {
              ipcRenderer.send('stepmotor-right')
              await sleep(data.delay)
            }
            else{
              ipcRenderer.send('stepmotor-left')
              await sleep(data.delay)
            }
          }
          toRight = !toRight
          ipcRenderer.send('stepmotor-down')
          await sleep(data.delay)
        }
        abortMotor = false;
    }

    runMotor(data);
  })

savestepbutton.addEventListener('click', (event) => {
    event.preventDefault() 

    if (range.value * 10 % 2 != 0) {
        alert('Range harus bernilai kelipatan 0.2')
    }
    else {
        ipcRenderer.send('stepmotor-savestep', range.value)
    }

  })

abortbutton.addEventListener('click', (event) => {
    event.preventDefault()
    console.log('abort button kepencet') 
    abortMotor = true
  })

plusY.addEventListener('click', (event) => {
    event.preventDefault() 
    ipcRenderer.send('stepmotor-up')
  })

minY.addEventListener('click', (event) => {
    event.preventDefault() 
    ipcRenderer.send('stepmotor-down')
  })

plusX.addEventListener('click', (event) => {
    event.preventDefault() 
    ipcRenderer.send('stepmotor-right')
  })

minX.addEventListener('click', (event) => {
    event.preventDefault() 
    ipcRenderer.send('stepmotor-left')
  })