import {nodeOrNew} from './tools.js'
import Parent from './Parent.js'

export default function Bare (element, inherit) {
  return class Custom extends inherit {
    constructor (node) {
      super(nodeOrNew(element, node))
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
}

export let constructors = {
  // Create an element that is not described by SVG.js
  element: function (element, inherit) {
    let custom = createCustom(element, inherit)
    return this.put(new custom())
  }
}

// extend(Parent, {
//   // Create an element that is not described by SVG.js
//   element: function (element, inherit) {
//     let custom = createCustom(element, inherit)
//     return this.put(new custom())
//   }
// })
