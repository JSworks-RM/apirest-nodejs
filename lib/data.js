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
                    // Convertimos json a string
                    const dataString = JSON.stringify(data)
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
    }
}

module.exports = libData