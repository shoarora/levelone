const electron = require('electron');
const url = require('url');
const path = require('path');

var div = document.getElementById('menu-buttons');

function main() {
    var index = 0;
    console.log(electron.remote.getGlobal('sharedObj').serverURL);
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
        if (event.key === 's' && index < 4) {
            index++;
        }
        if (event.key === 'w' && index > 0) {
            index--;
        }
        if (event.key === 'j' && index !== 4) {
            var mainWindow = electron.remote.getGlobal('sharedObj').mainWindow;
            var pathToLoad = div.children[index].getAttribute('href');
            mainWindow.loadURL(url.format({
                pathname: path.join(__dirname, '..', pathToLoad),
                protocol: 'file:',
                slashes: true
            }));
        }
        if (event.key === 'v') {
            var mainWindow = electron.remote.getGlobal('sharedObj').mainWindow;
            mainWindow.loadURL(url.format({
                pathname: path.join(__dirname, '../..', 'config.html'),
                protocol: 'file:',
                slashes: true
            }));
        }
        highlightOptions();
    });
}

exports.main = main;
