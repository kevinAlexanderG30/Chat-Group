import os
from flask import Flask, redirect, render_template, request, session
from flask_session import Session
from flask_socketio import SocketIO, emit,join_room
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
    canal = session["canales_actuales"]
    print(canales)
    return render_template("index.html", canal=canal,lista_canales=lista_canales)

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

    nuevo_canal = nombre

    if not nuevo_canal:
        return redirect("/")

    #Lista Mensajes
    lista = []

    #Añadir los mensajes en los canales  
    canales[nuevo_canal] = lista

    session["canales_actuales"] = nuevo_canal

    emit('addhtml', nombre, broadcast=True)


if __name__ == '__main__':
    socketio.run(app)