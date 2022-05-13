const sendForm = (route, object) => {

    // crear el formulario
    let form = document.createElement('form');
    form.setAttribute("method", "post");
    form.setAttribute("action", route);

    // extraer el valor del objeto
    let input = document.createElement('input');
    input.setAttribute("type", "hidden");
    let key = Object.keys(object)[0];
    input.setAttribute("name", key);
    input.setAttribute("value", object[key]);
    form.appendChild(input);

    // enviar al servidor
    document.body.appendChild(form);
    form.submit();
};

document.addEventListener('DOMContentLoaded', () => {
    
    document.querySelector("#crearCanal").addEventListener('click', () => {

        let entrada = document.querySelector("#nombre_canal");
        let nuevo_nombre = entrada.value;

        if (nuevo_nombre.length === 0) {
            error_message(entrada, "Enter new channel name");
        }

        else {
            sendForm("/createCanal", {"name": nuevo_nombre});
            
        }
    });
    

    var socket = io.connect(location.protocol+'//' + document.domain + ':' + location.port);
    socket.on('connect', () => {
        
        document.querySelector("#crearCanal").addEventListener('click', () => {

        
        });



    });

});