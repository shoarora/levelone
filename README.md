# Level One

CS147 Hi-Fi Prototype

Built with electron, p5.js, Microsift Kinect for Windows SDK, and flask (python)

## Install Instructions
You can either get the prebuilt version of the app [here (available for mac only)](http://web.stanford.edu/class/cs147/projects/health/levelone/assignments/Level%20One.zip),
or you can clone this repo and run it with node.js (should run on anything but we haven't tried,
but also more stable on mac) as follows:

run `npm install` first time
run `npm start` to start

## How to run
The app relies on a web server to capture the game's state.  The server can either be connected to an Xbox Kinect motion classifier, or to a 'wizard of oz' script that simply scrolls through game states on key presses.  

```
/wiz/server.py: the python/flask server
/wiz/kinecter.py: launches the kinect classifier and updates the server
/wiz/wiz.py: script to update server state every time you press ENTER
```

These are written for `python 2.7`.  There is also a `/wiz/requirements.txt` to install the required packages (but it's only flask).

Once you have the server running (we did it on Stanford's myth clusters), set the url in the wizard and in the app.  

## How to run with Kinect
Note: The kinect only works with windows computers.
Instal the Microsift Kinect for Windows SDK and the necessary Kinect Drivers. You can check if you have done this successfully by opening the SDK Kinect Browser 2.0 and running the kinect configuration verifier. Warnings about the USB controller can sometimes be ignored.

run /KinectGestures/bin/x86/Debug/kinecter.py to launch.

## Controls
The game was intended to be demonstrated with a video game controller.  As such, to use it with a keyboard, use `w-a-s-d` for the arrow keys, `j` as your conventional A/forward button, and `k` as your B/back button.

In demonstration, we can use a Xbox 1 controller and the mac application `Enjoy2` to turn the Xbox 1 controller's button clicks into the above keystrokes.  


## Limitations
We hardcoded a lot of data, such as the ability to add friends, starting level, and a few rounds of game play.
