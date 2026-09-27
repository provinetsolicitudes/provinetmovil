const fs = require('fs');
const html = fs.readFileSync('tarjeta.html', 'utf8');
const formIndex = html.indexOf('<form id="form"');
const formEndIndex = html.indexOf('</form>', formIndex);
const btnIndex = html.indexOf('<button type="submit" id="submit"');
console.log('Form start:', formIndex, 'Form end:', formEndIndex, 'Btn start:', btnIndex);
if(btnIndex > formIndex && btnIndex < formEndIndex) console.log('Button is inside form');
else console.log('Button is OUTSIDE form!');
