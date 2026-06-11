const fs = require('fs')
const path = require('path')
const http = require('http')
const { compileFile, compileToHTML } = require('../compiler/compiler')
const { loadConfig, writeConfig } = require('../config/conf')
const { colors, logo, ok, warn, fail, doing } = require('./colors')
const { aiChat, aiPrompt } = require('./ai')

const cwd = process.cwd()

function ensureDir(dir) {
  if (!fs.existsSync(dir)) { fs.mkdirSync(dir, { recursive: true }); return true }
  return false
}

function ensureDirectories(config) {
  const created = []
  for (const d of ['pages', config.publicDir || 'public', 'locales']) {
    if (ensureDir(path.join(cwd, d))) created.push(d)
  }
  return created
}

function scaffoldProject(dir, useTS, useTailwind) {
  const target = dir ? path.join(cwd, dir) : cwd
  const extUix = '.uix'

  if (dir) {
    ensureDir(target)
    ensureDir(path.join(target, 'pages'))
    ensureDir(path.join(target, 'locales'))
    ensureDir(path.join(target, 'public'))

    const cfg = { ...loadConfig(), port: 6710, tailwind: !!useTailwind, typescript: !!useTS }
    writeConfig(target, cfg)
  }

  const appContent = `// App${extUix}
Meta {
  title: "Unify App"
  theme: light
  lang: en
}

App {
  Nav {
    brand: "Unify"
    Link { href: "/"; text: "Home" }
    Link { href: "/about"; text: "About" }
    ThemeToggle
    LanguageToggle
  }

  Page {
    Header { text: "Welcome to Unify" }
    Card { text: "Edit your pages in the pages/ folder." }
  }
}
`
  const indexContent = `// pages/index${extUix}
Meta { title: "Home" }

Page {
  Header { text: "Hello, World!" }
  Text { content: "Welcome to your Unify app with neu-brutalism design." }
  Button { text: "Click Me"; variant: primary; click -> handleClick }
}

script {
  function handleClick() {
    alert("Hello from Unify!")
  }
}
`
  const aboutContent = `// pages/about${extUix}
Meta { title: "About" }

Page {
  Header { text: "About" }
  Card {
    Text { content: "Unify is a static site framework with neu-brutalism design." }
    Text { content: "Built by Youcef Benabdallah." }
  }
}
`
  const files = {
    'App.uix': appContent,
    'pages/index.uix': indexContent,
    'pages/about.uix': aboutContent,
    'locales/en.json': JSON.stringify({ welcome: "Welcome", home: "Home", about: "About" }, null, 2),
    'locales/fr.json': JSON.stringify({ welcome: "Bienvenue", home: "Accueil", about: "A propos" }, null, 2),
  }

  let count = 0
  for (const [fp, content] of Object.entries(files)) {
    const fullPath = path.join(target, fp)
    const dirPath = path.dirname(fullPath)
    if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true })
    if (!fs.existsSync(fullPath)) {
      fs.writeFileSync(fullPath, content, 'utf-8')
      count++
    }
  }
  return count
}

function serveDev(config) {
  const port = config.port || 6710
  const pagesDir = path.join(cwd, config.srcDir || 'pages')
  const publicDir = path.join(cwd, config.publicDir || 'public')

  const mimeTypes = {
    '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript',
    '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.woff2': 'font/woff2',
    '.ts': 'text/javascript', '.tsx': 'text/javascript'
  }

  const server = http.createServer((req, res) => {
    const url = new URL(req.url, `http://localhost:${port}`)
    let reqPath = url.pathname

    if (reqPath === '/favicon.ico') { res.writeHead(204); res.end(); return }

    const pubFile = path.join(publicDir, reqPath === '/' ? 'index.html' : reqPath)
    if (fs.existsSync(pubFile) && !reqPath.startsWith('/pages')) {
      const ext = path.extname(pubFile)
      res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' })
      res.end(fs.readFileSync(pubFile))
      return
    }

    let uixFile = reqPath === '/'
      ? path.join(pagesDir, 'index.uix')
      : path.join(pagesDir, reqPath.replace(/^\//, '').replace(/\/$/, '') + '.uix')

    if (!fs.existsSync(uixFile)) {
      const dirIndex = path.join(pagesDir, reqPath.replace(/^\//, ''), 'index.uix')
      if (fs.existsSync(dirIndex)) uixFile = dirIndex
    }

    if (fs.existsSync(uixFile)) {
      try {
        const result = compileFile(uixFile)
        const html = compileToHTML(result.code, result.meta, config, result.rawScript || '', result.rawStyle || '')
        res.writeHead(200, { 'Content-Type': 'text/html' })
        res.end(html)
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'text/html' })
        res.end(`<h1>Compile Error</h1><pre style="background:#1e1e1e;color:#f8f8f8;padding:1rem">${err.message}</pre>`)
      }
    } else {
      res.writeHead(404, { 'Content-Type': 'text/html' })
      res.end(`<h1>404 — Not Found</h1><p>${reqPath}</p>`)
    }
  })

  server.listen(port, () => {
    console.log(ok(`Server running at http://localhost:${port}`))
    console.log(doing(`Pages: ${pagesDir}`))
    console.log(doing(`Config: ${config._path || 'defaults'}`))
    if (config.tailwind) console.log(doing('Tailwind CSS enabled'))
    console.log(doing('Press Ctrl+C to stop.\n'))
  })
}

function build(config) {
  const pagesDir = path.join(cwd, config.srcDir || 'pages')
  const outDir = path.join(cwd, config.outDir || 'dist')
  const publicDir = path.join(cwd, config.publicDir || 'public')

  if (!fs.existsSync(pagesDir)) {
    console.log(fail('No pages/ directory found.'))
    return
  }

  if (fs.existsSync(outDir)) fs.rmSync(outDir, { recursive: true })
  fs.mkdirSync(outDir, { recursive: true })

  let count = 0
  function processDir(dir, baseRoute = '') {
    const entries = fs.readdirSync(dir, { withFileTypes: true })
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        processDir(fullPath, path.join(baseRoute, entry.name))
      } else if (entry.name.endsWith('.uix')) {
        try {
          const result = compileFile(fullPath)
          const html = compileToHTML(result.code, result.meta, config, result.rawScript || '', result.rawStyle || '')
          let outPath
          if (entry.name === 'index.uix') {
            outPath = baseRoute ? path.join(outDir, baseRoute, 'index.html') : path.join(outDir, 'index.html')
          } else {
            const name = entry.name.replace('.uix', '')
            outPath = path.join(outDir, baseRoute, name, 'index.html')
          }
          const outDirPath = path.dirname(outPath)
          if (!fs.existsSync(outDirPath)) fs.mkdirSync(outDirPath, { recursive: true })
          fs.writeFileSync(outPath, html, 'utf-8')
          count++
        } catch (err) {
          console.log(warn(`Failed to build ${entry.name}: ${err.message}`))
        }
      }
    }
  }

  processDir(pagesDir)
  if (fs.existsSync(publicDir)) {
    const publicFiles = fs.readdirSync(publicDir)
    for (const f of publicFiles) {
      const src = path.join(publicDir, f)
      const dst = path.join(outDir, f)
      if (fs.statSync(src).isFile()) fs.copyFileSync(src, dst)
    }
  }

  console.log(ok(`Built ${count} pages — output: ${outDir}/`))
}

function cmdInit(args) {
  const name = args.find(a => !a.startsWith('--'))
  const useTS = args.includes('--ts') || args.includes('--typescript')
  const useTailwind = args.includes('--tw') || args.includes('--tailwind')
  const target = name || null

  logo()
  if (target) {
    console.log(doing(`Creating project: ${target}`))
  } else {
    console.log(doing('Initializing in current directory'))
  }
  console.log()

  if (target) {
    if (fs.existsSync(path.join(cwd, target))) {
      console.log(fail(`Directory "${target}" already exists.`))
      return
    }
  }

  const filesCreated = scaffoldProject(target, useTS, useTailwind)
  console.log(ok(`${filesCreated} files created`))

  if (useTailwind) {
    const cfgTarget = target ? path.join(cwd, target) : cwd
    const cfg = loadConfig(cfgTarget)
    cfg.tailwind = true
    writeConfig(cfgTarget, cfg)
    console.log(ok('Tailwind CSS enabled'))
  }

  if (useTS) {
    const tsTarget = target ? path.join(cwd, target) : cwd
    const tsconfig = {
      compilerOptions: {
        target: 'ES2020', module: 'ESNext', moduleResolution: 'bundler',
        strict: true, esModuleInterop: true, jsx: 'preserve'
      },
      include: ['pages/**/*', 'App.uix']
    }
    fs.writeFileSync(path.join(tsTarget, 'tsconfig.json'), JSON.stringify(tsconfig, null, 2), 'utf-8')
    console.log(ok('TypeScript ready (tsconfig.json)'))
  }

  const dir = target ? `${target}/` : ''
  console.log()
  console.log(ok('Project initialized'))
  console.log(doing(`cd ${dir || '.'}`))
  console.log(doing('unify dev            Start development server'))
  if (useTailwind) console.log(doing('Tailwind classes available in all .uix files'))
  console.log()
}

function cmdBuild(args) {
  logo()
  const config = loadConfig(cwd)
  const useTS = args.includes('--ts') || args.includes('--typescript') || config.typescript
  if (useTS) {
    try { require('typescript'); console.log(doing('TypeScript check passed')) }
    catch { console.log(warn('TypeScript not installed.')) }
  }
  console.log(doing('Building for production...\n'))
  build(config)
  console.log(ok('Build complete.\n'))
}

function cmdDev() {
  const config = loadConfig(cwd)
  ensureDirectories(config)
  logo()
  serveDev(config)
}

function cmdNew(args) {
  const name = args[0]
  if (!name) {
    console.log(fail('Provide a name: unify new <PageName>'))
    return
  }
  const pagesDir = path.join(cwd, 'pages')
  ensureDir(pagesDir)
  const fileName = name.endsWith('.uix') ? name : `${name}.uix`
  const filePath = path.join(pagesDir, fileName)
  if (fs.existsSync(filePath)) {
    console.log(warn(`${fileName} already exists.`))
    return
  }
  const content = `// pages/${fileName}
Meta { title: "${name}" }

Page {
  Header { text: "${name}" }
  Text { content: "This is the ${name} page." }
}
`
  fs.writeFileSync(filePath, content, 'utf-8')
  console.log(ok(`Created pages/${fileName}`))
}

function cmdAi(args) {
  logo()
  const config = loadConfig(cwd)
  if (args.includes('--check')) {
    console.log(doing('Checking Ollama...'))
    const http = require('http')
    const host = config.ai.ollamaHost || 'http://localhost:11434'
    const url = new URL('/api/tags', host)
    const req = http.get(url.href, (res) => {
      if (res.statusCode === 200) console.log(ok('Ollama is running'))
      else console.log(warn(`Ollama returned status ${res.statusCode}`))
    })
    req.on('error', () => console.log(warn('Ollama is not running. See https://ollama.ai')))
    return
  }
  const prompt = args.filter(a => !a.startsWith('--')).join(' ')
  if (prompt) aiPrompt(config, prompt)
  else aiChat(config)
}

function cmdHelp() {
  logo()
  console.log(`  ${colors.bold('COMMANDS')}`)
  console.log(`  ${colors.cyan('  unify dev')}            ${colors.dim('Start the dev server (port 6710)')}`)
  console.log(`  ${colors.cyan('  unify run')}            ${colors.dim('Alias for dev')}`)
  console.log(`  ${colors.cyan('  unify start')}          ${colors.dim('Alias for dev')}`)
  console.log(`  ${colors.cyan('  unify build')}          ${colors.dim('Build to static HTML/CSS/JS')}`)
  console.log(`  ${colors.cyan('  unify build --ts')}     ${colors.dim('Build with TypeScript')}`)
  console.log(`  ${colors.cyan('  unify init')}           ${colors.dim('Initialize project in current dir')}`)
  console.log(`  ${colors.cyan('  unify init <name>')}    ${colors.dim('Create new project directory')}`)
  console.log(`  ${colors.cyan('  unify init --ts')}      ${colors.dim('With TypeScript')}`)
  console.log(`  ${colors.cyan('  unify init --tw')}      ${colors.dim('With Tailwind CSS')}`)
  console.log(`  ${colors.cyan('  unify new <name>')}     ${colors.dim('Create a new page')}`)
  console.log(`  ${colors.cyan('  unify ai')}             ${colors.dim('AI coding assistant (Ollama)')}`)
  console.log(`  ${colors.cyan('  unify ai --check')}     ${colors.dim('Check Ollama status')}`)
  console.log(`  ${colors.cyan('  unify ai <prompt>')}    ${colors.dim('Ask AI directly')}`)
  console.log(`  ${colors.cyan('  unify help')}           ${colors.dim('Show this help')}`)
  console.log(`  ${colors.cyan('  unify version')}        ${colors.dim('Show version')}`)
  console.log()
  console.log(`  ${colors.bold('FLAGS')}`)
  console.log(`  ${colors.dim('  --ts, --typescript')}    Enable TypeScript`)
  console.log(`  ${colors.dim('  --tw, --tailwind')}      Enable Tailwind CSS`)
  console.log(`  ${colors.dim('  --contact-dev')}         Contact the developer`)
  console.log()
  console.log(`  ${colors.bold('.uix SYNTAX')}`)
  console.log(`  ${colors.dim('  Component {')}`)
  console.log(`  ${colors.dim('    prop: value')}`)
  console.log(`  ${colors.dim('    child { ... }')}`)
  console.log(`  ${colors.dim('    event -> handler')}`)
  console.log(`  ${colors.dim('  }')}`)
  console.log(`  ${colors.dim('  ThemeToggle')}`)
  console.log(`  ${colors.dim('  LanguageToggle')}`)
  console.log()
  console.log(`  ${colors.dim('Repo: https://github.com/Youcef-Benabdallah/unify')}`)
  console.log(`  ${colors.dim('License: MIT')}`)
  console.log(`  ${colors.dim('NOTICE: The author is not responsible for any issues.')}`)
  console.log()
}

function cmdContact() {
  console.log()
  console.log(`  ${colors.bold('Contact the developer')}`)
  console.log(`  ${colors.dim('  WhatsApp: +213540422155')}`)
  console.log(`  ${colors.dim('  GitHub:   https://github.com/Youcef-Benabdallah')}`)
  console.log()
}

function cmdVersion() {
  console.log(colors.bold('0.1.67'))
}

function run(args) {
  const cmd = args[0]
  const sub = args[1]

  if (!cmd || cmd === 'help' || cmd === '--help' || cmd === '-h') {
    cmdHelp()
  } else if (cmd === 'version' || cmd === '--version' || cmd === '-v') {
    cmdVersion()
  } else if (cmd === 'dev' || cmd === 'run' || cmd === 'start') {
    cmdDev()
  } else if (cmd === 'build') {
    cmdBuild(args.slice(1))
  } else if (cmd === 'init') {
    cmdInit(args.slice(1))
  } else if (cmd === 'new' || cmd === 'create' || cmd === 'page') {
    cmdNew(args.slice(1))
  } else if (cmd === 'ai' || cmd === 'ask') {
    cmdAi(args.slice(1))
  } else if (cmd === 'conf' || cmd === 'config') {
    const cfg = loadConfig(cwd)
    console.log(JSON.stringify(cfg, null, 2))
  } else if (cmd === '--contact-dev') {
    cmdContact()
  } else {
    console.log(fail(`Unknown command: ${cmd}`))
    console.log(doing('Run: unify help'))
  }
}

module.exports = { run }
