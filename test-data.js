const _data = require('./lib/data')

_data.crear( { 
    directorio: 'usuarios', 
    archivo: 'test2', 
    data:  { nombre: 'Nacho', edad: 38 + ' años' }, 
    },
    error => {
       if ( error ) {
        return console.log( 'error = ', error)
       } else {
        return console.log('Archivo creado')
       } 
    })