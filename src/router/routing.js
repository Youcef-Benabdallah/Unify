function generateClientRouterCode(outDir) {
  return `
    var __outDir = ${JSON.stringify(outDir || 'dist')}

    function getSiteRoot() {
      var url = window.location.href.replace(/\\\\/g, '/')
      var outDirName = __outDir.replace(/^\\/+|\\/+$/g, '')
      var idx = url.toLowerCase().lastIndexOf('/' + outDirName.toLowerCase() + '/')
      if (idx !== -1) {
        return url.substring(0, idx + outDirName.length + 1)
      }
      return url.substring(0, url.lastIndexOf('/'))
    }

    function __runScripts(doc) {
      var scripts = doc.querySelectorAll('script')
      scripts.forEach(function(oldScript) {
        if (oldScript.id === 'unify-custom') return
        var newScript = document.createElement('script')
        if (oldScript.src) {
          newScript.src = oldScript.src
        } else {
          newScript.textContent = oldScript.textContent
        }
        document.body.appendChild(newScript)
        document.body.removeChild(newScript)
      })
    }

    function initSPARouter() {
      try {
      if (window.location.protocol === 'file:') {
        var siteRoot = getSiteRoot()
        document.querySelectorAll('a[href]').forEach(function(a) {
          try {
          var href = a.getAttribute('href')
          if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('//') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('file:')) return
          if (a.hasAttribute('target') || a.getAttribute('rel') === 'external') return
          var clean = href.replace(/^\\/+|\\/+$/g, '').replace(/\\/index\\.html$/g, '')
          if (clean) {
            a.href = siteRoot + '/' + clean + '/index.html'
          } else {
            a.href = siteRoot + '/index.html'
          }
          if (a.href === window.location.href) {
            a.setAttribute('aria-current', 'page')
            a.classList.add('brut-link--active')
          }
          } catch (e) { unify.captureError(e, 'file router link: ' + href) }
        })
        window.__spaNavigate = function(path) { window.location.href = siteRoot + '/' + path.replace(/^\\/+|\\/+$/g, '') + '/index.html' }
        return
      }
      document.addEventListener('click', function(e) {
        try {
        var link = e.target.closest('a[href]')
        if (!link) return
        var href = link.getAttribute('href')
        if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('//') || href.startsWith('mailto:') || href.startsWith('tel:')) return
        var isExternal = link.hasAttribute('target') || link.getAttribute('rel') === 'external'
        if (isExternal) return
        e.preventDefault()
        var path = href.replace(/\\/index\.html$/, '/').replace(/\\/$/, '') || '/'
        if (window.__spaNavigate) {
          window.__spaNavigate(path)
        } else {
          window.location.href = href
        }
        } catch (e) { unify.captureError(e, 'SPA click handler') }
      })
      updateActiveLinks()
      } catch (e) { unify.captureError(e, 'initSPARouter') }
    }

    function updateActiveLinks() {
      var current = window.location.pathname.replace(/\\/$/, '') || '/'
      document.querySelectorAll('a[href]').forEach(function(a) {
        var h = a.getAttribute('href').replace(/\\/$/, '') || '/'
        if (h === current) {
          a.setAttribute('aria-current', 'page')
          a.classList.add('brut-link--active')
        } else {
          a.removeAttribute('aria-current')
          a.classList.remove('brut-link--active')
        }
      })
    }

    window.__spaNavigate = function(path) {
      var prevPath = window.location.pathname
      history.pushState(null, '', path)
      var fetchPath = path === '/' ? 'index.html' : path.replace(/\\/$/, '') + '/index.html'
      var app = document.getElementById('app')
      if (!app) { window.location.href = path; return }
      app.style.opacity = '0'
      app.style.transform = 'translateY(8px)'
      app.style.transition = 'opacity 0.12s ease, transform 0.12s ease'
      fetch(fetchPath)
        .then(function(r) {
          if (!r.ok) { if (r.status === 404) unify.createToast('Page not found: ' + path, { variant: 'warning', icon: 'alert-triangle', duration: 3000 }); window.__fallbackNavigate(path); throw new Error('Page not found') }
          return r.text()
        })
        .then(function(html) {
          var parser = new DOMParser()
          var doc = parser.parseFromString(html, 'text/html')
          var newApp = doc.getElementById('app')
          if (newApp) {
            app.innerHTML = newApp.innerHTML
            __runScripts(doc)
            window.scrollTo(0, 0)
            requestAnimationFrame(function() {
              app.style.opacity = '1'
              app.style.transform = 'translateY(0)'
              if (typeof lucide !== 'undefined') lucide.createIcons()
              updateActiveLinks()
            })
          } else {
            unify.createToast('Page format error: ' + path, { variant: 'danger', icon: 'x-circle', duration: 4000 })
            window.__fallbackNavigate(path)
          }
        })
        .catch(function() {
          window.__fallbackNavigate(path)
        })
    }

    window.__fallbackNavigate = function(path) {
      var app = document.getElementById('app')
      if (app) { app.style.opacity = '1'; app.style.transform = 'translateY(0)' }
      window.location.href = path
    }

    window.addEventListener('popstate', function() {
      var path = window.location.pathname
      window.__spaNavigate(path)
    })
  `
}

module.exports.generateClientRouterCode = generateClientRouterCode
module.exports.createRouter = createRouter

function createRouter() { return 'Unify client router ready' }
