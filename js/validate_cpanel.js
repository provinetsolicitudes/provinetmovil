const fs = require('fs');
const html = fs.readFileSync('cpanel.html', 'utf8');
const scripts = html.match(/<script[\s\S]*?<\/script>/gi);
let hasError = false;
if(scripts) {
  scripts.forEach((s,i) => {
    const code = s.replace(/<\/?script.*?>/gi, '');
    try {
      new (require('vm').Script)(code);
      console.log('Script ' + i + ' OK');
    } catch(e) {
      console.log('Script ' + i + ' Error: ' + e);
      hasError = true;
    }
  });
}
if (!hasError) console.log('All scripts are valid.');
