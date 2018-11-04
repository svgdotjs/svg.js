import Base from './Base.js'
import Defs from './Defs.js'
import { extend, nodeOrNew } from './tools.js'
import { ns, xlink, xmlns, svgjs } from './namespaces.js'
import {adopt, register} from './adopter.js'
import {registerMethods} from './methods.js'
import {remove, parent, doc} from './Element.js'

export default class Doc extends Base {
  constructor(node) {
    super(nodeOrNew('svg', node), Doc)
    this.namespace()
  }

  isRoot() {
    return !this.node.parentNode
      || !(this.node.parentNode instanceof window.SVGElement)
      || this.node.parentNode.nodeName === '#document'
  }

  // Check if this is a root svg
  // If not, call docs from this element
  doc() {
    if (this.isRoot()) return this
    return doc.call(this)
  }

  // Add namespaces
  namespace() {
    if (!this.isRoot()) return this.doc().namespace()
    return this
      .attr({ xmlns: ns, version: '1.1' })
      .attr('xmlns:xlink', xlink, xmlns)
      .attr('xmlns:svgjs', svgjs, xmlns)
  }

  // Creates and returns defs element
  defs() {
    if (!this.isRoot()) return this.doc().defs()

    return adopt(this.node.getElementsByTagName('defs')[0]) ||
      this.put(new Defs())
  }

  // custom parent method
  parent(type) {
    if (this.isRoot()) {
      return this.node.parentNode.nodeName === '#document'
        ? null
        : adopt(this.node.parentNode)
    }

    return parent.call(this, type)
  }

  // Removes the doc from the DOM
  remove() {
    if (!this.isRoot()) {
      return remove.call(this)
    }

    if (this.parent()) {
      this.parent().removeChild(this.node)
    }

    return this
  }

  clear() {
    // remove children
    while (this.node.hasChildNodes()) {
      this.node.removeChild(this.node.lastChild)
    }
    return this
  }
}

registerMethods({
  Container: {
    // Create nested svg document
    nested() {
      return this.put(new Doc())
    }
  }
})

register(Doc, 'Doc', true)
