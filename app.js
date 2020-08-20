const {app, BrowserWindow, ipcMain} = require('electron')

const SerialPort = require('serialport')
const port = new SerialPort('/dev/ttyACM0', {
    baudRate: 9600,
    lock: false,
    autoOpen: true
})

const portMotor = new SerialPort('/dev/ttyACM1', {
    baudRate: 9600,
    lock: false,
    autoOpen: true
})


let mainWindow = null
let laserWindow = null
let detectorWindow = null
let stepMotorWindow = null
let patWindow = null
let importWindow = null

function mainWindowFunc () {
    mainWindow = new BrowserWindow({
        icon: __dirname + '/images/logo.png',
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

function importWindowFunc () {
    importWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        },
        show : false
    })

    importWindow.webContents.loadURL(`file://${__dirname}/import.html`)
    // importWindow.openDevTools()

    importWindow.on('close', function(evt) {
        evt.preventDefault();
        importWindow.hide()
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
    detectorWindow.webContents.openDevTools()

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
    patWindow.webContents.openDevTools()

    patWindow.on('close', function(evt) {
        evt.preventDefault();
        patWindow.hide()
    })
}

app.on('ready', function() {
    console.log('Hello from electron')
    mainWindowFunc()
    laserWindowFunc()
    importWindowFunc()
    detectorWindowFunc()
    stepMotorWindowFunc()
    patWindowFunc()

    ipcMain.on('quit-app', function() {
        app.quit()
    })

    ipcMain.on('export-csv', function() {
        patWindow.webContents.send('export-csv')
    })
    
    ipcMain.on('tog-laserWindow', function() {
        if(laserWindow.isVisible()) {
            laserWindow.hide()
        }
        else {
            laserWindow.show()
        }
    })

    ipcMain.on('tog-importWindow', function() {
        if(importWindow.isVisible()) {
            importWindow.hide()
        }
        else {
            importWindow.show()
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

    ipcMain.on('stepmotor-up', function(event) {

        let motorData = `u\n`

        portMotor.write(motorData, function(err) {
            if (err) {
              return console.log('Error on moving motor up: ', err.message)
            }
            console.log('stepmotor moving up')
          })
    })

    ipcMain.on('stepmotor-down', function(event) {

        let motorData = `d\n`

        portMotor.write(motorData, function(err) {
            if (err) {
              return console.log('Error on moving motor down: ', err.message)
            }
            console.log('stepmotor moving down')
          })
    })

    ipcMain.on('stepmotor-left', function(event) {

        let motorData = `l\n`

        portMotor.write(motorData, function(err) {
            if (err) {
              return console.log('Error on moving motor left: ', err.message)
            }
            console.log('stepmotor moving left')
          })
    })

    ipcMain.on('stepmotor-right', function(event) {

        let motorData = `r\n`

        portMotor.write(motorData, function(err) {
            if (err) {
              return console.log('Error on moving motor right: ', err.message)
            }
            console.log('stepmotor moving right')
          })
    })

    ipcMain.on('stepmotor-savestep', function(event, data) {

        let range = data/2 * 10
        let motorData = `j${range}\n`

        portMotor.write(motorData, function(err) {
            if (err) {
              return console.log('Error on moving motor right: ', err.message)
            }
            console.log('stepmotor step saved')
          })
    })
})
