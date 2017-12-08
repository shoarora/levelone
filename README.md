# Level One

CS147 Hi-Fi Prototype

Built with electron, p5.js, xbox kinect, and flask (python)

## Install Instructions
You can either get the prebuilt version of the app [here](web.stanford.edu/~shoarora/cs147),
or you can clone this repo and run it with node.js as follows:

run `npm install` first time
run `npm start` to start

## How to run
The app relies on a web server to capture game state.  The server can either be connected to an Xbox Kinect motion classifier, or to a 'wizard of oz' script that simply scrolls through game states on key press.  

```
/wiz/server.py: the python/flask server
/wiz/kinecter.py: launches the kinect classifier and updates the server
/wiz/wiz.py: script to update server state every time you press ENTER
```

These are written for `python 2.7`.  There is also a `/wiz/requirements.txt` to install the required packages (but it's only flask).

Once you have the server running (we did it on Stanford's myth clusters), set the url in the wizard and in the app.  

## Controls
The game was intended to be demonstrated with a video game controller.  As such, to use it with a keyboard, use `w-a-s-d` for the arrow keys, `j` as your conventional A/forward button, and `k` as your B/back button.

In demonstration, we used a wiimote and the mac application `Joystick Mapper` to turn the wiimote's button clicks into the above keystrokes.  


## Limitations
We hardcoded a lot of data, such as the ability to add friends, starting level, and a few rounds of game play.
