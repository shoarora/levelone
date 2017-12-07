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
    if (needsRender) {
        clear();
        fill(255, 255, 255);
        strokeWeight(1);
        textSize(48);
        var adjustment = 0;
        if (numReps < 10) {
            adjustment = 13;
        }
        text(numReps, 686 + adjustment, 576);

        noFill();
        stroke(255, 255, 255);
        strokeWeight(4);
        rect(450, 518, 379, 86);

        rect(270, 190, 140, 140);

        needsRender = false;
    }
}

document.addEventListener('keydown', event => {
    console.log(event.key, event.keyCode);
    if (event.keyCode === 37 && numReps > 1) {
        numReps--;
        needsRender = true;
    }
    if (event.keyCode === 39 && numReps < 30) {
        numReps++;
        needsRender = true;
    }
    if (event.key === 'j') {
        mainWindow.loadURL(url.format({
          pathname: path.join(__dirname, '../solo-squats.html'),
          protocol: 'file:',
          slashes: true
      }));
    }
});

exports.setup = setup;
exports.draw = draw;
