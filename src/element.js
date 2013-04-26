
// ### Used by nearly every other module

//
SVG.Element = function(node) {
  /* make stroke value accessible dynamically */
  this._stroke = SVG.defaults.attrs.stroke
  
  /* initialize style store */
  this.styles = {}
  
  /* initialize transformation store with defaults */
  this.trans = SVG.defaults.trans()
  
  /* keep reference to the element node */
  if (this.node = node) {
    this.type = node.nodeName
    this.node.instance = this
  }
}

//
SVG.extend(SVG.Element, {
  // Move over x-axis
  x: function(x) {
    if (x) x /= this.trans.scaleX
    return this.attr('x', x)
  }
  // Move over y-axis
, y: function(y) {
    if (y) y /= this.trans.scaleY
    return this.attr('y', y)
  }
  // Move by center over x-axis
, cx: function(x) {
    return x == null ? this.bbox().cx : this.x(x - this.bbox().width / 2)
  }
  // Move by center over y-axis
, cy: function(y) {
    return y == null ? this.bbox().cy : this.y(y - this.bbox().height / 2)
  }
  // Move element to given x and y values
, move: function(x, y) {
    return this.x(x).y(y)
  }
  // Move element by its center
, center: function(x, y) {
    return this.cx(x).cy(y)
  }
  // Set element size to given width and height
, size: function(width, height) { 
    return this.attr({
      width:  width
    , height: height
    })
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
        a[v[n].nodeName] = SVG.regex.test(v[n].nodeValue, 'isNumber') ? parseFloat(v[n].nodeValue) : v[n].nodeValue
      
      return a
      
    } else if (typeof a == 'object') {
      /* apply every attribute individually if an object is passed */
      for (v in a) this.attr(v, a[v])
      
    } else if (v === null) {
        /* remove value */
        this.node.removeAttribute(a)
      
    } else if (v == null) {
      /* act as a getter for style attributes */
      if (this._isStyle(a)) {
        return a == 'text' ?
                 this.content :
               a == 'leading' && this.leading ?
                 this.leading() :
                 this.style(a)
      
      /* act as a getter if the first and only argument is not an object */
      } else {
        v = this.node.getAttribute(a)
        return v == null ? 
          SVG.defaults.attrs[a] :
        SVG.regex.test(v, 'isNumber') ?
          parseFloat(v) : v
      }
    
    } else if (a == 'style') {
      /* redirect to the style method */
      return this.style(v)
    
    } else {
      /* treat x differently on text elements */
      if (a == 'x' && Array.isArray(this.lines))
        for (n = this.lines.length - 1; n >= 0; n--)
          this.lines[n].attr(a, v)
      
      /* BUG FIX: some browsers will render a stroke if a color is given even though stroke width is 0 */
      if (a == 'stroke-width')
        this.attr('stroke', parseFloat(v) > 0 ? this._stroke : null)
      else if (a == 'stroke')
        this._stroke = v
      
      /* ensure hex color */
      if (SVG.Color.test(v) || SVG.Color.isRgb(v))
        v = new SVG.Color(v).toHex()
        
      /* set give attribute on node */
      n != null ?
        this.node.setAttributeNS(n, a, v) :
        this.node.setAttribute(a, v)
      
      /* if the passed argument belongs in the style as well, add it there */
      if (this._isStyle(a)) {
        a == 'text' ?
          this.text(v) :
        a == 'leading' && this.leading ?
          this.leading(v) :
          this.style(a, v)
        
        /* rebuild if required */
        if (this.rebuild)
          this.rebuild(a, v)
      }
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
    o = this._parseMatrix(o)
    
    /* merge values */
    for (v in o)
      if (o[v] != null)
        this.trans[v] = o[v]
    
    /* compile matrix */
    this.trans.matrix = this.trans.a
                + ',' + this.trans.b
                + ',' + this.trans.c
                + ',' + this.trans.d
                + ',' + this.trans.e
                + ',' + this.trans.f
    
    /* alias current transformations */
    o = this.trans
    
    /* add matrix */
    if (o.matrix != SVG.defaults.matrix)
      transform.push('matrix(' + o.matrix + ')')
    
    /* add rotation */
    if (o.rotation != 0)
      transform.push('rotate(' + o.rotation + ',' + (o.cx || this.bbox().cx) + ',' + (o.cy || this.bbox().cy) + ')')
    
    /* add scale */
    if (o.scaleX != 1 || o.scaleY != 1)
      transform.push('scale(' + o.scaleX + ',' + o.scaleY + ')')
    
    /* add skew on x axis */
    if (o.skewX != 0)
      transform.push('skewX(' + o.skewX + ')')
    
    /* add skew on y axis */
    if (o.skewY != 0)
      transform.push('skewY(' + o.skewY + ')')
    
    /* add translation */
    if (o.x != 0 || o.y != 0)
      transform.push('translate(' + o.x / o.scaleX + ',' + o.y / o.scaleY + ')')
    
    /* add offset translation */
     if (this._offset)
       transform.push('translate(' + (-this._offset.x) + ',' + (-this._offset.y) + ')')
    
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
      return this.attr('style') || ''
    
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

          if (v.length == 2)
            this.style(v[0].replace(/\s+/g, ''), v[1].replace(/^\s+/,'').replace(/\s+$/,''))
        }
      } else {
        /* act as a getter if the first and only argument is not an object */
        return this.styles[s]
      }
    
    } else if (v === null || SVG.regex.test(v, 'isBlank')) {
      /* remove value */
      delete this.styles[s]
      
    } else {
      /* store value */
      this.styles[s] = v
    }
    
    /* rebuild style string */
    s = ''
    for (v in this.styles)
      s += v + ':' + this.styles[v] + ';'
    
    /* apply style */
    if (s == '')
      this.node.removeAttribute('style')
    else
      this.node.setAttribute('style', s)
    
    return this
  }
  // Store data values on svg nodes
, data: function(a, v, r) {
    if (arguments.length < 2) {
      try {
        return JSON.parse(this.attr('data-' + a))
      } catch(e) {
        return this.attr('data-' + a)
      }
      
    } else {
      this.attr(
        'data-' + a
      , v === null ?
          null :
        r === true || typeof v === 'string' || typeof v === 'number' ?
          v :
          JSON.stringify(v)
      )
    }
    
    return this
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
  // Private: find svg parent by instance
, _parent: function(parent) {
    var element = this
    
    while (element != null && !(element instanceof parent))
      element = element.parent

    return element
  }
  // Private: tester method for style detection
, _isStyle: function(a) {
    return typeof a == 'string' ? SVG.regex.test(a, 'isStyle') : false
  }
  // Private: parse a matrix string
, _parseMatrix: function(o) {
    if (o.matrix) {
      /* split matrix string */
      var m = o.matrix.replace(/\s/g, '').split(',')
      
      /* pasrse values */
      if (m.length == 6) {
        o.a = parseFloat(m[0])
        o.b = parseFloat(m[1])
        o.c = parseFloat(m[2])
        o.d = parseFloat(m[3])
        o.e = parseFloat(m[4])
        o.f = parseFloat(m[5])
      }
    }
    
    return o
  }
  
})