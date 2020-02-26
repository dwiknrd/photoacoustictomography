const ipcRenderer = require('electron').ipcRenderer

let laserfreq = document.getElementById('laserfreq')
let laserduty = document.getElementById('laserduty')
let lasersubmit = document.getElementById('lasersubmit')

lasersubmit.addEventListener('click', (event) => {
    event.preventDefault()

    let data = {
        laserfreq : laserfreq.value,
        laserduty : laserduty.value
    }
    ipcRenderer.send('submit-laser', data)

    laserfreq.value = 0
    laserduty.value = 0
})