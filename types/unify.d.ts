declare module 'unify' {
  // Compiler
  export function compileUix(source: string, options?: { name?: string; runtimePath?: string; exportDefault?: boolean }): { code: string; meta: Record<string, any> }
  export function compileFile(filePath: string, options?: { name?: string; runtimePath?: string; exportDefault?: boolean }): { code: string; meta: Record<string, any>; rawScript: string; rawStyle: string }
  export function compileToHTML(compiledCode: string, meta?: Record<string, any>, config?: Record<string, any>, rawScript?: string, rawStyle?: string): string
  export function parseUix(source: string): { meta: Record<string, any>; body: any }
  export function parseFile(filePath: string): { meta: Record<string, any>; body: any }

  // Router
  export class UnifyRouter {
    constructor(options?: { pagesDir?: string })
    match(requestPath: string): { path: string; file: string; name: string; params: Record<string, string> } | null
    compileAll(): any[]
    getRoutes(): string[]
  }
  export function createRouter(pagesDir?: string): UnifyRouter

  // Config
  export function loadConfig(startDir?: string): Record<string, any>
  export function writeConfig(dir: string, overrides?: Record<string, any>): string

  // UI
  export function injectCSS(): void
  export function applyTheme(theme: 'light' | 'dark'): void
  export function getTheme(): string
  export function toggleTheme(): string
  export class ThemeToggle {
    constructor(options?: { onToggle?: (theme: string) => void })
    mount(parent: HTMLElement): HTMLElement
  }
  export function setTranslations(lang: string, dict: Record<string, string>): void
  export function t(key: string, lang: string): string
  export function applyLanguage(lang: string): void
  export function getLanguage(): string
  export function toggleLanguage(options?: { languages?: string[] }): string
  export class LanguageToggle {
    constructor(options?: { languages?: string[]; labels?: Record<string, string>; onToggle?: (lang: string) => void })
    mount(parent: HTMLElement): HTMLElement
  }
  export class NeumorphicUI {
    constructor(options?: any)
    card(content: string | HTMLElement, options?: { pressed?: boolean; onClick?: () => void }): HTMLElement
    button(text: string, options?: { onClick?: () => void; className?: string }): HTMLElement
    input(placeholder?: string, options?: { type?: string; onInput?: (e: Event) => void }): HTMLElement
    nav(items: Array<{ label: string; href?: string; onClick?: () => void }>): HTMLElement
    page(children: HTMLElement | HTMLElement[]): HTMLElement
  }

  // Runtime
  export function createElement(tag: string | Function, props: Record<string, any> | null, children: any[]): HTMLElement
  export function createToggle(label: string | (() => string), toggleFn: string | (() => any)): HTMLButtonElement
  export function fragment(children: any[]): HTMLElement
  export function html(str: string): DocumentFragment
  export function script(str: string): HTMLScriptElement
  export function style(str: string): HTMLStyleElement
  export function render(component: HTMLElement | Function, container: string | HTMLElement): HTMLElement
  export function mount(component: HTMLElement | Function, selector?: string): HTMLElement
}

declare module '*.uix' {
  const component: any
  export default component
}
