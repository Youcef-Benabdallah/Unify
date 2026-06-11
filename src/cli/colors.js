const isWin = process.platform === 'win32'
const noColor = process.env.NO_COLOR || !process.stdout.isTTY

function ansi(n) {
  return (str) => noColor ? str : `\x1b[${n}m${str}\x1b[0m`
}

function rgb(r, g, b) {
  return (str) => noColor ? str : `\x1b[38;2;${r};${g};${b}m${str}\x1b[0m`
}

function bgRgb(r, g, b) {
  return (str) => noColor ? str : `\x1b[48;2;${r};${g};${b}m${str}\x1b[0m`
}

const colors = {
  reset: ansi(0),
  bold: ansi(1),
  dim: ansi(2),
  italic: ansi(3),

  lavender: rgb(180, 160, 210),
  pastelLavender: rgb(200, 180, 230),
  pastelYellow: rgb(249, 231, 159),
  pastelGreen: rgb(169, 223, 191),
  pastelPink: rgb(255, 182, 193),
  pastelBlue: rgb(174, 198, 255),
  pastelPeach: rgb(255, 218, 185),
  pastelMint: rgb(189, 232, 211),

  white: ansi(37),
  black: ansi(30),

  bgPastelLavender: bgRgb(200, 180, 230),
  bgPastelYellow: bgRgb(249, 231, 159),
  bgPastelGreen: bgRgb(169, 223, 191),
}

function ok(msg) {
  return colors.pastelGreen('\u2714') + ' ' + colors.bold(msg)
}

function warn(msg) {
  return colors.pastelYellow('\u26A0') + ' ' + msg
}

function fail(msg) {
  return colors.pastelPink('\u2718') + ' ' + msg
}

function doing(msg) {
  return colors.pastelLavender('\u2219') + ' ' + msg
}

function info(msg) {
  return colors.pastelBlue('\u2139') + ' ' + msg
}

function logo() {
  const l = colors.pastelLavender
  const y = colors.pastelYellow
  const g = colors.pastelGreen
  const p = colors.pastelPink
  const b = colors.pastelBlue
  const d = colors.dim
  const B = '\u2588'
  const W = 44
  const V = '\u2502'

  function line(content) {
    const len = content.replace(/\x1b\[[0-9;]*m/g, '').length
    return '  ' + l(V) + '  ' + content + ' '.repeat(W - len) + '  ' + l(V)
  }
  function sep() {
    return '  ' + l(V) + ' ' + l('\u2500'.repeat(W + 2)) + ' ' + l(V)
  }

  const U = [B+B+'   '+B+B, B+B+'   '+B+B, B+B+'   '+B+B, B+B+'   '+B+B, ' '+B+B+B+B+B+' ']
  const N = [B+B+B+'  '+B+B, B+B+B+B+' '+B+B, B+B+' '+B+B+B+B, B+B+'  '+B+B+B, B+B+'   '+B+B]
  const I = [B+B+B+B+B+B+B, '  '+B+B+B+'  ', '  '+B+B+B+'  ', '  '+B+B+B+'  ', B+B+B+B+B+B+B]
  const F = [B+B+B+B+B+B+B, B+B+B+'    ', B+B+B+B+B+B+B, B+B+B+'    ', B+B+B+'    ']
  const Y = [B+B+'   '+B+B, B+B+'   '+B+B, ' '+B+B+' '+B+B+' ', '  '+B+B+B+'  ', '  '+B+B+B+'  ']

  console.log()
  console.log('  ' + l('\u256D') + l('\u2500'.repeat(W + 4)) + l('\u256E'))
  for (let r = 0; r < 5; r++) {
    console.log(line(l(U[r]) + ' ' + y(N[r]) + ' ' + g(I[r]) + ' ' + p(F[r]) + ' ' + b(Y[r])))
  }
  console.log(sep())
  console.log(line(d('v-0.6.7')))
  console.log(line(d('Unify')))
  console.log(line(d('Your Framework that use')))
  console.log(line(d('neu-brutalism design')))
  console.log(sep())
  console.log(line(d('by Youcef Benabdallah')))
  console.log('  ' + l('\u2570') + l('\u2500'.repeat(W + 4)) + l('\u256F'))
}

function spinStart(text) {
  const frames = ['\u25D0', '\u25D3', '\u25D1', '\u25D2']
  let i = 0
  const timer = setInterval(() => {
    process.stdout.write('\r' + colors.pastelLavender(frames[i % frames.length]) + ' ' + colors.dim(text) + ' ')
    i++
  }, 120)
  return timer
}

function spinStop(timer, msg, success = true) {
  clearInterval(timer)
  process.stdout.write('\r' + (success ? ok(msg) : fail(msg)) + '\n')
}

function header(text) {
  console.log()
  console.log('  ' + colors.pastelLavender('\u2500\u2500\u2500 ' + colors.bold(text) + ' \u2500\u2500\u2500'))
  console.log()
}

function dimmed(text) {
  return colors.dim(text)
}

module.exports = { colors, ok, warn, fail, doing, info, logo, spinStart, spinStop, header, dimmed }
