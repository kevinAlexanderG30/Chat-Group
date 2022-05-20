
document.addEventListener('DOMContentLoaded', () => {

    var socket = io.connect(location.protocol+'//' + document.domain + ':' + location.port);
    socket.on('connect', () => {
        // Cargar el inicio donde el usuario dejo anteriormente 
        var Room = localStorage.getItem('Room');
        console.log(Room);
        socket.emit("change_room", Room);
        document.getElementById('actual_canal').innerHTML =  Room;

        // seleccionar los canales
        document.querySelectorAll('.room').forEach(function(element){
            element.addEventListener('click',function() {
                var room_name = element.textContent;
                document.getElementById('actual_canal').innerHTML =  room_name;
                socket.emit('change_room',room_name);
                localStorage.setItem('Room', room_name);
                
                
            })
        });

        document.querySelector("#SalirLocal").addEventListener("click", () => {
            localStorage.removeItem("Room");
        });


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

        var target = document.getElementById("target");
        var emojiCount = emoji.length;

        for(var index = 0; index < emojiCount; index++)
        {
            addEmoji(emoji[index]);

        }

        function addEmoji(code)
        {
            var option = document.createElement('option');
            option.setAttribute("id", code);
            option.value = code
            option.innerHTML =  code;
            target.appendChild(option);
        }

        //Seleccion de emoji
            document.querySelector("#target").value= "";
        
            document.querySelector("#target").addEventListener("click", () => {
                
                    var emoji = document.querySelector("#target").value
                    console.log(emoji);
                    var mensaje = document.querySelector("#mensaje").value;
                    document.querySelector("#mensaje").value =  mensaje + emoji; 
                    emoji = document.querySelector("#target").value = ""   
                    console.log(emoji);
 
            });            
               

        document.querySelector("#enviar_mensaje").onclick = () => {
            const channel = document.querySelector("#actual_canal").textContent;
            const textbox = document.querySelector("#mensaje");
            
            
            // const current = document.querySelector("#enviar_mensaje").textContent;
            if (textbox.value === "" ) {
                    //console.log("entro");
                    textbox.placeholder = "Escriba antes de enviar";
                    textbox.value = "";              
            }
            if (channel === "") {
               alert("No esta en un canal");
               textbox.placeholder = "Entre a un canal";
                textbox.value = "";
            }
            // if the requirements are satisfied,
            else {
                // store the necessary information
                console.log(channel);
                const name = document.querySelector(".navbar-brand-user").textContent;
                const text = textbox.value;
                const timestamp = new Date().toString().substring(0, 15);
               
                // emit mensaje al server
                socket.emit('submit message', {'channel': channel, 'message':{'name': name, 'text': text, 'timestamp': timestamp}});
                textbox.value = "";
            }
        };
        
        // Crear las salas al html
        socket.on("addhtml", (dato) => {
            let item_canales = document.querySelector("#item-canales");
            //console.log(item_canales);
            var li = document.createElement("li");
            var name = dato;
            li.className = "room";
            li.append(name);
            item_canales.append(li);   
            console.log(item_canales)
            // cambiar room

            document.querySelectorAll('.room').forEach(function(element){
                element.addEventListener('click',function() {
                    var room_name = element.textContent;
                    document.getElementById('actual_canal').innerHTML =  room_name;
                    socket.emit('change_room',room_name);
                    localStorage.setItem('Room', room_name);
                    
                    
                })
            }); 
        });

        socket.on('anunciar mensaje', data => {
            //elimina el primer elemento de la lista de mensajes
            console.log(data["size"])
            if (data["size"] === 100 ) {
                const list = document.getElementById("msg");
                list.removeChild(list.querySelector("li"));   
            }
            
           
            // Dispara el mensaje enviado a la pagina
            if (document.querySelector("#actual_canal").textContent === data.channel) {
                var mensaj = (data["message"]["text"]);
                var item_mensaje = document.querySelector("#contenido-mensaje");
                var ul_mensaje = document.querySelector("#msg");
                var li_mensaje = document.createElement("li");
                li_mensaje.setAttribute("id", "item-mensajes");
                li_mensaje.append(mensaj);
                ul_mensaje.append(li_mensaje);
                item_mensaje.append(ul_mensaje);
            }

                 
        });

        socket.on("CargarMensaje", data => { 
            console.log(data);
            // elimina los mensajes antiguos de la pagina
            document.querySelectorAll("#msg").forEach(function(element){ 
                    var cambiarMensaje = element.textContent ="";
                    document.getElementById('msg').textContent =  cambiarMensaje;
            });
            
                
            for (let index = 0; index < data.length; index++) {                
                  var mensaj = (data[index]["text"]);
                  var item_mensaje = document.querySelector("#contenido-mensaje");
                  var ul_mensaje = document.querySelector("#msg");
                  var li_mensaje = document.createElement("li");
                  li_mensaje.setAttribute("id", "item-mensajes");
                  li_mensaje.append(mensaj);
                  ul_mensaje.append(li_mensaje);
                  item_mensaje.append(ul_mensaje);

                   
                }
        });



    });

});

{/* <script>
   function canal() {
      var p = document.createElement("p");
      var div = document.createElement("div");
      div.appendChild(p);
      let item_canales = document.querySelector("#item-canales");
      item_canales.append(document.querySelector("#nombre_canal").value); 
      item_canales.append(div);
   }
</script> */}