socket = io()

document.querySelector("form").onsubmit = () =>
{
    nombre = document.querySelector("#nombre").value

    localStorage.setItem('usuario', nombre);

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

if (!localStorage.getItem('nombre'))
                localStorage.setItem('nombre', 0);

            // Load current value of  counter
            document.addEventListener('DOMContentLoaded', () => {
                document.querySelector('#nombre').innerHTML = localStorage.getItem('nombre');
                

            });
