
SVG.Element = SVG.invent({
  // Initialize node
  create: function(node) {
    // Make stroke value accessible dynamically
    this._stroke = SVG.defaults.attrs.stroke

    // Create circular reference
    if (this.node = node) {
      this.type = node.nodeName
      this.node.instance = this

      // Store current attribute value
      this._stroke = node.getAttribute('stroke') || this._stroke
    }
  }

  // Add class methods
, extend: {
    // Move over x-axis
    x: function(x) {
      if (x != null) {
        x = new SVG.Number(x)
        x.value /= this.trans.scaleX
      }
      return this.attr('x', x)
    }
    // Move over y-axis
  , y: function(y) {
      if (y != null) {
        y = new SVG.Number(y)
        y.value /= this.trans.scaleY
      }
      return this.attr('y', y)
    }
    // Move by center over x-axis
  , cx: function(x) {
      return x == null ? this.x() + this.width() / 2 : this.x(x - this.width() / 2)
    }
    // Move by center over y-axis
  , cy: function(y) {
      return y == null ? this.y() + this.height() / 2 : this.y(y - this.height() / 2)
    }
    // Move element to given x and y values
  , move: function(x, y) {
      return this.x(x).y(y)
    }
    // Move element by its center
  , center: function(x, y) {
      return this.cx(x).cy(y)
    }
    // Set width of element
  , width: function(width) {
      return this.attr('width', width)
    }
    // Set height of element
  , height: function(height) {
      return this.attr('height', height)
    }
    // Set element size to given width and height
  , size: function(width, height) {
      var p = proportionalSize(this.bbox(), width, height)

      return this
        .width(new SVG.Number(p.width))
        .height(new SVG.Number(p.height))
    }
    // Clone element
  , clone: function() {
      return assignNewId(this.node.cloneNode(true))
    }
    // Remove element
  , remove: function() {
      if (this.parent())
        this.parent().removeElement(this)
      
      return this
    }
    // Replace element
  , replace: function(element) {
      this.after(element).remove()

      return element
    }
    // Add element to given container and return self
  , addTo: function(parent) {
      return parent.put(this)
    }
    // Add element to given container and return container
  , putIn: function(parent) {
      return parent.add(this)
    }
    // Get parent document
  , doc: function(type) {
      return this.parent(type || SVG.Doc)
    }
    // Set svg element attribute
  , attr: function(a, v, n) {
      // Act as full getter
      if (a == null) {
        // Get an object of attributes
        a = {}
        v = this.node.attributes
        for (n = v.length - 1; n >= 0; n--)
          a[v[n].nodeName] = SVG.regex.isNumber.test(v[n].nodeValue) ? parseFloat(v[n].nodeValue) : v[n].nodeValue
        
        return a
        
      } else if (typeof a == 'object') {
        // Apply every attribute individually if an object is passed
        for (v in a) this.attr(v, a[v])
        
      } else if (v === null) {
          // Remove value
          this.node.removeAttribute(a)
        
      } else if (v == null) {
        // Act as a getter if the first and only argument is not an object
        v = this.node.getAttribute(a)
        return v == null ? 
          SVG.defaults.attrs[a] :
        SVG.regex.isNumber.test(v) ?
          parseFloat(v) : v
      
      } else {
        // BUG FIX: some browsers will render a stroke if a color is given even though stroke width is 0
        if (a == 'stroke-width')
          this.attr('stroke', parseFloat(v) > 0 ? this._stroke : null)
        else if (a == 'stroke')
          this._stroke = v

        // Convert image fill and stroke to patterns
        if (a == 'fill' || a == 'stroke') {
          if (SVG.regex.isImage.test(v))
            v = this.doc().defs().image(v, 0, 0)

          if (v instanceof SVG.Image)
            v = this.doc().defs().pattern(0, 0, function() {
              this.add(v)
            })
        }
        
        // Ensure correct numeric values (also accepts NaN and Infinity)
        if (typeof v === 'number')
          v = new SVG.Number(v)

        // Ensure full hex color
        else if (SVG.Color.isColor(v))
          v = new SVG.Color(v)
        
        // Parse array values
        else if (Array.isArray(v))
          v = new SVG.Array(v)

        // If the passed attribute is leading...
        if (a == 'leading') {
          // ... call the leading method instead
          if (this.leading)
            this.leading(v)
        } else {
          // Set given attribute on node
          typeof n === 'string' ?
            this.node.setAttributeNS(n, a, v.toString()) :
            this.node.setAttribute(a, v.toString())
        }
        
        // Rebuild if required
        if (this.rebuild && (a == 'font-size' || a == 'x'))
          this.rebuild(a, v)
      }
      
      return this
    }
    // Manage transformations
  , transform: function(t, v) {
      // Get a transformation at a given position
      if (typeof t === 'number') {
        
      }
        
      return this
    }
    // Dynamic style generator
  , style: function(s, v) {
      if (arguments.length == 0) {
        /* get full style */
        return this.node.style.cssText || ''
      
      } else if (arguments.length < 2) {
        /* apply every style individually if an object is passed */
        if (typeof s == 'object') {
          for (v in s) this.style(v, s[v])
        
        } else if (SVG.regex.isCss.test(s)) {
          /* parse css string */
          s = s.split(';')

          /* apply every definition individually */
          for (var i = 0; i < s.length; i++) {
            v = s[i].split(':')
            this.style(v[0].replace(/\s+/g, ''), v[1])
          }
        } else {
          /* act as a getter if the first and only argument is not an object */
          return this.node.style[camelCase(s)]
        }
      
      } else {
        this.node.style[camelCase(s)] = v === null || SVG.regex.isBlank.test(v) ? '' : v
      }
      
      return this
    }
    // Get / set id
  , id: function(id) {
      return this.attr('id', id)
    }
    // Get bounding box
  , bbox: function() {
      return new SVG.BBox(this)
    }
    // Get rect box
  , rbox: function() {
      return new SVG.RBox(this)
    }
    // Checks whether the given point inside the bounding box of the element
  , inside: function(x, y) {
      var box = this.bbox()
      
      return x > box.x
          && y > box.y
          && x < box.x + box.width
          && y < box.y + box.height
    }
    // Show element
  , show: function() {
      return this.style('display', '')
    }
    // Hide element
  , hide: function() {
      return this.style('display', 'none')
    }
    // Is element visible?
  , visible: function() {
      return this.style('display') != 'none'
    }
    // Return id on string conversion
  , toString: function() {
      return this.attr('id')
    }
    // Return array of classes on the node
  , classes: function() {
      var attr = this.attr('class')

      return attr == null ? [] : attr.trim().split(/\s+/)
    }
    // Return true if class exists on the node, false otherwise
  , hasClass: function(name) {
      return this.classes().indexOf(name) != -1
    }
    // Add class to the node
  , addClass: function(name) {
      if (!this.hasClass(name)) {
        var array = this.classes()
        array.push(name)
        this.attr('class', array.join(' '))
      }

      return this
    }
    // Remove class from the node
  , removeClass: function(name) {
      if (this.hasClass(name)) {
        var array = this.classes().filter(function(c) {
          return c != name
        })
        this.attr('class', array.join(' '))
      }

      return this
    }
    // Toggle the presence of a class on the node
  , toggleClass: function(name) {
      return this.hasClass(name) ? this.removeClass(name) : this.addClass(name)
    }
    // Get referenced element form attribute value
  , reference: function(attr) {
      return SVG.get(this.attr(attr))
    }
    // Returns the parent element instance
  , parent: function(type) {
      // Get parent element
      var parent = SVG.adopt(this.node.parentNode)

      // If a specific type is given, find a parent with that class
      if (type)
        while (!(parent instanceof type))
          parent = SVG.adopt(parent.node.parentNode)

      return parent
    }
  }
})
