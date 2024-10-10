import json
import joblib
from flask import Flask,request,jsonify
from flask_socketio import SocketIO, emit
from machine import Machine
from  helpers import read_machine_data
from threading import Thread, Lock


async_mode = None

app = Flask(__name__)
socketio = SocketIO(app, async_mode=async_mode, cors_allowed_origins="*")
thread = None
thread_lock = Lock()


model_path = './model/model(all)(d=4).pkl'
machine = Machine("A",joblib.load(model_path))


def background_thread():
    while True:
        socketio.sleep(3)
        machine.generate_machine_data()
        machine.log_data_to_csv()
        machine_status = machine.get_machine_status()
        socketio.emit('machine_status', json.dumps(machine_status))

@socketio.on('connect')
def handle_connect():
    print("Client connected Sending File Data ...")
    machine_data = read_machine_data()
    socketio.emit('machine_data', json.dumps(machine_data))

@socketio.on('disconnect')
def handle_disconnect():
    print("Client disconnected")

@app.route('/machine-mode', methods=['POST'])
def set_machine_mode():
    simulate_failure = request.headers.get('machine-mode', 'false').lower() == 'true'
    if simulate_failure:
        machine.set_machine_mode(mode="fail")
        return jsonify({"status": "success", "message": "Machine Simulating failure"}), 200
    else:
        machine.set_machine_mode(mode="normal")
        return jsonify({"status": "success", "message": "Machine set to Normal"}), 200

def start_background_task():
    """Function to start the background thread independently of client connections."""
    global thread
    with thread_lock:
        if thread is None:
            thread = socketio.start_background_task(background_thread)

if __name__ == '__main__':
    start_background_task()  
    PORT = 5000
    socketio.run(app, port=PORT)