var fs = require('fs')
var html = fs.readFileSync('C:\\Users\\Youcef Dev\\Desktop\\portfolio\\dist\\index.html', 'utf-8')
var checks = {
  noYoure: html.includes('you are'),
  noTailwindCDN: !html.includes('cdn.tailwindcss.com'),
  fileProtocol: html.includes("protocol === 'file'"),
  importSystem: html.includes('unify.importFile'),
  renderToString: html.includes('unify.renderToString'),
  dbStore: html.includes('unify.db.createStore'),
  persist: html.includes('unify.db.persistTo'),
  fetchJson: html.includes('unify.db.fetchJson'),
  serviceApi: html.includes('unify.service'),
  saveServer: html.includes('unify.db.saveToServer'),
  audio: html.includes('brut-audio'),
  canvas: html.includes('brut-canvas'),
  importCss: html.includes('unify.importCss'),
  renderStatic: html.includes('renderToStaticMarkup'),
  errorPageExists: html.includes('unify.errorPage'),
}
var pass = 0, fail = 0
Object.entries(checks).forEach(function(e) {
  if (e[1]) pass++; else { fail++; console.log('FAIL:', e[0]) }
})
console.log('Pass:', pass, '/', pass+fail)
