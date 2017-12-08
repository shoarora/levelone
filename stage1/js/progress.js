const electron = require('electron');
const url = require('url');
const path = require('path');
const headerSize = 150;
const footerSize = 150;

class MountainImg {
    constructor(path, popupPath, centerX, x, y, width, height) {
        this.path = path;
        this.centerX = centerX;
        this.x = x;
        this.y = y;
        this.height = height;
        this.width = width;
        var self = this;
        loadImage(path, function(img) {
            if (self.isValid()) {
                image(img, x, y - height, width, height);
            }
            self.img = img;
        });
        loadImage(popupPath, function(img) {
            self.popup = img;
        });
    }
    slideAndScale(slideRate, shrinkRate, direction) {
        this.x += slideRate;
        this.height += shrinkRate;
        this.width += shrinkRate;
        if (this.isValid()) {
            image(this.img, this.x, this.y - this.height, this.width, this.height);
        }
        return direction * (this.centerX - this.x) >= 0;
    }
    setX(newX) {
        this.x = newX;
        if (this.isValid()) {
            image(this.img, this.x, this.y - this.height, this.width, this.height);
        }
    }
    isValid() {
        return this.y > 0 && this.height > 0 && this.width > 0;
    }
    displayInfoPopup() {
        image(this.popup, this.x - 350, this.y - 500, 400, 300);
    }
    hideInfoPopup() {
        initMountains();
        initLabels();
    }
}

var mountains;
var canvasHeight;
var canvasWidth;
var cur_index = 2;
var mainWindow;
var stage;

function initMountains() {
    var startWidth = 300;
    var startHeight = 300;
    var mountainBase = canvasHeight - 50;
    var center = canvasWidth / 2 - startWidth / 2;
    mountains = [];
    clear();
    for (let i = 0; i < 5; i++) {
        var startX = center;
        var curStartWidth = startWidth;
        var curStartHeight = startHeight;
        var img_path = 'img/youAreHere.png';
        var popupPath = 'img/PopupLeftCurrentLevel.png';
        if (i === 0) {
            popupPath = 'img/PopupLeft1.png';
        } else if (i === 1) {
            popupPath = 'img/PopupLeft2.png';
        } else if (i > 2) {
            popupPath = 'img/LockedLevelLeft.png';
        }
        if (i < 2) {
            startX -= (2 - i) * center * 3 / 4;
            curStartWidth -= (2 - i) * center * 3 / 4 / 2;
            curStartHeight -= (2 - i) * center * 3 / 4 / 2;
            img_path = 'img/CompletedMountain.png'
        } else if (i > 2) {
            startX += (i - 2) * center * 3 / 4;
            curStartWidth += (i - 2) * center * 3 / 4 / 2;
            curStartHeight += (i - 2) * center * 3 / 4 / 2;
            img_path = 'img/LockedMountain.png'
        }

        mountains.push(new MountainImg(
            img_path,
            popupPath,
            center,
            startX,
            mountainBase,
            curStartWidth,
            curStartHeight
        ));
    }
}

function initLabels() {
    var labelContainer = document.getElementById("level-labels");
    labelContainer.innerHTML = '';
    const labelIds = ['prev-level', 'cur-level', 'next-level'];
    for (let i=0; i < 3; i++) {
        var label = document.createElement("p");
        label.id = labelIds[i];
        var text = document.createTextNode("Level " + (cur_index+i).toString());
        if ((cur_index+i === 0 || cur_index+i > 5)) {
            label.style.visibility = 'hidden';
        }
        label.appendChild(text);
        labelContainer.appendChild(label);
    }
}

function setup() {
    mainWindow = electron.remote.getGlobal('sharedObj').mainWindow;
    stage = electron.remote.getGlobal('sharedObj').stage;
    const size = mainWindow.getSize();
    console.log(size);
    canvasWidth = size[0];
    canvasHeight = size[1] - (headerSize / 2) - 8 - footerSize;
    var canvas = createCanvas(canvasWidth, canvasHeight);
    canvas.parent('canvas-container');
    initMountains();
    initLabels();
}

var continueAnimation = false;
var animationDirection = -1;

function slideAllMountains() {
    clear();
    let resetCanvas = false;
    for (let i = 0; i < mountains.length; i++) {
        if (i === cur_index-1 && animationDirection === 1) {
            console.log(i, 'case 1')
            resetCanvas = !mountains[i].slideAndScale(8 * animationDirection, 4 * animationDirection, animationDirection);
        } else if (i === cur_index+1 && animationDirection === -1) {
            console.log(i, 'case 2')
            resetCanvas = !mountains[i].slideAndScale(8 * animationDirection, 4 * animationDirection, animationDirection);
        } else if (i <= cur_index) {
            console.log(i, 'case 3')
            mountains[i].slideAndScale(8 * animationDirection, 4 * animationDirection, animationDirection);
        } else {
            console.log(i, 'case 4')
            mountains[i].slideAndScale(8 * animationDirection, 4 * animationDirection, animationDirection);
        }
    }
    // console.log(mountains[1].centerX - mountains[1].x);
    return resetCanvas;
}

function draw() {
    if (continueAnimation) {
        // console.log('continuing animation');
        let resetCanvas = slideAllMountains();
        if (resetCanvas) {
            continueAnimation = false;
            // initMountains();
            cur_index -= animationDirection;
            // clear();
            // var center = mountains[0].centerX;
            // for (let i=0; i < mountains.length; i++) {
            //     var newX = center;
            //     if (i < cur_index) {
            //         newX -= (cur_index - i) * center;
            //     } else if (i > cur_index) {
            //         newX += (i - cur_index) * center;
            //     }
            //     mountains[i].setX(newX);
            // }
            initLabels();
            console.log('new index', cur_index);
        }
    }
}

document.addEventListener('keydown', event => {
    if (event.key === 'a') {
        console.log(event.key);
        if (cur_index < mountains.length-1) {
            animationDirection = -1;
            continueAnimation = true;
            var labels = document.getElementById('level-labels');
            labels.innerHTML = '';
        }
    } else if (event.key === 'd') {
        console.log(event.key);
        if (cur_index > 0) {
            animationDirection = 1;
            continueAnimation = true;
            var labels = document.getElementById('level-labels');
            labels.innerHTML = '';
        }
    } else if (event.key === 'j') {
        mountains[cur_index].displayInfoPopup();
    } else if (event.key === 'k') {
        mainWindow.loadURL(url.format({
          pathname: path.join(__dirname, '../index.html'),
          protocol: 'file:',
          slashes: true
      }));
    }
});

// function keyPressed() {
//     console.log(keyCode);
//     if (keyCode === LEFT_ARROW) {
//         animationDirection = -1;
//         continueAnimation = true;
//     } else if (keyCode === RIGHT_ARROW) {
//         animationDirection = 1;
//         continueAnimation = true;
//     }
// }

exports.setup = setup;
exports.draw = draw;
