import {Parent, Doc, Symbol, Image, Pattern, Marker, Point} from './classes.js'
import parser from './parser.js'
import {fullBox, domContains, isNulledBox} from './helpers.js'
import {extend} from './tools.js'
import {delimiter} from './regex.js'

export default class Box {
  constructor (source) {
    var base = [0, 0, 0, 0]
    source = typeof source === 'string' ? source.split(delimiter).map(parseFloat)
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
}


extend(Parent, {
  // Get bounding box
  bbox () {
    return new Box(getBox((node) => node.getBBox()))
  },

  rbox (el) {
    let box = new Box(getBox((node) => node.getBoundingClientRect()))
    if (el) return box.transform(el.screenCTM().inverse())
    return box.addOffset()
  }
})

function getBox(cb) {
  let box

  try {
    box = cb(this.node)

    if (isNulledBox(box) && !domContains(this.node)) {
      throw new Error('Element not in the dom')
    }
  } catch (e) {
    try {
      let clone = this.clone(parser().svg).show()
      box = cb(clone.node)
      clone.remove()
    } catch (e) {
      console.warn('Getting a bounding box of this element is not possible')
    }
  }
  return box
}


extend([Doc, Symbol, Image, Pattern, Marker], {
  viewbox: function (x, y, width, height) {
    // act as getter
    if (x == null) return new Box(this.attr('viewBox'))

    // act as setter
    return this.attr('viewBox', new Box(x, y, width, height))
  }
})
