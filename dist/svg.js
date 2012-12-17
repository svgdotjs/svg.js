/* svg.js 0.1 - svg container object element document defs shape rect circle ellipse path image group clip_path - svgjs.com/license */
(function() {

  var SVG = {
    namespace: "http://www.w3.org/2000/svg",
    xlink:     "http://www.w3.org/1999/xlink",
    
    createElement: function(e) {
      return document.createElementNS(this.namespace, e);
    }
  };
  
  this.SVG = SVG;

  SVG.Container = {
    
    add: function(e) {
      return this.addAt(e);
    },
    
    addAt: function(e, i) {
      if (!this.contains(e)) {
        i = i == null ? this.children().length : i;
        this.children().splice(i, 0, e);
        this.svgElement.insertBefore(e.svgElement, this.svgElement.childNodes[i + 1]);
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
        this.svgElement.removeChild(e.svgElement);
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

  Object.prototype.include = function(module) {
    
    for (var key in module)
      this.prototype[key] = module[key];
    
    if (module.included != null)
      module.included.apply(this);
    
    return this;
  };

  SVG.Element = function Element(svgElement) {
    this.svgElement = svgElement;
    this.attributes = {};
  };
  
  //-D // inherit from SVG.Object
  //-D SVG.Element.prototype = new SVG.Object();
  
  // move element to given x and y values
  SVG.Element.prototype.move = function(x, y) {
    this.setAttribute('x', x);
    this.setAttribute('y', y);
    
    return this;
  };
  
  // set element opacity
  SVG.Element.prototype.opacity = function(o) {
    return this.setAttribute('opacity', Math.max(0, Math.min(1, o)));
  };
  
  // set element size to given width and height
  SVG.Element.prototype.size = function(w, h) {
    this.setAttribute('width', w);
    this.setAttribute('height', h);
    
    return this;
  };
  
  // clip element using another element
  SVG.Element.prototype.clip = function(block) {
    var p = this.parentSVG().defs().clipPath();
    block(p);
    
    return this.clipTo(p);
  };
  
  // distribute clipping path to svg element
  SVG.Element.prototype.clipTo = function(p) {
    return this.setAttribute('clip-path', 'url(#' + p.id + ')');
  };
  
  // remove element
  SVG.Element.prototype.destroy = function() {
    return this.parent != null ? this.parent.remove(this) : void 0;
  };
  
  // get parent document
  SVG.Element.prototype.parentDoc = function() {
    return this._findParent(SVG.Document);
  };
  
  // get parent svg wrapper
  SVG.Element.prototype.parentSVG = function() {
    return this.parentDoc();
  };
  
  // set svg element attribute
  SVG.Element.prototype.setAttribute = function(a, v, ns) {
    this.attributes[a] = v;
    
    if (ns != null)
      this.svgElement.setAttributeNS(ns, a, v);
    else
      this.svgElement.setAttribute(a, v);
    
    return this;
  };
  
  // set svg element attribute
  SVG.Element.prototype.attr = function(v) {
    if (typeof v == 'object')
      for (var k in v)
        this.setAttribute(k, v[k]);
    else if (arguments.length == 2)
      this.setAttribute(arguments[0], arguments[1]);
    
    return this;
  };
  
  // get bounding box
  SVG.Element.prototype.getBBox = function() {
    return this.svgElement.getBBox();
  };
  
  // private: find svg parent
  SVG.Element.prototype._findParent = function(pt) {
    var e = this;
    
    while (e != null && !(e instanceof pt))
      e = e.parent;
    
    return e;
  };
  
  
  
  


  SVG.Document = function Document(c) {
    this.constructor.call(this, SVG.createElement('svg'));
    
    this.setAttribute('xmlns', SVG.namespace);
    this.setAttribute('version', '1.1');
    this.setAttribute('xlink', 'http://www.w3.org/1999/xlink', SVG.namespace);
    
    document.getElementById(c).appendChild(this.svgElement);
  };
  
  // inherit from SVG.Element
  SVG.Document.prototype = new SVG.Element();
  
  // include the container object
  SVG.Document.include(SVG.Container);

  SVG.Defs = function Defs() {
    this.constructor.call(this, SVG.createElement('defs'));
  };
  
  // inherit from SVG.Element
  SVG.Defs.prototype = new SVG.Element();
  
  // define clippath
  SVG.Defs.prototype.clipPath = function() {
    var e = new SVG.ClipPath();
    this.add(e);
    
    return e;
  };
  
  // include the container object
  SVG.Defs.include(SVG.Container);

  SVG.Shape = function Shape(element) {
    this.constructor.call(this, element);
  };
  
  // inherit from SVG.Element
  SVG.Shape.prototype = new SVG.Element();
  
  // set fill color and opacity
  SVG.Shape.prototype.fill = function(fill) {
    if (fill.color != null)
      this.setAttribute('fill', fill.color);
    
    if (fill.opacity != null)
      this.setAttribute('fill-opacity', fill.opacity);
    
    return this;
  };
  
  // set stroke color and opacity
  SVG.Shape.prototype.stroke = function(stroke) {
    if (stroke.color != null)
      this.setAttribute('stroke', stroke.color);
    
    if (stroke.width != null)
      this.setAttribute('stroke-width', stroke.width);
    
    if (stroke.opacity != null)
      this.setAttribute('stroke-opacity', stroke.opacity);
    
    if (this.attributes['fill-opacity'] == null)
      this.fill({ opacity: 0 });
    
    return this;
  };

  SVG.Rect = function Rect() {
    this.constructor.call(this, SVG.createElement('rect'));
  };
  
  // inherit from SVG.Shape
  SVG.Rect.prototype = new SVG.Shape();

  SVG.Circle = function Circle() {
    this.constructor.call(this, SVG.createElement('circle'));
  };
  
  // inherit from SVG.Shape
  SVG.Circle.prototype = new SVG.Shape();
  
  // custom move function
  SVG.Circle.prototype.move = function(x, y) {
    this.attributes.x = x;
    this.attributes.y = y;
    this.center();
    
    return this;
  };
  
  // custom size function
  SVG.Circle.prototype.size = function(w, h) {
    this.setAttribute('r', w / 2);
    this.center();
    
    return this;
  };
  
  // private: center 
  SVG.Circle.prototype.center = function(cx, cy) {
    var r = this.attributes.r || 0;
    
    this.setAttribute('cx', cx || ((this.attributes.x || 0) + r));
    this.setAttribute('cy', cy || ((this.attributes.y || 0) + r));
  };

  SVG.Ellipse = function Ellipse() {
    this.constructor.call(this, SVG.createElement('ellipse'));
  };
  
  // inherit from SVG.Shape
  SVG.Ellipse.prototype = new SVG.Shape();
  
  // custom move function
  SVG.Ellipse.prototype.move = function(x, y) {
    this.attributes.x = x;
    this.attributes.y = y;
    this.center();
    
    return this;
  };
  
  // custom size function
  SVG.Ellipse.prototype.size = function(w, h) {
    this.setAttribute('rx', w / 2);
    this.setAttribute('ry', h / 2);
    this.center();
    
    return this; 
  };
  
  SVG.Ellipse.prototype.center = function(cx, cy) {
    this.setAttribute('cx', cx || ((this.attributes.x || 0) + (this.attributes.rx || 0)));
    this.setAttribute('cy', cy || ((this.attributes.y || 0) + (this.attributes.ry || 0)));
  };

  SVG.Path = function Path() {
    this.constructor.call(this, SVG.createElement('path'));
  };
  
  // inherit from SVG.Shape
  SVG.Path.prototype = new SVG.Shape();
  
  // set path data
  SVG.Path.prototype.data = function(d) {
    this.setAttribute('d', d);
    return this;
  };

  SVG.Image = function Image() {
    this.constructor.call(this, SVG.createElement('image'));
  };
  
  // inherit from SVG.Element
  SVG.Image.prototype = new SVG.Element();
  
  // (re)load image
  SVG.Image.prototype.load = function(url) {
    this.setAttribute('href', url, SVG.xlink);
    return this;
  };
  
  // include the container object
  SVG.Image.include(SVG.Container);

  SVG.Group = function Group() {
    this.constructor.call(this, SVG.createElement("g"));
  };
  
  // inherit from SVG.Element
  SVG.Group.prototype = new SVG.Element();
  
  // group rotation
  SVG.Group.prototype.rotate = function(d) {
    this.setAttribute('transform', 'rotate(' + d + ')');
    return this;
  };
  
  // include the container object
  SVG.Group.include(SVG.Container);

  var clipID = 0;
  
  SVG.ClipPath = function ClipPath() {
    this.constructor.call(this, SVG.createElement('clipPath'));
    this.id = '_' + (clipID++);
    this.setAttribute('id', this.id);
  };
  
  // inherit from SVG.Element
  SVG.ClipPath.prototype = new SVG.Element();
  
  // include the container object
  SVG.ClipPath.include(SVG.Container);

}).call(this);
