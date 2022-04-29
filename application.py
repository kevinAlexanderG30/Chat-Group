import os
from flask import Flask, redirect, render_template, request, session
from flask_session import Session
from flask_socketio import SocketIO, emit,join_room
from functools import wraps

#https://github.com/J-Soma/flask_socketio_ejemplos.git jeffry repository
app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

usuario = []

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
    return render_template("index.html")

@app.route("/login",methods=["GET", "POST"])
def login():
    if request.method == "GET": 
        return render_template("login.html")
    else: 
        user = request.form.get("nombre").strip()
        session["user_id"] = user
        print("buenas")
        print(session["user_id"])
        return redirect("/")
    

@app.route("/logout")
def logout():
    """Log user out"""

    # Forget any user_id
    session.clear()

    # Redirect user to login form
    return redirect("/login")

# Al recibir el evento saludar
@socketio.on('saludar')
def saludar(nombre):
    print(f'Hola {nombre}')

    #Emitir solo al usuario que origino este evento
    emit("mensaje", f'Hola {nombre}')

    #Enviar respuesta de evento emit del cliente
    return f'Hola {nombre}'

@socketio.on('validar_usuarios')
def nombres_usuarios(nombre):
    entrar = 0
    nombres = nombre
    print(f'{nombres}')
    if nombre == "":
        pass
    else: 
        for usuarios in usuario:
            if usuarios == nombre:
                entrar = 1
                print("Usuario no permitido")
                dato = (f"Nombre no disponible {nombre}")
                emit("denegar_user", dato)   
            else:
                entrar = 0
    if entrar == 0:
        print("Meter Usuario")
        print(nombre)
        usuario.append(nombre)
        print(nombre)
        print(f"{usuario}")
        emit("meter_usuario", nombre, include_self=True)

@socketio.on('ingresar_sala')
def ingresarSala(dato):
    join_room(dato)


if __name__ == '__main__':
    socketio.run(app)