const ipcRenderer = require('electron').ipcRenderer

let laserfreq = document.getElementById('laserfreq')
let laserduty = document.getElementById('laserduty')

let range = document.getElementById('range')
let xaxis = document.getElementById('xaxis')
let yaxis = document.getElementById('yaxis')
let delay = document.getElementById('delay')

let abortbutton = document.getElementById('abortbutton')

let patsubmit = document.getElementById('patsubmit')

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
        ipcRenderer.send('stepmotor-run', motorData)
    }

  })

abortbutton.addEventListener('click', (event) => {
    event.preventDefault() 
    ipcRenderer.send('stepmotor-abort')
  })

ipcRenderer.on('arrPat-done', (event, data) => {
    console.log('ini adalah arrPat',data);
  })