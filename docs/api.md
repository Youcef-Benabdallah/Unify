# Unify API Reference

## Runtime API (browser)

### `unify.createElement(tag, props, children)`
Create a DOM element.

### `unify.createToggle(label, toggleFn)`
Create a neumorphic toggle button.

### `unify.fragment(children)`
Create a fragment container.

### `unify.html(str)`
Parse HTML string into a document fragment.

### `unify.script(str)`
Create a script element.

### `unify.style(str)`
Create a style element.

### `unify.render(component, container)`
Render a component into a container.

### `unify.mount(component, selector)`
Mount a component to the DOM.

## Built-in Components

### `ThemeToggle`
Dark/light theme toggle button.

### `LanguageToggle`
Language toggle button.

## Configuration (unify.conf)

```json
{
  "port": 6710,
  "tailwind": false,
  "typescript": false,
  "theme": {
    "neumorphic": true,
    "primary": "#6c5ce7"
  }
}
```

## CLI

```
unify dev              Port 6710
unify build            Static HTML/CSS/JS output
unify init [name]      New project
unify init [--ts]      With TypeScript
unify init [--tw]      With Tailwind CSS
unify new <name>       New page
unify ai [prompt]      AI assistant
```
