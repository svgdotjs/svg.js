/* svg.js v0.1-28-gb0360d1 - svg container element group arrange defs clip gradient doc shape rect circle ellipse path image text sugar - svgjs.com/license */
(function() {

  this.SVG = {
    ns:         'http://www.w3.org/2000/svg',
    xlink:      'http://www.w3.org/1999/xlink',
    
    create: function(e) {
      return document.createElementNS(this.ns, e);
    },
    
    extend: function(o, m) {
      for (var k in m)
        o.prototype[k] = m[k];
    }
    
  };

  SVG.Container = {
    
    add: function(e, i) {
      if (!this.has(e)) {
        i = i == null ? this.children().length : i;
        this.children().splice(i, 0, e);
        this.node.insertBefore(e.node, this.node.childNodes[i] || null);
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
    
    level: function() {
      var d = this.defs();
      
      this.remove(d).add(d, 0);
      
      return this;
    },
    
    group: function() {
      var e = new SVG.G();
      this.add(e);
      
      return e;
    },
    
    rect: function(w, h) {
      var e = new SVG.Rect().size(w, h);
      this.add(e);
      
      return e;
    },
    
    circle: function(r) {
      var e = new SVG.Circle().size(r);
      this.add(e);
      
      return e;
    },
    
    ellipse: function(w, h) {
      var e = new SVG.Ellipse().size(w, h);
      this.add(e);
      
      return e;
    },
    
    path: function(d) {
      var e = new SVG.Path().plot(d);
      this.add(e);
      
      return e;
    },
    
    image: function(s) {
      var e = new SVG.Image().load(s);
      this.add(e);
      
      return e;
    },
    
    text: function(t) {
      var e = new SVG.Text().text(t);
      this.add(e);
      
      return e;
    },
    
    gradient: function(t, b) {
      return this.defs().gradient(t, b);
    },
    
    // hack for safari preventing text to be rendered in one line,
    // basically it sets the position of the svg node to absolute
    // when the dom is loaded, and resets it to relative a few ms later.
    stage: function() {
      var r, e = this;
      
      r = function() {
        if (document.readyState === 'complete') {
          e.attr('style', 'position:absolute;left:0;top:0;');
          setTimeout(function() { e.attr('style', 'position:relative;'); }, 5);
        } else {
          setTimeout(r, 10);
        }
      };
      
      r();
      
      return this;
    }
    
  };

  SVG.Element = function Element(n) {
    this.node = n;
    this.attrs = {};
    this.trans = {
      x:        0,
      y:        0,
      scaleX:   1,
      scaleY:   1,
      rotation: 0,
      skewX:    0,
      skewY:    0
    };
    
    this._s = ('size family weight stretch variant style').split(' ');
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
    
    // set svg element attribute
    attr: function(a, v, n) {
      if (arguments.length < 2) {
        if (typeof a == 'object')
          for (v in a) this.attr(v, a[v]);
          
        else if (this._isStyle(a))
          return a == 'text' ?
                   this.content :
                 a == 'leading' ?
                   this[a] :
                   this.style[a];
        
        else
          return this.attrs[a];
      
      } else {
        this.attrs[a] = v;
        if (a == 'x' && this._isText())
          for (var i = this.lines.length - 1; i >= 0; i--)
            this.lines[i].attr(a, v);
        else
          n != null ?
            this.node.setAttributeNS(n, a, v) :
            this.node.setAttribute(a, v);
        
        if (this._isStyle(a)) {
          a == 'text' ?
            this.text(v) :
          a == 'leading' ?
            this[a] = v :
            this.style[a] = v;
        
          this.text(this.content);
        }
      }
      
      return this;
    },
    
    transform: function(o) {
      // act as a getter if the first argument is a string
      if (typeof o === 'string')
        return this.trans[o];
        
      // ... otherwise continue as a setter
      var k,
          t = [],
          b = this.bbox(),
          s = this.attr('transform') || '',
          l = s.match(/[a-z]+\([^\)]+\)/g) || [];
      
      // merge values
      for (k in o)
        if (o[k] != null)
          this.trans[k] = o[k];
      
      // alias current transformations
      o = this.trans;
      
      // add rotate
      if (o.rotation != 0)
        t.push('rotate(' + o.rotation + ',' + (o.cx != null ? o.cx : b.cx) + ',' + (o.cy != null ? o.cy : b.cy) + ')');
      
      // add scale
      if (o.scaleX != 1 && o.scaleY != 1)
        t.push('scale(' + o.sx + ',' + o.sy + ')');
      
      // add skew on x axis
      if (o.skewX != 0)
        t.push('skewX(' + x.skewX + ')');
      
      // add skew on y axis
      if (o.skewY != 0)
        t.push('skewY(' + x.skewY + ')')
      
      // add translate
      if (o.x != 0 && o.y != 0)
        t.push('translate(' + o.x + ',' + o.y + ')');
      
      // add only te required transformations
      return this.attr('transform', t.join(' '));
    },
    
    // get bounding box
    bbox: function() {
      // actual bounding box
      var b = this.node.getBBox();
      
      // include translations on x an y
      b.x += this.trans.x;
      b.y += this.trans.y;
      
      // add the center
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
    },
    
    // private: is this text style
    _isStyle: function(a) {
      return typeof a == 'string' && this._isText() ? (/^font|text|leading/).test(a) : false;
    },
    
    // private: element type tester
    _isText: function() {
      return this instanceof SVG.Text;
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
      return this.parent.children();
    },
    
    // send given element one step forwards
    forward: function() {
      var i = this.siblings().indexOf(this);
      this.parent.remove(this).add(this, i + 1);
      
      return this;
    },
    
    // send given element one step backwards
    backward: function() {
      var i, p = this.parent.level();
      
      i = this.siblings().indexOf(this);
      
      if (i > 1)
        p.remove(this).add(this, i - 1);
      
      return this;
    },
    
    // send given element all the way to the front
    front: function() {
      this.parent.remove(this).add(this);
      
      return this;
    },
    
    // send given element all the way to the back
    back: function() {
      var i, p = this.parent.level();
      
      i = this.siblings().indexOf(this);
      
      if (i > 1)
        p.remove(this).add(this, 0);
      
      return this;
    }
    
  });

  SVG.Defs = function Defs() {
    this.constructor.call(this, SVG.create('defs'));
  };
  
  // inherit from SVG.Element
  SVG.Defs.prototype = new SVG.Element();
  
  // include the container object
  SVG.extend(SVG.Defs, SVG.Container);

  var clipID = 0;
  
  SVG.Clip = function Clip() {
    this.constructor.call(this, SVG.create('clipPath'));
    this.id = 'svgjs_clip_' + (clipID++);
    this.attr('id', this.id);
  };
  
  // inherit from SVG.Element
  SVG.Clip.prototype = new SVG.Element();
  
  // include the container object
  SVG.extend(SVG.Clip, SVG.Container);
  
  // add clipping functionality to element
  SVG.extend(SVG.Element, {
    
    // clip element using another element
    clip: function(b) {
      var p = this.parent.defs().clip();
      b(p);
  
      return this.clipTo(p);
    },
  
    // distribute clipping path to svg element
    clipTo: function(p) {
      return this.attr('clip-path', 'url(#' + p.id + ')');
    }
    
  });
  
  // add def-specific functions
  SVG.extend(SVG.Defs, {
    
    // define clippath
    clip: function() {
      var e = new SVG.Clip();
      this.add(e);
  
      return e;
    }
    
  });

  var gradID = 0;
  
  SVG.Gradient = function Gradient(t) {
    this.constructor.call(this, SVG.create(t + 'Gradient'));
    this.id = 'svgjs_grad_' + (gradID++);
    this.type = t;
    
    this.attr('id', this.id);
  };
  
  // inherit from SVG.Element
  SVG.Gradient.prototype = new SVG.Element();
  
  // include the container object
  SVG.extend(SVG.Gradient, SVG.Container);
  
  // add gradient-specific functions
  SVG.extend(SVG.Gradient, {
    
    // from position
    from: function(x, y) {
      return this.type == 'radial' ?
               this.attr({ fx: x + '%', fy: y + '%' }) :
               this.attr({ x1: x + '%', y1: y + '%' });
    },
    
    // to position
    to: function(x, y) {
      return this.type == 'radial' ?
               this.attr({ cx: x + '%', cy: y + '%' }) :
               this.attr({ x2: x + '%', y2: y + '%' });
    },
    
    // radius for radial gradient
    radius: function(r) {
      return this.type == 'radial' ?
               this.attr({ r: r + '%' }) :
               this;
    },
    
    // add color stops
    at: function(o) {
      var m = new SVG.Stop(o);
      this.add(m);
      
      return m;
    },
    
    // update gradient
    update: function(b) {
      while (this.node.hasChildNodes())
        this.node.removeChild(this.node.lastChild);
      
      b(this);
        
      return this;
    },
    
    // return the fill id
    fill: function() {
      return 'url(#' + this.id + ')';
    }
    
  });
  
  // add def-specific functions
  SVG.extend(SVG.Defs, {
    
    // define clippath
    gradient: function(t, b) {
      var e = new SVG.Gradient(t);
      this.add(e);
      b(e);
      
      return e;
    }
    
  });
  
  
  SVG.Stop = function Stop(o) {
    this.constructor.call(this, SVG.create('stop'));
    
    this.update(o);
  };
  
  // inherit from SVG.Element
  SVG.Stop.prototype = new SVG.Element();
  
  // add mark-specific functions
  SVG.extend(SVG.Stop, {
    
    // add color stops
    update: function(o) {
      var s = '',
          a = ['opacity', 'color'];
  
      for (var i = a.length - 1; i >= 0; i--)
        if (o[a[i]] != null)
          s += 'stop-' + a[i] + ':' + o[a[i]] + ';';
  
      return this.attr({
        offset: (o.offset != null ? o.offset : this.attr('offset') || 0) + '%',
        style:  s
      });
    }
    
  });
  


  SVG.Doc = function Doc(e) {
    this.constructor.call(this, SVG.create('svg'));
    
    // create extra wrapper
    var w = document.createElement('div');
    w.style.cssText = 'position:relative;width:100%;height:100%;';
    
    // ensure the presence of a html element
    if (typeof e == 'string')
      e = document.getElementById(e);
    
    // set svg element attributes
    this.
      attr({ xmlns: SVG.ns, version: '1.1', width: '100%', height: '100%' }).
      attr('xlink', SVG.xlink, SVG.ns).
      defs();
    
    e.appendChild(w);
    w.appendChild(this.node);
    
    // ensure 
    this.stage();
  };
  
  // inherit from SVG.Element
  SVG.Doc.prototype = new SVG.Element();
  
  // include the container object
  SVG.extend(SVG.Doc, SVG.Container);
  
  


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
      
      return this.center();
    },
  
    // custom size function (no height value here!)
    size: function(w) {
      return this.attr('r', w / 2).center();
    },
  
    // position element by its center
    center: function(x, y) {
      var r = this.attrs.r || 0;
  
      return this.attr({
        cx: (x || ((this.attrs.x || 0) + r)),
        cy: (y || ((this.attrs.y || 0) + r))
      });
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
      
      return this.center();
    },
  
    // custom size function
    size: function(w, h) {
      return this.
        attr({ rx: w / 2, ry: h / 2 }).
        center();
    },
    
    // position element by its center
    center: function(x, y) {
      return this.attr({
        cx: (x || ((this.attrs.x || 0) + (this.attrs.rx || 0))),
        cy: (y || ((this.attrs.y || 0) + (this.attrs.ry || 0)))
      });
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
    plot: function(d) {
      return this.attr('d', d || 'M0,0L0,0');
    },
    
    // move path using translate
    move: function(x, y) {
      return this.transform({ x: x, y: y });
    }
    
  });

  SVG.Image = function Image() {
    this.constructor.call(this, SVG.create('image'));
  };
  
  // inherit from SVG.Element
  SVG.Image.prototype = new SVG.Shape();
  
  // add image-specific functions
  SVG.extend(SVG.Image, {
    
    // (re)load image
    load: function(u) {
      return this.attr('xlink:href', u, SVG.xlink);
    }
    
  });

  SVG.Text = function Text() {
    this.constructor.call(this, SVG.create('text'));
    
    this.style = { 'font-size':  16, 'font-family': 'Helvetica', 'text-anchor': 'start' };
    this.leading = 1.2;
    this.lines = [];
  };
  
  // inherit from SVG.Element
  SVG.Text.prototype = new SVG.Shape();
  
  // Add image-specific functions
  SVG.extend(SVG.Text, {
    
    text: function(t) {
      this.content = t = t || 'text';
      this.lines = [];
      
      var i, n,
          s = this._style(),
          p = this.parentDoc(),
          a = t.split("\n");
      
      while (this.node.hasChildNodes())
        this.node.removeChild(this.node.lastChild);
      
      for (i = 0, l = a.length; i < l; i++) {
        n = new TSpan().
          text(a[i]).
          attr({
            dy:     this.style['font-size'] * this.leading,
            x:      (this.attr('x') || 0),
            style:  s
          });
        
        this.node.appendChild(n.node);
        this.lines.push(n);
      };
      
      return this.attr('style', s);
    },
    
    _style: function() {
      var i, o = '', s = this._s;
      
      for (i = s.length - 1; i >= 0; i--)
        if (this.style['font-' + s[i]] != null)
          o += 'font-' + s[i] + ':' + this.style['font-' + s[i]] + ';';
      
      o += 'text-anchor:' + this.style['text-anchor'] + ';';
        
      return o;
    }
    
  });
  
  
  function TSpan() {
    this.constructor.call(this, SVG.create('tspan'));
  };
  
  // inherit from SVG.Element
  TSpan.prototype = new SVG.Shape();
  
  // include the container object
  SVG.extend(TSpan, {
    
    text: function(t) {
      this.node.appendChild(document.createTextNode(t));
      
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
    rotate: function(d, x, y) {
      var b = this.bbox();
      
      return this.transform({
        rotation: d || 0,
        cx:       x == null ? b.cx : x,
        cy:       y == null ? b.cx : y
      });
    }
    
  });
  
  // Add group-specific functions
  SVG.extend(SVG.G, {
    
    // move using translate
    move: function(x, y) {
      return this.transform({ x: x, y: y });
    }
    
  });
  
  // Add text-specific functions
  SVG.extend(SVG.Text, {
    
    // set font 
    font: function(o) {
      var k, a = {};
      
      for (k in o)
        k == 'leading' ?
          a[k] = o[k] :
        k == 'anchor' ?
          a['text-anchor'] = o[k] :
        this._s.indexOf(k) > -1 ?
          a['font-'+ k] = o[k] :
          void 0;
      
      return this.attr(a).text(this.content);
    }
    
  });
  
  
  


}).call(this);
function svg(e) { return new SVG.Doc(e); };
