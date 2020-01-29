/* Archivo principal de nuestra app */

// Dependencias
const http = require('http'); // Paquete core de nodejs
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;

// Crear el servidor con los paquetes CORE de NodeJS sin usar los paquetes NPM. 
// Función createServer del pack 'http'. Ejecuta la función cuando el cliente solicita una petición(request)
const servidor = http.createServer((req, res) => { 
    // Obtener la url desde el request. Obtenemos y la parseamos con el método parse()
    let urlRquest = req.url
        urlParseada = url.parse( urlRquest, true ) // Con true crea un objeto url -> Url { ... }. Por default es false
        console.log('URL parseada: ', urlParseada, '\n')
        
    // Obtenemos la ruta
    const ruta = urlParseada.pathname
    console.log(`Ruta: ${ruta} \n`)

    // Limpiando la ruta quitando los slashes usando método replace()
    const rutaLimpia = ruta.replace(/^\/+|\/+$/g, '')
    console.log(`Ruta limpia: ${rutaLimpia} \n`)
    
    // Obtener método http. Tambien se encuentra dentro del objeto request
    const metodo = req.method.toLowerCase()
    console.log(`Método: ${metodo} \n`)

    // Obtenemos las queries de la url
    const query = urlParseada.query
    console.log('Query (?key=value): ', JSON.stringify(query), '\n')

    // Obtenemos headers: Con headers vemos el contenido del request que vamos a necesitar para el alcance de este proyecto. Con el header podemos ver el tipo de contenido que nos estan enviando, autenticación, para indicar que tipo de aplicación pueden usarlo, entre otros...
    const headers = req.headers
    console.log(headers)

    // Obteniendo un payaload, si es que hay
    // Creamos un objeto de StringDecoder que es un prototípo y en su constructor le pasaremos la encodificación de caracteres. Y esto es debido a que el payload se recibe como un string.
    // El request tiene eventos asociados lo que le permite estar escuchando eventos cuando recibe datos, es decir, que el evento asociado va a dispararse cada vez que sea ejecutado y podemos capturarlo con una callback cuyo parámetro inicial es la misma data.
    // Sin embargo esa data no es tangible para el ser humano, no es legible ni alfanuméricamente dada; De hecho es un binal. 
    // Debemos controlarlo con un buffer
    const decoder = new StringDecoder('utf-8') // Recibe un string y lo pasa de string a texto. Como viene por pedazos, entonces cada uno de esos pedazos va a disparar el evento data.
    // Entonces cada vez que reciba el evento data, vamos a concatenar todo lo que venga por data en un string. Por eso es que iniciamos la variable buffer de tipo string
    let buffer = ''
    req.on('data', data => {
        console.log('Data evento: ', data)
        buffer += decoder.write(data) // Concatenando la data
        console.log('Buffer: ', buffer)
    })
    req.on('end', () => { // Ciclo de vida del req. Recomendable terminar con el end
        buffer += decoder.end() // Finaliza y cierra ese mensaje de text
        console.log('Ejecutamos evento \"end\": ', buffer, '\n')
    })
    
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
