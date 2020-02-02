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
        let usuarioId
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
            case 'get':
            // Evaluamos si hay una petición get
            // Creramos método para obtener usuarios por método GET y verificamos que exista un usuario id y si no existe devolvemos un no encontrado.
            // Agregamos params para agregar parámetros de esa url
                if ( data.params && data.params.id ) {
                    usuarioId = data.params.id
                } else {
                    // Invocación metodo que va a listar a los usuarios
                    _data.listar ( {directorio: data.ruta }, ( error, usuarios ) => {
                        if ( error ) {
                            callback ( 500, JSON.stringify({ error }) )
                        } else if ( usuarios ) {
                            callback( 200, JSON.stringify(usuarios) )
                        } else {
                            callback ( 500, JSON.stringify( {error: 'Hubo un error al leer los usuarios: '} ) )
                        }
                    } )
                    break;
                }
                _data.obtenerUno(
                    { 
                        directorio: data.ruta, 
                        archivo: usuarioId
                    }, 
                    (error, usuario) => {
                        if ( error ) {
                            callback( 500, JSON.stringify( { error } ) )
                        } else if (usuario) {
                            callback( 200, usuario )
                        } else {
                            callback(
                                500,
                                JSON.stringify({ error: 'Hubo un error al leer el usuario' })
                              )
                        }
                    }
                )
                break;
            
            // Actualizar archivos
            case 'put':
                if ( data.params && data.params.id ) {
                    usuarioId = data.params.id
                } else {
                    callback (404, JSON.stringify({ mensaje: 'Recurso no encontrado'}))
                    break;
                }
                _data.obtenerUno(
                    { directorio: data.ruta, archivo: usuarioId },
                    (error, usuario) => {
                      if (error) {
                        callback(500, JSON.stringify({ error }));
                      } else if (usuario) {
                        // En vez de enviarlo de una vez, lo vamos a eliminar
                        _data.eliminarUno (
                            { directorio: data.ruta, archivo: usuarioId },
                            error => {
                                if ( error ) return callback(500, JSON.stringify({ error }));
                                // En este caso no enviamos el mensaje directamente, sino que creamos los nuevos datos
                                _data.crear(
                                    { 
                                        directorio: data.ruta, 
                                        archivo: usuarioId, 
                                        data: data.payload 
                                    }, 
                                    error => {
                                        if ( error ) {
                                            callback( 500, JSON.stringify( { error } ) )
                                        } else {
                                            callback( 200, data.payload )
                                        }
                                    }
                                )
                            }
                        )
                      } else {
                        callback(
                          500,
                          JSON.stringify({ error: 'Hubo un error al leer el usuario' })
                        );
                      }
                    }
                  );
                  break;

            // Método delete
            // Actualizar archivos
            case 'delete':
                if ( data.params && data.params.id ) {
                    usuarioId = data.params.id
                } else {
                    callback (500, JSON.stringify({ mensaje: 'Recurso no encontrado'}))
                    break;
                }
                _data.obtenerUno(
                    { directorio: data.ruta, archivo: usuarioId },
                    (error, usuario) => {
                      if (error) {
                        callback(404, JSON.stringify({ error }))
                      } else if (usuario) {
                        // En vez de enviarlo de una vez, lo vamos a eliminar
                        _data.eliminarUno (
                            { directorio: data.ruta, archivo: usuarioId },
                            error => {
                                if ( error ) return callback(500, JSON.stringify({ error }))
                                callback (200, JSON.stringify({ mensaje: 'Usuario eliminado satisfactoriamente' }))
                            }
                        )
                      } else {
                        callback(
                          500,
                          JSON.stringify({ error: 'Hubo un error al leer el usuario' })
                        );
                      }
                    }
                  );
                  break;

            default:
                callback( 404, {
                    mensaje: `No puedes usar ${data.metodo} en ${data.ruta}`
                })
                break;
        } // Fín switch

    }   // Fín usuarios

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
            payload: buffer,
            params: null // Vacío si no hay nada aún
        }
        
        // Enviamos la respuesta.
        const rutaIdentificador = rutaLimpia.split('/'), // Variable que va a verificar la ruta limpia con el slash. Si hay una ruta identificador entonces tendremos dos partes. rutaRecurso/id que vienen de la ruta identificador
        [rutaRecurso, id] = rutaIdentificador
        let handler
        // El handler va a verificar si dentro del enrutador existe una rutaLimpia. Si no, se va a else if a verificar si hay una ruta recurso
        if ( rutaLimpia && enrutador[rutaLimpia] ) {
            handler = enrutador[rutaLimpia]
        } 
        // Si hay una ruta recurso entonces rutaIdentificador debería tener un tamaño mayor a 0
        else if ( rutaIdentificador.length > 0 && rutaRecurso && enrutador[rutaRecurso] && id ) {
            data.ruta = rutaRecurso
            data.params = { id }
            handler = enrutador[rutaRecurso]
        }
        else {
            handler = enrutador.noEncontrado
        }

        handler ( data, (statusCode = 200, respuesta ) => {
            //const respuestaString = JSON.parse(respuesta) // Respuesta como string
            res.setHeader('Content-Type', 'application/json') // Setting de los headers de las respuestas indicando el tipo. En este caso estamos enviando tipo json
            res.writeHead(statusCode)
            //res.write(respuesta)
            res.end(respuesta)
        })
    })
} // Servidor unificado

module.exports = servidorUnificado;