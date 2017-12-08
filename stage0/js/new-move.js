const electron = require('electron');
const request = require('request');
const url = require('url');
const path = require('path');

var numReps = 20;
var needsRender = true;
var selected = 0;
var mainWindow;
var canvasHeight;
var canvasWidth;
var stage;

function setup() {
    mainWindow = electron.remote.getGlobal('sharedObj').mainWindow;
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
    var x;
    if (selected === 0) {
        x = 422;
    } else {
        x = 676;
    }
    stroke(255, 255, 255);
    noFill();
    strokeWeight(4);
    clear();
    rect(x, 564, 185, 60);
}

document.addEventListener('keydown', event => {
    if (event.key === 'a') {
        selected = 0;
    }
    if (event.key === 'd') {
        selected = 1;
    }
    var pathToOpen;
    if (event.key === 'k'|| (event.key === 'j' && selected === 1)) {
        pathToOpen = 'progress.html';
    } else if (event.key === 'j' && selected === 0) {
        pathToOpen = 'tutorial.html';
    }
    if (pathToOpen) {
        mainWindow.loadURL(url.format({
            pathname: path.join(__dirname, '../..', 'stage'+stage.toString(), pathToOpen),
            protocol: 'file:',
            slashes: true
        }));
    }
});

exports.setup = setup;
exports.draw = draw;
