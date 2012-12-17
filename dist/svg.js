/* svg.js 0.1 - svg utils container element document defs shape rect circle ellipse path image group clip_path - svgjs.com/license */
(function() {

  this.SVG = {
    ns:     'http://www.w3.org/2000/svg',
    xlink:  'http://www.w3.org/1999/xlink',
    
    create: function(e) {
      return document.createElementNS(this.ns, e);
    }
  };
  
  this.svg = function(e) {
    return new SVG.Document(e);
  };

  SVG.Utils = {
    
    merge: function(o, m) {
      for (var k in m)
        o.prototype[k] = m[k];
    }
    
  };

  SVG.Container = {
    
    add: function(e) {
      return this.addAt(e);
    },
    
    addAt: function(e, i) {
      if (!this.contains(e)) {
        i = i == null ? this.children().length : i;
        this.children().splice(i, 0, e);
        this.node.insertBefore(e.node, this.node.childNodes[i + 1]);
        e.parent = this;
      }
      
      return this;
    },
    
    contains: function(e) {
      return Array.prototype.indexOf.call(this.children(), e) >= 0;
    },
    
    children: function() {
      return this._children || [];
    },
    
    sendBack: function(e) {
      var i = this.children().indexOf(e);
      if (i !== -1)
        return this.remove(e).addAt(e, i - 1);
    },
    
    bringForward: function(e) {
      var i = this.children().indexOf(e);
      if (i !== -1)
        return this.remove(e).addAt(e, i + 1);
    },
    
    bringToFront: function(e) {
      if (this.contains(e))
        this.remove(e).add(e);
      
      return this;
    },
    
    sendToBottom: function(e) {
      if (this.contains(e))
        this.remove(e).addAt(e, 0);
      
      return this;
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
        this.add(this._defs);
      }
      
      return this._defs;
    },
    
    group: function() {
      var e = new SVG.Group();
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

  SVG.Element = function Element(node) {
    this.node = node;
    this.attrs = {};
  };
  
  // Add element-specific functions
  SVG.Utils.merge(SVG.Element, {
    
    // move element to given x and y values
    move: function(x, y) {
      this.attr('x', x);
      this.attr('y', y);
  
      return this;
    },
  
    // set element opacity
    opacity: function(o) {
      return this.attr('opacity', Math.max(0, Math.min(1, o)));
    },
  
    // set element size to given width and height
    size: function(w, h) {
      this.attr('width', w);
      this.attr('height', h);
  
      return this;
    },
  
    // clip element using another element
    clip: function(block) {
      var p = this.parentSVG().defs().clipPath();
      block(p);
  
      return this.clipTo(p);
    },
  
    // distribute clipping path to svg element
    clipTo: function(p) {
      return this.attr('clip-path', 'url(#' + p.id + ')');
    },
  
    // remove element
    destroy: function() {
      return this.parent != null ? this.parent.remove(this) : void 0;
    },
  
    // get parent document
    parentDoc: function() {
      return this._parent(SVG.Document);
    },
  
    // get parent svg wrapper
    parentSVG: function() {
      return this.parentDoc();
    },
  
    //_D // set svg element attribute
    //_D setAttribute: function(a, v, ns) {
    //_D   this.attrs[a] = v;
    //_D 
    //_D   if (ns != null)
    //_D     this.node.setAttributeNS(ns, a, v);
    //_D   else
    //_D     this.node.setAttribute(a, v);
    //_D 
    //_D   return this;
    //_D },
  
    // set svg element attribute
    attr: function(v) {
      var a = arguments;
      
      this.attrs[a[0]] = a[1];
      
      if (typeof v == 'object')
        for (var k in v)
          this.attr(k, v[k]);
          
      else if (a.length == 2)
        this.node.setAttribute(a[0], a[1]);
        
      else if (a.length == 3)
        this.node.setAttributeNS(a[2], a[0], a[1]);
  
      return this;
    },
  
    // get bounding box
    bbox: function() {
      return this.node.getBBox();
    },
  
    // private: find svg parent
    _parent: function(pt) {
      var e = this;
  
      while (e != null && !(e instanceof pt))
        e = e.parent;
  
      return e;
    }
    
  });


  SVG.Document = function Document(e) {
    this.constructor.call(this, SVG.create('svg'));
    
    this.attr('xmlns', SVG.ns);
    this.attr('version', '1.1');
    this.attr('xlink', SVG.xlink, SVG.ns);
    
    if (typeof e == 'string')
      e = document.getElementById(e);
    
    e.appendChild(this.node);
  };
  
  // inherit from SVG.Element
  SVG.Document.prototype = new SVG.Element();
  
  // include the container object
  SVG.Utils.merge(SVG.Document, SVG.Container);

  SVG.Defs = function Defs() {
    this.constructor.call(this, SVG.create('defs'));
  };
  
  // inherit from SVG.Element
  SVG.Defs.prototype = new SVG.Element();
  
  // include the container object
  SVG.Utils.merge(SVG.Defs, SVG.Container);
  
  // Add def-specific functions
  SVG.Utils.merge(SVG.Defs, {
    
    // define clippath
    clipPath: function() {
      var e = new SVG.ClipPath();
      this.add(e);
  
      return e;
    }
    
  });

  SVG.Shape = function Shape(element) {
    this.constructor.call(this, element);
  };
  
  // inherit from SVG.Element
  SVG.Shape.prototype = new SVG.Element();
  
  // Add shape-specific functions
  SVG.Utils.merge(SVG.Shape, {
    
    // set fill color and opacity
    fill: function(fill) {
      if (fill.color != null)
        this.attr('fill', fill.color);
  
      if (fill.opacity != null)
        this.attr('fill-opacity', fill.opacity);
  
      return this;
    },
  
    // set stroke color and opacity
    stroke: function(stroke) {
      if (stroke.color != null)
        this.attr('stroke', stroke.color);
  
      if (stroke.width != null)
        this.attr('stroke-width', stroke.width);
  
      if (stroke.opacity != null)
        this.attr('stroke-opacity', stroke.opacity);
  
      if (this.attrs['fill-opacity'] == null)
        this.fill({ opacity: 0 });
  
      return this;
    }
    
  });

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
  SVG.Utils.merge(SVG.Circle, {
    
    // custom move function
    move: function(x, y) {
      this.attrs.x = x;
      this.attrs.y = y;
      this.center();
  
      return this;
    },
  
    // custom size function
    size: function(w, h) {
      this.attr('r', w / 2);
      this.center();
  
      return this;
    },
  
    // private: center 
    center: function(cx, cy) {
      var r = this.attrs.r || 0;
  
      this.attr('cx', cx || ((this.attrs.x || 0) + r));
      this.attr('cy', cy || ((this.attrs.y || 0) + r));
    }
    
  });

  SVG.Ellipse = function Ellipse() {
    this.constructor.call(this, SVG.create('ellipse'));
  };
  
  // inherit from SVG.Shape
  SVG.Ellipse.prototype = new SVG.Shape();
  
  // Add ellipse-specific functions
  SVG.Utils.merge(SVG.Ellipse, {
    
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
  
    center: function(cx, cy) {
      this.attr('cx', cx || ((this.attrs.x || 0) + (this.attrs.rx || 0)));
      this.attr('cy', cy || ((this.attrs.y || 0) + (this.attrs.ry || 0)));
    }
    
  });


  SVG.Path = function Path() {
    this.constructor.call(this, SVG.create('path'));
  };
  
  // inherit from SVG.Shape
  SVG.Path.prototype = new SVG.Shape();
  
  // Add path-specific functions
  SVG.Utils.merge(SVG.Path, {
    
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
  SVG.Utils.merge(SVG.Image, SVG.Container);
  
  // Add image-specific functions
  SVG.Utils.merge(SVG.Image, {
    
    // (re)load image
    load: function(u) {
      this.attr('href', u, SVG.xlink);
      return this;
    }
    
  });

  SVG.Group = function Group() {
    this.constructor.call(this, SVG.create('g'));
  };
  
  // inherit from SVG.Element
  SVG.Group.prototype = new SVG.Element();
  
  // include the container object
  SVG.Utils.merge(SVG.Group, SVG.Container);
  
  // Add group-specific functions
  SVG.Utils.merge(SVG.Group, {
    
    // group rotation
    rotate: function(d) {
      this.attr('transform', 'rotate(' + d + ')');
      return this;
    }
    
  });

  var clipID = 0;
  
  SVG.ClipPath = function ClipPath() {
    this.constructor.call(this, SVG.create('clipPath'));
    this.id = '_' + (clipID++);
    this.attr('id', this.id);
  };
  
  // inherit from SVG.Element
  SVG.ClipPath.prototype = new SVG.Element();
  
  // include the container object
  SVG.Utils.merge(SVG.ClipPath, SVG.Container);

}).call(this);
