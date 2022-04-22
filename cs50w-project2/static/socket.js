socket = io()

document.querySelector("form").onsubmit = () =>
{
    nombre = document.querySelector("#nombre").value

    socket.emit("validar usuarios", nombre)

    socket.on("validar usarios2", (dato, meterlista) => { 
        if (meterlista == 0) {
            alert(dato)   
        }
        
        else { 
            localStorage.setItem('usuario', nombre);
        }

    })
    
    socket.emit("saludar", nombre, (respuesta) => {
        document.querySelector("#contenido").append(respuesta)
        document.querySelector("#contenido").innerHTML += ("<br>")
    })

    return false;
}



socket.on("mensaje", (dato) => {
    document.querySelector("#contenido").append(dato)
    document.querySelector("#contenido").innerHTML += ("<br>")
})
