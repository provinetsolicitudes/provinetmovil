const fs = require('fs');

// 1. Restore inicio.html title
let inicio = fs.readFileSync('inicio.html', 'utf8');
if (!inicio.includes('¡Hola, te damos la bienvenida!')) {
    inicio = inicio.replace(
        '<div id=form-login class=formaem>',
        '<div id=form-login class=formaem>\n<h1 class=titulo1>¡Hola, te damos la bienvenida!</h1>'
    );
    fs.writeFileSync('inicio.html', inicio, 'utf8');
}

// 2. Fix clave-especial.html
let clave = fs.readFileSync('clave-especial.html', 'utf8');

// The new HTML for the title area
const newHeader = '<h1 class="titulo-especial">¡Bienvenido!</h1>\n<p class="subtitulo-especial">Ingresa tu clave especial</p>';

// If we removed it completely before, insert it before the input container
if (!clave.includes('titulo-especial')) {
    clave = clave.replace('<div class="input-especial-container">', newHeader + '\n<div class="input-especial-container">');
} else {
    // If it's there but empty or has old text
    clave = clave.replace(/<h1 class="titulo-especial">.*?<\/h1>\s*<p class="subtitulo-especial">.*?<\/p>/is, newHeader);
}

// Adjust the CSS sizes for clave-especial.html
clave = clave.replace(/font-size: 24px;/g, 'font-size: 22px; font-weight: normal;');
clave = clave.replace(/font-size: 18px;/g, 'font-size: 16px;');

fs.writeFileSync('clave-especial.html', clave, 'utf8');

console.log('Done: restored inicio and fixed clave-especial');
