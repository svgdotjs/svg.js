import { globals } from '../../utils/window.js'

// Create plain text node
export function plain (text) {
  // clear if build mode is disabled
  if (this._build === false) {
    this.clear()
  }

  // create text node
  this.node.appendChild(globals.document.createTextNode(text))

  return this
}

// Get length of text element
export function length () {
  return this.node.getComputedTextLength()
}
