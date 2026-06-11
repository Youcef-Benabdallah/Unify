const fs = require('fs')
const path = require('path')

const CONFIG_FILE = 'unify.conf'

const DEFAULTS = {
  port: 6710,
  srcDir: 'pages',
  outDir: 'dist',
  publicDir: 'public',
  tailwind: false,
  typescript: false,
  theme: {
    mode: 'light',
    brutalism: true,
    primary: '#7c3aed',
    secondary: '#fbbf24',
    success: '#10b981',
    danger: '#ef4444',
    info: '#7c3aed',
    warning: '#fbbf24',
    font: 'Inter, system-ui',
    darkBg: '#0e0e0e',
    darkSurface: '#1a1a1a',
    darkText: '#f3f4f6',
    darkBorder: '#a3a3a3'
  },
  languages: ['en', 'fr', 'es'],
  defaultLang: 'en',
  meta: {
    title: 'Unify App',
    description: 'Built with Unify',
    lang: 'en'
  },
  dev: {
    hmr: true,
    openBrowser: false
  },
  ai: {
    enabled: false,
    model: 'llama3.2',
    ollamaHost: 'http://localhost:11434'
  }
}

function findConfig(startDir) {
  let dir = startDir || process.cwd()
  for (let i = 0; i < 10; i++) {
    const p = path.join(dir, CONFIG_FILE)
    if (fs.existsSync(p)) return p
    const parent = path.dirname(dir)
    if (parent === dir) break
    dir = parent
  }
  return null
}

function loadConfig(startDir) {
  const configPath = findConfig(startDir)
  if (!configPath) return { ...DEFAULTS, _path: null }

  try {
    const raw = fs.readFileSync(configPath, 'utf-8')
    const parsed = JSON.parse(raw)
    const merged = { ...DEFAULTS, ...parsed }
    merged._path = configPath
    return merged
  } catch (err) {
    console.warn(`Warning: failed to parse ${CONFIG_FILE}: ${err.message}`)
    return { ...DEFAULTS, _path: configPath }
  }
}

function writeConfig(dir, overrides = {}) {
  const configPath = path.join(dir, CONFIG_FILE)
  const config = { ...DEFAULTS, ...overrides }
  delete config._path
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf-8')
  return configPath
}

module.exports = { DEFAULTS, findConfig, loadConfig, writeConfig }