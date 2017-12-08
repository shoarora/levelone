from flask import Flask
import json
import thread

app = Flask(__name__)
response = {
    'player1State': 0,
    'player2State': 0
}


@app.route('/')
def hello_world():
    return 'Hello, World!'


@app.route('/game/state')
def get_game_state():
    return json.dumps(response)


@app.route('/update/<p1>')
def update_p1_score(p1):
    response['player1State'] = int(p1)
    return json.dumps({})

if __name__ == "__main__":
    #thread.start_new_thread(app.run, (), {'host': '0.0.0.0'})
    app.run(host='0.0.0.0')
