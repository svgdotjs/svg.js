import {
  adopt,
  assignNewId,
  eid,
  extend,
  makeInstance,
  create,
  register
} from '../utils/adopter.js'
import { find, findOne } from '../modules/core/selector.js'
import { globals } from '../utils/window.js'
import { map } from '../utils/utils.js'
import { ns } from '../modules/core/namespaces.js'
import EventTarget from '../types/EventTarget.js'
import List from '../types/List.js'
import attr from '../modules/core/attr.js'

export default class Dom extends EventTarget {
  constructor (node, attrs) {
    super(node)
    this.node = node
    this.type = node.nodeName

    if (attrs && node !== attrs) {
      this.attr(attrs)
    }
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
    return new List(map(this.node.children, function (node) {
      return adopt(node)
    }))
  }

  // Remove all elements in this container
  clear () {
    // remove children
    while (this.node.hasChildNodes()) {
      this.node.removeChild(this.node.lastChild)
    }

    return this
  }

  // Clone element
  clone () {
    // write dom data to the dom so the clone can pickup the data
    this.writeDataToDom()

    // clone element and assign new id
    return assignNewId(this.node.cloneNode(true))
  }

  // Iterates over all children and invokes a given block
  each (block, deep) {
    var children = this.children()
    var i, il

    for (i = 0, il = children.length; i < il; i++) {
      block.apply(children[i], [ i, children ])

      if (deep) {
        children[i].each(block, deep)
      }
    }

    return this
  }

  element (nodeName) {
    return this.put(new Dom(create(nodeName)))
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

  // Returns the parent element instance
  parent (type) {
    var parent = this

    // check for parent
    if (!parent.node.parentNode) return null

    // get parent element
    parent = adopt(parent.node.parentNode)

    if (!type) return parent

    // loop trough ancestors if type is given
    while (parent) {
      if (typeof type === 'string' ? parent.matches(type) : parent instanceof type) return parent
      if (!parent.node.parentNode || parent.node.parentNode.nodeName === '#document' || parent.node.parentNode.nodeName === '#document-fragment') return null // #759, #720
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

  // Replace this with element
  replace (element) {
    element = makeInstance(element)
    this.node.parentNode.replaceChild(element.node, this.node)
    return element
  }

  round (precision = 2, map) {
    const factor = 10 ** precision
    const attrs = this.attr()

    // If we have no map, build one from attrs
    if (!map) {
      map = Object.keys(attrs)
    }

    // Holds rounded attributes
    const newAttrs = {}
    map.forEach((key) => {
      newAttrs[key] = Math.round(attrs[key] * factor) / factor
    })

    this.attr(newAttrs)
    return this
  }

  // Return id on string conversion
  toString () {
    return this.id()
  }

  // Import raw svg
  svg (svgOrFn, outerHTML) {
    var well, len, fragment

    if (svgOrFn === false) {
      outerHTML = false
      svgOrFn = null
    }

    // act as getter if no svg string is given
    if (svgOrFn == null || typeof svgOrFn === 'function') {
      // The default for exports is, that the outerNode is included
      outerHTML = outerHTML == null ? true : outerHTML

      // write svgjs data to the dom
      this.writeDataToDom()
      let current = this

      // An export modifier was passed
      if (svgOrFn != null) {
        current = adopt(current.node.cloneNode(true))

        // If the user wants outerHTML we need to process this node, too
        if (outerHTML) {
          const result = svgOrFn(current)
          current = result || current

          // The user does not want this node? Well, then he gets nothing
          if (result === false) return ''
        }

        // Deep loop through all children and apply modifier
        current.each(function () {
          const result = svgOrFn(this)
          const _this = result || this

          // If modifier returns false, discard node
          if (result === false) {
            this.remove()

            // If modifier returns new node, use it
          } else if (result && this !== _this) {
            this.replace(_this)
          }
        }, true)
      }

      // Return outer or inner content
      return outerHTML
        ? current.node.outerHTML
        : current.node.innerHTML
    }

    // Act as setter if we got a string

    // The default for import is, that the current node is not replaced
    outerHTML = outerHTML == null ? false : outerHTML

    // Create temporary holder
    well = globals.document.createElementNS(ns, 'svg')
    fragment = globals.document.createDocumentFragment()

    // Dump raw svg
    well.innerHTML = svgOrFn

    // Transplant nodes into the fragment
    for (len = well.children.length; len--;) {
      fragment.appendChild(well.firstElementChild)
    }

    const parent = this.parent()

    // Add the whole fragment at once
    return outerHTML
      ? this.replace(fragment) && parent
      : this.add(fragment)
  }

  words (text) {
    // This is faster than removing all children and adding a new one
    this.node.textContent = text
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

extend(Dom, { attr, find, findOne })
register(Dom, 'Dom')
