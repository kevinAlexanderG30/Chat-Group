

document.addEventListener('DOMContentLoaded', () => {
    
    var socket = io.connect(location.protocol+'//' + document.domain + ':' + location.port);
    socket.on('connect', () => {

        document.querySelectorAll('.room').forEach(function(element){
            element.addEventListener('click',function() {
                var room_name = element.textContent;
                document.getElementById('actual_canal').innerHTML =  room_name;
                socket.emit('change_room',room_name);
                
                
            })
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

        document.querySelector("#enviar_mensaje").onclick = () => {

            
            const textbox = document.querySelector("#mensaje");
            const current = document.querySelector("#enviar_mensaje").textContent;
            if (textbox.value === "") {
                textbox.placeholder = "Escriba antes de enviar";
            }
            // if the requirements are satisfied,
            else {
                // store the necessary information
                const channel = document.querySelector("#actual_canal").textContent;
                console.log(channel);
                const name = document.querySelector(".navbar-brand").textContent;
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
            var li = document.createElement("li");
            var name = dato;
            li.className = "room";
            li.append(name);
            item_canales.append(li);   
            console.log(item_canales) 
        });

        socket.on('anunciar mensaje', data => {

            // display the new message on page if user is on the same page
            if (document.querySelector("#actual_canal").textContent === data.channel) {
                var mensaj = (data["message"]["text"]);
                var item_mensaje = document.querySelector("#contenido-mensaje");
                var ul_mensaje = document.querySelector("#msg");
                var li_mensaje = document.createElement("li");
                li_mensaje.append(mensaj);
                ul_mensaje.append(li_mensaje);
                item_mensaje.append(ul_mensaje);
            }

          
        });

        socket.on("CargarMensaje", data => { 
            console.log(data);
            
            
           
            
            
                
            for (let index = 0; index < data.length; index++) {                
                  var mensaj = (data[index]["text"]);
                  var item_mensaje = document.querySelector("#contenido-mensaje");
                  var ul_mensaje = document.querySelector("#msg");
                  var li_mensaje = document.createElement("li");
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