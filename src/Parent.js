import {makeInstance, adopt} from './adopter.js'
import {map} from './utils.js'


// Returns all child elements
export function children () {
  return map(this.node.children, function (node) {
    return adopt(node)
  })
}

// Add given element at a position
export function add (element, i) {
  element = makeInstance(element)

  if (element.node !== this.node.children[i]) {
    this.node.insertBefore(element.node, this.node.children[i] || null)
  }

  return this
}

// Basically does the same as `add()` but returns the added element instead
export function put (element, i) {
  this.add(element, i)
  return element.instance || element
}

// Checks if the given element is a child
export function has (element) {
  return this.index(element) >= 0
}

// Gets index of given element
export function index (element) {
  return [].slice.call(this.node.children).indexOf(element.node)
}

// Get a element at the given index
export function get (i) {
  return adopt(this.node.children[i])
}

// Get first child
export function first () {
  return this.get(0)
}

// Get the last child
export function last () {
  return this.get(this.node.children.length - 1)
}

// Iterates over all children and invokes a given block
export function each (block, deep) {
  var children = this.children()
  var i, il

  for (i = 0, il = children.length; i < il; i++) {
    if (children[i] instanceof Base) {
      block.apply(children[i], [i, children])
    }

    if (deep && (children[i] instanceof Base && children[i].is('Parent'))) {
      children[i].each(block, deep)
    }
  }

  return this
}

// Remove a given child
export function removeElement (element) {
  this.node.removeChild(element.node)

  return this
}

// Remove all elements in this container
export function clear () {
  // remove children
  while (this.node.hasChildNodes()) {
    this.node.removeChild(this.node.lastChild)
  }

  // remove defs reference
  delete this._defs

  return this
}

// Import raw svg
export function svg (svg) {
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
export function writeDataToDom () {
  // dump variables recursively
  this.each(function () {
    this.writeDataToDom()
  })

  // remove previously set data
  this.node.removeAttribute('svgjs:data')

  if (Object.keys(this.dom).length) {
    this.node.setAttribute('svgjs:data', JSON.stringify(this.dom)) // see #428
  }
  return this
}

export function flatten (parent) {
  this.each(function () {
    if (this.is('Parent')) return this.flatten(parent).ungroup(parent)
    return this.toParent(parent)
  })

  // we need this so that Doc does not get removed
  this.node.firstElementChild || this.remove()

  return this
}

export function ungroup (parent) {
  parent = parent || this.parent()

  this.each(function () {
    return this.toParent(parent)
  })

  this.remove()

  return this
}
