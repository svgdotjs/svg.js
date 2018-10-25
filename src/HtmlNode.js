import {makeInstance} from './helpers.js'
import EventTarget from './EventTarget.js'

export default class HtmlNode extends EventTarget {
  constructor (element) {
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

  getEventTarget () {
    return this.node
  }
}
