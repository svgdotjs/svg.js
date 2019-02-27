import {
  adopt,
  extend,
  nodeOrNew,
  register,
  wrapWithAttrCheck
} from '../utils/adopter.js'
import { registerMethods } from '../utils/methods.js'
import SVGNumber from '../types/SVGNumber.js'
import Shape from './Shape.js'
import { globals } from '../utils/window.js'
import * as textable from '../modules/core/textable.js'

export default class Text extends Shape {
  // Initialize node
  constructor (node) {
    super(nodeOrNew('text', node), node)

    this.dom.leading = new SVGNumber(1.3) // store leading value for rebuilding
    this._rebuild = true // enable automatic updating of dy values
    this._build = false // disable build mode for adding multiple lines
  }

  // Move over x-axis
  // Text is moved its bounding box
  // text-anchor does NOT matter
  x (x, box = this.bbox()) {
    if (x == null) {
      return box.x
    }

    return this.attr('x', this.attr('x') + x - box.x)
  }

  // Move over y-axis
  y (y, box = this.bbox()) {
    if (y == null) {
      return box.y
    }

    return this.attr('y', this.attr('y') + y - box.y)
  }

  move (x, y, box = this.bbox()) {
    return this.x(x, box).y(y, box)
  }

  // Move center over x-axis
  cx (x, box = this.bbox()) {
    if (x == null) {
      return box.cx
    }

    return this.attr('x', this.attr('x') + x - box.cx)
  }

  // Move center over y-axis
  cy (y, box = this.bbox()) {
    if (y == null) {
      return box.cy
    }

    return this.attr('y', this.attr('y') + y - box.cy)
  }

  center (x, y, box = this.bbox()) {
    return this.cx(x, box).cy(y, box)
  }

  // Set the text content
  text (text) {
    // act as getter
    if (text === undefined) {
      var children = this.node.childNodes
      var firstLine = 0
      text = ''

      for (var i = 0, len = children.length; i < len; ++i) {
        // skip textPaths - they are no lines
        if (children[i].nodeName === 'textPath') {
          if (i === 0) firstLine = 1
          continue
        }

        // add newline if its not the first child and newLined is set to true
        if (i !== firstLine && children[i].nodeType !== 3 && adopt(children[i]).dom.newLined === true) {
          text += '\n'
        }

        // add content of this node
        text += children[i].textContent
      }

      return text
    }

    // remove existing content
    this.clear().build(true)

    if (typeof text === 'function') {
      // call block
      text.call(this, this)
    } else {
      // store text and make sure text is not blank
      text = text.split('\n')

      // build new lines
      for (var j = 0, jl = text.length; j < jl; j++) {
        this.tspan(text[j]).newLine()
      }
    }

    // disable build mode and rebuild lines
    return this.build(false).rebuild()
  }

  // Set / get leading
  leading (value) {
    // act as getter
    if (value == null) {
      return this.dom.leading
    }

    // act as setter
    this.dom.leading = new SVGNumber(value)

    return this.rebuild()
  }

  // Rebuild appearance type
  rebuild (rebuild) {
    // store new rebuild flag if given
    if (typeof rebuild === 'boolean') {
      this._rebuild = rebuild
    }

    // define position of all lines
    if (this._rebuild) {
      var self = this
      var blankLineOffset = 0
      var leading = this.dom.leading

      this.each(function () {
        var fontSize = globals.window.getComputedStyle(this.node)
          .getPropertyValue('font-size')
        var dy = leading * new SVGNumber(fontSize)

        if (this.dom.newLined) {
          this.attr('x', self.attr('x'))

          if (this.text() === '\n') {
            blankLineOffset += dy
          } else {
            this.attr('dy', dy + blankLineOffset)
            blankLineOffset = 0
          }
        }
      })

      this.fire('rebuild')
    }

    return this
  }

  // Enable / disable build mode
  build (build) {
    this._build = !!build
    return this
  }

  // overwrite method from parent to set data properly
  setData (o) {
    this.dom = o
    this.dom.leading = new SVGNumber(o.leading || 1.3)
    return this
  }
}

extend(Text, textable)

registerMethods({
  Container: {
    // Create text element
    text: wrapWithAttrCheck(function (text) {
      return this.put(new Text()).text(text)
    }),

    // Create plain text element
    plain: wrapWithAttrCheck(function (text) {
      return this.put(new Text()).plain(text)
    })
  }
})

register(Text, 'Text')
