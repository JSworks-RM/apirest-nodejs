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
        console.log('URL parseada: ', urlParseada, '\n')
        
    // Obtenemos la ruta
    const ruta = urlParseada.pathname
        console.log(`Ruta: ${ruta} \n`)

    // Limpiando la ruta quitando los slashes usando método replace()
    const rutaLimpia = ruta.replace(/^\/+|\/+$/g, '')
        console.log(`Ruta limpia: ${rutaLimpia} \n`)
    
    // Enviamos la respuesta. 
    // Describiendo una especie de enrutador usando switch para ver los diferentes casos
    switch (rutaLimpia) {
        case 'usuarios':
            res.end('Ruta usuarios')
            break
        case 'noticias':
            res.end('Ruta noticias')
            break
        default:
            res.end('Otra ruta')
    }

});

// El servidor debe mantener el proceso y escuchar peticiones http
servidor.listen(3000, () => {
    console.log('El servidor está escuchando en el puerto 3000');
});
