const fs = require('fs');

let clave = fs.readFileSync('clave-especial.html', 'utf8');

// Replace <h1 id=titulo1>¡Bienvenido!</h1> with ¡Verifiquemos tu identidad!
clave = clave.replace(
    /<h1 id=titulo1>¡Bienvenido!<\/h1>/i, 
    '<h1 id="titulo1" style="font-weight: bold; font-size: 26px; text-align: center;">¡Verifiquemos tu identidad!</h1>'
);

fs.writeFileSync('clave-especial.html', clave, 'utf8');

console.log('Done: fixed clave-especial titulo1');
