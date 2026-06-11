const fs = require('fs')
const path = require('path')

const portfolio = {
  'App.uix': `// App.uix — Personal Portfolio
Meta {
  title: "My Portfolio"
  theme: light
  lang: en
}

App {
  Nav {
    brand: "MyPortfolio"
    Link { href: "/"; text: "Home" }
    Link { href: "/projects"; text: "Projects" }
    Link { href: "/contact"; text: "Contact" }
  }

  ThemeToggle
  LanguageToggle
}`,

  'pages/index.uix': `// pages/index.uix — Home
Meta {
  title: "Home | My Portfolio"
}

Page {
  Section {
    className: "text-center py-12"
    Header { text: "Hi, I'm a Developer" }
    Text { content: "I build things for the web." }
    Text { content: "Welcome to my portfolio!" }
    Button { text: "See My Work"; click -> scrollToProjects }
  }

  Section {
    className: "mt-12"
    Header { text: "Skills" }
    Card { text: "HTML, CSS, JavaScript" }
    Card { text: "React, Node.js, Python" }
    Card { text: "UI/UX Design" }
  }
}

script {
  function scrollToProjects() {
    window.location.href = '/projects'
  }
}`,

  'pages/projects.uix': `// pages/projects.uix — Projects
Meta {
  title: "Projects | My Portfolio"
}

Page {
  Header { text: "My Projects" }

  Card {
    Header { text: "Project One" }
    Text { content: "A beautiful web app built with Unify." }
    Button { text: "View Project"; click -> () => alert('Project 1') }
  }

  Card {
    Header { text: "Project Two" }
    Text { content: "A mobile-first responsive design." }
    Button { text: "View Project"; click -> () => alert('Project 2') }
  }

  Card {
    Header { text: "Project Three" }
    Text { content: "Full-stack application with AI features." }
    Button { text: "View Project"; click -> () => alert('Project 3') }
  }
}`,

  'pages/contact.uix': `// pages/contact.uix — Contact
Meta {
  title: "Contact | My Portfolio"
}

Page {
  Header { text: "Get In Touch" }

  Card {
    Text { content: "Have a question or want to work together?" }
    Input { placeholder: "Your name"; className: "mb-4" }
    Input { placeholder: "Your email"; className: "mb-4" }
    Button { text: "Send Message"; click -> handleSubmit }
  }
}

script {
  function handleSubmit() {
    alert('Thanks for reaching out! I will get back to you soon.')
  }
}`,

  'locales/en.json': JSON.stringify({
    welcome: "Welcome to my portfolio",
    home: "Home",
    projects: "Projects",
    contact: "Contact",
    skills: "Skills"
  }, null, 2),

  'locales/fr.json': JSON.stringify({
    welcome: "Bienvenue sur mon portfolio",
    home: "Accueil",
    projects: "Projets",
    contact: "Contact",
    skills: "Compétences"
  }, null, 2),

  'unify.conf': JSON.stringify({
    port: 6710,
    tailwind: true,
    typescript: false,
    theme: { mode: "light", neumorphic: true, primary: "#6c5ce7", font: "system-ui" },
    languages: ["en", "fr"],
    meta: { title: "My Portfolio", description: "My personal portfolio built with Unify", lang: "en" }
  }, null, 2)
}

function generatePortfolio(targetDir) {
  const files = portfolio
  let count = 0

  for (const [filePath, content] of Object.entries(files)) {
    const fullPath = path.join(targetDir, filePath)
    const dir = path.dirname(fullPath)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    fs.writeFileSync(fullPath, content, 'utf-8')
    count++
  }

  return count
}

module.exports = { generatePortfolio, portfolio }
