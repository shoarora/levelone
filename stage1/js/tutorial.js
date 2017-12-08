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
    var img2;
    var img3;
    loadImage('img/tutorial2.png', function(img) {
        img2 = img
    });
    loadImage('img/tutorial3.png', function(img) {
        img3 = img
    });
    setTimeout(function() {
        image(img2, 0, 0, canvasWidth, canvasHeight);
    }, 5000);
    setTimeout(function() {
        image(img3, 0, 0, canvasWidth, canvasHeight);
    }, 10000);
}

function draw() {

}

document.addEventListener('keydown', event => {
    if (event.key === 'j' || event.key === 'k') {
        mainWindow.loadURL(url.format({
            pathname: path.join(__dirname, '../solo-jj.html'),
            protocol: 'file:',
            slashes: true
        }));
    }
});

exports.setup = setup;
exports.draw = draw;
