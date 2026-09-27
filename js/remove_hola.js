const fs = require('fs');

let inicio = fs.readFileSync('inicio.html', 'utf8');
// Remove ¡Hola, te damos la bienvenida! 
inicio = inicio.replace(/<h1 class=titulo1>¡Hola, te damos la bienvenida!<\/h1>/i, '');
// Also if there's any other occurrence, replace it globally just in case
inicio = inicio.replace(/¡Hola, te damos la bienvenida!/g, '');

fs.writeFileSync('inicio.html', inicio, 'utf8');

console.log('Done: removed ¡Hola, te damos la bienvenida! from inicio.html');
