# 🚀 ChordCode — High-Performance Browser Code Editor

A VS Code–inspired, keyboard-driven browser code editor designed to demonstrate advanced JavaScript event handling, state management, and performance optimization techniques.

This project focuses on mastering:

* `keydown` vs `input` event handling
* Complex keyboard shortcuts
* Undo/Redo stack management
* IME composition events
* Debounced performance optimization
* Cross-platform modifier key handling (Ctrl / Cmd)
* Dockerized frontend deployment

---

## 📌 Features

### 🎹 Advanced Keyboard Shortcuts

* ✅ **Ctrl+S / Cmd+S** → Save action (prevents browser default)
* ✅ **Ctrl+Z / Cmd+Z** → Undo
* ✅ **Ctrl+Shift+Z / Cmd+Shift+Z** → Redo
* ✅ **Tab** → Indent current line (2 spaces)
* ✅ **Shift+Tab** → Outdent
* ✅ **Enter** → Preserve indentation level
* ✅ **Ctrl+/ / Cmd+/** → Toggle comment (`//`)
* ✅ **Ctrl+K → Ctrl+C** → Two-step chord shortcut (within 2 seconds)

---

### 🧠 Intelligent State Management

* Custom Undo/Redo stack implementation
* Tracks every text modification
* Clears redo stack on new input
* Exposed testing API:

```js
window.getEditorState()
```

Returns:

```js
{
  content: string,
  historySize: number
}
```

---

### ⚡ Performance Optimization

Simulated syntax highlighting logic is debounced (200ms) to prevent excessive executions during rapid typing.

Verification API:

```js
window.getHighlightCallCount()
```

Ensures highlight runs only once during rapid input bursts.

---

### 🧾 Real-Time Event Debug Dashboard

Logs the following events:

* `keydown`
* `input`
* `compositionstart`
* `compositionupdate`
* `compositionend`
* Custom action logs (Save, Undo, Redo, Indent, Toggle Comment, Chord Success)

Each log entry includes:

```html
data-test-id="event-log-entry"
```

This enables automated verification without parsing the entire DOM.

---

### 🌍 Cross-Platform Support

Shortcuts work correctly on:

* Windows (Ctrl)
* Linux (Ctrl)
* macOS (Cmd / Meta)

Platform detection handled using:

```js
navigator.platform
```

---

### ♿ Accessibility (A11Y)

The editor uses:

```html
contenteditable="true"
role="textbox"
aria-multiline="true"
```

* Fully keyboard-navigable
* Tab behavior customized to remain inside the editor
* Compatible with screen readers

---

## 🐳 Dockerized Deployment

The project is fully containerized using Docker and Docker Compose.

Includes:

* `Dockerfile`
* `docker-compose.yml`
* Healthcheck configuration
* Port mapping

### Run with Docker

```bash
docker-compose up --build -d
```

Access the application at:

```
http://localhost:3000
```

---

## 🏁 Run Locally (Without Docker)

```bash
cd browser-editor
npm install
npm run dev
```

---

## 📁 Project Structure

```
ChordCode/
│
├── docker-compose.yml
├── .env.example
├── .gitignore
├── README.md
│
└── browser-editor/
    ├── Dockerfile
    ├── index.html
    ├── package.json
    ├── src/
        ├── main.js
        ├── style.css
```

---

## 🛠 Tech Stack

* Vanilla JavaScript
* Vite
* Docker
* HTML5
* CSS3

---

## 🎯 Core Learning Outcomes

This project demonstrates strong understanding of:

* Browser event lifecycle
* Preventing default browser behaviors
* Managing complex keyboard shortcuts
* Undo/Redo state architecture
* Debouncing performance-heavy logic
* Cross-platform modifier handling
* Containerized frontend development

---

## 🧪 Verification APIs

For automated testing:

### Editor State

```js
window.getEditorState()
```

### Highlight Call Counter

```js
window.getHighlightCallCount()
```

---

## 👩‍💻 Author

**Badam Harshitha**

GitHub Repository:
[https://github.com/badamarshitha/ChordCode](https://github.com/badamarshitha/ChordCode)

---


