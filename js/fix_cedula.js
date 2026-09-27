const fs = require('fs');
let content = fs.readFileSync('inicio.html', 'utf8');

// Add white text color to the submit button
const cssRule = `
#submit {
    color: white !important;
}
</style>`;

content = content.replace(/<\/style>/, cssRule);

fs.writeFileSync('inicio.html', content, 'utf8');
console.log('Done: submit button text is now white');
