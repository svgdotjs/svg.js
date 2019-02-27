import { register } from '../utils/adopter.js'
import Element from './Element.js'

export default class Container extends Element {
  flatten (parent) {
    this.each(function () {
      if (this instanceof Container) return this.flatten(parent).ungroup(parent)
      return this.toParent(parent)
    })

    // we need this so that the root does not get removed
    this.node.firstElementChild || this.remove()

    return this
  }

  ungroup (parent) {
    parent = parent || this.parent()

    this.each(function () {
      return this.toParent(parent)
    })

    this.remove()

    return this
  }
}

register(Container, 'Container')
