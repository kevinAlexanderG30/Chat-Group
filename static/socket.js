document.addEventListener('DOMContentLoaded', () => {
    var socket = io.connect(location.protocol+'//' + document.domain + ':' + location.port);
    socket.on('connect', () => {

    document.querySelector("form").onsubmit = () =>
    {
        nombre = document.querySelector("#nombre").value 
        socket.emit("validar_usuarios", nombre)

        socket.emit("saludar", nombre, (respuesta) => {
             document.querySelector("#contenido").append(respuesta)
            document.querySelector("#contenido").innerHTML += ("<br>")
        })

        return false;
    }

    socket.on("denegar_user",  (dato) => {
        console.log("Usuario no permitido");
        alert(dato);
    })

    socket.on("meter_usuario" , (dato) => {
        console.log(dato)
        localStorage.setItem("usuario", dato); 
        
        socket.emit("ingresar_sala", (dato) => { 
           document.getElementById("registroUsuario").style.display = "none";
        })
    })

    socket.on("mensaje", (dato) => {
        document.querySelector("#contenido").append(dato)
        document.querySelector("#contenido").innerHTML += ("<br>")
    })

});

});