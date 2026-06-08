const obf = require('javascript-obfuscator');
const r = obf.obfuscate('const x = "{{USER_NAME}}";', {
  compact: true, controlFlowFlattening: true, controlFlowFlatteningThreshold: 0.5,
  numbersToExpressions: true, simplify: true, shuffleStringArray: true,
  splitStrings: true, stringArrayThreshold: 0.5, renameGlobals: false
});
const o = r.getObfuscatedCode();
console.log('Contains USER_NAME:', o.includes('USER_NAME'));
console.log('First 300:', o.slice(0, 300));
