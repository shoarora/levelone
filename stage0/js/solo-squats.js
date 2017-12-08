const electron = require('electron');
const request = require('request');
const url = require('url');
const path = require('path');
const gameplay = require('../../js/gameplay');

var Player = gameplay.Player;
var Compliment = gameplay.Compliment;
var Challenge = gameplay.Challenge;
var mainWindow;
var canvasWidth;
var canvasHeight;
var challenge;



function setup() {
    mainWindow = electron.remote.getGlobal('sharedObj').mainWindow;
    console.log(electron.remote.getGlobal('sharedObj').stage);
    const size = mainWindow.getSize();
    console.log(size);
    canvasWidth = size[0];
    canvasHeight = size[1];
    var canvas = createCanvas(canvasWidth, canvasHeight);
    canvas.parent('canvas-container');
    challenge = new Challenge(
        'squats',
        'pink',
        'yeti',
        'You',
        'Squatch',
        electron.remote.getGlobal('sharedObj').numReps,
        45,
        canvasWidth,
        canvasHeight,
        mainWindow,
        __dirname
    );

    function runTimer() {
        if (challenge.countdown > 0) {
            challenge.countdown--;
        } else {
            challenge.timeLeft--;
        }
        challenge.needsRender = true;
    }
    setInterval(runTimer, 1000);
}

var firstTime = true;

function draw() {
    if (challenge.countdown <= 0 && !challenge.requestInProgress) {
        if (firstTime) {
            console.log('fetching 1st state');
            challenge.requestInProgress = true;
            firstTime = false;
            challenge.fetchState();
        } else {
            challenge.fetchState();
        }
    }

    if (challenge.needsRender) {
        clear();
        challenge.renderScreen();
    }
}

document.addEventListener('keydown', event => {

});

exports.setup = setup;
exports.draw = draw;
