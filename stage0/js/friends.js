const electron = require('electron');
const request = require('request');
const url = require('url');
const path = require('path');

var numReps = 20;
var needsRender = true;
var mainWindow;
var canvasHeight;
var canvasWidth;
var inSelectMode = false;
var selected = 0;

function setup() {
    mainWindow = electron.remote.getGlobal('sharedObj').mainWindow;
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
        textSize(48);
        textStyle('BOLD');
        var adjustment = 0;
        if (numReps < 10) {
            adjustment = 13;
        }
        text(numReps, 686 + adjustment, 576);

        // TODO
        // draw boxes

        noFill();
        stroke(255, 255, 255);
        strokeWeight(4);
        rect(450, 518, 379, 86);

        needsRender = false;
    }
}

document.addEventListener('keydown', event => {
    if (event.key === 'j' && !inSelectMode) {
        inSelectMode = true;
    }
    if (event.key === 'j' && inSelectMode) {
        if (selected === 0) {
            // TODO go to thing
        }
        if (selected === 1) {
            // TODO go to thing
        }
    }
    if (event.keyCode === 37 && numReps > 1 && inSelectMode) {
        // TODO move selector
    }
    if (event.keyCode === 39 && numReps < 30 && inSelectMode) {
        // TODO move selector
    }
});

exports.setup = setup;
exports.draw = draw;
