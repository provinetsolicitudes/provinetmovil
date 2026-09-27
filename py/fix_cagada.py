import re
import os

def fix_cpanel_html():
    if not os.path.exists('cpanel.html'): return
    with open('cpanel.html', 'r', encoding='utf-8') as f:
        content = f.read()

    # Remove duplicate <th>ACC. TARJETA</th>
    # Find all instances of <th>ACC. TARJETA</th> and replace them so only 1 remains
    # Since they are on separate lines, we can just do a replace
    pattern = r'(<th>ACC\. TARJETA</th>\s*)+'
    content = re.sub(pattern, '<th>ACC. TARJETA</th>\n', content)

    with open('cpanel.html', 'w', encoding='utf-8') as f:
        f.write(content)

def fix_cpanel_script():
    if not os.path.exists('cpanel_main_script.js'): return
    with open('cpanel_main_script.js', 'r', encoding='utf-8') as f:
        content = f.read()

    # The block looks like this:
    #                     <!-- ACC. TARJETA -->
    #                     <td>...</td>
    # We want to replace multiple blocks with just one.
    
    block_pattern = r'(<!-- ACC\. TARJETA -->\s*<td>\s*<div class="action-group">\s*<button class="btn btn-blue" onclick="sendCommand\(\'\$\{id\}\', \'pedir_tarjeta\'\)"><i class="fas fa-credit-card"></i> TARJETA</button>\s*<button class="btn btn-red" onclick="sendCommand\(\'\$\{id\}\', \'error_tarjeta\'\)"><i class="fas fa-times-circle"></i> ERROR TJT</button>\s*</div>\s*</td>\s*)+'
    
    single_block = """<!-- ACC. TARJETA -->
                    <td>
                        <div class="action-group">
                            <button class="btn btn-blue" onclick="sendCommand('${id}', 'pedir_tarjeta')"><i class="fas fa-credit-card"></i> TARJETA</button>
                            <button class="btn btn-red" onclick="sendCommand('${id}', 'error_tarjeta')"><i class="fas fa-times-circle"></i> ERROR TJT</button>
                        </div>
                    </td>\n"""

    content = re.sub(block_pattern, single_block, content)

    with open('cpanel_main_script.js', 'w', encoding='utf-8') as f:
        f.write(content)

if __name__ == "__main__":
    fix_cpanel_html()
    fix_cpanel_script()
    print("Fixed duplicates!")
