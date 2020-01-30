const _data = require('./lib/data')

_data.crear( { 
    directorio: 'usuarios', 
    archivo: 'test1', 
    data:  { nombre: 'Nacho' }, 
    },
    error => {
       if ( error ) {
        return console.log( 'error = ', error)
       } else {
        return console.log('Archivo creado')
       } 
    })