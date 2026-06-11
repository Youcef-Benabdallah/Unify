function fragment(children) {
  const el = document.createElement('div')
  el.style.display = 'contents'
  children.forEach(c => { if (c instanceof Node) el.appendChild(c) })
  return el
}

function html(str) {
  const t = document.createElement('template')
  t.innerHTML = str
  return t.content
}

function script(str) {
  const s = document.createElement('script')
  s.textContent = str
  return s
}

function style(str) {
  const s = document.createElement('style')
  s.textContent = str
  return s
}

function createToggle(label, toggleFn) {
  const btn = document.createElement('button')
  btn.className = 'brut-toggle'
  btn.setAttribute('aria-label', 'Toggle')
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark'
  btn.innerHTML = typeof label === 'function'
    ? (isDark
      ? '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>'
      : '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>')
    : label
  btn.addEventListener('click', () => {
    const result = typeof toggleFn === 'function' ? toggleFn() : window[toggleFn]()
    if (typeof label === 'function') {
      const dark = document.documentElement.getAttribute('data-theme') === 'dark'
      btn.innerHTML = dark
        ? '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>'
        : '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>'
    }
  })
  return btn
}

function createElement(tag, props, children) {
  props = props || {}
  children = children || []

  if (typeof tag === 'function') {
    return tag({ ...props, children })
  }

  const el = document.createElement(tag)

  for (const [key, value] of Object.entries(props)) {
    if (key === 'className') {
      el.className = value
    } else if (key.startsWith('on') && typeof value === 'function') {
      const event = key.slice(2).toLowerCase()
      el.addEventListener(event, value)
    } else if (key === 'style' && typeof value === 'object') {
      Object.assign(el.style, value)
    } else if (key === 'html') {
      el.innerHTML = value
    } else if (key === 'data') {
      for (const [dk, dv] of Object.entries(value)) {
        el.dataset[dk] = dv
      }
    } else {
      el.setAttribute(key, String(value))
    }
  }

  for (const child of children) {
    if (child == null || child === false) continue
    if (typeof child === 'string' || typeof child === 'number') {
      el.appendChild(document.createTextNode(String(child)))
    } else if (child instanceof Node) {
      el.appendChild(child)
    } else if (child instanceof DocumentFragment) {
      el.appendChild(child)
    } else if (Array.isArray(child)) {
      child.forEach(c => {
        if (c instanceof Node) el.appendChild(c)
        else if (typeof c === 'string') el.appendChild(document.createTextNode(c))
      })
    }
  }

  return el
}

function render(component, container) {
  if (typeof container === 'string') {
    container = document.querySelector(container)
  }
  if (!container) throw new Error('Container not found')

  const el = typeof component === 'function' ? component() : component
  if (el instanceof Node) {
    container.innerHTML = ''
    container.appendChild(el)
  }
  return container
}

function mount(component, selector = '#app') {
  const container = document.querySelector(selector)
  if (!container) {
    console.warn('Unify: target "' + selector + '" not found. Creating one.')
    const div = document.createElement('div')
    div.id = selector.replace('#', '')
    document.body.appendChild(div)
    return render(component, div)
  }
  return render(component, container)
}

function createSignal(initial) {
  let value = initial
  const listeners = []
  const read = () => value
  const write = (next) => {
    const newVal = typeof next === 'function' ? next(value) : next
    if (newVal !== value) { value = newVal; listeners.forEach(fn => fn(value)) }
  }
  const subscribe = (fn) => { listeners.push(fn); return () => { const i = listeners.indexOf(fn); if (i >= 0) listeners.splice(i, 1) } }
  return [read, write, { subscribe, value: read }]
}

function computed(fn, deps) {
  const s = createSignal(fn())
  if (deps && deps.length) {
    deps.forEach(d => { if (d && d.subscribe) d.subscribe(() => s[1](fn())) })
  }
  return s
}

let batchDepth = 0, batchQueue = []
function batch(fn) {
  batchDepth++
  try { fn() } finally { batchDepth-- }
  if (batchDepth === 0) { const q = batchQueue.slice(); batchQueue = []; q.forEach(f => f()) }
}

function effect(fn) {
  const run = () => { try { fn() } catch (e) { console.error('[Unify] effect error:', e) } }
  run()
  return run
}

function bind(signal, element, attr) {
  if (!element) return
  attr = attr || 'textContent'
  const update = (val) => {
    const v = typeof signal === 'function' ? signal() : val
    if (attr === 'value' && element.tagName === 'INPUT') element.value = v
    else if (attr === 'className') element.className = v
    else if (attr === 'style') {
      if (typeof v === 'object') Object.assign(element.style, v)
      else element.style.cssText = v
    } else if (attr.startsWith('data-')) element.setAttribute(attr, v)
    else element[attr] = v
  }
  if (typeof signal === 'function') { update(signal()); signal.subscribe && signal.subscribe(update); return () => signal }
  signal.subscribe && signal.subscribe(update)
  return () => signal
}

function createStore(initial) {
  const state = { ...initial }
  const listeners = new Set()
  const get = (key) => key ? state[key] : { ...state }
  const set = (key, val) => {
    if (typeof key === 'object') Object.assign(state, key)
    else state[key] = val
    listeners.forEach(fn => fn({ ...state }))
  }
  const subscribe = (fn) => { listeners.add(fn); return () => listeners.delete(fn) }
  return { get, set, subscribe, state }
}

function reactiveComponent(renderFn, container) {
  container = container || document.createElement('div')
  var current = null
  var render = function() {
    var next = renderFn()
    if (current && current.parentNode) current.parentNode.replaceChild(next, current)
    else if (container) container.appendChild(next)
    current = next
    return current
  }
  return { el: container, render, mount: function(parent) { parent.appendChild(container); render(); return container } }
}

var errorLog = []
var errorHandlers = []
function onError(handler) { errorHandlers.push(handler); return function() { var i = errorHandlers.indexOf(handler); if (i >= 0) errorHandlers.splice(i, 1) } }
function captureError(err, context) {
  var entry = { error: err, message: err.message || String(err), stack: err.stack, context: context || '', timestamp: Date.now() }
  errorLog.push(entry)
  if (errorLog.length > 50) errorLog.shift()
  console.error('[Unify]', context || 'Error:', err)
  errorHandlers.forEach(function(h) { try { h(entry) } catch (e) {} })
  return entry
}

var plugins = {}
function plugin(name, hooks) {
  if (plugins[name]) { console.warn('[Unify] Plugin "' + name + '" already registered'); return }
  plugins[name] = hooks || {}
  if (hooks && hooks.onRegister) hooks.onRegister({ effect, computed, createSignal, createStore })
  return { name, unregister: function() { delete plugins[name] } }
}
function hook(lifecycle, data) {
  Object.values(plugins).forEach(function(p) {
    if (typeof p[lifecycle] === 'function') try { p[lifecycle](data) } catch (e) { console.error('[Unify] Plugin hook error:', e) }
  })
}

function validate(form, rules) {
  hook('beforeValidate', { form, rules })
  const errors = {}
  Object.entries(rules).forEach(([field, validators]) => {
    const input = form.querySelector('[name="' + field + '"]')
    const value = input ? input.value : ''
    if (typeof validators === 'string') validators = [validators]
    const list = Array.isArray(validators) ? validators : [validators]
    list.forEach(rule => {
      if (rule === 'required' && !value.trim()) { errors[field] = 'This field is required' }
      else if (rule === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) { errors[field] = 'Invalid email address' }
      else if (rule === 'phone' && value && !/^\+?[\d\s()-]{7,15}$/.test(value)) { errors[field] = 'Invalid phone number' }
      else if (rule === 'url' && value && !/^https?:\/\/.+/.test(value)) { errors[field] = 'Invalid URL' }
      else if (rule === 'number' && value && isNaN(Number(value))) { errors[field] = 'Must be a number' }
      else if (rule === 'alpha' && value && !/^[a-zA-Z]+$/.test(value)) { errors[field] = 'Letters only' }
      else if (rule === 'alphanumeric' && value && !/^[a-zA-Z0-9]+$/.test(value)) { errors[field] = 'Letters and numbers only' }
      else if (rule.min && value.length < rule.min) { errors[field] = 'Minimum ' + rule.min + ' characters' }
      else if (rule.max && value.length > rule.max) { errors[field] = 'Maximum ' + rule.max + ' characters' }
      else if (rule.minVal && Number(value) < rule.minVal) { errors[field] = 'Minimum value is ' + rule.minVal }
      else if (rule.maxVal && Number(value) > rule.maxVal) { errors[field] = 'Maximum value is ' + rule.maxVal }
      else if (rule.match && value !== form.querySelector('[name="' + rule.match + '"]').value) { errors[field] = 'Fields do not match' }
      else if (typeof rule === 'function') { const err = rule(value, input); if (err) errors[field] = err }
    })
  })
  const result = { valid: Object.keys(errors).length === 0, errors, show: function() { showErrors(form, errors) }, clear: function() { clearErrors(form) } }
  Object.entries(errors).forEach(function(f) { var inp = form.querySelector('[name="' + f[0] + '"]'); if (inp) inp.classList.add('brut-input--error') })
  hook('afterValidate', { form, rules, result })
  return result
}

function showErrors(form, errors) {
  clearErrors(form)
  Object.entries(errors).forEach(function(f) {
    var inp = form.querySelector('[name="' + f[0] + '"]')
    if (inp) {
      var errEl = document.createElement('div')
      errEl.className = 'brut-form-error'
      errEl.setAttribute('data-error-for', f[0])
      errEl.style.cssText = 'color:var(--brut-danger);font-size:0.75rem;font-weight:700;margin-top:4px'
      errEl.textContent = f[1]
      inp.parentNode.insertBefore(errEl, inp.nextSibling)
      inp.classList.add('brut-input--error')
    }
  })
}

function clearErrors(form) {
  form.querySelectorAll('.brut-form-error').forEach(function(e) { e.remove() })
  form.querySelectorAll('.brut-input--error').forEach(function(e) { e.classList.remove('brut-input--error') })
}

function createForm(form, rules, opts) {
  opts = opts || {}
  var state = { valid: true, errors: {}, touched: {} }
  form.querySelectorAll('[name]').forEach(function(inp) {
    var field = inp.getAttribute('name')
    inp.addEventListener('blur', function() { state.touched[field] = true; var r = {}; r[field] = rules[field]; var res = validate(form, r); state.errors = Object.assign(state.errors, res.errors); if (!res.valid && opts.showErrors !== false) showErrors(form, res.errors) })
    inp.addEventListener('input', function() { if (state.touched[field]) { var r = {}; r[field] = rules[field]; validate(form, r) } })
  })
  return {
    validate: function() { state.valid = true; state.errors = {}; clearErrors(form); var res = validate(form, rules); state.errors = res.errors; state.valid = res.valid; if (!res.valid && opts.showErrors !== false) res.show(); return res },
    reset: function() { form.reset(); state.errors = {}; state.touched = {}; state.valid = true; clearErrors(form) },
    state: state,
    setValues: function(vals) { Object.entries(vals).forEach(function(e) { var inp = form.querySelector('[name="' + e[0] + '"]'); if (inp) inp.value = e[1] }) },
    getValues: function() { var vals = {}; form.querySelectorAll('[name]').forEach(function(e) { vals[e.getAttribute('name')] = e.value }); return vals }
  }
}

module.exports = {
  createElement, createToggle, createSignal, createStore, computed, effect, batch, bind, reactiveComponent,
  fragment, html, script, style, render, mount,
  validate, showErrors, clearErrors, createForm,
  plugin, hook, plugins,
  captureError, onError, errorLog
}