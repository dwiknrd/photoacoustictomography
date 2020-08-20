const remote = require('electron').remote
const ipcRenderer = require('electron').ipcRenderer
const Menu = remote.require('electron').Menu
let templateMenu = [
    {
        label: 'File',
        submenu: [
            {
                label: 'Import',
                click: function () {
                    ipcRenderer.send('tog-importWindow')
                }
            },
            {
                label: 'Export',
                click: function () {
                    ipcRenderer.send('export-csv')
                }
            },
            {
                label: 'Exit',
                click: function () {
                    ipcRenderer.send('quit-app')
                }
            }
        ]
    },
    {
        label: 'Edit',
        submenu: [
            {
                label: 'Undo',
                role : 'undo'
            },
            {
                label: 'Redo',
                role : 'redo'
            },
            {
                type: 'separator'
            },
            {
                label: 'Copy',
                role : 'copy'
            },
            {
                label: 'Paste',
                role : 'paste'
            }
        ]
    },
    {
        label: 'Menu',
        submenu: [
            {
                label: 'Calibration',
                submenu: [
                    {
                        label: 'Laser Modulation',
                        click: function () {
                            ipcRenderer.send('tog-laserWindow')
                        }
                    },
                    {
                        label: 'Detector',
                        click: function () {
                            ipcRenderer.send('tog-detectorWindow')
                        }
                    },
                    {
                        label: 'Step Motor',
                        click: function () {
                            ipcRenderer.send('tog-stepMotorWindow')
                        }
                    }
                ]
            },
            {
                label: 'Photoacoustic Tomography',
                click: function () {
                    ipcRenderer.send('tog-patWindow')
                }
            }
        ]
    },
    {
        label: 'Help',
        submenu: [
            {
                label: 'About',
                click: function () {
                    ipcRenderer.send('tog-aboutWindow')
                }
            }
        ]
    }
]

if(process.platform === "darwin") {
    templateMenu.unshift({
        label: 'PAT'
    })
}

const appMenu = Menu.buildFromTemplate(templateMenu)
Menu.setApplicationMenu(appMenu)