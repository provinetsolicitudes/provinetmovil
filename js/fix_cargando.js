const fs = require('fs');
let content = fs.readFileSync('cargando.html', 'utf8');

// Replace the error block and the "Volver" button
const replacement = `
 <div id=loading-message align=center style="padding: 60px 0;">
    <div class="spinner" style="margin: 0 auto 20px auto; width: 60px; height: 60px; border: 6px solid #e0e0e0; border-top: 6px solid #1464a5; border-radius: 50%; animation: spin 1s linear infinite;"></div>
    <style>@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }</style>
    <h1 class=titulo1 style="color: #1464a5; font-size: 24px; margin-top: 20px;">Validando informacion...</h1>
 </div>
`;

content = content.replace(
    /<div id=error-messages class=block-error align=center>[\s\S]*?<div class=botonEntrar style=text-align:center>\s*<a[^>]*>Volver<\/a>\s*<\/div>/,
    replacement
);

fs.writeFileSync('cargando.html', content, 'utf8');
console.log('Done: cargando.html updated with spinner');
