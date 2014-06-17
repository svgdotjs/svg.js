
SVG.Text = SVG.invent({
  // Initialize node
  create: function() {
    this.constructor.call(this, SVG.create('text'))
    
    this._leading = new SVG.Number(1.3)    /* store leading value for rebuilding */
    this._rebuild = true                   /* enable automatic updating of dy values */
    this._build   = false                  /* disable build mode for adding multiple lines */

    /* set default font */
    this.attr('font-family', SVG.defaults.attrs['font-family'])
  }

  // Inherit from
, inherit: SVG.Shape

  // Add class methods
, extend: {
    // Move over x-axis
    x: function(x) {
      /* act as getter */
      if (x == null)
        return this.attr('x')
      
      /* move lines as well if no textPath is present */
      if (!this.textPath)
        this.lines.each(function() { if (this.newLined) this.x(x) })

      return this.attr('x', x)
    }
    // Move over y-axis
  , y: function(y) {
      var oy = this.attr('y')
        , o  = typeof oy === 'number' ? oy - this.bbox().y : 0

      /* act as getter */
      if (y == null)
        return typeof oy === 'number' ? oy - o : oy

      return this.attr('y', typeof y === 'number' ? y + o : y)
    }
    // Move center over x-axis
  , cx: function(x) {
      return x == null ? this.bbox().cx : this.x(x - this.bbox().width / 2)
    }
    // Move center over y-axis
  , cy: function(y) {
      return y == null ? this.bbox().cy : this.y(y - this.bbox().height / 2)
    }
    // Set the text content
  , text: function(text) {
      /* act as getter */
      if (typeof text === 'undefined') return this.content
      
      /* remove existing content */
      this.clear().build(true)
      
      if (typeof text === 'function') {
        /* call block */
        text.call(this, this)

      } else {
        /* store text and make sure text is not blank */
        text = (this.content = text).split('\n')
        
        /* build new lines */
        for (var i = 0, il = text.length; i < il; i++)
          this.tspan(text[i]).newLine()
      }
      
      /* disable build mode and rebuild lines */
      return this.build(false).rebuild()
    }
    // Set font size
  , size: function(size) {
      return this.attr('font-size', size).rebuild()
    }
    // Set / get leading
  , leading: function(value) {
      /* act as getter */
      if (value == null)
        return this._leading
      
      /* act as setter */
      this._leading = new SVG.Number(value)
      
      return this.rebuild()
    }
    // Rebuild appearance type
  , rebuild: function(rebuild) {
      /* store new rebuild flag if given */
      if (typeof rebuild == 'boolean')
        this._rebuild = rebuild

      /* define position of all lines */
      if (this._rebuild) {
        var self = this
        
        this.lines.each(function() {
          if (this.newLined) {
            if (!this.textPath)
              this.attr('x', self.attr('x'))
            this.attr('dy', self._leading * new SVG.Number(self.attr('font-size'))) 
          }
        })

        this.fire('rebuild')
      }

      return this
    }
    // Enable / disable build mode
  , build: function(build) {
      this._build = !!build
      return this
    }
  }
  
  // Add parent method
, construct: {
    // Create text element
    text: function(text) {
      return this.put(new SVG.Text).text(text)
    }
    // Create plain text element
  , plain: function(text) {
      return this.put(new SVG.Text).plain(text)
    }
  }

})

SVG.TSpan = SVG.invent({
  // Initialize node
  create: 'tspan'

  // Inherit from
, inherit: SVG.Shape

  // Add class methods
, extend: {
    // Set text content
    text: function(text) {
      typeof text === 'function' ? text.call(this, this) : this.plain(text)

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
      /* fetch text parent */
      var t = this.doc(SVG.Text)

      /* mark new line */
      this.newLined = true

      /* apply new hy¡n */
      return this.dy(t._leading * t.attr('font-size')).attr('x', t.x())
    }
  }
  
})

SVG.extend(SVG.Text, SVG.TSpan, {
  // Create plain text node
  plain: function(text) {
    /* clear if build mode is disabled */
    if (this._build === false)
      this.clear()

    /* create text node */
    this.node.appendChild(document.createTextNode((this.content = text)))
    
    return this
  }
  // Create a tspan
, tspan: function(text) {
    var node  = (this.textPath || this).node
      , tspan = new SVG.TSpan

    /* clear if build mode is disabled */
    if (this._build === false)
      this.clear()
    
    /* add new tspan and reference */
    node.appendChild(tspan.node)
    tspan.parent = this

    /* only first level tspans are considered to be "lines" */
    if (this instanceof SVG.Text)
      this.lines.add(tspan)

    return tspan.text(text)
  }
  // Clear all lines
, clear: function() {
    var node = (this.textPath || this).node

    /* remove existing child nodes */
    while (node.hasChildNodes())
      node.removeChild(node.lastChild)
    
    /* reset content references  */
    if (this instanceof SVG.Text) {
      delete this.lines
      this.lines = new SVG.Set
      this.content = ''
    }
    
    return this
  }
  // Get length of text element
, length: function() {
    return this.node.getComputedTextLength()
  }
})

// Register rebuild event
SVG.registerEvent('rebuild')
