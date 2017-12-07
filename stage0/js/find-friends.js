const electron = require('electron');
const request = require('request');
const url = require('url');
const path = require('path');

var profileIndex = 0;
var buttonIndex = 0;
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

const profile1position = 151;
const profile2position = 290;

function drawProfile() {
    noFill();
    stroke(255, 255, 255);
    strokeWeight(4);
    if (profileIndex === 0) {
        rect(840, profile1position, 370, 123);
    } else {
        rect(840, profile2position, 370, 126);
    }
}

function drawButton() {
    var yPosition;
    if (profileIndex === 0) {
        yPosition = profile1position;
    } else {
        yPosition = profile2position + 3;
    }
    if (buttonIndex === 0) {
        rect(953, yPosition + 70, 105, 34);
    } else {
        rect(1070, yPosition + 70, 122, 34);
    }
}

function draw() {
    if (needsRender) {
        clear();
        drawProfile();
        drawButton();
        needsRender = false;
    }
}

document.addEventListener('keydown', event => {
    console.log(event.key, event.keyCode);
    if (event.keyCode === 37 && buttonIndex === 1) {
        buttonIndex--;
        needsRender = true;
    }
    if (event.keyCode === 38 && profileIndex === 1) {
        profileIndex--;
        needsRender = true;
    }
    if (event.keyCode === 39 && buttonIndex === 0) {
        buttonIndex++;
        needsRender = true;
    }
    if (event.keyCode === 40 && profileIndex === 0) {
        profileIndex++;
        needsRender = true;
    }
    console.log(buttonIndex, profileIndex);
    if (event.key === 'j') {
        var pathToOpen;

        if (profileIndex === 0) {
            if (buttonIndex === 0) {
                pathToOpen = 'multi-select.html';
            } else {
                pathToOpen = 'edmund.html';
            }
        } else {
            if (buttonIndex === 0) {
                pathToOpen = null;
            } else {
                pathToOpen = 'tenzing.html';
            }
        }
        if (pathToOpen) {
            mainWindow.loadURL(url.format({
                pathname: path.join(__dirname, '..', pathToOpen),
                protocol: 'file:',
                slashes: true
            }));
        }
    }
});

exports.setup = setup;
exports.draw = draw;
