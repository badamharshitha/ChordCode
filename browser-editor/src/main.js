import './style.css'

const editor = document.getElementById('editor-input')
const eventLogList = document.getElementById('event-log-list')

/* ==============================
   STATE MANAGEMENT
============================== */

let content = ''
let undoStack = ['']
let redoStack = []
let highlightCallCount = 0

/* ==============================
   LOGGING
============================== */

function logEvent(message) {
  const entry = document.createElement('div')
  entry.setAttribute('data-test-id', 'event-log-entry')
  entry.textContent = message
  eventLogList.appendChild(entry)

  eventLogList.scrollTop = eventLogList.scrollHeight
}

/* ==============================
   HIGHLIGHT (DEBOUNCED)
============================== */

function highlight() {
  highlightCallCount++
}

let highlightTimeout = null

function debounceHighlight() {
  clearTimeout(highlightTimeout)
  highlightTimeout = setTimeout(() => {
    highlight()
  }, 200) // >=150ms required
}

/* ==============================
   INPUT EVENT (Typing / Paste)
============================== */

editor.addEventListener('input', () => {
  content = editor.innerText

  undoStack.push(content)
  redoStack = []

  logEvent('input: content updated')
  debounceHighlight()
})

/* ==============================
   KEYDOWN EVENT (Shortcuts)
============================== */

editor.addEventListener('keydown', (event) => {
  const isMac = navigator.platform.toUpperCase().includes('MAC')
  const isModifier = isMac ? event.metaKey : event.ctrlKey

  logEvent(`keydown: ${event.key}`)

  /* ---------- SAVE ---------- */
  if (isModifier && event.key.toLowerCase() === 's') {
    event.preventDefault()
    logEvent('Action: Save')
  }

  /* ---------- UNDO ---------- */
  if (isModifier && event.key.toLowerCase() === 'z' && !event.shiftKey) {
    event.preventDefault()

    if (undoStack.length > 1) {
      const current = undoStack.pop()
      redoStack.push(current)

      const previous = undoStack[undoStack.length - 1]
      content = previous
      editor.innerText = previous
    }

    logEvent('Action: Undo')
  }

  /* ---------- REDO ---------- */
  if (isModifier && event.key.toLowerCase() === 'z' && event.shiftKey) {
    event.preventDefault()

    if (redoStack.length > 0) {
      const redoValue = redoStack.pop()
      undoStack.push(redoValue)

      content = redoValue
      editor.innerText = redoValue
    }

    logEvent('Action: Redo')
  }
})

/* ==============================
   COMPOSITION EVENTS (IME)
============================== */

editor.addEventListener('compositionstart', () => {
  logEvent('compositionstart')
})

editor.addEventListener('compositionupdate', () => {
  logEvent('compositionupdate')
})

editor.addEventListener('compositionend', () => {
  logEvent('compositionend')
})

/* ==============================
   EXPOSE FOR TESTING
============================== */

window.getEditorState = function () {
  return {
    content,
    historySize: undoStack.length
  }
}

window.getHighlightCallCount = function () {
  return highlightCallCount
}
