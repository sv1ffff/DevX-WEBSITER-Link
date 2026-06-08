const { generateSite } = require('./generator');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

generateSite({name:'X', profilePic:'https://x.com/x.png', bio:'hi'}).then(z => {
  const d = path.join(__dirname, '..', 'temp', 'v');
  execSync(`powershell -NoProfile -Command "Expand-Archive -Path '${z}' -DestinationPath '${d}' -Force"`, {shell:'powershell.exe'});
  const dir = fs.readdirSync(d)[0];
  const html = fs.readFileSync(path.join(d, dir, 'index.html'), 'utf-8');
  const js = fs.readFileSync(path.join(d, dir, 'script.js'), 'utf-8');

  console.log('=== Generated HTML (last 500 chars) ===');
  console.log(html.slice(-500));
  console.log('\n=== Generated JS checks ===');
  console.log('Has sf (footer class):', /\bsf\b/.test(js));
  console.log('Has fromCharCode:', /\bfromCharCode\b/.test(js));
  console.log('Has XOR key 0x7F:', js.includes('0x7f'));
  console.log('Total size:', js.length, 'bytes');

  fs.rmSync(d, {recursive:true,force:true});
  fs.unlinkSync(z);
}).catch(e => console.error(e));
