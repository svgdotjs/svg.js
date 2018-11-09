import { nodeOrNew, register, wrapWithAttrCheck } from '../utils/adopter.js'
import { registerMethods } from '../utils/methods.js'
import Container from './Container.js'

export default class Bare extends Container {
  constructor (node, attrs) {
    super(nodeOrNew(node, typeof node === 'string' ? null : node), attrs)
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
  element: wrapWithAttrCheck(function (node) {
    return this.put(new Bare(node))
  })
})
