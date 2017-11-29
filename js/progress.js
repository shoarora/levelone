const electron = require('electron');

const headerSize = 150;
const footerSize = 150;

class MountainImg {
    constructor(path, centerX, x, y, width, height) {
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
}

var mountains;
var canvasHeight;
var canvasWidth;
var cur_index = 2;

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
        var img_path = 'img/cur_mountain.png'
        if (i < 2) {
            startX -= (2 - i) * center;
            curStartWidth -= (2 - i) * center  / 2;
            curStartHeight -= (2 - i) * center  / 2;
            img_path = 'img/done_mountain.png'
        } else if (i > 2) {
            startX += (i - 2) * center;
            curStartWidth += (i - 2) * center / 2;
            curStartHeight += (i - 2) * center  / 2;
            img_path = 'img/locked_mountain.png'
        }

        mountains.push(new MountainImg(
            img_path,
            center,
            startX,
            mountainBase,
            curStartWidth,
            curStartHeight
        ));
    }
}

function setup() {
    const mainWindow = electron.remote.getGlobal('sharedObj').mainWindow;
    const size = mainWindow.getSize();
    console.log(size);
    canvasWidth = size[0];
    canvasHeight = size[1] - headerSize - footerSize;
    createCanvas(canvasWidth, canvasHeight);
    initMountains();
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
            console.log('new index', cur_index);
        }
    }
}

document.addEventListener('keydown', event => {
    if (event.key === 'j') {
        console.log(event.key);
        if (cur_index < mountains.length-1) {
            animationDirection = -1;
            continueAnimation = true;
        }
    } else if (event.key === 'k') {
        console.log(event.key);
        if (cur_index > 0) {
            animationDirection = 1;
            continueAnimation = true;
        }
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
