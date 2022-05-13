

document.addEventListener('DOMContentLoaded', () => {
    
    
    var socket = io.connect(location.protocol+'//' + document.domain + ':' + location.port);
    socket.on('connect', () => {
        document.querySelector("#crearCanal").addEventListener('click', () => {

            let entrada = document.querySelector("#nombre_canal");
            let nuevo_nombre = entrada.value;
    
            if (nuevo_nombre.length === 0) {
                alert("Error");
            }
    
            else {
                socket.emit("nuevo__canal", nuevo_nombre);
                
            }
        });
        
        socket.on("addhtml", (dato) => {
            document.querySelector("#item-canales").append(dato)
            document.querySelector("#contenido").innerHTML += ("<br>")
        })



    });

});