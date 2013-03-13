/* svg.js v0.10-1-g4bd21ec - svg regex default color viewbox bbox element container fx event group arrange defs mask pattern gradient doc shape wrap rect ellipse line poly path image text nested sugar - svgjs.com/license */
;(function() {

  this.SVG = function(element) {
    if (SVG.supported)
      return new SVG.Doc(element)
  }
  
  // DEPRECATED!!! Use SVG() instead
  this.svg = function(element) {
    console.warn('WARNING: svg() is deprecated, please use SVG() instead.')
    return SVG(element)
  }
  
  // Default namespaces
  SVG.ns = 'http://www.w3.org/2000/svg'
  SVG.xlink = 'http://www.w3.org/1999/xlink'
  
  // Element id sequence
  SVG.did  = 1000
  
  // Get next named element id
  SVG.eid = function(name) {
    return 'Svgjs' + name.charAt(0).toUpperCase() + name.slice(1) + 'Element' + (SVG.did++)
  }
  
  // Method for element creation
  SVG.create = function(name) {
    /* create element */
    var element = document.createElementNS(this.ns, name)
    
    /* apply unique id */
    element.setAttribute('id', this.eid(name))
    
    return element
  }
  
    // Method for extending objects
  SVG.extend = function() {
    var modules, methods, key, i
    
    /* get list of modules */
    modules = Array.prototype.slice.call(arguments)
    
    /* get object with extensions */
    methods = modules.pop()
    
    for (i = modules.length - 1; i >= 0; i--)
      if (modules[i])
        for (key in methods)
          modules[i].prototype[key] = methods[key]
  }
  
  // svg support test
  SVG.supported = (function() {
    return !! document.createElementNS &&
           !! document.createElementNS(SVG.ns,'svg').createSVGRect
  })()
  
  if (!SVG.supported) return false

  SVG.regex = {
    /* parse unit value */
    unit:         /^([\d\.]+)([a-z%]{0,2})$/
    
    /* parse hex value */
  , hex:          /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i
    
    /* parse rgb value */
  , rgb:          /rgb\((\d+),(\d+),(\d+),([\d\.]+)\)/
    
    /* parse hsb value */
  , hsb:          /hsb\((\d+),(\d+),(\d+),([\d\.]+)\)/
    
    /* test hex value */
  , isHex:        /^#[a-f0-9]{3,6}$/i
    
    /* test rgb value */
  , isRgb:        /^rgb\(/
    
    /* test hsb value */
  , isHsb:        /^hsb\(/
    
    /* test css declaration */
  , isCss:        /[^:]+:[^;]+;?/
    
    /* test css property */
  , isStyle:      /^font|text|leading|cursor/
    
    /* test for blank string */
  , isBlank:      /^(\s+)?$/
    
  }

  SVG.default = {
    // Default matrix
    matrix:       '1,0,0,1,0,0'
    
    // Default attribute values
  , attrs: function() {
      return {
        /* fill and stroke */
        'fill-opacity':   1
      , 'stroke-opacity': 1
      , 'stroke-width':   0
      , fill:     '#000'
      , stroke:   '#000'
      , opacity:  1
        /* position */
      , x:        0
      , y:        0
      , cx:       0
      , cy:       0
        /* size */
      , width:    0
      , height:   0
        /* radius */
      , r:        0
      , rx:       0
      , ry:       0
      }
    }
    
    // Default transformation values
  , trans: function() {
      return {
        /* translate */
        x:        0
      , y:        0
        /* scale */
      , scaleX:   1
      , scaleY:   1
        /* rotate */
      , rotation: 0
        /* skew */
      , skewX:    0
      , skewY:    0
        /* matrix */
      , matrix:   this.matrix
      , a:        1
      , b:        0
      , c:        0
      , d:        1
      , e:        0
      , f:        0
      }
    }
    
  }

  SVG.Color = function(color) {
    var match
    
    /* initialize defaults */
    this.r = 0
    this.g = 0
    this.b = 0
    
    /* parse color */
    if (typeof color == 'string') {
      if (SVG.regex.isRgb.test(color)) {
        /* get rgb values */
        match = SVG.regex.rgb.exec(color.replace(/\s/g,''))
        
        /* parse numeric values */
        this.r = parseInt(m[1])
        this.g = parseInt(m[2])
        this.b = parseInt(m[3])
        
      } else if (SVG.regex.isHex.test(color)) {
        /* get hex values */
        match = SVG.regex.hex.exec(this._fullHex(color))
  
        /* parse numeric values */
        this.r = parseInt(match[1], 16)
        this.g = parseInt(match[2], 16)
        this.b = parseInt(match[3], 16)
      
      } else if (SVG.regex.isHsb.test(color)) {
        /* get hsb values */
        match = SVG.regex.hsb.exec(color.replace(/\s/g,''))
        
        /* convert hsb to rgb */
        color = this._hsbToRgb(match[1], match[2], match[3])
      }
      
    } else if (typeof color == 'object') {
      if (SVG.Color.isHsb(color))
        color = this._hsbToRgb(color.h, color.s, color.b)
      
      this.r = color.r
      this.g = color.g
      this.b = color.b
    }
      
  }
  
  SVG.extend(SVG.Color, {
    // Default to hex conversion
    toString: function() {
      return this.toHex()
    }
    // Build hex value
  , toHex: function() {
      return '#'
        + this._compToHex(this.r)
        + this._compToHex(this.g)
        + this._compToHex(this.b)
    }
    // Build rgb value
  , toRgb: function() {
      return 'rgb(' + [this.r, this.g, this.b].join() + ')'
    }
    // Calculate true brightness
  , brightness: function() {
      return (this.r / 255 * 0.30)
           + (this.g / 255 * 0.59)
           + (this.b / 255 * 0.11)
    }
    // Private: convert hsb to rgb
  , _hsbToRgb: function(h, s, v) {
      var vs, vsf
      
      /* process hue */
      h = parseInt(h) % 360
      if (h < 0) h += 360
      
      /* process saturation */
      s = parseInt(s)
      s = s > 100 ? 100 : s
      
      /* process brightness */
      v = parseInt(v)
      v = (v < 0 ? 0 : v > 100 ? 100 : v) * 255 / 100
      
      /* compile rgb */
      vs = v * s / 100
      vsf = (vs * ((h * 256 / 60) % 256)) / 256
      
      switch (Math.floor(h / 60)) {
        case 0:
          r = v
          g = v - vs + vsf
          b = v - vs
        break
        case 1:
          r = v - vsf
          g = v
          b = v - vs
        break
        case 2:
          r = v - vs
          g = v
          b = v - vs + vsf
        break
        case 3:
          r = v - vs
          g = v - vsf
          b = v
        break
        case 4:
          r = v - vs + vsf
          g = v - vs
          b = v
        break
        case 5:
          r = v
          g = v - vs
          b = v - vsf
        break
      }
      
      /* parse values */
      return {
        r: Math.floor(r + 0.5)
      , g: Math.floor(g + 0.5)
      , b: Math.floor(b + 0.5)
      }
    }
    // Private: ensure to six-based hex 
  , _fullHex: function(hex) {
      return hex.length == 4 ?
        [ '#',
          hex.substring(1, 2), hex.substring(1, 2)
        , hex.substring(2, 3), hex.substring(2, 3)
        , hex.substring(3, 4), hex.substring(3, 4)
        ].join('') : hex
    }
    // Private: component to hex value
  , _compToHex: function(comp) {
      var hex = comp.toString(16)
      return hex.length == 1 ? '0' + hex : hex
    }
    
  })
  
  // Test if given value is a color string
  SVG.Color.test = function(color) {
    color += ''
    return SVG.regex.isHex.test(color)
        || SVG.regex.isRgb.test(color)
        || SVG.regex.isHsb.test(color)
  }
  
  // Test if given value is a rgb object
  SVG.Color.isRgb = function(color) {
    return typeof color.r == 'number'
  }
  
  // Test if given value is a hsb object
  SVG.Color.isHsb = function(color) {
    return typeof color.h == 'number'
  }

  SVG.ViewBox = function(element) {
    var x, y, width, height
      , box  = element.bbox()
      , view = (element.attr('viewBox') || '').match(/[\d\.]+/g)
    
    /* clone attributes */
    this.x      = box.x
    this.y      = box.y
    this.width  = element.node.offsetWidth  || element.attr('width')
    this.height = element.node.offsetHeight || element.attr('height')
    
    if (view) {
      /* get width and height from viewbox */
      x      = parseFloat(view[0])
      y      = parseFloat(view[1])
      width  = parseFloat(view[2]) - x
      height = parseFloat(view[3]) - y
      
      /* calculate zoom accoring to viewbox */
      this.zoom = ((this.width / this.height) > (width / height)) ?
        this.height / height :
        this.width  / width
  
      /* calculate real pixel dimensions on parent SVG.Doc element */
      this.x      = x
      this.y      = y
      this.width  = width
      this.height = height
    }
    
    /* ensure a default zoom value */
    this.zoom = this.zoom || 1
    
  }
  
  SVG.extend(SVG.ViewBox, {
    // Parse viewbox to string
    toString: function() {
      return this.x + ' ' + this.y + ' ' + this.width + ' ' + this.height
    }
    
  })

  SVG.BBox = function(element) {
    /* actual, native bounding box */
    var box = element.node.getBBox()
    
    /* include translations on x an y */
    this.x = box.x + element.trans.x
    this.y = box.y + element.trans.y
    
    /* add the center */
    this.cx = this.x + box.width / 2
    this.cy = this.x + box.height / 2
    
    /* plain width and height */
    this.width  = box.width
    this.height = box.height
    
  }

  SVG.Element = function(node) {
    /* initialize attribute store with defaults */
    this.attrs = SVG.default.attrs()
    
    /* initialize style store */
    this.styles = {}
    
    /* initialize transformation store with defaults */
    this.trans = SVG.default.trans()
    
    /* keep reference to the element node */
    if (this.node = node) {
      this.type = node.nodeName
      this.attrs.id = node.getAttribute('id')
    }
    
  }
  
  //
  SVG.extend(SVG.Element, {
    // Move over x-axis
    x: function(x) {
      return this.attr('x', x)
    }
    // Move over y-axis
  , y: function(y) {
      return this.attr('y', y)
    }
    // Move by center over x-axis
  , cx: function(x) {
      return this.x(x - this.bbox().width / 2)
    }
    // Move by center over y-axis
  , cy: function(y) {
      return this.y(y - this.bbox().height / 2)
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
      var clone
      
      /* if this is a wrapped shape */
      if (this instanceof SVG.Wrap) {
        /* build new wrapped shape */
        clone = this.parent[this.child.node.nodeName]()
        clone.attrs = this.attrs
        
        /* copy child attributes and transformations */
        clone.child.trans = this.child.trans
        clone.child.attr(this.child.attrs).transform({})
        
        /* re-plot shape */
        if (clone.plot)
          clone.plot(this.child.attrs[this.child instanceof SVG.Path ? 'd' : 'points'])
        
      } else {
        var name = this.node.nodeName
        
        /* invoke shape method with shape-specific arguments */
        clone = name == 'rect' ?
          this.parent[name](this.attrs.width, this.attrs.height) :
        name == 'ellipse' ?
          this.parent[name](this.attrs.rx * 2, this.attrs.ry * 2) :
        name == 'image' ?
          this.parent[name](this.src) :
        name == 'text' ?
          this.parent[name](this.content) :
        name == 'g' ?
          this.parent.group() :
          this.parent[name]()
        
        clone.attr(this.attrs)
      }
      
      /* copy transformations */
      clone.trans = this.trans
      
      /* apply attributes and translations */
      return clone.transform({})
    }
    // Remove element
  , remove: function() {
      if (this.parent)
        this.parent.remove(this)
      
      return this
    }
    // Get parent document
  , doc: function() {
      return this._parent(SVG.Doc)
    }
    // Get parent nested document
  , nested: function() {
      return this._parent(SVG.Nested)
    }
    // Set svg element attribute
  , attr: function(a, v, n) {
      if (arguments.length < 2) {
        /* apply every attribute individually if an object is passed */
        if (typeof a == 'object')
          for (v in a)
            this.attr(v, a[v])
        
        /* act as a getter for style attributes */
        else if (this._isStyle(a))
          return a == 'text' ?
                   this.content :
                 a == 'leading' ?
                   this.leading() :
                   this.style(a)
        
        /* act as a getter if the first and only argument is not an object */
        else
          return this.attrs[a] || this.node.getAttribute(a)
      
      } else if (v === null) {
        /* remove value */
        this.node.removeAttribute(a)
        
      } else if (a == 'style') {
        /* redirect to the style method */
        return this.style(v)
      
      } else {
        /* store value */
        this.attrs[a] = v
        
        /* treat x differently on text elements */
        if (a == 'x' && this._isText()) {
          for (var i = this.lines.length - 1; i >= 0; i--)
            this.lines[i].attr(a, v)
        
        /* set the actual attribute */
        } else {
          /* BUG FIX: some browsers will render a stroke if a color is given even though stroke width is 0 */
          if (a == 'stroke-width')
            this.attr('stroke', parseFloat(v) > 0 ? this.attrs.stroke : null)
          
          /* ensure hex color */
          if (SVG.Color.test(v) || SVG.Color.isRgb(v) || SVG.Color.isHsb(v))
            v = new SVG.Color(v).toHex()
            
          /* set give attribute on node */
          n != null ?
            this.node.setAttributeNS(n, a, v) :
            this.node.setAttribute(a, v)
        }
        
        /* if the passed argument belongs to the style as well, add it there */
        if (this._isStyle(a)) {
          a == 'text' ?
            this.text(v) :
          a == 'leading' ?
            this.leading(v) :
            this.style(a, v)
          
          /* rebuild if required */
          if (this.rebuild)
            this.rebuild()
        }
      }
      
      return this
    }
    // Manage transformations
  , transform: function(o, v) {
      if (typeof o === 'string') {
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
      if (o.matrix != SVG.default.matrix)
        transform.push('matrix(' + o.matrix + ')')
      
      /* add rotation */
      if (o.rotation != 0) {
        transform.push(
          'rotate(' + o.rotation + ','
        + (o.cx != null ? o.cx : this.bbox().cx) + ','
        + (o.cy != null ? o.cy : this.bbox().cy) + ')'
        )
      }
      
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
        transform.push('translate(' + o.x + ',' + o.y + ')')
      
      /* add only te required transformations */
      this.node.setAttribute('transform', transform.join(' '))
      
      return this
    }
    // Dynamic style generator
  , style: function(s, v) {
      if (arguments.length == 0) {
        /* get full style */
        return this.attr('style')
      
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
      
      } else if (v === null) {
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
        this.attr('data-' + a, v === null ? null : r === true ? v : JSON.stringify(v))
      }
      
      return this
    }
    // Get bounding box
  , bbox: function() {
      return new SVG.BBox(this)
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
  , _isStyle: function(attr) {
      return typeof attr == 'string' ? SVG.regex.isStyle.test(attr) : false
    }
    // Private: element type tester
  , _isText: function() {
      return this instanceof SVG.Text
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


  SVG.Container = function(element) {
    this.constructor.call(this, element)
  }
  
  // Inherit from SVG.Element
  SVG.Container.prototype = new SVG.Element
  
  //
  SVG.extend(SVG.Container, {
    // Add given element at a position
    add: function(element, index) {
      if (!this.has(element)) {
        /* define insertion index if none given */
        index = index == null ? this.children().length : index
        
        /* remove references from previous parent */
        if (element.parent) {
          var i = element.parent.children().indexOf(element)
          element.parent.children().splice(i, 1)
        }
        
        /* add element references */
        this.children().splice(index, 0, element)
        this.node.insertBefore(element.node, this.node.childNodes[index] || null)
        element.parent = this
      }
      
      return this
    }
    // Basically does the same as `add()` but returns the added element
  , put: function(element, index) {
      this.add(element, index)
      return element
    }
    // Checks if the given element is a child
  , has: function(element) {
      return this.children().indexOf(element) >= 0
    }
    // Returns all child elements
  , children: function() {
      return this._children || (this._children = [])
    }
    // Iterates over all children and invokes a given block
  , each: function(block) {
      var index,
          children = this.children()
      
      for (index = 0, length = children.length; index < length; index++)
        if (children[index] instanceof SVG.Shape)
          block.apply(children[index], [index, children])
      
      return this
    }
    // Remove a child element at a position
  , remove: function(element) {
      var index = this.children().indexOf(element)
  
      this.children().splice(index, 1)
      this.node.removeChild(element.node)
      element.parent = null
      
      return this
    }
    // Returns defs element
  , defs: function() {
      return this._defs || (this._defs = this.put(new SVG.Defs(), 0))
    }
    // Re-level defs to first positon in element stack
  , level: function() {
      return this.remove(this.defs()).put(this.defs(), 0)
    }
    // Create a group element
  , group: function() {
      return this.put(new SVG.G())
    }
    // Create a rect element
  , rect: function(width, height) {
      return this.put(new SVG.Rect().size(width, height))
    }
    // Create circle element, based on ellipse
  , circle: function(size) {
      return this.ellipse(size, size)
    }
    // Create an ellipse
  , ellipse: function(width, height) {
      return this.put(new SVG.Ellipse().size(width, height).move(0, 0))
    }
    // Create a line element
  , line: function(x1, y1, x2, y2) {
      return this.put(new SVG.Line().attr({ x1: x1, y1: y1, x2: x2, y2: y2 }))
    }
    // Create a wrapped polyline element
  , polyline: function(points) {
      return this.put(new SVG.Wrap(new SVG.Polyline())).plot(points)
    }
    // Create a wrapped polygon element
  , polygon: function(points) {
      return this.put(new SVG.Wrap(new SVG.Polygon())).plot(points)
    }
    // Create a wrapped path element
  , path: function(data) {
      return this.put(new SVG.Wrap(new SVG.Path())).plot(data)
    }
    // Create image element, load image and set its size
  , image: function(source, width, height) {
      width = width != null ? width : 100
      return this.put(new SVG.Image().load(source).size(width, height != null ? height : width))
    }
    // Create text element
  , text: function(text) {
      return this.put(new SVG.Text().text(text))
    }
    // Create nested svg document
  , nested: function() {
      return this.put(new SVG.Nested())
    }
    // Create gradient element in defs
  , gradient: function(type, block) {
      return this.defs().gradient(type, block)
    }
    // Create pattern element in defs
  , pattern: function(width, height, block) {
      return this.defs().pattern(width, height, block)
    }
    // Create masking element
  , mask: function() {
      return this.defs().put(new SVG.Mask())
    }
    // Get first child, skipping the defs node
  , first: function() {
      return this.children()[0] instanceof SVG.Defs ? this.children()[1] : this.children()[0]
    }
    // Get the last child
  , last: function() {
      return this.children()[this.children().length - 1]
    }
    // Get the viewBox and calculate the zoom value
  , viewbox: function() {
      /* act as a getter if there are no arguments */
      if (arguments.length == 0)
        return new SVG.ViewBox(this)
      
      /* otherwise act as a setter */
      return this.attr('viewBox', Array.prototype.slice.call(arguments).join(' '))
    }
    // Remove all elements in this container
  , clear: function() {
      this._children = []
      
      while (this.node.hasChildNodes())
        this.node.removeChild(this.node.lastChild)
      
      return this
    }
    
  })

  SVG.FX = function(element) {
    /* store target element */
    this.target = element
  }
  
  //
  SVG.extend(SVG.FX, {
    // Add animation parameters and start animation
    animate: function(duration, ease) {
      /* ensure default duration and easing */
      duration = duration == null ? 1000 : duration
      ease = ease || '<>'
      
      var akeys, tkeys, skeys
        , element   = this.target
        , fx        = this
        , start     = new Date().getTime()
        , finish    = start + duration
      
      /* start animation */
      this.interval = setInterval(function(){
        // This code was borrowed from the emile.js micro framework by Thomas Fuchs, aka MadRobby.
        var i, key
          , time = new Date().getTime()
          , pos = time > finish ? 1 : (time - start) / duration
        
        /* collect attribute keys */
        if (akeys == null) {
          akeys = []
          for (key in fx.attrs)
            akeys.push(key)
        }
        
        /* collect transformation keys */
        if (tkeys == null) {
          tkeys = []
          for (key in fx.trans)
            tkeys.push(key)
        }
        
        /* collect style keys */
        if (skeys == null) {
          skeys = []
          for (key in fx.styles)
            skeys.push(key)
        }
        
        /* apply easing */
        pos = ease == '<>' ?
          (-Math.cos(pos * Math.PI) / 2) + 0.5 :
        ease == '>' ?
          Math.sin(pos * Math.PI / 2) :
        ease == '<' ?
          -Math.cos(pos * Math.PI / 2) + 1 :
        ease == '-' ?
          pos :
        typeof ease == 'function' ?
          ease(pos) :
          pos
        
        /* run all x-position properties */
        if (fx._x)
          element.x(fx._at(fx._x, pos))
        else if (fx._cx)
          element.cx(fx._at(fx._cx, pos))
        
        /* run all y-position properties */
        if (fx._y)
          element.y(fx._at(fx._y, pos))
        else if (fx._cy)
          element.cy(fx._at(fx._cy, pos))
        
        /* run all size properties */
        if (fx._size)
          element.size(fx._at(fx._size.width, pos), fx._at(fx._size.height, pos))
        
        /* animate attributes */
        for (i = akeys.length - 1; i >= 0; i--)
          element.attr(akeys[i], fx._at(fx.attrs[akeys[i]], pos))
        
        /* animate transformations */
        for (i = tkeys.length - 1; i >= 0; i--)
          element.transform(tkeys[i], fx._at(fx.trans[tkeys[i]], pos))
        
        /* animate styles */
        for (i = skeys.length - 1; i >= 0; i--)
          element.style(skeys[i], fx._at(fx.styles[skeys[i]], pos))
        
        /* callback for each keyframe */
        if (fx._during)
          fx._during.call(element, pos, function(from, to) {
            return fx._at({ from: from, to: to }, pos)
          })
        
        /* finish off animation */
        if (time > finish) {
          clearInterval(fx.interval)
          fx._after ? fx._after.apply(element, [fx]) : fx.stop()
        }
        
      }, duration > 10 ? 10 : duration)
      
      return this
    }
    // Get bounding box of target element
  , bbox: function() {
      return this.target.bbox()
    }
    // Add animatable attributes
  , attr: function(a, v, n) {
      if (typeof a == 'object')
        for (var key in a)
          this.attr(key, a[key])
      
      else
        this.attrs[a] = { from: this.target.attr(a), to: v }
      
      return this
    }
    // Add animatable transformations
  , transform: function(o, v) {
      if (arguments.length == 1) {
        /* parse matrix string */
        o = this.target._parseMatrix(o)
        
        /* dlete matrixstring from object */
        delete o.matrix
        
        /* store matrix values */
        for (v in o)
          this.trans[v] = { from: this.target.trans[v], to: o[v] }
        
      } else {
        /* apply transformations as object if key value arguments are given*/
        var transform = {}
        transform[o] = v
        
        this.transform(transform)
      }
      
      return this
    }
    // Add animatable styles
  , style: function(s, v) {
      if (typeof s == 'object')
        for (var key in s)
          this.style(key, s[key])
      
      else
        this.styles[s] = { from: this.target.style(s), to: v }
      
      return this
    }
    // Animatable x-axis
  , x: function(x) {
      var b = this.bbox()
      this._x = { from: b.x, to: x }
      
      return this
    }
    // Animatable y-axis
  , y: function(y) {
      var b = this.bbox()
      this._y = { from: b.y, to: y }
      
      return this
    }
    // Animatable center x-axis
  , cx: function(x) {
      var b = this.bbox()
      this._cx = { from: b.cx, to: x }
      
      return this
    }
    // Animatable center y-axis
  , cy: function(y) {
      var b = this.bbox()
      this._cy = { from: b.cy, to: y }
      
      return this
    }
    // Add animatable move
  , move: function(x, y) {
      return this.x(x).y(y)
    }
    // Add animatable center
  , center: function(x, y) {
      return this.cx(x).cy(y)
    }
    // Add animatable size
  , size: function(width, height) {
      if (this.target instanceof SVG.Text) {
        /* animate font size for Text elements */
        this.attr('font-size', width)
        
      } else {
        /* animate bbox based size for all other elements */
        var box = this.target.bbox()
  
        this._size = {
          width:  { from: box.width,  to: width  }
        , height: { from: box.height, to: height }
        }
      }
      
      return this
    }
    // Add callback for each keyframe
  , during: function(during) {
      this._during = during
      
      return this
    }
    // Callback after animation
  , after: function(after) {
      this._after = after
      
      return this
    }
    // Stop running animation
  , stop: function() {
      /* stop current animation */
      clearInterval(this.interval)
      
      /* reset storage for properties that need animation */
      this.attrs  = {}
      this.trans  = {}
      this.styles = {}
      delete this._x
      delete this._y
      delete this._cx
      delete this._cy
      delete this._size
      delete this._after
      delete this._during
      
      return this
    }
    // Private: at position according to from and to
  , _at: function(o, pos) {
      /* number recalculation */
      return typeof o.from == 'number' ?
        o.from + (o.to - o.from) * pos :
      
      /* unit recalculation */
      SVG.regex.unit.test(o.to) ?
        this._unit(o, pos) :
      
      /* color recalculation */
      o.to && (o.to.r || SVG.Color.test(o.to)) ?
        this._color(o, pos) :
      
      /* for all other values wait until pos has reached 1 to return the final value */
      pos < 1 ? o.from : o.to
    }
    // Private: tween unit
  , _unit: function(o, pos) {
      var match, from
      
      /* convert FROM unit */
      match = SVG.regex.unit.exec(o.from.toString())
      from = parseFloat(match[1])
      
      /* convert TO unit */
      match = SVG.regex.unit.exec(o.to)
      
      return (from + (parseFloat(match[1]) - from) * pos) + match[2]
    }
    // Private: tween color
  , _color: function(o, pos) {
      var from, to
      
      /* normalise pos */
      pos = pos < 0 ? 0 : pos > 1 ? 1 : pos
      
      /* convert FROM */
      from = new SVG.Color(o.from)
      
      /* convert TO hex to rgb */
      to = new SVG.Color(o.to)
      
      /* tween color and return hex */
      return new SVG.Color({
        r: ~~(from.r + (to.r - from.r) * pos)
      , g: ~~(from.g + (to.g - from.g) * pos)
      , b: ~~(from.b + (to.b - from.b) * pos)
      }).toHex()
    }
    
  })
  //
  SVG.extend(SVG.Element, {
    // Get fx module or create a new one, then animate with given duration and ease
    animate: function(duration, ease) {
      return (this.fx || (this.fx = new SVG.FX(this))).stop().animate(duration, ease)
    },
    // Stop current animation; this is an alias to the fx instance
    stop: function() {
      this.fx.stop()
      
      return this
    }
    
  })
  // Usage:
  
  //     rect.animate(1500, '>').move(200, 300).after(function() {
  //       this.fill({ color: '#f06' })
  //     })


  ;[ 'click'
  , 'dblclick'
  , 'mousedown'
  , 'mouseup'
  , 'mouseover'
  , 'mouseout'
  , 'mousemove'
  , 'mouseenter'
  , 'mouseleave'
  , 'touchstart'
  , 'touchend'
  , 'touchmove'
  , 'touchcancel' ].forEach(function(event) {
    
    /* add event to SVG.Element */
    SVG.Element.prototype[event] = function(f) {
      var self = this
      
      /* bind event to element rather than element node */
      this.node['on' + event] = typeof f == 'function' ?
        function() { return f.apply(self, arguments) } : null
      
      return this
    }
    
  })
  
  // Add event binder in the SVG namespace
  SVG.on = function(node, event, listener) {
    if (node.addEventListener)
      node.addEventListener(event, listener, false)
    else
      node.attachEvent('on' + event, listener)
  }
  
  // Add event unbinder in the SVG namespace
  SVG.off = function(node, event, listener) {
    if (node.removeEventListener)
      node.removeEventListener(event, listener, false)
    else
      node.detachEvent('on' + event, listener)
  }
  
  //
  SVG.extend(SVG.Element, {
    // Bind given event to listener
    on: function(event, listener) {
      SVG.on(this.node, event, listener)
      
      return this
    }
    // Unbind event from listener
  , off: function(event, listener) {
      SVG.off(this.node, event, listener)
      
      return this
    }
  })

  SVG.G = function() {
    this.constructor.call(this, SVG.create('g'))
  }
  
  // Inherit from SVG.Container
  SVG.G.prototype = new SVG.Container
  
  SVG.extend(SVG.G, {
    // Move over x-axis
    x: function(x) {
      return this.transform('x', x)
    }
    // Move over y-axis
  , y: function(y) {
      return this.transform('y', y)
    }
    // Get defs
  , defs: function() {
      return this.doc().defs()
    }
    
  })

  SVG.extend(SVG.Element, {
    // Get all siblings, including myself
    siblings: function() {
      return this.parent.children()
    }
    // Get the curent position siblings
  , position: function() {
      return this.siblings().indexOf(this)
    }
    // Get the next element (will return null if there is none)
  , next: function() {
      return this.siblings()[this.position() + 1]
    }
    // Get the next element (will return null if there is none)
  , previous: function() {
      return this.siblings()[this.position() - 1]
    }
    // Send given element one step forward
  , forward: function() {
      return this.parent.remove(this).put(this, this.position() + 1)
    }
    // Send given element one step backward
  , backward: function() {
      this.parent.level()
      
      var i = this.position()
      
      if (i > 1)
        this.parent.remove(this).add(this, i - 1)
      
      return this
    }
    // Send given element all the way to the front
  , front: function() {
      return this.parent.remove(this).put(this)
    }
    // Send given element all the way to the back
  , back: function() {
      this.parent.level()
      
      if (this.position() > 1)
        this.parent.remove(this).add(this, 0)
      
      return this
    }
    
  })

  SVG.Defs = function() {
    this.constructor.call(this, SVG.create('defs'))
  }
  
  // Inherits from SVG.Container
  SVG.Defs.prototype = new SVG.Container

  SVG.Mask = function() {
    this.constructor.call(this, SVG.create('mask'))
  }
  
  // Inherit from SVG.Container
  SVG.Mask.prototype = new SVG.Container
  
  SVG.extend(SVG.Element, {
    
    // Distribute mask to svg element
    maskWith: function(element) {
      /* use given mask or create a new one */
      this.mask = element instanceof SVG.Mask ? element : this.parent.mask().add(element)
      
      return this.attr('mask', 'url(#' + this.mask.attr('id') + ')')
    }
    
  })

  SVG.Pattern = function(type) {
    this.constructor.call(this, SVG.create('pattern'))
  }
  
  // Inherit from SVG.Container
  SVG.Pattern.prototype = new SVG.Container
  
  //
  SVG.extend(SVG.Pattern, {
    // Return the fill id
    fill: function() {
      return 'url(#' + this.attr('id') + ')'
    }
    
  })
  
  //
  SVG.extend(SVG.Defs, {
    
    /* define gradient */
    pattern: function(width, height, block) {
      var element = this.put(new SVG.Pattern())
      
      /* invoke passed block */
      block(element)
      
      return element.attr({
        x:            0
      , y:            0
      , width:        width
      , height:       height
      , patternUnits: 'userSpaceOnUse'
      })
    }
    
  });

  SVG.Gradient = function(type) {
    this.constructor.call(this, SVG.create(type + 'Gradient'))
    
    /* store type */
    this.type = type
  }
  
  // Inherit from SVG.Container
  SVG.Gradient.prototype = new SVG.Container
  
  //
  SVG.extend(SVG.Gradient, {
    // From position
    from: function(x, y) {
      return this.type == 'radial' ?
        this.attr({ fx: x + '%', fy: y + '%' }) :
        this.attr({ x1: x + '%', y1: y + '%' })
    }
    // To position
  , to: function(x, y) {
      return this.type == 'radial' ?
        this.attr({ cx: x + '%', cy: y + '%' }) :
        this.attr({ x2: x + '%', y2: y + '%' })
    }
    // Radius for radial gradient
  , radius: function(radius) {
      return this.type == 'radial' ?
        this.attr({ r: radius + '%' }) :
        this
    }
    // Add a color stop
  , at: function(stop) {
      return this.put(new SVG.Stop(stop))
    }
    // Update gradient
  , update: function(block) {
      /* remove all stops */
      while (this.node.hasChildNodes())
        this.node.removeChild(this.node.lastChild)
      
      /* invoke passed block */
      block(this)
      
      return this
    }
    // Return the fill id
  , fill: function() {
      return 'url(#' + this.attr('id') + ')'
    }
    
  })
  
  //
  SVG.extend(SVG.Defs, {
    
    /* define gradient */
    gradient: function(type, block) {
      var element = this.put(new SVG.Gradient(type))
      
      /* invoke passed block */
      block(element)
      
      return element
    }
    
  })
  
  
  SVG.Stop = function(stop) {
    this.constructor.call(this, SVG.create('stop'))
    
    /* immediatelly build stop */
    this.update(stop)
  }
  
  // Inherit from SVG.Element
  SVG.Stop.prototype = new SVG.Element()
  
  //
  SVG.extend(SVG.Stop, {
    
    /* add color stops */
    update: function(o) {
      var index
        , attr = ['opacity', 'color']
      
      /* build style attribute */
      for (index = attr.length - 1; index >= 0; index--)
        if (o[attr[index]] != null)
          this.style('stop-' + attr[index], o[attr[index]])
      
      /* set attributes */
      return this.attr('offset', (o.offset != null ? o.offset : this.attrs.offset || 0) + '%')
    }
    
  })
  


  SVG.Doc = function(element) {
    this.constructor.call(this, SVG.create('svg'))
    
    /* ensure the presence of a html element */
    this.parent = typeof element == 'string' ?
      document.getElementById(element) :
      element
    
    /* set svg element attributes and create the <defs> node */
    this
      .attr({ xmlns: SVG.ns, version: '1.1', width: '100%', height: '100%' })
      .attr('xlink', SVG.xlink, SVG.ns)
      .defs()
    
    /* ensure correct rendering for safari */
    this.stage()
  }
  
  // Inherits from SVG.Container
  SVG.Doc.prototype = new SVG.Container
  
  // Hack for safari preventing text to be rendered in one line.
  // Basically it sets the position of the svg node to absolute
  // when the dom is loaded, and resets it to relative a few milliseconds later.
  SVG.Doc.prototype.stage = function() {
    var check
      , element = this
      , wrapper = document.createElement('div')
    
    /* set temp wrapper to position relative */
    wrapper.style.cssText = 'position:relative;height:100%;'
    
    /* put element into wrapper */
    element.parent.appendChild(wrapper)
    wrapper.appendChild(element.node)
    
    /* check for dom:ready */
    check = function() {
      if (document.readyState === 'complete') {
        element.style('position:absolute;')
        setTimeout(function() {
          /* set position back to relative */
          element.style('position:relative;')
          
          /* remove temp wrapper */
          element.parent.removeChild(element.node.parentNode)
          element.node.parentNode.removeChild(element.node)
          element.parent.appendChild(element.node)
          
        }, 5)
      } else {
        setTimeout(check, 10)
      }
    }
    
    check()
    
    return this
  }

  SVG.Shape = function(element) {
    this.constructor.call(this, element)
  }
  
  // Inherit from SVG.Element
  SVG.Shape.prototype = new SVG.Element

  SVG.Wrap = function(element) {
    this.constructor.call(this, SVG.create('g'))
    
    /* insert and store child */
    this.node.insertBefore(element.node, null)
    this.child = element
    this.type = element.node.nodeName
  }
  
  // inherit from SVG.Shape
  SVG.Wrap.prototype = new SVG.Shape()
  
  SVG.extend(SVG.Wrap, {
    // Move over x-axis
    x: function(x) {
      return this.transform('x', x)
    }
    // Move over y-axis
  , y: function(y) {
      return this.transform('y', y)
    }
    // Set the actual size in pixels
  , size: function(width, height) {
      var scale = width / this._b.width
      
      this.child.transform({
        scaleX: scale
      , scaleY: height != null ? height / this._b.height : scale
      })
  
      return this
    }
    // Move by center
  , center: function(x, y) {
      return this.move(
        x + (this._b.width  * this.child.trans.scaleX) / -2
      , y + (this._b.height * this.child.trans.scaleY) / -2
      )
    }
    // Create distributed attr
  , attr: function(a, v, n) {
      /* call individual attributes if an object is given */
      if (typeof a == 'object') {
        for (v in a) this.attr(v, a[v])
      
      /* act as a getter if only one argument is given */
      } else if (arguments.length < 2) {
        return a == 'transform' ? this.attrs[a] : this.child.attrs[a]
      
      /* apply locally for certain attributes */
      } else if (a == 'transform') {
        this.attrs[a] = v
        
        n != null ?
          this.node.setAttributeNS(n, a, v) :
          this.node.setAttribute(a, v)
      
      /* apply attributes to child */
      } else {
        this.child.attr(a, v, n)
      }
      
      return this
    }
    // Distribute plot method to child
  , plot: function(data) {
      /* plot new shape */
      this.child.plot(data)
      
      /* get and store new bbox */
      this._b = this.child.bbox()
      
      /* reposition element withing wrapper */
      this.child.transform({
        x: -this._b.x
      , y: -this._b.y
      })
      
      return this
    }
    
  })

  SVG.Rect = function() {
    this.constructor.call(this, SVG.create('rect'))
  }
  
  // Inherit from SVG.Shape
  SVG.Rect.prototype = new SVG.Shape

  SVG.Ellipse = function() {
    this.constructor.call(this, SVG.create('ellipse'))
  }
  
  // Inherit from SVG.Shape
  SVG.Ellipse.prototype = new SVG.Shape
  
  //
  SVG.extend(SVG.Ellipse, {
    // Move over x-axis
    x: function(x) {
      return this.cx(x + this.attrs.rx)
    }
    // Move over y-axis
  , y: function(y) {
      return this.cy(y + this.attrs.ry)
    }
    // Move by center over x-axis
  , cx: function(x) {
      return this.attr('cx', x)
    }
    // Move by center over y-axis
  , cy: function(y) {
      return this.attr('cy', y)
    }
    // Custom size function
  , size: function(width, height) {
      return this.attr({
        rx: width / 2,
        ry: height / 2
      })
    }
    
  })
  
  // Usage:
  
  //     draw.ellipse(200, 100)

  SVG.Line = function() {
    this.constructor.call(this, SVG.create('line'))
  }
  
  // Inherit from SVG.Shape
  SVG.Line.prototype = new SVG.Shape
  
  // Add required methods
  SVG.extend(SVG.Line, {
    // Move over x-axis
    x: function(x) {
      var b = this.bbox()
      
      return this.attr({
        x1: this.attrs.x1 - b.x + x
      , x2: this.attrs.x2 - b.x + x
      })
    }
    // Move over y-axis
  , y: function(y) {
      var b = this.bbox()
      
      return this.attr({
        y1: this.attrs.y1 - b.y + y
      , y2: this.attrs.y2 - b.y + y
      })
    }
    // Move by center over x-axis
  , cx: function(x) {
      return this.x(x - this.bbox().width / 2)
    }
    // Move by center over y-axis
  , cy: function(y) {
      return this.y(y - this.bbox().height / 2)
    }
    // Set line size by width and height
  , size: function(width, height) {
      var b = this.bbox()
      
      return this
        .attr(this.attrs.x1 < this.attrs.x2 ? 'x2' : 'x1', b.x + width)
        .attr(this.attrs.y1 < this.attrs.y2 ? 'y2' : 'y1', b.y + height)
    }
    
  })

  SVG.Poly = {
    // Set polygon data with default zero point if no data is passed
    plot: function(points) {
      this.attr('points', points || '0,0')
      
      return this
    }
  }
  
  SVG.Polyline = function() {
    this.constructor.call(this, SVG.create('polyline'))
  }
  
  // Inherit from SVG.Shape
  SVG.Polyline.prototype = new SVG.Shape
  
  // Add polygon-specific functions
  SVG.extend(SVG.Polyline, SVG.Poly)
  
  SVG.Polygon = function() {
    this.constructor.call(this, SVG.create('polygon'))
  }
  
  // Inherit from SVG.Shape
  SVG.Polygon.prototype = new SVG.Shape
  
  // Add polygon-specific functions
  SVG.extend(SVG.Polygon, SVG.Poly)

  SVG.Path = function() {
    this.constructor.call(this, SVG.create('path'))
  }
  
  // Inherit from SVG.Shape
  SVG.Path.prototype = new SVG.Shape()
  
  SVG.extend(SVG.Path, {
    // Move over x-axis
    x: function(x) {
      return this.transform('x', x)
    }
    // Move over y-axis
  , y: function(y) {
      return this.transform('y', y)
    }
    // Set path data
  , plot: function(data) {
      return this.attr('d', data || 'M0,0')
    }
    
  })

  SVG.Image = function() {
    this.constructor.call(this, SVG.create('image'))
  }
  
  // Inherit from SVG.Element
  SVG.Image.prototype = new SVG.Shape()
  
  SVG.extend(SVG.Image, {
    
    /* (re)load image */
    load: function(url) {
      this.src = url
      return (url ? this.attr('xlink:href', url, SVG.xlink) : this)
    }
    
  })

  var _styleAttr = ('size family weight stretch variant style').split(' ')
  
  SVG.Text = function() {
    this.constructor.call(this, SVG.create('text'))
    
    /* define default style */
    this.styles = {
      'font-size':    16
    , 'font-family':  'Helvetica'
    , 'text-anchor':  'start'
    }
    
    this._leading = 1.2
  }
  
  // Inherit from SVG.Element
  SVG.Text.prototype = new SVG.Shape
  
  SVG.extend(SVG.Text, {
    // Set the text content
    text: function(text) {
      /* act as getter */
      if (text == null)
        return this.content
      
      /* remove existing lines */
      this.clear()
      
      /* update the content */
      this.content = SVG.regex.isBlank.test(text) ? 'text' : text
      
      var i, il
        , lines = text.split('\n')
      
      /* build new lines */
      for (i = 0, il = lines.length; i < il; i++)
        this.tspan(lines[i])
        
      /* set style */
      return this.attr('style', this.style())
    }
    // Create a tspan
  , tspan: function(text) {
      var tspan = new SVG.TSpan().text(text)
      
      /* add new tspan */
      this.node.appendChild(tspan.node)
      this.lines.push(tspan)
      
      return tspan.attr('style', this.style())
    }
    // Move element by its center
  , center: function(x, y) {
      var anchor = this.style('text-anchor')
        , box = this.bbox()
        , x = anchor == 'start' ?
            x - box.width / 2 :
          anchor == 'end' ?
            x + box.width / 2 : x
      
      return this.move(x, y - box.height / 2)
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
      this._leading = value
      
      return this.rebuild()
    }
    // rebuild appearance type
  , rebuild: function() {
      var i, il
        , size = this.styles['font-size']
      
      /* define position of all lines */
      for (i = 0, il = this.lines.length; i < il; i++)
        this.lines[i].attr({
          dy: size * this._leading - (i == 0 ? size * 0.3 : 0)
        , x: (this.attrs.x || 0)
        , style: this.style()
        })
      
      return this
    }
    // Clear all lines
  , clear: function() {
      /* remove existing child nodes */
      while (this.node.hasChildNodes())
        this.node.removeChild(this.node.lastChild)
      
      this.lines = []
      
      return this
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
    
  })

  SVG.Nested = function() {
    this.constructor.call(this, SVG.create('svg'))
    
    this.style('overflow', 'visible')
  }
  
  // Inherit from SVG.Container
  SVG.Nested.prototype = new SVG.Container

  SVG._stroke = ['color', 'width', 'opacity', 'linecap', 'linejoin', 'miterlimit', 'dasharray', 'dashoffset']
  SVG._fill   = ['color', 'opacity', 'rule']
  
  
  // Prepend correct color prefix
  var _colorPrefix = function(type, attr) {
    return attr == 'color' ? type : type + '-' + attr
  }
  
  /* Add sugar for fill and stroke */
  ;['fill', 'stroke'].forEach(function(method) {
    var extension = {}
    
    extension[method] = function(o) {
      var indexOf
      
      if (typeof o == 'string' || SVG.Color.isRgb(o) || SVG.Color.isHsb(o))
        this.attr(method, o)
      
      else
        /* set all attributes from _fillAttr and _strokeAttr list */
        for (index = SVG['_' + method].length - 1; index >= 0; index--)
          if (o[SVG['_' + method][index]] != null)
            this.attr(_colorPrefix(method, SVG['_' + method][index]), o[SVG['_' + method][index]])
      
      return this
    }
    
    SVG.extend(SVG.Shape, SVG.FX, extension)
    
  })
  
  SVG.extend(SVG.Element, SVG.FX, {
    // Rotation
    rotate: function(deg, cx, cy) {
      return this.transform({
        rotation: deg || 0
      , cx: cx
      , cy: cy
      })
    }
    // Skew
  , skew: function(x, y) {
      return this.transform({
        skewX: x || 0
      , skewY: y || 0
      })
    }
    // Scale
  , scale: function(x, y) {
      return this.transform({
        scaleX: x,
        scaleY: y == null ? x : y
      })
    }
    // Matrix
  , matrix: function(m) {
      return this.transform({ matrix: m })
    }
    // Opacity
  , opacity: function(value) {
      return this.attr('opacity', value)
    }
  
  })
  
  
  if (SVG.Text) {
    SVG.extend(SVG.Text, SVG.FX, {
      // Set font 
      font: function(o) {
        for (var key in o)
          key == 'anchor' ?
            this.attr('text-anchor', o[key]) :
          _styleAttr.indexOf(key) > -1 ?
            this.attr('font-'+ key, o[key]) :
            this.attr(key, o[key])
        
        return this
      }
      
    })
  }
  


}).call(this);
