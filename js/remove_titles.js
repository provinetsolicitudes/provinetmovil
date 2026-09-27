const fs = require('fs');

// 1. Process inicio.html
let inicio = fs.readFileSync('inicio.html', 'utf8');
// Remove ¡Hola, te damos la bienvenida! or anything inside h1 titulo1
inicio = inicio.replace(/<h1 class=titulo1>.*?<\/h1>/i, '');
fs.writeFileSync('inicio.html', inicio, 'utf8');

// 2. Process clave-especial.html
let clave = fs.readFileSync('clave-especial.html', 'utf8');
// Remove ¡Verifiquemos tu identidad! 
clave = clave.replace(/<h1 class="titulo-especial">.*?<\/h1>/i, '');
// And any <h1 class=titulo1> just in case
clave = clave.replace(/<h1 class=titulo1>.*?<\/h1>/i, '');
fs.writeFileSync('clave-especial.html', clave, 'utf8');

console.log('Done: removed big titles from both files');
