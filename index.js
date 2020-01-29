/* Archivo principal de nuestra app */

// Dependencias
const http = require('http'); // Paquete core de nodejs
const servidorUnificado = require('./servidorUnificado');

// Crear el servidor con los paquetes CORE de NodeJS sin usar los paquetes NPM. 
// Función createServer del pack 'http'. Ejecuta la función cuando el cliente solicita una petición(request)
const servidor = http.createServer(servidorUnificado)


// El servidor debe mantener el proceso y escuchar peticiones http
servidor.listen(3000, () => {
    console.log('El servidor está escuchando en el puerto 3000');
});
