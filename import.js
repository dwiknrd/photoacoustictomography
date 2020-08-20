const ipcRenderer = require('electron').ipcRenderer
const {dialog} = require('electron').remote
const fs = require('fs')

let browseNormal = document.getElementById('browseNormal')
let browseNearest = document.getElementById('browseNearest')

let normaldir = document.getElementById('normaldir')
let nearestdir = document.getElementById('nearestdir')

function parseCSV(string) {
    let result = []

    let array = string.split('\n')
    
    array.forEach(element => {
        result.push(element.split(","))
    });

    return result
}

function plotHeatmap(array, title, div) {
  var data = [ {
    z: array,
    type: 'heatmap',
    zsmooth: 'best'
  }];

  var dataJet = [ {
    z: array,
    type: 'heatmap',
    zsmooth: 'best',
    colorscale: 'Jet'
  }];
  
  var layout = {
    title: title,
    xaxis: {
      scaleanchor: "y",
      constrain: "domain",
      constraintoward: "left",
      showgrid: false, 
      zeroline: false,
      visible: false
    },
    yaxis: {
      scaleanchor: "x",
      constrain: "domain",
      showgrid: false, 
      zeroline: false,
      visible: false
    },
    width: 900,
    height: 900
  };
  
  Plotly.newPlot(div, data, layout);
  layout.title = title+" Jet"
  Plotly.newPlot(div+"jet", dataJet, layout);
}

browseNormal.addEventListener('click', (event) => {
    event.preventDefault()

    const options = {
        filters: [
          { name: 'CSV', extensions: ['csv'] },
          { name: 'All Files', extensions: ['*'] }
        ]
      }
    const path = dialog.showOpenDialogSync(options)[0]
    console.log(path)
    const array = fs.readFileSync(path,'utf8')
    let arrNormal = parseCSV(array)
    normaldir.value = path
    plotHeatmap(arrNormal, "Normal", "plotnormal")

  })

  browseNearest.addEventListener('click', (event) => {
    event.preventDefault()

    const options = {
        filters: [
          { name: 'CSV', extensions: ['csv'] },
          { name: 'All Files', extensions: ['*'] }
        ]
      }
    const path = dialog.showOpenDialogSync(options)[0]
    console.log(path)
    const array = fs.readFileSync(path,'utf8')
    let arrNearest = parseCSV(array)
    nearestdir.value = path
    plotHeatmap(arrNearest, "Nearest", "plotnearest")
  })