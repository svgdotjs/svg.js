var SVG = (function () {
  'use strict';

  class Base$1 {
    constructor (node, {extensions = []}) {
      this.tags = [];

      for (let extension of extensions) {
        extension.setup.call(this, node);
        this.tags.push(extension.name);
      }
    }

    is (ability) {
      return this.tags.includes(ability)
    }
  }

  // Default namespaces
  let ns$1 = 'http://www.w3.org/2000/svg';
  let xmlns = 'http://www.w3.org/2000/xmlns/';
  let xlink = 'http://www.w3.org/1999/xlink';
  let svgjs = 'http://svgjs.com/svgjs';

  // Parse unit value
  let numberAndUnit = /^([+-]?(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?)([a-z%]*)$/i;

  // Parse hex value
  let hex = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i;

  // Parse rgb value
  let rgb = /rgb\((\d+),(\d+),(\d+)\)/;

  // splits a transformation chain
  let transforms = /\)\s*,?\s*/;

  // Whitespace
  let whitespace = /\s/g;

  // Test hex value
  let isHex = /^#[a-f0-9]{3,6}$/i;

  // Test rgb value
  let isRgb = /^rgb\(/;

  // Test for blank string
  let isBlank = /^(\s+)?$/;

  // Test for numeric string
  let isNumber = /^[+-]?(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i;

  // Test for image url
  let isImage = /\.(jpg|jpeg|png|gif|svg)(\?[^=]+.*)?/i;

  // split at whitespace and comma
  let delimiter = /[\s,]+/;

  // The following regex are used to parse the d attribute of a path

  // Matches all hyphens which are not after an exponent
  let hyphen = /([^e])-/gi;

  // Replaces and tests for all path letters
  let pathLetters = /[MLHVCSQTAZ]/gi;

  // yes we need this one, too
  let isPathLetter = /[MLHVCSQTAZ]/i;

  // matches 0.154.23.45
  let numbersWithDots = /((\d?\.\d+(?:e[+-]?\d+)?)((?:\.\d+(?:e[+-]?\d+)?)+))+/gi;

  // matches .
  let dots = /\./g;

  function isNulledBox (box) {
    return !box.w && !box.h && !box.x && !box.y
  }

  function domContains (node) {
    return (document.documentElement.contains || function (node) {
      // This is IE - it does not support contains() for top-level SVGs
      while (node.parentNode) {
        node = node.parentNode;
      }
      return node === document
    }).call(document.documentElement, node)
  }

  function pathRegReplace (a, b, c, d) {
    return c + d.replace(dots, ' .')
  }

  // Convert dash-separated-string to camelCase
  function camelCase (s) {
    return s.toLowerCase().replace(/-(.)/g, function (m, g) {
      return g.toUpperCase()
    })
  }

  // Capitalize first letter of a string
  function capitalize (s) {
    return s.charAt(0).toUpperCase() + s.slice(1)
  }

  // Ensure to six-based hex
  function fullHex (hex$$1) {
    return hex$$1.length === 4
      ? [ '#',
        hex$$1.substring(1, 2), hex$$1.substring(1, 2),
        hex$$1.substring(2, 3), hex$$1.substring(2, 3),
        hex$$1.substring(3, 4), hex$$1.substring(3, 4)
      ].join('')
      : hex$$1
  }

  // Component to hex value
  function compToHex (comp) {
    var hex$$1 = comp.toString(16);
    return hex$$1.length === 1 ? '0' + hex$$1 : hex$$1
  }

  // Calculate proportional width and height values when necessary
  function proportionalSize$1 (element, width, height) {
    if (width == null || height == null) {
      var box = element.bbox();

      if (width == null) {
        width = box.width / box.height * height;
      } else if (height == null) {
        height = box.height / box.width * width;
      }
    }

    return {
      width: width,
      height: height
    }
  }

  // Map matrix array to object
  function arrayToMatrix (a) {
    return { a: a[0], b: a[1], c: a[2], d: a[3], e: a[4], f: a[5] }
  }

  // PathArray Helpers
  function arrayToString (a) {
    for (var i = 0, il = a.length, s = ''; i < il; i++) {
      s += a[i][0];

      if (a[i][1] != null) {
        s += a[i][1];

        if (a[i][2] != null) {
          s += ' ';
          s += a[i][2];

          if (a[i][3] != null) {
            s += ' ';
            s += a[i][3];
            s += ' ';
            s += a[i][4];

            if (a[i][5] != null) {
              s += ' ';
              s += a[i][5];
              s += ' ';
              s += a[i][6];

              if (a[i][7] != null) {
                s += ' ';
                s += a[i][7];
              }
            }
          }
        }
      }
    }

    return s + ' '
  }

  // Add more bounding box properties
  function fullBox (b) {
    if (b.x == null) {
      b.x = 0;
      b.y = 0;
      b.width = 0;
      b.height = 0;
    }

    b.w = b.width;
    b.h = b.height;
    b.x2 = b.x + b.width;
    b.y2 = b.y + b.height;
    b.cx = b.x + b.width / 2;
    b.cy = b.y + b.height / 2;

    return b
  }

  // Create matrix array for looping
  let abcdef = 'abcdef'.split('');

  function closeEnough (a, b, threshold) {
    return Math.abs(b - a) < (threshold || 1e-6)
  }

  function isMatrixLike (o) {
    return (
      o.a != null ||
      o.b != null ||
      o.c != null ||
      o.d != null ||
      o.e != null ||
      o.f != null
    )
  }

  function getOrigin (o, element) {
    // Allow origin or around as the names
    let origin = o.origin; // o.around == null ? o.origin : o.around
    let ox, oy;

    // Allow the user to pass a string to rotate around a given point
    if (typeof origin === 'string' || origin == null) {
      // Get the bounding box of the element with no transformations applied
      const string = (origin || 'center').toLowerCase().trim();
      const { height, width, x, y } = element.bbox();

      // Calculate the transformed x and y coordinates
      let bx = string.includes('left') ? x
        : string.includes('right') ? x + width
        : x + width / 2;
      let by = string.includes('top') ? y
        : string.includes('bottom') ? y + height
        : y + height / 2;

      // Set the bounds eg : "bottom-left", "Top right", "middle" etc...
      ox = o.ox != null ? o.ox : bx;
      oy = o.oy != null ? o.oy : by;
    } else {
      ox = origin[0];
      oy = origin[1];
    }

    // Return the origin as it is if it wasn't a string
    return [ ox, oy ]
  }

  function nodeOrNew$1 (name, node) {
    return node || makeNode$1(name)
  }

  // Method for element creation
  function makeNode$1 (name) {
    // create element
    return document.createElementNS(ns$1, name)
  }

  // Method for extending objects
  function extend$1 (modules, methods) {
    var key, i;

    if (Array.isArray(methods)) {
      methods.forEach((method) => {
        extend$1(modules, method);
      });
      return
    }

    modules = Array.isArray(modules) ? modules : [modules];

    for (i = modules.length - 1; i >= 0; i--) {
      if (methods.name) {
        modules[i].extensions = (modules[i].extensions || []).concat(methods);
      }
      for (key in methods) {
        if (modules[i].prototype[key] || key == 'name' || key == 'setup') continue
        modules[i].prototype[key] = methods[key];
      }
    }
  }

  // FIXME: enhanced constructors here
  function addFactory (modules, methods) {
    extend$1(modules, methods);
  }

  // Invent new element
  function invent (config) {
    // Create element initializer
    var initializer = typeof config.create === 'function' ? config.create
      : function (node) {
        config.inherit.call(this, node || makeNode$1(config.create));
      };

    // Inherit prototype
    if (config.inherit) {
      initializer.prototype = new config.inherit();
      initializer.prototype.constructor = initializer;
    }

    // Extend with methods
    if (config.extend) {
      extend$1(initializer, config.extend);
    }

    // Attach construct method to parent
    if (config.construct) { extend$1(config.parent || Container, config.construct); }

    return initializer
  }

  var tools = /*#__PURE__*/Object.freeze({
    nodeOrNew: nodeOrNew$1,
    makeNode: makeNode$1,
    extend: extend$1,
    addFactory: addFactory,
    invent: invent
  });

  function Bare (element, inherit = {}) {
    let custom =  class Custom extends inherit {
      constructor (node) {
        super(nodeOrNew$1(element, node), Custom);
      }

      words (text) {
        // remove contents
        while (this.node.hasChildNodes()) {
          this.node.removeChild(this.node.lastChild);
        }

        // create text node
        this.node.appendChild(document.createTextNode(text));

        return this
      }
    };

    extend(custom, inherit);
  }

  // export let constructors = {
  //   // Create an element that is not described by SVG.js
  //   element: function (element, inherit) {
  //     let custom = createCustom(element, inherit)
  //     return this.put(new custom())
  //   }
  // }

  // extend(Parent, {
  //   // Create an element that is not described by SVG.js
  //   element: function (element, inherit) {
  //     let custom = createCustom(element, inherit)
  //     return this.put(new custom())
  //   }
  // })

  // Module for unit convertions
  class SVGNumber {
    // Initialize
    constructor (...args) {
      this.init(...args);
    }

    init (value, unit) {
      unit = Array.isArray(value) ? value[1] : unit;
      value = Array.isArray(value) ? value[0] : value;

      // initialize defaults
      this.value = 0;
      this.unit = unit || '';

      // parse value
      if (typeof value === 'number') {
        // ensure a valid numeric value
        this.value = isNaN(value) ? 0 : !isFinite(value) ? (value < 0 ? -3.4e+38 : +3.4e+38) : value;
      } else if (typeof value === 'string') {
        unit = value.match(numberAndUnit);

        if (unit) {
          // make value numeric
          this.value = parseFloat(unit[1]);

          // normalize
          if (unit[5] === '%') { this.value /= 100; } else if (unit[5] === 's') {
            this.value *= 1000;
          }

          // store unit
          this.unit = unit[5];
        }
      } else {
        if (value instanceof SVGNumber) {
          this.value = value.valueOf();
          this.unit = value.unit;
        }
      }
    }

    toString () {
      return (this.unit === '%' ? ~~(this.value * 1e8) / 1e6
        : this.unit === 's' ? this.value / 1e3
        : this.value
      ) + this.unit
    }

    toJSON () {
      return this.toString()
    }


    toArray () {
      return [this.value, this.unit]
    }

    valueOf () {
      return this.value
    }

    // Add number
    plus (number) {
      number = new SVGNumber(number);
      return new SVGNumber(this + number, this.unit || number.unit)
    }

    // Subtract number
    minus (number) {
      number = new SVGNumber(number);
      return new SVGNumber(this - number, this.unit || number.unit)
    }

    // Multiply number
    times (number) {
      number = new SVGNumber(number);
      return new SVGNumber(this * number, this.unit || number.unit)
    }

    // Divide number
    divide (number) {
      number = new SVGNumber(number);
      return new SVGNumber(this / number, this.unit || number.unit)
    }
  }

  // FIXME: import this to runner

  // Radius x value
  function rx (rx) {
    return this.attr('rx', rx)
  }

  // Radius y value
  function ry (ry) {
    return this.attr('ry', ry)
  }

  // Move over x-axis
  function x (x) {
    return x == null
      ? this.cx() - this.rx()
      : this.cx(x + this.rx())
  }

  // Move over y-axis
  function y (y) {
    return y == null
      ? this.cy() - this.ry()
      : this.cy(y + this.ry())
  }

  // Move by center over x-axis
  function cx (x) {
    return x == null
      ? this.attr('cx')
      : this.attr('cx', x)
  }

  // Move by center over y-axis
  function cy (y) {
    return y == null
      ? this.attr('cy')
      : this.attr('cy', y)
  }

  // Set width of element
  function width (width) {
    return width == null
      ? this.rx() * 2
      : this.rx(new SVGNumber(width).divide(2))
  }

  // Set height of element
  function height (height) {
    return height == null
      ? this.ry() * 2
      : this.ry(new SVGNumber(height).divide(2))
  }

  // Custom size function
  function size (width, height) {
    var p = proportionalSize$1(this, width, height);

    return this
      .rx(new SVGNumber(p.width).divide(2))
      .ry(new SVGNumber(p.height).divide(2))
  }

  var circled = /*#__PURE__*/Object.freeze({
    rx: rx,
    ry: ry,
    x: x,
    y: y,
    cx: cx,
    cy: cy,
    width: width,
    height: height,
    size: size
  });

  class Circle extends Base$1 {
    constructor (node) {
      super(nodeOrNew$1('circle', node), Circle);
    }

    radius (r) {
      return this.attr('r', r)
    }

    // Radius x value
    rx (rx$$1) {
      return this.attr('r', rx$$1)
    }

    // Alias radius x value
    ry (ry$$1) {
      return this.rx(ry$$1)
    }
  }

  extend$1(Circle, {x, y, cx, cy, width, height, size});

  Circle.constructors = {
    Element: {
      // Create circle element
      circle (size$$1) {
        return this.put(new Circle())
          .radius(new SVGNumber(size$$1).divide(2))
          .move(0, 0)
      }
    }
  };

  //import find from './selector.js'
  //import {remove} from './Element.js'

  class ClipPath extends Base$1 {
    constructor (node) {
      super(nodeOrNew$1('clipPath', node), ClipPath);
    }

    // // Unclip all clipped elements and remove itself
    // remove () {
    //   // unclip all targets
    //   this.targets().forEach(function (el) {
    //     el.unclip()
    //   })
    //
    //   // remove clipPath from parent
    //   return remove.call(this)
    // }
    //
    // targets () {
    //   return find('svg [clip-path*="' + this.id() + '"]')
    // }
  }


  ClipPath.constructors = {
    Container: {
      // Create clipping element
      clip: function() {
        return this.defs().put(new ClipPath)
      }
    },
    Element: {
      // Distribute clipPath to svg element
      clipWith (element) {
        // use given clip or create a new one
        let clipper = element instanceof ClipPath
          ? element
          : this.parent().clip().add(element);

        // apply mask
        return this.attr('clip-path', 'url("#' + clipper.id() + '")')
      },

      // Unclip element
      unclip () {
        return this.attr('clip-path', null)
      },

      clipper () {
        return this.reference('clip-path')
      }
    }
  };

  class Defs extends Base$1 {
    constructor (node) {
      super(nodeOrNew$1('defs', node), Defs);
    }

    flatten () { return this }
    ungroup () { return this }
  }

  //import {adopt} from './adopter.js'

  class Doc$1 extends Base$1 {
    constructor(node) {
      super(nodeOrNew$1('svg', node), Doc$1);
      this.namespace();
    }

    isRoot() {
      return !this.node.parentNode
        || !(this.node.parentNode instanceof window.SVGElement)
        || this.node.parentNode.nodeName === '#document'
    }

    // Check if this is a root svg
    // If not, call docs from this element
    doc() {
      if (this.isRoot()) return this
      return Element.doc.call(this)
    }

    // Add namespaces
    namespace() {
      if (!this.isRoot()) return this.doc().namespace()
      return this
        .attr({ xmlns: ns$1, version: '1.1' })
        .attr('xmlns:xlink', xlink, xmlns)
        .attr('xmlns:svgjs', svgjs, xmlns)
    }

    // Creates and returns defs element
    defs() {
      if (!this.isRoot()) return this.doc().defs()

      let node = this.node.getElementsByTagName('defs')[0];
      return node ? (node.instance || new Defs(node)) : this.put(new Defs())
      // 
      // return adopt(this.node.getElementsByTagName('defs')[0]) ||
      //   this.put(new Defs())
    }

    // custom parent method
    parent(type) {
      if (this.isRoot()) {
        return this.node.parentNode.nodeName === '#document'
          ? null
          : this.node.parentNode
      }

      return Element.parent.call(this, type)
    }

    // Removes the doc from the DOM
    remove() {
      if (!this.isRoot()) {
        return Element.remove.call(this)
      }

      if (this.parent()) {
        this.parent().removeChild(this.node);
      }

      return this
    }

    clear() {
      // remove children
      while (this.node.hasChildNodes()) {
        this.node.removeChild(this.node.lastChild);
      }
      return this
    }
  }

  Doc$1.constructors = {
    Container: {
      // Create nested svg document
      nested() {
        return this.put(new Doc$1())
      }
    }
  };

  class Ellipse extends Base$1 {
    constructor (node) {
      super(nodeOrNew('ellipse', node), Ellipse);
    }
  }

  extend$1(Ellipse, circled);

  // addFactory(Container, {
  //   // Create an ellipse
  //   ellipse: function (width, height) {
  //     return this.put(new Ellipse()).size(width, height).move(0, 0)
  //   }
  // })

  class Stop extends Base$1 {
    constructor (node) {
      super(nodeOrNew$1('stop', node), Stop);
    }

    // add color stops
    update (o) {
      if (typeof o === 'number' || o instanceof SVGNumber) {
        o = {
          offset: arguments[0],
          color: arguments[1],
          opacity: arguments[2]
        };
      }

      // set attributes
      if (o.opacity != null) this.attr('stop-opacity', o.opacity);
      if (o.color != null) this.attr('stop-color', o.color);
      if (o.offset != null) this.attr('offset', new SVGNumber(o.offset));

      return this
    }
  }

  // FIXME: add to runner

  function from (x, y) {
    return (this._element || this).type === 'radialGradient'
      ? this.attr({ fx: new SVGNumber(x), fy: new SVGNumber(y) })
      : this.attr({ x1: new SVGNumber(x), y1: new SVGNumber(y) })
  }

  function to (x, y) {
    return (this._element || this).type === 'radialGradient'
      ? this.attr({ cx: new SVGNumber(x), cy: new SVGNumber(y) })
      : this.attr({ x2: new SVGNumber(x), y2: new SVGNumber(y) })
  }

  var gradiented = /*#__PURE__*/Object.freeze({
    from: from,
    to: to
  });

  //import attr from './attr.js'

  class Gradient extends Base$1 {
    constructor (type) {
      super(
        nodeOrNew$1(type + 'Gradient', typeof type === 'string' ? null : type),
        Gradient
      );
    }

    // Add a color stop
    stop (offset, color, opacity) {
      return this.put(new Stop()).update(offset, color, opacity)
    }

    // Update gradient
    update (block) {
      // remove all stops
      this.clear();

      // invoke passed block
      if (typeof block === 'function') {
        block.call(this, this);
      }

      return this
    }

    // Return the fill id
    url () {
      return 'url(#' + this.id() + ')'
    }

    // Alias string convertion to fill
    toString () {
      return this.url()
    }

    // // custom attr to handle transform
    // attr (a, b, c) {
    //   if (a === 'transform') a = 'gradientTransform'
    //   return attr.call(this, a, b, c)
    // }
  }

  extend$1(Gradient, gradiented);

  Gradient.constructors = {
    Container: {
      // Create gradient element in defs
      gradient (type, block) {
        return this.defs().gradient(type, block)
      }
    },
    // define gradient
    Defs: {
      gradient (type, block) {
        return this.put(new Gradient(type)).update(block)
      }
    }
  };

  class G extends Base$1 {
    constructor (node) {
      super(nodeorNew('g', node), G);
    }
  }

  G.constructors = {
    Element: {
      // Create a group element
      group: function () {
        return this.put(new G())
      }
    }
  };

  //import {makeInstance} from './adopter.js'

  class HtmlNode extends Base$1 {
    constructor (element) {
      super(element, HtmlNode);
      this.node = element;
    }

    // add (element, i) {
    //   element = makeInstance(element)
    //
    //   if (element.node !== this.node.children[i]) {
    //     this.node.insertBefore(element.node, this.node.children[i] || null)
    //   }
    //
    //   return this
    // }

    put (element, i) {
      this.add(element, i);
      return element
    }

    getEventTarget () {
      return this.node
    }
  }

  class A extends Base$1{
    constructor (node) {
      super(nodeOrNew$1('a', node), A);
    }

    // Link url
    to (url) {
      return this.attr('href', url, xlink)
    }

    // Link target attribute
    target (target) {
      return this.attr('target', target)
    }
  }

  A.constructors = {
    Container: {
      // Create a hyperlink element
      link: function (url) {
        return this.put(new A()).to(url)
      }
    },
    Element: {
      // Create a hyperlink element
      linkTo: function (url) {
        var link = new A();

        if (typeof url === 'function') { url.call(link, link); } else {
          link.to(url);
        }

        return this.parent().put(link).put(this)
      }
    }
  };

  //import attr from './attr.js'

  class Pattern extends Base$1 {
    // Initialize node
    constructor (node) {
      super(nodeOrNew$1('pattern', node));
    }

    // Return the fill id
    url () {
      return 'url(#' + this.id() + ')'
    }

    // Update pattern by rebuilding
    update (block) {
      // remove content
      this.clear();

      // invoke passed block
      if (typeof block === 'function') {
        block.call(this, this);
      }

      return this
    }

    // Alias string convertion to fill
    toString () {
      return this.url()
    }

    // // custom attr to handle transform
    // attr (a, b, c) {
    //   if (a === 'transform') a = 'patternTransform'
    //   return attr.call(this, a, b, c)
    // }
  }

  Pattern.constructors = {
    Container: {
      // Create pattern element in defs
      pattern (width, height, block) {
        return this.defs().pattern(width, height, block)
      }
    },
    Defs: {
      pattern (width, height, block) {
        return this.put(new Pattern()).update(block).attr({
          x: 0,
          y: 0,
          width: width,
          height: height,
          patternUnits: 'userSpaceOnUse'
        })
      }
    }
  };

  // // Add events to elements
  // ;[ 'click',
  //   'dblclick',
  //   'mousedown',
  //   'mouseup',
  //   'mouseover',
  //   'mouseout',
  //   'mousemove',
  //   'mouseenter',
  //   'mouseleave',
  //   'touchstart',
  //   'touchmove',
  //   'touchleave',
  //   'touchend',
  //   'touchcancel' ].forEach(function (event) {
  //     // add event to Element
  //     Element.prototype[event] = function (f) {
  //       if (f === null) {
  //         off(this, event)
  //       } else {
  //         on(this, event, f)
  //       }
  //       return this
  //     }
  //   })

  let listenerId = 0;

  function getEventTarget (node) {
    return node instanceof Base && node.is('EventTarget')
      ? node.getEventTarget()
      : node
  }

  // Add event binder in the SVG namespace
  function on (node, events, listener, binding, options) {
    var l = listener.bind(binding || node);
    var n = getEventTarget(node);

    // events can be an array of events or a string of events
    events = Array.isArray(events) ? events : events.split(delimiter);

    // ensure instance object for nodes which are not adopted
    n.instance = n.instance || {events: {}};

    // pull event handlers from the element
    var bag = n.instance.events;

    // add id to listener
    if (!listener._svgjsListenerId) {
      listener._svgjsListenerId = ++listenerId;
    }

    events.forEach(function (event) {
      var ev = event.split('.')[0];
      var ns = event.split('.')[1] || '*';

      // ensure valid object
      bag[ev] = bag[ev] || {};
      bag[ev][ns] = bag[ev][ns] || {};

      // reference listener
      bag[ev][ns][listener._svgjsListenerId] = l;

      // add listener
      n.addEventListener(ev, l, options || false);
    });
  }

  // Add event unbinder in the SVG namespace
  function off (node, events, listener, options) {
    var n = getEventTarget(node);

    // we cannot remove an event if its not an svg.js instance
    if (!n.instance) return

    // listener can be a function or a number
    if (typeof listener === 'function') {
      listener = listener._svgjsListenerId;
      if (!listener) return
    }

    // pull event handlers from the element
    var bag = n.instance.events;

    // events can be an array of events or a string or undefined
    events = Array.isArray(events) ? events : (events || '').split(delimiter);

    events.forEach(function (event) {
      var ev = event && event.split('.')[0];
      var ns = event && event.split('.')[1];
      var namespace, l;

      if (listener) {
        // remove listener reference
        if (bag[ev] && bag[ev][ns || '*']) {
          // removeListener
          n.removeEventListener(ev, bag[ev][ns || '*'][listener], options || false);

          delete bag[ev][ns || '*'][listener];
        }
      } else if (ev && ns) {
        // remove all listeners for a namespaced event
        if (bag[ev] && bag[ev][ns]) {
          for (l in bag[ev][ns]) { off(n, [ev, ns].join('.'), l); }

          delete bag[ev][ns];
        }
      } else if (ns) {
        // remove all listeners for a specific namespace
        for (event in bag) {
          for (namespace in bag[event]) {
            if (ns === namespace) { off(n, [event, ns].join('.')); }
          }
        }
      } else if (ev) {
        // remove all listeners for the event
        if (bag[ev]) {
          for (namespace in bag[ev]) { off(n, [ev, namespace].join('.')); }

          delete bag[ev];
        }
      } else {
        // remove all listeners on a given node
        for (event in bag) { off(n, event); }

        n.instance.events = {};
      }
    });
  }

  function dispatch (node, event, data) {
    var n = getEventTarget(node);

    // Dispatch event
    if (event instanceof window.Event) {
      n.dispatchEvent(event);
    } else {
      event = new window.CustomEvent(event, {detail: data, cancelable: true});
      n.dispatchEvent(event);
    }
    return event
  }

  class Image extends Base$1 {
    constructor (node) {
      super(nodeOrNew$1('image', node), Image);
    }

    // (re)load image
    load (url, callback) {
      if (!url) return this

      var img = new window.Image();

      on(img, 'load', function (e) {
        var p = this.parent(Pattern);

        // ensure image size
        if (this.width() === 0 && this.height() === 0) {
          this.size(img.width, img.height);
        }

        if (p instanceof Pattern) {
          // ensure pattern size if not set
          if (p.width() === 0 && p.height() === 0) {
            p.size(this.width(), this.height());
          }
        }

        if (typeof callback === 'function') {
          callback.call(this, {
            width: img.width,
            height: img.height,
            ratio: img.width / img.height,
            url: url
          });
        }
      }, this);

      on(img, 'load error', function () {
        // dont forget to unbind memory leaking events
        off(img);
      });

      return this.attr('href', (img.src = url), xlink)
    }
  }

  Image.constructors = {
    Container: {
      // create image element, load image and set its size
      image (source, callback) {
        return this.put(new Image()).size(0, 0).load(source, callback)
      }
    }
  };

  /* global arrayClone */

  let BaseArray = (function() {
    try {
      return Array
    } catch (e) {
      return Array
    }
  })();

  class SVGArray extends BaseArray {
    constructor (...args) {
      super();
      this.init(...args);
    }

    init (array, fallback) {
      //this.splice(0, this.length)
      this.length = 0;
      this.push(...this.parse(array || fallback));
    }

    toArray () {
      return Array.prototype.slice(this)
    }

    toString () {
      this.join(' ');
    }

    valueOf () {
      return this.toArray()
    }

    // Parse whitespace separated string
    parse (array) {
      array = array.valueOf();

      // if already is an array, no need to parse it
      if (Array.isArray(array)) return array

      return array.trim().split(delimiter).map(parseFloat)
    }

    clone () {
      return new this.constructor(this)
    }

    toSet () {
      return new Set(this)
    }
  }

  class PointArray$1 extends SVGArray {
    constructor (array, fallback = [[0, 0]]) {
      super(array, fallback);
    }

    // Convert array to string
    toString () {
      // convert to a poly point string
      for (var i = 0, il = this.value.length, array = []; i < il; i++) {
        array.push(this.value[i].join(','));
      }

      return array.join(' ')
    }

    toArray () {
      return this.value.reduce(function (prev, curr) {
        return [].concat.call(prev, curr)
      }, [])
    }

    // Convert array to line object
    toLine () {
      return {
        x1: this.value[0][0],
        y1: this.value[0][1],
        x2: this.value[1][0],
        y2: this.value[1][1]
      }
    }

    // Get morphed array at given position
    at (pos) {
      // make sure a destination is defined
      if (!this.destination) return this

      // generate morphed point string
      for (var i = 0, il = this.value.length, array = []; i < il; i++) {
        array.push([
          this.value[i][0] + (this.destination[i][0] - this.value[i][0]) * pos,
          this.value[i][1] + (this.destination[i][1] - this.value[i][1]) * pos
        ]);
      }

      return new PointArray$1(array)
    }

    // Parse point string and flat array
    parse (array) {
      var points = [];

      array = array.valueOf();

      // if it is an array
      if (Array.isArray(array)) {
        // and it is not flat, there is no need to parse it
        if (Array.isArray(array[0])) {
          return array
        }
      } else { // Else, it is considered as a string
        // parse points
        array = array.trim().split(delimiter).map(parseFloat);
      }

      // validate points - https://svgwg.org/svg2-draft/shapes.html#DataTypePoints
      // Odd number of coordinates is an error. In such cases, drop the last odd coordinate.
      if (array.length % 2 !== 0) array.pop();

      // wrap points in two-tuples and parse points as floats
      for (var i = 0, len = array.length; i < len; i = i + 2) {
        points.push([ array[i], array[i + 1] ]);
      }

      return points
    }

    // Move point string
    move (x, y) {
      var box = this.bbox();

      // get relative offset
      x -= box.x;
      y -= box.y;

      // move every point
      if (!isNaN(x) && !isNaN(y)) {
        for (var i = this.value.length - 1; i >= 0; i--) {
          this.value[i] = [this.value[i][0] + x, this.value[i][1] + y];
        }
      }

      return this
    }

    // Resize poly string
    size (width, height) {
      var i;
      var box = this.bbox();

      // recalculate position of all points according to new size
      for (i = this.value.length - 1; i >= 0; i--) {
        if (box.width) this.value[i][0] = ((this.value[i][0] - box.x) * width) / box.width + box.x;
        if (box.height) this.value[i][1] = ((this.value[i][1] - box.y) * height) / box.height + box.y;
      }

      return this
    }

    // Get bounding box of points
    bbox () {
      var maxX = -Infinity;
      var maxY = -Infinity;
      var minX = Infinity;
      var minY = Infinity;
      this.value.forEach(function (el) {
        maxX = Math.max(el[0], maxX);
        maxY = Math.max(el[1], maxY);
        minX = Math.min(el[0], minX);
        minY = Math.min(el[1], minY);
      });
      return {x: minX, y: minY, width: maxX - minX, height: maxY - minY}
    }
  }

  class Line extends Base$1 {
    // Initialize node
    constructor (node) {
      super(nodeOrNew$1('line', node), Line);
    }

    // Get array
    array () {
      return new PointArray$1([
        [ this.attr('x1'), this.attr('y1') ],
        [ this.attr('x2'), this.attr('y2') ]
      ])
    }

    // Overwrite native plot() method
    plot (x1, y1, x2, y2) {
      if (x1 == null) {
        return this.array()
      } else if (typeof y1 !== 'undefined') {
        x1 = { x1: x1, y1: y1, x2: x2, y2: y2 };
      } else {
        x1 = new PointArray$1(x1).toLine();
      }

      return this.attr(x1)
    }

    // Move by left top corner
    move (x, y) {
      return this.attr(this.array().move(x, y).toLine())
    }

    // Set element size to given width and height
    size (width, height) {
      var p = proportionalSize$1(this, width, height);
      return this.attr(this.array().size(p.width, p.height).toLine())
    }

  }

  Line.constructors = {
    Container: {
      // Create a line element
      line (...args) {
        // make sure plot is called as a setter
        // x1 is not necessarily a number, it can also be an array, a string and a PointArray
        return Line.prototype.plot.apply(
          this.put(new Line())
        , args[0] != null ? args : [0, 0, 0, 0]
        )
      }
    }
  };

  // import Defs from './Defs.js'
  // import Line from './Line.js'
  // import Polyline from './Polyline.js'
  // import Polygon from './Polygon.js'
  // import Path from './Path.js'

  class Marker extends Base$1 {
    // Initialize node
    constructor (node) {
      super(nodeOrNew('marker', node), Marker);
    }

    // Set width of element
    width (width) {
      return this.attr('markerWidth', width)
    }

    // Set height of element
    height (height) {
      return this.attr('markerHeight', height)
    }

    // Set marker refX and refY
    ref (x, y) {
      return this.attr('refX', x).attr('refY', y)
    }

    // Update marker
    update (block) {
      // remove all content
      this.clear();

      // invoke passed block
      if (typeof block === 'function') { block.call(this, this); }

      return this
    }

    // Return the fill id
    toString () {
      return 'url(#' + this.id() + ')'
    }
  }

  Marker.constructors = {
    Container: {
      marker (width, height, block) {
        // Create marker element in defs
        return this.defs().marker(width, height, block)
      }
    },
    Defs: {
      // Create marker
      marker (width, height, block) {
        // Set default viewbox to match the width and height, set ref to cx and cy and set orient to auto
        return this.put(new Marker())
          .size(width, height)
          .ref(width / 2, height / 2)
          .viewbox(0, 0, width, height)
          .attr('orient', 'auto')
          .update(block)
      }
    },
    marker: {
      // Create and attach markers
      marker (marker, width, height, block) {
        var attr = ['marker'];

        // Build attribute name
        if (marker !== 'all') attr.push(marker);
        attr = attr.join('-');

        // Set marker attribute
        marker = arguments[1] instanceof Marker
          ? arguments[1]
          : this.defs().marker(width, height, block);

        return this.attr(attr, marker)
      }
    }
  };

  // import find from './selector.js'
  // import {remove} from  './Element.js'

  class Mask extends Base$1 {
    // Initialize node
    constructor (node) {
      super(nodeOrNew$1('mask', node));
    }

    // // Unmask all masked elements and remove itself
    // remove () {
    //   // unmask all targets
    //   this.targets().forEach(function (el) {
    //     el.unmask()
    //   })
    //
    //   // remove mask from parent
    //   return remove.call(this)
    // }
    //
    // targets () {
    //   return find('svg [mask*="' + this.id() + '"]')
    // }

  }


  Mask.constructors = {
    Container: {
      mask () {
        return this.defs().put(new Mask())
      }
    },
    Element: {
      // Distribute mask to svg element
      maskWith (element) {
        // use given mask or create a new one
        var masker = element instanceof Mask
          ? element
          : this.parent().mask().add(element);

        // apply mask
        return this.attr('mask', 'url("#' + masker.id() + '")')
      },

      // Unmask element
      unmask () {
        return this.attr('mask', null)
      },

      masker () {
        return this.reference('mask')
      }
    }
  };

  function parser () {

    // Reuse cached element if possible
    if (!parser.nodes) {
      let svg = new Doc$1().size(2, 0).css({
        opacity: 0,
        position: 'absolute',
        left: '-100%',
        top: '-100%',
        overflow: 'hidden'
      });

      let path = svg.path().node;

      parser.nodes = {svg, path};
    }

    if (!parser.nodes.svg.node.parentNode) {
      let b = document.body || document.documentElement;
      parser.nodes.svg.addTo(b);
    }

    return parser.nodes
  }

  class Point {
    // Initialize
    constructor (x, y, base) {
      let source;
      base = base || {x: 0, y: 0};

      // ensure source as object
      source = Array.isArray(x) ? {x: x[0], y: x[1]}
        : typeof x === 'object' ? {x: x.x, y: x.y}
        : {x: x, y: y};

      // merge source
      this.x = source.x == null ? base.x : source.x;
      this.y = source.y == null ? base.y : source.y;
    }

    // Clone point
    clone () {
      return new Point(this)
    }

    // Convert to native SVGPoint
    native () {
      // create new point
      var point = parser().svg.createSVGPoint();

      // update with current values
      point.x = this.x;
      point.y = this.y;
      return point
    }

    // transform point with matrix
    transform (m) {
      // Perform the matrix multiplication
      var x = m.a * this.x + m.c * this.y + m.e;
      var y = m.b * this.x + m.d * this.y + m.f;

      // Return the required point
      return new Point(x, y)
    }
  }

  Point.constructors = {
    Element: {
      // Get point
      point: function (x, y) {
        return new Point(x, y).transform(this.screenCTM().inverse())
      }
    }
  };

  let pathHandlers = {
    M: function (c, p, p0) {
      p.x = p0.x = c[0];
      p.y = p0.y = c[1];

      return ['M', p.x, p.y]
    },
    L: function (c, p) {
      p.x = c[0];
      p.y = c[1];
      return ['L', c[0], c[1]]
    },
    H: function (c, p) {
      p.x = c[0];
      return ['H', c[0]]
    },
    V: function (c, p) {
      p.y = c[0];
      return ['V', c[0]]
    },
    C: function (c, p) {
      p.x = c[4];
      p.y = c[5];
      return ['C', c[0], c[1], c[2], c[3], c[4], c[5]]
    },
    S: function (c, p) {
      p.x = c[2];
      p.y = c[3];
      return ['S', c[0], c[1], c[2], c[3]]
    },
    Q: function (c, p) {
      p.x = c[2];
      p.y = c[3];
      return ['Q', c[0], c[1], c[2], c[3]]
    },
    T: function (c, p) {
      p.x = c[0];
      p.y = c[1];
      return ['T', c[0], c[1]]
    },
    Z: function (c, p, p0) {
      p.x = p0.x;
      p.y = p0.y;
      return ['Z']
    },
    A: function (c, p) {
      p.x = c[5];
      p.y = c[6];
      return ['A', c[0], c[1], c[2], c[3], c[4], c[5], c[6]]
    }
  };

  let mlhvqtcsaz = 'mlhvqtcsaz'.split('');

  for (var i = 0, il = mlhvqtcsaz.length; i < il; ++i) {
    pathHandlers[mlhvqtcsaz[i]] = (function (i) {
      return function (c, p, p0) {
        if (i === 'H') c[0] = c[0] + p.x;
        else if (i === 'V') c[0] = c[0] + p.y;
        else if (i === 'A') {
          c[5] = c[5] + p.x;
          c[6] = c[6] + p.y;
        } else {
          for (var j = 0, jl = c.length; j < jl; ++j) {
            c[j] = c[j] + (j % 2 ? p.y : p.x);
          }
        }

        return pathHandlers[i](c, p, p0)
      }
    })(mlhvqtcsaz[i].toUpperCase());
  }

  class PathArray extends SVGArray {
    constructor (array, fallback = [['M', 0, 0]]) {
      super(array, fallback);
    }

    // Convert array to string
    toString () {
      return arrayToString(this)
    }

    toArray () {
      return this.reduce(function (prev, curr) {
        return [].concat.call(prev, curr)
      }, [])
    }

    // Move path string
    move (x, y) {
      // get bounding box of current situation
      var box = this.bbox();

      // get relative offset
      x -= box.x;
      y -= box.y;

      if (!isNaN(x) && !isNaN(y)) {
        // move every point
        for (var l, i = this.length - 1; i >= 0; i--) {
          l = this[i][0];

          if (l === 'M' || l === 'L' || l === 'T') {
            this[i][1] += x;
            this[i][2] += y;
          } else if (l === 'H') {
            this[i][1] += x;
          } else if (l === 'V') {
            this[i][1] += y;
          } else if (l === 'C' || l === 'S' || l === 'Q') {
            this[i][1] += x;
            this[i][2] += y;
            this[i][3] += x;
            this[i][4] += y;

            if (l === 'C') {
              this[i][5] += x;
              this[i][6] += y;
            }
          } else if (l === 'A') {
            this[i][6] += x;
            this[i][7] += y;
          }
        }
      }

      return this
    }

    // Resize path string
    size (width, height) {
      // get bounding box of current situation
      var box = this.bbox();
      var i, l;

      // recalculate position of all points according to new size
      for (i = this.length - 1; i >= 0; i--) {
        l = this[i][0];

        if (l === 'M' || l === 'L' || l === 'T') {
          this[i][1] = ((this[i][1] - box.x) * width) / box.width + box.x;
          this[i][2] = ((this[i][2] - box.y) * height) / box.height + box.y;
        } else if (l === 'H') {
          this[i][1] = ((this[i][1] - box.x) * width) / box.width + box.x;
        } else if (l === 'V') {
          this[i][1] = ((this[i][1] - box.y) * height) / box.height + box.y;
        } else if (l === 'C' || l === 'S' || l === 'Q') {
          this[i][1] = ((this[i][1] - box.x) * width) / box.width + box.x;
          this[i][2] = ((this[i][2] - box.y) * height) / box.height + box.y;
          this[i][3] = ((this[i][3] - box.x) * width) / box.width + box.x;
          this[i][4] = ((this[i][4] - box.y) * height) / box.height + box.y;

          if (l === 'C') {
            this[i][5] = ((this[i][5] - box.x) * width) / box.width + box.x;
            this[i][6] = ((this[i][6] - box.y) * height) / box.height + box.y;
          }
        } else if (l === 'A') {
          // resize radii
          this[i][1] = (this[i][1] * width) / box.width;
          this[i][2] = (this[i][2] * height) / box.height;

          // move position values
          this[i][6] = ((this[i][6] - box.x) * width) / box.width + box.x;
          this[i][7] = ((this[i][7] - box.y) * height) / box.height + box.y;
        }
      }

      return this
    }

    // Test if the passed path array use the same path data commands as this path array
    equalCommands (pathArray) {
      var i, il, equalCommands;

      pathArray = new PathArray(pathArray);

      equalCommands = this.length === pathArray.value.length;
      for (i = 0, il = this.length; equalCommands && i < il; i++) {
        equalCommands = this[i][0] === pathArray.value[i][0];
      }

      return equalCommands
    }

    // Make path array morphable
    morph (pathArray) {
      pathArray = new PathArray(pathArray);

      if (this.equalCommands(pathArray)) {
        this.destination = pathArray;
      } else {
        this.destination = null;
      }

      return this
    }

    // Get morphed path array at given position
    at (pos) {
      // make sure a destination is defined
      if (!this.destination) return this

      var sourceArray = this;
      var destinationArray = this.destination.value;
      var array = [];
      var pathArray = new PathArray();
      var i, il, j, jl;

      // Animate has specified in the SVG spec
      // See: https://www.w3.org/TR/SVG11/paths.html#PathElement
      for (i = 0, il = sourceArray.length; i < il; i++) {
        array[i] = [sourceArray[i][0]];
        for (j = 1, jl = sourceArray[i].length; j < jl; j++) {
          array[i][j] = sourceArray[i][j] + (destinationArray[i][j] - sourceArray[i][j]) * pos;
        }
        // For the two flags of the elliptical arc command, the SVG spec say:
        // Flags and booleans are interpolated as fractions between zero and one, with any non-zero value considered to be a value of one/true
        // Elliptical arc command as an array followed by corresponding indexes:
        // ['A', rx, ry, x-axis-rotation, large-arc-flag, sweep-flag, x, y]
        //   0    1   2        3                 4             5      6  7
        if (array[i][0] === 'A') {
          array[i][4] = +(array[i][4] !== 0);
          array[i][5] = +(array[i][5] !== 0);
        }
      }

      // Directly modify the value of a path array, this is done this way for performance
      pathArray.value = array;
      return pathArray
    }

    // Absolutize and parse path to array
    parse (array) {
      // if it's already a patharray, no need to parse it
      if (array instanceof PathArray) return array.valueOf()

      // prepare for parsing
      var s;
      var paramCnt = { 'M': 2, 'L': 2, 'H': 1, 'V': 1, 'C': 6, 'S': 4, 'Q': 4, 'T': 2, 'A': 7, 'Z': 0 };

      if (typeof array === 'string') {
        array = array
          .replace(numbersWithDots, pathRegReplace) // convert 45.123.123 to 45.123 .123
          .replace(pathLetters, ' $& ') // put some room between letters and numbers
          .replace(hyphen, '$1 -')      // add space before hyphen
          .trim()                                 // trim
          .split(delimiter);   // split into array
      } else {
        array = array.reduce(function (prev, curr) {
          return [].concat.call(prev, curr)
        }, []);
      }

      // array now is an array containing all parts of a path e.g. ['M', '0', '0', 'L', '30', '30' ...]
      var result = [];
      var p = new Point();
      var p0 = new Point();
      var index = 0;
      var len = array.length;

      do {
        // Test if we have a path letter
        if (isPathLetter.test(array[index])) {
          s = array[index];
          ++index;
        // If last letter was a move command and we got no new, it defaults to [L]ine
        } else if (s === 'M') {
          s = 'L';
        } else if (s === 'm') {
          s = 'l';
        }

        result.push(pathHandlers[s].call(null,
            array.slice(index, (index = index + paramCnt[s.toUpperCase()])).map(parseFloat),
            p, p0
          )
        );
      } while (len > index)

      return result
    }

    // Get bounding box of path
    bbox () {
      parser().path.setAttribute('d', this.toString());
      return parser.nodes.path.getBBox()
    }
  }

  class Path extends Base$1 {
    // Initialize node
    constructor (node) {
      super(nodeOrNew$1('path', node), Path);
    }

    // Get array
    array () {
      return this._array || (this._array = new PathArray(this.attr('d')))
    }

    // Plot new path
    plot (d) {
      return (d == null) ? this.array()
        : this.clear().attr('d', typeof d === 'string' ? d : (this._array = new PathArray(d)))
    }

    // Clear array cache
    clear () {
      delete this._array;
      return this
    }

    // Move by left top corner
    move (x, y) {
      return this.attr('d', this.array().move(x, y))
    }

    // Move by left top corner over x-axis
    x (x) {
      return x == null ? this.bbox().x : this.move(x, this.bbox().y)
    }

    // Move by left top corner over y-axis
    y (y) {
      return y == null ? this.bbox().y : this.move(this.bbox().x, y)
    }

    // Set element size to given width and height
    size (width, height) {
      var p = proportionalSize$1(this, width, height);
      return this.attr('d', this.array().size(p.width, p.height))
    }

    // Set width of element
    width (width) {
      return width == null ? this.bbox().width : this.size(width, this.bbox().height)
    }

    // Set height of element
    height (height) {
      return height == null ? this.bbox().height : this.size(this.bbox().width, height)
    }
  }

  // Define morphable array
  Path.prototype.MorphArray = PathArray;

  // Add parent method
  Path.constructors = {
    Container: {
      // Create a wrapped path element
      path (d) {
        // make sure plot is called as a setter
        return this.put(new Path()).plot(d || new PathArray())
      }
    }
  };

  let MorphArray =  PointArray$1;

  // Move by left top corner over x-axis
  function x$1 (x) {
    return x == null ? this.bbox().x : this.move(x, this.bbox().y)
  }

  // Move by left top corner over y-axis
  function y$1 (y) {
    return y == null ? this.bbox().y : this.move(this.bbox().x, y)
  }

  // Set width of element
  function width$1 (width) {
    let b = this.bbox();
    return width == null ? b.width : this.size(width, b.height)
  }

  // Set height of element
  function height$1 (height) {
    let b = this.bbox();
    return height == null ? b.height : this.size(b.width, height)
  }

  var pointed = /*#__PURE__*/Object.freeze({
    MorphArray: MorphArray,
    x: x$1,
    y: y$1,
    width: width$1,
    height: height$1
  });

  // Add polygon-specific functions

  // Get array
  function array () {
    return this._array || (this._array = new PointArray(this.attr('points')))
  }

  // Plot new path
  function plot (p) {
    return (p == null) ? this.array()
      : this.clear().attr('points', typeof p === 'string' ? p
      : (this._array = new PointArray(p)))
  }

  // Clear array cache
  function clear () {
    delete this._array;
    return this
  }

  // Move by left top corner
  function move (x, y) {
    return this.attr('points', this.array().move(x, y))
  }

  // Set element size to given width and height
  function size$1 (width, height) {
    let p = proportionalSize(this, width, height);
    return this.attr('points', this.array().size(p.width, p.height))
  }

  var poly = /*#__PURE__*/Object.freeze({
    array: array,
    plot: plot,
    clear: clear,
    move: move,
    size: size$1
  });

  class Polygon extends Base$1 {
    // Initialize node
    constructor (node) {
      super(nodeOrNew$1('polygon', node), Polygon);
    }
  }

  Polygon.constructors = {
    Parent: {
      // Create a wrapped polygon element
      polygon (p) {
        // make sure plot is called as a setter
        return this.put(new Polygon()).plot(p || new PointArray$1())
      }
    }
  };

  extend$1(Polygon, pointed);
  extend$1(Polygon, poly);

  class Polyline extends Base$1 {
    // Initialize node
    constructor (node) {
      super(nodeOrNew$1('polyline', node), Polyline);
    }
  }

  Polyline.constructors = {
    Parent: {
      // Create a wrapped polygon element
      polyline (p) {
        // make sure plot is called as a setter
        return this.put(new Polyline()).plot(p || new PointArray$1())
      }
    }
  };

  extend$1(Polyline, pointed);
  extend$1(Polyline, poly);

  class Rect extends Base$1 {
    // Initialize node
    constructor (node) {
      super(nodeOrNew$1('rect', node), Rect);
    }
  }

  Rect.constructors = {
    Container: {
      // Create a rect element
      rect (width, height) {
        return this.put(new Rect()).size(width, height)
      }
    }
  };

  class Symbol extends Base$1 {
    // Initialize node
    constructor (node) {
      super(nodeOrNew$1('symbol', node), Symbol);
    }
  }

  Symbol.constructors = {
    Container: {
      symbol () {
        return this.put(new Symbol())
      }
    }
  };

  function noop () {}

  // Default animation values
  let timeline = {
    duration: 400,
    ease: '>',
    delay: 0
  };

  // Default attribute values
  let attrs = {

    // fill and stroke
    'fill-opacity': 1,
    'stroke-opacity': 1,
    'stroke-width': 0,
    'stroke-linejoin': 'miter',
    'stroke-linecap': 'butt',
    fill: '#000000',
    stroke: '#000000',
    opacity: 1,

    // position
    x: 0,
    y: 0,
    cx: 0,
    cy: 0,

    // size
    width: 0,
    height: 0,

    // radius
    r: 0,
    rx: 0,
    ry: 0,

    // gradient
    offset: 0,
    'stop-opacity': 1,
    'stop-color': '#000000',

    // text
    'font-size': 16,
    'font-family': 'Helvetica, Arial, sans-serif',
    'text-anchor': 'start'
  };

  // Create plain text node
  function plain (text) {
    // clear if build mode is disabled
    if (this._build === false) {
      this.clear();
    }

    // create text node
    this.node.appendChild(document.createTextNode(text));

    return this
  }

  // FIXME: Does this also work for textpath?
  // Get length of text element
  function length () {
    return this.node.getComputedTextLength()
  }

  var textable = /*#__PURE__*/Object.freeze({
    plain: plain,
    length: length
  });

  class Text$1 extends Base$1 {
    // Initialize node
    constructor (node) {
      super(nodeOrNew$1('text', node), Text$1);

      this.dom.leading = new SVGNumber(1.3);    // store leading value for rebuilding
      this._rebuild = true;                      // enable automatic updating of dy values
      this._build = false;                       // disable build mode for adding multiple lines

      // set default font
      this.attr('font-family', attrs['font-family']);
    }

    // Move over x-axis
    x (x) {
      // act as getter
      if (x == null) {
        return this.attr('x')
      }

      return this.attr('x', x)
    }

    // Move over y-axis
    y (y) {
      var oy = this.attr('y');
      var o = typeof oy === 'number' ? oy - this.bbox().y : 0;

      // act as getter
      if (y == null) {
        return typeof oy === 'number' ? oy - o : oy
      }

      return this.attr('y', typeof y === 'number' ? y + o : y)
    }

    // Move center over x-axis
    cx (x) {
      return x == null ? this.bbox().cx : this.x(x - this.bbox().width / 2)
    }

    // Move center over y-axis
    cy (y) {
      return y == null ? this.bbox().cy : this.y(y - this.bbox().height / 2)
    }

    // Set the text content
    text (text) {
      // act as getter
      if (text === undefined) {
        var children = this.node.childNodes;
        var firstLine = 0;
        text = '';

        for (var i = 0, len = children.length; i < len; ++i) {
          // skip textPaths - they are no lines
          if (children[i].nodeName === 'textPath') {
            if (i === 0) firstLine = 1;
            continue
          }

          // add newline if its not the first child and newLined is set to true
          if (i !== firstLine && children[i].nodeType !== 3 && adopt(children[i]).dom.newLined === true) {
            text += '\n';
          }

          // add content of this node
          text += children[i].textContent;
        }

        return text
      }

      // remove existing content
      this.clear().build(true);

      if (typeof text === 'function') {
        // call block
        text.call(this, this);
      } else {
        // store text and make sure text is not blank
        text = text.split('\n');

        // build new lines
        for (var j = 0, jl = text.length; j < jl; j++) {
          this.tspan(text[j]).newLine();
        }
      }

      // disable build mode and rebuild lines
      return this.build(false).rebuild()
    }

    // Set / get leading
    leading (value) {
      // act as getter
      if (value == null) {
        return this.dom.leading
      }

      // act as setter
      this.dom.leading = new SVGNumber(value);

      return this.rebuild()
    }

    // Rebuild appearance type
    rebuild (rebuild) {
      // store new rebuild flag if given
      if (typeof rebuild === 'boolean') {
        this._rebuild = rebuild;
      }

      // define position of all lines
      if (this._rebuild) {
        var self = this;
        var blankLineOffset = 0;
        var dy = this.dom.leading * new SVGNumber(this.attr('font-size'));

        this.each(function () {
          if (this.dom.newLined) {
            this.attr('x', self.attr('x'));

            if (this.text() === '\n') {
              blankLineOffset += dy;
            } else {
              this.attr('dy', dy + blankLineOffset);
              blankLineOffset = 0;
            }
          }
        });

        this.fire('rebuild');
      }

      return this
    }

    // Enable / disable build mode
    build (build) {
      this._build = !!build;
      return this
    }

    // overwrite method from parent to set data properly
    setData (o) {
      this.dom = o;
      this.dom.leading = new SVGNumber(o.leading || 1.3);
      return this
    }
  }

  extend$1(Text$1, textable);

  Text$1.constructors = {
    Container: {
      // Create text element
      text (text) {
        return this.put(new Text$1()).text(text)
      },

      // Create plain text element
      plain (text) {
        return this.put(new Text$1()).plain(text)
      }
    }
  };

  class TextPath extends Text$1 {
    // Initialize node
    constructor (node) {
      super(nodeOrNew$1('textPath', node));
    }

    // return the array of the path track element
    array () {
      var track = this.track();

      return track ? track.array() : null
    }

    // Plot path if any
    plot (d) {
      var track = this.track();
      var pathArray = null;

      if (track) {
        pathArray = track.plot(d);
      }

      return (d == null) ? pathArray : this
    }

    // Get the path element
    track () {
      return this.reference('href')
    }
  }

  TextPath.constructors = {
    Container: {
      textPath (text, path) {
        return this.defs().path(path).text(text).addTo(this)
      }
    },
    Text: {
        // Create path for text to run on
      path: function (track) {
        var path = new TextPath();

        // if d is a path, reuse it
        if (!(track instanceof Path)) {
          // create path element
          track = this.doc().defs().path(track);
        }

        // link textPath to path and add content
        path.attr('href', '#' + track, xlink);

        // add textPath element as child node and return textPath
        return this.put(path)
      },

      // FIXME: make this plural?
      // Get the textPath children
      textPath: function () {
        return this.select('textPath')
      }
    },
    Path: {
      // creates a textPath from this path
      text: function (text) {
        if (text instanceof Text$1) {
          var txt = text.text();
          return text.clear().path(this).text(txt)
        }
        return this.parent().put(new Text$1()).path(this).text(text)
      }
      // FIXME: Maybe add `targets` to get all textPaths associated with this path
    }
  };

  TextPath.prototype.MorphArray = PathArray;

  class Use extends Base$1 {
    constructor (node) {
      super(nodeOrNew('use', node), Use);
    }

    // Use element as a reference
    element (element, file) {
      // Set lined element
      return this.attr('href', (file || '') + '#' + element, xlink)
    }
  }

  Use.constructors = {
    Container: {
      // Create a use element
      use: function (element, file) {
        return this.put(new Use()).element(element, file)
      }
    }
  };



  var elements = /*#__PURE__*/Object.freeze({
    Bare: Bare,
    Circle: Circle,
    ClipPath: ClipPath,
    Defs: Defs,
    Doc: Doc$1,
    Ellipse: Ellipse,
    Gradient: Gradient,
    G: G,
    HtmlNode: HtmlNode,
    A: A,
    Image: Image,
    Line: Line,
    Marker: Marker,
    Mask: Mask,
    Path: Path,
    Pattern: Pattern,
    Polygon: Polygon,
    Polyline: Polyline,
    Rect: Rect,
    Stop: Stop,
    Symbol: Symbol,
    Text: Text$1,
    TextPath: TextPath,
    Use: Use
  });

  function makeInstance (element) {
    if (element instanceof Base$1) return element

    if (typeof element === 'object') {
      return adopt$1(element)
    }

    if (element == null) {
      return new Doc()
    }

    if (typeof element === 'string' && element.charAt(0) !== '<') {
      return adopt$1(document.querySelector(element))
    }

    var node = makeNode('svg');
    node.innerHTML = element;

    element = adopt$1(node.firstElementChild);

    return element
  }

  // Adopt existing svg elements
  function adopt$1 (node) {
    // check for presence of node
    if (!node) return null

    // make sure a node isn't already adopted
    if (node.instance instanceof Element) return node.instance

    if (!(node instanceof window.SVGElement)) {
      return new HtmlNode(node)
    }

    // initialize variables
    var element;

    // adopt with element-specific settings
    if (node.nodeName === 'svg') {
      element = new Doc$1(node);
    } else if (node.nodeName === 'linearGradient' || node.nodeName === 'radialGradient') {
      element = new Gradient(node);
    } else if (elements[capitalize(node.nodeName)]) {
      element = new elements[capitalize(node.nodeName)](node);
    } else {
      element = new Bare(node);
    }

    return element
  }

  // Element id sequence
  let did = 1000;

  // Get next named element id
  function eid (name) {
    return 'Svgjs' + capitalize(name) + (did++)
  }

  // Deep new id assignment
  function assignNewId (node) {
    // do the same for SVG child nodes as well
    for (var i = node.children.length - 1; i >= 0; i--) {
      assignNewId(node.children[i]);
    }

    if (node.id) {
      return adopt$1(node).id(eid(node.nodeName))
    }

    return adopt$1(node)
  }

  var adopter = /*#__PURE__*/Object.freeze({
    makeInstance: makeInstance,
    adopt: adopt$1,
    eid: eid,
    assignNewId: assignNewId
  });

  class Queue {
    constructor () {
      this._first = null;
      this._last = null;
    }

    push (value) {
      // An item stores an id and the provided value
      var item = value.next ? value : { value: value, next: null, prev: null };

      // Deal with the queue being empty or populated
      if (this._last) {
        item.prev = this._last;
        this._last.next = item;
        this._last = item;
      } else {
        this._last = item;
        this._first = item;
      }

      // Update the length and return the current item
      return item
    }

    shift () {
      // Check if we have a value
      var remove = this._first;
      if (!remove) return null

      // If we do, remove it and relink things
      this._first = remove.next;
      if (this._first) this._first.prev = null;
      this._last = this._first ? this._last : null;
      return remove.value
    }

    // Shows us the first item in the list
    first () {
      return this._first && this._first.value
    }

    // Shows us the last item in the list
    last () {
      return this._last && this._last.value
    }

    // Removes the item that was returned from the push
    remove (item) {
      // Relink the previous item
      if (item.prev) item.prev.next = item.next;
      if (item.next) item.next.prev = item.prev;
      if (item === this._last) this._last = item.prev;
      if (item === this._first) this._first = item.next;

      // Invalidate item
      item.prev = null;
      item.next = null;
    }
  }

  const Animator = {
    nextDraw: null,
    frames: new Queue(),
    timeouts: new Queue(),
    timer: window.performance || window.Date,
    transforms: [],

    frame (fn) {
      // Store the node
      var node = Animator.frames.push({ run: fn });

      // Request an animation frame if we don't have one
      if (Animator.nextDraw === null) {
        Animator.nextDraw = window.requestAnimationFrame(Animator._draw);
      }

      // Return the node so we can remove it easily
      return node
    },

    transform_frame (fn, id) {
      Animator.transforms[id] = fn;
    },

    timeout (fn, delay) {
      delay = delay || 0;

      // Work out when the event should fire
      var time = Animator.timer.now() + delay;

      // Add the timeout to the end of the queue
      var node = Animator.timeouts.push({ run: fn, time: time });

      // Request another animation frame if we need one
      if (Animator.nextDraw === null) {
        Animator.nextDraw = window.requestAnimationFrame(Animator._draw);
      }

      return node
    },

    cancelFrame (node) {
      Animator.frames.remove(node);
    },

    clearTimeout (node) {
      Animator.timeouts.remove(node);
    },

    _draw (now) {
      // Run all the timeouts we can run, if they are not ready yet, add them
      // to the end of the queue immediately! (bad timeouts!!! [sarcasm])
      var nextTimeout = null;
      var lastTimeout = Animator.timeouts.last();
      while ((nextTimeout = Animator.timeouts.shift())) {
        // Run the timeout if its time, or push it to the end
        if (now >= nextTimeout.time) {
          nextTimeout.run();
        } else {
          Animator.timeouts.push(nextTimeout);
        }

        // If we hit the last item, we should stop shifting out more items
        if (nextTimeout === lastTimeout) break
      }

      // Run all of the animation frames
      var nextFrame = null;
      var lastFrame = Animator.frames.last();
      while ((nextFrame !== lastFrame) && (nextFrame = Animator.frames.shift())) {
        nextFrame.run();
      }

      Animator.transforms.forEach(function (el) { el(); });

      // If we have remaining timeouts or frames, draw until we don't anymore
      Animator.nextDraw = Animator.timeouts.first() || Animator.frames.first()
          ? window.requestAnimationFrame(Animator._draw)
          : null;
    }
  };

  class Tspan extends Base$1 {
    // Initialize node
    constructor (node) {
      super(nodeOrNew$1('tspan', node), Tspan);
    }

    // Set text content
    text (text) {
      if (text == null) return this.node.textContent + (this.dom.newLined ? '\n' : '')

      typeof text === 'function' ? text.call(this, this) : this.plain(text);

      return this
    }

    // Shortcut dx
    dx (dx) {
      return this.attr('dx', dx)
    }

    // Shortcut dy
    dy (dy) {
      return this.attr('dy', dy)
    }

    // Create new line
    newLine () {
      // fetch text parent
      var t = this.parent(Text);

      // mark new line
      this.dom.newLined = true;

      // apply new position
      return this.dy(t.dom.leading * t.attr('font-size')).attr('x', t.x())
    }
  }

  extend$1(Tspan, textable);

  Tspan.constructors = {
    Tspan: {
      tspan (text) {
        var tspan = new Tspan();

        // clear if build mode is disabled
        if (!this._build) {
          this.clear();
        }

        // add new tspan
        this.node.appendChild(tspan.node);

        return tspan.text(text)
      }
    }
  };

  // Map function
  function map (array, block) {
    var i;
    var il = array.length;
    var result = [];

    for (i = 0; i < il; i++) {
      result.push(block(array[i]));
    }

    return result
  }

  // Degrees to radians
  function radians (d) {
    return d % 360 * Math.PI / 180
  }

  class Matrix {
    constructor (...args) {
      this.init(...args);
    }

    // Initialize
    init (source) {
      var base = arrayToMatrix([1, 0, 0, 1, 0, 0]);

      // ensure source as object
      source = source instanceof Base$1 && source.is('Element') ? source.matrixify()
        : typeof source === 'string' ? arrayToMatrix(source.split(delimiter).map(parseFloat))
        : Array.isArray(source) ? arrayToMatrix(source)
        : (typeof source === 'object' && isMatrixLike(source)) ? source
        : (typeof source === 'object') ? new Matrix().transform(source)
        : arguments.length === 6 ? arrayToMatrix([].slice.call(arguments))
        : base;

      // Merge the source matrix with the base matrix
      this.a = source.a != null ? source.a : base.a;
      this.b = source.b != null ? source.b : base.b;
      this.c = source.c != null ? source.c : base.c;
      this.d = source.d != null ? source.d : base.d;
      this.e = source.e != null ? source.e : base.e;
      this.f = source.f != null ? source.f : base.f;
    }


    // Clones this matrix
    clone () {
      return new Matrix(this)
    }

    // Transform a matrix into another matrix by manipulating the space
    transform (o) {
      // Check if o is a matrix and then left multiply it directly
      if (isMatrixLike(o)) {
        var matrix = new Matrix(o);
        return matrix.multiplyO(this)
      }

      // Get the proposed transformations and the current transformations
      var t = Matrix.formatTransforms(o);
      var current = this;
      let { x: ox, y: oy } = new Point(t.ox, t.oy).transform(current);

      // Construct the resulting matrix
      var transformer = new Matrix()
        .translateO(t.rx, t.ry)
        .lmultiplyO(current)
        .translateO(-ox, -oy)
        .scaleO(t.scaleX, t.scaleY)
        .skewO(t.skewX, t.skewY)
        .shearO(t.shear)
        .rotateO(t.theta)
        .translateO(ox, oy);

      // If we want the origin at a particular place, we force it there
      if (isFinite(t.px) || isFinite(t.py)) {
        const origin = new Point(ox, oy).transform(transformer);
        // TODO: Replace t.px with isFinite(t.px)
        const dx = t.px ? t.px - origin.x : 0;
        const dy = t.py ? t.py - origin.y : 0;
        transformer.translateO(dx, dy);
      }

      // Translate now after positioning
      transformer.translateO(t.tx, t.ty);
      return transformer
    }

    // Applies a matrix defined by its affine parameters
    compose (o) {
      if (o.origin) {
        o.originX = o.origin[0];
        o.originY = o.origin[1];
      }
      // Get the parameters
      var ox = o.originX || 0;
      var oy = o.originY || 0;
      var sx = o.scaleX || 1;
      var sy = o.scaleY || 1;
      var lam = o.shear || 0;
      var theta = o.rotate || 0;
      var tx = o.translateX || 0;
      var ty = o.translateY || 0;

      // Apply the standard matrix
      var result = new Matrix()
        .translateO(-ox, -oy)
        .scaleO(sx, sy)
        .shearO(lam)
        .rotateO(theta)
        .translateO(tx, ty)
        .lmultiplyO(this)
        .translateO(ox, oy);
      return result
    }

    // Decomposes this matrix into its affine parameters
    decompose (cx = 0, cy = 0) {
      // Get the parameters from the matrix
      var a = this.a;
      var b = this.b;
      var c = this.c;
      var d = this.d;
      var e = this.e;
      var f = this.f;

      // Figure out if the winding direction is clockwise or counterclockwise
      var determinant = a * d - b * c;
      var ccw = determinant > 0 ? 1 : -1;

      // Since we only shear in x, we can use the x basis to get the x scale
      // and the rotation of the resulting matrix
      var sx = ccw * Math.sqrt(a * a + b * b);
      var thetaRad = Math.atan2(ccw * b, ccw * a);
      var theta = 180 / Math.PI * thetaRad;
      var ct = Math.cos(thetaRad);
      var st = Math.sin(thetaRad);

      // We can then solve the y basis vector simultaneously to get the other
      // two affine parameters directly from these parameters
      var lam = (a * c + b * d) / determinant;
      var sy = ((c * sx) / (lam * a - b)) || ((d * sx) / (lam * b + a));

      // Use the translations
      let tx = e - cx + cx * ct * sx + cy * (lam * ct * sx - st * sy);
      let ty = f - cy + cx * st * sx + cy * (lam * st * sx + ct * sy);

      // Construct the decomposition and return it
      return {
        // Return the affine parameters
        scaleX: sx,
        scaleY: sy,
        shear: lam,
        rotate: theta,
        translateX: tx,
        translateY: ty,
        originX: cx,
        originY: cy,

        // Return the matrix parameters
        a: this.a,
        b: this.b,
        c: this.c,
        d: this.d,
        e: this.e,
        f: this.f
      }
    }

    // Left multiplies by the given matrix
    multiply (matrix) {
      return this.clone().multiplyO(matrix)
    }

    multiplyO (matrix) {
      // Get the matrices
      var l = this;
      var r = matrix instanceof Matrix
        ? matrix
        : new Matrix(matrix);

      return Matrix.matrixMultiply(l, r, this)
    }

    lmultiply (matrix) {
      return this.clone().lmultiplyO(matrix)
    }

    lmultiplyO (matrix) {
      var r = this;
      var l = matrix instanceof Matrix
        ? matrix
        : new Matrix(matrix);

      return Matrix.matrixMultiply(l, r, this)
    }

    // Inverses matrix
    inverseO () {
      // Get the current parameters out of the matrix
      var a = this.a;
      var b = this.b;
      var c = this.c;
      var d = this.d;
      var e = this.e;
      var f = this.f;

      // Invert the 2x2 matrix in the top left
      var det = a * d - b * c;
      if (!det) throw new Error('Cannot invert ' + this)

      // Calculate the top 2x2 matrix
      var na = d / det;
      var nb = -b / det;
      var nc = -c / det;
      var nd = a / det;

      // Apply the inverted matrix to the top right
      var ne = -(na * e + nc * f);
      var nf = -(nb * e + nd * f);

      // Construct the inverted matrix
      this.a = na;
      this.b = nb;
      this.c = nc;
      this.d = nd;
      this.e = ne;
      this.f = nf;

      return this
    }

    inverse () {
      return this.clone().inverseO()
    }

    // Translate matrix
    translate (x, y) {
      return this.clone().translateO(x, y)
    }

    translateO (x, y) {
      this.e += x || 0;
      this.f += y || 0;
      return this
    }

    // Scale matrix
    scale (x, y, cx, cy) {
      return this.clone().scaleO(...arguments)
    }

    scaleO (x, y = x, cx = 0, cy = 0) {
      // Support uniform scaling
      if (arguments.length === 3) {
        cy = cx;
        cx = y;
        y = x;
      }

      let {a, b, c, d, e, f} = this;

      this.a = a * x;
      this.b = b * y;
      this.c = c * x;
      this.d = d * y;
      this.e = e * x - cx * x + cx;
      this.f = f * y - cy * y + cy;

      return this
    }

    // Rotate matrix
    rotate (r, cx, cy) {
      return this.clone().rotateO(r, cx, cy)
    }

    rotateO (r, cx = 0, cy = 0) {
      // Convert degrees to radians
      r = radians(r);

      let cos = Math.cos(r);
      let sin = Math.sin(r);

      let {a, b, c, d, e, f} = this;

      this.a = a * cos - b * sin;
      this.b = b * cos + a * sin;
      this.c = c * cos - d * sin;
      this.d = d * cos + c * sin;
      this.e = e * cos - f * sin + cy * sin - cx * cos + cx;
      this.f = f * cos + e * sin - cx * sin - cy * cos + cy;

      return this
    }

    // Flip matrix on x or y, at a given offset
    flip (axis, around) {
      return this.clone().flipO(axis, around)
    }

    flipO (axis, around) {
      return axis === 'x' ? this.scaleO(-1, 1, around, 0)
        : axis === 'y' ? this.scaleO(1, -1, 0, around)
        : this.scaleO(-1, -1, axis, around || axis) // Define an x, y flip point
    }

    // Shear matrix
    shear (a, cx, cy) {
      return this.clone().shearO(a, cx, cy)
    }

    shearO (lx, cx = 0, cy = 0) {
      let {a, b, c, d, e, f} = this;

      this.a = a + b * lx;
      this.c = c + d * lx;
      this.e = e + f * lx - cy * lx;

      return this
    }

    // Skew Matrix
    skew (x, y, cx, cy) {
      return this.clone().skewO(...arguments)
    }

    skewO (x, y = x, cx = 0, cy = 0) {
      // support uniformal skew
      if (arguments.length === 3) {
        cy = cx;
        cx = y;
        y = x;
      }

      // Convert degrees to radians
      x = radians(x);
      y = radians(y);

      let lx = Math.tan(x);
      let ly = Math.tan(y);

      let {a, b, c, d, e, f} = this;

      this.a = a + b * lx;
      this.b = b + a * ly;
      this.c = c + d * lx;
      this.d = d + c * ly;
      this.e = e + f * lx - cy * lx;
      this.f = f + e * ly - cx * ly;

      return this
    }

    // SkewX
    skewX (x, cx, cy) {
      return this.skew(x, 0, cx, cy)
    }

    skewXO (x, cx, cy) {
      return this.skewO(x, 0, cx, cy)
    }

    // SkewY
    skewY (y, cx, cy) {
      return this.skew(0, y, cx, cy)
    }

    skewYO (y, cx, cy) {
      return this.skewO(0, y, cx, cy)
    }

    // Transform around a center point
    aroundO (cx, cy, matrix) {
      var dx = cx || 0;
      var dy = cy || 0;
      return this.translateO(-dx, -dy).lmultiplyO(matrix).translateO(dx, dy)
    }

    around (cx, cy, matrix) {
      return this.clone().aroundO(cx, cy, matrix)
    }

    // Convert to native SVGMatrix
    native () {
      // create new matrix
      var matrix = parser().node.createSVGMatrix();

      // update with current values
      for (var i = abcdef.length - 1; i >= 0; i--) {
        matrix[abcdef[i]] = this[abcdef[i]];
      }

      return matrix
    }

    // Check if two matrices are equal
    equals (other) {
      var comp = new Matrix(other);
      return closeEnough(this.a, comp.a) && closeEnough(this.b, comp.b) &&
        closeEnough(this.c, comp.c) && closeEnough(this.d, comp.d) &&
        closeEnough(this.e, comp.e) && closeEnough(this.f, comp.f)
    }

    // Convert matrix to string
    toString () {
      return 'matrix(' + this.a + ',' + this.b + ',' + this.c + ',' + this.d + ',' + this.e + ',' + this.f + ')'
    }

    toArray () {
      return [this.a, this.b, this.c, this.d, this.e, this.f]
    }

    valueOf () {
      return {
        a: this.a,
        b: this.b,
        c: this.c,
        d: this.d,
        e: this.e,
        f: this.f
      }
    }


    // TODO: Refactor this to a static function of matrix.js
    static formatTransforms (o) {
      // Get all of the parameters required to form the matrix
      var flipBoth = o.flip === 'both' || o.flip === true;
      var flipX = o.flip && (flipBoth || o.flip === 'x') ? -1 : 1;
      var flipY = o.flip && (flipBoth || o.flip === 'y') ? -1 : 1;
      var skewX = o.skew && o.skew.length ? o.skew[0]
        : isFinite(o.skew) ? o.skew
        : isFinite(o.skewX) ? o.skewX
        : 0;
      var skewY = o.skew && o.skew.length ? o.skew[1]
        : isFinite(o.skew) ? o.skew
        : isFinite(o.skewY) ? o.skewY
        : 0;
      var scaleX = o.scale && o.scale.length ? o.scale[0] * flipX
        : isFinite(o.scale) ? o.scale * flipX
        : isFinite(o.scaleX) ? o.scaleX * flipX
        : flipX;
      var scaleY = o.scale && o.scale.length ? o.scale[1] * flipY
        : isFinite(o.scale) ? o.scale * flipY
        : isFinite(o.scaleY) ? o.scaleY * flipY
        : flipY;
      var shear = o.shear || 0;
      var theta = o.rotate || o.theta || 0;
      var origin = new Point(o.origin || o.around || o.ox || o.originX, o.oy || o.originY);
      var ox = origin.x;
      var oy = origin.y;
      var position = new Point(o.position || o.px || o.positionX, o.py || o.positionY);
      var px = position.x;
      var py = position.y;
      var translate = new Point(o.translate || o.tx || o.translateX, o.ty || o.translateY);
      var tx = translate.x;
      var ty = translate.y;
      var relative = new Point(o.relative || o.rx || o.relativeX, o.ry || o.relativeY);
      var rx = relative.x;
      var ry = relative.y;

      // Populate all of the values
      return {
        scaleX, scaleY, skewX, skewY, shear, theta, rx, ry, tx, ty, ox, oy, px, py
      }
    }

    // left matrix, right matrix, target matrix which is overwritten
    static matrixMultiply (l, r, o) {
      // Work out the product directly
      var a = l.a * r.a + l.c * r.b;
      var b = l.b * r.a + l.d * r.b;
      var c = l.a * r.c + l.c * r.d;
      var d = l.b * r.c + l.d * r.d;
      var e = l.e + l.a * r.e + l.c * r.f;
      var f = l.f + l.b * r.e + l.d * r.f;

      // make sure to use local variables because l/r and o could be the same
      o.a = a;
      o.b = b;
      o.c = c;
      o.d = d;
      o.e = e;
      o.f = f;

      return o
    }
  }

  Matrix.constructors = {
    Element: {
      // Get current matrix
      ctm () {
        return new Matrix(this.node.getCTM())
      },

      // Get current screen matrix
      screenCTM () {
        /* https://bugzilla.mozilla.org/show_bug.cgi?id=1344537
           This is needed because FF does not return the transformation matrix
           for the inner coordinate system when getScreenCTM() is called on nested svgs.
           However all other Browsers do that */
        if (this instanceof Doc && !this.isRoot()) {
          var rect = this.rect(1, 1);
          var m = rect.node.getScreenCTM();
          rect.remove();
          return new Matrix(m)
        }
        return new Matrix(this.node.getScreenCTM())
      }
    }
  };

  //import {Parent, Doc, Symbol, Image, Pattern, Marker, Point} from './classes.js'

  class Box$1 {
    constructor (...args) {
      this.init(...args);
    }

    init (source) {
      var base = [0, 0, 0, 0];
      source = typeof source === 'string' ? source.split(delimiter).map(parseFloat)
        : Array.isArray(source) ? source
        : typeof source === 'object' ? [source.left != null ? source.left
        : source.x, source.top != null ? source.top : source.y, source.width, source.height]
        : arguments.length === 4 ? [].slice.call(arguments)
        : base;

      this.x = source[0];
      this.y = source[1];
      this.width = source[2];
      this.height = source[3];

      // add center, right, bottom...
      fullBox(this);
    }

    // Merge rect box with another, return a new instance
    merge (box) {
      let x = Math.min(this.x, box.x);
      let y = Math.min(this.y, box.y);
      let width = Math.max(this.x + this.width, box.x + box.width) - x;
      let height = Math.max(this.y + this.height, box.y + box.height) - y;

      return new Box$1(x, y, width, height)
    }

    transform (m) {
      let xMin = Infinity;
      let xMax = -Infinity;
      let yMin = Infinity;
      let yMax = -Infinity;

      let pts = [
        new Point(this.x, this.y),
        new Point(this.x2, this.y),
        new Point(this.x, this.y2),
        new Point(this.x2, this.y2)
      ];

      pts.forEach(function (p) {
        p = p.transform(m);
        xMin = Math.min(xMin, p.x);
        xMax = Math.max(xMax, p.x);
        yMin = Math.min(yMin, p.y);
        yMax = Math.max(yMax, p.y);
      });

      return new Box$1(
        xMin, yMin,
        xMax - xMin,
        yMax - yMin
      )
    }

    addOffset () {
      // offset by window scroll position, because getBoundingClientRect changes when window is scrolled
      this.x += window.pageXOffset;
      this.y += window.pageYOffset;
      return this
    }

    toString () {
      return this.x + ' ' + this.y + ' ' + this.width + ' ' + this.height
    }

    toArray () {
      return [this.x, this.y, this.width, this.height]
    }
  }

  function getBox(cb) {
    let box;

    try {
      box = cb(this.node);

      if (isNulledBox(box) && !domContains(this.node)) {
        throw new Error('Element not in the dom')
      }
    } catch (e) {
      try {
        let clone = this.clone(parser().svg).show();
        box = cb(clone.node);
        clone.remove();
      } catch (e) {
        throw (e)
        console.warn('Getting a bounding box of this element is not possible');
      }
    }
    return box
  }

  Box$1.constructors = {
    Element: {
      // Get bounding box
      bbox () {
        return new Box$1(getBox.call(this, (node) => node.getBBox()))
      },

      rbox (el) {
        let box = new Box$1(getBox.call(this, (node) => node.getBoundingClientRect()));
        if (el) return box.transform(el.screenCTM().inverse())
        return box.addOffset()
      }
    },
    viewbox: function (x, y, width, height) {
      // act as getter
      if (x == null) return new Box$1(this.attr('viewBox'))

      // act as setter
      return this.attr('viewBox', new Box$1(x, y, width, height))
    }
  };

  /* globals fullHex, compToHex */

  class Color {
    constructor (...args) {
      this.init(...args);
    }

    init (color, g, b) {
      let match;

      // initialize defaults
      this.r = 0;
      this.g = 0;
      this.b = 0;

      if (!color) return

      // parse color
      if (typeof color === 'string') {
        if (isRgb.test(color)) {
          // get rgb values
          match = rgb.exec(color.replace(whitespace, ''));

          // parse numeric values
          this.r = parseInt(match[1]);
          this.g = parseInt(match[2]);
          this.b = parseInt(match[3]);
        } else if (isHex.test(color)) {
          // get hex values
          match = hex.exec(fullHex(color));

          // parse numeric values
          this.r = parseInt(match[1], 16);
          this.g = parseInt(match[2], 16);
          this.b = parseInt(match[3], 16);
        }
      } else if (Array.isArray(color)) {
        this.r = color[0];
        this.g = color[1];
        this.b = color[2];
      } else if (typeof color === 'object') {
        this.r = color.r;
        this.g = color.g;
        this.b = color.b;
      } else if (arguments.length === 3) {
        this.r = color;
        this.g = g;
        this.b = b;
      }
    }

    // Default to hex conversion
    toString () {
      return this.toHex()
    }

    toArray () {
      return [this.r, this.g, this.b]
    }

    // Build hex value
    toHex () {
      return '#' +
        compToHex(Math.round(this.r)) +
        compToHex(Math.round(this.g)) +
        compToHex(Math.round(this.b))
    }

    // Build rgb value
    toRgb () {
      return 'rgb(' + [this.r, this.g, this.b].join() + ')'
    }

    // Calculate true brightness
    brightness () {
      return (this.r / 255 * 0.30) +
        (this.g / 255 * 0.59) +
        (this.b / 255 * 0.11)
    }

    // Testers

    // Test if given value is a color string
    static test (color) {
      color += '';
      return isHex.test(color) || isRgb.test(color)
    }

    // Test if given value is a rgb object
    static isRgb (color) {
      return color && typeof color.r === 'number' &&
        typeof color.g === 'number' &&
        typeof color.b === 'number'
    }

    // Test if given value is a color
    static isColor (color) {
      return this.isRgb(color) || this.test(color)
    }
  }

  /***
  Base Class
  ==========
  The base stepper class that will be
  ***/

  function makeSetterGetter (k, f) {
    return function (v) {
      if (v == null) return this[v]
      this[k] = v;
      if (f) f.call(this);
      return this
    }
  }

  let easing = {
    '-': function (pos) { return pos },
    '<>': function (pos) { return -Math.cos(pos * Math.PI) / 2 + 0.5 },
    '>': function (pos) { return Math.sin(pos * Math.PI / 2) },
    '<': function (pos) { return -Math.cos(pos * Math.PI / 2) + 1 },
    bezier: function (t0, x0, t1, x1) {
      return function (t) {
        // TODO: FINISH
      }
    }
  };


  class Stepper {
    done () { return false }
  }

  /***
  Easing Functions
  ================
  ***/

  class Ease extends Stepper {
    constructor (fn) {
      super();
      this.ease = easing[fn || timeline.ease] || fn;
    }

    step (from, to, pos) {
      if (typeof from !== 'number') {
        return pos < 1 ? from : to
      }
      return from + (to - from) * this.ease(pos)
    }
  }


  /***
  Controller Types
  ================
  ***/

  class Controller extends Stepper {
    constructor (fn) {
      super();
      this.stepper = fn;
    }

    step (current, target, dt, c) {
      return this.stepper(current, target, dt, c)
    }

    done (c) {
      return c.done
    }
  }

  function recalculate () {
    // Apply the default parameters
    var duration = (this._duration || 500) / 1000;
    var overshoot = this._overshoot || 0;

    // Calculate the PID natural response
    var eps = 1e-10;
    var pi = Math.PI;
    var os = Math.log(overshoot / 100 + eps);
    var zeta = -os / Math.sqrt(pi * pi + os * os);
    var wn = 3.9 / (zeta * duration);

    // Calculate the Spring values
    this.d = 2 * zeta * wn;
    this.k = wn * wn;
  }

  class Spring extends Controller {
    constructor (duration, overshoot) {
      super();
      this.duration(duration || 500)
        .overshoot(overshoot || 0);
    }

    step (current, target, dt, c) {
      if (typeof current === 'string') return current
      c.done = dt === Infinity;
      if (dt === Infinity) return target
      if (dt === 0) return current

      if (dt > 100) dt = 16;

      dt /= 1000;

      // Get the previous velocity
      var velocity = c.velocity || 0;

      // Apply the control to get the new position and store it
      var acceleration = -this.d * velocity - this.k * (current - target);
      var newPosition = current +
        velocity * dt +
        acceleration * dt * dt / 2;

      // Store the velocity
      c.velocity = velocity + acceleration * dt;

      // Figure out if we have converged, and if so, pass the value
      c.done = Math.abs(target - newPosition) + Math.abs(velocity) < 0.002;
      return c.done ? target : newPosition
    }
  }

  extend$1(Spring, {
    duration: makeSetterGetter('_duration', recalculate),
    overshoot: makeSetterGetter('_overshoot', recalculate)
  });

  class PID extends Controller {
    constructor (p, i, d, windup) {
      super();

      p = p == null ? 0.1 : p;
      i = i == null ? 0.01 : i;
      d = d == null ? 0 : d;
      windup = windup == null ? 1000 : windup;
      this.p(p).i(i).d(d).windup(windup);
    }

    step (current, target, dt, c) {
      if (typeof current === 'string') return current
      c.done = dt === Infinity;

      if (dt === Infinity) return target
      if (dt === 0) return current

      var p = target - current;
      var i = (c.integral || 0) + p * dt;
      var d = (p - (c.error || 0)) / dt;
      var windup = this.windup;

      // antiwindup
      if (windup !== false) {
        i = Math.max(-windup, Math.min(i, windup));
      }

      c.error = p;
      c.integral = i;

      c.done = Math.abs(p) < 0.001;

      return c.done ? target : current + (this.P * p + this.I * i + this.D * d)
    }
  }

  extend$1(PID, {
    windup: makeSetterGetter('windup'),
    p: makeSetterGetter('P'),
    i: makeSetterGetter('I'),
    d: makeSetterGetter('D')
  });

  class Morphable {
    constructor (stepper) {
      // FIXME: the default stepper does not know about easing
      this._stepper = stepper || new Ease('-');

      this._from = null;
      this._to = null;
      this._type = null;
      this._context = null;
      this._morphObj = null;
    }

    from (val) {
      if (val == null) {
        return this._from
      }

      this._from = this._set(val);
      return this
    }

    to (val) {
      if (val == null) {
        return this._to
      }

      this._to = this._set(val);
      return this
    }

    type (type) {
      // getter
      if (type == null) {
        return this._type
      }

      // setter
      this._type = type;
      return this
    }

    _set (value) {
      if (!this._type) {
        var type = typeof value;

        if (type === 'number') {
          this.type(SVGNumber);
        } else if (type === 'string') {
          if (Color.isColor(value)) {
            this.type(Color);
          } else if (regex.delimiter.test(value)) {
            this.type(regex.pathLetters.test(value)
              ? PathArray
              : SVGArray
            );
          } else if (regex.numberAndUnit.test(value)) {
            this.type(SVGNumber);
          } else {
            this.type(Morphable.NonMorphable);
          }
        } else if (MorphableTypes.indexOf(value.constructor) > -1) {
          this.type(value.constructor);
        } else if (Array.isArray(value)) {
          this.type(SVGArray);
        } else if (type === 'object') {
          this.type(Morphable.ObjectBag);
        } else {
          this.type(Morphable.NonMorphable);
        }
      }

      var result = (new this._type(value)).toArray();
      this._morphObj = this._morphObj || new this._type();
      this._context = this._context ||
        Array.apply(null, Array(result.length)).map(Object);
      return result
    }

    stepper (stepper) {
      if (stepper == null) return this._stepper
      this._stepper = stepper;
      return this
    }

    done () {
      var complete = this._context
        .map(this._stepper.done)
        .reduce(function (last, curr) {
          return last && curr
        }, true);
      return complete
    }

    at (pos) {
      var _this = this;

      return this._morphObj.fromArray(
        this._from.map(function (i, index) {
          return _this._stepper.step(i, _this._to[index], pos, _this._context[index], _this._context)
        })
      )
    }
  }

  Morphable.NonMorphable = class {
    constructor (...args) {
      this.init(...args);
    }

    init (val) {
      val = Array.isArray(val) ? val[0] : val;
      this.value = val;
    }

    valueOf () {
      return this.value
    }

    toArray () {
      return [this.value]
    }
  };

  Morphable.TransformBag = class {
    constructor (...args) {
      this.init(...args);
    }

    init (obj) {
      if (Array.isArray(obj)) {
        obj = {
          scaleX: obj[0],
          scaleY: obj[1],
          shear: obj[2],
          rotate: obj[3],
          translateX: obj[4],
          translateY: obj[5],
          originX: obj[6],
          originY: obj[7]
        };
      }

      Object.assign(this, Morphable.TransformBag.defaults, obj);
    }

    toArray () {
      var v = this;

      return [
        v.scaleX,
        v.scaleY,
        v.shear,
        v.rotate,
        v.translateX,
        v.translateY,
        v.originX,
        v.originY
      ]
    }
  };

  Morphable.TransformBag.defaults = {
    scaleX: 1,
    scaleY: 1,
    shear: 0,
    rotate: 0,
    translateX: 0,
    translateY: 0,
    originX: 0,
    originY: 0
  };

  Morphable.ObjectBag = class {
    constructor (...args) {
      this.init(...args);
    }

    init (objOrArr) {
      this.values = [];

      if (Array.isArray(objOrArr)) {
        this.values = objOrArr;
        return
      }

      var entries = Object.entries(objOrArr || {}).sort((a, b) => {
        return a[0] - b[0]
      });

      this.values = entries.reduce((last, curr) => last.concat(curr), []);
    }

    valueOf () {
      var obj = {};
      var arr = this.values;

      for (var i = 0, len = arr.length; i < len; i += 2) {
        obj[arr[i]] = arr[i + 1];
      }

      return obj
    }

    toArray () {
      return this.values
    }
  };

  let morphableTypes = [
    SVGNumber,
    Color,
    Box$1,
    Matrix,
    SVGArray,
    PointArray$1,
    PathArray,
    Morphable.NonMorphable,
    Morphable.TransformBag,
    Morphable.ObjectBag
  ];

  extend$1(morphableTypes, {
    to (val, args) {
      return new Morphable()
        .type(this.constructor)
        .from(this.valueOf())
        .to(val, args)
    },
    fromArray (arr) {
      this.init(arr);
      return this
    }
  });

  var time = window.performance || Date;

  var makeSchedule = function (runnerInfo) {
    var start = runnerInfo.start;
    var duration = runnerInfo.runner.duration();
    var end = start + duration;
    return {start: start, duration: duration, end: end, runner: runnerInfo.runner}
  };

  class Timeline {
    // Construct a new timeline on the given element
    constructor () {
      this._timeSource = function () {
        return time.now()
      };

      this._dispatcher = document.createElement('div');

      // Store the timing variables
      this._startTime = 0;
      this._speed = 1.0;

      // Play control variables control how the animation proceeds
      this._reverse = false;
      this._persist = 0;

      // Keep track of the running animations and their starting parameters
      this._nextFrame = null;
      this._paused = false;
      this._runners = [];
      this._order = [];
      this._time = 0;
      this._lastSourceTime = 0;
      this._lastStepTime = 0;
    }

    getEventTarget () {
      return this._dispatcher
    }

    /**
     *
     */

    // schedules a runner on the timeline
    schedule (runner, delay, when) {
      if (runner == null) {
        return this._runners.map(makeSchedule).sort(function (a, b) {
          return (a.start - b.start) || (a.duration - b.duration)
        })
      }

      if (!this.active()) {
        this._step();
        if (when == null) {
          when = 'now';
        }
      }

      // The start time for the next animation can either be given explicitly,
      // derived from the current timeline time or it can be relative to the
      // last start time to chain animations direclty
      var absoluteStartTime = 0;
      delay = delay || 0;

      // Work out when to start the animation
      if (when == null || when === 'last' || when === 'after') {
        // Take the last time and increment
        absoluteStartTime = this._startTime;
      } else if (when === 'absolute' || when === 'start') {
        absoluteStartTime = delay;
        delay = 0;
      } else if (when === 'now') {
        absoluteStartTime = this._time;
      } else if (when === 'relative') {
        let runnerInfo = this._runners[runner.id];
        if (runnerInfo) {
          absoluteStartTime = runnerInfo.start + delay;
          delay = 0;
        }
      } else {
        throw new Error('Invalid value for the "when" parameter')
      }

      // Manage runner
      runner.unschedule();
      runner.timeline(this);
      runner.time(-delay);

      // Save startTime for next runner
      this._startTime = absoluteStartTime + runner.duration() + delay;

      // Save runnerInfo
      this._runners[runner.id] = {
        persist: this.persist(),
        runner: runner,
        start: absoluteStartTime
      };

      // Save order and continue
      this._order.push(runner.id);
      this._continue();
      return this
    }

    // Remove the runner from this timeline
    unschedule (runner) {
      var index = this._order.indexOf(runner.id);
      if (index < 0) return this

      delete this._runners[runner.id];
      this._order.splice(index, 1);
      runner.timeline(null);
      return this
    }

    play () {
      // Now make sure we are not paused and continue the animation
      this._paused = false;
      return this._continue()
    }

    pause () {
      // Cancel the next animation frame and pause
      this._nextFrame = null;
      this._paused = true;
      return this
    }

    stop () {
      // Cancel the next animation frame and go to start
      this.seek(-this._time);
      return this.pause()
    }

    finish () {
      this.seek(Infinity);
      return this.pause()
    }

    speed (speed) {
      if (speed == null) return this._speed
      this._speed = speed;
      return this
    }

    reverse (yes) {
      var currentSpeed = this.speed();
      if (yes == null) return this.speed(-currentSpeed)

      var positive = Math.abs(currentSpeed);
      return this.speed(yes ? positive : -positive)
    }

    seek (dt) {
      this._time += dt;
      return this._continue()
    }

    time (time) {
      if (time == null) return this._time
      this._time = time;
      return this
    }

    persist (dtOrForever) {
      if (dtOrForever == null) return this._persist
      this._persist = dtOrForever;
      return this
    }

    source (fn) {
      if (fn == null) return this._timeSource
      this._timeSource = fn;
      return this
    }

    _step () {
      // If the timeline is paused, just do nothing
      if (this._paused) return

      // Get the time delta from the last time and update the time
      // TODO: Deal with window.blur window.focus to pause animations
      var time = this._timeSource();
      var dtSource = time - this._lastSourceTime;
      var dtTime = this._speed * dtSource + (this._time - this._lastStepTime);
      this._lastSourceTime = time;

      // Update the time
      this._time += dtTime;
      this._lastStepTime = this._time;
      // this.fire('time', this._time)

      // Run all of the runners directly
      var runnersLeft = false;
      for (var i = 0, len = this._order.length; i < len; i++) {
        // Get and run the current runner and ignore it if its inactive
        var runnerInfo = this._runners[this._order[i]];
        var runner = runnerInfo.runner;
        let dt = dtTime;

        // Make sure that we give the actual difference
        // between runner start time and now
        let dtToStart = this._time - runnerInfo.start;

        // Dont run runner if not started yet
        if (dtToStart < 0) {
          runnersLeft = true;
          continue
        } else if (dtToStart < dt) {
          // Adjust dt to make sure that animation is on point
          dt = dtToStart;
        }

        if (!runner.active()) continue

        // If this runner is still going, signal that we need another animation
        // frame, otherwise, remove the completed runner
        var finished = runner.step(dt).done;
        if (!finished) {
          runnersLeft = true;
          // continue
        } else if (runnerInfo.persist !== true) {
          // runner is finished. And runner might get removed

          // TODO: Figure out end time of runner
          var endTime = runner.duration() - runner.time() + this._time;

          if (endTime + this._persist < this._time) {
            // Delete runner and correct index
            delete this._runners[this._order[i]];
            this._order.splice(i--, 1) && --len;
            runner.timeline(null);
          }
        }
      }

      // Get the next animation frame to keep the simulation going
      if (runnersLeft) {
        this._nextFrame = Animator.frame(this._step.bind(this));
      } else {
        this._nextFrame = null;
      }
      return this
    }

    // Checks if we are running and continues the animation
    _continue () {
      if (this._paused) return this
      if (!this._nextFrame) {
        this._nextFrame = Animator.frame(this._step.bind(this));
      }
      return this
    }

    active () {
      return !!this._nextFrame
    }
  }

  Timeline.constructors = {
    Element: {
      timeline: function () {
        this._timeline = (this._timeline || new Timeline());
        return this._timeline
      }
    }
  };

  // FIXME: What is this doing here?
  // easing = {
  //   '-': function (pos) { return pos },
  //   '<>': function (pos) { return -Math.cos(pos * Math.PI) / 2 + 0.5 },
  //   '>': function (pos) { return Math.sin(pos * Math.PI / 2) },
  //   '<': function (pos) { return -Math.cos(pos * Math.PI / 2) + 1 }
  // }

  class Runner {
    constructor (options) {
      // Store a unique id on the runner, so that we can identify it later
      this.id = Runner.id++;

      // Ensure a default value
      options = options == null
        ? timeline.duration
        : options;

      // Ensure that we get a controller
      options = typeof options === 'function'
        ? new Controller(options)
        : options;

      // Declare all of the variables
      this._element = null;
      this._timeline = null;
      this.done = false;
      this._queue = [];

      // Work out the stepper and the duration
      this._duration = typeof options === 'number' && options;
      this._isDeclarative = options instanceof Controller;
      this._stepper = this._isDeclarative ? options : new Ease();

      // We copy the current values from the timeline because they can change
      this._history = {};

      // Store the state of the runner
      this.enabled = true;
      this._time = 0;
      this._last = 0;

      // Save transforms applied to this runner
      this.transforms = new Matrix();
      this.transformId = 1;

      // Looping variables
      this._haveReversed = false;
      this._reverse = false;
      this._loopsDone = 0;
      this._swing = false;
      this._wait = 0;
      this._times = 1;
    }

    /*
    Runner Definitions
    ==================
    These methods help us define the runtime behaviour of the Runner or they
    help us make new runners from the current runner
    */

    element (element) {
      if (element == null) return this._element
      this._element = element;
      element._prepareRunner();
      return this
    }

    timeline (timeline$$1) {
      // check explicitly for undefined so we can set the timeline to null
      if (typeof timeline$$1 === 'undefined') return this._timeline
      this._timeline = timeline$$1;
      return this
    }

    animate (duration, delay, when) {
      var o = Runner.sanitise(duration, delay, when);
      var runner = new Runner(o.duration);
      if (this._timeline) runner.timeline(this._timeline);
      if (this._element) runner.element(this._element);
      return runner.loop(o).schedule(delay, when)
    }

    schedule (timeline$$1, delay, when) {
      // The user doesn't need to pass a timeline if we already have one
      if (!(timeline$$1 instanceof Timeline)) {
        when = delay;
        delay = timeline$$1;
        timeline$$1 = this.timeline();
      }

      // If there is no timeline, yell at the user...
      if (!timeline$$1) {
        throw Error('Runner cannot be scheduled without timeline')
      }

      // Schedule the runner on the timeline provided
      timeline$$1.schedule(this, delay, when);
      return this
    }

    unschedule () {
      var timeline$$1 = this.timeline();
      timeline$$1 && timeline$$1.unschedule(this);
      return this
    }

    loop (times, swing, wait) {
      // Deal with the user passing in an object
      if (typeof times === 'object') {
        swing = times.swing;
        wait = times.wait;
        times = times.times;
      }

      // Sanitise the values and store them
      this._times = times || Infinity;
      this._swing = swing || false;
      this._wait = wait || 0;
      return this
    }

    delay (delay) {
      return this.animate(0, delay)
    }

    /*
    Basic Functionality
    ===================
    These methods allow us to attach basic functions to the runner directly
    */

    queue (initFn, runFn, isTransform) {
      this._queue.push({
        initialiser: initFn || noop,
        runner: runFn || noop,
        isTransform: isTransform,
        initialised: false,
        finished: false
      });
      var timeline$$1 = this.timeline();
      timeline$$1 && this.timeline()._continue();
      return this
    }

    during (fn) {
      return this.queue(null, fn)
    }

    after (fn) {
      return this.on('finish', fn)
    }

    /*
    Runner animation methods
    ========================
    Control how the animation plays
    */

    time (time) {
      if (time == null) {
        return this._time
      }
      let dt = time - this._time;
      this.step(dt);
      return this
    }

    duration () {
      return this._times * (this._wait + this._duration) - this._wait
    }

    loops (p) {
      var loopDuration = this._duration + this._wait;
      if (p == null) {
        var loopsDone = Math.floor(this._time / loopDuration);
        var relativeTime = (this._time - loopsDone * loopDuration);
        var position = relativeTime / this._duration;
        return Math.min(loopsDone + position, this._times)
      }
      var whole = Math.floor(p);
      var partial = p % 1;
      var time = loopDuration * whole + this._duration * partial;
      return this.time(time)
    }

    position (p) {
      // Get all of the variables we need
      var x = this._time;
      var d = this._duration;
      var w = this._wait;
      var t = this._times;
      var s = this._swing;
      var r = this._reverse;
      var position;

      if (p == null) {
        /*
        This function converts a time to a position in the range [0, 1]
        The full explanation can be found in this desmos demonstration
          https://www.desmos.com/calculator/u4fbavgche
        The logic is slightly simplified here because we can use booleans
        */

        // Figure out the value without thinking about the start or end time
        const f = function (x) {
          var swinging = s * Math.floor(x % (2 * (w + d)) / (w + d));
          var backwards = (swinging && !r) || (!swinging && r);
          var uncliped = Math.pow(-1, backwards) * (x % (w + d)) / d + backwards;
          var clipped = Math.max(Math.min(uncliped, 1), 0);
          return clipped
        };

        // Figure out the value by incorporating the start time
        var endTime = t * (w + d) - w;
        position = x <= 0 ? Math.round(f(1e-5))
          : x < endTime ? f(x)
          : Math.round(f(endTime - 1e-5));
        return position
      }

      // Work out the loops done and add the position to the loops done
      var loopsDone = Math.floor(this.loops());
      var swingForward = s && (loopsDone % 2 === 0);
      var forwards = (swingForward && !r) || (r && swingForward);
      position = loopsDone + (forwards ? p : 1 - p);
      return this.loops(position)
    }

    progress (p) {
      if (p == null) {
        return Math.min(1, this._time / this.duration())
      }
      return this.time(p * this.duration())
    }

    step (dt) {
      // If we are inactive, this stepper just gets skipped
      if (!this.enabled) return this

      // Update the time and get the new position
      dt = dt == null ? 16 : dt;
      this._time += dt;
      var position = this.position();

      // Figure out if we need to run the stepper in this frame
      var running = this._lastPosition !== position && this._time >= 0;
      this._lastPosition = position;

      // Figure out if we just started
      var duration = this.duration();
      var justStarted = this._lastTime < 0 && this._time > 0;
      var justFinished = this._lastTime < this._time && this.time > duration;
      this._lastTime = this._time;

      // Work out if the runner is finished set the done flag here so animations
      // know, that they are running in the last step (this is good for
      // transformations which can be merged)
      var declarative = this._isDeclarative;
      this.done = !declarative && !justFinished && this._time >= duration;

      // Call initialise and the run function
      if (running || declarative) {
        this._initialise(running);

        // clear the transforms on this runner so they dont get added again and again
        this.transforms = new Matrix();
        var converged = this._run(declarative ? dt : position);
        // this.fire('step', this)
      }
      // correct the done flag here
      // declaritive animations itself know when they converged
      this.done = this.done || (converged && declarative);
      // if (this.done) {
      //   this.fire('finish', this)
      // }
      return this
    }

    finish () {
      return this.step(Infinity)
    }

    reverse (reverse) {
      this._reverse = reverse == null ? !this._reverse : reverse;
      return this
    }

    ease (fn) {
      this._stepper = new Ease(fn);
      return this
    }

    active (enabled) {
      if (enabled == null) return this.enabled
      this.enabled = enabled;
      return this
    }

    /*
    Private Methods
    ===============
    Methods that shouldn't be used externally
    */

    // Save a morpher to the morpher list so that we can retarget it later
    _rememberMorpher (method, morpher) {
      this._history[method] = {
        morpher: morpher,
        caller: this._queue[this._queue.length - 1]
      };
    }

    // Try to set the target for a morpher if the morpher exists, otherwise
    // do nothing and return false
    _tryRetarget (method, target) {
      if (this._history[method]) {
        // if the last method wasnt even initialised, throw it away
        if (!this._history[method].caller.initialised) {
          let index = this._queue.indexOf(this._history[method].caller);
          this._queue.splice(index, 1);
          return false
        }

        // for the case of transformations, we use the special retarget function
        // which has access to the outer scope
        if (this._history[method].caller.isTransform) {
          this._history[method].caller.isTransform(target);
        // for everything else a simple morpher change is sufficient
        } else {
          this._history[method].morpher.to(target);
        }

        this._history[method].caller.finished = false;
        var timeline$$1 = this.timeline();
        timeline$$1 && timeline$$1._continue();
        return true
      }
      return false
    }

    // Run each initialise function in the runner if required
    _initialise (running) {
      // If we aren't running, we shouldn't initialise when not declarative
      if (!running && !this._isDeclarative) return

      // Loop through all of the initialisers
      for (var i = 0, len = this._queue.length; i < len; ++i) {
        // Get the current initialiser
        var current = this._queue[i];

        // Determine whether we need to initialise
        var needsIt = this._isDeclarative || (!current.initialised && running);
        running = !current.finished;

        // Call the initialiser if we need to
        if (needsIt && running) {
          current.initialiser.call(this);
          current.initialised = true;
        }
      }
    }

    // Run each run function for the position or dt given
    _run (positionOrDt) {
      // Run all of the _queue directly
      var allfinished = true;
      for (var i = 0, len = this._queue.length; i < len; ++i) {
        // Get the current function to run
        var current = this._queue[i];

        // Run the function if its not finished, we keep track of the finished
        // flag for the sake of declarative _queue
        var converged = current.runner.call(this, positionOrDt);
        current.finished = current.finished || (converged === true);
        allfinished = allfinished && current.finished;
      }

      // We report when all of the constructors are finished
      return allfinished
    }

    addTransform (transform, index) {
      this.transforms.lmultiplyO(transform);
      return this
    }

    clearTransform () {
      this.transforms = new Matrix();
      return this
    }

    static sanitise (duration, delay, when) {
      // Initialise the default parameters
      var times = 1;
      var swing = false;
      var wait = 0;
      duration = duration || timeline.duration;
      delay = delay || timeline.delay;
      when = when || 'last';

      // If we have an object, unpack the values
      if (typeof duration === 'object' && !(duration instanceof Stepper)) {
        delay = duration.delay || delay;
        when = duration.when || when;
        swing = duration.swing || swing;
        times = duration.times || times;
        wait = duration.wait || wait;
        duration = duration.duration || timeline.duration;
      }

      return {
        duration: duration,
        delay: delay,
        swing: swing,
        times: times,
        wait: wait,
        when: when
      }
    }
  }

  Runner.id = 0;

  class FakeRunner{
    constructor (transforms = new Matrix(), id = -1, done = true) {
      this.transforms = transforms;
      this.id = id;
      this.done = done;
    }
  }

  extend$1([Runner, FakeRunner], {
    mergeWith (runner) {
      return new FakeRunner(
        runner.transforms.lmultiply(this.transforms),
        runner.id
      )
    }
  });

  // FakeRunner.emptyRunner = new FakeRunner()

  const lmultiply = (last, curr) => last.lmultiplyO(curr);
  const getRunnerTransform = (runner) => runner.transforms;

  function mergeTransforms () {
    // Find the matrix to apply to the element and apply it
    let runners = this._transformationRunners.runners;
    let netTransform = runners
      .map(getRunnerTransform)
      .reduce(lmultiply, new Matrix());

    this.transform(netTransform);

    this._transformationRunners.merge();

    if (this._transformationRunners.length() === 1) {
      this._frameId = null;
    }
  }

  class RunnerArray {
    constructor () {
      this.runners = [];
      this.ids = [];
    }

    add (runner) {
      if (this.runners.includes(runner)) return

      let id = runner.id + 1;

      let leftSibling = this.ids.reduce((last, curr) => {
        if (curr > last && curr < id) return curr
        return last
      }, 0);

      let index = this.ids.indexOf(leftSibling) + 1;

      this.ids.splice(index, 0, id);
      this.runners.splice(index, 0, runner);

      return this
    }

    getByID (id) {
      return this.runners[this.ids.indexOf(id + 1)]
    }

    remove (id) {
      let index = this.ids.indexOf(id + 1);
      this.ids.splice(index, 1);
      this.runners.splice(index, 1);
      return this
    }

    merge () {
      let lastRunner = null;
      this.runners.forEach((runner, i) => {
        if (lastRunner && runner.done && lastRunner.done) {
          this.remove(runner.id);
          this.edit(lastRunner.id, runner.mergeWith(lastRunner));
        }

        lastRunner = runner;
      });

      return this
    }

    edit (id, newRunner) {
      let index = this.ids.indexOf(id + 1);
      this.ids.splice(index, 1, id);
      this.runners.splice(index, 1, newRunner);
      return this
    }

    length () {
      return this.ids.length
    }

    clearBefore (id) {
      let deleteCnt = this.ids.indexOf(id + 1) || 1;
      this.ids.splice(0, deleteCnt, 0);
      this.runners.splice(0, deleteCnt, new FakeRunner());
      return this
    }
  }

  let frameId = 0;
  Runner.constructors = {
    Element: {
      animate (duration, delay, when) {
        var o = Runner.sanitise(duration, delay, when);
        var timeline$$1 = this.timeline();
        return new Runner(o.duration)
          .loop(o)
          .element(this)
          .timeline(timeline$$1)
          .schedule(delay, when)
      },

      delay (by, when) {
        return this.animate(0, by, when)
      },

      // this function searches for all runners on the element and deletes the ones
      // which run before the current one. This is because absolute transformations
      // overwfrite anything anyway so there is no need to waste time computing
      // other runners
      _clearTransformRunnersBefore (currentRunner) {
        this._transformationRunners.clearBefore(currentRunner.id);
      },

      _currentTransform (current) {
        return this._transformationRunners.runners
          // we need the equal sign here to make sure, that also transformations
          // on the same runner which execute before the current transformation are
          // taken into account
          .filter((runner) => runner.id <= current.id)
          .map(getRunnerTransform)
          .reduce(lmultiply, new Matrix())
      },

      addRunner (runner) {
        this._transformationRunners.add(runner);

        Animator.transform_frame(
          mergeTransforms.bind(this), this._frameId
        );
      },

      _prepareRunner () {
        if (this._frameId == null) {
          this._transformationRunners = new RunnerArray()
            .add(new FakeRunner(new Matrix(this)));

          this._frameId = frameId++;
        }
      }
    }
  };


  extend$1(Runner, {
    attr (a, v) {
      return this.styleAttr('attr', a, v)
    },

    // Add animatable styles
    css (s, v) {
      return this.styleAttr('css', s, v)
    },

    styleAttr (type, name, val) {
      // apply attributes individually
      if (typeof name === 'object') {
        for (var key in val) {
          this.styleAttr(type, key, val[key]);
        }
      }

      var morpher = new Morphable(this._stepper).to(val);

      this.queue(function () {
        morpher = morpher.from(this.element()[type](name));
      }, function (pos) {
        this.element()[type](name, morpher.at(pos));
        return morpher.done()
      });

      return this
    },

    zoom (level, point) {
      var morpher = new Morphable(this._stepper).to(new SVGNumber(level));

      this.queue(function () {
        morpher = morpher.from(this.zoom());
      }, function (pos) {
        this.element().zoom(morpher.at(pos), point);
        return morpher.done()
      });

      return this
    },

    /**
     ** absolute transformations
     **/

    //
    // M v -----|-----(D M v = F v)------|----->  T v
    //
    // 1. define the final state (T) and decompose it (once)
    //    t = [tx, ty, the, lam, sy, sx]
    // 2. on every frame: pull the current state of all previous transforms
    //    (M - m can change)
    //   and then write this as m = [tx0, ty0, the0, lam0, sy0, sx0]
    // 3. Find the interpolated matrix F(pos) = m + pos * (t - m)
    //   - Note F(0) = M
    //   - Note F(1) = T
    // 4. Now you get the delta matrix as a result: D = F * inv(M)

    transform (transforms, relative, affine) {
      // If we have a declarative function, we should retarget it if possible
      relative = transforms.relative || relative;
      if (this._isDeclarative && !relative && this._tryRetarget('transform', transforms)) {
        return this
      }

      // Parse the parameters
      var isMatrix = isMatrixLike(transforms);
      affine = transforms.affine != null
        ? transforms.affine
        : (affine != null ? affine : !isMatrix);

      // Create a morepher and set its type
      const morpher = new Morphable()
        .type(affine ? Morphable.TransformBag : Matrix)
        .stepper(this._stepper);

      let origin;
      let element;
      let current;
      let currentAngle;
      let startTransform;

      function setup () {
        // make sure element and origin is defined
        element = element || this.element();
        origin = origin || getOrigin(transforms, element);

        startTransform = new Matrix(relative ? undefined : element);

        // add the runner to the element so it can merge transformations
        element.addRunner(this);

        // Deactivate all transforms that have run so far if we are absolute
        if (!relative) {
          element._clearTransformRunnersBefore(this);
        }
      }

      function run (pos) {
        // clear all other transforms before this in case something is saved
        // on this runner. We are absolute. We dont need these!
        if (!relative) this.clearTransform();

        let {x, y} = new Point(origin).transform(element._currentTransform(this));

        let target = new Matrix({...transforms, origin: [x, y]});
        let start = this._isDeclarative && current
          ? current
          : startTransform;

        if (affine) {
          target = target.decompose(x, y);
          start = start.decompose(x, y);

          // Get the current and target angle as it was set
          const rTarget = target.rotate;
          const rCurrent = start.rotate;

          // Figure out the shortest path to rotate directly
          const possibilities = [rTarget - 360, rTarget, rTarget + 360];
          const distances = possibilities.map(a => Math.abs(a - rCurrent));
          const shortest = Math.min(...distances);
          const index = distances.indexOf(shortest);
          target.rotate = possibilities[index];
        }

        if (relative) {
          // we have to be careful here not to overwrite the rotation
          // with the rotate method of Matrix
          if (!isMatrix) {
            target.rotate = transforms.rotate || 0;
          }
          if (this._isDeclarative && currentAngle) {
            start.rotate = currentAngle;
          }
        }

        morpher.from(start);
        morpher.to(target);

        let affineParameters = morpher.at(pos);
        currentAngle = affineParameters.rotate;
        current = new Matrix(affineParameters);

        this.addTransform(current);
        return morpher.done()
      }

      function retarget (newTransforms) {
        // only get a new origin if it changed since the last call
        if (
          (newTransforms.origin || 'center').toString() !==
          (transforms.origin || 'center').toString()
        ) {
          origin = getOrigin(transforms, element);
        }

        // overwrite the old transformations with the new ones
        transforms = {...newTransforms, origin};
      }

      this.queue(setup, run, retarget);
      this._isDeclarative && this._rememberMorpher('transform', morpher);
      return this
    },

    // Animatable x-axis
    x (x, relative) {
      return this._queueNumber('x', x)
    },

    // Animatable y-axis
    y (y) {
      return this._queueNumber('y', y)
    },

    dx (x) {
      return this._queueNumberDelta('dx', x)
    },

    dy (y) {
      return this._queueNumberDelta('dy', y)
    },

    _queueNumberDelta (method, to) {
      to = new SVGNumber(to);

      // Try to change the target if we have this method already registerd
      if (this._tryRetargetDelta(method, to)) return this

      // Make a morpher and queue the animation
      var morpher = new Morphable(this._stepper).to(to);
      this.queue(function () {
        var from = this.element()[method]();
        morpher.from(from);
        morpher.to(from + to);
      }, function (pos) {
        this.element()[method](morpher.at(pos));
        return morpher.done()
      });

      // Register the morpher so that if it is changed again, we can retarget it
      this._rememberMorpher(method, morpher);
      return this
    },

    _queueObject (method, to) {
      // Try to change the target if we have this method already registerd
      if (this._tryRetarget(method, to)) return this

      // Make a morpher and queue the animation
      var morpher = new Morphable(this._stepper).to(to);
      this.queue(function () {
        morpher.from(this.element()[method]());
      }, function (pos) {
        this.element()[method](morpher.at(pos));
        return morpher.done()
      });

      // Register the morpher so that if it is changed again, we can retarget it
      this._rememberMorpher(method, morpher);
      return this
    },

    _queueNumber (method, value) {
      return this._queueObject(method, new SVGNumber(value))
    },

    // Animatable center x-axis
    cx (x) {
      return this._queueNumber('cx', x)
    },

    // Animatable center y-axis
    cy (y) {
      return this._queueNumber('cy', y)
    },

    // Add animatable move
    move (x, y) {
      return this.x(x).y(y)
    },

    // Add animatable center
    center (x, y) {
      return this.cx(x).cy(y)
    },

    // Add animatable size
    size (width, height) {
      // animate bbox based size for all other elements
      var box;

      if (!width || !height) {
        box = this._element.bbox();
      }

      if (!width) {
        width = box.width / box.height * height;
      }

      if (!height) {
        height = box.height / box.width * width;
      }

      return this
        .width(width)
        .height(height)
    },

    // Add animatable width
    width (width) {
      return this._queueNumber('width', width)
    },

    // Add animatable height
    height (height) {
      return this._queueNumber('height', height)
    },

    // Add animatable plot
    plot (a, b, c, d) {
      // Lines can be plotted with 4 arguments
      if (arguments.length === 4) {
        return this.plot([a, b, c, d])
      }

      // FIXME: this needs to be rewritten such that the element is only accesed
      // in the init function
      return this._queueObject('plot', new this._element.MorphArray(a))

      /*
      var morpher = this._element.morphArray().to(a)

      this.queue(function () {
        morpher.from(this._element.array())
      }, function (pos) {
        this._element.plot(morpher.at(pos))
      })

      return this
      */
    },

    // Add leading method
    leading (value) {
      return this._queueNumber('leading', value)
    },

    // Add animatable viewbox
    viewbox (x, y, width, height) {
      return this._queueObject('viewbox', new Box(x, y, width, height))
    },

    update (o) {
      if (typeof o !== 'object') {
        return this.update({
          offset: arguments[0],
          color: arguments[1],
          opacity: arguments[2]
        })
      }

      if (o.opacity != null) this.attr('stop-opacity', o.opacity);
      if (o.color != null) this.attr('stop-color', o.color);
      if (o.offset != null) this.attr('offset', o.offset);

      return this
    }
  });

  // export {default as Animator} from './Animator.js'
  // export {default as SVGArray} from './SVGArray.js'
  // export {default as Bare} from './Bare.js'
  // export {default as Box} from './Box.js'
  // export {default as Circle} from './Circle.js'
  // export {default as ClipPath} from './ClipPath.js'
  // export {default as Color} from './Color.js'
  // export {default as Container} from './Container.js'
  // export {Controller, Ease, PID, Spring} from './Controller.js'
  // export {default as Defs} from './Defs.js'
  // export {default as Doc} from './Doc.js'
  // export {default as Element} from './Element.js'
  // export {default as Ellipse} from './Ellipse.js'
  // export {default as EventTarget} from './EventTarget.js'
  // export {default as Gradient} from './Gradient.js'
  // export {default as G} from './G.js'
  // export {default as HtmlNode} from './HtmlNode.js'
  // export {default as A} from './A.js'
  // export {default as Image} from './Image.js'
  // export {default as Line} from './Line.js'
  // export {default as Marker} from './Marker.js'
  // export {default as Mask} from './Mask.js'
  // export {default as Matrix} from './Matrix.js'
  // export {default as Morphable} from './Morphable.js'
  // export {default as SVGNumber} from './SVGNumber.js'
  // export {default as Parent} from './Parent.js'
  // export {default as Path} from './Path.js'
  // export {default as PathArray} from './PathArray.js'
  // export {default as Pattern} from './Pattern.js'
  // export {default as Point} from './Point.js'
  // export {default as PointArray} from './PointArray.js'
  // export {default as Polygon} from './Polygon.js'
  // export {default as Polyline} from './Polyline.js'
  // export {default as Queue} from './Queue.js'
  // export {default as Rect} from './Rect.js'
  // export {default as Runner} from './Runner.js'
  // export {default as Shape} from './Shape.js'
  // export {default as Stop} from './Stop.js'
  // export {default as Symbol} from './Symbol.js'
  // export {default as Text} from './Text.js'
  // export {default as TextPath} from './TextPath.js'
  // export {default as Timeline} from './Timeline.js'
  // export {default as Use} from './Use.js'

  var Classes = /*#__PURE__*/Object.freeze({
    HtmlNode: HtmlNode,
    Doc: Doc$1,
    Defs: Defs,
    G: G,
    Animator: Animator,
    Bare: Bare,
    Circle: Circle,
    ClipPath: ClipPath,
    A: A,
    Ellipse: Ellipse,
    Stop: Stop,
    Gradient: Gradient,
    Image: Image,
    Line: Line,
    Marker: Marker,
    Mask: Mask,
    Path: Path,
    Pattern: Pattern,
    Polygon: Polygon,
    Polyline: Polyline,
    Rect: Rect,
    Symbol: Symbol,
    Text: Text$1,
    TextPath: TextPath,
    Tspan: Tspan,
    Use: Use,
    SVGNumber: SVGNumber,
    SVGArray: SVGArray,
    PathArray: PathArray,
    PointArray: PointArray$1,
    Matrix: Matrix,
    Point: Point,
    Box: Box$1,
    Color: Color,
    Morphable: Morphable,
    Queue: Queue,
    Runner: Runner,
    Timeline: Timeline,
    Controller: Controller,
    Ease: Ease,
    PID: PID,
    Spring: Spring
  });



  var containers = /*#__PURE__*/Object.freeze({
    Bare: Bare,
    ClipPath: ClipPath,
    Defs: Defs,
    Doc: Doc$1,
    Gradient: Gradient,
    G: G,
    A: A,
    Marker: Marker,
    Mask: Mask,
    Pattern: Pattern,
    Symbol: Symbol
  });

  // ### This module adds backward / forward functionality to elements.

  // Get all siblings, including myself
  function siblings () {
    return this.parent().children()
  }

  // Get the curent position siblings
  function position () {
    return this.parent().index(this)
  }

  // Get the next element (will return null if there is none)
  function next () {
    return this.siblings()[this.position() + 1]
  }

  // Get the next element (will return null if there is none)
  function prev () {
    return this.siblings()[this.position() - 1]
  }

  // Send given element one step forward
  function forward () {
    var i = this.position() + 1;
    var p = this.parent();

    // move node one step forward
    p.removeElement(this).add(this, i);

    // make sure defs node is always at the top
    if (p instanceof Doc$1) {
      p.node.appendChild(p.defs().node);
    }

    return this
  }

  // Send given element one step backward
  function backward () {
    var i = this.position();

    if (i > 0) {
      this.parent().removeElement(this).add(this, i - 1);
    }

    return this
  }

  // Send given element all the way to the front
  function front () {
    var p = this.parent();

    // Move node forward
    p.node.appendChild(this.node);

    // Make sure defs node is always at the top
    if (p instanceof Doc$1) {
      p.node.appendChild(p.defs().node);
    }

    return this
  }

  // Send given element all the way to the back
  function back () {
    if (this.position() > 0) {
      this.parent().removeElement(this).add(this, 0);
    }

    return this
  }

  // Inserts a given element before the targeted element
  function before (element) {
    element.remove();

    var i = this.position();

    this.parent().add(element, i);

    return this
  }

  // Inserts a given element after the targeted element
  function after (element) {
    element.remove();

    var i = this.position();

    this.parent().add(element, i + 1);

    return this
  }

  var arrange = /*#__PURE__*/Object.freeze({
    siblings: siblings,
    position: position,
    next: next,
    prev: prev,
    forward: forward,
    backward: backward,
    front: front,
    back: back,
    before: before,
    after: after
  });

  // // Method for getting an element by id
  // SVG.get = function (id) {
  //   var node = document.getElementById(idFromReference(id) || id)
  //   return SVG.adopt(node)
  // }
  //
  // // Select elements by query string
  // SVG.select = function (query, parent) {
  //   return SVG.utils.map((parent || document).querySelectorAll(query), function (node) {
  //     return SVG.adopt(node)
  //   })
  // }
  //
  // SVG.$$ = function (query, parent) {
  //   return SVG.utils.map((parent || document).querySelectorAll(query), function (node) {
  //     return SVG.adopt(node)
  //   })
  // }
  //
  // SVG.$ = function (query, parent) {
  //   return SVG.adopt((parent || document).querySelector(query))
  // }

  function baseFind (query, parent) {
    return utils.map((parent || document).querySelectorAll(query), function (node) {
      return adopt$1(node)
    })
  }

  // Scoped find method
  function find (query) {
    return baseFind(query, this.node)
  }

  // Dynamic style generator
  function css (style, val) {
    let ret = {};
    if (arguments.length === 0) {
      // get full style as object
      this.node.style.cssText.split(/\s*;\s*/)
        .filter(function (el) { return !!el.length })
        .forEach(function (el) {
        let t = el.split(/\s*:\s*/);
        ret[t[0]] = t[1];
      });
      return ret
    }

    if (arguments.length < 2) {
      // get style properties in the array
      if (Array.isArray(style)) {
        for (let name of style) {
          let cased = camelCase(name);
          ret[cased] = this.node.style(cased);
        }
        return ret
      }

      // get style for property
      if (typeof style === 'string') {
        return this.node.style[camelCase(style)]
      }

      // set styles in object
      if (typeof style === 'object') {
        for (name in style) {
          // set empty string if null/undefined/'' was given
          this.node.style[camelCase(name)] =
            (style[name] == null || isBlank.test(style[name])) ? '' : style[name];
        }
      }
    }

    // set style for property
    if (arguments.length === 2) {
      this.node.style[camelCase(style)] =
        (val == null || isBlank.test(val)) ? '' : val;
    }

    return this
  }

    // Show element
  function show () {
    return this.css('display', '')
  }

    // Hide element
  function hide () {
    return this.css('display', 'none')
  }

    // Is element visible?
  function visible () {
    return this.css('display') !== 'none'
  }

  var css$1 = /*#__PURE__*/Object.freeze({
    css: css,
    show: show,
    hide: hide,
    visible: visible
  });

  // Reset all transformations
  function untransform () {
    return this.attr('transform', null)
  }

  // merge the whole transformation chain into one matrix and returns it
  function matrixify () {
    var matrix = (this.attr('transform') || '')
      // split transformations
      .split(transforms).slice(0, -1).map(function (str) {
        // generate key => value pairs
        var kv = str.trim().split('(');
        return [kv[0],
          kv[1].split(delimiter)
            .map(function (str) { return parseFloat(str) })
        ]
      })
      .reverse()
      // merge every transformation into one matrix
      .reduce(function (matrix, transform) {
        if (transform[0] === 'matrix') {
          return matrix.lmultiply(arrayToMatrix(transform[1]))
        }
        return matrix[transform[0]].apply(matrix, transform[1])
      }, new Matrix());

    return matrix
  }

  // add an element to another parent without changing the visual representation on the screen
  function toParent (parent) {
    if (this === parent) return this
    var ctm = this.screenCTM();
    var pCtm = parent.screenCTM().inverse();

    this.addTo(parent).untransform().transform(pCtm.multiply(ctm));

    return this
  }

  // same as above with parent equals root-svg
  function toDoc () {
    return this.toParent(this.doc())
  }

  // Add transformations
  function transform (o, relative) {
    // Act as a getter if no object was passed
    if (o == null || typeof o === 'string') {
      var decomposed = new Matrix(this).decompose();
      return decomposed[o] || decomposed
    }

    if (!isMatrixLike(o)) {
      // Set the origin according to the defined transform
      o = {...o, origin: getOrigin(o, this)};
    }

    // The user can pass a boolean, an Element or an Matrix or nothing
    var cleanRelative = relative === true ? this : (relative || false);
    var result = new Matrix(cleanRelative).transform(o);
    return this.attr('transform', result)
  }

  var transform$1 = /*#__PURE__*/Object.freeze({
    untransform: untransform,
    matrixify: matrixify,
    toParent: toParent,
    toDoc: toDoc,
    transform: transform
  });

  // Set svg element attribute
  function attr (attr, val, ns) {
    // act as full getter
    if (attr == null) {
      // get an object of attributes
      attr = {};
      val = this.node.attributes;

      for (let node of val) {
        attr[node.nodeName] = isNumer.test(node.nodeValue)
          ? parseFloat(node.nodeValue)
          : node.nodeValue;
      }

      return attr
    } else if (Array.isArray(attr)) ; else if (typeof attr === 'object') {
      // apply every attribute individually if an object is passed
      for (val in attr) this.attr(val, attr[val]);
    } else if (val === null) {
        // remove value
      this.node.removeAttribute(attr);
    } else if (val == null) {
      // act as a getter if the first and only argument is not an object
      val = this.node.getAttribute(attr);
      return val == null ? attrs[attr] // FIXME: do we need to return defaults?
        : isNumber.test(val) ? parseFloat(val)
        : val
    } else {
      // convert image fill and stroke to patterns
      if (attr === 'fill' || attr === 'stroke') {
        if (isImage.test(val)) {
          val = this.doc().defs().image(val);
        }

        if (val instanceof Image) {
          val = this.doc().defs().pattern(0, 0, function () {
            this.add(val);
          });
        }
      }

      // ensure correct numeric values (also accepts NaN and Infinity)
      if (typeof val === 'number') {
        val = new SVGNumber(val);
      } else if (Color.isColor(val)) {
        // ensure full hex color
        val = new Color(val);
      } else if (Array.isArray(val)) {
        // parse array values
        val = new SVGArray(val);
      }

      // if the passed attribute is leading...
      if (attr === 'leading') {
        // ... call the leading method instead
        if (this.leading) {
          this.leading(val);
        }
      } else {
        // set given attribute on node
        typeof ns === 'string' ? this.node.setAttributeNS(ns, attr, val.toString())
          : this.node.setAttribute(attr, val.toString());
      }

      // rebuild if required
      if (this.rebuild && (attr === 'font-size' || attr === 'x')) {
        this.rebuild();
      }
    }

    return this
  }

  const name$1 = 'Element';

  function setup (node) {
    // initialize data object
    this.dom = {};

    // create circular reference
    this.node = node;

    this.type = node.nodeName;
    this.node.instance = this;

    if (node.hasAttribute('svgjs:data')) {
      // pull svgjs data from the dom (getAttributeNS doesn't work in html5)
      this.setData(JSON.parse(node.getAttribute('svgjs:data')) || {});
    }
  }

    // Move over x-axis
  function x$2 (x) {
    return this.attr('x', x)
  }

    // Move over y-axis
  function y$2 (y) {
    return this.attr('y', y)
  }

    // Move by center over x-axis
  function cx$1 (x) {
    return x == null ? this.x() + this.width() / 2 : this.x(x - this.width() / 2)
  }

    // Move by center over y-axis
  function cy$1 (y) {
    return y == null
      ? this.y() + this.height() / 2
      : this.y(y - this.height() / 2)
  }

    // Move element to given x and y values
  function move$1 (x, y) {
    return this.x(x).y(y)
  }

    // Move element by its center
  function center (x, y) {
    return this.cx(x).cy(y)
  }

    // Set width of element
  function width$2 (width) {
    return this.attr('width', width)
  }

    // Set height of element
  function height$2 (height) {
    return this.attr('height', height)
  }

    // Set element size to given width and height
  function size$2 (width, height) {
    let p = proportionalSize$1(this, width, height);

    return this
      .width(new SVGNumber(p.width))
      .height(new SVGNumber(p.height))
  }

    // Clone element
  function clone (parent) {
    // write dom data to the dom so the clone can pickup the data
    this.writeDataToDom();

    // clone element and assign new id
    let clone = assignNewId(this.node.cloneNode(true));

    // insert the clone in the given parent or after myself
    if (parent) parent.add(clone);
    else this.after(clone);

    return clone
  }

    // Remove element
  function remove () {
    if (this.parent()) { this.parent().removeElement(this); }

    return this
  }

    // Replace element
  function replace (element) {
    this.after(element).remove();

    return element
  }

    // Add element to given container and return self
  function addTo (parent) {
    return makeInstance(parent).put(this)
  }

    // Add element to given container and return container
  function putIn (parent) {
    return makeInstance(parent).add(this)
  }

    // Get / set id
  function id (id) {
    // generate new id if no id set
    if (typeof id === 'undefined' && !this.node.id) {
      this.node.id = eid(this.type);
    }

    // dont't set directly width this.node.id to make `null` work correctly
    return this.attr('id', id)
  }

    // Checks whether the given point inside the bounding box of the element
  function inside (x, y) {
    let box = this.bbox();

    return x > box.x &&
      y > box.y &&
      x < box.x + box.width &&
      y < box.y + box.height
  }

    // Return id on string conversion
  function toString () {
    return this.id()
  }

    // Return array of classes on the node
  function classes () {
    var attr$$1 = this.attr('class');
    return attr$$1 == null ? [] : attr$$1.trim().split(delimiter)
  }

    // Return true if class exists on the node, false otherwise
  function hasClass (name) {
    return this.classes().indexOf(name) !== -1
  }

    // Add class to the node
  function addClass (name) {
    if (!this.hasClass(name)) {
      var array = this.classes();
      array.push(name);
      this.attr('class', array.join(' '));
    }

    return this
  }

    // Remove class from the node
  function removeClass (name) {
    if (this.hasClass(name)) {
      this.attr('class', this.classes().filter(function (c) {
        return c !== name
      }).join(' '));
    }

    return this
  }

    // Toggle the presence of a class on the node
  function toggleClass (name) {
    return this.hasClass(name) ? this.removeClass(name) : this.addClass(name)
  }

  // FIXME: getIdFromReference
  // Get referenced element form attribute value
  function reference$1 (attr$$1) {
    return get(this.attr(attr$$1))
  }

    // Returns the parent element instance
  function parent (type) {
    var parent = this;

    // check for parent
    if (!parent.node.parentNode) return null

    // get parent element
    parent = adopt$1(parent.node.parentNode);

    if (!type) return parent

    // loop trough ancestors if type is given
    while (parent && parent.node instanceof window.SVGElement) {
      if (typeof type === 'string' ? parent.matches(type) : parent instanceof type) return parent
      parent = adopt$1(parent.node.parentNode);
    }
  }

    // Get parent document
  function doc () {
    let p = this.parent(Doc$1);
    return p && p.doc()
  }

    // Get defs
  function defs () {
    return this.doc().defs()
  }

    // return array of all ancestors of given type up to the root svg
  function parents (type) {
    let parents = [];
    let parent = this;

    do {
      parent = parent.parent(type);
      if (!parent || !parent.node) break

      parents.push(parent);
    } while (parent.parent)

    return parents
  }

    // matches the element vs a css selector
  function matches (selector) {
    return matches(this.node, selector)
  }

    // Returns the svg node to call native svg methods on it
  function native () {
    return this.node
  }

    // Import raw svg
  function svg () {
    // write svgjs data to the dom
    this.writeDataToDom();

    return this.node.outerHTML
  }

    // write svgjs data to the dom
  function writeDataToDom () {
    // remove previously set data
    this.node.removeAttribute('svgjs:data');

    if (Object.keys(this.dom).length) {
      this.node.setAttribute('svgjs:data', JSON.stringify(this.dom)); // see #428
    }
    return this
  }

    // set given data to the elements data property
  function setData (o) {
    this.dom = o;
    return this
  }

  function getEventTarget$1 () {
    return this.node
  }

  var Element$1 = /*#__PURE__*/Object.freeze({
    name: name$1,
    setup: setup,
    x: x$2,
    y: y$2,
    cx: cx$1,
    cy: cy$1,
    move: move$1,
    center: center,
    width: width$2,
    height: height$2,
    size: size$2,
    clone: clone,
    remove: remove,
    replace: replace,
    addTo: addTo,
    putIn: putIn,
    id: id,
    inside: inside,
    toString: toString,
    classes: classes,
    hasClass: hasClass,
    addClass: addClass,
    removeClass: removeClass,
    toggleClass: toggleClass,
    reference: reference$1,
    parent: parent,
    doc: doc,
    defs: defs,
    parents: parents,
    matches: matches,
    native: native,
    svg: svg,
    writeDataToDom: writeDataToDom,
    setData: setData,
    getEventTarget: getEventTarget$1,
    attr: attr
  });

  // Unclip all clipped elements and remove itself
  function clipPathRemove () {
    // unclip all targets
    this.targets().forEach(function (el) {
      el.unclip();
    });

    // remove clipPath from parent
    return remove.call(this)
  }

  function clipPathTargets () {
    return find('svg [clip-path*="' + this.id() + '"]')
  }

  // Unclip all clipped elements and remove itself
  function maskRemove () {
    // unclip all targets
    this.targets().forEach(function (el) {
      el.unmask();
    });

    // remove clipPath from parent
    return remove.call(this)
  }

  function maskTargets () {
    return find('svg [mask*="' + this.id() + '"]')
  }

  // Unclip all clipped elements and remove itself
  function patternGradientRemove () {
    // unclip all targets
    this.targets().forEach(function (el) {
      el.unFill();
    });

    // remove clipPath from parent
    return remove.call(this)
  }

  function unFill () {
    this.attr('fill', null);
  }

  function patternGradientTargets () {
    return find('svg [fill*="' + this.id() + '"]')
  }

  // custom attr to handle transform
  function patternAttr (a, b, c) {
    if (a === 'transform') a = 'patternTransform';
    return attr.call(this, a, b, c)
  }

  // custom attr to handle transform
  function gradientAttr (a, b, c) {
    if (a === 'transform') a = 'gradientTransform';
    return attr.call(this, a, b, c)
  }

  function pathTargets () {
    return find('svg textpath [href*="' + this.id() + '"]')
  }

  function HtmlNodeAdd (element, i) {
    element = makeInstance(element);

    if (element.node !== this.node.children[i]) {
      this.node.insertBefore(element.node, this.node.children[i] || null);
    }

    return this
  }

  const name$2 = 'EventTarget';

  function setup$1 (node = {}) {
    this.events = node.events || {};
  }

    // Bind given event to listener
  function on$1 (event, listener, binding, options) {
    on(this, event, listener, binding, options);
    return this
  }

    // Unbind event from listener
  function off$1 (event, listener) {
    off(this, event, listener);
    return this
  }

  function dispatch$1 (event, data) {
    return dispatch(this, event, data)
  }

    // Fire given event
  function fire (event, data) {
    this.dispatch(event, data);
    return this
  }

  var EventTarget = /*#__PURE__*/Object.freeze({
    name: name$2,
    setup: setup$1,
    on: on$1,
    off: off$1,
    dispatch: dispatch$1,
    fire: fire
  });

  // Returns all child elements
  function children () {
    return map(this.node.children, function (node) {
      return adopt$1(node)
    })
  }

  // Add given element at a position
  function add (element, i) {
    element = makeInstance(element);

    if (element.node !== this.node.children[i]) {
      this.node.insertBefore(element.node, this.node.children[i] || null);
    }

    return this
  }

  // Basically does the same as `add()` but returns the added element instead
  function put (element, i) {
    this.add(element, i);
    return element.instance || element
  }

  // Checks if the given element is a child
  function has (element) {
    return this.index(element) >= 0
  }

  // Gets index of given element
  function index (element) {
    return [].slice.call(this.node.children).indexOf(element.node)
  }

  // Get a element at the given index
  function get$1 (i) {
    return adopt$1(this.node.children[i])
  }

  // Get first child
  function first () {
    return this.get(0)
  }

  // Get the last child
  function last () {
    return this.get(this.node.children.length - 1)
  }

  // Iterates over all children and invokes a given block
  function each (block, deep) {
    var children = this.children();
    var i, il;

    for (i = 0, il = children.length; i < il; i++) {
      if (children[i] instanceof Base) {
        block.apply(children[i], [i, children]);
      }

      if (deep && (children[i] instanceof Base && children[i].is('Parent'))) {
        children[i].each(block, deep);
      }
    }

    return this
  }

  // Remove a given child
  function removeElement (element) {
    this.node.removeChild(element.node);

    return this
  }

  // Remove all elements in this container
  function clear$1 () {
    // remove children
    while (this.node.hasChildNodes()) {
      this.node.removeChild(this.node.lastChild);
    }

    // remove defs reference
    delete this._defs;

    return this
  }

  // Import raw svg
  function svg$1 (svg) {
    var well, len;

    // act as a setter if svg is given
    if (svg) {
      // create temporary holder
      well = document.createElementNS(ns, 'svg');
      // dump raw svg
      well.innerHTML = svg;

      // transplant nodes
      for (len = well.children.length; len--;) {
        this.node.appendChild(well.firstElementChild);
      }

    // otherwise act as a getter
    } else {
      // write svgjs data to the dom
      this.writeDataToDom();

      return this.node.outerHTML
    }

    return this
  }

  // write svgjs data to the dom
  function writeDataToDom$1 () {
    // dump variables recursively
    this.each(function () {
      this.writeDataToDom();
    });

    // remove previously set data
    this.node.removeAttribute('svgjs:data');

    if (Object.keys(this.dom).length) {
      this.node.setAttribute('svgjs:data', JSON.stringify(this.dom)); // see #428
    }
    return this
  }

  function flatten (parent) {
    this.each(function () {
      if (this.is('Parent')) return this.flatten(parent).ungroup(parent)
      return this.toParent(parent)
    });

    // we need this so that Doc does not get removed
    this.node.firstElementChild || this.remove();

    return this
  }

  function ungroup (parent) {
    parent = parent || this.parent();

    this.each(function () {
      return this.toParent(parent)
    });

    this.remove();

    return this
  }

  var Parent = /*#__PURE__*/Object.freeze({
    children: children,
    add: add,
    put: put,
    has: has,
    index: index,
    get: get$1,
    first: first,
    last: last,
    each: each,
    removeElement: removeElement,
    clear: clear$1,
    svg: svg$1,
    writeDataToDom: writeDataToDom$1,
    flatten: flatten,
    ungroup: ungroup
  });

  // import {extend} from './tools.js'
  const extend$2 = extend$1;

  extend$2([
    Doc$1,
    Symbol,
    Image,
    Pattern,
    Marker
  ], {viewbox: Box$1.constructors.viewbox});

  extend$2([Line, Polyline, Polygon, Path], {
    ...Marker.constructors.marker
  });

  extend$2(Text$1, TextPath.constructors.Text);
  extend$2(Path, TextPath.constructors.Path);

  extend$2(Defs, {
    ...Gradient.constructors.Defs,
    ...Marker.constructors.Defs,
    ...Pattern.constructors.Defs,
  });

  extend$2([Text$1, Tspan], Tspan.constructors.Tspan);

  extend$2([Gradient, Pattern], {
    remove: patternGradientRemove,
    targets: patternGradientTargets,
    unFill: unFill,
  });

  extend$2(Gradient, {attr: gradientAttr});
  extend$2(Pattern, {attr: patternAttr});

  extend$2(ClipPath, {
    remove: clipPathRemove,
    targets: clipPathTargets
  });

  extend$2(Mask, {
    remove: maskRemove,
    targets: maskTargets
  });

  extend$2(Path, {targets: pathTargets});

  extend$2(HtmlNode, {
    add: HtmlNodeAdd
  });

  for (let i in containers) {
    extend$2(containers[i], {
      ...A.constructors.Container,
      ...ClipPath.constructors.Container,
      ...Doc$1.constructors.Container,
      ...G.constructors.Container,
      ...Gradient.constructors.Container,
      ...Line.constructors.Container,
      ...Marker.constructors.Container,
      ...Mask.constructors.Container,
      ...Path.constructors.Container,
      ...Pattern.constructors.Container,
      ...Polygon.constructors.Container,
      ...Polyline.constructors.Container,
      ...Rect.constructors.Container,
      find,
      ...Symbol.constructors.Container,
      ...Text$1.constructors.Container,
      ...TextPath.constructors.Container,
      ...Use.constructors.Container,
    });
  }

  for (let i in elements) {
    extend$2(elements[i], {
      ...EventTarget,
      ...Element$1,
      ...Parent,
      ...arrange,
      ...A.constructors.Element,
      ...Box$1.constructors.Element,
      ...Circle.constructors.Element,
      ...ClipPath.constructors.Element,
      ...css$1,
      ...Image.constructors.Element,
      ...Mask.constructors.Element,
      ...Matrix.constructors.Element,
      ...Point.constructors.Element,
      ...Runner.constructors.Element,
      ...Timeline.constructors.Element,
      ...transform$1,
    });
  }


  // The main wrapping element
  function SVG (element) {
    return makeInstance(element)
  }

  Object.assign(SVG, Classes);
  Object.assign(SVG, tools);
  Object.assign(SVG, adopter);

  return SVG;

}());
