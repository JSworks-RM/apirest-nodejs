/* Archivo principal de nuestra app */

// Dependencias
const http = require('http'); // Paquete core de nodejs
const url = require('url');

// Crear el servidor con los paquetes CORE de NodeJS sin usar los paquetes NPM. 
// Función createServer del pack 'http'. Ejecuta la función cuando el cliente solicita una petición(request)
const servidor = http.createServer((req, res) => { 
    // Obtener la url desde el request. Obtenemos y la parseamos con el método parse()
    let urlRquest = req.url
        urlParseada = url.parse( urlRquest, true ) // Crea un objeto url -> Url { ... }
        console.log('URL parseada: ', urlParseada)
        
    // Obtenemos la ruta
    const ruta = urlParseada.pathname
        console.log(`Ruta: ${ruta}`)
    
    // Enviamos la respuesta
    res.end('Hola mundo desde un servidor de nodejs');
});

// El servidor debe mantener el proceso y escuchar peticiones http
servidor.listen(3000, () => {
    console.log('El servidor está escuchando en el puerto 3000');
});
