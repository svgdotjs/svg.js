SVG.Text = SVG.invent({
  // Initialize node
  create: function (node) {
    this.constructor(node || SVG.create('text'))
    this.dom.leading = new SVG.Number(1.3)    // store leading value for rebuilding
    this._rebuild = true                      // enable automatic updating of dy values
    this._build = false                     // disable build mode for adding multiple lines

    // set default font
    this.attr('font-family', SVG.defaults.attrs['font-family'])
  },

  // Inherit from
  inherit: SVG.Parent,

  // Add class methods
  extend: {
    // Move over x-axis
    x: function (x) {
      // act as getter
      if (x == null) {
        return this.attr('x')
      }

      return this.attr('x', x)
    },
    // Move over y-axis
    y: function (y) {
      var oy = this.attr('y')
      var o = typeof oy === 'number' ? oy - this.bbox().y : 0

      // act as getter
      if (y == null) {
        return typeof oy === 'number' ? oy - o : oy
      }

      return this.attr('y', typeof y === 'number' ? y + o : y)
    },
    // Move center over x-axis
    cx: function (x) {
      return x == null ? this.bbox().cx : this.x(x - this.bbox().width / 2)
    },
    // Move center over y-axis
    cy: function (y) {
      return y == null ? this.bbox().cy : this.y(y - this.bbox().height / 2)
    },
    // Set the text content
    text: function (text) {
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
          if (i !== firstLine && children[i].nodeType !== 3 && SVG.adopt(children[i]).dom.newLined === true) {
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
    },
    // Set font size
    size: function (size) {
      return this.attr('font-size', size).rebuild()
    },
    // Set / get leading
    leading: function (value) {
      // act as getter
      if (value == null) {
        return this.dom.leading
      }

      // act as setter
      this.dom.leading = new SVG.Number(value)

      return this.rebuild()
    },
    // Rebuild appearance type
    rebuild: function (rebuild) {
      // store new rebuild flag if given
      if (typeof rebuild === 'boolean') {
        this._rebuild = rebuild
      }

      // define position of all lines
      if (this._rebuild) {
        var self = this
        var blankLineOffset = 0
        var dy = this.dom.leading * new SVG.Number(this.attr('font-size'))

        this.each(function () {
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
    },
    // Enable / disable build mode
    build: function (build) {
      this._build = !!build
      return this
    },
    // overwrite method from parent to set data properly
    setData: function (o) {
      this.dom = o
      this.dom.leading = new SVG.Number(o.leading || 1.3)
      return this
    }
  },

  // Add parent method
  construct: {
    // Create text element
    text: function (text) {
      return this.put(new SVG.Text()).text(text)
    },
    // Create plain text element
    plain: function (text) {
      return this.put(new SVG.Text()).plain(text)
    }
  }

})

SVG.Tspan = SVG.invent({
  // Initialize node
  create: 'tspan',

  // Inherit from
  inherit: SVG.Parent,

  // Add class methods
  extend: {
    // Set text content
    text: function (text) {
      if (text == null) return this.node.textContent + (this.dom.newLined ? '\n' : '')

      typeof text === 'function' ? text.call(this, this) : this.plain(text)

      return this
    },
    // Shortcut dx
    dx: function (dx) {
      return this.attr('dx', dx)
    },
    // Shortcut dy
    dy: function (dy) {
      return this.attr('dy', dy)
    },
    // Create new line
    newLine: function () {
      // fetch text parent
      var t = this.parent(SVG.Text)

      // mark new line
      this.dom.newLined = true

      // apply new hy¡n
      return this.dy(t.dom.leading * t.attr('font-size')).attr('x', t.x())
    }
  }
})

SVG.extend([SVG.Text, SVG.Tspan], {
  // Create plain text node
  plain: function (text) {
    // clear if build mode is disabled
    if (this._build === false) {
      this.clear()
    }

    // create text node
    this.node.appendChild(document.createTextNode(text))

    return this
  },
  // Create a tspan
  tspan: function (text) {
    var tspan = new SVG.Tspan()

    // clear if build mode is disabled
    if (!this._build) {
      this.clear()
    }

    // add new tspan
    this.node.appendChild(tspan.node)

    return tspan.text(text)
  },
  // FIXME: Does this also work for textpath?
  // Get length of text element
  length: function () {
    return this.node.getComputedTextLength()
  }
})
