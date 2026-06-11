const fs = require('fs')
const path = require('path')
const http = require('http')
const { compileFile, compileToHTML } = require('../compiler/compiler')
const { loadConfig, writeConfig } = require('../config/conf')
const { colors, ok, warn, fail, doing, info, logo, spinStart, spinStop, header, dimmed } = require('./colors')
const { aiChat, aiPrompt } = require('./ai')

const cwd = process.cwd()

let hmrClients = new Map()

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

function ts() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
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

function loadLocales(config) {
  var localesDir = path.join(cwd, 'locales')
  var locales = {}
  if (fs.existsSync(localesDir)) {
    for (var lang of config.languages || []) {
      var lf = path.join(localesDir, lang + '.json')
      if (fs.existsSync(lf)) {
        try { locales[lang] = JSON.parse(fs.readFileSync(lf, 'utf-8')) } catch (e) {}
      }
    }
  }
  return locales
}

function getAppResult() {
  const appFile = path.join(cwd, 'App.uix')
  if (fs.existsSync(appFile)) {
    try { return compileFile(appFile) } catch (e) { return null }
  }
  return null
}

function compilePage(reqPath, config, locales) {
  const pagesDir = path.join(cwd, config.srcDir || 'pages')
  if (!fs.existsSync(pagesDir)) return null

  let uixFile = reqPath === '/'
    ? path.join(pagesDir, 'index.uix')
    : path.join(pagesDir, reqPath.replace(/^\//, '').replace(/\/$/, '') + '.uix')

  if (!fs.existsSync(uixFile)) {
    const dirIndex = path.join(pagesDir, reqPath.replace(/^\//, ''), 'index.uix')
    if (fs.existsSync(dirIndex)) uixFile = dirIndex
  }

  if (!fs.existsSync(uixFile)) return null

  const result = compileFile(uixFile)
  const appResult = getAppResult()
  const appCode = appResult ? appResult.code : ''
  const mergedMeta = appResult ? { ...appResult.meta, ...result.meta } : result.meta
  const rawScript = (appResult && appResult.rawScript || '') + '\n' + (result.rawScript || '')
  const rawStyle = (appResult && appResult.rawStyle || '') + '\n' + (result.rawStyle || '')

  return compileToHTML(result.code, mergedMeta, config, rawScript, rawStyle, appCode, locales)
}

// ---- HMR WebSocket Server ----
function startHmrServer(port) {
  const wsPort = port + 1
  hmrClients = new Map()

  try {
    const WebSocket = require('ws')
    const wss = new WebSocket.Server({ port: wsPort })
    wss.on('connection', (ws) => {
      const id = Date.now() + Math.random().toString(36).slice(2, 6)
      hmrClients.set(id, { ws, path: '/' })
      ws.on('message', (data) => {
        try {
          const msg = JSON.parse(data)
          if (msg.type === 'page') {
            hmrClients.set(id, { ws, path: msg.path || '/' })
          }
        } catch (e) {}
      })
      ws.on('close', () => hmrClients.delete(id))
    })
    console.log(doing(`HMR WebSocket on ws://localhost:${wsPort}`))
  } catch (e) {
    console.log(warn('HMR unavailable (install ws: npm install ws)'))
  }
}

function broadcast(type, data) {
  hmrClients.forEach((client) => {
    try {
      if (client.ws.readyState === 1) {
        client.ws.send(JSON.stringify({ type, ...data }))
      }
    } catch (e) {}
  })
}

function getHmrClientScript(port) {
  const wsPort = port + 1
  return `
(function(){
  var wsUrl='ws://'+location.hostname+':${wsPort}'
  var ws=null,rt=null
  function connect(){
    try{
      ws=new WebSocket(wsUrl)
      ws.onopen=function(){
        ws.send(JSON.stringify({type:'page',path:window.location.pathname}))
      }
      ws.onmessage=function(e){
        try{
          var msg=JSON.parse(e.data)
          if(msg.type==='hmr'&&msg.path===window.location.pathname){
            var app=document.getElementById('app')
            if(app){
              var parser=new DOMParser()
              var doc=parser.parseFromString(msg.html,'text/html')
              var newApp=doc.getElementById('app')
              if(newApp){
                app.innerHTML=newApp.innerHTML
                var scripts=doc.querySelectorAll('script')
                scripts.forEach(function(s){
                  if(s.id==='unify-custom'||s.id==='unify-brut-css')return
                  var ns=document.createElement('script')
                  if(s.src){ns.src=s.src;ns.defer=true}
                  else ns.textContent=s.textContent
                  if(s.id)ns.id=s.id
                  document.body.appendChild(ns)
                  document.body.removeChild(ns)
                })
                if(typeof lucide!=='undefined')lucide.createIcons()
                if(typeof initSPARouter==='function')initSPARouter()
                if(typeof updateActiveLinks==='function')updateActiveLinks()
              }
            }
          }else if(msg.type==='reload'){
            window.location.reload()
          }else if(msg.type==='error'){
            var app=document.getElementById('app')
            if(app){
              var errDiv=document.createElement('div')
              errDiv.style.cssText='position:fixed;top:0;left:0;right:0;z-index:99999;background:#fee2e2;color:#991b1b;border-bottom:3px solid #ef4444;padding:12px 20px;font-weight:700;font-family:system-ui'
              errDiv.innerHTML='<span style="font-size:1.1rem">✘</span> Compile Error: '+msg.message+' <span style="font-size:0.8rem;opacity:0.7">('+(msg.file||'')+')</span>'
              app.prepend(errDiv)
              setTimeout(function(){errDiv.remove()},8000)
            }
          }
        }catch(e){console.error('[Unify HMR]',e)}
      }
      ws.onclose=function(){rt=setTimeout(connect,1500)}
      ws.onerror=function(){ws&&ws.close()}
    }catch(e){}
  }
  connect()
})();
`
}

// ---- File Watcher ----
function startFileWatcher(config) {
  const chokidar = require('chokidar')
  const pagesDir = path.join(cwd, config.srcDir || 'pages')
  const appFile = path.join(cwd, 'App.uix')
  const localesDir = path.join(cwd, 'locales')

  const watchPaths = [pagesDir]
  if (fs.existsSync(appFile)) watchPaths.push(appFile)
  if (fs.existsSync(localesDir)) watchPaths.push(localesDir)

  const watcher = chokidar.watch(watchPaths, {
    ignoreInitial: true,
    awaitWriteFinish: { stabilityThreshold: 100, pollInterval: 50 }
  })

  watcher.on('change', (filePath) => {
    const locales = loadLocales(config)
    const isApp = filePath === appFile
    const isPage = filePath.startsWith(pagesDir) && filePath.endsWith('.uix')
    const isLocale = filePath.startsWith(localesDir) && filePath.endsWith('.json')

    if (isApp) {
      console.log(` ${dimmed(ts())} ${doing('App.uix changed — reloading all clients')}`)
      broadcast('reload')
      return
    }

    if (isLocale) {
      console.log(` ${dimmed(ts())} ${doing(`Locale: ${path.basename(filePath)} — reloading all clients`)}`)
      broadcast('reload')
      return
    }

    if (isPage) {
      let route = '/' + path.relative(pagesDir, filePath).replace(/\\/g, '/').replace(/\.uix$/, '')
      if (route.endsWith('/index')) route = route.slice(0, -6) || '/'

      try {
        const html = compilePage(route, config, locales)
        if (html) {
          console.log(` ${dimmed(ts())} ${doing(`${path.basename(filePath)} — HMR ${route}`)}`)
          broadcast('hmr', { path: route, html })
        }
      } catch (err) {
        console.log(` ${dimmed(ts())} ${fail(`${path.basename(filePath)}: ${err.message}`)}`)
        broadcast('error', { file: path.basename(filePath), message: err.message })
      }
    }
  })

  watcher.on('add', (filePath) => {
    if (filePath.endsWith('.uix')) {
      console.log(` ${dimmed(ts())} ${doing(`New page: ${path.basename(filePath)} — reloading`)}`)
      broadcast('reload')
    }
  })

  console.log(doing(`Watching: ${path.relative(cwd, pagesDir)}/`))
  return watcher
}

// ---- Landing page when no pages/ exists ----
function landingPageHTML(config) {
  const projectName = path.basename(cwd)
  return `<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Unify Dev Server</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Inter', system-ui, sans-serif;
      background: #f5f3ff;
      color: #1e1b4b;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }
    .card {
      background: #fff;
      border: 3px solid #1e1b4b;
      border-radius: 12px;
      padding: 2.5rem;
      max-width: 520px;
      width: 100%;
      box-shadow: 6px 6px 0 #1e1b4b;
      text-align: center;
    }
    h1 { font-size: 1.8rem; font-weight: 800; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: -0.02em; }
    p { margin-bottom: 1.5rem; line-height: 1.6; color: #6b7280; }
    .cmd {
      background: #ede9fe;
      border: 2px solid #1e1b4b;
      border-radius: 8px;
      padding: 12px 16px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.9rem;
      text-align: left;
      margin-bottom: 1.5rem;
      white-space: pre;
      overflow-x: auto;
    }
    .steps { text-align: left; margin-bottom: 1.5rem; }
    .steps li { margin-bottom: 0.5rem; line-height: 1.5; list-style: none; }
    .steps li::before { content: '→ '; font-weight: 700; color: #7c3aed; }
    .badge {
      display: inline-block;
      background: #7c3aed;
      color: #fff;
      padding: 4px 12px;
      border-radius: 8px;
      font-size: 0.75rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 1rem;
    }
    a { color: #7c3aed; font-weight: 700; }
    .footer { margin-top: 1rem; font-size: 0.85rem; color: #6b7280; }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">Unify Dev Server v0.6.7</div>
    <h1>${projectName}</h1>
    <p>No pages/ directory found in this project.</p>
    <div class="steps">
      <li>Create <strong>pages/</strong> with <code>.uix</code> files</li>
      <li>Add an <strong>App.uix</strong> for the shell layout</li>
      <li>Changes appear instantly with HMR</li>
    </div>
    <div class="cmd">mkdir pages
echo 'Page { Header { text: "Hello" } }' > pages/index.uix
unify dev</div>
    <p>Or try the <a href="/__dashboard">built-in dashboard demo →</a></p>
    <div class="footer">Neu-Brutalism .uix Framework</div>
  </div>
</body>
</html>`
}

// ---- Built-in Dashboard Demo ----
function dashboardDemoHTML() {
  return `<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dashboard Demo · Unify</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet">
  <script src="https://unpkg.com/lucide@latest"></script>
  <style>
    :root {
      --bg: #f5f3ff; --bg-alt: #ede9fe; --surface: #fff;
      --text: #1e1b4b; --text-muted: #6b7280;
      --primary: #7c3aed; --secondary: #fbbf24; --success: #10b981;
      --danger: #ef4444; --border: #1e1b4b;
      --bw: 3px; --radius: 12px; --r-sm: 8px; --r-lg: 16px;
      --pad: 20px; --gap: 1.5rem;
      --font: 'Inter', system-ui, sans-serif;
      --shadow: 6px 6px 0 var(--border);
      --sh-sm: 4px 4px 0 var(--border);
    }
    [data-theme="dark"] {
      --bg: #0e0e0e; --bg-alt: #1a1a1a; --surface: #1a1a1a;
      --text: #f3f4f6; --text-muted: #a3a3a3; --border: #a3a3a3;
      --primary: #a78bfa; --secondary: #fbbf24; --success: #34d399;
      --shadow: 6px 6px 0 var(--border); --sh-sm: 4px 4px 0 var(--border);
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: var(--bg); color: var(--text);
      font-family: var(--font); transition: .15s ease;
      min-height: 100vh; -webkit-font-smoothing: antialiased;
    }
    /* Nav */
    .nav {
      background: var(--surface); border: var(--bw) solid var(--border);
      border-radius: var(--radius); padding: 12px 24px;
      display: flex; gap: 16px; align-items: center; flex-wrap: wrap;
      box-shadow: var(--sh-sm); max-width: 1200px; margin: 1rem auto;
    }
    .brand { font-weight: 800; font-size: 1.1rem; margin-right: auto; }
    .nav a { font-weight: 700; cursor: pointer; color: var(--text);
      text-decoration: none; padding: 4px 8px; border-radius: 4px;
      transition: .15s ease; }
    .nav a:hover { color: var(--primary); background: var(--bg-alt); }
    .nav a.active { color: var(--primary); background: var(--bg-alt);
      border-bottom: 3px solid var(--primary); }
    /* Toggle buttons */
    .toggle {
      background: var(--surface); border: var(--bw) solid var(--border);
      border-radius: var(--r-sm); width: 44px; height: 44px;
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; box-shadow: var(--sh-sm); transition: .15s ease;
      flex-shrink: 0;
    }
    .toggle:hover { box-shadow: 6px 6px 0 var(--border); transform: translate(-2px,-2px); }
    .lang-toggle { font-weight: 800; font-size: .85rem; }
    /* Page */
    .page { max-width: 1200px; margin: 0 auto; padding: 24px 16px; animation: fadeIn .25s ease; }
    .page h1 { font-size: 2rem; font-weight: 800; margin-bottom: .5em; }
    .page h2 { font-size: 1.5rem; font-weight: 700; margin-bottom: .5em; margin-top: 2rem; }
    .page p { margin-bottom: 1rem; line-height: 1.6; }
    /* Stats grid */
    .stats { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: var(--gap); margin-bottom: 2rem; }
    .stat-card {
      background: var(--surface); border: var(--bw) solid var(--border);
      border-radius: var(--radius); padding: var(--pad);
      box-shadow: var(--shadow); text-align: center;
    }
    .stat-value { font-size: 2rem; font-weight: 800; }
    .stat-label { font-size: .85rem; color: var(--text-muted); font-weight: 600; }
    /* Activity */
    .activity-card {
      background: var(--surface); border: var(--bw) solid var(--border);
      border-radius: var(--r-sm); padding: 14px 18px;
      display: flex; align-items: center; justify-content: space-between;
      margin-bottom: .5rem; box-shadow: var(--sh-sm);
    }
    .badge {
      display: inline-flex; align-items: center;
      padding: 4px 12px; border-radius: var(--r-sm);
      font-size: .75rem; font-weight: 800; text-transform: uppercase;
      letter-spacing: .05em; border: 2px solid var(--border);
    }
    .badge-success { background: #d1fae5; color: #065f46; border-color: var(--success); }
    .badge-info { background: var(--bg-alt); color: var(--primary); }
    .badge-warning { background: #fef3c7; color: #92400e; border-color: var(--secondary); }
    /* Analytics page */
    .hidden { display: none; }
    .analytics-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: var(--gap); margin-bottom: 2rem; }
    .bar { height: 8px; background: var(--bg-alt); border-radius: 4px; margin-top: .5rem; overflow: hidden; }
    .bar-fill { height: 100%; background: var(--primary); border-radius: 4px; transition: width .4s ease; }
    /* Table */
    table { width: 100%; border-collapse: collapse; font-size: .9rem; border: var(--bw) solid var(--border); }
    th, td { padding: 10px 14px; text-align: left; border-bottom: var(--bw) solid var(--border); }
    th { font-weight: 800; background: var(--primary); color: #fff; font-size: .8rem; text-transform: uppercase; }
    tr:last-child td { border-bottom: none; }
    tr:hover td { background: var(--bg-alt); }
    .up { color: var(--success); font-weight: 700; }
    .down { color: var(--danger); font-weight: 700; }
    /* Buttons */
    .btn {
      background: var(--surface); border: var(--bw) solid var(--border);
      border-radius: var(--r-sm); padding: 10px 20px; color: var(--text);
      font-size: .9rem; font-weight: 700; cursor: pointer;
      box-shadow: var(--sh-sm); transition: .15s ease;
      display: inline-flex; align-items: center; gap: .5rem;
    }
    .btn:hover { box-shadow: 6px 6px 0 var(--border); transform: translate(-2px,-2px); }
    .btn-primary { background: var(--primary); color: #fff; }
    .btn-sm { padding: 6px 14px; font-size: .8rem; }
    /* Section toggle */
    .page-section { display: none; }
    .page-section.active { display: block; }
    /* Divider */
    hr { border: none; height: var(--bw); background: var(--border); margin: 1.5rem 0; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
    @media (max-width: 768px) {
      .stats, .analytics-grid { grid-template-columns: 1fr; }
      .nav { flex-direction: column; align-items: stretch; }
      .brand { margin-right: 0; }
      .page { padding: 16px 12px; }
    }
  </style>
</head>
<body>
  <nav class="nav">
    <span class="brand">Dashboard</span>
    <a href="#" class="active" onclick="showPage('overview')">Overview</a>
    <a href="#" onclick="showPage('analytics')">Analytics</a>
    <a href="#" onclick="showPage('settings')">Settings</a>
    <button class="toggle" onclick="toggleTheme()" aria-label="Toggle theme">
      <svg id="theme-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>
    </button>
    <button class="toggle lang-toggle" onclick="toggleLang()" aria-label="Toggle language">EN</button>
  </nav>

  <div class="page">
    <!-- OVERVIEW -->
    <div id="page-overview" class="page-section active">
      <h1>Dashboard Overview</h1>
      <p style="color:var(--text-muted)">Welcome back! Here&apos;s what&apos;s happening.</p>
      <div class="stats">
        <div class="stat-card"><div class="stat-value">1,247</div><div class="stat-label">Total Users</div></div>
        <div class="stat-card"><div class="stat-value">$84.2K</div><div class="stat-label">Revenue</div></div>
        <div class="stat-card"><div class="stat-value">98.5%</div><div class="stat-label">Uptime</div></div>
        <div class="stat-card"><div class="stat-value">12</div><div class="stat-label">Active Projects</div></div>
      </div>
      <h2>Recent Activity</h2>
      <div class="activity-card"><span>New user signed up</span><span class="badge badge-success">Done</span></div>
      <div class="activity-card"><span>Server deployment completed</span><span class="badge badge-info">Live</span></div>
      <div class="activity-card"><span>Payment received — $2,400</span><span class="badge badge-success">Paid</span></div>
      <div class="activity-card"><span>Database backup finished</span><span class="badge badge-warning">Running</span></div>
    </div>

    <!-- ANALYTICS -->
    <div id="page-analytics" class="page-section">
      <h1>Analytics</h1>
      <div class="analytics-grid">
        <div class="stat-card"><div class="stat-value">12,438</div><div class="stat-label">Page Views</div><div class="bar"><div class="bar-fill" style="width:78%"></div></div><p style="font-size:.8rem;margin-top:.5rem;color:var(--text-muted)">+14% from last month</p></div>
        <div class="stat-card"><div class="stat-value">3.24%</div><div class="stat-label">Conversion</div><div class="bar"><div class="bar-fill" style="width:32%"></div></div><p style="font-size:.8rem;margin-top:.5rem;color:var(--text-muted)">+0.8% improvement</p></div>
        <div class="stat-card"><div class="stat-value">42.1%</div><div class="stat-label">Bounce Rate</div><div class="bar"><div class="bar-fill" style="width:42%;background:var(--secondary)"></div></div><p style="font-size:.8rem;margin-top:.5rem;color:var(--text-muted)">-5% from target</p></div>
        <div class="stat-card"><div class="stat-value">4m 32s</div><div class="stat-label">Avg Session</div><div class="bar"><div class="bar-fill" style="width:65%;background:var(--success)"></div></div><p style="font-size:.8rem;margin-top:.5rem;color:var(--text-muted)">+45s improvement</p></div>
      </div>
      <h2>Traffic Sources</h2>
      <table>
        <thead><tr><th>Source</th><th>Visitors</th><th>Change</th><th>Status</th></tr></thead>
        <tbody>
          <tr><td>Organic Search</td><td>4,832</td><td class="up">+12%</td><td class="up">↑</td></tr>
          <tr><td>Direct</td><td>3,201</td><td class="up">+5%</td><td class="up">↑</td></tr>
          <tr><td>Social Media</td><td>2,145</td><td class="down">-2%</td><td class="down">↓</td></tr>
          <tr><td>Referral</td><td>1,876</td><td class="up">+18%</td><td class="up">↑</td></tr>
          <tr><td>Email</td><td>384</td><td class="up">+7%</td><td class="up">↑</td></tr>
        </tbody>
      </table>
    </div>

    <!-- SETTINGS -->
    <div id="page-settings" class="page-section">
      <h1>Settings</h1>
      <p style="color:var(--text-muted)">Manage your account and preferences.</p>
      <div class="stat-card" style="text-align:left">
        <h2 style="margin-top:0;font-size:1.2rem">Profile</h2>
        <p style="font-size:.85rem;font-weight:700;margin-bottom:.3rem">Full Name</p>
        <input class="toggle" style="width:100%;padding:10px 14px;text-align:left;font-weight:600;font-size:.9rem;font-family:var(--font);margin-bottom:.8rem" value="John Doe">
        <p style="font-size:.85rem;font-weight:700;margin-bottom:.3rem">Email</p>
        <input class="toggle" style="width:100%;padding:10px 14px;text-align:left;font-weight:600;font-size:.9rem;font-family:var(--font);margin-bottom:.8rem" value="john@example.com">
        <button class="btn btn-primary" onclick="alert('Profile saved!')">Save Changes</button>
      </div>
      <div class="stat-card" style="text-align:left;margin-top:1rem">
        <h2 style="margin-top:0;font-size:1.2rem">Notifications</h2>
        <p style="font-size:.85rem;font-weight:700;margin-bottom:.3rem">Email notifications</p>
        <select class="toggle" style="width:100%;padding:10px 14px;text-align:left;font-weight:600;font-size:.9rem;font-family:var(--font);margin-bottom:.8rem">
          <option>All notifications</option>
          <option>Only important</option>
          <option>None</option>
        </select>
        <hr>
        <p style="font-size:.85rem;font-weight:700;margin-bottom:.3rem">Theme</p>
        <button class="btn btn-sm" onclick="toggleTheme()">Toggle Dark Mode</button>
      </div>
    </div>
  </div>

  <script>
    function showPage(name) {
      document.querySelectorAll('.page-section').forEach(function(s) { s.classList.remove('active') })
      document.getElementById('page-'+name).classList.add('active')
      document.querySelectorAll('.nav a').forEach(function(a) { a.classList.remove('active') })
      document.querySelectorAll('.nav a')[['overview','analytics','settings'].indexOf(name)].classList.add('active')
    }
    function toggleTheme() {
      var th = document.documentElement.getAttribute('data-theme')
      var next = th === 'dark' ? 'light' : 'dark'
      document.documentElement.setAttribute('data-theme', next)
      localStorage.setItem('unify-theme', next)
      var icon = document.getElementById('theme-icon')
      if (next === 'dark') {
        icon.innerHTML = '<circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>'
      } else {
        icon.innerHTML = '<path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>'
      }
    }
    var _langs=['en','fr','ar']
    function toggleLang() {
      var langs = _langs
      var cur = localStorage.getItem('unify-lang') || 'en'
      var idx = langs.indexOf(cur)
      var next = langs[(idx+1)%langs.length]
      localStorage.setItem('unify-lang', next)
      document.documentElement.setAttribute('dir', next==='ar'?'rtl':'ltr')
      document.querySelector('.lang-toggle').textContent = next.toUpperCase()
      var labels = { en:'EN', fr:'FR', ar:'AR' }
      document.querySelector('.lang-toggle').textContent = labels[next] || next.toUpperCase()
    }
    var savedTheme = localStorage.getItem('unify-theme')
    if (savedTheme) document.documentElement.setAttribute('data-theme', savedTheme)
    var savedLang = localStorage.getItem('unify-lang')
    if (savedLang) {
      document.documentElement.setAttribute('lang', savedLang)
      document.querySelector('.lang-toggle').textContent = savedLang.toUpperCase()
      if (savedLang === 'ar') document.documentElement.setAttribute('dir', 'rtl')
    }
  </script>
</body>
</html>`
}

// ---- Serve Dev ----
function serveDev(config) {
  const port = config.port || 6710
  const pagesDir = path.join(cwd, config.srcDir || 'pages')
  const publicDir = path.join(cwd, config.publicDir || 'public')

  const mimeTypes = {
    '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript',
    '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.woff2': 'font/woff2',
  }

  const clientHmrScript = getHmrClientScript(port)

  const server = http.createServer((req, res) => {
    const url = new URL(req.url, `http://localhost:${port}`)
    let reqPath = url.pathname

    if (reqPath === '/favicon.ico') { res.writeHead(204); res.end(); return }

    // Built-in dashboard demo
    if (reqPath === '/__dashboard') {
      res.writeHead(200, { 'Content-Type': 'text/html' })
      const html = dashboardDemoHTML().replace('</body>', `<script>${clientHmrScript}</script>\n</body>`)
      res.end(html)
      return
    }

    // Serve public files
    const pubFile = path.join(publicDir, reqPath === '/' ? 'index.html' : reqPath)
    if (fs.existsSync(pubFile) && !reqPath.startsWith('/pages')) {
      const ext = path.extname(pubFile)
      res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' })
      res.end(fs.readFileSync(pubFile))
      return
    }

    // Compile and serve .uix page
    if (!fs.existsSync(pagesDir)) {
      const html = landingPageHTML(config).replace('</body>', `<script>${clientHmrScript}</script>\n</body>`)
      res.writeHead(200, { 'Content-Type': 'text/html' })
      res.end(html)
      return
    }

    const locales = loadLocales(config)
    try {
      const html = compilePage(reqPath, config, locales)
      if (html) {
        const injected = html.replace('</body>', `<script>${clientHmrScript}</script>\n</body>`)
        res.writeHead(200, { 'Content-Type': 'text/html' })
        res.end(injected)
      } else {
        res.writeHead(404, { 'Content-Type': 'text/html' })
        res.end(`<h1>404 — Not Found</h1><p>${reqPath}</p>`)
      }
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'text/html' })
      res.end(`<h1>Compile Error</h1><pre style="background:#1e1e1e;color:#f8f8f8;padding:1rem">${err.message}</pre>`)
    }
  })

  server.listen(port, () => {
    header('Development Server')
    console.log(ok(`http://localhost:${port}`))
    if (fs.existsSync(pagesDir)) {
      console.log(doing(`Pages: ${path.relative(cwd, pagesDir)}/`))
    } else {
      console.log(info(`No pages/ found — run "unify init" to create a project`))
      console.log(doing(`Built-in dashboard: http://localhost:${port}/__dashboard`))
    }
    console.log(dimmed('────────────────────────────────────────'))

    startHmrServer(port)
    const watcher = startFileWatcher(config)

    process.on('SIGINT', () => {
      watcher.close()
      process.exit(0)
    })

    console.log(info(`HMR: edit .uix files → instant browser updates`))
    console.log(dimmed(`Press Ctrl+C to stop\n`))
  })
}

// ---- Build ----
function build(config) {
  const pagesDir = path.join(cwd, config.srcDir || 'pages')
  const outDir = path.join(cwd, config.outDir || 'dist')
  const publicDir = path.join(cwd, config.publicDir || 'public')
  const appFile = path.join(cwd, 'App.uix')
  const locales = loadLocales(config)

  if (!fs.existsSync(pagesDir)) {
    console.log(fail('No pages/ directory found.'))
    console.log(doing('Run: unify init'))
    return
  }

  let appResult = null
  if (fs.existsSync(appFile)) {
    try {
      appResult = compileFile(appFile)
    } catch (err) {
      console.log(warn(`Failed to compile App.uix: ${err.message}`))
    }
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
          let code = result.code
          let meta = result.meta
          let rawScript = result.rawScript || ''
          let rawStyle = result.rawStyle || ''
          let appCode = ''

          if (appResult) {
            appCode = appResult.code
            meta = { ...appResult.meta, ...meta }
            rawScript = (appResult.rawScript || '') + '\n' + rawScript
            rawStyle = (appResult.rawStyle || '') + '\n' + rawStyle
          }

          const html = compileToHTML(code, meta, config, rawScript, rawStyle, appCode, locales)
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

  console.log(ok(`Built ${count} pages — output: ${path.relative(cwd, outDir)}/`))
  if (count > 0) console.log(doing(`Open: ${path.join(outDir, 'index.html')}`))
}

// ---- Commands ----
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

  const timer = spinStart('Building for production...')
  build(config)
  spinStop(timer, 'Build complete', true)
  console.log()
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
  console.log(`  ${colors.pastelGreen('  unify dev')}            ${dimmed('Start the dev server (port 6710)')}`)
  console.log(`  ${colors.pastelGreen('  unify run')}            ${dimmed('Alias for dev')}`)
  console.log(`  ${colors.pastelGreen('  unify start')}          ${dimmed('Alias for dev')}`)
  console.log(`  ${colors.pastelGreen('  unify build')}          ${dimmed('Build to static HTML/CSS/JS')}`)
  console.log(`  ${colors.pastelGreen('  unify init')}           ${dimmed('Initialize project in current dir')}`)
  console.log(`  ${colors.pastelGreen('  unify init <name>')}    ${dimmed('Create new project directory')}`)
  console.log(`  ${colors.pastelGreen('  unify init --ts')}      ${dimmed('With TypeScript')}`)
  console.log(`  ${colors.pastelGreen('  unify init --tw')}      ${dimmed('With Tailwind CSS')}`)
  console.log(`  ${colors.pastelGreen('  unify new <name>')}     ${dimmed('Create a new page')}`)
  console.log(`  ${colors.pastelGreen('  unify ai')}             ${dimmed('AI coding assistant (Ollama)')}`)
  console.log(`  ${colors.pastelGreen('  unify help')}           ${dimmed('Show this help')}`)
  console.log(`  ${colors.pastelGreen('  unify version')}        ${dimmed('Show version')}`)
  console.log()
  console.log(`  ${colors.bold('EXAMPLES')}`)
  console.log(`  ${dimmed('  unify init my-app && cd my-app && unify dev')}`)
  console.log(`  ${dimmed('  unify dev      (from a project directory)')}`)
  console.log(`  ${dimmed('  unify build    (outputs to dist/)')}`)
  console.log(`  ${dimmed('  unify new PageName')}`)
  console.log()
  console.log(`  ${colors.bold('FLAGS')}`)
  console.log(`  ${dimmed('  --ts, --typescript')}    Enable TypeScript`)
  console.log(`  ${dimmed('  --tw, --tailwind')}      Enable Tailwind CSS`)
  return
}

function run(args) {
  const cmd = args[0]

  if (!cmd || cmd === 'help' || cmd === '--help' || cmd === '-h') {
    cmdHelp()
  } else if (cmd === 'version' || cmd === '--version' || cmd === '-v') {
    console.log(colors.pastelLavender('0.6.7'))
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
    console.log(`
  Contact:
    WhatsApp: +213540422155
    GitHub:   https://github.com/Youcef-Benabdallah
`)
  } else {
    console.log(fail(`Unknown command: ${cmd}`))
    console.log(doing('Run: unify help'))
  }
}

module.exports = { run }
