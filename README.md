# Unify

A neo-brutalism .uix component framework for building modern web applications. Zero-config, no build step, file-based routing, built-in HMR dev server, and static site export.

```bash
npm install -g @youcef-dev/unifyui
unify init my-app
cd my-app
unify dev
```

## Features

- **.uix Components** — Declarative custom tags (App, Nav, Card, Button, Table, Form, etc.) that compile to clean HTML/CSS/JS. No JSX, no template language — just structured components with attributes and children.
- **Neo-Brutalism Design** — Bold borders, high contrast, thick outlines, geometric shapes. Every component ships with opinionated brutalism styling that you can override via props or CSS.
- **Dev Server with HMR** — File changes hot-swap content without full page reload. WebSocket-driven. Compile errors appear as in-browser toasts.
- **Static Site Builder** — `unify build` outputs a full static site to `dist/` with all pages, assets, and client-side routing.
- **Lucide Icons** — Use any Lucide icon by name directly in .uix components.
- **File-Based Routing** — Each file in `pages/` becomes a route (`/`, `/about`, `/blog`).
- **Built-In Theme Toggle** — Light/dark mode with a single ThemeToggle component.
- **Multi-Language** — Language toggle with locale files in `locales/`. RTL support for Arabic.
- **AI Assistant** — `unify ai` opens an interactive coding assistant powered by Ollama (local LLM).
- **CLI** — `unify dev`, `unify build`, `unify init`, `unify new`, `unify ai`, `unify help`.

## Getting Started

### Install

```bash
npm install -g @youcef-dev/unifyui
```

### Create a Project

```bash
unify init my-app
cd my-app
```

This scaffolds:

```
my-app/
  pages/
    index.uix      # Home page
  locales/
    en.json        # English translations
    fr.json        # French translations
  public/          # Static assets
  unify.conf       # Project configuration
```

### Start Dev Server

```bash
unify dev
```

Opens at `http://localhost:6710` with HMR.

### Build for Production

```bash
unify build
```

Outputs static files to `dist/`.

## Configuration

Project settings go in `unify.conf`:

```conf
port: 6710
tailwind: false
typescript: false

theme {
  mode: light
  brutalism: true
  primary: "#7c3aed"
  secondary: "#fbbf24"
}

languages: ["en", "fr", "ar"]
defaultLang: "en"

dev {
  hmr: true
  openBrowser: false
}

ai {
  enabled: false
  model: "llama3.2"
}
```

## .uix Component Syntax

```
Meta {
  title: "My Page"
  theme: dark
}

Page {
  Nav {
    brand: "My App"
    Link { href: "/"; text: "Home" }
    ThemeToggle
  }

  Container {
    H1 { text: "Hello World" }
    Button { variant: primary; "Click Me" }
  }
}
```

### Available Components

Layout: App, Page, Section, Container, Grid, Flex, Row, Col, Stack, Center, Wrapper, Main, Aside, Article, Nav, Sidebar, Hero, Feature, Box, Group, Cluster

Typography: H1-H6, Text, P, Lead, Strong, Em, Small, Mark, Code, Pre, Blockquote, Kbd, Br, Hr

Forms: Form, Label, Input, Textarea, Select, Option, Button, Fieldset, Legend

Data: Table, Thead, Tbody, Tfoot, Tr, Th, Td, List, Ul, Ol, Li

UI: Card, Badge, Avatar, Chip, Alert, Toast, Modal, Tooltip, Dialog, Accordion, Tabs, Pagination, Breadcrumb, Spinner, Progress, Skeleton, Dropdown, Menu, Sidebar

Interactive: ThemeToggle, LanguageToggle

### Attributes & Props

Components accept attributes for styling, behavior, and content:

```
Button { variant: primary; size: lg; "Click Me" }
Card { padding: 2; shadow: true; bg: "#f0f0f0" }
```

Attribute values can be strings, numbers, booleans, colors, or theme tokens.

## Routing

Files in `pages/` map to routes:

| File | Route |
|------|-------|
| `pages/index.uix` | `/` |
| `pages/about.uix` | `/about` |
| `pages/blog/post.uix` | `/blog/post` |

Navigation uses client-side SPA routing — no full page loads.

## CLI Reference

| Command | Description |
|---------|-------------|
| `unify dev` | Start dev server (port 6710) |
| `unify build` | Build static site to `dist/` |
| `unify init <name>` | Create new project |
| `unify new <name>` | Create a new page |
| `unify ai` | AI coding assistant (Ollama) |
| `unify help` | Show help |
| `unify version` | Show version |
| `unify --docs` | Open documentation |
| `unify --contact-dev` | Contact the creator |

## Community

- **GitHub Discussions** -- https://github.com/Youcef-Benabdallah/Unify/discussions
- **Issues** -- https://github.com/Youcef-Benabdallah/Unify/issues
- **VS Code Extension** -- `vscode-uix/` in the repo. Syntax highlighting and snippets for .uix files. Install by copying the folder to `~/.vscode/extensions/` or publishing to the marketplace.

## License

MIT
