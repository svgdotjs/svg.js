import Tspan from './Tspan.js'

// Create plain text node
export function plain (text) {
  // clear if build mode is disabled
  if (this._build === false) {
    this.clear()
  }

  // create text node
  this.node.appendChild(document.createTextNode(text))

  return this
}

  // Create a tspan
export function tspan (text) {
  var tspan = new Tspan()

  // clear if build mode is disabled
  if (!this._build) {
    this.clear()
  }

  // add new tspan
  this.node.appendChild(tspan.node)

  return tspan.text(text)
}

// FIXME: Does this also work for textpath?
// Get length of text element
export function length () {
  return this.node.getComputedTextLength()
}
