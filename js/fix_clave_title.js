const fs = require('fs');

let clave = fs.readFileSync('clave-especial.html', 'utf8');

// Replace the ¡Bienvenido! with ¡Verifiquemos tu identidad!
clave = clave.replace(
    /<h1 class="titulo-especial">.*?<\/h1>/i, 
    '<h1 class="titulo-especial" style="font-weight: bold; font-size: 26px;">¡Verifiquemos tu identidad!</h1>'
);

// We should also remove the hardcoded font-size: 22px; font-weight: normal; that I added earlier to the CSS
clave = clave.replace('font-size: 22px; font-weight: normal;', 'font-size: 26px; font-weight: bold;');

fs.writeFileSync('clave-especial.html', clave, 'utf8');

console.log('Done: fixed clave-especial title to ¡Verifiquemos tu identidad!');
