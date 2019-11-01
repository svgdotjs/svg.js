import { delimiter } from '../modules/core/regex.js'
import { globals } from '../utils/window.js'
import { register } from '../utils/adopter.js'
import { registerMethods } from '../utils/methods.js'
import Matrix from './Matrix.js'
import Point from './Point.js'
import parser from '../modules/core/parser.js'

function isNulledBox (box) {
  return !box.width && !box.height && !box.x && !box.y
}

function domContains (node) {
  return node === globals.document
    || (globals.document.documentElement.contains || function (node) {
      // This is IE - it does not support contains() for top-level SVGs
      while (node.parentNode) {
        node = node.parentNode
      }
      return node === globals.document
    }).call(globals.document.documentElement, node)
}

export default class Box {
  constructor (...args) {
    this.init(...args)
  }

  init (source) {
    var base = [ 0, 0, 0, 0 ]
    source = typeof source === 'string' ? source.split(delimiter).map(parseFloat)
      : Array.isArray(source) ? source
      : typeof source === 'object' ? [ source.left != null ? source.left
      : source.x, source.top != null ? source.top : source.y, source.width, source.height ]
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

    return this
  }

  // Merge rect box with another, return a new instance
  merge (box) {
    const x = Math.min(this.x, box.x)
    const y = Math.min(this.y, box.y)
    const width = Math.max(this.x + this.width, box.x + box.width) - x
    const height = Math.max(this.y + this.height, box.y + box.height) - y

    return new Box(x, y, width, height)
  }

  transform (m) {
    if (!(m instanceof Matrix)) {
      m = new Matrix(m)
    }

    let xMin = Infinity
    let xMax = -Infinity
    let yMin = Infinity
    let yMax = -Infinity

    const pts = [
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
    this.x += globals.window.pageXOffset
    this.y += globals.window.pageYOffset
    return this
  }

  toString () {
    return this.x + ' ' + this.y + ' ' + this.width + ' ' + this.height
  }

  toArray () {
    return [ this.x, this.y, this.width, this.height ]
  }

  isNulled () {
    return isNulledBox(this)
  }
}

function getBox (cb, retry) {
  let box

  try {
    box = cb(this.node)

    if (isNulledBox(box) && !domContains(this.node)) {
      throw new Error('Element not in the dom')
    }
  } catch (e) {
    box = retry(this)
  }

  return box
}

export function bbox () {
  return new Box(getBox.call(this, (node) => node.getBBox(), (el) => {
    try {
      const clone = el.clone().addTo(parser().svg).show()
      const box = clone.node.getBBox()
      clone.remove()
      return box
    } catch (e) {
      throw new Error('Getting bbox of element "' + el.node.nodeName + '" is not possible. ' + e.toString())
    }
  }))
}

export function rbox (el) {
  const box = new Box(getBox.call(this, (node) => node.getBoundingClientRect(), (el) => {
    throw new Error('Getting rbox of element "' + el.node.nodeName + '" is not possible')
  }))
  if (el) return box.transform(el.screenCTM().inverse())
  return box.addOffset()
}

registerMethods({
  viewbox: {
    viewbox (x, y, width, height) {
      // act as getter
      if (x == null) return new Box(this.attr('viewBox'))

      // act as setter
      return this.attr('viewBox', new Box(x, y, width, height))
    },

    zoom (level, point) {
      let width = this.node.clientWidth
      let height = this.node.clientHeight
      const v = this.viewbox()

      // Firefox does not support clientHeight and returns 0
      // https://bugzilla.mozilla.org/show_bug.cgi?id=874811
      if (!width && !height) {
        var style = window.getComputedStyle(this.node)
        width = parseFloat(style.getPropertyValue('width'))
        height = parseFloat(style.getPropertyValue('height'))
      }

      const zoomX = width / v.width
      const zoomY = height / v.height
      const zoom = Math.min(zoomX, zoomY)

      if (level == null) {
        return zoom
      }

      let zoomAmount = zoom / level
      if (zoomAmount === Infinity) zoomAmount = Number.MIN_VALUE

      point = point || new Point(width / 2 / zoomX + v.x, height / 2 / zoomY + v.y)

      const box = new Box(v).transform(
        new Matrix({ scale: zoomAmount, origin: point })
      )

      return this.viewbox(box)
    }
  }
})

register(Box, 'Box')
