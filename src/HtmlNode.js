//import {makeInstance} from './adopter.js'
import Base from './Base.js'

export default class HtmlNode extends Base {
  constructor (element) {
    super(element, HtmlNode)
    this.node = element
  }

  // add (element, i) {
  //   element = makeInstance(element)
  //
  //   if (element.node !== this.node.children[i]) {
  //     this.node.insertBefore(element.node, this.node.children[i] || null)
  //   }
  //
  //   return this
  // }

  put (element, i) {
    this.add(element, i)
    return element
  }

  getEventTarget () {
    return this.node
  }
}
