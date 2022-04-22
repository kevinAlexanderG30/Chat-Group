import os

from flask import Flask, render_template
from flask_socketio import SocketIO, emit

#https://github.com/J-Soma/flask_socketio_ejemplos.git jeffry repository
app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

usuarios = []

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
    
    for usuario in usuarios:
        if usuario == nombre:
            nombreUsado = usuario
            meterlista = 1
            break
        else:
            meterlista = 0
    
    if meterlista == 1:
        usuarios.append(nombre)
    else: 
        emit("validar usarios2", f'Nombre de usuario no disponible {nombre}', meterlista)




