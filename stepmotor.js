const ipcRenderer = require('electron').ipcRenderer
let range = document.getElementById('range')
let xaxis = document.getElementById('xaxis')
let yaxis = document.getElementById('yaxis')
let runbutton = document.getElementById('runbutton')
let abortbutton = document.getElementById('abortbutton')

//Control Button
let plusY = document.getElementById('plusY')
let minY = document.getElementById('minY')
let plusX = document.getElementById('plusX')
let minX = document.getElementById('minX')


runbutton.addEventListener('click', (event) => {
    event.preventDefault() 
  
    let data = {
        range : range.value,
        xaxis : xaxis.value,
        yaxis : yaxis.value
    }

    if (data.range * 10 % 2 != 0) {
        alert('range harus kelipatan 0.2')
    }
    else {
        ipcRenderer.send('run-stepmotor', data)
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