const { parseUix, parseFile } = require('./parser')
const path = require('path')

const UNIFY_TAGS = {
  // Layout
  App: 'div', Page: 'section', Section: 'section', Container: 'div',
  Grid: 'div', Flex: 'div', Row: 'div', Col: 'div', Stack: 'div',
  Center: 'div', Wrapper: 'div', Main: 'main', Aside: 'aside',
  Article: 'article', Header: 'h1', Footer: 'footer', Nav: 'nav',
  Sidebar: 'aside', Hero: 'section', Feature: 'div', Div: 'div', Span: 'span',
  Box: 'div', Group: 'div', Cluster: 'div',

  // Typography
  H1: 'h1', H2: 'h2', H3: 'h3', H4: 'h4', H5: 'h5', H6: 'h6',
  Text: 'p', P: 'p', Lead: 'p', Strong: 'strong', Em: 'em',
  Small: 'small', Mark: 'mark', Code: 'code', Pre: 'pre',
  Blockquote: 'blockquote', Kbd: 'kbd', Abbr: 'abbr', Sub: 'sub', Sup: 'sup',
  Cite: 'cite', Dfn: 'dfn', Var: 'var', Samp: 'samp', Dl: 'dl', Dt: 'dt', Dd: 'dd',
  B: 'b', I: 'i', U: 'u', S: 's', Ins: 'ins', Del: 'del',
  Bdi: 'bdi', Bdo: 'bdo', Rb: 'rb', Rt: 'rt', Rp: 'rp', Rw: 'span',
  Wbr: 'wbr', Br: 'br', Hr: 'hr', Nbsp: 'span',

  // Forms
  Form: 'form', Label: 'label', Input: 'input', Textarea: 'textarea',
  Select: 'select', Option: 'option', Optgroup: 'optgroup',
  Fieldset: 'fieldset', Legend: 'legend', Datalist: 'datalist',
  Button: 'button', Output: 'output', Meter: 'meter', Progress: 'progress',
  Keygen: 'keygen',

  // Data display
  Card: 'div', Table: 'table', Thead: 'thead', Tbody: 'tbody',
  Tfoot: 'tfoot', Tr: 'tr', Th: 'th', Td: 'td', Colgroup: 'colgroup', Col: 'col',
  Caption: 'caption',
  List: 'ul', Ul: 'ul', Ol: 'ol', Li: 'li',
  Details: 'details', Summary: 'summary', Dialog: 'dialog',
  Badge: 'span', Avatar: 'div', Chip: 'span',

  // Feedback
  Alert: 'div', Toast: 'div', Modal: 'div', Tooltip: 'div',
  Popover: 'div', Spinner: 'div', Skeleton: 'div', ProgressBar: 'div',

  // Navigation
  Link: 'a', A: 'a', Breadcrumb: 'nav', Pagination: 'nav',
  Tabs: 'div', Tab: 'button', TabPanel: 'div',
  Menu: 'nav', Menuitem: 'a', Dropdown: 'div',

  // Interactive
  FloatingButton: 'button', BackToTop: 'button',
  Accordion: 'div', AccordionItem: 'details',
  Carousel: 'div', CarouselItem: 'div',

  // Media
  Image: 'img', Img: 'img', Figure: 'figure', Figcaption: 'figcaption',
  Video: 'video', Audio: 'audio', Iframe: 'iframe',
  Icon: 'span', Svg: 'div', Picture: 'picture', Source: 'source',
  Track: 'track', Canvas: 'canvas', Map: 'map', Area: 'area',

  // Semantic
  Address: 'address', Time: 'time', Data: 'data',
  Ruby: 'ruby', Rt: 'rt', Rp: 'rp',

  // Table variants
  Td: 'td', Th: 'th', Tr: 'tr', Thead: 'thead', Tbody: 'tbody', Tfoot: 'tfoot',

  // Embedded
  Embed: 'embed', Object: 'object', Param: 'param',

  // Scripting
  Script: 'script', Noscript: 'noscript', Template: 'template', Slot: 'slot',

  // Utility
  Spacer: 'div', Divider: 'hr',
  Html: 'div', Head: 'div', Body: 'div',
  Style: 'style', Meta: 'meta', Title: 'title',
  Fragment: 'div', Portal: 'div'
}

const UNIFY_BUILTINS = [
  'ThemeToggle', 'LanguageToggle', 'FloatingButton', 'BackToTop',
  'Toast', 'Accordion', 'AccordionItem', 'Tabs', 'Tab', 'TabPanel',
  'Modal', 'Tooltip', 'Alert', 'ProgressBar', 'Chip', 'Badge', 'Avatar',
  'For', 'Show', 'ErrorBoundary', 'LazyLoad', 'Icon',
  'Signal', 'Store', 'Computed', 'Effect', 'ErrorPage', 'Plugin', 'Form',
  'Import', 'ImportCss', 'ImportJs', 'RenderToString', 'DbStore'
]

const NEU_CLASSES = {
  // Layout
  Page: 'brut-page', Section: 'brut-section', Container: 'brut-container',
  Grid: 'brut-grid', Flex: 'brut-flex', Row: 'brut-row', Col: 'brut-col',
  Stack: 'brut-stack', Center: 'brut-center', Wrapper: 'brut-wrapper',
  Card: 'brut-card', Nav: 'brut-nav', Sidebar: 'brut-sidebar',
  Hero: 'brut-hero', Feature: 'brut-feature', Box: 'brut-box',
  Aside: 'brut-aside', Article: 'brut-article', Main: 'brut-main',

  // Typography
  H1: 'brut-h1', H2: 'brut-h2', H3: 'brut-h3', H4: 'brut-h4', H5: 'brut-h5', H6: 'brut-h6',
  Text: 'brut-text', P: 'brut-text', Lead: 'brut-lead',
  Strong: 'brut-strong', Em: 'brut-em', Small: 'brut-small', Mark: 'brut-mark',
  Code: 'brut-code', Pre: 'brut-pre', Blockquote: 'brut-blockquote', Kbd: 'brut-kbd',

  // Forms
  Button: 'brut-button', Input: 'brut-input', Textarea: 'brut-textarea',
  Select: 'brut-select', Label: 'brut-label', Fieldset: 'brut-fieldset',
  Legend: 'brut-legend', Output: 'brut-output', Progress: 'brut-progress',
  Meter: 'brut-meter',

  // Data display
  Table: 'brut-table', Badge: 'brut-badge', Avatar: 'brut-avatar',
  Chip: 'brut-chip', Details: 'brut-details', Summary: 'brut-summary',
  List: 'brut-list', Ul: 'brut-list', Ol: 'brut-list', Dl: 'brut-list',

  // Feedback
  Alert: 'brut-alert', Toast: 'brut-toast', Modal: 'brut-modal',
  Tooltip: 'brut-tooltip', Popover: 'brut-popover', Spinner: 'brut-spinner',
  Skeleton: 'brut-skeleton', ProgressBar: 'brut-progress-bar',

  // Navigation
  Link: 'brut-link', A: 'brut-link', Breadcrumb: 'brut-breadcrumb',
  Pagination: 'brut-pagination', Tabs: 'brut-tabs', Tab: 'brut-tab',
  TabPanel: 'brut-tab-panel', Menu: 'brut-menu', Dropdown: 'brut-dropdown',

  // Interactive
  FloatingButton: 'brut-fab', BackToTop: 'brut-back-to-top',
  Accordion: 'brut-accordion', Carousel: 'brut-carousel',

  // Media
  Image: 'brut-image', Img: 'brut-image', Figure: 'brut-figure',
  Video: 'brut-video', Iframe: 'brut-iframe', Icon: 'brut-icon',
  Audio: 'brut-audio', Canvas: 'brut-canvas',

  // Utility
  Spacer: 'brut-spacer', Divider: 'brut-divider', Hr: 'brut-divider',
  Kbd: 'brut-kbd', Code: 'brut-code', Pre: 'brut-pre'
}

const COMPONENT_LAYOUT_MAP = {
  Stack: { display: 'flex', flexDirection: 'column', gap: 'var(--neu-gap, 1rem)' },
  Flex: { display: 'flex', flexWrap: 'wrap', gap: 'var(--neu-gap, 1rem)' },
  Row: { display: 'flex', flexWrap: 'wrap', margin: '0 -0.5rem' },
  Col: { flex: '1 1 0%', padding: '0 0.5rem' },
  Grid: { display: 'grid', gap: 'var(--neu-gap, 1rem)', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' },
  Center: { display: 'flex', alignItems: 'center', justifyContent: 'center' },
  Container: { maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' },
  Wrapper: { maxWidth: '960px', margin: '0 auto', padding: '0 1rem' }
}

const COMPONENT_VARIANTS = {
  Alert: { info: 'brut-alert--info', success: 'brut-alert--success', warning: 'brut-alert--warning', danger: 'brut-alert--danger' },
  Badge: { info: 'brut-badge--info', success: 'brut-badge--success', warning: 'brut-badge--warning', danger: 'brut-badge--danger' },
  Button: { primary: 'brut-button--primary', secondary: 'brut-button--secondary', success: 'brut-button--success', outline: 'brut-button--outline', ghost: 'brut-button--ghost', sm: 'brut-button--sm', lg: 'brut-button--lg' },
  Card: { hover: 'brut-card--hover', flat: 'brut-card--flat', pressed: 'brut-card--pressed' },
  Spinner: { sm: 'brut-spinner--sm', lg: 'brut-spinner--lg' },
  Input: { sm: 'brut-input--sm', lg: 'brut-input--lg', error: 'brut-input--error' },
  Text: { muted: 'brut-text--muted', accent: 'brut-text--accent' },
  Select: { sm: 'brut-select--sm', lg: 'brut-select--lg', error: 'brut-select--error' },
  Textarea: { sm: 'brut-textarea--sm', lg: 'brut-textarea--lg', error: 'brut-textarea--error' },
  Badge: { sm: 'brut-badge--sm', lg: 'brut-badge--lg', dot: 'brut-badge--dot' },
  Alert: { sm: 'brut-alert--sm', lg: 'brut-alert--lg' },
  Modal: { sm: 'brut-modal--sm', lg: 'brut-modal--lg', fullscreen: 'brut-modal--fullscreen' },
  Card: { sm: 'brut-card--sm', lg: 'brut-card--lg', hover: 'brut-card--hover', flat: 'brut-card--flat', pressed: 'brut-card--pressed' },
  Toast: { 'top-right': 'brut-toast--top-right', 'top-left': 'brut-toast--top-left', 'bottom-right': 'brut-toast--bottom-right', 'bottom-left': 'brut-toast--bottom-left' },
  ProgressBar: { sm: 'brut-progress--sm', lg: 'brut-progress--lg', striped: 'brut-progress--striped', animated: 'brut-progress--animated' },
  Tabs: { bordered: 'brut-tabs--bordered', padded: 'brut-tabs--padded' }
}

function compileAST(node, ctx = { indent: 0 }) {
  const indent = '  '.repeat(ctx.indent)

  if (node.type === 'string') return JSON.stringify(node.value)
  if (node.type === 'number') return String(node.value)
  if (node.type === 'bool') return node.value ? 'true' : 'false'
  if (node.type === 'null') return 'null'
  if (node.type === 'ident') return node.value

  if (node.type === 'program') {
    return node.children.map(c => compileAST(c, ctx)).join('\n\n')
  }

  if (node.type === 'object') {
    const rawTag = node.name || 'div'
    const tag = UNIFY_TAGS[rawTag] || rawTag

    if (UNIFY_BUILTINS.includes(rawTag)) {
      return compileBuiltin(rawTag, node, indent)
    }

    if (rawTag === 'Html' || rawTag === 'Head' || rawTag === 'Body') {
      return compileAST({ ...node, name: 'div' }, ctx)
    }

    const propsList = []
    const childrenList = []
    const events = []
    let condExpr = null
    let loopItems = null
    let loopAs = null
    let loopKey = null

    for (const [key, val] of Object.entries(node.props)) {
      if (val.type === 'event') {
        events.push({ key, handler: val.value })
      } else if (key === 'text' || key === 'content') {
        childrenList.push(val)
      } else if (key === 'if') {
        condExpr = val.type === 'ident' || val.type === 'string' ? val.value : compileAST(val, { indent: ctx.indent + 1 })
      } else if (key === 'each') {
        loopItems = val.type === 'ident' || val.type === 'string' ? val.value : compileAST(val, { indent: ctx.indent + 1 })
      } else if (key === 'as') {
        loopAs = val.value || 'item'
      } else if (key === 'key') {
        loopKey = val.type === 'ident' || val.type === 'string' ? val.value : compileAST(val, { indent: ctx.indent + 1 })
      } else {
        propsList.push({ key, val })
      }
    }

    for (const child of node.children) {
      if (child.name === 'Html') {
        const raw = child.props.content || child.props.value
        if (raw) childrenList.push({ type: 'rawHtml', value: raw.value || raw })
      } else if (child.name === 'Script' || child.name === 'script') {
        childrenList.push({ type: 'rawScript', value: child.props.content?.value || child.props.src?.value })
      } else if (child.name === 'Style' || child.name === 'style') {
        childrenList.push({ type: 'rawStyle', value: child.props.content?.value || child.props.text?.value })
      } else {
        const compiled = compileAST(child, { indent: ctx.indent + 1 })
        childrenList.push({ type: 'compiled', value: compiled })
      }
    }

    let code = `${indent}unify.createElement('${tag}', {\n`
    const propLines = []
    let hasClass = false

    for (const p of propsList) {
      if (p.key === 'className' || p.key === 'class') {
        hasClass = true
        const val = compileAST(p.val, { indent: ctx.indent + 2 })
        propLines.push(`${indent}  className: ${val}`)
      } else if (p.key === 'style') {
        const val = compileAST(p.val, { indent: ctx.indent + 2 })
        propLines.push(`${indent}  style: ${val}`)
      } else if (p.key === 'html') {
        childrenList.push({ type: 'rawHtml', value: p.val.value || p.val })
      } else {
        propLines.push(`${indent}  ${p.key}: ${compileAST(p.val, { indent: ctx.indent + 2 })}`)
      }
    }

    if (events.length > 0) {
      for (const e of events) {
        propLines.push(`${indent}  on${e.key.charAt(0).toUpperCase() + e.key.slice(1)}: ${e.handler}`)
      }
    }

    const neuClass = NEU_CLASSES[rawTag]
    if (neuClass) {
      const variantKey = node.props.variant?.value || node.props.variant?.value
      const variantClass = getVariantClass(rawTag, variantKey, neuClass)
      const existingIdx = propLines.findIndex(p => p.includes('className:'))
      const classVal = variantClass || neuClass
      if (existingIdx !== -1) {
        const line = propLines[existingIdx]
        const match = line.match(/(\s*className:\s*)(.*)/)
        if (match) {
          const existingVal = match[2].trim().replace(/;$/, '')
          propLines[existingIdx] = `${indent}  className: ${existingVal} + " ${classVal}"`
        }
      } else {
        propLines.push(`${indent}  className: "${classVal}"`)
      }
      hasClass = true
    }

    const layoutStyles = COMPONENT_LAYOUT_MAP[rawTag]
    if (layoutStyles) {
      const existingStyleIdx = propLines.findIndex(p => p.includes('style:'))
      const styleStr = JSON.stringify(layoutStyles)
      if (existingStyleIdx !== -1) {
        const line = propLines[existingStyleIdx]
        const match = line.match(/(\s*style:\s*)(.*)/)
        if (match) {
          const existingVal = match[2].trim().replace(/;$/, '')
          propLines[existingIdx || existingStyleIdx] = `${indent}  style: Object.assign({}, ${existingVal}, ${styleStr})`
        }
      } else {
        propLines.push(`${indent}  style: ${styleStr}`)
      }
    }

    code += propLines.join(',\n')
    code += `\n${indent}}, [\n`

    code += childrenList.map(c => {
      if (c.type === 'compiled') return c.value
      if (c.type === 'rawHtml') return `${indent}  unify.html(${JSON.stringify(c.value)})`
      if (c.type === 'rawScript') return `${indent}  unify.script(${JSON.stringify(c.value)})`
      if (c.type === 'rawStyle') return `${indent}  unify.style(${JSON.stringify(c.value)})`
      return `${indent}  ${compileAST(c, { indent: ctx.indent + 2 })}`
    }).join(',\n')

    code += `\n${indent}])\n`

    if (condExpr) {
      code = `${indent}unify.cond(${condExpr}, () => ${code.replace(/\n$/, '')})\n`
    }

    if (loopItems) {
      const loopVar = loopAs || 'item'
      const keyExpr = loopKey ? loopKey : 'null'
      code = `${indent}unify.each(${loopItems}, (${loopVar}, index) => ${code.replace(/\n$/, '')}, { key: ${keyExpr} })\n`
    }

    return code
  }

  return ''
}

function getVariantClass(rawTag, variantKey, baseClass) {
  if (!variantKey) return null
  const variants = COMPONENT_VARIANTS[rawTag]
  if (!variants) return null
  const variant = variants[variantKey]
  if (!variant) return null
  return `${baseClass} ${variant}`
}

function compileBuiltin(rawTag, node, indent) {
  const props = node.props || {}
  const children = node.children || []

  switch (rawTag) {
    case 'ThemeToggle':
      return `${indent}unify.createToggle((window.__theme === "dark" ? "D" : "L"), toggleTheme)\n`

    case 'LanguageToggle':
      return `${indent}unify.createToggle((window.__lang || "en").toUpperCase(), toggleLanguage)\n`

    case 'FloatingButton':
      return compileBuiltinButton('neu-fab', props, children, indent)

    case 'BackToTop':
      return `${indent}unify.createBackToTop()\n`

    case 'Toast':
      return compileBuiltinToast(props, indent)

    case 'Modal':
      return compileBuiltinModal(props, children, indent)

    case 'Accordion':
      return compileBuiltinAccordion(props, children, indent)

    case 'Tabs':
      return compileBuiltinTabs(props, children, indent)

    case 'Alert':
      return compileBuiltinAlert(props, children, indent)

    case 'ProgressBar':
      return compileBuiltinProgress(props, indent)

    case 'Icon':
      return compileBuiltinIcon(props, indent)

    case 'Badge':
      return compileBuiltinBadge(props, children, indent)

    case 'Chip':
      return compileBuiltinChip(props, children, indent)

    case 'Avatar':
      return compileBuiltinAvatar(props, indent)

    case 'For':
      return compileBuiltinFor(node, indent)

    case 'Show':
      return compileBuiltinShow(node, indent)

    case 'ErrorBoundary':
      return compileBuiltinErrorBoundary(node, indent)

    case 'LazyLoad':
      return compileBuiltinLazyLoad(node, indent)

    case 'Signal': {
      const name = node.props.name?.value || null
      const initial = node.props.initial || node.props.default || node.props.value || 'null'
      const initRaw = toRaw(initial, 'null')
      if (name) {
        return `${indent}var __sig_${name} = unify.createSignal(${initRaw});\n${indent}unify.bind(__sig_${name}, document.getElementById('app'))\n`
      }
      return `${indent}unify.createSignal(${initRaw})\n`
    }

    case 'Store': {
      const name = node.props.name?.value || null
      const initial = node.props.initial || node.props.data || node.props.value || '{}'
      const initRaw = toRaw(initial, '{}')
      if (name) {
        return `${indent}var __store_${name} = unify.createStore(${initRaw});\n`
      }
      return `${indent}unify.createStore(${initRaw})\n`
    }

    case 'Computed': {
      const deps = node.props.deps || node.props.watch || node.props.dependsOn || '[]'
      const fn = node.props.fn || node.props.get || (node.children.length ? node.children.map(c => compileAST(c, { indent: indent + 1 })).join(',\n') : '() => null')
      const depsRaw = toRaw(deps, '[]')
      return `${indent}unify.computed(function() { return ${fn} }, ${depsRaw})\n`
    }

    case 'Effect': {
      const run = node.props.run || node.props.fn || (node.children.length ? node.children.map(c => compileAST(c, { indent: indent + 1 })).join(';\n') : 'function() {}')
      return `${indent}unify.effect(function() { ${run} })\n`
    }

    case 'ErrorPage': {
      const code = node.props.code?.value || 500
      const message = node.props.message?.value || null
      const desc = node.props.description || node.props.desc?.value || null
      const retry = node.props.retry?.value !== false
      const home = node.props.home?.value !== false
      return `${indent}unify.errorPage({ code: ${code}, message: ${message ? JSON.stringify(message) : 'null'}, description: ${desc ? JSON.stringify(desc) : 'null'}, retry: ${retry}, home: ${home} })\n`
    }

    case 'Plugin': {
      const name = node.props.name?.value || 'unnamed'
      const onMount = node.props.onMount?.value || null
      const onUpdate = node.props.onUpdate?.value || null
      const onDestroy = node.props.onDestroy?.value || null
      return `${indent}unify.plugin(${JSON.stringify(name)}, { onMount: ${onMount || 'null'}, onUpdate: ${onUpdate || 'null'}, onDestroy: ${onDestroy || 'null'} })\n`
    }

    case 'Form': {
      const formId = node.props.id?.value || node.props.name?.value || 'form'
      const rulesRaw = node.props.rules?.value || null
      return `${indent}unify.createForm(document.querySelector('#${formId}'), ${rulesRaw ? JSON.stringify(rulesRaw) : '{}'}, { showErrors: true })\n`
    }

    case 'Import': {
      const url = node.props.url?.value || node.props.src?.value || node.props.from?.value || ''
      const type = node.props.type?.value || 'js'
      if (!url) return `${indent}null\n`
      return `${indent}unify.importFile(${JSON.stringify(url)}, ${JSON.stringify(type)})\n`
    }

    case 'ImportCss': {
      const url = node.props.url?.value || node.props.src?.value || ''
      if (!url) return `${indent}null\n`
      return `${indent}unify.importCss(${JSON.stringify(url)})\n`
    }

    case 'ImportJs': {
      const url = node.props.url?.value || node.props.src?.value || ''
      if (!url) return `${indent}null\n`
      return `${indent}unify.importJs(${JSON.stringify(url)})\n`
    }

    case 'RenderToString': {
      const childrenCode = node.children.map(c => compileAST(c, { indent: indent + 1 })).join(',\n')
      return `${indent}unify.renderToString([\n${childrenCode}\n${indent}])\n`
    }

    case 'DbStore': {
      const name = node.props.name?.value || 'default'
      const initial = node.props.initial || node.props.data || node.props.value || '{}'
      const persist = node.props.persist?.value !== false
      const initRaw = toRaw(initial, '{}')
      var code = `${indent}unify.db.createStore(${JSON.stringify(name)}, ${initRaw})`
      if (persist) code = `${indent}unify.db.persistTo(unify.db.createStore(${JSON.stringify(name)}, ${initRaw}), ${JSON.stringify('unify-db-' + name)})`
      return code + '\n'
    }

    default:
      return `${indent}unify.createElement('div', {}, [])\n`
  }
}

function compileBuiltinButton(className, props, children, indent) {
  const propLines = []
  const eventLines = []
  const childItems = []
  let hasClass = false

  for (const [key, val] of Object.entries(props)) {
    if (val.type === 'event') {
      eventLines.push(`${indent}  on${key.charAt(0).toUpperCase() + key.slice(1)}: ${val.value}`)
    } else if (key === 'text' || key === 'content') {
      childItems.push(val)
    } else if (key === 'className' || key === 'class') {
      hasClass = true
      const v = typeof val === 'object' ? JSON.stringify(val.value) : val
      propLines.push(`${indent}  className: ${v} + " ${className}"`)
    } else if (key === 'style') {
      propLines.push(`${indent}  style: ${JSON.stringify(val.value)}`)
    } else {
      propLines.push(`${indent}  ${key}: ${typeof val === 'object' ? JSON.stringify(val.value) : val}`)
    }
  }

  if (!hasClass) {
    propLines.unshift(`${indent}  className: "${className}"`)
  }

  for (const child of children) {
    childItems.push({ type: 'compiled', value: `${indent}  unify.createElement('div', {}, [])` })
  }

  const code = `${indent}unify.createElement('button', {\n${propLines.join(',\n')}\n${eventLines.length ? ',\n' + eventLines.join(',\n') : ''}\n${indent}}, [\n${childItems.map(() => `${indent}  unify.fragment([])`).join(',\n')}\n${indent}])\n`

  if (childItems.length === 0) {
    return `${indent}unify.createElement('button', {\n${propLines.join(',\n')}${eventLines.length ? ',\n' + eventLines.join(',\n') : ''}\n${indent}}, [])\n`
  }

  return code
}

function toRaw(val, fallback) {
  if (val == null) return fallback != null ? JSON.stringify(fallback) : 'null'
  if (val.type === 'string') return JSON.stringify(val.value)
  if (val.type === 'ident') return val.value
  if (val.type === 'number') return String(val.value)
  if (val.type === 'bool') return val.value ? 'true' : 'false'
  if (val.type === 'null') return 'null'
  return JSON.stringify(val.value)
}

function compileBuiltinToast(props, indent) {
  const message = props.message || props.text
  const variant = props.variant
  const duration = props.duration
  const icon = props.icon
  const persistent = props.persistent
  const dismissible = props.dismissible
  const position = props.position
  const actionText = props.action
  const actionFn = props.onAction
  const messageRaw = toRaw(message, '')
  const variantRaw = toRaw(variant, 'info')
  const durationRaw = toRaw(duration, 3000)
  let optsParts = []
  if (variant) optsParts.push('variant: ' + variantRaw)
  if (duration || duration === undefined) optsParts.push('duration: ' + durationRaw)
  if (icon) optsParts.push('icon: ' + toRaw(icon))
  if (persistent) optsParts.push('persistent: true')
  if (dismissible === false) optsParts.push('dismissible: false')
  if (position) optsParts.push('position: ' + toRaw(position))
  if (actionText || actionFn) {
    let handler = actionFn ? toRaw(actionFn) : 'function(e) { /* action */ }'
    optsParts.push('action: { text: ' + toRaw(actionText || 'OK') + ', handler: ' + handler + ' }')
  }
  const optsStr = optsParts.length ? '{ ' + optsParts.join(', ') + ' }' : '{}'
  return `${indent}unify.createToast(${messageRaw}, ${optsStr})\n`
}

function compileBuiltinModal(props, children, indent) {
  const title = toRaw(props.title, '')
  const open = props.open?.value !== false
  const childCode = children.map(c => compileAST(c, { indent: indent + 1 })).join(',\n')
  return `${indent}unify.createModal(${title}, [\n${childCode}\n${indent}], { open: ${open} })\n`
}

function compileBuiltinAccordion(props, children, indent) {
  const items = children.map((child, i) => {
    const title = child.props?.title || child.props?.header
    const titleRaw = title ? toRaw(title) : JSON.stringify('Item ' + (i + 1))
    const inner = (child.children || []).map(c => compileAST(c, { indent: indent + 2 })).join(',\n')
    return '{ title: ' + titleRaw + ', content: [\n' + inner + '\n' + indent + '  ] }'
  }).join(',\n')
  return indent + "unify.createAccordion([\n" + items + "\n" + indent + "])\n"
}

function compileBuiltinTabs(props, children, indent) {
  const tabs = children.map((child, i) => {
    const label = child.props?.label || child.props?.title
    const labelRaw = label ? toRaw(label) : JSON.stringify('Tab ' + (i + 1))
    const inner = (child.children || []).map(c => compileAST(c, { indent: indent + 2 })).join(',\n')
    return '{ label: ' + labelRaw + ', content: [\n' + inner + '\n' + indent + '  ] }'
  }).join(',\n')
  return indent + 'unify.createTabs([\n' + tabs + '\n' + indent + '])\n'
}

function compileBuiltinAlert(props, children, indent) {
  const variantRaw = toRaw(props.variant, 'info')
  const message = props.message || props.text
  const dismissible = props.dismissible?.value !== false
  const childCode = children.map(c => compileAST(c, { indent: indent + 1 })).join(',\n')
  if (message) {
    const msgRaw = toRaw(message, '')
    return indent + 'unify.createAlert(' + msgRaw + ', { variant: ' + variantRaw + ', dismissible: ' + dismissible + ' })\n'
  }
  return indent + 'unify.createAlert([\n' + childCode + '\n' + indent + '], { variant: ' + variantRaw + ', dismissible: ' + dismissible + ' })\n'
}

function compileBuiltinProgress(props, indent) {
  const valueRaw = toRaw(props.value, 0)
  const maxRaw = toRaw(props.max, 100)
  const labelRaw = toRaw(props.label, '')
  return indent + 'unify.createProgressBar(' + valueRaw + ', ' + maxRaw + ', ' + labelRaw + ')\n'
}

function compileBuiltinIcon(props, indent) {
  const name = props.name?.value || props.name || ''
  const size = props.size?.value || 20
  const strokeWidth = props.strokeWidth?.value || props['stroke-width']?.value || 2.5
  const color = props.color?.value || 'currentColor'
  const className = props.className?.value || ''
  return `${indent}unify.icon(${JSON.stringify(name)}, { size: ${size}, 'stroke-width': ${strokeWidth}, color: ${JSON.stringify(color)}, class: ${JSON.stringify(className || 'brut-icon')} })\n`
}

function compileBuiltinBadge(props, children, indent) {
  const variantRaw = toRaw(props.variant, 'info')
  const text = props.text
  if (text) {
    return indent + 'unify.createBadge(' + toRaw(text, '') + ', { variant: ' + variantRaw + ' })\n'
  }
  return indent + "unify.createBadge('', { variant: " + variantRaw + ' })\n'
}

function compileBuiltinChip(props, children, indent) {
  const text = props.text
  const closable = props.closable?.value !== false
  if (text) {
    const textRaw = toRaw(text, '')
    return indent + 'unify.createChip(' + textRaw + ', { closable: ' + closable + ' })\n'
  }
  return indent + "unify.createElement('span', { className: 'neu-chip' }, [])\n"
}

function compileBuiltinAvatar(props, indent) {
  const srcRaw = toRaw(props.src, '')
  const altRaw = toRaw(props.alt, '')
  const sizeRaw = toRaw(props.size, 'md')
  if (props.src) {
    return indent + 'unify.createAvatar(' + srcRaw + ', ' + altRaw + ', ' + sizeRaw + ')\n'
  }
  return indent + 'unify.createAvatar(' + srcRaw + ', ' + altRaw + ', ' + sizeRaw + ')\n'
}

function compileBuiltinFor(node, indent) {
  const items = node.props.items || node.props.each
  const itemsRaw = items ? toRaw(items) : '[]'
  const key = node.props.key?.value || null
  const as = node.props.as?.value || 'item'
  const childrenCode = node.children.map(c => compileAST(c, { indent: indent + 1 })).join(',\n')
  return indent + 'unify.each(' + itemsRaw + ', (' + as + ', index) => [\n' + childrenCode + '\n' + indent + '], { key: ' + (key ? JSON.stringify(key) : 'null') + ' })\n'
}

function compileBuiltinShow(node, indent) {
  const whenRaw = toRaw(node.props.when || node.props['if'], 'true')
  const childrenCode = node.children.map(c => compileAST(c, { indent: indent + 1 })).join(',\n')
  const elseCode = node.props.fallback ? compileAST(node.props.fallback, { indent: indent + 1 }) : 'null'
  return indent + 'unify.cond(' + whenRaw + ', () => [\n' + childrenCode + '\n' + indent + '], ' + elseCode + ')\n'
}

function compileBuiltinErrorBoundary(node, indent) {
  const fallbackRaw = toRaw(node.props.fallback, 'An error occurred')
  const childrenCode = node.children.map(c => compileAST(c, { indent: indent + 1 })).join(',\n')
  const retry = node.props.retry?.value !== false
  const detail = node.props.detail?.value !== false
  return indent + 'unify.errorBoundary(() => [\n' + childrenCode + '\n' + indent + '], ' + fallbackRaw + ', { retry: ' + retry + ', detail: ' + detail + ' })\n'
}

function compileBuiltinLazyLoad(node, indent) {
  const loadRaw = toRaw(node.props.load, 'null')
  const placeholderRaw = toRaw(node.props.placeholder, null)
  return indent + 'unify.lazyLoad(() => ' + loadRaw + ', ' + placeholderRaw + ')\n'
}

function compileUix(source, options = {}) {
  const parsed = typeof source === 'string' ? parseUix(source) : source
  const { meta, body, rawScript, rawStyle } = parsed
  const componentName = options.name || 'App'

  const metaVars = Object.entries(meta)
    .filter(([k]) => k !== 'name')
    .map(([k, v]) => {
      const val = typeof v === 'string' ? `'${v}'` : v
      return `const _meta_${k} = ${val}`
    }).join('\n')

  const compiledBody = compileAST(body)

  meta.name = componentName

  return {
    code: `// Generated by Unify v0.1.67
${metaVars ? metaVars + '\n' : ''}
function ${componentName}(props = {}) {
  return unify.fragment([
${compiledBody}
  ])
}

${options.exportDefault !== false ? `export default ${componentName}` : ''}
`,
    meta,
    rawScript,
    rawStyle
  }
}

function compileFile(filePath, options = {}) {
  const name = path.basename(filePath, '.uix')
  const parsed = parseFile(filePath)
  return compileUix(parsed, { exportDefault: false, ...options, name })
}

function compileToHTML(compiledCode, meta = {}, config = {}, rawScript = '', rawStyle = '') {
  const title = meta.title || 'Unify App'
  const description = meta.description || 'Built with Unify'
  const lang = meta.lang || 'en'
  const tailwind = config.tailwind || false
  const production = config.production === true || config.mode === 'production'
  const primary = config.theme?.primary || '#7c3aed'
  const secondary = config.theme?.secondary || '#fbbf24'
  const success = config.theme?.success || '#10b981'

  const tailwindLink = tailwind && !production
    ? '<script src="https://cdn.tailwindcss.com"></script>'
    : tailwind && production
      ? '' // <!-- Tailwind not loaded in production: use build step or PostCSS -->
      : ''

  const brutalismStyles = genCSS(primary, secondary, success, config)

  return `<!DOCTYPE html>
<html lang="${lang}" data-theme="light">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta name="description" content="${description}">
  ${tailwindLink}
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet">
  <script src="https://unpkg.com/lucide@latest"></script>
  ${brutalismStyles}
  ${rawStyle ? `<style id="unify-custom">${rawStyle}</style>` : '<style id="unify-custom"></style>'}
</head>
<body>
  <div id="app"></div>
  <script>
    const unify = {}
    unify.fragment = (children) => {
      const el = document.createElement('div')
      el.style.display = 'contents'
      children.forEach(c => { if (c instanceof Node) el.appendChild(c) })
      return el
    }
    unify.html = (str) => {
      const t = document.createElement('template')
      t.innerHTML = str
      return t.content
    }
    unify.script = (str) => { const s = document.createElement('script'); s.textContent = str; return s }
    unify.style = (str) => { const s = document.createElement('style'); s.textContent = str; return s }

    unify.icon = function(name, opts) {
      opts = opts || {}
      if (typeof lucide !== 'undefined' && lucide.createIcons) {
        var el = document.createElement('i')
        el.setAttribute('data-lucide', name)
        if (opts.size) el.setAttribute('width', opts.size)
        if (opts.size) el.setAttribute('height', opts.size)
        if (opts['stroke-width']) el.setAttribute('stroke-width', opts['stroke-width'])
        if (opts.color) el.setAttribute('color', opts.color)
        if (opts['class']) el.className = opts['class']
        else el.className = 'brut-icon'
        lucide.createIcons({ elements: [el] })
        return el
      }
      var fallback = document.createElement('span')
      fallback.className = 'brut-icon'
      fallback.textContent = name.charAt(0).toUpperCase()
      return fallback
    }

    unify.createToggle = (label, toggleFn) => {
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

    unify.createBackToTop = () => {
      const btn = document.createElement('button')
      btn.className = 'brut-back-to-top'
      btn.setAttribute('aria-label', 'Back to top')
      btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m18 15-6-6-6 6"/></svg>'
      btn.style.display = 'none'
      window.addEventListener('scroll', () => {
        btn.style.display = window.scrollY > 300 ? 'flex' : 'none'
      })
      btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }))
      document.body.appendChild(btn)
      return btn
    }

    // ---- Enhanced Toast with Icons ----
    var TOAST_ICONS = { info: 'info', success: 'check-circle', warning: 'alert-triangle', danger: 'x-circle' }
    unify.toastContainer = null
    unify.toastCount = 0
    unify.createToast = (message, opts = {}) => {
      const variant = opts.variant || 'info'
      const duration = opts.duration
      const icon = opts.icon || TOAST_ICONS[variant] || null
      const action = opts.action || null
      const persistent = opts.persistent === true || duration === -1
      const dismissible = opts.dismissible !== false
      const position = opts.position || 'top-right'
      if (!unify.toastContainer) {
        const c = document.createElement('div')
        c.id = 'unify-toast-container'
        c.style.cssText = 'position:fixed;z-index:99999;display:flex;flex-direction:column;gap:0.5rem;pointer-events:none;max-width:420px;width:calc(100% - 2rem)'
        c.setAttribute('data-position', position)
        document.body.appendChild(c)
        unify.toastContainer = c
      }
      unify.toastContainer.setAttribute('data-position', position)
      var positions = {
        'top-right': 'top:1rem;right:1rem;align-items:flex-end',
        'top-left': 'top:1rem;left:1rem;align-items:flex-start',
        'bottom-right': 'bottom:1rem;right:1rem;align-items:flex-end;flex-direction:column-reverse',
        'bottom-left': 'bottom:1rem;left:1rem;align-items:flex-start;flex-direction:column-reverse',
        'top-center': 'top:1rem;left:50%;transform:translateX(-50%);align-items:center'
      }
      unify.toastContainer.style.cssText = 'position:fixed;z-index:99999;display:flex;gap:0.5rem;pointer-events:none;max-width:420px;width:calc(100% - 2rem);' + (positions[position] || positions['top-right'])

      const el = document.createElement('div')
      el.className = 'brut-toast brut-toast--' + variant
      el.style.cssText = 'pointer-events:auto;display:flex;align-items:center;gap:0.5rem;opacity:0;transform:translateX(100%);transition:all 0.3s ease;padding:12px 16px;border-radius:var(--brut-radius-sm,8px);border:var(--brut-border-w,3px) solid var(--brut-border);box-shadow:var(--brut-shadow);font-weight:600'

      if (icon && typeof lucide !== 'undefined') {
        const iconEl = document.createElement('i')
        iconEl.setAttribute('data-lucide', icon)
        iconEl.setAttribute('width', '18')
        iconEl.setAttribute('height', '18')
        iconEl.style.flexShrink = '0'
        lucide.createIcons({ elements: [iconEl] })
        el.appendChild(iconEl)
      } else if (icon) {
        const fallbackIcon = document.createElement('span')
        fallbackIcon.textContent = variant === 'danger' ? '!' : variant === 'success' ? 'OK' : 'i'
        fallbackIcon.style.cssText = 'font-weight:800;font-size:0.8rem;width:18px;height:18px;display:flex;align-items:center;justify-content:center;background:currentColor;border-radius:50%;flex-shrink:0'
        el.appendChild(fallbackIcon)
      }

      const textSpan = document.createElement('span')
      textSpan.style.flex = '1'
      textSpan.textContent = message
      el.appendChild(textSpan)

      if (action) {
        const actionBtn = document.createElement('button')
        actionBtn.textContent = action.text || 'OK'
        actionBtn.style.cssText = 'background:none;border:2px solid currentColor;border-radius:4px;padding:4px 10px;font-weight:700;font-size:0.8rem;cursor:pointer;white-space:nowrap;color:inherit'
        actionBtn.addEventListener('click', function(e) {
          if (typeof action.handler === 'function') action.handler(e, el)
          if (!persistent) { el.remove(); unify.toastCount = Math.max(0, unify.toastCount - 1) }
        })
        el.appendChild(actionBtn)
      }

      if (dismissible && !action) {
        const closeBtn = document.createElement('button')
        closeBtn.innerHTML = 'x'
        closeBtn.style.cssText = 'background:none;border:none;font-size:1.1rem;font-weight:800;cursor:pointer;padding:0 2px;opacity:0.7;line-height:1;color:inherit'
        closeBtn.setAttribute('aria-label', 'Dismiss')
        closeBtn.addEventListener('click', function() { el.remove(); unify.toastCount = Math.max(0, unify.toastCount - 1) })
        el.appendChild(closeBtn)
      }

      // Progress bar for auto-dismiss
      if (!persistent && duration > 0) {
        const progress = document.createElement('div')
        progress.style.cssText = 'position:absolute;bottom:0;left:0;height:3px;background:rgba(255,255,255,0.4);border-radius:0 0 4px 4px;transition:width ' + duration + 'ms linear;width:100%'
        el.style.position = 'relative'
        el.appendChild(progress)
        requestAnimationFrame(function() { progress.style.width = '0%' })
      }

      unify.toastContainer.appendChild(el)
      unify.toastCount++

      // Stack limit
      while (unify.toastContainer.children.length > 5) {
        unify.toastContainer.children[0].remove()
        unify.toastCount = Math.max(0, unify.toastCount - 1)
      }

      requestAnimationFrame(function() {
        el.style.opacity = '1'
        el.style.transform = 'translateX(0)'
      })

      if (!persistent && duration > 0) {
        setTimeout(function() {
          el.style.opacity = '0'
          el.style.transform = 'translateX(100%)'
          setTimeout(function() { if (el.parentNode) { el.remove(); unify.toastCount = Math.max(0, unify.toastCount - 1) } }, 300)
        }, duration)
      }

      return { el, close: function() { el.style.opacity = '0'; el.style.transform = 'translateX(100%)'; setTimeout(function() { if (el.parentNode) { el.remove(); unify.toastCount = Math.max(0, unify.toastCount - 1) } }, 300) } }
    }

    unify.createModal = (title, children, opts = {}) => {
      const open = opts.open !== false
      const overlay = document.createElement('div')
      overlay.className = 'brut-modal-overlay'
      const modal = document.createElement('div')
      modal.className = 'brut-modal'
      if (title) {
        const h = document.createElement('h2')
        h.style.cssText = 'margin:0 0 1rem;font-size:1.5rem;font-weight:800'
        h.textContent = title
        modal.appendChild(h)
      }
      children.forEach(c => { if (c instanceof Node) modal.appendChild(c) })
      overlay.appendChild(modal)
      overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.style.display = 'none' })
      document.body.appendChild(overlay)
      return overlay
    }

    unify.createAccordion = (items) => {
      const container = document.createElement('div')
      container.className = 'brut-accordion'
      items.forEach(item => {
        const details = document.createElement('details')
        details.className = 'brut-accordion-item'
        const summary = document.createElement('summary')
        summary.className = 'brut-accordion-header'
        summary.textContent = item.title
        const body = document.createElement('div')
        body.className = 'brut-accordion-body'
        ;(item.content || []).forEach(c => { if (c instanceof Node) body.appendChild(c) })
        details.appendChild(summary)
        details.appendChild(body)
        container.appendChild(details)
      })
      return container
    }

    unify.createTabs = (items) => {
      const container = document.createElement('div')
      container.className = 'brut-tabs'
      const tabBar = document.createElement('div')
      tabBar.className = 'brut-tab-bar'
      const panels = []
      items.forEach((item, i) => {
        const btn = document.createElement('button')
        btn.className = 'brut-tab' + (i === 0 ? ' brut-tab--active' : '')
        btn.textContent = item.label
        const panel = document.createElement('div')
        panel.className = 'brut-tab-panel' + (i === 0 ? ' brut-tab-panel--active' : '')
        ;(item.content || []).forEach(c => { if (c instanceof Node) panel.appendChild(c) })
        btn.addEventListener('click', () => {
          tabBar.querySelectorAll('.brut-tab').forEach(b => b.classList.remove('brut-tab--active'))
          panels.forEach(p => p.classList.remove('brut-tab-panel--active'))
          btn.classList.add('brut-tab--active')
          panel.classList.add('brut-tab-panel--active')
        })
        tabBar.appendChild(btn)
        panels.push(panel)
        container.appendChild(panel)
      })
      container.insertBefore(tabBar, container.firstChild)
      return container
    }

    unify.createAlert = (message, opts = {}) => {
      const variant = opts.variant || 'info'
      const dismissible = opts.dismissible !== false
      const el = document.createElement('div')
      el.className = 'brut-alert brut-alert--' + variant
      if (typeof message === 'string') { el.textContent = message }
      else if (Array.isArray(message)) { message.forEach(c => { if (c instanceof Node) el.appendChild(c) }) }
      if (dismissible) {
        const close = document.createElement('button')
        close.className = 'brut-alert-close'
        close.textContent = 'X'
        close.style.fontWeight = '800'
        close.addEventListener('click', () => { el.remove() })
        el.appendChild(close)
      }
      return el
    }

    unify.createProgressBar = (value, max, label) => {
      const container = document.createElement('div')
      container.className = 'brut-progress-bar'
      const fill = document.createElement('div')
      fill.className = 'brut-progress-fill'
      fill.style.width = Math.min(100, (value / max) * 100) + '%'
      if (label) container.setAttribute('aria-label', label)
      container.appendChild(fill)
      return container
    }

    unify.createBadge = (text, opts = {}) => {
      const variant = opts.variant || 'info'
      const el = document.createElement('span')
      el.className = 'brut-badge brut-badge--' + variant
      el.textContent = text
      return el
    }

    unify.createChip = (text, opts = {}) => {
      const closable = opts.closable !== false
      const el = document.createElement('span')
      el.className = 'brut-chip'
      el.textContent = text
      if (closable) {
        const close = document.createElement('button')
        close.textContent = 'X'
        close.style.cssText = 'background:none;border:none;cursor:pointer;margin-left:6px;font-size:0.8rem;font-weight:800;color:inherit'
        close.addEventListener('click', () => el.remove())
        el.appendChild(close)
      }
      return el
    }

    unify.createAvatar = (src, alt, size) => {
      const el = document.createElement('div')
      el.className = 'brut-avatar brut-avatar--' + (size || 'md')
      if (src) {
        const img = document.createElement('img')
        img.src = src
        img.alt = alt || ''
        el.appendChild(img)
      } else {
        el.textContent = (alt || '?')[0].toUpperCase()
        el.style.display = 'flex'
        el.style.alignItems = 'center'
        el.style.justifyContent = 'center'
        el.style.fontWeight = '800'
      }
      return el
    }

    // ---- Reactive State Management ----
    unify.createSignal = (initial) => {
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

    unify.computed = (fn, deps) => {
      const signal = unify.createSignal(fn())
      if (deps && deps.length) {
        deps.forEach(d => { if (d && d.subscribe) d.subscribe(() => signal[1](fn())) })
      }
      return signal
    }

    let batchDepth = 0
    let batchQueue = []
    unify.batch = (fn) => {
      batchDepth++
      try { fn() } finally { batchDepth-- }
      if (batchDepth === 0) {
        const q = batchQueue.slice()
        batchQueue = []
        q.forEach(fn => fn())
      }
    }

    unify.effect = (fn) => {
      const run = () => { try { fn() } catch (e) { unify.captureError(e) } }
      run()
      return { dispose: run }
    }

    unify.bind = (signal, element, attr) => {
      if (!element) return
      attr = attr || 'textContent'
      var updateFn = function(val) {
        var v = typeof signal === 'function' ? signal() : val
        if (attr === 'value' && element.tagName === 'INPUT') { element.value = v }
        else if (attr === 'className') { element.className = v }
        else if (attr === 'style') {
          if (typeof v === 'object') Object.assign(element.style, v)
          else element.style.cssText = v
        } else if (attr.startsWith('data-')) { element.setAttribute(attr, v) }
        else { element[attr] = v }
      }
      if (typeof signal === 'function') {
        var s = signal
        updateFn(s())
        s.subscribe && s.subscribe(updateFn)
        return function() { return s }
      }
      var sig = signal
      sig.subscribe && sig.subscribe(updateFn)
      return function() { return sig }
    }

    unify.createStore = (initial) => {
      const state = { ...initial }
      const listeners = new Set()
      const get = (key) => key ? state[key] : { ...state }
      const set = (key, val) => {
        if (typeof key === 'object') { Object.assign(state, key) }
        else { state[key] = val }
        listeners.forEach(fn => fn({ ...state }))
      }
      const subscribe = (fn) => { listeners.add(fn); return () => listeners.delete(fn) }
      return { get, set, subscribe, state }
    }

    unify.reactiveComponent = (renderFn, container) => {
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

    // ---- Conditional & Loop ----
    unify.cond = (condition, renderFn, fallback) => {
      if (condition) {
        const result = typeof renderFn === 'function' ? renderFn() : renderFn
        return result
      }
      if (fallback) return typeof fallback === 'function' ? fallback() : fallback
      return null
    }

    unify.each = (items, renderFn, opts = {}) => {
      if (!items || !items.length) return null
      const key = opts.key || null
      const frag = document.createDocumentFragment()
      items.forEach((item, index) => {
        const result = renderFn(item, index)
        if (result instanceof Node) frag.appendChild(result)
        else if (result instanceof DocumentFragment) frag.appendChild(result)
        else if (Array.isArray(result)) result.forEach(c => { if (c instanceof Node) frag.appendChild(c) })
      })
      return frag
    }

    // ---- Error System ----
    unify.errorLog = []
    unify.errorHandlers = []
    unify.onError = (handler) => { unify.errorHandlers.push(handler); return function() { var i = unify.errorHandlers.indexOf(handler); if (i >= 0) unify.errorHandlers.splice(i, 1) } }
    unify.captureError = (err, context) => {
      var entry = { error: err, message: err.message || String(err), stack: err.stack, context: context || '', timestamp: Date.now() }
      unify.errorLog.push(entry)
      if (unify.errorLog.length > 50) unify.errorLog.shift()
      console.error('[Unify]', context || 'Error:', err)
      unify.errorHandlers.forEach(function(h) { try { h(entry) } catch (e) {} })
      return entry
    }
    unify.reportError = (err, opts) => {
      var entry = unify.captureError(err, opts && opts.context)
      if (opts && opts.silent) return entry
      try {
        unify.createToast(entry.message || 'An error occurred', { variant: 'danger', icon: 'alert-triangle', duration: opts && opts.duration || 5000, dismissible: true, action: opts && opts.detail ? { text: 'Details', handler: function() { alert(err.stack || err.message) } } : null })
      } catch (e) {}
      return entry
    }
    unify.errorPage = (opts) => {
      opts = opts || {}
      var code = opts.code || 500
      var message = opts.message || (code === 404 ? 'Page not found' : 'Something went wrong')
      var description = opts.description || (code === 404 ? "The page you are looking for does not exist." : "An unexpected error occurred. Please try again.")
      var el = document.createElement('div')
      el.style.cssText = 'display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:60vh;text-align:center;padding:2rem'
      var codeEl = document.createElement('div')
      codeEl.textContent = code
      codeEl.style.cssText = 'font-size:5rem;font-weight:900;color:var(--brut-primary);line-height:1;margin-bottom:1rem'
      codeEl.setAttribute('aria-hidden', 'true')
      el.appendChild(codeEl)
      var msgEl = document.createElement('h1')
      msgEl.textContent = message
      msgEl.style.cssText = 'font-size:1.5rem;font-weight:800;margin-bottom:0.5rem;color:var(--brut-text)'
      el.appendChild(msgEl)
      var descEl = document.createElement('p')
      descEl.textContent = description
      descEl.style.cssText = 'color:var(--brut-text-muted);margin-bottom:2rem;max-width:400px'
      el.appendChild(descEl)
      if (opts.retry !== false) {
        var retryBtn = document.createElement('button')
        retryBtn.textContent = opts.retryText || 'Try again'
        retryBtn.className = 'brut-button brut-button--primary'
        retryBtn.addEventListener('click', function() {
          if (typeof opts.onRetry === 'function') opts.onRetry()
          else window.location.reload()
        })
        el.appendChild(retryBtn)
      }
      if (opts.home !== false) {
        var homeLink = document.createElement('a')
        homeLink.textContent = 'Go home'
        homeLink.href = '/'
        homeLink.style.cssText = 'margin-top:1rem;font-weight:700;color:var(--brut-primary)'
        el.appendChild(homeLink)
      }
      return el
    }

    // ---- Enhanced Error Boundary ----
    unify.errorBoundary = (renderFn, fallback, opts) => {
      opts = opts || {}
      try {
        const result = renderFn()
        if (Array.isArray(result)) {
          const frag = document.createDocumentFragment()
          result.forEach(c => { if (c instanceof Node) frag.appendChild(c) })
          return frag
        }
        return result
      } catch (e) {
        unify.captureError(e, 'ErrorBoundary')
        var fallbackMsg = typeof fallback === 'string' ? fallback : (opts.message || 'Something went wrong')
        var el = document.createElement('div')
        el.className = 'brut-alert brut-alert--danger'
        el.style.cssText = 'display:flex;flex-direction:column;align-items:flex-start;gap:0.75rem'

        var headerEl = document.createElement('div')
        headerEl.style.cssText = 'display:flex;align-items:center;gap:0.5rem;font-weight:800;font-size:1rem'
        if (typeof lucide !== 'undefined') {
          var warnIcon = document.createElement('i')
          warnIcon.setAttribute('data-lucide', 'alert-triangle')
          warnIcon.setAttribute('width', '20')
          warnIcon.setAttribute('height', '20')
          lucide.createIcons({ elements: [warnIcon] })
          headerEl.appendChild(warnIcon)
        } else {
          headerEl.textContent = ''
        }
        var headerText = document.createElement('span')
        headerText.textContent = fallbackMsg
        headerEl.appendChild(headerText)
        el.appendChild(headerEl)

        if (opts.detail !== false) {
          var detailEl = document.createElement('details')
          var summaryEl = document.createElement('summary')
          summaryEl.textContent = 'Error details'
          summaryEl.style.cssText = 'cursor:pointer;font-size:0.8rem;opacity:0.7;font-weight:600'
          detailEl.appendChild(summaryEl)
          var stackEl = document.createElement('pre')
          stackEl.textContent = e.stack || e.message || String(e)
          stackEl.style.cssText = 'font-size:0.75rem;margin-top:0.5rem;overflow:auto;max-height:200px;background:rgba(0,0,0,0.1);padding:8px;border-radius:4px'
          detailEl.appendChild(stackEl)
          el.appendChild(detailEl)
        }

        if (opts.retry !== false) {
          var retryBtn = document.createElement('button')
          retryBtn.textContent = 'Retry'
          retryBtn.style.cssText = 'background:none;border:2px solid currentColor;border-radius:4px;padding:4px 12px;font-weight:700;font-size:0.8rem;cursor:pointer;margin-top:0.25rem'
          retryBtn.addEventListener('click', function() {
            var parent = el.parentNode
            if (parent) {
              try {
                var newResult = renderFn()
                if (Array.isArray(newResult)) {
                  var frag = document.createDocumentFragment()
                  newResult.forEach(function(c) { if (c instanceof Node) frag.appendChild(c) })
                  parent.replaceChild(frag, el)
                } else if (newResult instanceof Node) {
                  parent.replaceChild(newResult, el)
                }
              } catch (retryErr) {
                unify.captureError(retryErr, 'ErrorBoundary retry')
              }
            }
          })
          el.appendChild(retryBtn)
        }

        return el
      }
    }

    // ---- Lazy Load ----
    unify.lazyLoad = (loader, placeholder) => {
      const container = document.createElement('div')
      container.className = 'unify-lazy'
      if (placeholder) {
        const ph = document.createElement('div')
        ph.textContent = placeholder
        container.appendChild(ph)
      } else {
        const skeleton = document.createElement('div')
        skeleton.className = 'neu-skeleton neu-skeleton--card'
        container.appendChild(skeleton)
      }
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            observer.disconnect()
            try {
              const result = loader()
              if (result instanceof Promise) {
                result.then(html => { container.innerHTML = ''; container.appendChild(html) })
              } else if (result instanceof Node) {
                container.innerHTML = ''; container.appendChild(result)
              }
            } catch (e) { console.error('LazyLoad error:', e) }
          }
        })
      }, { rootMargin: '200px' })
      observer.observe(container)
      return container
    }

    // ---- API Client ----
    unify.api = (baseUrl) => ({
      get: (path) => fetch(baseUrl + path).then(r => r.json()),
      post: (path, data) => fetch(baseUrl + path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(r => r.json()),
      put: (path, data) => fetch(baseUrl + path, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(r => r.json()),
      delete: (path) => fetch(baseUrl + path, { method: 'DELETE' }).then(r => r.json())
    })

    // ---- Plugin System ----
    unify.plugins = {}
    unify.plugin = (name, hooks) => {
      if (unify.plugins[name]) { console.warn('[Unify] Plugin "' + name + '" already registered'); return }
      unify.plugins[name] = hooks || {}
      if (hooks && hooks.onRegister) hooks.onRegister(unify)
      return { name, unregister: function() { delete unify.plugins[name] } }
    }
    unify.hook = (lifecycle, data) => {
      Object.values(unify.plugins).forEach(function(p) {
        if (typeof p[lifecycle] === 'function') try { p[lifecycle](data) } catch (e) { unify.captureError(e, 'Plugin hook:' + lifecycle) }
      })
    }
    unify.lifecycle = {
      onMount: function(el, data) { unify.hook('onMount', { el: el, data: data || {} }); return el },
      onUpdate: function(el, data) { unify.hook('onUpdate', { el: el, data: data || {} }); return el },
      onDestroy: function(el, data) { unify.hook('onDestroy', { el: el, data: data || {} }); return el }
    }

    // ---- Form Validation (Enhanced) ----
    unify.validate = (form, rules) => {
      unify.hook('beforeValidate', { form: form, rules: rules })
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
      const result = { valid: Object.keys(errors).length === 0, errors, show: function() { unify.showErrors(form, errors) }, clear: function() { unify.clearErrors(form) } }
      Object.entries(errors).forEach(function(f) { var inp = form.querySelector('[name="' + f[0] + '"]'); if (inp) inp.classList.add('brut-input--error') })
      unify.hook('afterValidate', { form: form, rules: rules, result: result })
      return result
    }

    unify.showErrors = (form, errors) => {
      unify.clearErrors(form)
      Object.entries(errors).forEach(function(f) {
        var inp = form.querySelector('[name="' + f[0] + '"]')
        if (inp) {
          var msg = f[1]
          var errEl = document.createElement('div')
          errEl.className = 'brut-form-error'
          errEl.setAttribute('data-error-for', f[0])
          errEl.style.cssText = 'color:var(--brut-danger);font-size:0.75rem;font-weight:700;margin-top:4px;display:flex;align-items:center;gap:4px'
          if (typeof lucide !== 'undefined') {
            var iconEl = document.createElement('i')
            iconEl.setAttribute('data-lucide', 'alert-circle')
            iconEl.setAttribute('width', '14')
            iconEl.setAttribute('height', '14')
            lucide.createIcons({ elements: [iconEl] })
            errEl.appendChild(iconEl)
          }
          var textEl = document.createElement('span')
          textEl.textContent = msg
          errEl.appendChild(textEl)
          inp.parentNode.insertBefore(errEl, inp.nextSibling)
          inp.classList.add('brut-input--error')
        }
      })
    }

    unify.clearErrors = (form) => {
      form.querySelectorAll('.brut-form-error').forEach(function(e) { e.remove() })
      form.querySelectorAll('.brut-input--error').forEach(function(e) { e.classList.remove('brut-input--error') })
    }

    unify.createForm = (form, rules, opts) => {
      opts = opts || {}
      var state = { valid: true, errors: {}, touched: {} }
      var validateField = function(field) {
        var fieldRules = {}
        if (typeof rules === 'object' && rules[field]) fieldRules[field] = rules[field]
        var result = unify.validate(form, fieldRules)
        state.errors = Object.assign(state.errors, result.errors)
        if (!result.valid) { state.valid = false; if (opts.showErrors !== false) unify.showErrors(form, result.errors) }
        return result.valid
      }
      form.querySelectorAll('[name]').forEach(function(inp) {
        var field = inp.getAttribute('name')
        inp.addEventListener('blur', function() { state.touched[field] = true; validateField(field) })
        inp.addEventListener('input', function() {
          if (state.touched[field]) validateField(field)
        })
      })
      return {
        validate: function() {
          state.valid = true; state.errors = {}; unify.clearErrors(form)
          var result = unify.validate(form, rules)
          state.errors = result.errors; state.valid = result.valid
          if (!result.valid && opts.showErrors !== false) result.show()
          return result
        },
        reset: function() { form.reset(); state.errors = {}; state.touched = {}; state.valid = true; unify.clearErrors(form) },
        state: state,
        setValues: function(vals) { Object.entries(vals).forEach(function(e) { var inp = form.querySelector('[name="' + e[0] + '"]'); if (inp) inp.value = e[1] }) },
        getValues: function() { var vals = {}; form.querySelectorAll('[name]').forEach(function(e) { vals[e.getAttribute('name')] = e.value }); return vals }
      }
    }

    // ---- Client-Side Router ----
    unify.router = (routes, opts = {}) => {
      const outlet = document.getElementById(opts.outlet || 'app')
      function navigate(path) {
        const match = routes.find(r => {
          const parts = (typeof r.path === 'string' ? r.path : '').split('/')
          const reqParts = path.split('/')
          if (parts.length !== reqParts.length) return false
          return parts.every((p, i) => p.startsWith(':') || p === reqParts[i])
        })
        if (!match && opts.fallback) match = { render: opts.fallback }
        if (!match) { console.error('No route for', path); return }
        const params = {}
        if (match.path) {
          match.path.split('/').forEach((p, i) => { if (p.startsWith(':')) params[p.slice(1)] = path.split('/')[i] })
        }
        if (match.guard && !match.guard(params)) { if (opts.onDenied) opts.onDenied(); return }
        if (outlet) { outlet.innerHTML = ''; const el = match.render(params); if (el instanceof Node) outlet.appendChild(el) }
        if (opts.updateUrl !== false) history.pushState(null, '', path)
      }
      window.addEventListener('popstate', () => navigate(window.location.pathname))
      return { navigate, current: () => window.location.pathname }
    }

    // ---- SPA Link Handler ----
    function initSPARouter() {
      if (window.location.protocol === 'file:') return
      document.addEventListener('click', function(e) {
        var link = e.target.closest('a[href]')
        if (!link) return
        var href = link.getAttribute('href')
        if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('//') || href.startsWith('mailto:') || href.startsWith('tel:')) return
        var isExternal = link.hasAttribute('target') || link.getAttribute('rel') === 'external'
        if (isExternal) return
        e.preventDefault()
        var path = href.replace(/\/index\.html$/, '/').replace(/\/$/, '') || '/'
        if (window.__spaNavigate) {
          window.__spaNavigate(path)
        } else {
          window.location.href = href
        }
      })
      updateActiveLinks()
    }

    function updateActiveLinks() {
      var current = window.location.pathname.replace(/\/$/, '') || '/'
      document.querySelectorAll('a[href]').forEach(function(a) {
        var h = a.getAttribute('href').replace(/\/$/, '') || '/'
        if (h === current) {
          a.setAttribute('aria-current', 'page')
          a.classList.add('brut-link--active')
        } else {
          a.removeAttribute('aria-current')
          a.classList.remove('brut-link--active')
        }
      })
    }

    // ---- Static SPA Navigation ----
    window.__spaNavigate = function(path) {
      if (window.location.protocol === 'file:') { window.location.href = path; return }
      var prevPath = window.location.pathname
      history.pushState(null, '', path)
      var fetchPath = path === '/' ? 'index.html' : path.replace(/\/$/, '') + '/index.html'
      var app = document.getElementById('app')
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
      app.style.opacity = '1'
      app.style.transform = 'translateY(0)'
      window.location.href = path
    }

    window.addEventListener('popstate', function() {
      var path = window.location.pathname
      window.__spaNavigate(path)
    })

    unify.createElement = (tag, props, children) => {
      props = props || {}; children = children || []
      if (typeof tag === 'function') { return tag({ ...props, children }) }
      const el = document.createElement(tag)
      for (const [key, value] of Object.entries(props)) {
        if (key === 'className') el.className = value
        else if (key.startsWith('on') && typeof value === 'function')
          el.addEventListener(key.slice(2).toLowerCase(), value)
        else if (key === 'style' && typeof value === 'object')
          Object.assign(el.style, value)
        else if (key === 'html') el.innerHTML = value
        else if (key === 'data' && typeof value === 'object')
          for (const [dk, dv] of Object.entries(value)) el.dataset[dk] = dv
        else el.setAttribute(key, String(value))
      }
      for (const child of children) {
        if (child == null || child === false) continue
        if (typeof child === 'string' || typeof child === 'number')
          el.appendChild(document.createTextNode(String(child)))
        else if (child instanceof Node) el.appendChild(child)
        else if (child instanceof DocumentFragment) el.appendChild(child)
        else if (Array.isArray(child))
          child.forEach(c => { if (c instanceof Node) el.appendChild(c); else if (typeof c === 'string') el.appendChild(document.createTextNode(c)) })
      }
      return el
    }

    // ---- Import System ----
    unify.importCache = {}
    unify.importFile = (url, type) => {
      type = type || 'js'
      var cached = unify.importCache[url]
      if (cached) return cached
      return new Promise(function(resolve, reject) {
        if (type === 'css') {
          var link = document.createElement('link')
          link.rel = 'stylesheet'
          link.href = url
          link.onload = function() { resolve(url); unify.importCache[url] = url }
          link.onerror = reject
          document.head.appendChild(link)
        } else if (type === 'module' || url.endsWith('.mjs')) {
          import(url).then(function(m) { unify.importCache[url] = m; resolve(m) }, reject)
        } else {
          var script = document.createElement('script')
          script.src = url
          script.onload = function() { resolve(url); unify.importCache[url] = url }
          script.onerror = reject
          script.defer = true
          document.head.appendChild(script)
        }
      })
    }
    unify.importCss = (url) => unify.importFile(url, 'css')
    unify.importModule = (url) => unify.importFile(url, 'module')
    unify.importJs = (url) => unify.importFile(url, 'js')

    // ---- Server-Side Rendering ----
    unify.renderToString = (component) => {
      if (typeof component === 'string') return component
      if (typeof component === 'number') return String(component)
      if (component == null || component === false) return ''
      if (component instanceof Node) return component.outerHTML || component.textContent || ''
      if (Array.isArray(component)) return component.map(function(c) { return unify.renderToString(c) }).join('')
      if (typeof component === 'function') {
        try {
          var result = component({})
          return unify.renderToString(result)
        } catch (e) { unify.captureError(e, 'renderToString'); return '' }
      }
      return String(component)
    }
    unify.renderToStaticMarkup = (component) => {
      return unify.renderToString(component)
    }

    // ---- Database / Services ----
    unify.db = {
      _stores: {},
      createStore: function(name, initial) {
        var store = unify.createStore(initial || {})
        unify.db._stores[name] = store
        return store
      },
      getStore: function(name) { return unify.db._stores[name] || null },
      persistTo: function(store, key) {
        key = key || 'unify-db-' + (store._name || 'default')
        try {
          var saved = localStorage.getItem(key)
          if (saved) {
            var data = JSON.parse(saved)
            if (data && typeof data === 'object') store.set(data)
          }
        } catch (e) {}
        store.subscribe(function(state) {
          try { localStorage.setItem(key, JSON.stringify(state)) } catch (e) {}
        })
        return store
      },
      fetchJson: function(url, opts) {
        return fetch(url, opts || {}).then(function(r) {
          if (!r.ok) throw new Error('DB fetch failed: ' + r.status)
          return r.json()
        })
      },
      saveToServer: function(url, data, method) {
        method = method || 'POST'
        return fetch(url, { method: method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(function(r) { return r.json() })
      }
    }
    unify.service = function(baseUrl, endpoints) {
      var svc = {}
      endpoints = endpoints || ['get', 'post', 'put', 'delete']
      endpoints.forEach(function(method) {
        svc[method] = function(path, data) {
          var opts = { method: method.toUpperCase(), headers: { 'Content-Type': 'application/json' } }
          if (data) opts.body = JSON.stringify(data)
          return fetch(baseUrl + path, opts).then(function(r) { return r.json() })
        }
      })
      svc.baseUrl = baseUrl
      return svc
    }

    const savedTheme = localStorage.getItem('unify-theme') || 'light'
    document.documentElement.setAttribute('data-theme', savedTheme)
    const savedLang = localStorage.getItem('unify-lang') || 'en'
    document.documentElement.setAttribute('lang', savedLang)
    window.unify = unify
    window.__theme = savedTheme
    window.__lang = savedLang

    function toggleTheme() {
      const cur = document.documentElement.getAttribute('data-theme')
      const next = cur === 'dark' ? 'light' : 'dark'
      document.documentElement.setAttribute('data-theme', next)
      localStorage.setItem('unify-theme', next)
      window.__theme = next
      return next
    }
    function toggleLanguage() {
      const langs = ${JSON.stringify(config.languages || ['en', 'fr', 'es'])}
      const cur = window.__lang || 'en'
      const idx = langs.indexOf(cur)
      const next = langs[(idx + 1) % langs.length]
      document.documentElement.setAttribute('lang', next)
      localStorage.setItem('unify-lang', next)
      window.__lang = next
      return next
    }
    window.toggleTheme = toggleTheme
    window.toggleLanguage = toggleLanguage

    ${compiledCode.replace(/^export\s+default\s+\w+\s*$/m, '')}

    ${rawScript ? `// ---- User script ----\n${rawScript}\n` : ''}

    const app = document.getElementById('app')
    try {
      const el = ${meta.name || 'App'}({})
      if (el instanceof Node) app.appendChild(el)
      if (typeof lucide !== 'undefined') lucide.createIcons()
      initSPARouter()
      unify.hook('onAppReady', { app: app })
      ${config.tailwind ? `if (typeof tailwind !== 'undefined') tailwind.run()` : ''}
    } catch(e) {
      unify.captureError(e, 'App render')
      app.appendChild(unify.errorPage({ code: 500, message: 'Render error', description: e.message || 'Failed to render application', retry: true }))
    }
  </script>
</body>
</html>`
}

function genCSS(primary, secondary, success, config) {
  return `<style>
:root {
  --brut-bg: #f5f3ff;
  --brut-bg-alt: #ede9fe;
  --brut-surface: #ffffff;
  --brut-text: #1e1b4b;
  --brut-text-muted: #6b7280;
  --brut-primary: ${primary};
  --brut-primary-light: #a78bfa;
  --brut-secondary: ${secondary};
  --brut-secondary-dark: #f59e0b;
  --brut-success: ${success};
  --brut-warning: ${secondary};
  --brut-danger: #ef4444;
  --brut-info: ${primary};
  --brut-border: #1e1b4b;
  --brut-border-w: 3px;
  --brut-radius: 12px;
  --brut-radius-sm: 8px;
  --brut-radius-lg: 16px;
  --brut-padding: 16px;
  --brut-gap: 1rem;
  --brut-font: 'Inter', ${config.theme?.font || "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"};
  --brut-mono: 'JetBrains Mono', 'SF Mono', 'Fira Code', monospace;
  --brut-shadow: 6px 6px 0px var(--brut-border);
  --brut-shadow-sm: 4px 4px 0px var(--brut-border);
  --brut-shadow-lg: 10px 10px 0px var(--brut-border);
  --brut-transition: 0.15s ease;
}
[data-theme="dark"] {
  --brut-bg: #0f0d1a;
  --brut-bg-alt: #1a1530;
  --brut-surface: #1e1b4b;
  --brut-text: #e0e7ff;
  --brut-text-muted: #8b8fa3;
  --brut-border: ${primary};
  --brut-primary-light: ${primary};
  --brut-shadow: 6px 6px 0px var(--brut-primary);
  --brut-shadow-sm: 4px 4px 0px var(--brut-primary);
  --brut-shadow-lg: 10px 10px 0px var(--brut-primary);
}
*,*::before,*::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }
body {
  background: var(--brut-bg); color: var(--brut-text);
  font-family: var(--brut-font);
  transition: background var(--brut-transition), color var(--brut-transition);
  min-height: 100vh; line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}
img { max-width: 100%; height: auto; display: block; }
a { color: var(--brut-primary); text-decoration: underline; font-weight: 600; }
a:hover { color: var(--brut-secondary-dark); }
::selection { background: var(--brut-primary); color: #fff; }
:focus-visible { outline: 3px solid var(--brut-primary); outline-offset: 2px; border-radius: 4px; }
::-webkit-scrollbar { width: 10px; }
::-webkit-scrollbar-track { background: var(--brut-bg); border-left: 2px solid var(--brut-border); }
::-webkit-scrollbar-thumb { background: var(--brut-primary); border: 2px solid var(--brut-border); border-radius: 0; }
::-webkit-scrollbar-thumb:hover { background: #6d28d9; }

/* ===== LAYOUT ===== */
.brut-page {
  animation: brutPageIn 0.25s ease;
  max-width: 960px; margin: 0 auto; padding: 24px 16px;
}
.brut-section { padding: 2rem 0; }
.brut-container { max-width: 1200px; margin: 0 auto; padding: 0 1rem; width: 100%; }
.brut-wrapper { max-width: 960px; margin: 0 auto; padding: 0 1rem; width: 100%; }
.brut-grid { display: grid; gap: var(--brut-gap); grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); }
.brut-flex { display: flex; flex-wrap: wrap; gap: var(--brut-gap); }
.brut-row { display: flex; flex-wrap: wrap; margin: 0 -0.5rem; }
.brut-col { flex: 1 1 0%; padding: 0 0.5rem; min-width: 0; }
.brut-stack { display: flex; flex-direction: column; gap: var(--brut-gap); }
.brut-center { display: flex; align-items: center; justify-content: center; }
.brut-sidebar {
  background: var(--brut-surface); border: var(--brut-border-w) solid var(--brut-border);
  border-radius: var(--brut-radius); padding: var(--brut-padding);
  box-shadow: var(--brut-shadow-sm);
}
.brut-hero { padding: 4rem 1rem; text-align: center; }
.brut-feature { text-align: center; padding: 1.5rem; }
.brut-box {
  background: var(--brut-surface); border: var(--brut-border-w) solid var(--brut-border);
  border-radius: var(--brut-radius-sm); padding: var(--brut-padding);
  box-shadow: var(--brut-shadow-sm);
}
.brut-aside { background: var(--brut-bg-alt); border-radius: var(--brut-radius); padding: var(--brut-padding); }
.brut-article { line-height: 1.8; }
.brut-main { min-height: 60vh; }

/* ===== TYPOGRAPHY ===== */
.brut-h1 { font-size: 2.5rem; font-weight: 800; line-height: 1.15; margin-bottom: 0.5em; text-transform: uppercase; letter-spacing: -0.02em; }
.brut-h2 { font-size: 2rem; font-weight: 800; line-height: 1.2; margin-bottom: 0.5em; }
.brut-h3 { font-size: 1.5rem; font-weight: 700; line-height: 1.3; margin-bottom: 0.5em; }
.brut-h4 { font-size: 1.25rem; font-weight: 700; line-height: 1.4; margin-bottom: 0.5em; }
.brut-h5 { font-size: 1.1rem; font-weight: 700; line-height: 1.4; margin-bottom: 0.5em; }
.brut-h6 { font-size: 1rem; font-weight: 700; line-height: 1.5; margin-bottom: 0.5em; }
.brut-text { margin-bottom: 1rem; }
.brut-text--muted { color: var(--brut-text-muted); font-size: 0.9rem; }
.brut-text--accent { color: var(--brut-primary); font-weight: 700; }
.brut-lead { font-size: 1.2rem; font-weight: 400; line-height: 1.7; margin-bottom: 1rem; }
.brut-strong { font-weight: 800; }
.brut-em { font-style: italic; }
.brut-small { font-size: 0.8rem; color: var(--brut-text-muted); }
.brut-mark { background: var(--brut-secondary); color: var(--brut-border); padding: 0.1em 0.3em; border-radius: 4px; font-weight: 600; }
.brut-code { background: var(--brut-bg-alt); border: 2px solid var(--brut-border); padding: 0.2em 0.4em; border-radius: 4px; font-family: var(--brut-mono); font-size: 0.9em; }
.brut-pre { background: var(--brut-bg-alt); border: var(--brut-border-w) solid var(--brut-border); padding: 1rem; border-radius: var(--brut-radius-sm); font-family: var(--brut-mono); font-size: 0.9rem; overflow-x: auto; box-shadow: var(--brut-shadow-sm); }
.brut-blockquote { border-left: 6px solid var(--brut-primary); padding: 1rem 1.5rem; margin: 1rem 0; background: var(--brut-bg-alt); border-radius: 0 var(--brut-radius-sm) var(--brut-radius-sm) 0; font-style: italic; font-weight: 600; box-shadow: var(--brut-shadow-sm); }
.brut-kbd { background: var(--brut-border); color: var(--brut-bg); padding: 0.2em 0.5em; border-radius: 4px; font-family: var(--brut-mono); font-size: 0.85em; font-weight: 700; }

/* ===== FORMS ===== */
.brut-button {
  background: var(--brut-surface); border: var(--brut-border-w) solid var(--brut-border); border-radius: var(--brut-radius-sm);
  padding: 12px 24px; color: var(--brut-text); font-size: 1rem; font-weight: 700; cursor: pointer;
  box-shadow: var(--brut-shadow-sm); transition: all var(--brut-transition);
  display: inline-flex; align-items: center; gap: 0.5rem; line-height: 1;
  text-transform: uppercase; letter-spacing: 0.02em;
}
.brut-button:hover { box-shadow: 6px 6px 0px var(--brut-border); transform: translate(-2px, -2px); }
.brut-button:active { box-shadow: 1px 1px 0px var(--brut-border); transform: translate(3px, 3px); }
.brut-button--primary { background: var(--brut-primary); color: #fff; }
.brut-button--primary:hover { background: #6d28d9; }
.brut-button--secondary { background: var(--brut-secondary); color: var(--brut-border); }
.brut-button--secondary:hover { background: var(--brut-secondary-dark); }
.brut-button--success { background: var(--brut-success); color: #fff; }
.brut-button--outline { background: transparent; border-color: var(--brut-primary); color: var(--brut-primary); }
.brut-button--ghost { background: transparent; box-shadow: none; border-color: transparent; }
.brut-button--ghost:hover { background: var(--brut-bg-alt); box-shadow: none; transform: none; }
.brut-button--sm { padding: 8px 16px; font-size: 0.8rem; border-radius: 6px; }
.brut-button--lg { padding: 16px 32px; font-size: 1.1rem; border-radius: var(--brut-radius-sm); }
.brut-input, .brut-textarea, .brut-select {
  background: var(--brut-surface); border: var(--brut-border-w) solid var(--brut-border); border-radius: var(--brut-radius-sm);
  padding: 12px 16px; color: var(--brut-text); font-size: 1rem; width: 100%; outline: none;
  box-shadow: var(--brut-shadow-sm); transition: all var(--brut-transition); font-family: inherit;
}
.brut-input:focus, .brut-textarea:focus, .brut-select:focus {
  box-shadow: 8px 8px 0px var(--brut-primary); transform: translate(-2px, -2px);
  border-color: var(--brut-primary);
}
.brut-input--sm { padding: 8px 12px; font-size: 0.85rem; }
.brut-input--lg { padding: 16px 20px; font-size: 1.1rem; }
.brut-input--error { border-color: var(--brut-danger); box-shadow: 6px 6px 0px var(--brut-danger); }
.brut-textarea { min-height: 100px; resize: vertical; }
.brut-select { appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%231e1b4b' d='M6 8L1 3h10z'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 12px center; padding-right: 36px; }
.brut-label { display: block; font-weight: 700; margin-bottom: 0.5rem; }
.brut-fieldset { border: var(--brut-border-w) solid var(--brut-border); padding: 1.5rem; border-radius: var(--brut-radius); }
.brut-legend { font-weight: 700; padding: 0 0.5rem; font-size: 1.1rem; }
.brut-output { display: block; padding: 0.5rem 0; font-weight: 700; }
.brut-progress { appearance: none; height: 12px; border-radius: 6px; border: var(--brut-border-w) solid var(--brut-border); width: 100%; background: var(--brut-surface); }
.brut-progress::-webkit-progress-bar { background: var(--brut-surface); border-radius: 6px; }
.brut-progress::-webkit-progress-value { background: var(--brut-primary); border-radius: 4px; }
.brut-progress::-moz-progress-bar { background: var(--brut-primary); border-radius: 4px; }
.brut-meter { appearance: none; height: 12px; border-radius: 6px; border: var(--brut-border-w) solid var(--brut-border); width: 100%; background: var(--brut-surface); }
.brut-meter::-webkit-meter-bar { background: var(--brut-surface); border-radius: 6px; }
.brut-meter::-webkit-meter-optimum-value { background: var(--brut-success); border-radius: 4px; }
.brut-meter::-webkit-meter-suboptimum-value { background: var(--brut-warning); border-radius: 4px; }
.brut-meter::-webkit-meter-even-less-good-value { background: var(--brut-danger); border-radius: 4px; }

/* ===== CARDS ===== */
.brut-card {
  background: var(--brut-surface); border: var(--brut-border-w) solid var(--brut-border);
  border-radius: var(--brut-radius); padding: var(--brut-padding);
  box-shadow: var(--brut-shadow); transition: all var(--brut-transition);
}
.brut-card--hover:hover { box-shadow: 8px 8px 0px var(--brut-border); transform: translate(-2px, -2px); }
.brut-card--flat { box-shadow: none; border-color: var(--brut-text-muted); }
.brut-card--pressed, .brut-card:active { box-shadow: 2px 2px 0px var(--brut-border); transform: translate(4px, 4px); }

/* ===== NAV ===== */
.brut-nav {
  background: var(--brut-surface); border: var(--brut-border-w) solid var(--brut-border);
  border-radius: var(--brut-radius); padding: 12px 24px;
  display: flex; gap: 16px; align-items: center; flex-wrap: wrap;
  box-shadow: var(--brut-shadow-sm);
}
.brut-toggle {
  background: var(--brut-surface); border: var(--brut-border-w) solid var(--brut-border);
  border-radius: var(--brut-radius-sm); width: 44px; height: 44px;
  display: flex; align-items: center; justify-content: center; font-size: 1.2rem; cursor: pointer;
  box-shadow: var(--brut-shadow-sm); transition: all var(--brut-transition); flex-shrink: 0;
}
.brut-toggle:hover { box-shadow: 6px 6px 0px var(--brut-border); transform: translate(-2px, -2px); }
.brut-toggle:active { box-shadow: 1px 1px 0px var(--brut-border); transform: translate(3px, 3px); }
.brut-link { font-weight: 700; cursor: pointer; color: var(--brut-text); text-decoration: none; padding: 4px 8px; border-radius: 4px; transition: all var(--brut-transition); position: relative; }
.brut-link:hover { color: var(--brut-primary); background: var(--brut-bg-alt); text-decoration: none; }
.brut-link--active { color: var(--brut-primary); background: var(--brut-bg-alt); border-bottom: 3px solid var(--brut-primary); }
.brut-breadcrumb { display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap; font-size: 0.9rem; font-weight: 600; }
.brut-breadcrumb a { color: var(--brut-text-muted); text-decoration: none; }
.brut-breadcrumb a:hover { color: var(--brut-primary); text-decoration: underline; }
.brut-breadcrumb span { color: var(--brut-text); font-weight: 800; }
.brut-pagination { display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap; }
.brut-pagination button {
  background: var(--brut-surface); border: var(--brut-border-w) solid var(--brut-border);
  border-radius: var(--brut-radius-sm); padding: 8px 14px;
  color: var(--brut-text); cursor: pointer; font-weight: 700;
  box-shadow: var(--brut-shadow-sm); transition: all var(--brut-transition);
}
.brut-pagination button:hover { box-shadow: 6px 6px 0px var(--brut-border); transform: translate(-1px, -1px); }
.brut-pagination button:active { box-shadow: 1px 1px 0px var(--brut-border); transform: translate(3px, 3px); }
.brut-pagination button.active { background: var(--brut-primary); color: #fff; }
.brut-menu { display: flex; flex-direction: column; gap: 0.25rem; }
.brut-menu a, .brut-menuitem {
  padding: 10px 16px; border-radius: var(--brut-radius-sm); color: var(--brut-text);
  font-weight: 600; text-decoration: none; transition: all var(--brut-transition); cursor: pointer;
}
.brut-menu a:hover, .brut-menuitem:hover { background: var(--brut-bg-alt); border: 2px solid var(--brut-border); }
.brut-dropdown { position: relative; display: inline-block; }
.brut-dropdown-content {
  position: absolute; top: 100%; left: 0; z-index: 100; min-width: 200px;
  background: var(--brut-surface); border: var(--brut-border-w) solid var(--brut-border);
  border-radius: var(--brut-radius-sm); padding: 0.5rem;
  box-shadow: var(--brut-shadow); display: none;
}
.brut-dropdown:hover .brut-dropdown-content { display: block; }

/* ===== TABS ===== */
.brut-tabs { display: flex; flex-direction: column; gap: 0; }
.brut-tab-bar {
  display: flex; gap: 4px; padding: 8px;
  background: var(--brut-bg-alt);
  border: var(--brut-border-w) solid var(--brut-border);
  border-radius: var(--brut-radius) var(--brut-radius) 0 0;
  border-bottom: none;
}
.brut-tab {
  background: transparent; border: 2px solid transparent; padding: 10px 20px; border-radius: 6px;
  color: var(--brut-text-muted); cursor: pointer; font-weight: 700; font-size: 0.9rem;
  transition: all var(--brut-transition);
}
.brut-tab:hover { color: var(--brut-text); background: var(--brut-surface); }
.brut-tab--active { background: var(--brut-surface); color: var(--brut-text); border-color: var(--brut-border); box-shadow: var(--brut-shadow-sm); }
.brut-tab-panel { display: none; padding: var(--brut-padding); background: var(--brut-surface); border: var(--brut-border-w) solid var(--brut-border); border-top: none; border-radius: 0 0 var(--brut-radius) var(--brut-radius); }
.brut-tab-panel--active { display: block; animation: brutFadeIn 0.25s ease; }

/* ===== ACCORDION ===== */
.brut-accordion { display: flex; flex-direction: column; gap: 0.5rem; }
.brut-accordion-item {
  background: var(--brut-surface); border: var(--brut-border-w) solid var(--brut-border);
  border-radius: var(--brut-radius-sm); overflow: hidden;
  box-shadow: var(--brut-shadow-sm);
}
.brut-accordion-header {
  padding: 14px 18px; cursor: pointer; font-weight: 700; list-style: none;
  display: flex; align-items: center; justify-content: space-between; transition: background var(--brut-transition);
}
.brut-accordion-header:hover { background: var(--brut-bg-alt); }
.brut-accordion-header::-webkit-details-marker { display: none; }
.brut-accordion-header::after { content: '+'; font-size: 1.2rem; font-weight: 700; transition: transform var(--brut-transition); }
.brut-accordion-item[open] .brut-accordion-header::after { transform: rotate(45deg); }
.brut-accordion-body { padding: 0 18px 14px; }

/* ===== ALERTS ===== */
.brut-alert {
  padding: 14px 18px; border-radius: var(--brut-radius-sm); margin-bottom: 1rem;
  display: flex; align-items: center; gap: 0.75rem; position: relative;
  border: var(--brut-border-w) solid var(--brut-border);
  font-size: 0.95rem; font-weight: 600;
  box-shadow: var(--brut-shadow-sm);
}
.brut-alert--info { background: var(--brut-bg-alt); border-color: var(--brut-primary); }
.brut-alert--success { background: #d1fae5; border-color: var(--brut-success); color: #065f46; }
.brut-alert--warning { background: #fef3c7; border-color: var(--brut-secondary); color: #92400e; }
.brut-alert--danger { background: #fee2e2; border-color: var(--brut-danger); color: #991b1b; }
.brut-alert-close { background: none; border: none; cursor: pointer; font-size: 1.1rem; margin-left: auto; padding: 0 4px; font-weight: 800; }
[data-theme="dark"] .brut-alert--info { background: #1a1530; }
[data-theme="dark"] .brut-alert--success { background: #064e3b; color: #a7f3d0; }
[data-theme="dark"] .brut-alert--warning { background: #451a03; color: #fde68a; }
[data-theme="dark"] .brut-alert--danger { background: #450a0a; color: #fecaca; }

/* ===== TOAST ===== */
.brut-toast {
  padding: 12px 20px; border-radius: var(--brut-radius-sm);
  border: var(--brut-border-w) solid var(--brut-border); margin-bottom: 0.5rem;
  box-shadow: var(--brut-shadow); font-size: 0.95rem; font-weight: 700;
  opacity: 0; transform: translateX(100%);
  transition: all 0.3s ease; min-width: 280px;
}
.brut-toast--info { background: var(--brut-primary); color: #fff; border-color: var(--brut-border); }
.brut-toast--success { background: var(--brut-success); color: #fff; border-color: #065f46; }
.brut-toast--warning { background: var(--brut-warning); color: var(--brut-border); border-color: #92400e; }
.brut-toast--danger { background: var(--brut-danger); color: #fff; border-color: #991b1b; }

/* ===== FORM ERROR ===== */
.brut-form-error { color: var(--brut-danger); font-size: 0.75rem; font-weight: 700; margin-top: 4px; display: flex; align-items: center; gap: 4px; animation: brutFadeIn 0.2s ease; }
.brut-input--error { border-color: var(--brut-danger) !important; box-shadow: 4px 4px 0px var(--brut-danger) !important; }

/* ===== ERROR PAGE ===== */
.brut-error-page { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 60vh; text-align: center; padding: 2rem; }

/* ===== MODAL ===== */
.brut-modal-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 9998;
  display: flex; align-items: center; justify-content: center; padding: 1rem;
  animation: brutFadeIn 0.2s ease;
}
.brut-modal {
  background: var(--brut-surface); border: var(--brut-border-w) solid var(--brut-border);
  border-radius: var(--brut-radius-lg); padding: 2rem;
  max-width: 560px; width: 100%; max-height: 80vh; overflow-y: auto;
  box-shadow: var(--brut-shadow-lg); animation: brutSlideUp 0.3s ease;
}

/* ===== BADGE ===== */
.brut-badge {
  display: inline-flex; align-items: center; padding: 4px 12px; border-radius: var(--brut-radius-sm);
  font-size: 0.75rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em;
  border: 2px solid var(--brut-border);
}
.brut-badge--info { background: var(--brut-bg-alt); color: var(--brut-primary); }
.brut-badge--success { background: #d1fae5; color: #065f46; border-color: var(--brut-success); }
.brut-badge--warning { background: #fef3c7; color: #92400e; border-color: var(--brut-warning); }
.brut-badge--danger { background: #fee2e2; color: #991b1b; border-color: var(--brut-danger); }

/* ===== CHIP ===== */
.brut-chip {
  display: inline-flex; align-items: center; padding: 4px 12px; border-radius: 20px;
  font-size: 0.85rem; background: var(--brut-bg-alt); font-weight: 600;
  border: 2px solid var(--brut-border);
}

/* ===== AVATAR ===== */
.brut-avatar {
  border-radius: 50%; overflow: hidden; flex-shrink: 0;
  background: var(--brut-primary); color: #fff;
  border: var(--brut-border-w) solid var(--brut-border);
  box-shadow: var(--brut-shadow-sm);
}
.brut-avatar--sm { width: 32px; height: 32px; font-size: 0.8rem; }
.brut-avatar--md { width: 48px; height: 48px; font-size: 1rem; }
.brut-avatar--lg { width: 72px; height: 72px; font-size: 1.5rem; }
.brut-avatar--xl { width: 96px; height: 96px; font-size: 2rem; }

/* ===== PROGRESS BAR ===== */
.brut-progress-bar {
  height: 12px; background: var(--brut-surface);
  border: var(--brut-border-w) solid var(--brut-border);
  border-radius: 6px; overflow: hidden;
  box-shadow: var(--brut-shadow-sm);
}
.brut-progress-fill {
  height: 100%; background: var(--brut-primary);
  transition: width 0.4s ease; min-width: 4px;
}

/* ===== SPINNER ===== */
.brut-spinner {
  width: 32px; height: 32px; border: 4px solid var(--brut-bg-alt);
  border-top-color: var(--brut-primary); border-radius: 50%;
  animation: brutSpin 0.6s linear infinite; margin: 1rem auto;
}
.brut-spinner--sm { width: 20px; height: 20px; border-width: 3px; }
.brut-spinner--lg { width: 48px; height: 48px; border-width: 5px; }

/* ===== SKELETON ===== */
.brut-skeleton {
  background: var(--brut-bg-alt); border-radius: var(--brut-radius-sm);
  border: 2px solid var(--brut-border);
  animation: brutShimmer 1.5s ease-in-out infinite;
  background: linear-gradient(90deg, var(--brut-bg-alt) 25%, var(--brut-surface) 50%, var(--brut-bg-alt) 75%);
  background-size: 200% 100%;
}
.brut-skeleton--text { height: 1em; margin-bottom: 0.5rem; width: 80%; }
.brut-skeleton--title { height: 1.5em; margin-bottom: 0.75rem; width: 60%; }
.brut-skeleton--avatar { width: 48px; height: 48px; border-radius: 50%; }
.brut-skeleton--card { height: 200px; border-radius: var(--brut-radius); }

/* ===== FAB ===== */
.brut-fab {
  position: fixed; bottom: 2rem; right: 2rem; z-index: 1000;
  width: 56px; height: 56px; border-radius: var(--brut-radius-sm);
  border: var(--brut-border-w) solid var(--brut-border);
  background: var(--brut-primary); color: #fff; font-size: 1.5rem; cursor: pointer;
  box-shadow: var(--brut-shadow); transition: all var(--brut-transition);
  display: flex; align-items: center; justify-content: center;
}
.brut-fab:hover { transform: translate(-2px, -2px); box-shadow: 8px 8px 0px var(--brut-border); }
.brut-fab:active { transform: translate(4px, 4px); box-shadow: 2px 2px 0px var(--brut-border); }

/* ===== BACK TO TOP ===== */
.brut-back-to-top {
  position: fixed; bottom: 2rem; right: 2rem; z-index: 1000;
  width: 44px; height: 44px; border-radius: var(--brut-radius-sm);
  border: var(--brut-border-w) solid var(--brut-border);
  background: var(--brut-surface); color: var(--brut-text); font-size: 1.2rem; cursor: pointer;
  box-shadow: var(--brut-shadow-sm); transition: all var(--brut-transition);
  display: flex; align-items: center; justify-content: center;
}
.brut-back-to-top:hover { box-shadow: 6px 6px 0px var(--brut-border); transform: translate(-2px, -2px); }

/* ===== TABLE ===== */
.brut-table { width: 100%; border-collapse: collapse; font-size: 0.95rem; border: var(--brut-border-w) solid var(--brut-border); }
.brut-table th, .brut-table td { padding: 12px 16px; text-align: left; border-bottom: var(--brut-border-w) solid var(--brut-border); }
.brut-table th { font-weight: 800; background: var(--brut-primary); color: #fff; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.03em; }
.brut-table tr:last-child td { border-bottom: none; }
.brut-table tr:hover td { background: var(--brut-bg-alt); }

/* ===== LIST ===== */
.brut-list { list-style: none; padding: 0; display: flex; flex-direction: column; gap: 0.5rem; }
.brut-list li { padding: 8px 12px; border-radius: var(--brut-radius-sm); border: 2px solid transparent; transition: all var(--brut-transition); }
.brut-list li:hover { background: var(--brut-bg-alt); border-color: var(--brut-border); }

/* ===== DETAILS ===== */
.brut-details { border-radius: var(--brut-radius-sm); overflow: hidden; border: var(--brut-border-w) solid var(--brut-border); }
.brut-summary { padding: 12px 16px; cursor: pointer; font-weight: 700; background: var(--brut-bg-alt); }

/* ===== DIVIDER ===== */
.brut-divider { border: none; height: var(--brut-border-w); background: var(--brut-border); margin: 1.5rem 0; }

/* ===== DESIGN PATTERNS ===== */
.brut-stripe {
  background: repeating-linear-gradient(45deg, transparent, transparent 8px, var(--brut-bg-alt) 8px, var(--brut-bg-alt) 16px);
}
.brut-stripe--v {
  background: repeating-linear-gradient(0deg, transparent, transparent 8px, var(--brut-bg-alt) 8px, var(--brut-bg-alt) 16px);
}
.brut-dots {
  background-image: radial-gradient(circle, var(--brut-border) 1.5px, transparent 1.5px);
  background-size: 16px 16px;
}
.brut-corner {
  position: relative;
}
.brut-corner::before {
  content: ''; position: absolute; top: -6px; right: -6px;
  width: 24px; height: 24px;
  border-top: 4px solid var(--brut-secondary);
  border-right: 4px solid var(--brut-secondary);
}
.brut-corner::after {
  content: ''; position: absolute; bottom: -6px; left: -6px;
  width: 24px; height: 24px;
  border-bottom: 4px solid var(--brut-primary);
  border-left: 4px solid var(--brut-primary);
}
.brut-accent-top { border-top: 6px solid var(--brut-primary) !important; }
.brut-accent-bottom { border-bottom: 6px solid var(--brut-secondary) !important; }
.brut-accent-left { border-left: 6px solid var(--brut-success) !important; }
.brut-accent-right { border-right: 6px solid var(--brut-primary) !important; }
.brut-rainbow-bottom {
  border-bottom: 6px solid;
  border-image: linear-gradient(90deg, var(--brut-primary), var(--brut-secondary), var(--brut-success)) 1;
}
.brut-loader {
  display: inline-block; width: 24px; height: 24px;
  border: 3px solid var(--brut-bg-alt);
  border-top-color: var(--brut-primary);
  border-right-color: var(--brut-secondary);
  border-radius: 0;
  animation: brutSpin 0.6s linear infinite;
}
.brut-loader--sm { width: 16px; height: 16px; border-width: 2px; }
.brut-loader--lg { width: 40px; height: 40px; border-width: 4px; }

/* ===== MEDIA ===== */
.brut-image { border: var(--brut-border-w) solid var(--brut-border); border-radius: var(--brut-radius-sm); max-width: 100%; }
.brut-figure { margin: 1rem 0; text-align: center; }
.brut-figure figcaption { font-size: 0.85rem; color: var(--brut-text-muted); margin-top: 0.5rem; font-weight: 600; }
.brut-video { border: var(--brut-border-w) solid var(--brut-border); border-radius: var(--brut-radius-sm); max-width: 100%; }
.brut-iframe { border: var(--brut-border-w) solid var(--brut-border); border-radius: var(--brut-radius-sm); width: 100%; }

/* ===== ICON ===== */
.brut-icon { display: inline-flex; align-items: center; justify-content: center; width: 1.2em; height: 1.2em; }

/* ===== TOOLTIP ===== */
.brut-tooltip { position: relative; display: inline-block; cursor: pointer; }
.brut-tooltip::after {
  content: attr(data-tooltip); position: absolute; bottom: 100%; left: 50%; transform: translateX(-50%);
  background: var(--brut-border); color: var(--brut-bg); padding: 4px 10px; border-radius: 4px;
  font-size: 0.8rem; font-weight: 600; white-space: nowrap; opacity: 0; pointer-events: none;
  transition: opacity var(--brut-transition); margin-bottom: 4px;
}
.brut-tooltip:hover::after { opacity: 1; }

/* ===== RESPONSIVE ===== */
@media (max-width: 768px) {
  .brut-page { padding: 16px 12px; }
  .brut-h1 { font-size: 1.8rem; }
  .brut-h2 { font-size: 1.5rem; }
  .brut-h3 { font-size: 1.25rem; }
  .brut-hero { padding: 2.5rem 1rem; }
  .brut-grid { grid-template-columns: 1fr; }
  .brut-row { flex-direction: column; }
  .brut-col { flex: 1 1 100%; padding: 0.25rem 0; }
  .brut-nav { flex-direction: column; align-items: stretch; }
  .brut-tab-bar { overflow-x: auto; white-space: nowrap; }
  .brut-modal { margin: 1rem; padding: 1.5rem; }
  .brut-fab { bottom: 1rem; right: 1rem; width: 48px; height: 48px; font-size: 1.2rem; }
  .brut-table { display: block; overflow-x: auto; }
}
@media (min-width: 769px) and (max-width: 1024px) {
  .brut-grid { grid-template-columns: repeat(2, 1fr); }
}

/* ===== UTILITY ===== */
.brut-spacer { flex: 1; }
.brut-gap-xs { gap: 0.25rem; } .brut-gap-sm { gap: 0.5rem; } .brut-gap-md { gap: 1rem; } .brut-gap-lg { gap: 2rem; }
.brut-p-xs { padding: 0.25rem; } .brut-p-sm { padding: 0.5rem; } .brut-p-md { padding: 1rem; } .brut-p-lg { padding: 2rem; }
.brut-m-xs { margin: 0.25rem; } .brut-m-sm { margin: 0.5rem; } .brut-m-md { margin: 1rem; } .brut-m-lg { margin: 2rem; }
.brut-text-center { text-align: center; }
.brut-text-right { text-align: right; }
.brut-flex-center { display: flex; align-items: center; justify-content: center; }
.brut-flex-between { display: flex; align-items: center; justify-content: space-between; }
.brut-flex-wrap { flex-wrap: wrap; }
.brut-w-full { width: 100%; }
.brut-hidden { display: none; }
@media (max-width: 768px) { .brut-hidden-mobile { display: none; } }
@media (min-width: 769px) { .brut-hidden-desktop { display: none; } }

/* ===== ANIMATIONS ===== */
@keyframes brutFadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
@keyframes brutSlideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
@keyframes brutSpin { to { transform: rotate(360deg); } }
@keyframes brutShimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
@keyframes brutPulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
@keyframes brutPageIn {
  0% { opacity: 0; transform: translateY(12px); }
  60% { opacity: 1; transform: translateY(-2px); }
  100% { opacity: 1; transform: translateY(0); }
}
@keyframes brutBounceIn {
  0% { opacity: 0; transform: scale(0.9); }
  60% { transform: scale(1.02); }
  100% { opacity: 1; transform: scale(1); }
}
.brut-animate-fade-in { animation: brutFadeIn 0.3s ease; }
.brut-animate-slide-up { animation: brutSlideUp 0.3s ease; }
.brut-animate-pulse { animation: brutPulse 2s ease-in-out infinite; }
.brut-animate-bounce-in { animation: brutBounceIn 0.35s ease; }

/* ===== CAROUSEL ===== */
.brut-carousel { overflow: hidden; position: relative; border: var(--brut-border-w) solid var(--brut-border); border-radius: var(--brut-radius); }
.brut-carousel-item { display: none; }
.brut-carousel-item.active { display: block; animation: brutFadeIn 0.3s ease; }

</style>`
}

module.exports = { compileAST, compileUix, compileFile, compileToHTML }
