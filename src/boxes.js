SVG.Box = SVG.invent({
  create: function (source) {
    var base = [0, 0, 0, 0]
    source = typeof source === 'string' ? source.split(SVG.regex.delimiter).map(parseFloat)
      : Array.isArray(source) ? source
      : typeof source === 'object' ? [source.left != null ? source.left
      : source.x, source.top != null ? source.top : source.y, source.width, source.height]
      : arguments.length === 4 ? [].slice.call(arguments)
      : base

    this.x = source[0]
    this.y = source[1]
    this.width = source[2]
    this.height = source[3]

    // add center, right, bottom...
    fullBox(this)
  },
  extend: {
    // Merge rect box with another, return a new instance
    merge: function (box) {
      var x = Math.min(this.x, box.x)
      var y = Math.min(this.y, box.y)

      return new SVG.Box(
        x, y,
        Math.max(this.x + this.width, box.x + box.width) - x,
        Math.max(this.y + this.height, box.y + box.height) - y
      )
    },

    transform: function (m) {
      var xMin = Infinity
      var xMax = -Infinity
      var yMin = Infinity
      var yMax = -Infinity

      var pts = [
        new SVG.Point(this.x, this.y),
        new SVG.Point(this.x2, this.y),
        new SVG.Point(this.x, this.y2),
        new SVG.Point(this.x2, this.y2)
      ]

      pts.forEach(function (p) {
        p = p.transform(m)
        xMin = Math.min(xMin, p.x)
        xMax = Math.max(xMax, p.x)
        yMin = Math.min(yMin, p.y)
        yMax = Math.max(yMax, p.y)
      })

      return new SVG.Box(
        xMin, yMin,
        xMax - xMin,
        yMax - yMin
      )
    },

    addOffset: function () {
      // offset by window scroll position, because getBoundingClientRect changes when window is scrolled
      this.x += window.pageXOffset
      this.y += window.pageYOffset
      return this
    },
    toString: function () {
      return this.x + ' ' + this.y + ' ' + this.width + ' ' + this.height
    },
    morph: function (x, y, width, height) {
      this.destination = new SVG.Box(x, y, width, height)
      return this
    },

    at: function (pos) {
      if (!this.destination) return this

      return new SVG.Box(
          this.x + (this.destination.x - this.x) * pos
        , this.y + (this.destination.y - this.y) * pos
        , this.width + (this.destination.width - this.width) * pos
        , this.height + (this.destination.height - this.height) * pos
      )
    }
  },

    // Define Parent
  parent: SVG.Element,

  // Constructor
  construct: {
    // Get bounding box
    bbox: function () {
      var box

      try {
        // find native bbox
        box = this.node.getBBox()

        if (isNulledBox(box) && !domContains(this.node)) {
          throw new Exception('Element not in the dom')
        }
      } catch (e) {
        try {
          var clone = this.clone(SVG.parser().svg).show()
          box = clone.node.getBBox()
          clone.remove()
        } catch (e) {
          console.warn('Getting a bounding box of this element is not possible')
        }
      }

      return new SVG.Box(box)
    },

    rbox: function (el) {
      // IE11 throws an error when element not in dom
      try {
        var box = new SVG.Box(this.node.getBoundingClientRect())
        if (el) return box.transform(el.screenCTM().inverse())
        return box.addOffset()
      } catch (e) {
        return new SVG.Box()
      }
    }
  }
})

SVG.extend([SVG.Doc, SVG.Nested, SVG.Symbol, SVG.Image, SVG.Pattern, SVG.Marker, SVG.ForeignObject, SVG.View], {
  viewbox: function (x, y, width, height) {
    // act as getter
    if (x == null) return new SVG.Box(this.attr('viewBox'))

    // act as setter
    return this.attr('viewBox', new SVG.Box(x, y, width, height))
  }
})
