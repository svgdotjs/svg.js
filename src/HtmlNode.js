import {makeInstance} from './adopter.js'
import Parent from './Parent.js'
import {register} from './adopter.js'

export default class HtmlNode extends Parent {
  constructor (element) {
    super(element, HtmlNode)
    this.node = element
  }

  add (element, i) {
    element = makeInstance(element)

    if (element.node !== this.node.children[i]) {
      this.node.insertBefore(element.node, this.node.children[i] || null)
    }

    return this
  }

  put (element, i) {
    this.add(element, i)
    return element
  }

  removeElement (element) {
    this.node.removeChild(element.node)
    return this
  }

  getEventTarget () {
    return this.node
  }
}

register(HtmlNode)
