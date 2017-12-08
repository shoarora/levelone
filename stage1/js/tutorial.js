const electron = require('electron');
const request = require('request');
const url = require('url');
const path = require('path');

var mainWindow = electron.remote.getGlobal('sharedObj').mainWindow;
var canvasHeight;
var canvasWidth;

function setup() {
    const size = mainWindow.getSize()
    canvasWidth = size[0];
    canvasHeight = size[1];
    var canvas = createCanvas(canvasWidth, canvasHeight);
    canvas.parent('canvas-container');
}

function draw() {

}

document.addEventListener('keydown', event => {
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, '../solo-jj.html'),
        protocol: 'file:',
        slashes: true
    }));
});

exports.setup = setup;
exports.draw = draw;
