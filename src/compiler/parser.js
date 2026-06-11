const fs = require('fs')
const path = require('path')

function tokenize(source) {
  const tokens = []
  let i = 0
  let line = 1
  let col = 1

  while (i < source.length) {
    const ch = source[i]

    if (ch === '/' && source[i + 1] === '/') {
      while (i < source.length && source[i] !== '\n') i++
      line++; col = 1; i++
      continue
    }
    if (ch === '/' && source[i + 1] === '*') {
      i += 2
      while (i < source.length && !(source[i] === '*' && source[i + 1] === '/')) {
        if (source[i] === '\n') { line++; col = 1 } else col++
        i++
      }
      i += 2; continue
    }
    if (ch === '\n') { line++; col = 1; i++; continue }
    if (ch === ' ' || ch === '\t' || ch === '\r') { col++; i++; continue }

    if (ch === '{') { tokens.push({ type: 'BRACE_OPEN', line, col }); col++; i++; continue }
    if (ch === '}') { tokens.push({ type: 'BRACE_CLOSE', line, col }); col++; i++; continue }
    if (ch === '=') {
      if (source[i + 1] === '>') {
        tokens.push({ type: 'FAT_ARROW', line, col }); col += 2; i += 2; continue
      }
      tokens.push({ type: 'EQ', line, col }); col++; i++; continue
    }
    if (ch === ':') { tokens.push({ type: 'COLON', line, col }); col++; i++; continue }
    if (ch === ',') { tokens.push({ type: 'COMMA', line, col }); col++; i++; continue }
    if (ch === '@') { tokens.push({ type: 'AT', line, col }); col++; i++; continue }
    if (ch === '-') {
      if (source[i + 1] === '>') {
        tokens.push({ type: 'ARROW', line, col }); col += 2; i += 2; continue
      }
    }
    if (ch === '(') { tokens.push({ type: 'PAREN_OPEN', line, col }); col++; i++; continue }
    if (ch === ')') { tokens.push({ type: 'PAREN_CLOSE', line, col }); col++; i++; continue }
    if (ch === '.') { tokens.push({ type: 'DOT', line, col }); col++; i++; continue }
    if (ch === '>') { tokens.push({ type: 'GT', line, col }); col++; i++; continue }
    if (ch === '<') { tokens.push({ type: 'LT', line, col }); col++; i++; continue }
    if (ch === '!') {
      if (source[i + 1] === '=') {
        tokens.push({ type: 'NEQ', line, col }); col += 2; i += 2; continue
      }
    }
    if (ch === '+') { tokens.push({ type: 'PLUS', line, col }); col++; i++; continue }
    if (ch === '*') { tokens.push({ type: 'STAR', line, col }); col++; i++; continue }
    if (ch === '/') { tokens.push({ type: 'SLASH', line, col }); col++; i++; continue }
    if (ch === '[') { tokens.push({ type: 'BRACKET_OPEN', line, col }); col++; i++; continue }
    if (ch === ']') { tokens.push({ type: 'BRACKET_CLOSE', line, col }); col++; i++; continue }
    if (ch === ';') { tokens.push({ type: 'SEMI', line, col }); col++; i++; continue }
    if (ch === '|') { tokens.push({ type: 'PIPE', line, col }); col++; i++; continue }
    if (ch === '?') { tokens.push({ type: 'QUESTION', line, col }); col++; i++; continue }
    if (ch === '&') { tokens.push({ type: 'AMPERSAND', line, col }); col++; i++; continue }
    if (ch === '%') { tokens.push({ type: 'MODULO', line, col }); col++; i++; continue }
    if (ch === '~') { tokens.push({ type: 'TILDE', line, col }); col++; i++; continue }
    if (ch === '^') { tokens.push({ type: 'CARET', line, col }); col++; i++; continue }

    if (ch === '"' || ch === "'") {
      const quote = ch
      let value = ''
      i++; col++
      while (i < source.length && source[i] !== quote) {
        if (source[i] === '\\') { i++; col++; value += source[i] }
        else value += source[i]
        i++; col++
      }
      i++; col++
      tokens.push({ type: 'STRING', value, line, col })
      continue
    }

    if (ch === '`') {
      i++; col++
      let value = ''
      let depth = 0
      while (i < source.length) {
        if (source[i] === '`' && depth === 0) break
        if (source[i] === '$' && source[i + 1] === '{') { depth++; i += 2; col += 2; continue }
        if (source[i] === '}' && depth > 0) { depth--; i++; col++; continue }
        value += source[i]; i++; col++
      }
      i++; col++
      tokens.push({ type: 'STRING', value, line, col })
      continue
    }

    if (/[a-zA-Z_$]/.test(ch)) {
      let value = ''
      while (i < source.length && /[a-zA-Z0-9_$]/.test(source[i])) {
        value += source[i]; i++; col++
      }
      tokens.push({ type: 'IDENT', value, line, col })
      continue
    }

    if (/[0-9]/.test(ch)) {
      let value = ''
      while (i < source.length && /[0-9.]/.test(source[i])) {
        value += source[i]; i++; col++
      }
      tokens.push({ type: 'NUMBER', value: parseFloat(value), line, col })
      continue
    }

    col++; i++
  }

  tokens.push({ type: 'EOF', line, col })
  return tokens
}

function parse(tokens, source) {
  let pos = 0

  function peek() { return tokens[pos] || { type: 'EOF' } }
  function consume(type) {
    const tok = peek()
    if (tok.type !== type) {
      throw new Error(`Expected ${type} but got ${tok.type} at ${tok.line}:${tok.col}`)
    }
    pos++
    return tok
  }
  function skip(type) {
    if (peek().type === type) { pos++; return true }
    return false
  }

  function parseValue() {
    const tok = peek()
    if (tok.type === 'STRING') { pos++; return { type: 'string', value: tok.value } }
    if (tok.type === 'NUMBER') { pos++; return { type: 'number', value: tok.value } }
    if (tok.type === 'IDENT') {
      pos++
      if (tok.value === 'true') return { type: 'bool', value: true }
      if (tok.value === 'false') return { type: 'bool', value: false }
      if (tok.value === 'null') return { type: 'null', value: null }
      return parseIdentChain(tok.value)
    }
    if (tok.type === 'BRACE_OPEN') return parseObject()
    if (tok.type === 'PAREN_OPEN') return parseParenExpr()
    throw new Error(`Unexpected token ${tok.type} at ${tok.line}:${tok.col}`)
  }

  function parseIdentChain(first) {
    let expr = first
    while (peek().type === 'DOT') {
      pos++
      const next = consume('IDENT')
      expr += '.' + next.value
    }
    if (peek().type === 'BRACKET_OPEN') {
      pos++
      let idx = ''
      while (peek().type !== 'BRACKET_CLOSE' && peek().type !== 'EOF') {
        idx += peek().value || peek().type; pos++
      }
      if (peek().type === 'BRACKET_CLOSE') { idx += ']'; pos++ }
      expr += '[' + idx
    }
    return { type: 'ident', value: expr }
  }

  function parseParenExpr() {
    const start = pos
    consume('PAREN_OPEN')
    let depth = 1
    let code = '('
    while (depth > 0 && peek().type !== 'EOF') {
      const tok = peek()
      if (tok.type === 'PAREN_OPEN') depth++
      if (tok.type === 'PAREN_CLOSE') depth--
      if (depth === 0) break
      if (tok.type === 'STRING') code += JSON.stringify(tok.value)
      else code += tok.value || tok.type
      pos++
    }
    if (peek().type === 'PAREN_CLOSE') { code += ')'; pos++ }
    return { type: 'expr', value: code }
  }

  function parseExprUntil(...endTypes) {
    let code = ''
    while (!endTypes.includes(peek().type) && peek().type !== 'EOF' && peek().type !== 'BRACE_CLOSE') {
      const tok = peek()
      if (tok.type === 'PAREN_OPEN') {
        const expr = parseParenExpr()
        code += expr.value
      } else if (tok.type === 'STRING') { code += JSON.stringify(tok.value); pos++ }
      else if (tok.value) { code += tok.value; pos++ }
      else if (tok.type === 'FAT_ARROW') { code += '=>'; pos++ }
      else if (tok.type === 'ARROW') { code += '->'; pos++ }
      else { code += ' '; pos++ }
    }
    return code.trim()
  }

  function parseEventValue() {
    const tok = peek()
    if (tok.type === 'IDENT') {
      pos++
      return { type: 'event', value: tok.value }
    }
    if (tok.type === 'PAREN_OPEN') {
      const expr = parseExprUntil('BRACE_CLOSE', 'COMMA', 'COLON')
      return { type: 'event', value: expr }
    }
    const expr = parseExprUntil('BRACE_CLOSE', 'COMMA', 'COLON')
    return { type: 'event', value: expr }
  }

  function collectRawBlock() {
    let depth = 0
    let raw = ''
    let prevLine = tokens[pos] ? tokens[pos].line : 1
    let prevType = null
    const PUNCT = { PAREN_OPEN: '(', PAREN_CLOSE: ')', DOT: '.', GT: '>', LT: '<',
      PLUS: '+', STAR: '*', SLASH: '/', EQ: '=', COLON: ':', COMMA: ',',
      AT: '@', SEMI: ';', NEQ: '!=', PIPE: '|', QUESTION: '?', AMPERSAND: '&',
      MODULO: '%', TILDE: '~', CARET: '^',
      BRACKET_OPEN: '[', BRACKET_CLOSE: ']' }
    const STATEMENT_KEYWORDS = new Set(['var', 'let', 'const', 'function', 'class', 'if', 'for', 'while', 'switch', 'try', 'return', 'import', 'export', 'async', 'await', 'throw', 'do'])

    while (depth >= 0 && pos < tokens.length) {
      const tok = tokens[pos]
      if (tok.type === 'BRACE_OPEN') depth++
      if (tok.type === 'BRACE_CLOSE') depth--
      if (depth < 0) { pos++; break }

      const hasNewline = tok.line > prevLine

      if (hasNewline) {
        raw += '\n'
      }

      const addSpace = prevType !== 'DOT' && prevType !== 'PAREN_OPEN' && prevType !== 'BRACE_OPEN'

      if (tok.type === 'BRACE_OPEN') raw += addSpace && raw.length > 0 && raw[raw.length - 1] !== '\n' ? ' {' : '{'
      else if (tok.type === 'BRACE_CLOSE') raw += '}'
      else if (tok.type === 'STRING') raw += (addSpace && raw.length > 0 && raw[raw.length - 1] !== '\n' ? ' ' : '') + JSON.stringify(tok.value)
      else if (tok.type === 'NUMBER') raw += (addSpace && raw.length > 0 && raw[raw.length - 1] !== '\n' ? ' ' : '') + tok.value
      else if (tok.type === 'FAT_ARROW') raw += ' => '
      else if (tok.type === 'ARROW') raw += ' -> '
      else if (tok.type === 'IDENT') raw += (addSpace && raw.length > 0 && raw[raw.length - 1] !== '\n' ? ' ' : '') + tok.value
      else if (PUNCT[tok.type]) raw += PUNCT[tok.type]
      prevType = tok.type
      prevLine = tok.line
      pos++
    }
    return raw.trim()
  }

  function parseObject() {
    consume('BRACE_OPEN')
    const obj = { type: 'object', children: [], props: {} }
    while (peek().type !== 'BRACE_CLOSE' && peek().type !== 'EOF') {
      if (skip('SEMI')) continue
      const nameTok = consume('IDENT')
      const key = nameTok.value

      if ((key === 'script' || key === 'Script') && peek().type === 'BRACE_OPEN') {
        consume('BRACE_OPEN')
        const raw = collectRawBlock()
        obj.props[key] = { type: 'string', value: raw }
        continue
      }

      if ((key === 'style' || key === 'Style') && peek().type === 'BRACE_OPEN') {
        consume('BRACE_OPEN')
        const raw = collectRawBlock()
        obj.props[key] = { type: 'string', value: raw }
        continue
      }

      if (skip('EQ')) {
        obj.props[key] = parseValue()
      } else if (skip('COLON')) {
        obj.props[key] = parseValue()
      } else if (skip('ARROW')) {
        obj.props[key] = parseEventValue()
      } else if (skip('FAT_ARROW')) {
        obj.props[key] = parseEventValue()
      } else if (peek().type === 'BRACE_OPEN') {
        const child = parseObject()
        child.name = key
        obj.children.push(child)
      } else {
        obj.children.push({ type: 'object', name: key, children: [], props: {} })
      }
    }
    consume('BRACE_CLOSE')
    return obj
  }

  const ast = { type: 'program', children: [] }
  while (peek().type !== 'EOF') {
    const nameTok = consume('IDENT')
    const key = nameTok.value

    if ((key === 'script' || key === 'Script') && peek().type === 'BRACE_OPEN') {
      consume('BRACE_OPEN')
      const raw = collectRawBlock()
      ast.children.push({ type: 'object', name: key, children: [], props: { [key]: { type: 'string', value: raw } } })
      continue
    }

    if ((key === 'style' || key === 'Style') && peek().type === 'BRACE_OPEN') {
      consume('BRACE_OPEN')
      const raw = collectRawBlock()
      ast.children.push({ type: 'object', name: key, children: [], props: { [key]: { type: 'string', value: raw } } })
      continue
    }

    const child = parseObject()
    child.name = key
    ast.children.push(child)
  }

  return ast
}

function parseUix(source) {
  const tokens = tokenize(source)
  const ast = parse(tokens, source)

  const meta = {}
  let rawScript = ''
  let rawStyle = ''
  const body = { type: 'program', children: [] }

  for (const child of ast.children) {
    if (child.name === 'Meta') {
      for (const [k, v] of Object.entries(child.props)) {
        meta[k] = v.value
      }
    } else if (child.name === 'script' || child.name === 'Script') {
      rawScript = (child.props.script || child.props.Script || {}).value || ''
    } else if (child.name === 'style' || child.name === 'Style') {
      rawStyle = (child.props.style || child.props.Style || {}).value || ''
    } else {
      body.children.push(child)
    }
  }

  return { meta, body, rawScript, rawStyle }
}

function parseFile(filePath) {
  const source = fs.readFileSync(filePath, 'utf-8')
  return parseUix(source)
}

module.exports = { tokenize, parse, parseUix, parseFile }