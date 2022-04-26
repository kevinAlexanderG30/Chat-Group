import os

from flask import Flask, render_template
from flask_socketio import SocketIO, emit

#https://github.com/J-Soma/flask_socketio_ejemplos.git jeffry repository
app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

usuario = []

@app.route("/")
def index():
    return render_template("index.html")

# Al recibir el evento saludar
@socketio.on('saludar')
def saludar(nombre):
    print(f'Hola {nombre}')

    #Emitir solo al usuario que origino este evento
    emit("mensaje", f'Hola {nombre}')

    #Enviar respuesta de evento emit del cliente
    return f'Hola {nombre}'

@socketio.on('validar usuarios')
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
                emit("validar usuarios2", dato)   
            else:
                entrar = 0
    if entrar == 0:
        print("Meter Usuario")
        print(nombre)
        usuario.append(nombre)
        print(nombre)
        emit("meter usuario", nombre, include_self=True)