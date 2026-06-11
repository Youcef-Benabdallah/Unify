const http = require('http')
const { colors } = require('./colors')

function queryOllama(host, model, prompt) {
  return new Promise((resolve, reject) => {
    const url = new URL('/api/generate', host)
    const data = JSON.stringify({
      model,
      prompt,
      stream: false,
      options: { temperature: 0.3 }
    })
    const req = http.request({
      hostname: url.hostname,
      port: url.port || 11434,
      path: '/api/generate',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    }, (res) => {
      let body = ''
      res.on('data', chunk => body += chunk)
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body)
          if (parsed.error) reject(new Error(parsed.error))
          else resolve(parsed.response || parsed)
        } catch { resolve(body) }
      })
    })
    req.on('error', (e) => reject(new Error(`Cannot reach Ollama at ${host}: ${e.message}`)))
    req.write(data)
    req.end()
  })
}

const SYSTEM_PROMPT = `You are UnifyAI, a coding assistant for the Unify framework.
Unify uses .uix files with an indentation-based component syntax.
Help the user write Unify code, explain concepts, and suggest improvements.
Keep answers concise. When providing code, use .uix syntax.
Unify supports: neumorphic UI, file-based routing, theme/language toggles, Tailwind CSS, inline HTML/CSS, JS/TS.
Key components: Page, Card, Button, Header, Text, Nav, ThemeToggle, LanguageToggle.
Syntax: ComponentName { prop: value; child { ... }; event -> handler }
CLI: unify dev (port 6710), unify build, unify init, unify new <name>`

async function aiChat(config) {
  const model = config.ai.model || 'llama3.2'
  const host = config.ai.ollamaHost || 'http://localhost:11434'
  const { logo } = require('./colors')

  console.clear()
  logo()
  console.log(colors.bold(`\n  Unify AI — ${colors.cyan(model)} ${colors.dim('(Ollama)')}`))
  console.log(colors.dim(`  Host: ${host}/api/generate`))
  console.log(colors.dim(`  Commands: exit (quit), clear (reset)\n`))

  const messages = [{ role: 'system', content: SYSTEM_PROMPT }]

  while (true) {
    process.stdout.write(colors.brightCyan('\n  >> ') + colors.bold('You: ') + colors.reset())
    const input = await new Promise(resolve => {
      process.stdin.resume()
      let data = ''
      process.stdin.on('data', chunk => {
        data += chunk.toString()
        if (data.includes('\n')) { process.stdin.pause(); resolve(data.trim()) }
      })
    })

    if (!input || input === 'exit' || input === 'quit') {
      console.log(colors.dim('\n  Goodbye.\n'))
      process.stdin.pause()
      return
    }
    if (input === 'clear') {
      messages.length = 1
      console.clear()
      logo()
      console.log(colors.bold(`\n  Unify AI — ${colors.cyan(model)} ${colors.dim('(Ollama)')}`))
      console.log(colors.dim('  Conversation reset.\n'))
      continue
    }

    messages.push({ role: 'user', content: input })
    const fullPrompt = messages.map(m => `${m.role}: ${m.content}`).join('\n')

    process.stdout.write(colors.bold('\n  AI: '))
    try {
      const response = await queryOllama(host, model, fullPrompt)
      const text = typeof response === 'string' ? response : response.response || JSON.stringify(response)
      console.log(colors.cyan(text))
      messages.push({ role: 'assistant', content: text })
    } catch (err) {
      console.log(colors.red(`\n  ${err.message}`))
      console.log(colors.dim('  Make sure Ollama is running: https://ollama.ai'))
    }
    console.log()
  }
}

async function aiPrompt(config, prompt) {
  const model = config.ai.model || 'llama3.2'
  const host = config.ai.ollamaHost || 'http://localhost:11434'
  console.log(colors.dim(`Asking Ollama (${model})...`))
  try {
    const response = await queryOllama(host, model, `${SYSTEM_PROMPT}\n\nUser: ${prompt}`)
    const text = typeof response === 'string' ? response : response.response || JSON.stringify(response)
    console.log(colors.cyan(text))
  } catch (err) {
    console.log(colors.red(err.message))
    console.log(colors.dim('Install Ollama: https://ollama.ai'))
  }
}

module.exports = { aiChat, aiPrompt, queryOllama }