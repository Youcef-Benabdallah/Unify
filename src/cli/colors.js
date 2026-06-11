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
  const W = 56
  const H = '\u2500'
  function line(text) {
    const len = text.replace(/\x1b\[[0-9;]*m/g, '').length
    return '  ' + l('\u2502') + '  ' + text + ' '.repeat(Math.max(0, W - len)) + '  ' + l('\u2502')
  }
  console.log()
  console.log('  ' + l('\u250C') + l(H.repeat(W + 4)) + l('\u2510'))
  console.log(line(l('U') + y('n') + g('i') + p('f') + b('y') + d('  v0.6.7  ') + l('Neu-Brutalism .uix Framework')))
  console.log(line(d('by Youcef Benabdallah   ') + l('https://youcefdev.netlify.app/')))
  console.log('  ' + l('\u2514') + l(H.repeat(W + 4)) + l('\u2518'))
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
