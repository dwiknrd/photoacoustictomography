const ipcRenderer = require('electron').ipcRenderer
let range = document.getElementById('range')
let xaxis = document.getElementById('xaxis')
let yaxis = document.getElementById('yaxis')
let runbutton = document.getElementById('runbutton')
let abortbutton = document.getElementById('abortbutton')

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