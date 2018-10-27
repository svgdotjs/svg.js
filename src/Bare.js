import {nodeOrNew} from './tools.js'

export default function Bare (element, inherit = {}) {
  let custom =  class Custom extends inherit {
    constructor (node) {
      super(nodeOrNew(element, node), Custom)
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

  extend(custom, inherit)
}

// export let constructors = {
//   // Create an element that is not described by SVG.js
//   element: function (element, inherit) {
//     let custom = createCustom(element, inherit)
//     return this.put(new custom())
//   }
// }

// extend(Parent, {
//   // Create an element that is not described by SVG.js
//   element: function (element, inherit) {
//     let custom = createCustom(element, inherit)
//     return this.put(new custom())
//   }
// })
