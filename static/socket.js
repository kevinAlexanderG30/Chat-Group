
document.addEventListener('DOMContentLoaded', () => {

    var socket = io.connect(location.protocol+'//' + document.domain + ':' + location.port);
    socket.on('connect', () => {

        var myModal = document.getElementById('myModal')
        var myInput = document.getElementById('myInput')
        nombre_Usuario= document.querySelector("#actual_user").textContent
        localStorage.setItem('username1', nombre_Usuario);
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
            nombre_Usuario2 =  localStorage.getItem('username1');
            localStorage.removeItem("username1");
            localStorage.removeItem("Room");
            socket.emit("eliminar_usuario", nombre_Usuario2);
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
            
            if (channel === "") {
                alert("No esta en un canal");
                textbox.placeholder = "Entre a un canal";
                 textbox.value = "";
             }
            // const current = document.querySelector("#enviar_mensaje").textContent;
            if (textbox.value === "" ) {
                    //console.log("entro");
                    textbox.placeholder = "Escriba antes de enviar";
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
            li.classList.add("dropdown-item");
            li.setAttribute("id", "item-li");
            li.append(name);
            item_canales.append(li);   
            console.log(item_canales);
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
            
            console.log(data);
            if (data["size"] === 100 ) {
                const list = document.getElementById("msg");
                list.removeChild(list.querySelector("li"));   
            }
            var nameLocal = localStorage.getItem('username1');
           console.log(document.querySelector("#actual_canal").textContent);
           console.log( "Hola mundo");
            // Dispara el mensaje enviado a la pagina
            if (document.querySelector("#actual_canal").textContent === data.channel) {
                if (data["message"]["name"] == nameLocal) {
                    
                    var name = data["message"]["name"]
                    var mensaje2 = (data["message"]["text"]);
                    var timestamp = data["message"]["timestamp"]
                    var mensaj = name +": " + mensaje2 
                    //console.log(timestamp);
                    var item_mensaje = document.querySelector(".chat-box");
                    var ul = document.querySelector("#msg");
                    var div_primario =  document.createElement("li");
                    var div_secundario = document.createElement("li");
                    div_primario.classList.add("message");
                    div_primario.classList.add("primary")
                    div_secundario.classList.add("timestamp");
                    div_primario.append(mensaj);
                    div_secundario.append(timestamp);
                    div_primario.appendChild(div_secundario);
                    ul.appendChild(div_primario);
                    item_mensaje.append(ul);
                    
                }
                else {
                    var name = data["message"]["name"]
                    var mensaje2 = (data["message"]["text"]);
                    var timestamp = data["message"]["timestamp"]
                    var mensaj = name +": " + mensaje2 
                    //console.log(timestamp);
                    var item_mensaje = document.querySelector(".chat-box");
                    var ul = document.querySelector("#msg");
                    var div_primario =  document.createElement("li");
                    var div_secundario = document.createElement("li");
                    div_primario.classList.add("message");
                    div_primario.classList.add("secondary")
                    div_secundario.classList.add("timestamp");
                    div_primario.append(mensaj);
                    div_secundario.append(timestamp);
                    div_primario.appendChild(div_secundario);
                    ul.appendChild(div_primario);
                    item_mensaje.append(ul);
                }
                
                
            }

                 
        });
        
        socket.on("CargarMensaje", data => { 
            console.log(data);
            // elimina los mensajes antiguos de la pagina
            document.querySelectorAll("#msg").forEach(function(element){ 
                var cambiarMensaje = element.textContent ="";
                document.getElementById('msg').textContent =  cambiarMensaje;
            });
            nombre_user = document.querySelector("#actual_user").textContent
        
            for (let index = 0; index < data.length; index++) { 
                    console.log(data[index]["name"]);
                if (data[index]["name"] == nombre_user ) {
                    var name = data[index]["name"]
                    var mensaje2 = data[index]["text"];
                    var timestamp = data[index]["timestamp"]
                    var mensaj = name +": " + mensaje2 
                    //console.log(timestamp);
                    var item_mensaje = document.querySelector(".chat-box");
                    var div_primario =  document.createElement("li");
                    var div_secundario = document.createElement("li");
                    var ul_item =  document.querySelector("#msg")
                    div_primario.classList.add("message");
                    div_primario.classList.add("primary")
                    div_secundario.classList.add("timestamp");
                    div_primario.append(mensaj);
                    div_secundario.append(timestamp);
                    div_primario.appendChild(div_secundario);
                    ul_item.appendChild(div_primario)
                    item_mensaje.append(ul_item);
                    
                }

                else{
                    var name = data[index]["name"]
                    var mensaje2 = (data[index]["text"]);
                    var timestamp = data[index]["timestamp"]
                    var mensaj = name +": " + mensaje2 
                    //console.log(timestamp);
                    var item_mensaje = document.querySelector(".chat-box");
                    var div_primario =  document.createElement("li");
                    var div_secundario = document.createElement("li");
                    var ul_item =  document.querySelector("#msg")
                    div_primario.classList.add("message");
                    div_primario.classList.add("secondary")
                    div_secundario.classList.add("timestamp");
                    div_primario.append(mensaj);
                    div_secundario.append(timestamp);
                    div_primario.appendChild(div_secundario);
                    ul_item.appendChild(div_primario)
                    item_mensaje.append(ul_item);
                }
                  
            }
                
        });

        socket.on("Canal_Novalido", data => {
            alert(data);
        })


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