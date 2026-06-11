const brutalismCSS = `
:root {
  --brut-bg: #f5f3ff;
  --brut-bg-alt: #ede9fe;
  --brut-surface: #ffffff;
  --brut-text: #1e1b4b;
  --brut-text-muted: #6b7280;
  --brut-primary: #7c3aed;
  --brut-primary-light: #a78bfa;
  --brut-secondary: #fbbf24;
  --brut-secondary-dark: #f59e0b;
  --brut-success: #10b981;
  --brut-warning: #fbbf24;
  --brut-danger: #ef4444;
  --brut-info: #7c3aed;
  --brut-border: #1e1b4b;
  --brut-border-w: 3px;
  --brut-radius: 12px;
  --brut-radius-sm: 8px;
  --brut-radius-lg: 16px;
  --brut-padding: 16px;
  --brut-gap: 1rem;
  --brut-font: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
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
  --brut-border: #7c3aed;
  --brut-primary-light: #7c3aed;
  --brut-shadow: 6px 6px 0px var(--brut-primary);
  --brut-shadow-sm: 4px 4px 0px var(--brut-primary);
  --brut-shadow-lg: 10px 10px 0px var(--brut-primary);
}

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html { scroll-behavior: smooth; }

body {
  background: var(--brut-bg);
  color: var(--brut-text);
  font-family: var(--brut-font);
  transition: background var(--brut-transition), color var(--brut-transition);
  min-height: 100vh;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}

img { max-width: 100%; height: auto; display: block; }
a { color: var(--brut-primary); text-decoration: underline; font-weight: 600; }
a:hover { color: var(--brut-secondary-dark); }

/* ===== NEU-BRUTALISM CARDS ===== */
.brut-card {
  background: var(--brut-surface);
  border: var(--brut-border-w) solid var(--brut-border);
  border-radius: var(--brut-radius);
  padding: var(--brut-padding);
  box-shadow: var(--brut-shadow);
  transition: all var(--brut-transition);
}

.brut-card--hover:hover {
  box-shadow: 8px 8px 0px var(--brut-border);
  transform: translate(-2px, -2px);
}

.brut-card--flat {
  box-shadow: none;
  border-color: var(--brut-text-muted);
}

.brut-card--pressed {
  box-shadow: 2px 2px 0px var(--brut-border);
  transform: translate(4px, 4px);
}

/* ===== BUTTONS ===== */
.brut-button {
  background: var(--brut-surface);
  border: var(--brut-border-w) solid var(--brut-border);
  border-radius: var(--brut-radius-sm);
  padding: 12px 24px;
  color: var(--brut-text);
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: var(--brut-shadow-sm);
  transition: all var(--brut-transition);
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  line-height: 1;
  text-transform: uppercase;
  letter-spacing: 0.02em;
}

.brut-button:hover {
  box-shadow: 6px 6px 0px var(--brut-border);
  transform: translate(-2px, -2px);
}

.brut-button:active {
  box-shadow: 1px 1px 0px var(--brut-border);
  transform: translate(3px, 3px);
}

.brut-button--primary {
  background: var(--brut-primary);
  color: #fff;
  border-color: var(--brut-border);
}

.brut-button--primary:hover {
  background: #6d28d9;
}

.brut-button--secondary {
  background: var(--brut-secondary);
  color: var(--brut-border);
}

.brut-button--secondary:hover {
  background: var(--brut-secondary-dark);
}

.brut-button--success {
  background: var(--brut-success);
  color: #fff;
}

.brut-button--outline {
  background: transparent;
  border-color: var(--brut-primary);
  color: var(--brut-primary);
}

.brut-button--ghost {
  background: transparent;
  box-shadow: none;
  border-color: transparent;
}

.brut-button--ghost:hover {
  background: var(--brut-bg-alt);
  box-shadow: none;
  transform: none;
}

.brut-button--sm { padding: 8px 16px; font-size: 0.8rem; border-radius: 6px; }
.brut-button--lg { padding: 16px 32px; font-size: 1.1rem; border-radius: var(--brut-radius-sm); }

/* ===== INPUTS ===== */
.brut-input, .brut-textarea, .brut-select {
  background: var(--brut-surface);
  border: var(--brut-border-w) solid var(--brut-border);
  border-radius: var(--brut-radius-sm);
  padding: 12px 16px;
  color: var(--brut-text);
  font-size: 1rem;
  width: 100%;
  outline: none;
  box-shadow: var(--brut-shadow-sm);
  transition: all var(--brut-transition);
  font-family: inherit;
}

.brut-input:focus, .brut-textarea:focus, .brut-select:focus {
  box-shadow: 8px 8px 0px var(--brut-primary);
  transform: translate(-2px, -2px);
  border-color: var(--brut-primary);
}

.brut-input--sm { padding: 8px 12px; font-size: 0.85rem; }
.brut-input--lg { padding: 16px 20px; font-size: 1.1rem; }
.brut-input--error { border-color: var(--brut-danger); box-shadow: 6px 6px 0px var(--brut-danger); }
.brut-textarea { min-height: 100px; resize: vertical; }
.brut-select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%231e1b4b' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  padding-right: 36px;
}

.brut-label { display: block; font-weight: 700; margin-bottom: 0.5rem; }
.brut-fieldset {
  border: var(--brut-border-w) solid var(--brut-border);
  padding: 1.5rem;
  border-radius: var(--brut-radius);
}
.brut-legend { font-weight: 700; padding: 0 0.5rem; font-size: 1.1rem; }

/* ===== NAV ===== */
.brut-nav {
  background: var(--brut-surface);
  border: var(--brut-border-w) solid var(--brut-border);
  border-radius: var(--brut-radius);
  padding: 12px 24px;
  display: flex;
  gap: 16px;
  align-items: center;
  flex-wrap: wrap;
  box-shadow: var(--brut-shadow-sm);
}

.brut-toggle {
  background: var(--brut-surface);
  border: var(--brut-border-w) solid var(--brut-border);
  border-radius: var(--brut-radius-sm);
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  cursor: pointer;
  box-shadow: var(--brut-shadow-sm);
  transition: all var(--brut-transition);
  flex-shrink: 0;
}

.brut-toggle:hover {
  box-shadow: 6px 6px 0px var(--brut-border);
  transform: translate(-2px, -2px);
}

.brut-toggle:active {
  box-shadow: 1px 1px 0px var(--brut-border);
  transform: translate(3px, 3px);
}

.brut-link {
  font-weight: 700;
  cursor: pointer;
  color: var(--brut-text);
  text-decoration: none;
  padding: 4px 8px;
  border-radius: 4px;
  transition: all var(--brut-transition);
}

.brut-link:hover {
  color: var(--brut-primary);
  background: var(--brut-bg-alt);
  text-decoration: none;
}

/* ===== TYPOGRAPHY ===== */
.brut-h1 {
  font-size: 2.5rem;
  font-weight: 800;
  line-height: 1.15;
  margin-bottom: 0.5em;
  text-transform: uppercase;
  letter-spacing: -0.02em;
}
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
.brut-mark {
  background: var(--brut-secondary);
  color: var(--brut-border);
  padding: 0.1em 0.3em;
  border-radius: 4px;
  font-weight: 600;
}
.brut-code {
  background: var(--brut-bg-alt);
  border: 2px solid var(--brut-border);
  padding: 0.2em 0.4em;
  border-radius: 4px;
  font-family: var(--brut-mono);
  font-size: 0.9em;
}
.brut-pre {
  background: var(--brut-bg-alt);
  border: var(--brut-border-w) solid var(--brut-border);
  padding: 1rem;
  border-radius: var(--brut-radius-sm);
  font-family: var(--brut-mono);
  font-size: 0.9rem;
  overflow-x: auto;
  box-shadow: var(--brut-shadow-sm);
}
.brut-blockquote {
  border-left: 6px solid var(--brut-primary);
  padding: 1rem 1.5rem;
  margin: 1rem 0;
  background: var(--brut-bg-alt);
  border-radius: 0 var(--brut-radius-sm) var(--brut-radius-sm) 0;
  font-style: italic;
  font-weight: 600;
  box-shadow: var(--brut-shadow-sm);
}
.brut-kbd {
  background: var(--brut-border);
  color: var(--brut-bg);
  padding: 0.2em 0.5em;
  border-radius: 4px;
  font-family: var(--brut-mono);
  font-size: 0.85em;
  font-weight: 700;
}

/* ===== PAGE ===== */
.brut-page {
  animation: brutFadeIn 0.3s ease;
  max-width: 960px;
  margin: 0 auto;
  padding: 24px 16px;
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
  background: var(--brut-surface);
  border: var(--brut-border-w) solid var(--brut-border);
  border-radius: var(--brut-radius);
  padding: var(--brut-padding);
  box-shadow: var(--brut-shadow-sm);
}
.brut-hero { padding: 4rem 1rem; text-align: center; }
.brut-feature { text-align: center; padding: 1.5rem; }
.brut-box {
  background: var(--brut-surface);
  border: var(--brut-border-w) solid var(--brut-border);
  border-radius: var(--brut-radius-sm);
  padding: var(--brut-padding);
  box-shadow: var(--brut-shadow-sm);
}
.brut-aside { background: var(--brut-bg-alt); border-radius: var(--brut-radius); padding: var(--brut-padding); }
.brut-article { line-height: 1.8; }
.brut-main { min-height: 60vh; }

/* ===== ALERTS ===== */
.brut-alert {
  padding: 14px 18px;
  border-radius: var(--brut-radius-sm);
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  position: relative;
  border: var(--brut-border-w) solid var(--brut-border);
  font-size: 0.95rem;
  font-weight: 600;
  box-shadow: var(--brut-shadow-sm);
}
.brut-alert--info { background: var(--brut-bg-alt); border-color: var(--brut-primary); }
.brut-alert--success { background: #d1fae5; border-color: var(--brut-success); color: #065f46; }
.brut-alert--warning { background: #fef3c7; border-color: var(--brut-secondary); color: #92400e; }
.brut-alert--danger { background: #fee2e2; border-color: var(--brut-danger); color: #991b1b; }
.brut-alert-close {
  background: none; border: none; cursor: pointer; font-size: 1.1rem;
  margin-left: auto; padding: 0 4px; font-weight: 700;
}
[data-theme="dark"] .brut-alert--info { background: #1a1530; }
[data-theme="dark"] .brut-alert--success { background: #064e3b; color: #a7f3d0; }
[data-theme="dark"] .brut-alert--warning { background: #451a03; color: #fde68a; }
[data-theme="dark"] .brut-alert--danger { background: #450a0a; color: #fecaca; }

/* ===== TOAST ===== */
.brut-toast {
  padding: 12px 20px;
  border-radius: var(--brut-radius-sm);
  border: var(--brut-border-w) solid var(--brut-border);
  margin-bottom: 0.5rem;
  box-shadow: var(--brut-shadow);
  font-size: 0.95rem;
  font-weight: 700;
  opacity: 0;
  transform: translateX(100%);
  transition: all 0.3s ease;
  min-width: 280px;
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
  background: var(--brut-surface);
  border: var(--brut-border-w) solid var(--brut-border);
  border-radius: var(--brut-radius-lg);
  padding: 2rem;
  max-width: 560px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: var(--brut-shadow-lg);
  animation: brutSlideUp 0.3s ease;
}

/* ===== BADGE ===== */
.brut-badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: var(--brut-radius-sm);
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border: 2px solid var(--brut-border);
}
.brut-badge--info { background: var(--brut-bg-alt); color: var(--brut-primary); }
.brut-badge--success { background: #d1fae5; color: #065f46; border-color: var(--brut-success); }
.brut-badge--warning { background: #fef3c7; color: #92400e; border-color: var(--brut-warning); }
.brut-badge--danger { background: #fee2e2; color: #991b1b; border-color: var(--brut-danger); }

/* ===== CHIP ===== */
.brut-chip {
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  background: var(--brut-bg-alt);
  font-weight: 600;
  border: 2px solid var(--brut-border);
}

/* ===== AVATAR ===== */
.brut-avatar {
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  background: var(--brut-primary);
  color: #fff;
  border: var(--brut-border-w) solid var(--brut-border);
  box-shadow: var(--brut-shadow-sm);
}
.brut-avatar--sm { width: 32px; height: 32px; font-size: 0.8rem; }
.brut-avatar--md { width: 48px; height: 48px; font-size: 1rem; }
.brut-avatar--lg { width: 72px; height: 72px; font-size: 1.5rem; }
.brut-avatar--xl { width: 96px; height: 96px; font-size: 2rem; }

/* ===== PROGRESS ===== */
.brut-progress-bar {
  height: 12px;
  background: var(--brut-surface);
  border: var(--brut-border-w) solid var(--brut-border);
  border-radius: 6px;
  overflow: hidden;
  box-shadow: var(--brut-shadow-sm);
}
.brut-progress-fill {
  height: 100%;
  background: var(--brut-primary);
  transition: width 0.4s ease;
  min-width: 4px;
}
.brut-progress { appearance: none; height: 12px; border-radius: 6px; border: var(--brut-border-w) solid var(--brut-border); width: 100%; background: var(--brut-surface); }
.brut-progress::-webkit-progress-bar { background: var(--brut-surface); border-radius: 6px; }
.brut-progress::-webkit-progress-value { background: var(--brut-primary); border-radius: 4px; }
.brut-progress::-moz-progress-bar { background: var(--brut-primary); border-radius: 4px; }
.brut-meter { appearance: none; height: 12px; border-radius: 6px; border: var(--brut-border-w) solid var(--brut-border); width: 100%; background: var(--brut-surface); }
.brut-meter::-webkit-meter-bar { background: var(--brut-surface); border-radius: 6px; }
.brut-meter::-webkit-meter-optimum-value { background: var(--brut-success); border-radius: 4px; }
.brut-meter::-webkit-meter-suboptimum-value { background: var(--brut-warning); border-radius: 4px; }
.brut-meter::-webkit-meter-even-less-good-value { background: var(--brut-danger); border-radius: 4px; }

/* ===== SPINNER ===== */
.brut-spinner {
  width: 32px; height: 32px;
  border: 4px solid var(--brut-bg-alt);
  border-top-color: var(--brut-primary);
  border-radius: 50%;
  animation: brutSpin 0.6s linear infinite;
  margin: 1rem auto;
}
.brut-spinner--sm { width: 20px; height: 20px; border-width: 3px; }
.brut-spinner--lg { width: 48px; height: 48px; border-width: 5px; }

/* ===== SKELETON ===== */
.brut-skeleton {
  background: var(--brut-bg-alt);
  border-radius: var(--brut-radius-sm);
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
  box-shadow: var(--brut-shadow);
  transition: all var(--brut-transition);
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
  box-shadow: var(--brut-shadow-sm);
  transition: all var(--brut-transition);
  display: flex; align-items: center; justify-content: center;
}
.brut-back-to-top:hover { box-shadow: 6px 6px 0px var(--brut-border); transform: translate(-2px, -2px); }

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
  background: transparent;
  border: 2px solid transparent;
  padding: 10px 20px;
  border-radius: 6px;
  color: var(--brut-text-muted);
  cursor: pointer;
  font-weight: 700;
  font-size: 0.9rem;
  transition: all var(--brut-transition);
}
.brut-tab:hover { color: var(--brut-text); background: var(--brut-surface); }
.brut-tab--active {
  background: var(--brut-surface);
  color: var(--brut-text);
  border-color: var(--brut-border);
  box-shadow: var(--brut-shadow-sm);
}
.brut-tab-panel {
  display: none;
  padding: var(--brut-padding);
  background: var(--brut-surface);
  border: var(--brut-border-w) solid var(--brut-border);
  border-top: none;
  border-radius: 0 0 var(--brut-radius) var(--brut-radius);
}
.brut-tab-panel--active { display: block; animation: brutFadeIn 0.25s ease; }

/* ===== ACCORDION ===== */
.brut-accordion { display: flex; flex-direction: column; gap: 0.5rem; }
.brut-accordion-item {
  background: var(--brut-surface);
  border: var(--brut-border-w) solid var(--brut-border);
  border-radius: var(--brut-radius-sm);
  overflow: hidden;
  box-shadow: var(--brut-shadow-sm);
}
.brut-accordion-header {
  padding: 14px 18px;
  cursor: pointer;
  font-weight: 700;
  list-style: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: background var(--brut-transition);
}
.brut-accordion-header:hover { background: var(--brut-bg-alt); }
.brut-accordion-header::-webkit-details-marker { display: none; }
.brut-accordion-header::after { content: '+'; font-size: 1.2rem; font-weight: 700; transition: transform var(--brut-transition); }
.brut-accordion-item[open] .brut-accordion-header::after { transform: rotate(45deg); }
.brut-accordion-body { padding: 0 18px 14px; }

/* ===== TABLE ===== */
.brut-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.95rem;
  border: var(--brut-border-w) solid var(--brut-border);
}
.brut-table th, .brut-table td {
  padding: 12px 16px;
  text-align: left;
  border-bottom: var(--brut-border-w) solid var(--brut-border);
}
.brut-table th {
  font-weight: 800;
  background: var(--brut-primary);
  color: #fff;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}
.brut-table tr:last-child td { border-bottom: none; }
.brut-table tr:hover td { background: var(--brut-bg-alt); }

/* ===== LIST ===== */
.brut-list { list-style: none; padding: 0; display: flex; flex-direction: column; gap: 0.5rem; }
.brut-list li {
  padding: 8px 12px;
  border-radius: var(--brut-radius-sm);
  border: 2px solid transparent;
  transition: all var(--brut-transition);
}
.brut-list li:hover {
  background: var(--brut-bg-alt);
  border-color: var(--brut-border);
}

/* ===== BREADCRUMB ===== */
.brut-breadcrumb {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  flex-wrap: wrap;
  font-size: 0.9rem;
  font-weight: 600;
}
.brut-breadcrumb a { color: var(--brut-text-muted); text-decoration: none; }
.brut-breadcrumb a:hover { color: var(--brut-primary); text-decoration: underline; }
.brut-breadcrumb span { color: var(--brut-text); font-weight: 800; }

/* ===== PAGINATION ===== */
.brut-pagination { display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap; }
.brut-pagination button {
  background: var(--brut-surface);
  border: var(--brut-border-w) solid var(--brut-border);
  border-radius: var(--brut-radius-sm);
  padding: 8px 14px;
  color: var(--brut-text);
  cursor: pointer;
  font-weight: 700;
  box-shadow: var(--brut-shadow-sm);
  transition: all var(--brut-transition);
}
.brut-pagination button:hover { box-shadow: 6px 6px 0px var(--brut-border); transform: translate(-1px, -1px); }
.brut-pagination button:active { box-shadow: 1px 1px 0px var(--brut-border); transform: translate(3px, 3px); }
.brut-pagination button.active { background: var(--brut-primary); color: #fff; }

/* ===== MENU ===== */
.brut-menu { display: flex; flex-direction: column; gap: 0.25rem; }
.brut-menu a, .brut-menuitem {
  padding: 10px 16px;
  border-radius: var(--brut-radius-sm);
  color: var(--brut-text);
  font-weight: 600;
  text-decoration: none;
  transition: all var(--brut-transition);
  cursor: pointer;
}
.brut-menu a:hover, .brut-menuitem:hover {
  background: var(--brut-bg-alt);
  border: 2px solid var(--brut-border);
}

/* ===== DETAILS ===== */
.brut-details { border-radius: var(--brut-radius-sm); overflow: hidden; border: var(--brut-border-w) solid var(--brut-border); }
.brut-summary { padding: 12px 16px; cursor: pointer; font-weight: 700; background: var(--brut-bg-alt); }

/* ===== DIVIDER ===== */
.brut-divider {
  border: none;
  height: var(--brut-border-w);
  background: var(--brut-border);
  margin: 1.5rem 0;
}

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
.brut-corner { position: relative; }
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
.brut-image {
  border: var(--brut-border-w) solid var(--brut-border);
  border-radius: var(--brut-radius-sm);
  max-width: 100%;
}
.brut-figure { margin: 1rem 0; text-align: center; }
.brut-figure figcaption { font-size: 0.85rem; color: var(--brut-text-muted); margin-top: 0.5rem; font-weight: 600; }
.brut-video { border: var(--brut-border-w) solid var(--brut-border); border-radius: var(--brut-radius-sm); max-width: 100%; }
.brut-iframe { border: var(--brut-border-w) solid var(--brut-border); border-radius: var(--brut-radius-sm); width: 100%; }

/* ===== ICON ===== */
.brut-icon { display: inline-flex; align-items: center; justify-content: center; width: 1.2em; height: 1.2em; }

/* ===== TOOLTIP ===== */
.brut-tooltip { position: relative; display: inline-block; cursor: pointer; }
.brut-tooltip::after {
  content: attr(data-tooltip);
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: var(--brut-border);
  color: var(--brut-bg);
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity var(--brut-transition);
  margin-bottom: 4px;
}
.brut-tooltip:hover::after { opacity: 1; }

/* ===== DROPDOWN ===== */
.brut-dropdown { position: relative; display: inline-block; }
.brut-dropdown-content {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 100;
  min-width: 200px;
  background: var(--brut-surface);
  border: var(--brut-border-w) solid var(--brut-border);
  border-radius: var(--brut-radius-sm);
  padding: 0.5rem;
  box-shadow: var(--brut-shadow);
  display: none;
}
.brut-dropdown:hover .brut-dropdown-content { display: block; }

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
.brut-carousel {
  overflow: hidden;
  position: relative;
  border: var(--brut-border-w) solid var(--brut-border);
  border-radius: var(--brut-radius);
}
.brut-carousel-item { display: none; }
.brut-carousel-item.active { display: block; animation: brutFadeIn 0.3s ease; }
`

function injectCSS() {
  if (typeof document === 'undefined') return
  if (document.getElementById('unify-brut-css')) return
  const style = document.createElement('style')
  style.id = 'unify-brut-css'
  style.textContent = brutalismCSS
  document.head.appendChild(style)

  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap'
  document.head.appendChild(link)
}

function applyTheme(theme) {
  if (typeof document === 'undefined') return
  document.documentElement.setAttribute('data-theme', theme)
  try { localStorage.setItem('unify-theme', theme) } catch {}
}

function getTheme() {
  try { return localStorage.getItem('unify-theme') || 'light' } catch { return 'light' }
}

function toggleTheme() {
  const current = getTheme()
  const next = current === 'dark' ? 'light' : 'dark'
  applyTheme(next)
  return next
}

class ThemeToggle {
  constructor(options = {}) {
    this.el = null
    this.onToggle = options.onToggle || null
  }

  mount(parent) {
    injectCSS()
    const btn = document.createElement('button')
    btn.className = 'brut-toggle'
    btn.setAttribute('aria-label', 'Toggle theme')
    btn.innerHTML = getTheme() === 'dark'
      ? '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>'
      : '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>'
    btn.addEventListener('click', () => {
      const theme = toggleTheme()
      btn.innerHTML = theme === 'dark'
        ? '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>'
        : '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>'
      if (this.onToggle) this.onToggle(theme)
    })
    parent.appendChild(btn)
    this.el = btn
    return btn
  }
}

const _translations = new Map()

function setTranslations(lang, dict) {
  _translations.set(lang, dict)
}

function t(key, lang) {
  const dict = _translations.get(lang) || {}
  return dict[key] || key
}

function applyLanguage(lang) {
  if (typeof document === 'undefined') return
  document.documentElement.setAttribute('lang', lang)
  try { localStorage.setItem('unify-lang', lang) } catch {}
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n')
    el.textContent = t(key, lang)
  })
}

function getLanguage() {
  try { return localStorage.getItem('unify-lang') || 'en' } catch { return 'en' }
}

function toggleLanguage(options = {}) {
  const langs = options.languages || ['en', 'fr', 'es']
  const current = getLanguage()
  const idx = langs.indexOf(current)
  const next = langs[(idx + 1) % langs.length]
  applyLanguage(next)
  return next
}

class LanguageToggle {
  constructor(options = {}) {
    this.el = null
    this.languages = options.languages || ['en', 'fr', 'es']
    this.labels = options.labels || { en: 'EN', fr: 'FR', es: 'ES' }
    this.onToggle = options.onToggle || null
  }

  mount(parent) {
    injectCSS()
    const btn = document.createElement('button')
    btn.className = 'brut-toggle'
    btn.setAttribute('aria-label', 'Toggle language')
    btn.style.fontWeight = '800'
    btn.style.fontSize = '0.85rem'
    const current = getLanguage()
    btn.textContent = this.labels[current] || current.toUpperCase()
    btn.addEventListener('click', () => {
      const lang = toggleLanguage({ languages: this.languages })
      btn.textContent = this.labels[lang] || lang.toUpperCase()
      if (this.onToggle) this.onToggle(lang)
    })
    parent.appendChild(btn)
    this.el = btn
    return btn
  }
}

class BrutalismUI {
  constructor(options = {}) {
    this.options = options
    injectCSS()
    const savedTheme = getTheme()
    applyTheme(savedTheme)
    const savedLang = getLanguage()
    applyLanguage(savedLang)
  }

  card(content, options = {}) {
    const div = document.createElement('div')
    div.className = 'brut-card' + (options.pressed ? ' brut-card--pressed' : '') + (options.hover ? ' brut-card--hover' : '')
    if (options.onClick) {
      div.style.cursor = 'pointer'
      div.addEventListener('click', options.onClick)
    }
    if (typeof content === 'string') div.innerHTML = content
    else if (content instanceof HTMLElement) div.appendChild(content)
    return div
  }

  button(text, options = {}) {
    const btn = document.createElement('button')
    btn.className = 'brut-button' + (options.variant ? ' brut-button--' + options.variant : '')
    btn.textContent = text
    if (options.onClick) btn.addEventListener('click', options.onClick)
    if (options.className) btn.classList.add(options.className)
    return btn
  }

  input(placeholder = '', options = {}) {
    const input = document.createElement('input')
    input.className = 'brut-input'
    input.placeholder = placeholder
    if (options.type) input.type = options.type
    if (options.onInput) input.addEventListener('input', options.onInput)
    return input
  }

  nav(items) {
    const nav = document.createElement('nav')
    nav.className = 'brut-nav'
    for (const item of items) {
      const a = document.createElement('a')
      a.textContent = item.label
      a.href = item.href || '#'
      a.className = 'brut-link'
      if (item.onClick) a.addEventListener('click', (e) => { e.preventDefault(); item.onClick() })
      nav.appendChild(a)
    }
    return nav
  }

  page(children) {
    const container = document.createElement('div')
    container.className = 'brut-page'
    if (Array.isArray(children)) children.forEach(c => container.appendChild(c))
    else if (children instanceof HTMLElement) container.appendChild(children)
    return container
  }
}

module.exports = {
  brutalismCSS,
  injectCSS,
  applyTheme,
  getTheme,
  toggleTheme,
  ThemeToggle,
  setTranslations,
  t,
  applyLanguage,
  getLanguage,
  toggleLanguage,
  LanguageToggle,
  BrutalismUI
}