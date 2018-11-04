import {proportionalSize, matcher, idFromReference} from './helpers.js'
import {makeInstance, adopt, assignNewId, eid, root, getClass} from './adopter.js'
import {delimiter} from './regex.js'
import {ns} from './namespaces.js'
import SVGNumber from './SVGNumber.js'
import {registerMethods} from './methods.js'
import {registerConstructor} from './methods.js'
import EventTarget from './EventTarget.js'

const Doc = getClass(root)

//export const name = 'Element'

export default class Element extends EventTarget {
  constructor (node) {
    super()

  // initialize data object
    this.dom = {}

  // create circular reference
    this.node = node

    this.type = node.nodeName
    this.node.instance = this

    if (node.hasAttribute('svgjs:data')) {
      // pull svgjs data from the dom (getAttributeNS doesn't work in html5)
      this.setData(JSON.parse(node.getAttribute('svgjs:data')) || {})
    }
  }

  // Move over x-axis
  x (x) {
    return this.attr('x', x)
  }

  // Move over y-axis
  y (y) {
    return this.attr('y', y)
  }

  // Move by center over x-axis
  cx (x) {
    return x == null ? this.x() + this.width() / 2 : this.x(x - this.width() / 2)
  }

  // Move by center over y-axis
  cy (y) {
    return y == null
      ? this.y() + this.height() / 2
      : this.y(y - this.height() / 2)
  }

  // Move element to given x and y values
  move (x, y) {
    return this.x(x).y(y)
  }

  // Move element by its center
  center (x, y) {
    return this.cx(x).cy(y)
  }

  // Set width of element
  width (width) {
    return this.attr('width', width)
  }

  // Set height of element
  height (height) {
    return this.attr('height', height)
  }

  // Set element size to given width and height
  size (width, height) {
    let p = proportionalSize(this, width, height)

    return this
      .width(new SVGNumber(p.width))
      .height(new SVGNumber(p.height))
  }

  // Clone element
  clone (parent) {
    // write dom data to the dom so the clone can pickup the data
    this.writeDataToDom()

    // clone element and assign new id
    let clone = assignNewId(this.node.cloneNode(true))

    // insert the clone in the given parent or after myself
    if (parent) parent.add(clone)
    else this.after(clone)

    return clone
  }

  // Remove element
  remove () {
    if (this.parent()) { this.parent().removeElement(this) }

    return this
  }

  // Replace element
  replace (element) {
    this.after(element).remove()

    return element
  }

  // Add element to given container and return self
  addTo (parent) {
    return makeInstance(parent).put(this)
  }

  // Add element to given container and return container
  putIn (parent) {
    return makeInstance(parent).add(this)
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

  // Checks whether the given point inside the bounding box of the element
  inside (x, y) {
    let box = this.bbox()

    return x > box.x &&
      y > box.y &&
      x < box.x + box.width &&
      y < box.y + box.height
  }

  // Return id on string conversion
  toString () {
    return this.id()
  }

  // Return array of classes on the node
  classes () {
    var attr = this.attr('class')
    return attr == null ? [] : attr.trim().split(delimiter)
  }

  // Return true if class exists on the node, false otherwise
  hasClass (name) {
    return this.classes().indexOf(name) !== -1
  }

  // Add class to the node
  addClass (name) {
    if (!this.hasClass(name)) {
      var array = this.classes()
      array.push(name)
      this.attr('class', array.join(' '))
    }

    return this
  }

  // Remove class from the node
  removeClass (name) {
    if (this.hasClass(name)) {
      this.attr('class', this.classes().filter(function (c) {
        return c !== name
      }).join(' '))
    }

    return this
  }

  // Toggle the presence of a class on the node
  toggleClass (name) {
    return this.hasClass(name) ? this.removeClass(name) : this.addClass(name)
  }

  // Get referenced element form attribute value
  reference (attr) {
    let id = idFromReference(this.attr(attr))
    return id ? makeInstance(id) : null
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

  // Get parent document
  doc () {
    let p = this.parent(Doc)
    return p && p.doc()
  }

  // Get defs
  defs () {
    return this.doc().defs()
  }

  // return array of all ancestors of given type up to the root svg
  parents (type) {
    let parents = []
    let parent = this

    do {
      parent = parent.parent(type)
      if (!parent || parent instanceof getClass('HtmlNode')) break

      parents.push(parent)
    } while (parent.parent)

    return parents
  }

  // matches the element vs a css selector
  matches (selector) {
    return matcher(this.node, selector)
  }

  // Returns the svg node to call native svg methods on it
  native () {
    return this.node
  }

  // Import raw svg
  svg () {
    // write svgjs data to the dom
    this.writeDataToDom()

    return this.node.outerHTML
  }

  // write svgjs data to the dom
  writeDataToDom () {
    // remove previously set data
    this.node.removeAttribute('svgjs:data')

    if (Object.keys(this.dom).length) {
      this.node.setAttribute('svgjs:data', JSON.stringify(this.dom)) // see #428
    }
    return this
  }

  // set given data to the elements data property
  setData (o) {
    this.dom = o
    return this
  }

  getEventTarget () {
    return this.node
  }
}



// registerMethods('Element', {
//   x, y, cx, cy, move, center, width, height, size, clone, remove, replace,
//   addTo, putIn, id, inside, toString, classes, hasClass, addClass, removeClass,
//   toggleClass, reference, doc, defs, parent, parents, matches, native, svg,
//   writeDataToDom, setData, getEventTarget
// })
//
// registerConstructor('Element', setup)
