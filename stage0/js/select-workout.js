const electron = require('electron');
const request = require('request');
const url = require('url');
const path = require('path');

var selectionAvailable = false;
var selectionSet = !selectionAvailable;
var selection = 0;
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

function drawSelectionBox() {
    if (selectionSet) {
        stroke(255, 255, 255);
    } else {
        stroke(239, 103, 148);
    }
    noFill();
    strokeWeight(4);
    var adjustment = 0;
    if (selection === 1) {
        adjustment = 151;
    }
    rect(270+adjustment, 190, 140, 140);
}

function drawReps() {
    if (selectionSet) {
        noFill();
        stroke(239, 103, 148);
        strokeWeight(4);
        rect(450, 518, 379, 86);
    }

    fill(255, 255, 255);
    stroke(255, 255, 255);
    strokeWeight(1);
    textSize(48);
    var adjustment = 0;
    if (numReps < 10) {
        adjustment = 13;
    }
    text(numReps, 686 + adjustment, 576);
}

function draw() {
    if (needsRender) {
        clear();

        drawSelectionBox();
        drawReps();
        needsRender = false;
    }
}

document.addEventListener('keydown', event => {
    console.log(event.key, event.keyCode);
    if (event.keyCode === 37) {
        if (!selectionSet && selection === 1) {
            selection = 0;
            needsRender = true;
        } else if (selectionSet && numReps > 1) {
            numReps--;
            needsRender = true;
        }
    }
    if (event.keyCode === 39) {
        if (!selectionSet && selection === 0) {
            selection = 1;
            needsRender = true;
        } else if (selectionSet && numReps < 30) {
            numReps++;
            needsRender = true;
        }
    }
    if (event.key === 'j') {
        if (!selectionSet) {
            selectionSet = true;
            needsRender = true;
        } else {
            electron.remote.getGlobal('sharedObj').numReps = numReps;
            mainWindow.loadURL(url.format({
                pathname: path.join(__dirname, '../solo-squats.html'),
                protocol: 'file:',
                slashes: true
            }));
        }
    }
    if (event.key === 'k' && selectionAvailable) {
        selectionSet = false;
        needsRender = true;
    }
});

exports.setup = setup;
exports.draw = draw;
