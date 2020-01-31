const url = require('url')
const StringDecoder = require('string_decoder').StringDecoder
const _data = require('./lib/data')
const _identificador = require('./lib/identificador')

// Enrutador: Es un objeto o JSON de JS que va a tener unas funciones. Entonces vamos a hacer un match de estas funciones con las claves de ese objeto y que dispare la función callbak o handler (manejador) que esta guardada en esa llave como valor y es la que va a hacer toda la tarea que tiene esa ruta.
const enrutador = {
    ejemplo: ( data, callback ) => {
        callback( 200, { mensaje: 'Esto es un ejemplo' } )
    },
    noEncontrado: ( data, callback ) => {
        callback( 404, { mensaje: 'Recurso no encontrado' } )
    }, 
// Nueva clave como recurso para creación de usuarios
// Recibirá una data que viene del request y una callback
    usuarios: (data, callback ) => {
        switch ( data.metodo ) {
            case 'post':
                //const identificador = new Date().getTime();
                const identificador = _identificador();
                _data.crear(
                    { 
                        directorio: data.ruta, 
                        archivo: identificador, 
                        data: data.payload 
                    }, 
                    error => {
                        if ( error ) {
                            callback( 500, JSON.stringify( { error } ) )
                        } else {
                            callback( 201, data.payload )
                        }
                    }
                )
                break;
            default:
                callback( 404, {
                    mensaje: `No puedes usar ${data.metodo} en ${data.ruta}`
                })
                break;
        }
    }

} // Fín enrutador

const servidorUnificado = (req, res) => { 
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

        // Respuesta según la ruta
        // Capturamos toda la información que viene, que recibimos del request y la almacenamos dentro un objeto que vamos a llamarle data
        const data = {
            ruta: rutaLimpia,
            metodo, // Igual que decir metodo: metodo // ECMASCRIPT6
            query,
            headers,
            payload: buffer
        }
        
        // Enviamos la respuesta. 
        let handler
        if ( rutaLimpia && enrutador[rutaLimpia] ) {
            handler = enrutador[rutaLimpia]
        } else {
            handler = enrutador.noEncontrado
        }

        handler ( data, (statusCode = 200, mensaje ) => {
            const respuesta = JSON.stringify(mensaje) // Respuesta como string
            res.setHeader('Content-Type', 'application/json') // Setting de los headers de las respuestas indicando el tipo. En este caso estamos enviando tipo json
            res.writeHead(statusCode)
            res.end(respuesta)
        })
    })
} // Servidor unificado

module.exports = servidorUnificado;