const ipcRenderer = require('electron').ipcRenderer
const {dialog} = require('electron').remote
const fs = require('fs')

let browseNormal = document.getElementById('browseNormal')
let repairdataButton = document.getElementById('repairdataButton')
let saveCSV = document.getElementById('saveCSV')

let threshold = document.getElementById('threshold')

let normaldir = document.getElementById('normaldir')


let path = ""
let arrNormal = []
let repairedData = []
let nearestRepairedData = []

function parseCSV(string) {
    let result = []

    let array = string.split('\n')
    
    array.forEach(element => {
        result.push(element.split(","))
    });

    return result
}

function repairData(array, threshold) {
  for (let i = 0; i < array.length; i++) {
    for (let j = 0; j < array[i].length; j++) {
      if(Number(array[i][j]) >= threshold) {
        let arrayFilter = array[i].filter(arr => Number(arr) < threshold)
        let sumArray = 0
        arrayFilter.forEach((arr) => {
          sumArray += Number(arr)
        })
        let avg = sumArray / arrayFilter.length
        array[i][j] = avg
      }
    }
  }
  return array
}

function convertCSV(array) {
  let result = []
  array.forEach(element => {
    result.push(element.join(","))
  });

  return result.join('\n')
}

function assignArrayNearest(array) {
  let result = []
  for (let i = 0; i < array.length; i++) {
    let arrayTemp = []
    for (let j = 0; j < array[i].length; j++) {
      arrayTemp.push(array[i][j])
      arrayTemp.push(array[i][j])
    }
    result.push(arrayTemp)
    result.push(arrayTemp)
  }
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
    path = dialog.showOpenDialogSync(options)[0]
    console.log(path)
    const array = fs.readFileSync(path,'utf8')
    arrNormal = parseCSV(array)
    normaldir.value = path
  })

repairdataButton.addEventListener('click', (event) => {
    event.preventDefault()

    repairedData = repairData(arrNormal, threshold.value)
    nearestRepairedData = assignArrayNearest(repairedData)
    plotHeatmap(repairedData, "Normal", "plotnormal")
    plotHeatmap(nearestRepairedData, "Nearest", "plotnearest")
  })

saveCSV.addEventListener('click', (event) => {
    event.preventDefault()

    const options = {
      filters: [
        { name: 'CSV', extensions: ['csv'] },
        { name: 'All Files', extensions: ['*'] }
      ]
    }
    const path = dialog.showSaveDialogSync(options)
    if(path !== undefined) {
      let csvData = convertCSV(repairedData)
      let csvDataNearest = convertCSV(nearestRepairedData)
      fs.writeFileSync(path+"-Repaired.csv", csvData, 'utf8')
      fs.writeFileSync(path+"-Nearest-Repaired.csv", csvDataNearest, 'utf8')
      console.log("Capturing Done", "CSV sukses")
    } 
})