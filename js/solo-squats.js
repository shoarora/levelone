const electron = require('electron');
const request = require('request');
const url = require('url');
const path = require('path');


var mainWindow;
var canvasWidth;
var canvasHeight;
var challenge;

class Player {
    constructor(sprite, type, name, numReps) {
        this.sprite = sprite;
        this.name = name;
        this.points = 0;
        this.repsLeft = numReps;
        this.state = 0;
        this.compliment = null;

        this.sprites = [null, null, null];
        var self = this;
        for (let i=0; i < 3; i++) {
            let j = i;
            loadImage(path.join('img', type, 'sprites', sprite, i.toString()+'.png'), function(img) {
                self.sprites[j] = img;
            });
        }
    }
}

class Compliment {
    randomInt(min, max) {
        let diff = max - min;
        return Math.floor(Math.random() * diff) + min;
    }
    constructor() {
        const potentialTexts = ['Yes!', 'Fantastic!', 'Keep it up!', 'Perfect!', 'Amazing!'];
        this.text = potentialTexts[this.randomInt(0, potentialTexts.length)];
        this.x = this.randomInt(200, 500);
        this.y = this.randomInt(200, 500);
        this.animate = false;
        this.rgba = [];  // TODO set font
    }
    render() {
        if (this.animate) {
            // TODO change rgba
            this.y -= 7;
        }
        // fill.apply(null, this.rgba);
        text(this.text, this.x, this.y);
    }
}

class Challenge {
    constructor(type, player1, player2, player1Name, player2Name, numReps, timeLimit) {
        this.type = type;
        this.player1 = new Player(player1, type, player1Name, numReps);
        this.player2 = new Player(player2, type, player2Name, numReps);
        this.numReps = numReps;
        this.timeLeft = timeLimit;
        this.needsRender = false;
        this.requestInProgress = false;

        this.ground = loadImage(path.join('img', type, 'ground.png'));
    }
    timeLeftInMinutes() {
        var min = Math.floor(this.timeLeft / 60);
        var sec = this.timeLeft % 60;
        var colon = ':';
        if (sec < 10) {
            colon += '0';
        }
        return min.toString() + colon + sec.toString();
    }
    fetchState() {
        this.requestInProgress = true;
        var self = this;
        request('http://localhost:5000/game/state', (err, res, body) => {
            if (!err) {
                body = JSON.parse(body);
                if (self.player1.state !== body.player1State) {
                    if (body.player1State === 0) {
                        // 1 rep completed
                        self.player1.repsLeft--;
                        if (Math.random() > 0.3) {
                            // give user a compliment
                            self.player1.compliment = new Compliment();
                            setTimeout(function() {
                                self.player1.compliment.animate = true;
                            }, 300);
                            setTimeout(function() {
                                self.player1.compliment = null;
                            }, 800);
                        }
                    }
                    self.player1.state = body.player1State;
                    self.needsRender = true;
                    console.log('p1 state changed');
                }
                if (self.player2.state !== body.player2State) {
                    if (body.player2State === 0) {
                        // 1 rep completed
                        self.player2.repsLeft--;
                    }
                    self.player2.state = body.player2State;
                    self.needsRender = true;
                    console.log('p2 state changed');
                }

                self.requestInProgress = false;
            } else {
                console.log('error fetching state');
                self.requestInProgress = false;
            }
        });
    }
    renderScreen() {
        //draw up current game state
        this.renderNumReps();
        this.renderTimeLeft();
        this.renderProgressBars();
        this.renderSprites();
        this.renderPoints();
        if (this.player1.compliment === null) {
            console.log('done animating');
            this.needsRender = false;
        }
    }
    renderNumReps() {
        // TODO set font
        // textFont('sans-serif');
        // textSize(50);
        // fill(245, 245, 245);
        text(this.numReps.toString(), 535, 180);
    }
    renderTimeLeft() {
        // TODO set font
        // textFont('sans-serif');
        // textSize(50);
        // fill(245, 245, 245);
        text(this.timeLeftInMinutes(), 535, 300);
    }
    renderProgressBars() {
        // Player 1
        var barMaxHeight = 722;
        var barWidth = 135;

        var barHeight = barMaxHeight * (1 - this.player1.repsLeft / this.numReps);
        // fill(245, 245, 245,); TODO set fill color
        rect(107, 772 - barHeight, barWidth, barHeight);

        // TODO set label
        // textFont('sans-serif');
        // textSize(50);
        // fill(245, 245, 245);
        text(this.player1.repsLeft, 120, 45);

        // Player 2
        barHeight = barMaxHeight * (1 - this.player2.repsLeft / this.numReps);
        // fill(245, 245, 245,); TODO set fill color
        rect(1027, 775 - barHeight, barWidth, barHeight);

        // TODO set label
        // textFont('sans-serif');
        // textSize(50);
        // fill(245, 245, 245);
        text(this.player2.repsLeft, 1040, 45);
    }
    renderSprites() {
        // TODO set positions and load images
        image(this.ground, 0, 624, 1277, 150);

        var player1Sprite = this.player1.sprites[this.player1.state];
        if (player1Sprite) {
            image(player1Sprite, 180, 350, 400, 400);
        }
        text(this.player1.name, 200, 450);

        var player2Sprite = this.player2.sprites[this.player2.state];
        if (player2Sprite) {
            image(player2Sprite, 700, 350, 400, 400);
        }
        text(this.player2.name, 200, 450);

        if (this.player1.compliment !== null) {
            this.player1.compliment.render();
        }
    }
    renderPoints() {
        // TODO font and placement
        // textFont('sans-serif');
        // textSize(50);
        // fill(245, 245, 245);
        text(this.player1.points, 120, 700);
        text(this.player1.points, 1040, 700);
    }
}

function setup() {
    mainWindow = electron.remote.getGlobal('sharedObj').mainWindow;
    const size = mainWindow.getSize();
    console.log(size);
    canvasWidth = size[0];
    canvasHeight = size[1];
    var canvas = createCanvas(canvasWidth, canvasHeight);
    canvas.parent('canvas-container');
    challenge = new Challenge(
        'squats',
        'pink',
        'green',
        'You',
        'Squatch',
        20,
        120
    );  //TODO

    function runTimer() {
        challenge.timeLeft--;
        challenge.needsRender = true;
    }
    setInterval(runTimer, 1000);
}

var firstTime = true;

function draw() {
    if (!challenge.requestInProgress) {
        if (firstTime) {
            console.log('fetching 1st state');
            challenge.requestInProgress = true;
            firstTime = false;
            challenge.fetchState();
        } else {
            // console.log('fetching state');
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
