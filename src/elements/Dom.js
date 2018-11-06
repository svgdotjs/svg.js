import {
  adopt,
  assignNewId,
  eid,
  extend,
  makeInstance
} from '../utils/adopter.js'
import { map } from '../utils/utils.js'
import { ns } from '../modules/core/namespaces.js'
import EventTarget from '../types/EventTarget.js'
import attr from '../modules/core/attr.js'

export default class Dom extends EventTarget {
  constructor (node) {
    super(node)
    this.node = node
    this.type = node.nodeName
  }

  // Add given element at a position
  add (element, i) {
    element = makeInstance(element)

    if (i == null) {
      this.node.appendChild(element.node)
    } else if (element.node !== this.node.childNodes[i]) {
      this.node.insertBefore(element.node, this.node.childNodes[i])
    }

    return this
  }

  // Add element to given container and return self
  addTo (parent) {
    return makeInstance(parent).put(this)
  }

  // Returns all child elements
  children () {
    return map(this.node.children, function (node) {
      return adopt(node)
    })
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

  // Clone element
  clone (parent) {
    // write dom data to the dom so the clone can pickup the data
    this.writeDataToDom()

    // clone element and assign new id
    let clone = assignNewId(this.node.cloneNode(true))

    // insert the clone in the given parent or after myself
    if (parent) parent.add(clone)
    // FIXME: after might not be available here
    else this.after(clone)

    return clone
  }

  // Iterates over all children and invokes a given block
  each (block, deep) {
    var children = this.children()
    var i, il

    for (i = 0, il = children.length; i < il; i++) {
      block.apply(children[i], [i, children])

      if (deep) {
        children[i].each(block, deep)
      }
    }

    return this
  }

  // Get first child
  first () {
    return adopt(this.node.firstChild)
  }

  // Get a element at the given index
  get (i) {
    return adopt(this.node.childNodes[i])
  }

  getEventHolder () {
    return this.node
  }

  getEventTarget () {
    return this.node
  }

  // Checks if the given element is a child
  has (element) {
    return this.index(element) >= 0
  }

  // Get / set id
  id (id) {
    // generate new id if no id set
    if (typeof id === 'undefined' && !this.node.id) {
      this.node.id = eid(this.type)
    }

    // dont't set directly width this.node.id to make `null` work correctly
    return this.attr('id', id)
  }

  // Gets index of given element
  index (element) {
    return [].slice.call(this.node.childNodes).indexOf(element.node)
  }

  // Get the last child
  last () {
    return adopt(this.node.lastChild)
  }

  // matches the element vs a css selector
  matches (selector) {
    const el = this.node
    return (el.matches || el.matchesSelector || el.msMatchesSelector || el.mozMatchesSelector || el.webkitMatchesSelector || el.oMatchesSelector).call(el, selector)
  }

  // Returns the svg node to call native svg methods on it
  native () {
    return this.node
  }

  // Returns the parent element instance
  parent (type) {
    var parent = this

    // check for parent
    if (!parent.node.parentNode) return null

    // get parent element
    parent = adopt(parent.node.parentNode)

    if (!type) return parent

    // loop trough ancestors if type is given
    while (parent && parent.node instanceof window.SVGElement) {
      if (typeof type === 'string' ? parent.matches(type) : parent instanceof type) return parent
      parent = adopt(parent.node.parentNode)
    }
  }

  // Basically does the same as `add()` but returns the added element instead
  put (element, i) {
    this.add(element, i)
    return element
  }

  // Add element to given container and return container
  putIn (parent) {
    return makeInstance(parent).add(this)
  }

  // Remove element
  remove () {
    if (this.parent()) {
      this.parent().removeElement(this)
    }

    return this
  }

  // Remove a given child
  removeElement (element) {
    this.node.removeChild(element.node)

    return this
  }

  // Replace element
  replace (element) {
    // FIXME: after() might not be available here
    this.after(element).remove()

    return element
  }

  // Return id on string conversion
  toString () {
    return this.id()
  }

  // Import raw svg
  svg (svg) {
    var well, len

    // act as a setter if svg is given
    if (svg) {
      // create temporary holder
      well = document.createElementNS(ns, 'svg')
      // dump raw svg
      well.innerHTML = svg

      // transplant nodes
      for (len = well.children.length; len--;) {
        this.node.appendChild(well.firstElementChild)
      }

    // otherwise act as a getter
    } else {
      // write svgjs data to the dom
      this.writeDataToDom()

      return this.node.outerHTML
    }

    return this
  }

  // write svgjs data to the dom
  writeDataToDom () {
    // dump variables recursively
    this.each(function () {
      this.writeDataToDom()
    })

    return this
  }
}

extend(Dom, { attr })
