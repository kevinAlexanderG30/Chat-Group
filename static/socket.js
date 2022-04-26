socket = io()

// if (!localStorage.getItem('Usuario'))
//                 localStorage.setItem('Usuario+', 0);

document.querySelector("form").onsubmit = () =>
{
    nombre = document.querySelector("#nombre").value

    socket.emit("validar usuarios", nombre)

    // socket.emit("saludar", nombre, (respuesta) => {
    //     document.querySelector("#contenido").append(respuesta)
    //     document.querySelector("#contenido").innerHTML += ("<br>")
    // })

    return false;
}

socket.on("validar usuarios2", (dato) => {
    alert(dato);
})

socket.on("meter usuario", (dato) => {
    console.log(dato)
    localStorage.setItem("Usuario", dato); 
})

socket.on("mensaje", (dato) => {
    document.querySelector("#contenido").append(dato)
    document.querySelector("#contenido").innerHTML += ("<br>")
})
