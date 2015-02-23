
SVG.Element = SVG.invent({
  // Initialize node
  create: function(node) {
    /* make stroke value accessible dynamically */
    this._stroke = SVG.defaults.attrs.stroke

    /* initialize transformation store with defaults */
    this.trans = SVG.defaults.trans()
    
    /* create circular reference */
    if (this.node = node) {
      this.type = node.nodeName
      this.node.instance = this
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
      var clone , attr
        , type = this.type
      
      /* invoke shape method with shape-specific arguments */
      clone = type == 'rect' || type == 'ellipse' ?
        this.parent[type](0,0) :
      type == 'line' ?
        this.parent[type](0,0,0,0) :
      type == 'image' ?
        this.parent[type](this.src) :
      type == 'text' ?
        this.parent[type](this.content) :
      type == 'path' ?
        this.parent[type](this.attr('d')) :
      type == 'polyline' || type == 'polygon' ?
        this.parent[type](this.attr('points')) :
      type == 'g' ?
        this.parent.group() :
        this.parent[type]()
      
      /* apply attributes attributes */
      attr = this.attr()
      delete attr.id
      clone.attr(attr)
      
      /* copy transformations */
      clone.trans = this.trans
      
      /* apply attributes and translations */
      return clone.transform({})
    }
    // Remove element
  , remove: function() {
      if (this.parent)
        this.parent.removeElement(this)
      
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
      return this._parent(type || SVG.Doc)
    }
    // Set svg element attribute
  , attr: function(a, v, n) {
      if (a == null) {
        /* get an object of attributes */
        a = {}
        v = this.node.attributes
        for (n = v.length - 1; n >= 0; n--)
          a[v[n].nodeName] = SVG.regex.isNumber.test(v[n].nodeValue) ? parseFloat(v[n].nodeValue) : v[n].nodeValue
        
        return a
        
      } else if (typeof a == 'object') {
        /* apply every attribute individually if an object is passed */
        for (v in a) this.attr(v, a[v])
        
      } else if (v === null) {
          /* remove value */
          this.node.removeAttribute(a)
        
      } else if (v == null) {
        /* act as a getter if the first and only argument is not an object */
        v = this.node.attributes[a]
        return v == null ? 
          SVG.defaults.attrs[a] :
        SVG.regex.isNumber.test(v.nodeValue) ?
          parseFloat(v.nodeValue) : v.nodeValue
      
      } else if (a == 'style') {
        /* redirect to the style method */
        return this.style(v)
      
      } else {
        /* BUG FIX: some browsers will render a stroke if a color is given even though stroke width is 0 */
        if (a == 'stroke-width')
          this.attr('stroke', parseFloat(v) > 0 ? this._stroke : null)
        else if (a == 'stroke')
          this._stroke = v

        /* convert image fill and stroke to patterns */
        if (a == 'fill' || a == 'stroke') {
          if (SVG.regex.isImage.test(v))
            v = this.doc().defs().image(v, 0, 0)

          if (v instanceof SVG.Image)
            v = this.doc().defs().pattern(0, 0, function() {
              this.add(v)
            })
        }
        
        /* ensure correct numeric values (also accepts NaN and Infinity) */
        if (typeof v === 'number')
          v = new SVG.Number(v)

        /* ensure full hex color */
        else if (SVG.Color.isColor(v))
          v = new SVG.Color(v)
        
        /* parse array values */
        else if (Array.isArray(v))
          v = new SVG.Array(v)

        /* if the passed attribute is leading... */
        if (a == 'leading') {
          /* ... call the leading method instead */
          if (this.leading)
            this.leading(v)
        } else {
          /* set given attribute on node */
          typeof n === 'string' ?
            this.node.setAttributeNS(n, a, v.toString()) :
            this.node.setAttribute(a, v.toString())
        }
        
        /* rebuild if required */
        if (this.rebuild && (a == 'font-size' || a == 'x'))
          this.rebuild(a, v)
      }
      
      return this
    }
    // Manage transformations
  , transform: function(o, v) {
      
      if (arguments.length == 0) {
        /* act as a getter if no argument is given */
        return this.trans
        
      } else if (typeof o === 'string') {
        /* act as a getter if only one string argument is given */
        if (arguments.length < 2)
          return this.trans[o]
        
        /* apply transformations as object if key value arguments are given*/
        var transform = {}
        transform[o] = v
        
        return this.transform(transform)
      }
      
      /* ... otherwise continue as a setter */
      var transform = []
      
      /* parse matrix */
      o = parseMatrix(o)
      
      /* merge values */
      for (v in o)
        if (o[v] != null)
          this.trans[v] = o[v]
      
      /* compile matrix */
      this.trans.matrix = this.trans.a
                  + ' ' + this.trans.b
                  + ' ' + this.trans.c
                  + ' ' + this.trans.d
                  + ' ' + this.trans.e
                  + ' ' + this.trans.f
      
      /* alias current transformations */
      o = this.trans
      
      /* add matrix */
      if (o.matrix != SVG.defaults.matrix)
        transform.push('matrix(' + o.matrix + ')')
      
      /* add rotation */
      if (o.rotation != 0)
        transform.push('rotate(' + o.rotation + ' ' + (o.cx == null ? this.bbox().cx : o.cx) + ' ' + (o.cy == null ? this.bbox().cy : o.cy) + ')')
      
      /* add scale */
      if (o.scaleX != 1 || o.scaleY != 1)
        transform.push('scale(' + o.scaleX + ' ' + o.scaleY + ')')
      
      /* add skew on x axis */
      if (o.skewX != 0)
        transform.push('skewX(' + o.skewX + ')')
      
      /* add skew on y axis */
      if (o.skewY != 0)
        transform.push('skewY(' + o.skewY + ')')
      
      /* add translation */
      if (o.x != 0 || o.y != 0)
        transform.push('translate(' + new SVG.Number(o.x / o.scaleX) + ' ' + new SVG.Number(o.y / o.scaleY) + ')')
      
      /* update transformations, even if there are none */
      if (transform.length == 0)
        this.node.removeAttribute('transform')
      else
        this.node.setAttribute('transform', transform.join(' '))
      
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
      var classAttr = this.node.getAttribute('class')
      if (classAttr === null) {
        return []
      } else {
        return classAttr.trim().split(/\s+/)
      }
    }
    // Return true if class exists on the node, false otherwise
  , hasClass: function(className) {
      return this.classes().indexOf(className) != -1
    }
    // Add class to the node
  , addClass: function(className) {
      var classArray
      if (!(this.hasClass(className))) {
        classArray = this.classes()
        classArray.push(className)
        this.node.setAttribute('class', classArray.join(' '))
      }
      return this
    }
    // Remove class from the node
  , removeClass: function(className) {
      var classArray
      if (this.hasClass(className)) {
        classArray = this.classes().filter(function(c) {
          return c != className
        })
        this.node.setAttribute('class', classArray.join(' '))
      }
      return this
    }
    // Toggle the presence of a class on the node
  , toggleClass: function(className) {
      if (this.hasClass(className)) {
        this.removeClass(className)
      } else {
        this.addClass(className)
      }
      return this
    }
    // Get referenced element form attribute value
  , reference: function(attr) {
      return SVG.get(this.attr()[attr])
    }
    // Private: find svg parent by instance
  , _parent: function(parent) {
      var element = this
      
      while (element != null && !(element instanceof parent))
        element = element.parent

      return element
    }
  }
})
