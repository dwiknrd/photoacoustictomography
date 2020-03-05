const {app, BrowserWindow, ipcMain} = require('electron')

const SerialPort = require('serialport')
const port = new SerialPort('/dev/cu.usbmodem14101', {
    baudRate: 9600,
    lock: false,
    autoOpen: true
})

let mainWindow = null
let laserWindow = null
let detectorWindow = null
let stepMotorWindow = null
let patWindow = null

function mainWindowFunc () {
    mainWindow = new BrowserWindow({
        width : 1280,
        height : 720,
        webPreferences: {
            nodeIntegration: true
        }
    })

    mainWindow.once('ready-to-show', function() {
        mainWindow.show()
    })

    mainWindow.webContents.loadURL(`file://${__dirname}/index.html`)
    // mainWindow.openDevTools()
    
    mainWindow.on('closed', function() {
        mainWindow = null
        laserWindow = null
    })
}

function laserWindowFunc () {
    laserWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        },
        show : false
    })

    laserWindow.webContents.loadURL(`file://${__dirname}/laser.html`)

    laserWindow.on('close', function(evt) {
        evt.preventDefault();
        laserWindow.hide()
    })
}

function detectorWindowFunc () {
    detectorWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        },
        show : false
    })

    detectorWindow.webContents.loadURL(`file://${__dirname}/detector.html`)
    // detectorWindow.webContents.openDevTools()

    detectorWindow.on('close', function(evt) {
        evt.preventDefault();
        detectorWindow.hide()
    })
}

function stepMotorWindowFunc () {
    stepMotorWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        },
        show : false
    })

    stepMotorWindow.webContents.loadURL(`file://${__dirname}/stepmotor.html`)

    stepMotorWindow.on('close', function(evt) {
        evt.preventDefault();
        stepMotorWindow.hide()
    })
}

function patWindowFunc () {
    patWindow = new BrowserWindow({
        width: 1280,
        height: 720,
        webPreferences: {
            nodeIntegration: true
        },
        show : false
    })

    patWindow.webContents.loadURL(`file://${__dirname}/pat.html`)

    patWindow.on('close', function(evt) {
        evt.preventDefault();
        patWindow.hide()
    })
}

app.on('ready', function() {
    console.log('Hello from electron')
    mainWindowFunc()
    laserWindowFunc()
    detectorWindowFunc()
    stepMotorWindowFunc()
    patWindowFunc()
    
    ipcMain.on('tog-laserWindow', function() {
        if(laserWindow.isVisible()) {
            laserWindow.hide()
        }
        else {
            laserWindow.show()
        }
    })

    ipcMain.on('tog-detectorWindow', function() {
        if(detectorWindow.isVisible()) {
            detectorWindow.hide()
        }
        else {
            detectorWindow.show()
        }
    })

    ipcMain.on('tog-stepMotorWindow', function() {
        if(stepMotorWindow.isVisible()) {
            stepMotorWindow.hide()
        }
        else {
            stepMotorWindow.show()
        }
    })

    ipcMain.on('tog-patWindow', function() {
        if(patWindow.isVisible()) {
            patWindow.hide()
        }
        else {
            patWindow.show()
        }
    })

    ipcMain.on('submit-laser', function(event, data) {

        let laserData = `${data.laserduty};${data.laserfreq}\n`

        port.write(laserData, function(err) {
            if (err) {
              return console.log('Error on write: ', err.message)
            }
            console.log('laser modulasi sudah diupdate', laserData)
          })
    })
})
