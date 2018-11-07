import { nodeOrNew, register } from '../utils/adopter.js'
import { registerMethods } from '../utils/methods.js'
import Container from './Container.js'

export default class Bare extends Container {
  constructor (node) {
    super(nodeOrNew(node, typeof node === 'string' ? null : node), Bare)
  }

  words (text) {
    // remove contents
    while (this.node.hasChildNodes()) {
      this.node.removeChild(this.node.lastChild)
    }

    // create text node
    this.node.appendChild(document.createTextNode(text))

    return this
  }
}

register(Bare)

registerMethods('Container', {
  // Create an element that is not described by SVG.js
  element (node, inherit) {
    return this.put(new Bare(node, inherit))
  }
})
