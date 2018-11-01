import {nodeOrNew} from './tools.js'
import {register} from './adopter.js'
import Base from './Base.js'
import {registerMethods} from './methods.js'


export default class Bare extends Base {
  constructor (node, inherit) {
    super(nodeOrNew(null, node), Bare)
    extend(this, inherit)
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

registerMethods('Bare', {
  // Create an element that is not described by SVG.js
  element (element, inherit) {
    let custom = createCustom(element, inherit)
    return this.put(new custom())
  }
})
