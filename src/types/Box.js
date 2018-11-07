import { delimiter } from '../modules/core/regex.js'
import { registerMethods } from '../utils/methods.js'
import Point from './Point.js'
import parser from '../modules/core/parser.js'

function isNulledBox (box) {
  return !box.w && !box.h && !box.x && !box.y
}

function domContains (node) {
  return (document.documentElement.contains || function (node) {
    // This is IE - it does not support contains() for top-level SVGs
    while (node.parentNode) {
      node = node.parentNode
    }
    return node === document
  }).call(document.documentElement, node)
}

export default class Box {
  constructor (...args) {
    this.init(...args)
  }

  init (source) {
    var base = [0, 0, 0, 0]
    source = typeof source === 'string' ? source.split(delimiter).map(parseFloat)
      : Array.isArray(source) ? source
        : typeof source === 'object' ? [source.left != null ? source.left
          : source.x, source.top != null ? source.top : source.y, source.width, source.height]
          : arguments.length === 4 ? [].slice.call(arguments)
            : base

    this.x = source[0] || 0
    this.y = source[1] || 0
    this.width = this.w = source[2] || 0
    this.height = this.h = source[3] || 0

    // Add more bounding box properties
    this.x2 = this.x + this.w
    this.y2 = this.y + this.h
    this.cx = this.x + this.w / 2
    this.cy = this.y + this.h / 2
  }

  // Merge rect box with another, return a new instance
  merge (box) {
    let x = Math.min(this.x, box.x)
    let y = Math.min(this.y, box.y)
    let width = Math.max(this.x + this.width, box.x + box.width) - x
    let height = Math.max(this.y + this.height, box.y + box.height) - y

    return new Box(x, y, width, height)
  }

  transform (m) {
    let xMin = Infinity
    let xMax = -Infinity
    let yMin = Infinity
    let yMax = -Infinity

    let pts = [
      new Point(this.x, this.y),
      new Point(this.x2, this.y),
      new Point(this.x, this.y2),
      new Point(this.x2, this.y2)
    ]

    pts.forEach(function (p) {
      p = p.transform(m)
      xMin = Math.min(xMin, p.x)
      xMax = Math.max(xMax, p.x)
      yMin = Math.min(yMin, p.y)
      yMax = Math.max(yMax, p.y)
    })

    return new Box(
      xMin, yMin,
      xMax - xMin,
      yMax - yMin
    )
  }

  addOffset () {
    // offset by window scroll position, because getBoundingClientRect changes when window is scrolled
    this.x += window.pageXOffset
    this.y += window.pageYOffset
    return this
  }

  toString () {
    return this.x + ' ' + this.y + ' ' + this.width + ' ' + this.height
  }

  toArray () {
    return [this.x, this.y, this.width, this.height]
  }

  isNulled () {
    return isNulledBox(this)
  }
}

function getBox (cb) {
  let box

  try {
    box = cb(this.node)

    if (isNulledBox(box) && !domContains(this.node)) {
      throw new Error('Element not in the dom')
    }
  } catch (e) {
    try {
      let clone = this.clone().addTo(parser().svg).show()
      box = cb(clone.node)
      clone.remove()
    } catch (e) {
      console.warn('Getting a bounding box of this element is not possible')
    }
  }
  return box
}

registerMethods({
  Element: {
    // Get bounding box
    bbox () {
      return new Box(getBox.call(this, (node) => node.getBBox()))
    },

    rbox (el) {
      let box = new Box(getBox.call(this, (node) => node.getBoundingClientRect()))
      if (el) return box.transform(el.screenCTM().inverse())
      return box.addOffset()
    }
  },
  viewbox: {
    viewbox (x, y, width, height) {
      // act as getter
      if (x == null) return new Box(this.attr('viewBox'))

      // act as setter
      return this.attr('viewBox', new Box(x, y, width, height))
    }
  }
})
