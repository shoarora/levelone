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


def update_p1_score():
    while True:
        new_val = int(raw_input())
        response['player1State'] = new_val
        response['player2State'] = new_val
        print response


if __name__ == "__main__":
    thread.start_new_thread(app.run, (), {'host': '0.0.0.0'})
    update_p1_score()
