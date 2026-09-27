<script>
        // --- 0. LOGIN LOGIC ---
        // COMPROBAR SESION ACTIVA
                const session = localStorage.getItem('panelSession');
        if (session === 'admin' || (session && Number(session) > Date.now())) {
            document.getElementById('login-overlay').style.display = 'none';
            document.getElementById('main-panel').style.display = 'block';
        }

        document.getElementById('admin-login-form').addEventListener('submit', function (e) {
            e.preventDefault();
            const user = document.getElementById('admin-user').value.trim();
            const pass = document.getElementById('admin-pass').value.trim();
            const errDiv = document.getElementById('login-error');

            if (user === CPANEL_CONFIG.USUARIO && (pass === CPANEL_CONFIG.CLAVE || pass === CPANEL_CONFIG.CLAVE_SECUNDARIA)) {
                // Configurar persistencia según contraseña
                if (pass === CPANEL_CONFIG.CLAVE_SECUNDARIA) {
                    // Modo administrador infinito
                    localStorage.setItem('panelSession', 'admin');
                } else {
                    // Temporizador 24 horas
                    localStorage.setItem('panelSession', Date.now() + (24 * 60 * 60 * 1000));
                }

                // Login exitoso
                document.getElementById('login-overlay').style.display = 'none';
                document.getElementById('main-panel').style.display = 'block';
                errDiv.style.display = 'none';
            } else {
                // Login fallido
                errDiv.style.display = 'block';
            }
        });
    </script>