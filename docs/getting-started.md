# Unify — Getting Started

Unify is a static site framework with component-based `.uix` files, neumorphic UI, file-based routing, Tailwind CSS, and an optional AI assistant. Built by Youcef Benabdallah.

## Quick Start

```bash

# Create a new project
unify init my-project

# Enter the project

cd my-project

# Start the dev server (port 6710)

unify dev

# Build for production

unify build
```

## Project Structure

```
my-project/
  App.uix           # Root app file
  unify.conf        # Configuration
  pages/            # File-based routing
    index.uix       # Route: /
    about.uix       # Route: /about
  locales/          # i18n translations
    en.json
    fr.json
  public/           # Static assets
  dist/             # Build output
```

## .uix File Syntax


```uix
Meta {
  title: "My Page"
  theme: light
  lang: en
}

Page {
  Header { text: "Hello!" }
  Card { text: "This is easy." }
  Button { text: "Click"; click -> handleClick }
}

script {
  function handleClick() { alert("Hi!") }
}
```

## Tailwind CSS

```bash
unify init my-project --tw
```

Or set `"tailwind": true` in `unify.conf`.

## TypeScript

```bash
unify init my-project --ts
```

## Commands
----------------------------------------------------------
| Command | Description                                   |
|---------------------|-----------------------------------|
| `unify dev`         | Start dev server on port 6710     |
| `unify build`       | Build to static HTML/CSS/JS       |
| `unify init`        | Initialize project in current dir |
| `unify init <name>` | Create new project directory      |
| `unify new <name>`  | Create a new page                 |
| `unify ai`          | AI coding assistant (Ollama)      |
| `unify help`        | Show help                         |
-----------------------------------------------------------

## AI Assistant

```bash
unify ai                # Interactive session
unify ai --check        # Check if Ollama is running
unify ai "how do I create a form?"  # Quick question
```

Requires [Ollama](https://ollama.ai).

## License

MIT — Youcef Benabdallah
