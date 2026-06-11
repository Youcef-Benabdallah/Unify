const { compileUix, compileFile, compileToHTML } = require('./compiler/compiler')
const { parseUix, parseFile } = require('./compiler/parser')
const UnifyRouter = require('./router/router')
const { BrutalismUI, ThemeToggle, LanguageToggle, applyTheme, applyLanguage } = require('./ui/neumorphic')
const client = require('./runtime/client')
const { loadConfig, writeConfig } = require('./config/conf')

const NeumorphicUI = BrutalismUI

module.exports = {
  compileUix, compileFile, compileToHTML,
  parseUix, parseFile,
  UnifyRouter,
  NeumorphicUI, BrutalismUI, ThemeToggle, LanguageToggle,
  applyTheme, applyLanguage,
  ...client,
  loadConfig, writeConfig
}

module.exports.default = {
  compileUix, compileFile, compileToHTML,
  parseUix, parseFile,
  BrutalismUI, ThemeToggle, LanguageToggle,
  ...client
}