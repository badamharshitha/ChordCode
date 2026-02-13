import './style.css'

const editor = document.getElementById('editor-input')
const eventLogList = document.getElementById('event-log-list')

/* ==============================
   STATE
============================== */

let content = ''
let undoStack = ['']
let redoStack = []
let highlightCallCount = 0
let chordState = false
let chordTimer = null

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
  }, 200)
}

/* ==============================
   INPUT EVENT
============================== */

editor.addEventListener('input', () => {
  content = editor.innerText
  undoStack.push(content)
  redoStack = []

  logEvent('input: content updated')
  debounceHighlight()
})

/* ==============================
   KEYDOWN SHORTCUT ENGINE
============================== */

editor.addEventListener('keydown', (event) => {
  const isMac = navigator.platform.toUpperCase().includes('MAC')
  const isModifier = isMac ? event.metaKey : event.ctrlKey

  logEvent(`keydown: ${event.key}`)

  const selection = window.getSelection()
  const range = selection.rangeCount > 0 ? selection.getRangeAt(0) : null
  const text = editor.innerText

  if (!range) return

  /* ---------------- TAB INDENT ---------------- */
  if (event.key === 'Tab') {
    event.preventDefault()

    const cursorPos = range.startOffset
    const lines = text.split('\n')

    let charCount = 0
    let lineIndex = 0

    for (let i = 0; i < lines.length; i++) {
      if (cursorPos <= charCount + lines[i].length) {
        lineIndex = i
        break
      }
      charCount += lines[i].length + 1
    }

    if (!event.shiftKey) {
      lines[lineIndex] = '  ' + lines[lineIndex]
    } else {
      if (lines[lineIndex].startsWith('  ')) {
        lines[lineIndex] = lines[lineIndex].substring(2)
      }
    }

    const newContent = lines.join('\n')
    editor.innerText = newContent
    content = newContent
    undoStack.push(content)
    redoStack = []

    logEvent(event.shiftKey ? 'Action: Outdent' : 'Action: Indent')
    return
  }

  /* ---------------- ENTER INDENTATION ---------------- */
  if (event.key === 'Enter') {
    event.preventDefault()

    const cursorPos = range.startOffset
    const beforeCursor = text.substring(0, cursorPos)
    const lines = beforeCursor.split('\n')
    const currentLine = lines[lines.length - 1]

    const indentMatch = currentLine.match(/^\s+/)
    const indent = indentMatch ? indentMatch[0] : ''

    const newText =
      text.substring(0, cursorPos) +
      '\n' +
      indent +
      text.substring(cursorPos)

    editor.innerText = newText
    content = newText
    undoStack.push(content)
    redoStack = []

    logEvent('Action: Enter Indent')
    return
  }

  /* ---------------- COMMENT TOGGLE ---------------- */
  if (isModifier && event.key === '/') {
    event.preventDefault()

    const cursorPos = range.startOffset
    const lines = text.split('\n')

    let charCount = 0
    let lineIndex = 0

    for (let i = 0; i < lines.length; i++) {
      if (cursorPos <= charCount + lines[i].length) {
        lineIndex = i
        break
      }
      charCount += lines[i].length + 1
    }

    if (lines[lineIndex].startsWith('// ')) {
      lines[lineIndex] = lines[lineIndex].substring(3)
    } else {
      lines[lineIndex] = '// ' + lines[lineIndex]
    }

    const newContent = lines.join('\n')
    editor.innerText = newContent
    content = newContent
    undoStack.push(content)
    redoStack = []

    logEvent('Action: Toggle Comment')
    return
  }

  /* ---------------- CHORD: Ctrl+K then Ctrl+C ---------------- */
  if (isModifier && event.key.toLowerCase() === 'k') {
    event.preventDefault()

    chordState = true
    logEvent('Chord Step 1: Ctrl+K')

    clearTimeout(chordTimer)
    chordTimer = setTimeout(() => {
      chordState = false
    }, 2000)

    return
  }

  if (chordState && isModifier && event.key.toLowerCase() === 'c') {
    event.preventDefault()

    chordState = false
    clearTimeout(chordTimer)

    logEvent('Action: Chord Success')
    return
  }

  /* ---------------- SAVE ---------------- */
  if (isModifier && event.key.toLowerCase() === 's') {
    event.preventDefault()
    logEvent('Action: Save')
  }

  /* ---------------- UNDO ---------------- */
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

  /* ---------------- REDO ---------------- */
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
   IME EVENTS
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
