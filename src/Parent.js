import {makeInstance} from './helpers.js'
import Element from './Element.js'
import {adopt} from './tools.js'
import {map} from './utils.js'

export default class Parent extends Element {
  // Returns all child elements
  children () {
    return map(this.node.children, function (node) {
      return adopt(node)
    })
  }

  // Add given element at a position
  add (element, i) {
    element = makeInstance(element)

    if (element.node !== this.node.children[i]) {
      this.node.insertBefore(element.node, this.node.children[i] || null)
    }

    return this
  }

  // Basically does the same as `add()` but returns the added element instead
  put (element, i) {
    this.add(element, i)
    return element.instance || element
  }

  // Checks if the given element is a child
  has (element) {
    return this.index(element) >= 0
  }

  // Gets index of given element
  index (element) {
    return [].slice.call(this.node.children).indexOf(element.node)
  }

  // Get a element at the given index
  get (i) {
    return adopt(this.node.children[i])
  }

  // Get first child
  first () {
    return this.get(0)
  }

  // Get the last child
  last () {
    return this.get(this.node.children.length - 1)
  }

  // Iterates over all children and invokes a given block
  each (block, deep) {
    var children = this.children()
    var i, il

    for (i = 0, il = children.length; i < il; i++) {
      if (children[i] instanceof Element) {
        block.apply(children[i], [i, children])
      }

      if (deep && (children[i] instanceof Parent)) {
        children[i].each(block, deep)
      }
    }

    return this
  }

  // Remove a given child
  removeElement (element) {
    this.node.removeChild(element.node)

    return this
  }

  // Remove all elements in this container
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
