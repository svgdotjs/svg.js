
// List font style attributes as they should be applied to style 
var _styleAttr = ('size family weight stretch variant style').split(' ')

SVG.Text = function() {
  this.constructor.call(this, SVG.create('text'))
  
  /* define default style */
  this.styles = {
    'font-size':    16
  , 'font-family':  'Helvetica, Arial, sans-serif'
  , 'text-anchor':  'start'
  }
  
  this._leading = new SVG.Number('1.2em')
  this._rebuild = true
}

// Inherit from SVG.Element
SVG.Text.prototype = new SVG.Shape

//
SVG.extend(SVG.Text, {
  // Move over x-axis
  x: function(x, a) {
    /* act as getter */
    if (x == null)
      return a ? this.attr('x') : this.bbox().x
    
    /* set x taking anchor in mind */
    if (!a) {
      a = this.style('text-anchor')
      x = a == 'start' ? x : a == 'end' ? x + this.bbox().width : x + this.bbox().width / 2
    }

    /* move lines as well if no textPath si present */
    if (!this.textPath)
      this.lines.each(function() { if (this.newLined) this.x(x) })

    return this.attr('x', x)
  }
  // Move center over x-axis
, cx: function(x, a) {
    return x == null ? this.bbox().cx : this.x(x - this.bbox().width / 2)
  }
  // Move center over y-axis
, cy: function(y, a) {
    return y == null ? this.bbox().cy : this.y(a ? y : y - this.bbox().height / 2)
  }
  // Move element to given x and y values
, move: function(x, y, a) {
    return this.x(x, a).y(y)
  }
  // Move element by its center
, center: function(x, y, a) {
    return this.cx(x, a).cy(y, a)
  }
  // Set the text content
, text: function(text) {
    /* act as getter */
    if (text == null)
      return this.content
    
    /* remove existing lines */
    this.clear()
    
    if (typeof text === 'function') {
      this._rebuild = false

      text(this)

    } else {
      this._rebuild = true

      /* make sure text is not blank */
      text = SVG.regex.isBlank.test(text) ? 'text' : text
      
      var i, il
        , lines = text.split('\n')
      
      /* build new lines */
      for (i = 0, il = lines.length; i < il; i++)
        this.tspan(lines[i]).newLine()

      this.rebuild()
    }
    
    return this
  }
  // Create a tspan
, tspan: function(text) {
    var node  = this.textPath ? this.textPath.node : this.node
      , tspan = new SVG.TSpan().text(text)
      , style = this.style()
    
    /* add new tspan */
    node.appendChild(tspan.node)
    this.lines.add(tspan)

    /* add style if any */
    if (!SVG.regex.isBlank.test(style))
      tspan.style(style)

    /* store content */
    this.content += text

    /* store text parent */
    tspan.parent = this

    return tspan
  }
  // Set font size
, size: function(size) {
    return this.attr('font-size', size)
  }
  // Set / get leading
, leading: function(value) {
    /* act as getter */
    if (value == null)
      return this._leading
    
    /* act as setter */
    value = new SVG.Number(value)
    this._leading = value
    
    /* apply leading */
    this.lines.each(function() {
      if (this.newLined)
        this.attr('dy', value)
    })

    return this
  }
  // rebuild appearance type
, rebuild: function() {
    var self = this

    /* define position of all lines */
    if (this._rebuild) {
      this.lines.attr({
        x:      this.attr('x')
      , dy:     this._leading
      , style:  this.style()
      })
    }

    return this
  }
  // Clear all lines
, clear: function() {
    var node = this.textPath ? this.textPath.node : this.node

    /* remove existing child nodes */
    while (node.hasChildNodes())
      node.removeChild(node.lastChild)
    
    /* refresh lines */
    delete this.lines
    this.lines = new SVG.Set
    
    /* initialize content */
    this.content = ''

    return this
  }
  
})

//
SVG.extend(SVG.Container, {
  // Create text element
  text: function(text) {
    return this.put(new SVG.Text).text(text)
  }
  
})

// tspan class
SVG.TSpan = function() {
  this.constructor.call(this, SVG.create('tspan'))
}

// Inherit from SVG.Shape
SVG.TSpan.prototype = new SVG.Shape

// Include the container object
SVG.extend(SVG.TSpan, {
  // Set text content
  text: function(text) {
    this.node.appendChild(document.createTextNode(text))
    
    return this
  }
  // Shortcut dx
, dx: function(dx) {
    return this.attr('dx', dx)
  }
  // Shortcut dy
, dy: function(dy) {
    return this.attr('dy', dy)
  }
  // Create new line
, newLine: function() {
    this.newLined = true
    this.parent.content += '\n'
    this.dy(this.parent._leading)
    return this.attr('x', this.parent.x())
  }

})
