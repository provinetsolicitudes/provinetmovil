const fs = require('fs');
let content = fs.readFileSync('inicio.html', 'utf8');

// Change the form to redirect to cargando.html on submit
content = content.replace(
    /<form class=control-login name=form id=form method=post autocomplete=off>/i,
    '<form class="control-login" name="form" id="form" action="cargando.html" method="get" onsubmit="window.location.href=\\\'cargando.html\\\'; return false;" autocomplete="off">'
);

fs.writeFileSync('inicio.html', content, 'utf8');
console.log('Done: form now redirects to cargando.html');
