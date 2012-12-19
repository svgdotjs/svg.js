/* svg.js 0.1a - svg container element group arrange clip doc defs shape rect circle ellipse path image sugar - svgjs.com/license */
(function() {

  this.SVG = {
    ns:     'http://www.w3.org/2000/svg',
    xlink:  'http://www.w3.org/1999/xlink',
    
    create: function(e) {
      return document.createElementNS(this.ns, e);
    },
    
    extend: function(o, m) {
      for (var k in m)
        o.prototype[k] = m[k];
    }
  };
  
  this.svg = function(e) {
    return new SVG.Doc(e);
  };

  SVG.Container = {
    
    add: function(e, i) {
      if (!this.has(e)) {
        i = i == null ? this.children().length : i;
        this.children().splice(i, 0, e);
        this.node.insertBefore(e.node, this.node.childNodes[i]);
        e.parent = this;
      }
      
      return this;
    },
    
    has: function(e) {
      return this.children().indexOf(e) >= 0;
    },
    
    children: function() {
      return this._children || (this._children = []);
    },
    
    remove: function(e) {
      return this.removeAt(this.children().indexOf(e));
    },
    
    removeAt: function(i) {
      if (0 <= i && i < this.children().length) {
        var e = this.children()[i];
        this.children().splice(i, 1);
        this.node.removeChild(e.node);
        e.parent = null;
      }
      
      return this;
    },
    
    defs: function() {
      if (this._defs == null) {
        this._defs = new SVG.Defs();
        this.add(this._defs, 0);
      }
      
      return this._defs;
    },
    
    levelDefs: function() {
      var d = this.defs();
      
      this.remove(d).add(d, 0);
      
      return this;
    },
    
    group: function() {
      var e = new SVG.G();
      this.add(e);
      
      return e;
    },
    
    rect: function(v) {
      return this.place(new SVG.Rect(), v);
    },
    
    circle: function(v) {
      var g;
      
      if (v != null) {
        g = { x: v.x, y: v.y };
        
        if (v.r || v.radius)
          g.width = g.height = (v.r || v.radius) * 2;
        else
          g.width = g.height = v.width || v.height;
      }
      
      return this.place(new SVG.Circle(), g);
    },
    
    ellipse: function(v) {
      var g;
      
      if (v != null) {
        g = { x: v.x, y: v.y };
        
        if (v.width)  g.width  = v.width;
        if (v.height) g.height = v.height;
        if (v.rx)     g.width  = v.rx * 2;
        if (v.ry)     g.height = v.ry * 2;
      }
      
      return this.place(new SVG.Ellipse(), g);
    },
    
    path: function(v) {
      return this.place(new SVG.Path(), v);
    },
    
    image: function(v) {
      return this.place(new SVG.Image(), v);
    },
    
    place: function(e, v) {
      if (v != null) {
        if (v.x != null && v.y != null)
          e.move(v.x, v.y);
        
        if (v.width != null && v.height != null)
          e.size(v.width, v.height);
        
        if (v.data != null)
          e.data(v.data);
        
        if (v.src != null)
          e.load(v.src);
      }
      
      this.add(e);
      
      return e;
    }
    
  };

  SVG.Element = function Element(n) {
    this.node = n;
    this.attrs = {};
  };
  
  // Add element-specific functions
  SVG.extend(SVG.Element, {
    
    // move element to given x and y values
    move: function(x, y) {
      return this.attr({ x: x, y: y });
    },
    
    // set element size to given width and height
    size: function(w, h) {
      return this.attr({ width: w, height: h });
    },
    
    // remove element
    remove: function() {
      return this.parent != null ? this.parent.remove(this) : void 0;
    },
    
    // get parent document
    parentDoc: function() {
      return this._parent(SVG.Doc);
    },
  
    // get parent svg wrapper
    mother: function() {
      return this.parentDoc();
    },
    
    // set svg element attribute
    attr: function(a, v, n) {
      
      if (arguments.length < 2) {
        if (typeof a == 'object')
          for (v in a) this.attr(v, a[v]);
        else
          return this.attrs[a];
      
      } else {
        this.attrs[a] = v;
        n != null ?
          this.node.setAttributeNS(n, a, v) :
          this.node.setAttribute(a, v);
          
      }
      
      return this;
    },
    
    // transformations
    transform: function(t, r) {
      var n = [],
          s = this.attr('transform') || '',
          l = s.match(/([a-z]+\([^\)]+\))/g) || [];
      
      if (r !== true) {
        var v = t.match(/^([A-Za-z\-]+)/)[1],
            r = new RegExp('^' + v);
        
        for (var i = 0, s = l.length; i < s; i++)
          if (!r.test(l[i]))
            n.push(l[i]);
        
      } else
        n = l;
      
      n.push(t);
      
      return this.attr('transform', n.join(' '));
    },
  
    // get bounding box
    bbox: function() {
      var b = this.node.getBBox();
      
      b.cx = b.x + b.width / 2;
      b.cy = b.y + b.height / 2;
      
      return b;
    },
    
    // private: find svg parent
    _parent: function(pt) {
      var e = this;
  
      while (e != null && !(e instanceof pt))
        e = e.parent;
  
      return e;
    }
    
  });


  SVG.G = function G() {
    this.constructor.call(this, SVG.create('g'));
  };
  
  // inherit from SVG.Element
  SVG.G.prototype = new SVG.Element();
  
  // include the container object
  SVG.extend(SVG.G, SVG.Container);

  SVG.extend(SVG.Element, {
    
    // get all siblings, including me
    siblings: function() {
      return this.mother().children();
    },
    
    // send given element one step forwards
    forward: function() {
      var i = this.siblings().indexOf(this);
      this.mother().remove(this).add(this, i + 1);
      
      return this;
    },
    
    // send given element one step backwards
    backward: function() {
      var i, p = this.mother();
      
      p.levelDefs();
      
      i = this.siblings().indexOf(this);
      
      if (i > 1)
        p.remove(this).add(this, i - 1);
      
      return this;
    },
    
    // send given element all the way to the front
    front: function() {
      this.mother().remove(this).add(this);
      
      return this;
    },
    
    // send given element all the way to the back
    back: function() {
      var i, p = this.mother();
      
      p.levelDefs();
      
      i = this.siblings().indexOf(this);
      
      if (i > 1)
        p.remove(this).add(this, 0);
      
      return this;
    }
    
  });

  var clipID = 0;
  
  SVG.Clip = function Clip() {
    this.constructor.call(this, SVG.create('clipPath'));
    this.id = '_' + (clipID++);
    this.attr('id', this.id);
  };
  
  // inherit from SVG.Element
  SVG.Clip.prototype = new SVG.Element();
  
  // include the container object
  SVG.extend(SVG.Clip, SVG.Container);
  
  // add clipping functionality to element
  SVG.extend(SVG.Element, {
    
    // clip element using another element
    clip: function(block) {
      var p = this.mother().defs().clipPath();
      block(p);
  
      return this.clipTo(p);
    },
  
    // distribute clipping path to svg element
    clipTo: function(p) {
      return this.attr('clip-path', 'url(#' + p.id + ')');
    }
    
  });


  SVG.Doc = function Doc(e) {
    this.constructor.call(this, SVG.create('svg'));
    
    this.attr('xmlns', SVG.ns);
    this.attr('version', '1.1');
    this.attr('xlink', SVG.xlink, SVG.ns);
    
    this.defs();
    
    if (typeof e == 'string')
      e = document.getElementById(e);
    
    e.appendChild(this.node);
  };
  
  // inherit from SVG.Element
  SVG.Doc.prototype = new SVG.Element();
  
  // include the container object
  SVG.extend(SVG.Doc, SVG.Container);

  SVG.Defs = function Defs() {
    this.constructor.call(this, SVG.create('defs'));
  };
  
  // inherit from SVG.Element
  SVG.Defs.prototype = new SVG.Element();
  
  // include the container object
  SVG.extend(SVG.Defs, SVG.Container);
  
  // Add def-specific functions
  SVG.extend(SVG.Defs, {
    
    // define clippath
    clipPath: function() {
      var e = new SVG.Clip();
      this.add(e);
  
      return e;
    }
    
  });

  SVG.Shape = function Shape(element) {
    this.constructor.call(this, element);
  };
  
  // inherit from SVG.Element
  SVG.Shape.prototype = new SVG.Element();

  SVG.Rect = function Rect() {
    this.constructor.call(this, SVG.create('rect'));
  };
  
  // inherit from SVG.Shape
  SVG.Rect.prototype = new SVG.Shape();

  SVG.Circle = function Circle() {
    this.constructor.call(this, SVG.create('circle'));
  };
  
  // inherit from SVG.Shape
  SVG.Circle.prototype = new SVG.Shape();
  
  // Add circle-specific functions
  SVG.extend(SVG.Circle, {
    
    // custom move function
    move: function(x, y) {
      this.attrs.x = x;
      this.attrs.y = y;
      this.center();
  
      return this;
    },
  
    // custom size function (no height value here!)
    size: function(w) {
      this.attr('r', w / 2);
      this.center();
  
      return this;
    },
  
    // position element by its center
    center: function(x, y) {
      var r = this.attrs.r || 0;
  
      this.attr('cx', x || ((this.attrs.x || 0) + r));
      this.attr('cy', y || ((this.attrs.y || 0) + r));
    }
    
  });

  SVG.Ellipse = function Ellipse() {
    this.constructor.call(this, SVG.create('ellipse'));
  };
  
  // inherit from SVG.Shape
  SVG.Ellipse.prototype = new SVG.Shape();
  
  // Add ellipse-specific functions
  SVG.extend(SVG.Ellipse, {
    
    // custom move function
    move: function(x, y) {
      this.attrs.x = x;
      this.attrs.y = y;
      this.center();
  
      return this;
    },
  
    // custom size function
    size: function(w, h) {
      this.attr('rx', w / 2);
      this.attr('ry', h / 2);
      this.center();
  
      return this; 
    },
    
    // position element by its center
    center: function(x, y) {
      this.attr('cx', x || ((this.attrs.x || 0) + (this.attrs.rx || 0)));
      this.attr('cy', y || ((this.attrs.y || 0) + (this.attrs.ry || 0)));
    }
    
  });


  SVG.Path = function Path() {
    this.constructor.call(this, SVG.create('path'));
  };
  
  // inherit from SVG.Shape
  SVG.Path.prototype = new SVG.Shape();
  
  // Add path-specific functions
  SVG.extend(SVG.Path, {
    
    // set path data
    data: function(d) {
      this.attr('d', d);
      return this;
    }
    
  });

  SVG.Image = function Image() {
    this.constructor.call(this, SVG.create('image'));
  };
  
  // inherit from SVG.Element
  SVG.Image.prototype = new SVG.Element();
  
  // include the container object
  SVG.extend(SVG.Image, SVG.Container);
  
  // Add image-specific functions
  SVG.extend(SVG.Image, {
    
    // (re)load image
    load: function(u) {
      this.attr('href', u, SVG.xlink);
      return this;
    }
    
  });

  SVG.extend(SVG.Shape, {
    
    // set fill color and opacity
    fill: function(f) {
      if (f.color != null)
        this.attr('fill', f.color);
  
      if (f.opacity != null)
        this.attr('fill-opacity', f.opacity);
  
      return this;
    },
  
    // set stroke color and opacity
    stroke: function(s) {
      if (s.color)
        this.attr('stroke', s.color);
      
      var a = ('width opacity linecap linejoin miterlimit dasharray dashoffset').split(' ');
      
      for (var i = a.length - 1; i >= 0; i--)
        if (s[a[i]] != null)
          this.attr('stroke-' + a[i], s[a[i]]);
      
      return this;
    }
    
  });
  
  // Add element-specific functions
  SVG.extend(SVG.Element, {
    
    // rotation
    rotate: function(o) {
      var b = this.bbox();
      
      if (o.x == null) o.x = b.cx;
      if (o.y == null) o.y = b.cy;
  
      return this.transform('rotate(' + (o.deg || 0) + ' ' + o.x + ' ' + o.y + ')', o.relative);
    }
    
  });
  
  // Add group-specific functions
  SVG.extend(SVG.G, {
    
    // move using translate
    move: function(x, y) {
      return this.transform('translate(' + x + ' ' + y + ')');
    }
    
  });
  
  
  
  


}).call(this);
