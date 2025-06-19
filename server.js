require('dotenv').config();
const WebSocket = require('ws');
const express = require('express');
const cors = require('cors');
const app = express();
const http = require('http').Server(app);
const wss = new WebSocket.Server({ server: http });

// Configurar CORS
const corsOptions = {
    origin: 'http://localhost', // URL de tu frontend (puede ser 'localhost' o el dominio que estés usando)
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'], // Puedes agregar más cabeceras permitidas si es necesario
    credentials: true, // Permite cookies si lo necesitas
  };

// Usar el middleware CORS con las opciones configuradas
app.use(cors(corsOptions));

// Resto del código WebSocket y Express
const port = process.env.WEBSOCKET_PORT || 5001;
const host = process.env.WEBSOCKET_HOST || 'localhost'; 

app.get('/healtcheck', (req, res) => res.send('Ok') )

// Almacenamos las conexiones de los clientes para poder enviarles datos
wss.on('connection', (ws) => {
     console.log('Nuevo cliente conectado');

     ws.on('message', (message) => {
         try {
             // Intentamos parsear el mensaje como JSON
             const data = JSON.parse(message);

             // Verificamos que `userId`, `idCiudadano` y `image` estén presentes
             //const { userId, idCiudadano, image } = data;
             const { idPersona, image } = data;

             // Validación más robusta de la imagen
             if (idPersona && image && typeof image === 'string' && image.startsWith('data:image/')) {
                 console.log('Imagen recibida');

                 // Reenviar la imagen a otros clientes conectados
                 wss.clients.forEach((client) => {
                     if (client !== ws && client.readyState === WebSocket.OPEN) {
                         //client.send(JSON.stringify({ userId, idCiudadano, image }));
                         client.send(JSON.stringify({ idPersona, image }));
                     }
                 });
             } else {
                 console.error('Mensaje recibido no válido. Se esperaban los campos userId, idCiudadano e image en Base64.');
             }
         } catch (error) {
             console.error('Error al procesar el mensaje:', error);
         }
     });

     ws.on('close', () => {
         console.log('Cliente desconectado');
         // Limpiar recursos o registros si es necesario
     });

     ws.on('error', (error) => {
         console.error('Error en WebSocket:', error);
     });
 });

 // Iniciar el servidor HTTP (que también manejará WebSockets)
 http.listen(port, host, () => {
     console.log(`Servidor WebSocket corriendo en: ws://${host}:${port}`);
 });