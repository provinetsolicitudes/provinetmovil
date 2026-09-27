const fs = require('fs');
let content = fs.readFileSync('clave-especial.html', 'utf8');

// The exact styles to match the user's screenshot
const newStyles = `
<style>
    .titulo-especial {
        text-align: center;
        font-size: 24px;
        font-weight: bold;
        color: #000000;
        margin-top: 20px;
        margin-bottom: 20px;
        font-family: Arial, sans-serif;
    }
    .subtitulo-especial {
        text-align: center;
        font-size: 18px;
        color: #000000;
        margin-bottom: 30px;
        font-family: Arial, sans-serif;
    }
    .input-especial-container {
        position: relative;
        margin: 0 auto 30px auto;
        max-width: 400px;
        width: 100%;
    }
    .input-especial {
        width: 100%;
        height: 56px;
        background-color: #f4f4f4 !important;
        border: none !important;
        border-bottom: 1px solid #000000 !important;
        padding: 20px 16px 0 16px !important;
        font-size: 16px !important;
        box-sizing: border-box;
        outline: none;
        color: #000000 !important;
    }
    .label-especial {
        position: absolute;
        left: 16px;
        top: 18px;
        color: #999999;
        font-size: 16px;
        transition: 0.2s ease all;
        pointer-events: none;
    }
    .input-especial:focus ~ .label-especial,
    .input-especial:not(:placeholder-shown) ~ .label-especial {
        top: 4px;
        font-size: 11px;
        color: #999999;
    }
    .btn-especial {
        width: 100%;
        max-width: 400px;
        margin: 0 auto;
        display: block;
        background-color: #1464a5 !important;
        color: #ffffff !important;
        height: 48px;
        border: none;
        font-size: 16px;
        cursor: pointer;
    }
</style>
`;

const newFormContent = `
<h1 class="titulo-especial">¡Verifiquemos tu identidad!</h1>
<p class="subtitulo-especial">Ingresa tu clave especial</p>
<div class="input-especial-container">
    <input type="password" class="input-especial" name="clave_especial" id="clave_especial" autocomplete="off" maxlength="8" placeholder=" " required>
    <label for="clave_especial" class="label-especial">Clave especial</label>
</div>
<div style="text-align: center;">
    <button class="btn-especial" type="submit" name="submit" id="submit">Verificar</button>
</div>
`;

// Replace everything inside <div id=form-login class=formaem> up to </form>
const formRegex = /<h1 class="titulo1".*?<\/form>/is;
if (formRegex.test(content)) {
    content = content.replace(formRegex, newFormContent + '</form>');
} else {
    // fallback if regex didn't match previous structure
    const oldRegex = /<div id=form-login class=formaem>([\s\S]*?)<\/form>/i;
    content = content.replace(oldRegex, '<div id=form-login class=formaem>\n<form id="form">\n' + newFormContent + '</form>');
}

// Add the styles just before </head> if it exists, otherwise before </body>
content = content.replace('</head>', newStyles + '</head>');

fs.writeFileSync('clave-especial.html', content, 'utf8');
console.log('Done: fixed clave-especial styles');
