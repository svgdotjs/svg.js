import {
  adopt,
  nodeOrNew,
  register,
  wrapWithAttrCheck
} from '../utils/adopter.js'
import { ns, svgjs, xlink, xmlns } from '../modules/core/namespaces.js'
import { registerMethods } from '../utils/methods.js'
import Container from './Container.js'
import Defs from './Defs.js'
import { globals } from '../utils/window.js'

export default class Svg extends Container {
  constructor (node) {
    super(nodeOrNew('svg', node), node)
    this.namespace()
  }

  isRoot () {
    return !this.node.parentNode
      || !(this.node.parentNode instanceof globals.window.SVGElement)
      || this.node.parentNode.nodeName === '#document'
  }

  // Check if this is a root svg
  // If not, call docs from this element
  root () {
    if (this.isRoot()) return this
    return super.root()
  }

  // Add namespaces
  namespace () {
    if (!this.isRoot()) return this.root().namespace()
    return this
      .attr({ xmlns: ns, version: '1.1' })
      .attr('xmlns:xlink', xlink, xmlns)
      .attr('xmlns:svgjs', svgjs, xmlns)
  }

  // Creates and returns defs element
  defs () {
    if (!this.isRoot()) return this.root().defs()

    return adopt(this.node.querySelector('defs'))
      || this.put(new Defs())
  }

  // custom parent method
  parent (type) {
    if (this.isRoot()) {
      return this.node.parentNode.nodeName === '#document'
        ? null
        : adopt(this.node.parentNode)
    }

    return super.parent(type)
  }

  clear () {
    // remove children
    while (this.node.hasChildNodes()) {
      this.node.removeChild(this.node.lastChild)
    }

    // remove defs reference
    delete this._defs

    return this
  }
}

registerMethods({
  Container: {
    // Create nested svg document
    nested: wrapWithAttrCheck(function () {
      return this.put(new Svg())
    })
  }
})

register(Svg, 'Svg', true)
