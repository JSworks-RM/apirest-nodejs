/* Archivo principal de nuestra app */

// Dependencias
const http = require('http') // Paquete core de nodejs
const https = require('https') // Paquete core de nodejs
const servidorUnificado = require('./servidorUnificado')
const fs = require('fs');

// Crear el servidor con los paquetes CORE de NodeJS sin usar los paquetes NPM. 
// Función createServer del pack 'http' / 'https'. Ejecuta la función cuando el cliente solicita una petición(request)
// Crea servidor http
const servidor = http.createServer(servidorUnificado)

// Crea servidor https
// Usamos del módulo nativo File System el método síncrona readFileSync() y no asíncrono porque necesitamos que cargue en el servidor inmediatamento sin tener que esperar a que se ejecute un evento para lanzar la callback. Cuando estemos cargando el servidor, que lea ese archivo al momento y por eso es que debemos hacerlo síncrono. 
const options = {
    key: fs.readFileSync('./https/key.pem'),
    cert: fs.readFileSync('./https/cert.pem')
  };
  
const servidorHttps = https.createServer( options, servidorUnificado )


// El servidor debe mantener el proceso y escuchar peticiones http
servidor.listen(3000, () => {
    console.log('El servidor http está escuchando en el puerto 3000');
});

// El servidor debe mantener el proceso y escuchar peticiones http
servidorHttps.listen(3001, () => {
    console.log('El servidor https está escuchando en el puerto 3001');
});

