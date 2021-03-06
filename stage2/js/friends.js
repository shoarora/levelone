const electron = require('electron');
const url = require('url');
const path = require('path');

var div = document.getElementById('menu-buttons');

function main() {
    var index = 0;
    function highlightOptions() {

        for (let i=0; i < div.children.length; i++) {
            if (i === index) {
                console.log('changing', i);
                div.children[i].style.backgroundColor = 'rgb(239, 103, 148)';
                div.children[i].style.color = 'white';
            } else {
                div.children[i].style.backgroundColor = '';
                div.children[i].style.color = 'rgb(186, 171, 180)';
            }
        }
    }
    highlightOptions();
    document.addEventListener('keydown', event => {
        if (event.key === 's' && index < 3) {
            index++;
        }
        if (event.key === 'w' && index > 0) {
            index--;
        }
        if (event.key === 'j') {
            var mainWindow = electron.remote.getGlobal('sharedObj').mainWindow;
            var pathToLoad = div.children[index].getAttribute('href');
            mainWindow.loadURL(url.format({
                pathname: path.join(__dirname, '..', pathToLoad),
                protocol: 'file:',
                slashes: true
            }));
        }
        if (event.key === 'k') {
            var mainWindow = electron.remote.getGlobal('sharedObj').mainWindow;
            mainWindow.loadURL(url.format({
                pathname: path.join(__dirname, '..', 'index.html'),
                protocol: 'file:',
                slashes: true
            }));
        }
        highlightOptions();
    });
}

exports.main = main;
