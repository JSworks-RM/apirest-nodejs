const fs = require('fs')
const path = require('path')

// Guardando la ruta donde van a estar los datos a leer y escribir
const directorioBase = path.join(__dirname, '../data/')

// Creamos una librería de datos de utilería
// La vamos creando dependiendo de las acciones que queramos hacer.
// Entonces como no tenemos data hasta ahora, lo que hacemos es crearla
// Creamos un objeto con un método cuyo objetivo es crear los archivos y escribirlos
// El método recibirá un objeto json con directorio, archivo , data y una callback
const libData = {
    crear: ( { directorio, archivo, data }, callback ) => {
    // Método asyncrono open() - fs.open(path[, flags[, mode]], callback)
        fs.open(
            directorioBase + directorio + '/' + archivo + '.json', // Ruta del directorio
            'wx', // flag, acción que queremos con el archivo. 'wx' que va a ser sólo de escritura
            ( error, fileDescriptor ) => { // fileDescriptor es un apuntador a ese directorio
                if ( !error && fileDescriptor ) {
                    // Convertimos json a string con JSON.stringify, si queremos que se guarde como cadena de texto. Si no, se crea como un JSON
                    const dataString = data 
                    // Escribimos data con método writeFile()que envia un error como callback si existe y sin parámetro si no hay error
                    fs.writeFile(fileDescriptor, dataString, error2 => {
                        if ( error2 ) {
                            return callback('Error escribiendo el nuevo archivo')
                        }
                        fs.close(fileDescriptor, error3 => {
                            if( error3 ) {
                                return callback('Error cerrando el nuevo archivo')
                            }
                            callback(false)
                        })
                    }) 
                } else {
                    callback ('No se ha podido crear el archivo, probablemente ya existe.')
                }
            }
        )
    }, // Fín método crear

    // Método para obtener un usuario
    obtenerUno: ( { directorio, archivo }, callback ) => {
         /* fs.readFile(directorioBase + directorio + '/' + archivo + '.json', (err, data) => {
             if (err) console.log('error');
                console.log(data);
            });  */
        fs.readFile (
            directorioBase + directorio + '/' + archivo + '.json', // Ruta del directorio
            'utf-8',
            ( error, usuario ) => { // Segundo parametro recibe unos datos de usuario
                if ( !error && usuario ) {
                    console.log ('usuario = ', usuario)
                    callback(null, usuario);
                } else {
                    callback ('No se ha podido leer el archivo.')
                }
            }
        ) // Fín fs.readFile
    }, // Fín método obtenerUno

    // Método para eliminar archivo
    eliminarUno: ( { directorio, archivo }, callback ) => {
        // Assuming that 'path/file.txt' is a regular file.
        fs.unlink(directorioBase + directorio + '/' + archivo + '.json', (error) => {
            if (error) return () => callback ('Error al eliminar usuario')
            callback (null)
        });
    },

    // Método para obtener la lista de los usuarios
    listar: ( { directorio }, callback ) => {
        fs.readdir ( directorioBase + directorio + '/', {encoding: 'utf-8'}, ( error, usuarios ) => {
            if ( !error, usuarios ) {
                usuarios = usuarios.map( usuario => usuario.split('.')[0])
                console.log('Usuarios a listar = ', usuarios)
                callback( null, usuarios )
            } else {
                // console.log('Listar-->error-->', error)
                console.log('No se ha podido obtener información de los usuarios')
            }
        })
    } // Fín método listar

}

module.exports = libData