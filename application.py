import os
from unicodedata import name
from flask import Flask, jsonify, redirect, render_template, request, session
from flask_session import Session
from flask_socketio import SocketIO, emit,join_room, leave_room
from functools import wraps


#https://github.com/J-Soma/flask_socketio_ejemplos.git jeffry repository
app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

canales = { "Publico": []}
user = []

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
    user_actual = session["user_id"]
    print(canales)
    return render_template("index.html", canal_actual=canal_actual,lista_canales=lista_canales,user_actual=user_actual)

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
        name = request.form.get("name")
        salida = 1
        for usuario in user:
            if usuario == name:
                enviar = (f"usuario ya registrado {name}")
                salida = 0
        
        for canal in canales:
            if canal == name:
                enviar = (f"Este nombre es un canal usado {name}")
                salida = 0
        
        if salida == 1:
            user.append(name)
            session["user_id"] = name

            if not canales:
                session["canales_actuales"] = "No hay canales Disponibles"
            else:
                session["canales_actuales"] = list(canales.keys())[0]

            # Redirect to channel
            return redirect("/")   
        else:
            return render_template("login.html")
            

@app.route("/logout")
def logout():
    """Log user out"""

    # Forget any user_id
    session.clear()

    # Redirect user to login form
    return redirect("/login")

@socketio.on('nuevo__canal')
def nuevo_canal(nombre):
    print("Nombre entro")
    salida = 1
    channel = nombre

    if not channel:
        return redirect("/")
    print(canales)
    print(channel)
    for canal in canales:
        print(canal)
        if canal == channel:
            salida = 0
            No_valido = f"Nombre de canal {channel} no disponible"
            break
    for usuario in user:
        if usuario == channel:
            salida = 0
            No_valido = f"Nombre usado como usuario {channel} no disponible"
            break
    if salida == 1:

        #Lista Mensajes
        lista = []

        #Añadir los mensajes en los canales  
        canales[channel] = lista
        print()
        print(canales[channel])

        session["canales_actuales"] = channel

        emit('addhtml', nombre, broadcast=True)
    else:
       
        emit("Canal_Novalido",No_valido,broadcast=False)

@socketio.on("submit message")
def newMessage(data):
    """ Broadcast the send message event to all user whenever a new message is submitted """
    #print(data)
    # Retrieve current channel from session
    channel = data["channel"]

    # Store message into current channels storage (pop oldest message if over 100)
    message = data["message"]
    if len(canales[channel]) == 100:
        canales[channel].pop(0)
    
    canales[channel].append(message)
    print(canales[channel])
    # Retrieve number of messages
    size = len(canales[channel])
    # Broadcast the new message to the channel for everyone to see
    emit("anunciar mensaje", {"channel": channel, "message": message, "size": size}, broadcast=True)

@socketio.on("change_room")
def change_room(data):
    print("Change room")
    Mensajes = canales[data]
    print(canales[data])
    room = session["canales_actuales"]
    leave_room(room)
    room = data
    join_room(room)
    emit("CargarMensaje", Mensajes , broadcast=False)

@socketio.on("eliminar_usuario")
def eliminar_usuario(data):
    print(user)
    for use in user:
        if use == data:
            user.remove(data)
    print(user)


if __name__ == '__main__':
    socketio.run(app)