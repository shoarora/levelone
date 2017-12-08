const electron = require('electron');
const url = require('url');
const path = require('path');
const player = require('play-sound')(opts = {});
const request = require('request');

var serverURL = electron.remote.getGlobal('sharedObj').serverURL;

class Player {
    constructor(sprite, type, name, numReps) {
        this.sprite = sprite;
        this.name = name;
        this.points = 0;
        this.repsLeft = numReps;
        this.state = 0;
        this.compliment = null;
        this.reached2 = false;

        this.sprites = [null, null, null];
        var self = this;
        for (let i=0; i < 3; i++) {
            let j = i;
            loadImage(path.join('img', type, 'sprites', sprite, i.toString()+'.png'), function(img) {
                self.sprites[j] = img;
            });
        }
    }
    updateState(newState) {
        this.state = newState;
        if (newState === 0) {
            this.reached2 = false;
        } else if (newState === 2) {
            this.reached2 = true;
        }
    }
    getComputerState(timeLeft, type) {
        if (type === 'squats') {
            var mod = timeLeft % 4;
            if (mod === 3) {
                mod = 1;
            }
            return mod;
        } else {
            var mod = timeLeft % 2;
            if (mod === 1) {
                mod = 2;
            }
            return mod;
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
        this.alpha = 255;
    }
    render() {
        if (this.animate) {
            this.y -= 7;
            this.alpha -= 15;
        }
        // fill(255, 255, 255, this.alpha);
        fill(247, 138, 38, this.alpha);
        textFont('sans-serif');
        textSize(30);
        text(this.text, this.x, this.y);
    }
}

class Challenge {
    constructor(type, player1, player2, player1Name, player2Name, numReps,
                timeLimit, canvasWidth, canvasHeight, mainWindow, dirname) {
        this.type = type;
        this.isSolo = player2 === 'yeti';
        this.player1 = new Player(player1, type, player1Name, numReps);
        this.player2 = new Player(player2, type, player2Name, numReps);
        this.numReps = numReps;
        this.timeLeft = timeLimit;
        this.needsRender = false;
        this.requestInProgress = false;
        this.countdown = 5;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.mainWindow = mainWindow;
        this.dirname = dirname;
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
        // request('http://localhost:5000/game/state', (err, res, body) => {
        console.log(serverURL + 'game/state');
        request(serverURL + 'game/state', (err, res, body) => {
            if (!err) {
                body = JSON.parse(body);
                if (self.player1.state !== body.player1State) {
                    if (body.player1State === 0 && self.player1.reached2) {
                        // 1 rep completed
                        self.player1.points += 30.0 / self.numReps;
                        self.player1.repsLeft--;
                        if (Math.random() > 0.0) {
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
                    self.player1.updateState(body.player1State);
                    self.needsRender = true;
                    console.log('p1 state changed');
                }
                body.player2State = this.player2.getComputerState(this.timeLeft, this.type);
                if (self.player2.state !== body.player2State) {
                    if (body.player2State === 0 && self.player2.reached2) {
                        // 1 rep completed
                        self.player2.points += 30.0 / self.numReps;
                        self.player2.repsLeft--;
                    }
                    self.player2.updateState(body.player2State);
                    self.needsRender = true;
                    console.log('p2 state changed');
                }
            } else {
                console.log('error fetching state');
            }
            if (this.timeLeft === 1 ||
                this.player1.repsLeft === 1 ||
                this.player2.repsLeft === 1) {
                this.end();
            }
            self.requestInProgress = false;
        });
    }
    renderScreen() {
        //draw up current game state
        this.renderNumReps();
        this.renderTimeLeft();
        this.renderProgressBars();
        this.renderSprites();
        this.renderPoints();

        if (this.countdown > 0) {
            this.renderCountdown();
        }

        if (this.player1.compliment === null) {
            console.log('done animating');
            this.needsRender = false;
        }
    }
    renderNumReps() {
        textFont('sans-serif');
        textSize(64);
        textStyle('BOLD');
        fill(0, 170, 235);
        if (this.type === 'squats') {
            text(this.numReps.toString(), 515, 195);
        } else {
            text(this.numReps.toString(), 390, 190);
        }
    }
    renderTimeLeft() {
        textFont('sans-serif');
        textSize(42);
        textStyle('BOLD');
        fill(0, 170, 235);
        text(this.timeLeftInMinutes(), 595, 290);
    }
    renderProgressBars() {
        // Player 1
        var barMaxHeight = 722;
        var barWidth = 135;

        var barHeight = barMaxHeight * (1 - this.player1.repsLeft / this.numReps);
        fill(247, 138, 38);
        rect(107, 772 - barHeight, barWidth, barHeight);

        textFont('sans-serif');
        textSize(50);
        textStyle('BOLD');
        fill(255, 255, 255);
        text(this.player1.repsLeft, 145, 90);

        // Player 2
        barHeight = barMaxHeight * (1 - this.player2.repsLeft / this.numReps);
        fill(247, 138, 38);
        rect(1027, 775 - barHeight, barWidth, barHeight);

        textFont('sans-serif');
        textSize(50);
        textStyle('BOLD');
        fill(255, 255, 255);
        text(this.player2.repsLeft, 1066, 92);
    }
    renderSprites() {
        image(this.ground, 0, 624, 1277, 150);

        var player1Sprite = this.player1.sprites[this.player1.state];
        if (player1Sprite) {
            image(player1Sprite, 180, 350, 400, 400);
        }
        fill(63, 34, 48);
        textSize(15);
        textFont('sans-serif');
        text(this.player1.name, 270, 330);

        var player2Sprite = this.player2.sprites[this.player2.state];
        if (player2Sprite) {
            image(player2Sprite, 700, 350, 400, 400);
        }
        text(this.player2.name, 940, 330);

        if (this.player1.compliment !== null) {
            this.player1.compliment.render();
        }
    }
    renderPoints() {
        textFont('sans-serif');
        textSize(35);
        fill(255, 255, 255);
        var adjustment1 = 0;
        var adjustment2 = 0;
        if (this.player1.points > 9) {
            adjustment1 += 15;
        }
        if (this.player2.points > 9) {
            adjustment2 += 15;
        }
        text(this.player1.points, 220 + adjustment1, 720);
        text(this.player2.points, 1150 + adjustment2, 720);
    }
    renderCountdown() {
        fill(255, 255, 255, 220);
        rect(0, 0, this.canvasWidth, this.canvasHeight);

        fill(0, 170, 235);
        textSize(130);
        text(this.countdown, this.canvasWidth/2 - textWidth(this.countdown)/2, this.canvasHeight/2);
    }
    end() {
        var nextPage;
        if (this.isSolo) {
            nextPage = 'SOLO';
        } else {
            nextPage = 'MULTI';
        }
        if (this.player1.points > this.player2.points) {
            nextPage += 'win.html';
        } else if (this.player1.points < this.player2.points) {
            nextPage += 'lose.html';
        } else {
            nextPage += 'tie.html';
        }
        this.mainWindow.loadURL(url.format({
            pathname: path.join(this.dirname, '..', nextPage),
            protocol: 'file:',
            slashes: true
        }));
    }
}

exports.Player = Player;
exports.Compliment = Compliment;
exports.Challenge = Challenge;
