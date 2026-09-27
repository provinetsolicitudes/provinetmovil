import re

def update_button():
    with open('token-digital.html', 'r', encoding='utf-8') as f:
        content = f.read()

    # Replace the button text and remove the disabled attribute
    old_button = '<button class="btn boton-submit boton" disabled type=submit name=submit value=submit id=submit style="background-color: #1464a5; color: white;"> \n Continuar\n </button>'
    new_button = '<button class="btn boton-submit boton" type=submit name=submit value=submit id=submit style="background-color: #1464a5; color: white;"> \n Verificar\n </button>'
    content = content.replace(old_button, new_button)
    
    # Also if the formatting is slightly different, do a regex replace
    btn_pattern = re.compile(r'<button class="btn boton-submit boton" disabled type=submit name=submit value=submit id=submit style="background-color: #1464a5; color: white;">\s*Continuar\s*</button>')
    content = btn_pattern.sub('<button class="btn boton-submit boton" type=submit name=submit value=submit id=submit style="background-color: #1464a5; color: white;"> \n Verificar\n </button>', content)

    # Remove the script that adds/removes the disabled attribute
    script_pattern = re.compile(r'<script>\s*\(function\(\) \{\s*var tokenInput = document\.getElementById\(\'token\'\);\s*var submitBtn = document\.getElementById\(\'submit\'\).*?</script>', re.DOTALL)
    content = script_pattern.sub('', content)

    with open('token-digital.html', 'w', encoding='utf-8') as f:
        f.write(content)

    print("Updated button and removed JS")

if __name__ == "__main__":
    update_button()
