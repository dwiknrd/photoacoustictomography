const ipcRenderer = require('electron').ipcRenderer
const {dialog} = require('electron').remote

let secretblock = document.getElementById('secretblock')
let secretClick = 0

secretblock.addEventListener('click', (event) => {
    secretClick ++
    console.log(secretClick)
    if(secretClick == 5) {
        secretClick = 0
        ipcRenderer.send('open-secretwindow')
    }
  })