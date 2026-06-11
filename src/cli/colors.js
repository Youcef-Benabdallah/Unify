const isWin = process.platform === 'win32'
const noColor = process.env.NO_COLOR || !process.stdout.isTTY

const c = (code) => (str) => noColor ? str : `\x1b[${code}m${str}\x1b[0m`

const colors = {
  reset: c(0),
  bold: c(1),
  dim: c(2),
  italic: c(3),
  black: c(30),
  red: c(31),
  green: c(32),
  yellow: c(33),
  blue: c(34),
  magenta: c(35),
  cyan: c(36),
  white: c(37),
  bgBlack: c(40),
  bgRed: c(41),
  bgGreen: c(42),
  bgYellow: c(43),
  bgBlue: c(44),
  bgMagenta: c(45),
  bgCyan: c(46),
  bgWhite: c(47),
  brightRed: c(91),
  brightGreen: c(92),
  brightYellow: c(93),
  brightBlue: c(94),
  brightMagenta: c(95),
  brightCyan: c(96),
  brightWhite: c(97),
}

function ok(msg) {
  return colors.green('*') + ' ' + colors.bold(msg)
}

function warn(msg) {
  return colors.yellow('!') + ' ' + msg
}

function fail(msg) {
  return colors.red('x') + ' ' + msg
}

function doing(msg) {
  return colors.cyan('.') + ' ' + msg
}

function logo() {
  const u = colors.brightCyan
  const n = colors.brightBlue
  const i = colors.brightMagenta
  const f = colors.brightGreen
  const y = colors.brightYellow
  console.log(`
  ${u('██╗   ██╗')}${n('███╗   ██╗')}${i('██╗')}${f('███████╗')}${y('██╗   ██╗')}
  ${u('██╗   ██╗')}${n('████╗  ██║')}${i('██║')}${f('██╔════╝')} ${y('╚██╗ ██╔╝')}
  ${u('██║   ██║')}${n('██╔██╗ ██║')}${i('██║')}${f('█████╗')}   ${y(' ╚████╔╝ ')}
  ${u('██║   ██║')}${n('██║╚██╗██║')}${i('██║')}${f('██╔══╝')}    ${y(' ╚██╔╝  ')}
  ${u('╚██████╔╝')}${n('██║ ╚████║')}${i('██║')}${f('██║')}        ${y('  ██║   ')}
  ${u(' ╚═════╝ ')}${n('╚═╝  ╚═══╝')}${i('╚═╝')}${f('╚═╝')}        ${y('  ╚═╝   ')}
  ${colors.dim('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')}
  ${colors.bold('v0.1.67')} ${colors.dim('·')} ${colors.cyan('Static Site Framework')} ${colors.dim('·')} ${colors.magenta('Neu-Brutalism')} ${colors.dim('·')} ${colors.green('.uix')}
  ${colors.dim('by Youcef Benabdallah — MIT License')}
`)
}

module.exports = { colors, ok, warn, fail, doing, logo }
