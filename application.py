import os
from flask import Flask, jsonify, redirect, render_template, request, session
from flask_session import Session
from flask_socketio import SocketIO, emit,join_room, leave_room
from functools import wraps


#https://github.com/J-Soma/flask_socketio_ejemplos.git jeffry repository
app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

canales = { "Publico": []}

@app.after_request
def after_request(response):
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Expires"] = 0
    response.headers["Pragma"] = "no-cache"
    return response


# Configure session to use filesystem
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

def login_required(f):
    """
    Decorate routes to require login.
    http://flask.pocoo.org/docs/0.12/patterns/viewdecorators/
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if session.get("user_id") is None:
            return redirect("/login")
        return f(*args, **kwargs)
    return decorated_function

@app.route("/")
@login_required
def index():
    lista_canales = canales
    canal_actual = session["canales_actuales"]
    print(canales)
    return render_template("index.html", canal_actual=canal_actual,lista_canales=lista_canales)

@app.route("/createCanal", methods=["POST"])
def createCanal():
    nuevo_canal = request.form.get("name")
    print(f"{nuevo_canal}, canal nuevo")
    if not nuevo_canal:
        return redirect("/")

    #Lista Mensajes
    lista = []

    #Añadir los mensajes en los canales  
    canales[nuevo_canal] = lista

    session["canales_actuales"] = nuevo_canal

    return redirect("/")
    


@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "GET": 

         return render_template("login.html")

    else:

        # Almacenar el nombre para mostrar a través de la sesión
        session["user_id"] = request.form.get("name")

        if not canales:
            session["canales_actuales"] = "No hay canales Disponibles"
        else:
            session["canales_actuales"] = list(canales.keys())[0]

        # Redirect to channel
        return redirect("/")    

@app.route("/logout")
def logout():
    """Log user out"""

    # Forget any user_id
    session.clear()

    # Redirect user to login form
    return redirect("/login")

@socketio.on('nuevo__canal')
def nuevo_canal(nombre):

    channel = nombre

    if not channel:
        return redirect("/")

    #Lista Mensajes
    lista = []

    #Añadir los mensajes en los canales  
    canales[channel] = lista
    print()
    print(canales[channel])

    session["canales_actuales"] = channel

    emit('addhtml', nombre, broadcast=True)

@socketio.on("submit message")
def newMessage(data):
    """ Broadcast the send message event to all user whenever a new message is submitted """
    print(data)
    # Retrieve current channel from session
    channel = data["channel"]

    # Store message into current channels storage (pop oldest message if over 100)
    message = data["message"]
    
    canales[channel].append(message)
    print(canales[channel])
    # Retrieve number of messages
    size = len(canales[channel])
    # Broadcast the new message to the channel for everyone to see
    emit("announce message", {"channel": channel, "message": message, "size": size}, broadcast=True)

@socketio.on("change_room")
def change_room(data):
    print("Change room")
    print(canales[data])
    room = session["canales_actuales"]
    leave_room(room)
    room = data
    join_room(room)
    

if __name__ == '__main__':
    socketio.run(app)