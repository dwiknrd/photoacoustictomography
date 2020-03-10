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


runbutton.addEventListener('click', (event) => {
    event.preventDefault() 
  
    let data = {
        xaxis : xaxis.value,
        yaxis : yaxis.value
    }

    ipcRenderer.send('stepmotor-run', data)

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
    ipcRenderer.send('abort-stepmotor')
  })

plusY.addEventListener('click', (event) => {
    event.preventDefault() 
    ipcRenderer.send('stepmotor-plusy')
  })

minY.addEventListener('click', (event) => {
    event.preventDefault() 
    ipcRenderer.send('stepmotor-miny')
  })

plusX.addEventListener('click', (event) => {
    event.preventDefault() 
    ipcRenderer.send('stepmotor-plusx')
  })

minX.addEventListener('click', (event) => {
    event.preventDefault() 
    ipcRenderer.send('stepmotor-minx')
  })