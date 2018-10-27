/* global proportionalSize, assignNewId, createElement, matches, is */

SVG.Element = SVG.invent({
  inherit: SVG.EventTarget,

  // Initialize node
  create: function (node) {
    // event listener
    this.events = {}

    // initialize data object
    this.dom = {}

    // create circular reference
    this.node = node
    if (this.node) {
      this.type = node.nodeName
      this.node.instance = this
      this.events = node.events || {}

      if (node.hasAttribute('svgjs:data')) {
        // pull svgjs data from the dom (getAttributeNS doesn't work in html5)
        this.setData(JSON.parse(node.getAttribute('svgjs:data')) || {})
      }
    }
  },

  // Add class methods
  extend: {
    // Move over x-axis
    x: function (x) {
      return this.attr('x', x)
    },

    // Move over y-axis
    y: function (y) {
      return this.attr('y', y)
    },

    // Move by center over x-axis
    cx: function (x) {
      return x == null ? this.x() + this.width() / 2 : this.x(x - this.width() / 2)
    },

    // Move by center over y-axis
    cy: function (y) {
      return y == null
        ? this.y() + this.height() / 2
        : this.y(y - this.height() / 2)
    },

    // Move element to given x and y values
    move: function (x, y) {
      return this.x(x).y(y)
    },

    // Move element by its center
    center: function (x, y) {
      return this.cx(x).cy(y)
    },

    // Set width of element
    width: function (width) {
      return this.attr('width', width)
    },

    // Set height of element
    height: function (height) {
      return this.attr('height', height)
    },

    // Set element size to given width and height
    size: function (width, height) {
      var p = proportionalSize(this, width, height)

      return this
        .width(new SVG.Number(p.width))
        .height(new SVG.Number(p.height))
    },

    // Clone element
    clone: function (parent) {
      // write dom data to the dom so the clone can pickup the data
      this.writeDataToDom()

      // clone element and assign new id
      var clone = assignNewId(this.node.cloneNode(true))

      // insert the clone in the given parent or after myself
      if (parent) parent.add(clone)
      else this.after(clone)

      return clone
    },

    // Remove element
    remove: function () {
      if (this.parent()) { this.parent().removeElement(this) }

      return this
    },

    // Replace element
    replace: function (element) {
      this.after(element).remove()

      return element
    },

    // Add element to given container and return self
    addTo: function (parent) {
      return createElement(parent).put(this)
    },

    // Add element to given container and return container
    putIn: function (parent) {
      return createElement(parent).add(this)
    },

    // Get / set id
    id: function (id) {
      // generate new id if no id set
      if (typeof id === 'undefined' && !this.node.id) {
        this.node.id = SVG.eid(this.type)
      }

      // dont't set directly width this.node.id to make `null` work correctly
      return this.attr('id', id)
    },

    // Checks whether the given point inside the bounding box of the element
    inside: function (x, y) {
      var box = this.bbox()

      return x > box.x &&
        y > box.y &&
        x < box.x + box.width &&
        y < box.y + box.height
    },

    // Show element
    show: function () {
      return this.css('display', '')
    },

    // Hide element
    hide: function () {
      return this.css('display', 'none')
    },

    // Is element visible?
    visible: function () {
      return this.css('display') !== 'none'
    },

    // Return id on string conversion
    toString: function () {
      return this.id()
    },

    // Return array of classes on the node
    classes: function () {
      var attr = this.attr('class')
      return attr == null ? [] : attr.trim().split(SVG.regex.delimiter)
    },

    // Return true if class exists on the node, false otherwise
    hasClass: function (name) {
      return this.classes().indexOf(name) !== -1
    },

    // Add class to the node
    addClass: function (name) {
      if (!this.hasClass(name)) {
        var array = this.classes()
        array.push(name)
        this.attr('class', array.join(' '))
      }

      return this
    },

    // Remove class from the node
    removeClass: function (name) {
      if (this.hasClass(name)) {
        this.attr('class', this.classes().filter(function (c) {
          return c !== name
        }).join(' '))
      }

      return this
    },

    // Toggle the presence of a class on the node
    toggleClass: function (name) {
      return this.hasClass(name) ? this.removeClass(name) : this.addClass(name)
    },

    // Get referenced element form attribute value
    reference: function (attr) {
      return SVG.get(this.attr(attr))
    },

    // Returns the parent element instance
    parent: function (type) {
      var parent = this

      // check for parent
      if (!parent.node.parentNode) return null

      // get parent element
      parent = SVG.adopt(parent.node.parentNode)

      if (!type) return parent

      // loop trough ancestors if type is given
      while (parent && parent.node instanceof window.SVGElement) {
        if (typeof type === 'string' ? parent.matches(type) : parent instanceof type) return parent
        parent = SVG.adopt(parent.node.parentNode)
      }
    },

    // Get parent document
    doc: function () {
      var p = this.parent(SVG.Doc)
      return p && p.doc()
    },

    // Get defs
    defs: function () {
      return this.doc().defs()
    },

    // return array of all ancestors of given type up to the root svg
    parents: function (type) {
      var parents = []
      var parent = this

      do {
        parent = parent.parent(type)
        if (!parent || !parent.node) break

        parents.push(parent)
      } while (parent.parent)

      return parents
    },

    // matches the element vs a css selector
    matches: function (selector) {
      return matches(this.node, selector)
    },

    // Returns the svg node to call native svg methods on it
    native: function () {
      return this.node
    },

    // Import raw svg
    svg: function (svg) {
      var well, len

      // act as a setter if svg is given
      if (typeof svg === 'string' && this instanceof SVG.Parent) {
        // create temporary holder
        well = document.createElementNS(SVG.ns, 'svg')
        // dump raw svg
        well.innerHTML = svg

        // transplant nodes
        for (len = well.children.length; len--;) {
          this.node.appendChild(well.firstElementChild)
        }
      // otherwise act as a getter
      } else {
        // expose node modifiers
        if (typeof svg === 'function') {
          this.each(function () {
            well = svg(this)

            if (well instanceof SVG.Element) {
              this.replace(well)
            }

            if (typeof well === 'boolean' && !well) {
              this.remove()
            }
          })
        }

        // write svgjs data to the dom
        this.writeDataToDom()

        return this.node.outerHTML
      }

      return this
    },

    // write svgjs data to the dom
    writeDataToDom: function () {
      // dump variables recursively
      if (this.is(SVG.Parent)) {
        this.each(function () {
          this.writeDataToDom()
        })
      }

      // remove previously set data
      this.node.removeAttribute('svgjs:data')

      if (Object.keys(this.dom).length) {
        this.node.setAttribute('svgjs:data', JSON.stringify(this.dom)) // see #428
      }
      return this
    },

    // set given data to the elements data property
    setData: function (o) {
      this.dom = o
      return this
    },
    is: function (obj) {
      return is(this, obj)
    },
    getEventTarget: function () {
      return this.node
    }
  }
})
