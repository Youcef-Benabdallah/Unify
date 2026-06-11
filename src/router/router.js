const fs = require('fs')
const path = require('path')
const { compileFile } = require('../compiler/compiler')

class UnifyRouter {
  constructor(options = {}) {
    this.pagesDir = options.pagesDir || path.join(process.cwd(), 'pages')
    this.routes = []
    this._scan()
  }

  _scan(dir) {
    if (!dir) dir = this.pagesDir
    if (!fs.existsSync(dir)) return

    const entries = fs.readdirSync(dir, { withFileTypes: true })
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        this._scan(fullPath)
      } else if (entry.name.endsWith('.uix')) {
        const routePath = this._fileToRoute(fullPath)
        this.routes.push({ path: routePath, file: fullPath, name: path.basename(entry.name, '.uix') })
      }
    }
  }

  _fileToRoute(filePath) {
    let relative = path.relative(this.pagesDir, filePath)
    relative = relative.replace(/\\/g, '/')
    let route = '/' + relative.replace(/\.uix$/, '')
    if (route.endsWith('/index')) route = route.slice(0, -6) || '/'
    if (route.endsWith('/home')) route = route.slice(0, -5) || '/'
    route = route.replace(/\[([^\]]+)\]/g, ':$1')
    return route
  }

  match(requestPath) {
    const cleanPath = '/' + requestPath.replace(/^\/+/, '').replace(/\/+$/, '')
    for (const route of this.routes) {
      const params = {}
      const routeParts = route.path.split('/')
      const reqParts = cleanPath.split('/')
      if (routeParts.length !== reqParts.length) continue
      let match = true
      for (let i = 0; i < routeParts.length; i++) {
        if (routeParts[i].startsWith(':')) {
          params[routeParts[i].slice(1)] = reqParts[i]
        } else if (routeParts[i] !== reqParts[i]) {
          match = false
          break
        }
      }
      if (match) return { ...route, params }
    }
    return null
  }

  compileAll() {
    return this.routes.map(route => {
      try {
        const result = compileFile(route.file)
        return { ...route, ...result }
      } catch (err) {
        console.error(`Error compiling ${route.file}:`, err.message)
        return null
      }
    }).filter(Boolean)
  }

  getRoutes() {
    return this.routes.map(r => r.path)
  }
}

function createRouter(pagesDir) {
  return new UnifyRouter({ pagesDir })
}

module.exports = UnifyRouter
module.exports.createRouter = createRouter