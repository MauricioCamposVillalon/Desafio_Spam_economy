const enviar = require("./mailer");
const url = require("url");
const http = require("http");
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');



const fs = require("fs");
http
    .createServer(function (req, res) {
        let { correos, asunto, summernote } = url.parse(req.url, true).query;
        if (req.url == "/") {

            res.setHeader("content-type", "text/html");

            fs.readFile("index.html", "utf8", (err, data) => {
                if (err) {
                    res.end("No se pudo acceder al sitio web.")
                } else {
                    res.end(data);
                }
            });
        }

        if (req.url.startsWith("/mailing")) {
            if (correos == '' || asunto == '' || summernote == '') {
                res.end("Por favor completar todos los campos del formulario");
            } else {

                axios.get('https://mindicador.cl/api').then(respuesta => {
                    let data = respuesta.data;

                    //Se crean las lienas del mensaje
                    let linea1 = "Hola! Los indicadores económicos de hoy son los siguientes:";
                    let linea2= "El valor del dolar el día de hoy es: $"+data.dolar.valor+" pesos";
                    let linea3 = "El valor del euro el día de hoy es: $"+data.euro.valor+" pesos";
                    let linea4 = "El valor del uf el día de hoy es: $"+data.uf.valor+" pesos";
                    let linea5 = "El valor de la UTM día de hoy es: $"+data.utm.valor+" pesos";

                    //Se almacenan las lineas en una variable para ser enviada por correo
                    let mensaje = `
                            <h2>${linea1}</h2>
                            <p>${linea2}</p> 
                            <p>${linea3}</p> 
                            <p>${linea4}</p>
                            <p>${linea5}</p> 
                            <br><br>
                            <P>${summernote}</P>`
                    
                    // Se crea el codigo que sera el nombre que tendra el archivo de guardado del correo
                    let cod = uuidv4().slice(30);
                    let archivo = "correos/" + cod+ ".txt";
                    // creacion de la variable que contendra los datos dentro del archivo
                    let tareas = "Para: " + correos + 
                             "\n Asunto: "+asunto + 
                             "\n Mensaje:" + "\n"+ linea1+
                             "\n"+linea2+"\n"+linea3+"\n"+linea4+
                             "\n"+linea5+"\n"+"\n"+summernote;
                   

                    enviar(correos.split(','), asunto, mensaje).then(respuesta => {
                        //antes de mandar el mensaje de envio correcto, genero el archivo de respaldo por fs
                        const fs = require('fs');
                        fs.writeFile(archivo, tareas, "utf8", (error) => {
                            if (error) {
                                console.log("Ha ocurrido un error al crear el archivo.");
                            } else {
                                console.log("El archivo ha sido creado con exito.");
                            }
                        });
                        res.end("Correo enviado correctamente")

                    }).catch(error => {
                        console.log(error)
                        res.end("Se ha generado un error al enviar el correo electronico")
                    })
                    console.log(mensaje)

                }).catch(error => {
                    console.log(error)
                    res.end("Se ha generado un error al enviar el correo electronico")

                })
            }
        }
    })
    .listen(3001, console.log("Servidor corriendo en http://localhost:3001/"));
