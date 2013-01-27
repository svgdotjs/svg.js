/* svg.js v0.1-90-gb9981fd - svg container element fx event group arrange defs mask pattern gradient doc shape wrap rect ellipse poly path image text nested sugar - svgjs.com/license */
(function() {

  this.svg = function(element) {
    return new SVG.Doc(element);
  };
  
  // The main wrapping element
  this.SVG = {
    // Default namespaces
    ns:    'http://www.w3.org/2000/svg',
    xlink: 'http://www.w3.org/1999/xlink',
    // Defs id sequence
    did: 0,
    // Method for element creation
    create: function(element) {
      return document.createElementNS(this.ns, element);
    },
    // Method for extending objects
    extend: function(object, module) {
      for (var key in module)
        object.prototype[key] = module[key];
    }
    
  };

  SVG.Container = {
    // Add given element at a position
    add: function(element, index) {
      if (!this.has(element)) {
        index = index == null ? this.children().length : index;
        this.children().splice(index, 0, element);
        this.node.insertBefore(element.node, this.node.childNodes[index] || null);
        element.parent = this;
      }
      
      return this;
    },
    // Basically does the same as `add()` but returns the added element
    put: function(element, index) {
      this.add(element, index);
      return element;
    },
    // Checks if the given element is a child
    has: function(element) {
      return this.children().indexOf(element) >= 0;
    },
    // Returns all child elements
    children: function() {
      return this._children || (this._children = []);
    },
    // Iterates over all children and invokes a given block
    each: function(block) {
      var index,
          children = this.children();
      
      for (index = 0, length = children.length; index < length; index++)
        if (children[index] instanceof SVG.Shape)
          block.apply(children[index], [index, children]);
      
      return this;
    },
    // Remove a given child element
    remove: function(element) {
      return this.removeAt(this.children().indexOf(element));
    },
    // Remove a child element at a given position
    removeAt: function(index) {
      if (0 <= index && index < this.children().length) {
        var element = this.children()[index];
        this.children().splice(index, 1);
        this.node.removeChild(element.node);
        element.parent = null;
      }
      
      return this;
    },
    // Returns defs element
    defs: function() {
      return this._defs || (this._defs = this.put(new SVG.Defs(), 0));
    },
    // Re-level defs to first positon in element stack
    level: function() {
      return this.remove(this.defs()).put(this.defs(), 0);
    },
    // Create a group element
    group: function() {
      return this.put(new SVG.G());
    },
    // Create a rect element
    rect: function(width, height) {
      return this.put(new SVG.Rect().size(width, height));
    },
    // Create circle element, based on ellipse
    circle: function(diameter) {
      return this.ellipse(diameter);
    },
    // Create an ellipse
    ellipse: function(width, height) {
      return this.put(new SVG.Ellipse().size(width, height));
    },
    // Create a wrapped polyline element
    polyline: function(points) {
      return this.put(new SVG.Wrap(new SVG.Polyline())).plot(points);
    },
    // Create a wrapped polygon element
    polygon: function(points) {
      return this.put(new SVG.Wrap(new SVG.Polygon())).plot(points);
    },
    // Create a wrapped path element
    path: function(data) {
      return this.put(new SVG.Wrap(new SVG.Path())).plot(data);
    },
    // Create image element, load image and set its size
    image: function(source, width, height) {
      width = width != null ? width : 100;
      return this.put(new SVG.Image().load(source).size(width, height != null ? height : width));
    },
    // Create text element
    text: function(text) {
      return this.put(new SVG.Text().text(text));
    },
    // Create nested svg document
    nested: function() {
      return this.put(new SVG.Nested());
    },
    // Create gradient element in defs
    gradient: function(type, block) {
      return this.defs().gradient(type, block);
    },
    // Create pattern element in defs
    pattern: function(width, height, block) {
      return this.defs().pattern(width, height, block);
    },
    // Create masking element
    mask: function() {
      return this.defs().put(new SVG.Mask());
    },
    // Get first child, skipping the defs node
    first: function() {
      return this.children()[0] instanceof SVG.Defs ? this.children()[1] : this.children()[0];
    },
    // Get the last child
    last: function() {
      return this.children()[this.children().length - 1];
    },
    // Remove all elements in this container
    clear: function() {
      this._children = [];
      
      while (this.node.hasChildNodes())
        this.node.removeChild(this.node.lastChild);
      
      return this;
    }
    
  };

  SVG.Element = function Element(node) {
    /* keep reference to the element node */
    if (this.node = node)
      this.type = node.nodeName;
    
    /* initialize attribute store with defaults */
    this.attrs = {
      'fill-opacity':   1,
      'stroke-opacity': 1,
      'stroke-width':   0,
      x:        0,
      y:        0,
      cx:       0,
      cy:       0,
      width:    0,
      height:   0,
      r:        0,
      rx:       0,
      ry:       0
    };
    
    /* initialize transformation store with defaults */
    this.trans = {
      x:        0,
      y:        0,
      scaleX:   1,
      scaleY:   1,
      rotation: 0,
      skewX:    0,
      skewY:    0
    };
  
  };
  
  //
  SVG.extend(SVG.Element, {
    // Move element to given x and y values
    move: function(x, y) {
      return this.attr({
        x: x,
        y: y
      });
    },
    // Move element by its center
    center: function(x, y) {
      var box = this.bbox();
      
      return this.move(x - box.width / 2, y - box.height / 2);
    },
    // Set element size to given width and height
    size: function(width, height) { 
      return this.attr({
        width:  width,
        height: height
      });
    },
    // Clone element
    clone: function() {
      var clone;
      
      /* if this is a wrapped shape */
      if (this instanceof SVG.Wrap) {
        /* build new wrapped shape */
        clone = this.parent[this.child.node.nodeName]();
        clone.attrs = this.attrs;
        
        /* copy child attributes and transformations */
        clone.child.trans = this.child.trans;
        clone.child.attr(this.child.attrs).transform({});
        
        /* re-plot shape */
        if (clone.plot)
          clone.plot(this.child.attrs[this.child instanceof SVG.Path ? 'd' : 'points']);
        
      } else {
        var name = this.node.nodeName;
        
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
          this.parent[name]();
        
        clone.attr(this.attrs);
      }
      
      /* copy transformations */
      clone.trans = this.trans;
      
      /* apply attributes and translations */
      return clone.transform({});
    },
    // Remove element
    remove: function() {
      return this.parent != null ? this.parent.remove(this) : void 0;
    },
    // Get parent document
    doc: function() {
      return this._parent(SVG.Doc);
    },
    // Get parent nested document
    nested: function() {
      return this._parent(SVG.Nested);
    },
    // Set svg element attribute
    attr: function(a, v, n) {
      if (arguments.length < 2) {
        /* apply every attribute individually if an object is passed */
        if (typeof a == 'object')
          for (v in a) this.attr(v, a[v]);
        
        /* act as a getter for style attributes */
        else if (this._isStyle(a))
          return a == 'text' ?
                   this.content :
                 a == 'leading' ?
                   this[a] :
                   this.style[a];
        
        /* act as a getter if the first and only argument is not an object */
        else
          return this.attrs[a];
      
      } else {
        /* store value */
        this.attrs[a] = v;
        
        /* treat x differently on text elements */
        if (a == 'x' && this._isText())
          for (var i = this.lines.length - 1; i >= 0; i--)
            this.lines[i].attr(a, v);
        
        /* set the actual attribute */
        else
          n != null ?
            this.node.setAttributeNS(n, a, v) :
            this.node.setAttribute(a, v);
        
        /* if the passed argument belongs to the style as well, add it there */
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
    // Manage transformations
    transform: function(o) {
      /* act as a getter if the first argument is a string */
      if (typeof o === 'string')
        return this.trans[o];
        
      /* ... otherwise continue as a setter */
      var key, transform = [];
      
      /* merge values */
      for (key in o)
        if (o[key] != null)
          this.trans[key] = o[key];
      
      /* alias current transformations */
      o = this.trans;
      
      /* add rotation */
      if (o.rotation != 0) {
        var box = this.bbox();
        transform.push('rotate(' + o.rotation + ',' + (o.cx != null ? o.cx : box.cx) + ',' + (o.cy != null ? o.cy : box.cy) + ')');
      }
      
      /* add scale */
      transform.push('scale(' + o.scaleX + ',' + o.scaleY + ')');
      
      /* add skew on x axis */
      if (o.skewX != 0)
        transform.push('skewX(' + o.skewX + ')');
      
      /* add skew on y axis */
      if (o.skewY != 0)
        transform.push('skewY(' + o.skewY + ')')
      
      /* add translation */
      transform.push('translate(' + o.x + ',' + o.y + ')');
      
      /* add only te required transformations */
      return this.attr('transform', transform.join(' '));
    },
    // Store data values on svg nodes
    data: function(a, v) {
      if (arguments.length < 2) {
        try {
          return JSON.parse(this.attr('data-' + a));
        } catch(e) {
          return this.attr('data-' + a);
        };
        
      } else {
        v === null ?
          this.node.removeAttribute('data-' + a) :
          this.attr('data-' + a, JSON.stringify(v));
      }
      
      return this;
    },
    // Get bounding box
    bbox: function() {
      /* actual, native bounding box */
      var box = this.node.getBBox();
      
      return {
        /* include translations on x an y */
        x:      box.x + this.trans.x,
        y:      box.y + this.trans.y,
        
        /* add the center */
        cx:     box.x + this.trans.x + box.width  / 2,
        cy:     box.y + this.trans.y + box.height / 2,
        
        /* plain width and height */
        width:  box.width,
        height: box.height
      };
    },
    // Checks whether the given point inside the bounding box of the element
    inside: function(x, y) {
      var box = this.bbox();
      
      return x > box.x &&
             y > box.y &&
             x < box.x + box.width &&
             y < box.y + box.height;
    },
    // Show element
    show: function() {
      this.node.style.display = '';
      
      return this;
    },
    // Hide element
    hide: function() {
      this.node.style.display = 'none';
      
      return this;
    },
    // Private: find svg parent by instance
    _parent: function(parent) {
      var element = this;
      
      while (element != null && !(element instanceof parent))
        element = element.parent;
  
      return element;
    },
    // Private: tester method for style detection
    _isStyle: function(attr) {
      return typeof attr == 'string' && this._isText() ? (/^font|text|leading/).test(attr) : false;
    },
    // Private: element type tester
    _isText: function() {
      return this instanceof SVG.Text;
    }
    
  });


  SVG.FX = function FX(element) {
    /* store target element */
    this.target = element;
  };
  
  //
  SVG.extend(SVG.FX, {
    // Add animation parameters and start animation
    animate: function(duration, ease) {
      /* ensure default duration and easing */
      duration = duration == null ? 1000 : duration;
      ease = ease || '<>';
      
      var akeys, tkeys, tvalues,
          element   = this.target,
          fx        = this,
          start     = (new Date).getTime(),
          finish    = start + duration;
      
      /* start animation */
      this.interval = setInterval(function(){
        // This code was borrowed from the emile.js micro framework by Thomas Fuchs, aka MadRobby.
        var index,
            time = (new Date).getTime(),
            pos = time > finish ? 1 : (time - start) / duration;
        
        /* collect attribute keys */
        if (akeys == null) {
          akeys = [];
          for (var key in fx.attrs)
            akeys.push(key);
        };
        
        /* collect transformation keys */
        if (tkeys == null) {
          tkeys = [];
          for (var key in fx.trans)
            tkeys.push(key);
          
          tvalues = {};
        };
        
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
          pos;
        
        /* run all position properties */
        if (fx._move)
          element.move(fx._at(fx._move.x, pos), fx._at(fx._move.y, pos));
        else if (fx._center)
          element.move(fx._at(fx._center.x, pos), fx._at(fx._center.y, pos));
        
        /* run all size properties */
        if (fx._size)
          element.size(fx._at(fx._size.width, pos), fx._at(fx._size.height, pos));
        
        /* animate attributes */
        for (index = akeys.length - 1; index >= 0; index--)
          element.attr(akeys[index], fx._at(fx.attrs[akeys[index]], pos));
        
        /* animate transformations */
        if (tkeys.length > 0) {
          for (index = tkeys.length - 1; index >= 0; index--)
            tvalues[tkeys[index]] = fx._at(fx.trans[tkeys[index]], pos);
          
          element.transform(tvalues);
        }
        
        /* finish off animation */
        if (time > finish) {
          clearInterval(fx.interval);
          fx._after ? fx._after.apply(element, [fx]) : fx.stop();
        }
          
      }, duration > 10 ? 10 : duration);
      
      return this;
    },
    // Add animatable attributes
    attr: function(a, v, n) {
      if (typeof a == 'object')
        for (var key in a)
          this.attr(key, a[key]);
      
      else
        this.attrs[a] = { from: this.target.attr(a), to: v };
      
      return this;  
    },
    // Add animatable transformations
    transform: function(o) {
      for (var key in o)
        this.trans[key] = { from: this.target.trans[key], to: o[key] };
      
      return this;
    },
    // Add animatable move
    move: function(x, y) {
      var box = this.target.bbox();
      
      this._move = {
        x: { from: box.x, to: x },
        y: { from: box.y, to: y }
      };
      
      return this;
    },
    // Add animatable size
    size: function(width, height) {
      var box = this.target.bbox();
      
      this._size = {
        width:  { from: box.width,  to: width  },
        height: { from: box.height, to: height }
      };
      
      return this;
    },
    // Add animatable center
    center: function(x, y) {
      var box = this.target.bbox();
      
      this._move = {
        x: { from: box.cx, to: x },
        y: { from: box.cy, to: y }
      };
      
      return this;
    },
    // Callback after animation
    after: function(after) {
      this._after = after;
      
      return this;
    },
    // Stop running animation
    stop: function() {
      /* stop current animation */
      clearInterval(this.interval);
      
      /* reset storage for properties that need animation */
      this.attrs  = {};
      this.trans  = {};
      this._move  = null;
      this._size  = null;
      this._after = null;
      
      return this;
    },
    // Private: at position according to from and to
    _at: function(o, pos) {
      /* if a number, recalculate pos */
      return typeof o.from == 'number' ?
        o.from + (o.to - o.from) * pos :
      
      /* if animating to a color */
      o.to.r || /^#/.test(o.to) ?
        this._color(o, pos) :
      
      /* for all other values wait until pos has reached 1 to return the final value */
      pos < 1 ? o.from : o.to;
    },
    // Private: tween color
    _color: function(o, pos) {
      var from, to;
      
      /* convert FROM hex to rgb */
      from = this._h2r(o.from || '#000');
      
      /* convert TO hex to rgb */
      to = this._h2r(o.to);
      
      /* tween color and return hex */
      return this._r2h({
        r: ~~(from.r + (to.r - from.r) * pos),
        g: ~~(from.g + (to.g - from.g) * pos),
        b: ~~(from.b + (to.b - from.b) * pos)
      });
    },
    // Private: convert hex to rgb object
    _h2r: function(hex) {
      /* parse full hex */
      var match = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(this._fh(hex));
      
      /* if the hex is successfully parsed, return it in rgb, otherwise return black */
      return match ? {
        r: parseInt(match[1], 16),
        g: parseInt(match[2], 16),
        b: parseInt(match[3], 16)
      } : { r: 0, g: 0, b: 0 };
    },
    // Private: convert rgb object to hex string
    _r2h: function(rgb) {
      return '#' + this._c2h(rgb.r) + this._c2h(rgb.g) + this._c2h(rgb.b);
    },
    // Private: convert component to hex
    _c2h: function(c) {
      var hex = c.toString(16);
      return hex.length == 1 ? '0' + hex : hex;
    },
    // Private: force potential 3-based hex to 6-based 
    _fh: function(hex) {
      return hex.length == 4 ?
        [ '#',
          hex.substring(1, 2), hex.substring(1, 2),
          hex.substring(2, 3), hex.substring(2, 3),
          hex.substring(3, 4), hex.substring(3, 4)
        ].join('') : hex;
    }
    
  });
  //
  SVG.extend(SVG.Element, {
    // Get fx module or create a new one, then animate with given duration and ease
    animate: function(duration, ease) {
      return (this._fx || (this._fx = new SVG.FX(this))).stop().animate(duration, ease);
    },
    // Stop current animation; this is an alias to the fx instance
    stop: function() {
      this._fx.stop();
      
      return this;
    }
    
  });
  // Usage:
  
  //     rect.animate(1500, '>').move(200, 300).after(function() {
  //       this.fill({ color: '#f06' });
  //     });


  [ 'click',
    'dblclick',
    'mousedown',
    'mouseup',
    'mouseover',
    'mouseout',
    'mousemove',
    'touchstart',
    'touchend',
    'touchmove',
    'touchcancel' ].forEach(function(event) {
    
    /* add event to SVG.Element */
    SVG.Element.prototype[event] = function(f) {
      var self = this;
  
      /* bind event to element rather than element node */
      this.node['on' + event] = function() {
        return f.apply(self, arguments);
      };
      
      return this;
    };
    
  });
  
  // Add event binder in the SVG namespace
  SVG.on = function(node, event, listener) {
    if (node.addEventListener)
      node.addEventListener(event, listener, false);
    else
      node.attachEvent('on' + event, listener);
  };
  
  // Add event unbinder in the SVG namespace
  SVG.off = function(node, event, listener) {
    if (node.removeEventListener)
      node.removeEventListener(event, listener, false);
    else
      node.detachEvent('on' + event, listener);
  };
  
  //
  SVG.extend(SVG.Element, {
    // Bind given event to listener
    on: function(event, listener) {
      SVG.on(this.node, event, listener);
      
      return this;
    },
    // Unbind event from listener
    off: function(event, listener) {
      SVG.off(this.node, event, listener);
      
      return this;
    }
  });

  SVG.G = function G() {
    this.constructor.call(this, SVG.create('g'));
  };
  
  // Inherit from SVG.Element
  SVG.G.prototype = new SVG.Element();
  
  // Include the container object
  SVG.extend(SVG.G, SVG.Container);
  
  SVG.extend(SVG.G, {
    
    defs: function() {
      return this.doc().defs();
    }
    
  });

  SVG.extend(SVG.Element, {
    // Get all siblings, including myself
    siblings: function() {
      return (this.nested() || this.doc()).children();
    },
    // Get the curent position siblings
    position: function() {
      return this.siblings().indexOf(this);
    },
    // Get the next element (will return null if there is none)
    next: function() {
      return this.siblings()[this.position() + 1];
    },
    // Get the next element (will return null if there is none)
    previous: function() {
      return this.siblings()[this.position() - 1];
    },
    // Send given element one step forward
    forward: function() {
      return this.parent.remove(this).put(this, this.position() + 1);
    },
    // Send given element one step backward
    backward: function() {
      var i, parent = this.parent.level();
      
      i = this.position();
      
      if (i > 1)
        parent.remove(this).add(this, i - 1);
      
      return this;
    },
    // Send given element all the way to the front
    front: function() {
      return this.parent.remove(this).put(this);
    },
    // Send given element all the way to the back
    back: function() {
      var parent = this.parent.level();
      
      if (this.position() > 1)
        parent.remove(this).add(this, 0);
      
      return this;
    }
    
  });

  SVG.Defs = function Defs() {
    this.constructor.call(this, SVG.create('defs'));
  };
  
  // Inherits from SVG.Element
  SVG.Defs.prototype = new SVG.Element();
  
  // Include the container object
  SVG.extend(SVG.Defs, SVG.Container);

  SVG.Mask = function Mask() {
    this.constructor.call(this, SVG.create('mask'));
    
    /* set unique id */
    this.attr('id', (this.id = 'svgjs_element_' + (SVG.did++)));
  };
  
  // Inherit from SVG.Element
  SVG.Mask.prototype = new SVG.Element();
  
  // Include the container object
  SVG.extend(SVG.Mask, SVG.Container);
  
  SVG.extend(SVG.Element, {
    
    // Distribute mask to svg element
    maskWith: function(element) {
      return this.attr('mask', 'url(#' + (element instanceof SVG.Mask ? element : this.parent.mask().add(element)).id + ')');
    }
    
  });

  SVG.Pattern = function Pattern(type) {
    this.constructor.call(this, SVG.create('pattern'));
    
    /* set unique id */
    this.attr('id', (this.id = 'svgjs_element_' + (SVG.did++)));
  };
  
  // Inherit from SVG.Element
  SVG.Pattern.prototype = new SVG.Element();
  
  // Include the container object
  SVG.extend(SVG.Pattern, SVG.Container);
  
  //
  SVG.extend(SVG.Pattern, {
    // Return the fill id
    fill: function() {
      return 'url(#' + this.id + ')';
    }
    
  });
  
  //
  SVG.extend(SVG.Defs, {
    
    /* define gradient */
    pattern: function(width, height, block) {
      var element = this.put(new SVG.Pattern());
      
      /* invoke passed block */
      block(element);
      
      return element.attr({
        x:            0,
        y:            0,
        width:        width,
        height:       height,
        patternUnits: 'userSpaceOnUse'
      });
    }
    
  });

  SVG.Gradient = function Gradient(type) {
    this.constructor.call(this, SVG.create(type + 'Gradient'));
    
    /* set unique id */
    this.attr('id', (this.id = 'svgjs_element_' + (SVG.did++)));
    
    /* store type */
    this.type = type;
  };
  
  // Inherit from SVG.Element
  SVG.Gradient.prototype = new SVG.Element();
  
  // Include the container object
  SVG.extend(SVG.Gradient, SVG.Container);
  
  //
  SVG.extend(SVG.Gradient, {
    // From position
    from: function(x, y) {
      return this.type == 'radial' ?
        this.attr({ fx: x + '%', fy: y + '%' }) :
        this.attr({ x1: x + '%', y1: y + '%' });
    },
    // To position
    to: function(x, y) {
      return this.type == 'radial' ?
        this.attr({ cx: x + '%', cy: y + '%' }) :
        this.attr({ x2: x + '%', y2: y + '%' });
    },
    // Radius for radial gradient
    radius: function(radius) {
      return this.type == 'radial' ?
        this.attr({ r: radius + '%' }) :
        this;
    },
    // Add a color stop
    at: function(stop) {
      return this.put(new SVG.Stop(stop));
    },
    // Update gradient
    update: function(block) {
      /* remove all stops */
      while (this.node.hasChildNodes())
        this.node.removeChild(this.node.lastChild);
      
      /* invoke passed block */
      block(this);
      
      return this;
    },
    // Return the fill id
    fill: function() {
      return 'url(#' + this.id + ')';
    }
    
  });
  
  //
  SVG.extend(SVG.Defs, {
    
    /* define gradient */
    gradient: function(type, block) {
      var element = this.put(new SVG.Gradient(type));
      
      /* invoke passed block */
      block(element);
      
      return element;
    }
    
  });
  
  
  SVG.Stop = function Stop(stop) {
    this.constructor.call(this, SVG.create('stop'));
    
    /* immediatelly build stop */
    this.update(stop);
  };
  
  // Inherit from SVG.Element
  SVG.Stop.prototype = new SVG.Element();
  
  //
  SVG.extend(SVG.Stop, {
    
    /* add color stops */
    update: function(o) {
      var index,
          style = '',
          attr  = ['opacity', 'color'];
      
      /* build style attribute */
      for (index = attr.length - 1; index >= 0; index--)
        if (o[attr[index]] != null)
          style += 'stop-' + attr[index] + ':' + o[attr[index]] + ';';
      
      /* set attributes */
      return this.attr({
        offset: (o.offset != null ? o.offset : this.attrs.offset || 0) + '%',
        style:  style
      });
    }
    
  });
  


  SVG.Doc = function Doc(element) {
    this.constructor.call(this, SVG.create('svg'));
    
    /* ensure the presence of a html element */
    this.parent = typeof element == 'string' ?
      document.getElementById(element) :
      element;
    
    /* set svg element attributes and create the <defs> node */
    this.
      attr({ xmlns: SVG.ns, version: '1.1', width: '100%', height: '100%' }).
      attr('xlink', SVG.xlink, SVG.ns).
      defs();
    
    /* ensure correct rendering for safari */
    this.stage(); 
  };
  
  // Inherits from SVG.Element
  SVG.Doc.prototype = new SVG.Element();
  
  // Include the container object
  SVG.extend(SVG.Doc, SVG.Container);
  
  // Hack for safari preventing text to be rendered in one line.
  // Basically it sets the position of the svg node to absolute
  // when the dom is loaded, and resets it to relative a few milliseconds later.
  SVG.Doc.prototype.stage = function() {
    var check,
        element = this,
        wrapper = document.createElement('div');
    
    /* set temp wrapper to position relative */
    wrapper.style.cssText = 'position:relative;height:100%;';
    
    /* put element into wrapper */
    element.parent.appendChild(wrapper);
    wrapper.appendChild(element.node);
    
    /* check for dom:ready */
    check = function() {
      if (document.readyState === 'complete') {
        element.attr('style', 'position:absolute;');
        setTimeout(function() {
          /* set position back to relative */
          element.attr('style', 'position:relative;');
          
          /* remove temp wrapper */
          element.parent.removeChild(element.node.parentNode);
          element.node.parentNode.removeChild(element.node);
          element.parent.appendChild(element.node);
          
        }, 5);
      } else {
        setTimeout(check, 10);
      }
    };
    
    check();
    
    return this;
  };

  SVG.Shape = function Shape(element) {
    this.constructor.call(this, element);
  };
  
  // Inherit from SVG.Element
  SVG.Shape.prototype = new SVG.Element();

  SVG.Wrap = function Wrap(element) {
    this.constructor.call(this, SVG.create('g'));
    
    /* insert and store child */
    this.node.insertBefore(element.node, null);
    this.child = element;
    this.type = element.node.nodeName;
  };
  
  // inherit from SVG.Shape
  SVG.Wrap.prototype = new SVG.Shape();
  
  SVG.extend(SVG.Wrap, {
    // Move wrapper around
    move: function(x, y) {
      return this.transform({
        x: x,
        y: y
      });
    },
    // Set the actual size in pixels
    size: function(width, height) {
      var scale = width / this._b.width;
      
      this.child.transform({
        scaleX: scale,
        scaleY: height != null ? height / this._b.height : scale
      });
  
      return this;
    },
    // Move by center
    center: function(x, y) {
      return this.move(
        x + (this._b.width  * this.child.trans.scaleX) / -2,
        y + (this._b.height * this.child.trans.scaleY) / -2
      );
    },
    // Create distributed attr
    attr: function(a, v, n) {
      /* call individual attributes if an object is given */
      if (typeof a == 'object') {
        for (v in a) this.attr(v, a[v]);
      
      /* act as a getter if only one argument is given */
      } else if (arguments.length < 2) {
        return a == 'transform' ? this.attrs[a] : this.child.attrs[a];
      
      /* apply locally for certain attributes */
      } else if (a == 'transform') {
        this.attrs[a] = v;
        
        n != null ?
          this.node.setAttributeNS(n, a, v) :
          this.node.setAttribute(a, v);
      
      /* apply attributes to child */
      } else {
        this.child.attr(a, v, n);
      }
      
      return this;
    },
    // Distribute plot method to child
    plot: function(data) {
      /* plot new shape */
      this.child.plot(data);
      
      /* get and store new bbox */
      this._b = this.child.bbox();
      
      /* reposition element withing wrapper */
      this.child.transform({
        x: -this._b.x,
        y: -this._b.y
      });
      
      return this;
    }
    
  });

  SVG.Rect = function Rect() {
    this.constructor.call(this, SVG.create('rect'));
  };
  
  // Inherit from SVG.Shape
  SVG.Rect.prototype = new SVG.Shape();

  SVG.Ellipse = function Ellipse() {
    this.constructor.call(this, SVG.create('ellipse'));
  };
  
  // Inherit from SVG.Shape
  SVG.Ellipse.prototype = new SVG.Shape();
  
  //
  SVG.extend(SVG.Ellipse, {
    // Custom move function
    move: function(x, y) {
      this.attrs.x = x;
      this.attrs.y = y;
      
      return this.center();
    },
    // Custom size function
    size: function(width, height) {
      return this.
        attr({ rx: width / 2, ry: (height != null ? height : width) / 2 }).
        center();
    },
    // Custom center function
    center: function(x, y) {
      return this.attr({
        cx: x || (this.attrs.x || 0) + (this.attrs.rx || 0),
        cy: y || (this.attrs.y || 0) + (this.attrs.ry || 0)
      });
    }
    
  });
  
  // Usage:
  
  //     draw.ellipse(200, 100);

  SVG.Poly = {
    // Set polygon data with default zero point if no data is passed
    plot: function(points) {
      this.attr('points', points || '0,0');
      
      return this;
    }
  };
  
  SVG.Polyline = function Polyline() {
    this.constructor.call(this, SVG.create('polyline'));
  };
  
  // Inherit from SVG.Shape
  SVG.Polyline.prototype = new SVG.Shape();
  
  // Add polygon-specific functions
  SVG.extend(SVG.Polyline, SVG.Poly);
  
  SVG.Polygon = function Polygon() {
    this.constructor.call(this, SVG.create('polygon'));
  };
  
  // Inherit from SVG.Shape
  SVG.Polygon.prototype = new SVG.Shape();
  
  // Add polygon-specific functions
  SVG.extend(SVG.Polygon, SVG.Poly);

  SVG.Path = function Path() {
    this.constructor.call(this, SVG.create('path'));
  };
  
  // Inherit from SVG.Shape
  SVG.Path.prototype = new SVG.Shape();
  
  SVG.extend(SVG.Path, {
    
    /* move using transform */
    move: function(x, y) {
      this.transform({
        x: x,
        y: y
      });
    },
    
    /* set path data */
    plot: function(data) {
      return this.attr('d', data || 'M0,0');
    }
    
  });

  SVG.Image = function Image() {
    this.constructor.call(this, SVG.create('image'));
  };
  
  // Inherit from SVG.Element
  SVG.Image.prototype = new SVG.Shape();
  
  SVG.extend(SVG.Image, {
    
    /* (re)load image */
    load: function(url) {
      this.src = url;
      return (url ? this.attr('xlink:href', url, SVG.xlink) : this);
    }
    
  });

  var _styleAttr = ['size', 'family', 'weight', 'stretch', 'variant', 'style'];
  
  SVG.Text = function Text() {
    this.constructor.call(this, SVG.create('text'));
    
    /* define default style */
    this.style = { 'font-size':  16, 'font-family': 'Helvetica', 'text-anchor': 'start' };
    this.leading = 1.2;
  };
  
  // Inherit from SVG.Element
  SVG.Text.prototype = new SVG.Shape();
  
  SVG.extend(SVG.Text, {
    // Set the text content
    text: function(text) {
      /* update the content */
      this.content = text = text || 'text';
      this.lines = [];
      
      var index, length, tspan,
          style   = this._style(),
          parent  = this.doc(),
          lines   = text.split("\n"),
          size    = this.style['font-size'];
      
      /* remove existing child nodes */
      while (this.node.hasChildNodes())
        this.node.removeChild(this.node.lastChild);
      
      /* build new lines */
      for (index = 0, length = lines.length; index < length; index++) {
        /* create new tspan and set attributes */
        tspan = new TSpan().
          text(lines[index]).
          attr({
            dy:     size * this.leading - (index == 0 ? size * 0.3 : 0),
            x:      (this.attrs.x || 0),
            style:  style
          });
        
        /* add new tspan */
        this.node.appendChild(tspan.node);
        this.lines.push(tspan);
      };
      
      /* set style */
      return this.attr('style', style);
    },
    
    // Build style based on _styleAttr
    _style: function() {
      var index, style = '';
      
      for (index = _styleAttr.length - 1; index >= 0; index--)
        if (this.style['font-' + _styleAttr[index]] != null)
          style += 'font-' + _styleAttr[index] + ':' + this.style['font-' + _styleAttr[index]] + ';';
      
      style += 'text-anchor:' + this.style['text-anchor'] + ';';
        
      return style;
    }
    
  });
  
  
  function TSpan() {
    this.constructor.call(this, SVG.create('tspan'));
  };
  
  // Inherit from SVG.Shape
  TSpan.prototype = new SVG.Shape();
  
  // Include the container object
  SVG.extend(TSpan, {
    // Set text content
    text: function(text) {
      this.node.appendChild(document.createTextNode(text));
      
      return this;
    }
    
  });

  SVG.Nested = function Nested() {
    this.constructor.call(this, SVG.create('svg'));
    this.attr('overflow', 'visible');
  };
  
  // Inherit from SVG.Element
  SVG.Nested.prototype = new SVG.Element();
  
  // Include the container object
  SVG.extend(SVG.Nested, SVG.Container);

  SVG._stroke = ['color', 'width', 'opacity', 'linecap', 'linejoin', 'miterlimit', 'dasharray', 'dashoffset'];
  SVG._fill   = ['color', 'opacity', 'rule'];
  
  
  // Prepend correct color prefix
  var _colorPrefix = function(type, attr) {
    return attr == 'color' ? type : type + '-' + attr;
  };
  
  /* Add sugar for fill and stroke */
  ['fill', 'stroke'].forEach(function(method) {
    
    // Set fill color and opacity
    SVG.Shape.prototype[method] = function(o) {
      var index;
      
      if (typeof o == 'string')
        this.attr(method, o);
      
      else
        /* set all attributes from _fillAttr and _strokeAttr list */
        for (index = SVG['_' + method].length - 1; index >= 0; index--)
          if (o[SVG['_' + method][index]] != null)
            this.attr(_colorPrefix(method, SVG['_' + method][index]), o[SVG['_' + method][index]]);
      
      return this;
    };
    
  });
  
  [SVG.Element, SVG.FX].forEach(function(module) {
    if (module) {
      SVG.extend(module, {
        // Rotation
        rotate: function(angle) {
          return this.transform({
            rotation: angle || 0
          });
        },
        // Skew
        skew: function(x, y) {
          return this.transform({
            skewX: x || 0,
            skewY: y || 0
          });
        },
        // Scale
        scale: function(x, y) {
          return this.transform({
            scaleX: x || 0,
            scaleY: y || 0
          });
        }
  
      });
    }
  });
  
  
  if (SVG.G) {
    SVG.extend(SVG.G, {
      // Move using translate
      move: function(x, y) {
        return this.transform({
          x: x,
          y: y
        });
      }
  
    });
  }
  
  if (SVG.Text) {
    SVG.extend(SVG.Text, {
      // Set font 
      font: function(o) {
        var key, attr = {};
  
        for (key in o)
          key == 'leading' ?
            attr[key] = o[key] :
          key == 'anchor' ?
            attr['text-anchor'] = o[key] :
          _styleAttr.indexOf(key) > -1 ?
            attr['font-'+ key] = o[key] :
            void 0;
  
        return this.attr(attr).text(this.content);
      }
  
    });
  }
  


}).call(this);
