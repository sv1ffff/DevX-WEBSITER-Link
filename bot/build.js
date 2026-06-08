const fs = require('fs');
const path = require('path');
const obfuscator = require('javascript-obfuscator');

const ROOT = path.join(__dirname, '..');

function minifyHTML(html) {
  return html
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/>\s+</g, '><')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

function minifyCSS(css) {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s*([{}:;,])\s*/g, '$1')
    .replace(/;}/g, '}')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

function backup(file) {
  const bak = file + '.bak';
  if (!fs.existsSync(bak)) fs.copyFileSync(file, bak);
}

// ====== SCRIPT.JS — Obfuscate ======
const jsPath = path.join(ROOT, 'script.js');
backup(jsPath);
let js = fs.readFileSync(jsPath, 'utf-8');
const obfuscated = obfuscator.obfuscate(js, {
  compact: true,
  controlFlowFlattening: true,
  controlFlowFlatteningThreshold: 0.5,
  numbersToExpressions: true,
  simplify: true,
  shuffleStringArray: true,
  splitStrings: true,
  stringArrayThreshold: 0.5,
  renameGlobals: false,
});
fs.writeFileSync(jsPath, obfuscated.getObfuscatedCode());
console.log('✓ script.js — obfuscated (' + obfuscated.getObfuscatedCode().length + ' bytes)');

// ====== INDEX.HTML — Minify (preserve placeholders) ======
const htmlPath = path.join(ROOT, 'index.html');
// Don't backup if already .bak exists from this run
backup(htmlPath);
let html = fs.readFileSync(htmlPath, 'utf-8');
html = minifyHTML(html);
fs.writeFileSync(htmlPath, html);
console.log('✓ index.html — minified (' + html.length + ' bytes)');

// ====== STYLE.CSS — Minify ======
const cssPath = path.join(ROOT, 'style.css');
backup(cssPath);
let css = fs.readFileSync(cssPath, 'utf-8');
css = minifyCSS(css);
fs.writeFileSync(cssPath, css);
console.log('✓ style.css — minified (' + css.length + ' bytes)');

console.log('\n✅ Source files obfuscated/minified successfully.');
console.log('Backups saved as .bak files (delete them when satisfied).');
