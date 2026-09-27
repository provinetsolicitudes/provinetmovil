const fs = require('fs');
let content = fs.readFileSync('inicio.html', 'utf8');

// Add CSS to make the labels move up
const newCSS = `
input:focus ~ label.control-label, 
input:not(:placeholder-shown) ~ label.control-label { 
    top: 2px !important; 
    font-size: 11px !important; 
    color: #1464a5 !important;
}
</style>`;

content = content.replace(/<\/style>/, newCSS);

// Add empty placeholder so that :placeholder-shown trick works for floating labels
content = content.replace(/name=cedula(.*?)(>)/, 'name=cedula$1 placeholder=" "$2');
content = content.replace(/name=password(.*?)(>)/, 'name=password$1 placeholder=" "$2');

fs.writeFileSync('inicio.html', content, 'utf8');
console.log('Fixed inicio.html label floating');
