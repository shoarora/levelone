const electron = require('electron');
const request = require('request');
const url = require('url');
const path = require('path');

var numReps = 20;
var needsRender = true;
var mainWindow;
var canvasHeight;
var canvasWidth;
var stage;

function setup() {
    mainWindow = electron.remote.getGlobal('sharedObj').mainWindow;
    electron.remote.getGlobal('sharedObj').stage++;
    stage = electron.remote.getGlobal('sharedObj').stage;
    console.log(electron.remote.getGlobal('sharedObj').stage);
    const size = mainWindow.getSize();
    console.log(size);
    canvasWidth = size[0];
    canvasHeight = size[1];
    var canvas = createCanvas(canvasWidth, canvasHeight);
    canvas.parent('canvas-container');
}

function draw() {

}

document.addEventListener('keydown', event => {
    if (event.key === 'j') {
        mainWindow.loadURL(url.format({
            pathname: path.join(__dirname, '../level-up.html'),
            protocol: 'file:',
            slashes: true
        }));
    }
});

exports.setup = setup;
exports.draw = draw;
