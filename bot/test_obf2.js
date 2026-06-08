const { generateSite } = require('./generator');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

generateSite({name:'Ahmed', profilePic:'https://cdn.discordapp.com/embed/avatars/0.png', bio:'مرحبا', youtube:'', discord:'', tiktok:'', github:''}).then(z => {
  const d = path.join(__dirname, '..', 'temp', 'v');
  if (fs.existsSync(d)) fs.rmSync(d,{recursive:true,force:true});
  execSync(`powershell -NoProfile -Command "Expand-Archive -Path '${z}' -DestinationPath '${d}' -Force"`, {shell:'powershell.exe'});
  const dir = fs.readdirSync(d)[0];
  const files = fs.readdirSync(path.join(d,dir));
  const html = fs.readFileSync(path.join(d,dir,'index.html'),'utf-8');
  const js = fs.readFileSync(path.join(d,dir,'script.js'),'utf-8');

  console.log('=== Files in ZIP ===');
  files.forEach(f => console.log('  '+f));

  const checks = [
    ['No style.css in ZIP', !files.includes('style.css')],
    ['No link to style.css in HTML', !/<link[^>]*style\.css/i.test(html)],
    ['CSS embedded in JS (injection code present)', js.includes('createElement') && js.includes('style') && js.includes('appendChild')],
    ['JS is obfuscated (_0x patterns)', js.includes('_0x')],
    ['HTML is minified', !/\s{3,}/.test(html)],
    ['Name in HTML', html.includes('Ahmed')],
  ];
  let p=0,f=0;
  checks.forEach(([l,o])=>{console.log((o?'\u2713':'\u2717')+' '+l);o?p++:f++});
  console.log(p+'/'+(p+f));

  // Verify original files untouched
  const origHtml = fs.readFileSync(path.join(__dirname,'..','index.html'),'utf-8');
  const origJs = fs.readFileSync(path.join(__dirname,'..','script.js'),'utf-8');
  console.log('\nOriginal HTML still has style.css link:', origHtml.includes('style.css') ? 'Yes (good)' : 'No');
  console.log('Original JS unchanged:', origJs.includes('handleTilt') ? 'Yes (good)' : 'No');

  fs.rmSync(d,{recursive:true,force:true});
  fs.unlinkSync(z);
}).catch(e => console.error(e));
