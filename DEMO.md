# How to work stuff for demos

## The app
`w-a-s-d` are arrow keys `j` is select, `k` is back

The app has hardcoded 3 rounds of gameplay.  After that, the progress things
stop updating.  To revert back to the first round of game play, press `b` from
the home screen.

## The Server
The app connects to a server to get game state.  The server route is
defaulted to `http://myth3.stanford.edu:5000/`.  If for whatever reason
this isn't available, from the first home menu, press `v` and submit
the new route (and don't forget the `http://` or the `/` at the end).

In order to run the server, download the wizard materials by running
```
wget http://web.stanford.edu/class/cs147/projects/health/levelone/assignments/wiz.zip

unzip wiz.zip
cd wiz
```
in a machine.

I'd use `myth`, and you can specify a specific
one when you `ssh`:

```
ssh shoarora@myth3.stanford.edu
```

To actually start the server:
```
sh start_server.sh
```

## Wizard of Oz
if the kinect doesn't work or is unavailable,
you can run a wizard that progresses through
game state everytime you hit ENTER

```
sh start_wiz.sh
```

Make sure that the right server address is placed in `wiz.py`.
