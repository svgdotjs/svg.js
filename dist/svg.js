/*!
* svg.js - A lightweight library for manipulating and animating SVG.
* @version 3.0.0
* https://svgdotjs.github.io/
*
* @copyright Wout Fierens <wout@mick-wout.com>
* @license MIT
*
* BUILT: Thu Nov 08 2018 11:29:15 GMT+0100 (GMT+01:00)
*/;
var SVG = (function () {
  'use strict';

  function _typeof(obj) {
    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function _objectSpread(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};
      var ownKeys = Object.keys(source);

      if (typeof Object.getOwnPropertySymbols === 'function') {
        ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
          return Object.getOwnPropertyDescriptor(source, sym).enumerable;
        }));
      }

      ownKeys.forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    }

    return target;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true
      }
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
  }

  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  function _possibleConstructorReturn(self, call) {
    if (call && (typeof call === "object" || typeof call === "function")) {
      return call;
    }

    return _assertThisInitialized(self);
  }

  function _superPropBase(object, property) {
    while (!Object.prototype.hasOwnProperty.call(object, property)) {
      object = _getPrototypeOf(object);
      if (object === null) break;
    }

    return object;
  }

  function _get(target, property, receiver) {
    if (typeof Reflect !== "undefined" && Reflect.get) {
      _get = Reflect.get;
    } else {
      _get = function _get(target, property, receiver) {
        var base = _superPropBase(target, property);

        if (!base) return;
        var desc = Object.getOwnPropertyDescriptor(base, property);

        if (desc.get) {
          return desc.get.call(receiver);
        }

        return desc.value;
      };
    }

    return _get(target, property, receiver || target);
  }

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
  }

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

      return arr2;
    }
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArray(iter) {
    if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
  }

  function _iterableToArrayLimit(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance");
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance");
  }

  // Map function
  function map(array, block) {
    var i;
    var il = array.length;
    var result = [];

    for (i = 0; i < il; i++) {
      result.push(block(array[i]));
    }

    return result;
  } // Filter function

  function filter(array, block) {
    var i;
    var il = array.length;
    var result = [];

    for (i = 0; i < il; i++) {
      if (block(array[i])) {
        result.push(array[i]);
      }
    }

    return result;
  } // Degrees to radians

  function radians(d) {
    return d % 360 * Math.PI / 180;
  } // Radians to degrees

  function degrees(r) {
    return r * 180 / Math.PI % 360;
  } // Convert dash-separated-string to camelCase

  function camelCase(s) {
    return s.toLowerCase().replace(/-(.)/g, function (m, g) {
      return g.toUpperCase();
    });
  } // Convert camel cased string to string seperated

  function unCamelCase(s) {
    return s.replace(/([A-Z])/g, function (m, g) {
      return '-' + g.toLowerCase();
    });
  } // Capitalize first letter of a string

  function capitalize(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
  } // Calculate proportional width and height values when necessary

  function proportionalSize(element, width, height) {
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
    };
  }
  function getOrigin(o, element) {
    // Allow origin or around as the names
    var origin = o.origin; // o.around == null ? o.origin : o.around

    var ox, oy; // Allow the user to pass a string to rotate around a given point

    if (typeof origin === 'string' || origin == null) {
      // Get the bounding box of the element with no transformations applied
      var string = (origin || 'center').toLowerCase().trim();

      var _element$bbox = element.bbox(),
          height = _element$bbox.height,
          width = _element$bbox.width,
          x = _element$bbox.x,
          y = _element$bbox.y; // Calculate the transformed x and y coordinates


      var bx = string.includes('left') ? x : string.includes('right') ? x + width : x + width / 2;
      var by = string.includes('top') ? y : string.includes('bottom') ? y + height : y + height / 2; // Set the bounds eg : "bottom-left", "Top right", "middle" etc...

      ox = o.ox != null ? o.ox : bx;
      oy = o.oy != null ? o.oy : by;
    } else {
      ox = origin[0];
      oy = origin[1];
    } // Return the origin as it is if it wasn't a string


    return [ox, oy];
  }

  // Default namespaces
  var ns = 'http://www.w3.org/2000/svg';
  var xmlns = 'http://www.w3.org/2000/xmlns/';
  var xlink = 'http://www.w3.org/1999/xlink';
  var svgjs = 'http://svgjs.com/svgjs';

  var Base = function Base() {
    _classCallCheck(this, Base);
  };

  var elements = {};
  var root = Symbol('root'); // Method for element creation

  function makeNode(name) {
    // create element
    return document.createElementNS(ns, name);
  }
  function makeInstance(element) {
    if (element instanceof Base) return element;

    if (_typeof(element) === 'object') {
      return adopt(element);
    }

    if (element == null) {
      return new elements[root]();
    }

    if (typeof element === 'string' && element.charAt(0) !== '<') {
      return adopt(document.querySelector(element));
    }

    var node = makeNode('svg');
    node.innerHTML = element; // We can use firstChild here because we know,
    // that the first char is < and thus an element

    element = adopt(node.firstChild);
    return element;
  }
  function nodeOrNew(name, node) {
    return node || makeNode(name);
  } // Adopt existing svg elements

  function adopt(node) {
    // check for presence of node
    if (!node) return null; // make sure a node isn't already adopted

    if (node.instance instanceof Base) return node.instance;

    if (!(node instanceof window.SVGElement)) {
      return new elements.HtmlNode(node);
    } // initialize variables


    var element; // adopt with element-specific settings

    if (node.nodeName === 'svg') {
      element = new elements[root](node);
    } else if (node.nodeName === 'linearGradient' || node.nodeName === 'radialGradient') {
      element = new elements.Gradient(node);
    } else if (elements[capitalize(node.nodeName)]) {
      element = new elements[capitalize(node.nodeName)](node);
    } else {
      element = new elements.Bare(node);
    }

    return element;
  }
  function register(element) {
    var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : element.name;
    var asRoot = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    elements[name] = element;
    if (asRoot) elements[root] = element;
    return element;
  }
  function getClass(name) {
    return elements[name];
  } // Element id sequence

  var did = 1000; // Get next named element id

  function eid(name) {
    return 'Svgjs' + capitalize(name) + did++;
  } // Deep new id assignment

  function assignNewId(node) {
    // do the same for SVG child nodes as well
    for (var i = node.children.length - 1; i >= 0; i--) {
      assignNewId(node.children[i]);
    }

    if (node.id) {
      return adopt(node).id(eid(node.nodeName));
    }

    return adopt(node);
  } // Method for extending objects

  function extend(modules, methods) {
    var key, i;
    modules = Array.isArray(modules) ? modules : [modules];

    for (i = modules.length - 1; i >= 0; i--) {
      for (key in methods) {
        modules[i].prototype[key] = methods[key];
      }
    }
  }

  var methods = {};
  function registerMethods(name, m) {
    if (Array.isArray(name)) {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = name[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _name = _step.value;
          registerMethods(_name, m);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return != null) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return;
    }

    if (_typeof(name) === 'object') {
      var _arr = Object.entries(name);

      for (var _i = 0; _i < _arr.length; _i++) {
        var _arr$_i = _slicedToArray(_arr[_i], 2),
            _name2 = _arr$_i[0],
            _m = _arr$_i[1];

        registerMethods(_name2, _m);
      }

      return;
    }

    methods[name] = Object.assign(methods[name] || {}, m);
  }
  function getMethodsFor(name) {
    return methods[name] || {};
  }

  function siblings() {
    return this.parent().children();
  } // Get the curent position siblings

  function position() {
    return this.parent().index(this);
  } // Get the next element (will return null if there is none)

  function next() {
    return this.siblings()[this.position() + 1];
  } // Get the next element (will return null if there is none)

  function prev() {
    return this.siblings()[this.position() - 1];
  } // Send given element one step forward

  function forward() {
    var i = this.position() + 1;
    var p = this.parent(); // move node one step forward

    p.removeElement(this).add(this, i); // make sure defs node is always at the top

    if (typeof p.isRoot === 'function' && p.isRoot()) {
      p.node.appendChild(p.defs().node);
    }

    return this;
  } // Send given element one step backward

  function backward() {
    var i = this.position();

    if (i > 0) {
      this.parent().removeElement(this).add(this, i - 1);
    }

    return this;
  } // Send given element all the way to the front

  function front() {
    var p = this.parent(); // Move node forward

    p.node.appendChild(this.node); // Make sure defs node is always at the top

    if (typeof p.isRoot === 'function' && p.isRoot()) {
      p.node.appendChild(p.defs().node);
    }

    return this;
  } // Send given element all the way to the back

  function back() {
    if (this.position() > 0) {
      this.parent().removeElement(this).add(this, 0);
    }

    return this;
  } // Inserts a given element before the targeted element

  function before(element) {
    element = makeInstance(element);
    element.remove();
    var i = this.position();
    this.parent().add(element, i);
    return this;
  } // Inserts a given element after the targeted element

  function after(element) {
    element = makeInstance(element);
    element.remove();
    var i = this.position();
    this.parent().add(element, i + 1);
    return this;
  }
  registerMethods('Dom', {
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

  // Parse unit value
  var numberAndUnit = /^([+-]?(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?)([a-z%]*)$/i; // Parse hex value

  var hex = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i; // Parse rgb value

  var rgb = /rgb\((\d+),(\d+),(\d+)\)/; // Parse reference id

  var reference = /(#[a-z0-9\-_]+)/i; // splits a transformation chain

  var transforms = /\)\s*,?\s*/; // Whitespace

  var whitespace = /\s/g; // Test hex value

  var isHex = /^#[a-f0-9]{3,6}$/i; // Test rgb value

  var isRgb = /^rgb\(/; // Test css declaration

  var isCss = /[^:]+:[^;]+;?/; // Test for blank string

  var isBlank = /^(\s+)?$/; // Test for numeric string

  var isNumber = /^[+-]?(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i; // Test for percent value

  var isPercent = /^-?[\d.]+%$/; // Test for image url

  var isImage = /\.(jpg|jpeg|png|gif|svg)(\?[^=]+.*)?/i; // split at whitespace and comma

  var delimiter = /[\s,]+/; // The following regex are used to parse the d attribute of a path
  // Matches all hyphens which are not after an exponent

  var hyphen = /([^e])-/gi; // Replaces and tests for all path letters

  var pathLetters = /[MLHVCSQTAZ]/gi; // yes we need this one, too

  var isPathLetter = /[MLHVCSQTAZ]/i; // matches 0.154.23.45

  var numbersWithDots = /((\d?\.\d+(?:e[+-]?\d+)?)((?:\.\d+(?:e[+-]?\d+)?)+))+/gi; // matches .

  var dots = /\./g;

  var regex = /*#__PURE__*/Object.freeze({
    numberAndUnit: numberAndUnit,
    hex: hex,
    rgb: rgb,
    reference: reference,
    transforms: transforms,
    whitespace: whitespace,
    isHex: isHex,
    isRgb: isRgb,
    isCss: isCss,
    isBlank: isBlank,
    isNumber: isNumber,
    isPercent: isPercent,
    isImage: isImage,
    delimiter: delimiter,
    hyphen: hyphen,
    pathLetters: pathLetters,
    isPathLetter: isPathLetter,
    numbersWithDots: numbersWithDots,
    dots: dots
  });

  function classes() {
    var attr = this.attr('class');
    return attr == null ? [] : attr.trim().split(delimiter);
  } // Return true if class exists on the node, false otherwise

  function hasClass(name) {
    return this.classes().indexOf(name) !== -1;
  } // Add class to the node

  function addClass(name) {
    if (!this.hasClass(name)) {
      var array = this.classes();
      array.push(name);
      this.attr('class', array.join(' '));
    }

    return this;
  } // Remove class from the node

  function removeClass(name) {
    if (this.hasClass(name)) {
      this.attr('class', this.classes().filter(function (c) {
        return c !== name;
      }).join(' '));
    }

    return this;
  } // Toggle the presence of a class on the node

  function toggleClass(name) {
    return this.hasClass(name) ? this.removeClass(name) : this.addClass(name);
  }
  registerMethods('Dom', {
    classes: classes,
    hasClass: hasClass,
    addClass: addClass,
    removeClass: removeClass,
    toggleClass: toggleClass
  });

  function css(style, val) {
    var ret = {};

    if (arguments.length === 0) {
      // get full style as object
      this.node.style.cssText.split(/\s*;\s*/).filter(function (el) {
        return !!el.length;
      }).forEach(function (el) {
        var t = el.split(/\s*:\s*/);
        ret[t[0]] = t[1];
      });
      return ret;
    }

    if (arguments.length < 2) {
      // get style properties in the array
      if (Array.isArray(style)) {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = style[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var name = _step.value;
            var cased = camelCase(name);
            ret[cased] = this.node.style[cased];
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return != null) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }

        return ret;
      } // get style for property


      if (typeof style === 'string') {
        return this.node.style[camelCase(style)];
      } // set styles in object


      if (_typeof(style) === 'object') {
        for (var _name in style) {
          // set empty string if null/undefined/'' was given
          this.node.style[camelCase(_name)] = style[_name] == null || isBlank.test(style[_name]) ? '' : style[_name];
        }
      }
    } // set style for property


    if (arguments.length === 2) {
      this.node.style[camelCase(style)] = val == null || isBlank.test(val) ? '' : val;
    }

    return this;
  } // Show element

  function show() {
    return this.css('display', '');
  } // Hide element

  function hide() {
    return this.css('display', 'none');
  } // Is element visible?

  function visible() {
    return this.css('display') !== 'none';
  }
  registerMethods('Dom', {
    css: css,
    show: show,
    hide: hide,
    visible: visible
  });

  function data(a, v, r) {
    if (_typeof(a) === 'object') {
      for (v in a) {
        this.data(v, a[v]);
      }
    } else if (arguments.length < 2) {
      try {
        return JSON.parse(this.attr('data-' + a));
      } catch (e) {
        return this.attr('data-' + a);
      }
    } else {
      this.attr('data-' + a, v === null ? null : r === true || typeof v === 'string' || typeof v === 'number' ? v : JSON.stringify(v));
    }

    return this;
  }
  registerMethods('Dom', {
    data: data
  });

  function remember(k, v) {
    // remember every item in an object individually
    if (_typeof(arguments[0]) === 'object') {
      for (var key in k) {
        this.remember(key, k[key]);
      }
    } else if (arguments.length === 1) {
      // retrieve memory
      return this.memory()[k];
    } else {
      // store memory
      this.memory()[k] = v;
    }

    return this;
  } // Erase a given memory

  function forget() {
    if (arguments.length === 0) {
      this._memory = {};
    } else {
      for (var i = arguments.length - 1; i >= 0; i--) {
        delete this.memory()[arguments[i]];
      }
    }

    return this;
  } // This triggers creation of a new hidden class which is not performant
  // However, this function is not rarely used so it will not happen frequently
  // Return local memory object

  function memory() {
    return this._memory = this._memory || {};
  }
  registerMethods('Dom', {
    remember: remember,
    forget: forget,
    memory: memory
  });

  var listenerId = 0;

  function getEvents(node) {
    var n = makeInstance(node).getEventHolder();
    if (!n.events) n.events = {};
    return n.events;
  }

  function getEventTarget(node) {
    return makeInstance(node).getEventTarget();
  }

  function clearEvents(node) {
    var n = makeInstance(node).getEventHolder();
    if (n.events) n.events = {};
  } // Add event binder in the SVG namespace


  function on(node, events, listener, binding, options) {
    var l = listener.bind(binding || node);
    var bag = getEvents(node);
    var n = getEventTarget(node); // events can be an array of events or a string of events

    events = Array.isArray(events) ? events : events.split(delimiter); // add id to listener

    if (!listener._svgjsListenerId) {
      listener._svgjsListenerId = ++listenerId;
    }

    events.forEach(function (event) {
      var ev = event.split('.')[0];
      var ns = event.split('.')[1] || '*'; // ensure valid object

      bag[ev] = bag[ev] || {};
      bag[ev][ns] = bag[ev][ns] || {}; // reference listener

      bag[ev][ns][listener._svgjsListenerId] = l; // add listener

      n.addEventListener(ev, l, options || false);
    });
  } // Add event unbinder in the SVG namespace

  function off(node, events, listener, options) {
    var bag = getEvents(node);
    var n = getEventTarget(node); // listener can be a function or a number

    if (typeof listener === 'function') {
      listener = listener._svgjsListenerId;
      if (!listener) return;
    } // events can be an array of events or a string or undefined


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
          for (l in bag[ev][ns]) {
            off(n, [ev, ns].join('.'), l);
          }

          delete bag[ev][ns];
        }
      } else if (ns) {
        // remove all listeners for a specific namespace
        for (event in bag) {
          for (namespace in bag[event]) {
            if (ns === namespace) {
              off(n, [event, ns].join('.'));
            }
          }
        }
      } else if (ev) {
        // remove all listeners for the event
        if (bag[ev]) {
          for (namespace in bag[ev]) {
            off(n, [ev, namespace].join('.'));
          }

          delete bag[ev];
        }
      } else {
        // remove all listeners on a given node
        for (event in bag) {
          off(n, event);
        }

        clearEvents(node);
      }
    });
  }
  function dispatch(node, event, data) {
    var n = getEventTarget(node); // Dispatch event

    if (event instanceof window.Event) {
      n.dispatchEvent(event);
    } else {
      event = new window.CustomEvent(event, {
        detail: data,
        cancelable: true
      });
      n.dispatchEvent(event);
    }

    return event;
  }

  function fullHex(hex$$1) {
    return hex$$1.length === 4 ? ['#', hex$$1.substring(1, 2), hex$$1.substring(1, 2), hex$$1.substring(2, 3), hex$$1.substring(2, 3), hex$$1.substring(3, 4), hex$$1.substring(3, 4)].join('') : hex$$1;
  } // Component to hex value


  function compToHex(comp) {
    var hex$$1 = comp.toString(16);
    return hex$$1.length === 1 ? '0' + hex$$1 : hex$$1;
  }

  var Color =
  /*#__PURE__*/
  function () {
    function Color() {
      _classCallCheck(this, Color);

      this.init.apply(this, arguments);
    }

    _createClass(Color, [{
      key: "init",
      value: function init(color, g, b) {
        var match; // initialize defaults

        this.r = 0;
        this.g = 0;
        this.b = 0;
        if (!color) return; // parse color

        if (typeof color === 'string') {
          if (isRgb.test(color)) {
            // get rgb values
            match = rgb.exec(color.replace(whitespace, '')); // parse numeric values

            this.r = parseInt(match[1]);
            this.g = parseInt(match[2]);
            this.b = parseInt(match[3]);
          } else if (isHex.test(color)) {
            // get hex values
            match = hex.exec(fullHex(color)); // parse numeric values

            this.r = parseInt(match[1], 16);
            this.g = parseInt(match[2], 16);
            this.b = parseInt(match[3], 16);
          }
        } else if (Array.isArray(color)) {
          this.r = color[0];
          this.g = color[1];
          this.b = color[2];
        } else if (_typeof(color) === 'object') {
          this.r = color.r;
          this.g = color.g;
          this.b = color.b;
        } else if (arguments.length === 3) {
          this.r = color;
          this.g = g;
          this.b = b;
        }
      } // Default to hex conversion

    }, {
      key: "toString",
      value: function toString() {
        return this.toHex();
      }
    }, {
      key: "toArray",
      value: function toArray() {
        return [this.r, this.g, this.b];
      } // Build hex value

    }, {
      key: "toHex",
      value: function toHex() {
        return '#' + compToHex(Math.round(this.r)) + compToHex(Math.round(this.g)) + compToHex(Math.round(this.b));
      } // Build rgb value

    }, {
      key: "toRgb",
      value: function toRgb() {
        return 'rgb(' + [this.r, this.g, this.b].join() + ')';
      } // Calculate true brightness

    }, {
      key: "brightness",
      value: function brightness() {
        return this.r / 255 * 0.30 + this.g / 255 * 0.59 + this.b / 255 * 0.11;
      } // Testers
      // Test if given value is a color string

    }], [{
      key: "test",
      value: function test(color) {
        color += '';
        return isHex.test(color) || isRgb.test(color);
      } // Test if given value is a rgb object

    }, {
      key: "isRgb",
      value: function isRgb$$1(color) {
        return color && typeof color.r === 'number' && typeof color.g === 'number' && typeof color.b === 'number';
      } // Test if given value is a color

    }, {
      key: "isColor",
      value: function isColor(color) {
        return this.isRgb(color) || this.test(color);
      }
    }]);

    return Color;
  }();

  var EventTarget =
  /*#__PURE__*/
  function (_Base) {
    _inherits(EventTarget, _Base);

    function EventTarget() {
      var _this;

      var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          _ref$events = _ref.events,
          events = _ref$events === void 0 ? {} : _ref$events;

      _classCallCheck(this, EventTarget);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(EventTarget).call(this));
      _this.events = events;
      return _this;
    }

    _createClass(EventTarget, [{
      key: "addEventListener",
      value: function addEventListener() {} // Bind given event to listener

    }, {
      key: "on",
      value: function on$$1(event, listener, binding, options) {
        on(this, event, listener, binding, options);

        return this;
      } // Unbind event from listener

    }, {
      key: "off",
      value: function off$$1(event, listener) {
        off(this, event, listener);

        return this;
      }
    }, {
      key: "dispatch",
      value: function dispatch$$1(event, data) {
        return dispatch(this, event, data);
      }
    }, {
      key: "dispatchEvent",
      value: function dispatchEvent(event) {
        var bag = this.getEventHolder().events;
        if (!bag) return true;
        var events = bag[event.type];

        for (var i in events) {
          for (var j in events[i]) {
            events[i][j](event);
          }
        }

        return !event.defaultPrevented;
      } // Fire given event

    }, {
      key: "fire",
      value: function fire(event, data) {
        this.dispatch(event, data);
        return this;
      }
    }, {
      key: "getEventHolder",
      value: function getEventHolder() {
        return this;
      }
    }, {
      key: "getEventTarget",
      value: function getEventTarget() {
        return this;
      }
    }, {
      key: "removeEventListener",
      value: function removeEventListener() {}
    }]);

    return EventTarget;
  }(Base);

  function noop() {} // Default animation values

  var timeline = {
    duration: 400,
    ease: '>',
    delay: 0 // Default attribute values

  };
  var attrs = {
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

  var defaults = /*#__PURE__*/Object.freeze({
    noop: noop,
    timeline: timeline,
    attrs: attrs
  });

  /* eslint no-new-func: "off" */
  var subClassArray = function () {
    try {
      // try es6 subclassing
      return Function('name', 'baseClass', '_constructor', ['baseClass = baseClass || Array', 'return {', '[name]: class extends baseClass {', 'constructor (...args) {', 'super(...args)', '_constructor && _constructor.apply(this, args)', '}', '}', '}[name]'].join('\n'));
    } catch (e) {
      // Use es5 approach
      return function (name) {
        var baseClass = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Array;

        var _constructor = arguments.length > 2 ? arguments[2] : undefined;

        var Arr = function Arr() {
          baseClass.apply(this, arguments);
          _constructor && _constructor.apply(this, arguments);
        };

        Arr.prototype = Object.create(baseClass.prototype);
        Arr.prototype.constructor = Arr;
        return Arr;
      };
    }
  }();

  var SVGArray = subClassArray('SVGArray', Array, function (arr) {
    this.init(arr);
  });
  extend(SVGArray, {
    init: function init(arr) {
      this.length = 0;
      this.push.apply(this, _toConsumableArray(this.parse(arr)));
    },
    toArray: function toArray() {
      return Array.prototype.concat.apply([], this);
    },
    toString: function toString() {
      return this.join(' ');
    },
    // Flattens the array if needed
    valueOf: function valueOf() {
      var ret = [];
      ret.push.apply(ret, _toConsumableArray(this));
      return ret;
    },
    // Parse whitespace separated string
    parse: function parse() {
      var array = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      // If already is an array, no need to parse it
      if (array instanceof Array) return array;
      return array.trim().split(delimiter).map(parseFloat);
    },
    clone: function clone() {
      return new this.constructor(this);
    },
    toSet: function toSet() {
      return new Set(this);
    }
  });

  var SVGNumber =
  /*#__PURE__*/
  function () {
    // Initialize
    function SVGNumber() {
      _classCallCheck(this, SVGNumber);

      this.init.apply(this, arguments);
    }

    _createClass(SVGNumber, [{
      key: "init",
      value: function init(value, unit) {
        unit = Array.isArray(value) ? value[1] : unit;
        value = Array.isArray(value) ? value[0] : value; // initialize defaults

        this.value = 0;
        this.unit = unit || ''; // parse value

        if (typeof value === 'number') {
          // ensure a valid numeric value
          this.value = isNaN(value) ? 0 : !isFinite(value) ? value < 0 ? -3.4e+38 : +3.4e+38 : value;
        } else if (typeof value === 'string') {
          unit = value.match(numberAndUnit);

          if (unit) {
            // make value numeric
            this.value = parseFloat(unit[1]); // normalize

            if (unit[5] === '%') {
              this.value /= 100;
            } else if (unit[5] === 's') {
              this.value *= 1000;
            } // store unit


            this.unit = unit[5];
          }
        } else {
          if (value instanceof SVGNumber) {
            this.value = value.valueOf();
            this.unit = value.unit;
          }
        }
      }
    }, {
      key: "toString",
      value: function toString() {
        return (this.unit === '%' ? ~~(this.value * 1e8) / 1e6 : this.unit === 's' ? this.value / 1e3 : this.value) + this.unit;
      }
    }, {
      key: "toJSON",
      value: function toJSON() {
        return this.toString();
      }
    }, {
      key: "toArray",
      value: function toArray() {
        return [this.value, this.unit];
      }
    }, {
      key: "valueOf",
      value: function valueOf() {
        return this.value;
      } // Add number

    }, {
      key: "plus",
      value: function plus(number) {
        number = new SVGNumber(number);
        return new SVGNumber(this + number, this.unit || number.unit);
      } // Subtract number

    }, {
      key: "minus",
      value: function minus(number) {
        number = new SVGNumber(number);
        return new SVGNumber(this - number, this.unit || number.unit);
      } // Multiply number

    }, {
      key: "times",
      value: function times(number) {
        number = new SVGNumber(number);
        return new SVGNumber(this * number, this.unit || number.unit);
      } // Divide number

    }, {
      key: "divide",
      value: function divide(number) {
        number = new SVGNumber(number);
        return new SVGNumber(this / number, this.unit || number.unit);
      }
    }]);

    return SVGNumber;
  }();

  var hooks = [];
  function registerAttrHook(fn) {
    hooks.push(fn);
  } // Set svg element attribute

  function attr(attr, val, ns) {
    var _this = this;

    // act as full getter
    if (attr == null) {
      // get an object of attributes
      attr = {};
      val = this.node.attributes;
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = val[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var node = _step.value;
          attr[node.nodeName] = isNumber.test(node.nodeValue) ? parseFloat(node.nodeValue) : node.nodeValue;
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return != null) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return attr;
    } else if (attr instanceof Array) {
      // loop through array and get all values
      return attr.reduce(function (last, curr) {
        last[curr] = _this.attr(curr);
        return last;
      }, {});
    } else if (_typeof(attr) === 'object') {
      // apply every attribute individually if an object is passed
      for (val in attr) {
        this.attr(val, attr[val]);
      }
    } else if (val === null) {
      // remove value
      this.node.removeAttribute(attr);
    } else if (val == null) {
      // act as a getter if the first and only argument is not an object
      val = this.node.getAttribute(attr);
      return val == null ? attrs[attr] : isNumber.test(val) ? parseFloat(val) : val;
    } else {
      // Loop through hooks and execute them to convert value
      val = hooks.reduce(function (_val, hook) {
        return hook(attr, _val, _this);
      }, val); // ensure correct numeric values (also accepts NaN and Infinity)

      if (typeof val === 'number') {
        val = new SVGNumber(val);
      } else if (Color.isColor(val)) {
        // ensure full hex color
        val = new Color(val);
      } else if (val.constructor === Array) {
        // Check for plain arrays and parse array values
        val = new SVGArray(val);
      } // if the passed attribute is leading...


      if (attr === 'leading') {
        // ... call the leading method instead
        if (this.leading) {
          this.leading(val);
        }
      } else {
        // set given attribute on node
        typeof ns === 'string' ? this.node.setAttributeNS(ns, attr, val.toString()) : this.node.setAttribute(attr, val.toString());
      } // rebuild if required


      if (this.rebuild && (attr === 'font-size' || attr === 'x')) {
        this.rebuild();
      }
    }

    return this;
  }

  var Dom =
  /*#__PURE__*/
  function (_EventTarget) {
    _inherits(Dom, _EventTarget);

    function Dom(node) {
      var _this2;

      _classCallCheck(this, Dom);

      _this2 = _possibleConstructorReturn(this, _getPrototypeOf(Dom).call(this, node));
      _this2.node = node;
      _this2.type = node.nodeName;
      return _this2;
    } // Add given element at a position


    _createClass(Dom, [{
      key: "add",
      value: function add(element, i) {
        element = makeInstance(element);

        if (i == null) {
          this.node.appendChild(element.node);
        } else if (element.node !== this.node.childNodes[i]) {
          this.node.insertBefore(element.node, this.node.childNodes[i]);
        }

        return this;
      } // Add element to given container and return self

    }, {
      key: "addTo",
      value: function addTo(parent) {
        return makeInstance(parent).put(this);
      } // Returns all child elements

    }, {
      key: "children",
      value: function children() {
        return map(this.node.children, function (node) {
          return adopt(node);
        });
      } // Remove all elements in this container

    }, {
      key: "clear",
      value: function clear() {
        // remove children
        while (this.node.hasChildNodes()) {
          this.node.removeChild(this.node.lastChild);
        } // remove defs reference


        delete this._defs;
        return this;
      } // Clone element

    }, {
      key: "clone",
      value: function clone() {
        // write dom data to the dom so the clone can pickup the data
        this.writeDataToDom(); // clone element and assign new id

        return assignNewId(this.node.cloneNode(true));
      } // Iterates over all children and invokes a given block

    }, {
      key: "each",
      value: function each(block, deep) {
        var children = this.children();
        var i, il;

        for (i = 0, il = children.length; i < il; i++) {
          block.apply(children[i], [i, children]);

          if (deep) {
            children[i].each(block, deep);
          }
        }

        return this;
      } // Get first child

    }, {
      key: "first",
      value: function first() {
        return adopt(this.node.firstChild);
      } // Get a element at the given index

    }, {
      key: "get",
      value: function get(i) {
        return adopt(this.node.childNodes[i]);
      }
    }, {
      key: "getEventHolder",
      value: function getEventHolder() {
        return this.node;
      }
    }, {
      key: "getEventTarget",
      value: function getEventTarget() {
        return this.node;
      } // Checks if the given element is a child

    }, {
      key: "has",
      value: function has(element) {
        return this.index(element) >= 0;
      } // Get / set id

    }, {
      key: "id",
      value: function id(_id) {
        // generate new id if no id set
        if (typeof _id === 'undefined' && !this.node.id) {
          this.node.id = eid(this.type);
        } // dont't set directly width this.node.id to make `null` work correctly


        return this.attr('id', _id);
      } // Gets index of given element

    }, {
      key: "index",
      value: function index(element) {
        return [].slice.call(this.node.childNodes).indexOf(element.node);
      } // Get the last child

    }, {
      key: "last",
      value: function last() {
        return adopt(this.node.lastChild);
      } // matches the element vs a css selector

    }, {
      key: "matches",
      value: function matches(selector) {
        var el = this.node;
        return (el.matches || el.matchesSelector || el.msMatchesSelector || el.mozMatchesSelector || el.webkitMatchesSelector || el.oMatchesSelector).call(el, selector);
      } // Returns the svg node to call native svg methods on it

    }, {
      key: "native",
      value: function native() {
        return this.node;
      } // Returns the parent element instance

    }, {
      key: "parent",
      value: function parent(type) {
        var parent = this; // check for parent

        if (!parent.node.parentNode) return null; // get parent element

        parent = adopt(parent.node.parentNode);
        if (!type) return parent; // loop trough ancestors if type is given

        while (parent && parent.node instanceof window.SVGElement) {
          if (typeof type === 'string' ? parent.matches(type) : parent instanceof type) return parent;
          parent = adopt(parent.node.parentNode);
        }
      } // Basically does the same as `add()` but returns the added element instead

    }, {
      key: "put",
      value: function put(element, i) {
        this.add(element, i);
        return element;
      } // Add element to given container and return container

    }, {
      key: "putIn",
      value: function putIn(parent) {
        return makeInstance(parent).add(this);
      } // Remove element

    }, {
      key: "remove",
      value: function remove() {
        if (this.parent()) {
          this.parent().removeElement(this);
        }

        return this;
      } // Remove a given child

    }, {
      key: "removeElement",
      value: function removeElement(element) {
        this.node.removeChild(element.node);
        return this;
      } // Replace this with element

    }, {
      key: "replace",
      value: function replace(element) {
        element = makeInstance(element);
        this.node.parentNode.replaceChild(element.node, this.node);
        return element;
      } // Return id on string conversion

    }, {
      key: "toString",
      value: function toString() {
        return this.id();
      } // Import raw svg

    }, {
      key: "svg",
      value: function svg(svgOrFn, outerHTML) {
        var well, len, fragment;

        if (svgOrFn === false) {
          outerHTML = false;
          svgOrFn = null;
        } // act as getter if no svg string is given


        if (svgOrFn == null || typeof svgOrFn === 'function') {
          // The default for exports is, that the outerNode is included
          outerHTML = outerHTML == null ? true : outerHTML; // write svgjs data to the dom

          this.writeDataToDom();
          var current = this; // An export modifier was passed

          if (svgOrFn != null) {
            current = adopt(current.node.cloneNode(true)); // If the user wants outerHTML we need to process this node, too

            if (outerHTML) {
              var result = svgOrFn(current);
              current = result || current; // The user does not want this node? Well, then he gets nothing

              if (result === false) return '';
            } // Deep loop through all children and apply modifier


            current.each(function () {
              var result = svgOrFn(this);

              var _this = result || this; // If modifier returns false, discard node


              if (result === false) {
                this.remove(); // If modifier returns new node, use it
              } else if (result && this !== _this) {
                this.replace(_this);
              }
            }, true);
          } // Return outer or inner content


          return outerHTML ? current.node.outerHTML : current.node.innerHTML;
        } // Act as setter if we got a string
        // The default for import is, that the current node is not replaced


        outerHTML = outerHTML == null ? false : outerHTML; // Create temporary holder

        well = document.createElementNS(ns, 'svg');
        fragment = document.createDocumentFragment(); // Dump raw svg

        well.innerHTML = svgOrFn; // Transplant nodes into the fragment

        for (len = well.children.length; len--;) {
          fragment.appendChild(well.firstElementChild);
        } // Add the whole fragment at once


        return outerHTML ? this.replace(fragment) : this.add(fragment);
      } // write svgjs data to the dom

    }, {
      key: "writeDataToDom",
      value: function writeDataToDom() {
        // dump variables recursively
        this.each(function () {
          this.writeDataToDom();
        });
        return this;
      }
    }]);

    return Dom;
  }(EventTarget);
  extend(Dom, {
    attr: attr
  });

  var Doc = getClass(root);

  var Element =
  /*#__PURE__*/
  function (_Dom) {
    _inherits(Element, _Dom);

    function Element(node) {
      var _this;

      _classCallCheck(this, Element);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(Element).call(this, node)); // initialize data object

      _this.dom = {}; // create circular reference

      _this.node.instance = _assertThisInitialized(_assertThisInitialized(_this));

      if (node.hasAttribute('svgjs:data')) {
        // pull svgjs data from the dom (getAttributeNS doesn't work in html5)
        _this.setData(JSON.parse(node.getAttribute('svgjs:data')) || {});
      }

      return _this;
    } // Move element by its center


    _createClass(Element, [{
      key: "center",
      value: function center(x, y) {
        return this.cx(x).cy(y);
      } // Move by center over x-axis

    }, {
      key: "cx",
      value: function cx(x) {
        return x == null ? this.x() + this.width() / 2 : this.x(x - this.width() / 2);
      } // Move by center over y-axis

    }, {
      key: "cy",
      value: function cy(y) {
        return y == null ? this.y() + this.height() / 2 : this.y(y - this.height() / 2);
      } // Get defs

    }, {
      key: "defs",
      value: function defs() {
        return this.doc().defs();
      } // Get parent document

    }, {
      key: "doc",
      value: function doc() {
        var p = this.parent(Doc);
        return p && p.doc();
      }
    }, {
      key: "getEventHolder",
      value: function getEventHolder() {
        return this;
      } // Set height of element

    }, {
      key: "height",
      value: function height(_height) {
        return this.attr('height', _height);
      } // Checks whether the given point inside the bounding box of the element

    }, {
      key: "inside",
      value: function inside(x, y) {
        var box = this.bbox();
        return x > box.x && y > box.y && x < box.x + box.width && y < box.y + box.height;
      } // Move element to given x and y values

    }, {
      key: "move",
      value: function move(x, y) {
        return this.x(x).y(y);
      } // return array of all ancestors of given type up to the root svg

    }, {
      key: "parents",
      value: function parents(type) {
        var parents = [];
        var parent = this;

        do {
          parent = parent.parent(type);
          if (!parent || parent instanceof getClass('HtmlNode')) break;
          parents.push(parent);
        } while (parent.parent);

        return parents;
      } // Get referenced element form attribute value

    }, {
      key: "reference",
      value: function reference$$1(attr) {
        attr = this.attr(attr);
        if (!attr) return null;
        var m = attr.match(reference);
        return m ? makeInstance(m[1]) : null;
      } // set given data to the elements data property

    }, {
      key: "setData",
      value: function setData(o) {
        this.dom = o;
        return this;
      } // Set element size to given width and height

    }, {
      key: "size",
      value: function size(width, height) {
        var p = proportionalSize(this, width, height);
        return this.width(new SVGNumber(p.width)).height(new SVGNumber(p.height));
      } // Set width of element

    }, {
      key: "width",
      value: function width(_width) {
        return this.attr('width', _width);
      } // write svgjs data to the dom

    }, {
      key: "writeDataToDom",
      value: function writeDataToDom() {
        // remove previously set data
        this.node.removeAttribute('svgjs:data');

        if (Object.keys(this.dom).length) {
          this.node.setAttribute('svgjs:data', JSON.stringify(this.dom)); // see #428
        }

        return _get(_getPrototypeOf(Element.prototype), "writeDataToDom", this).call(this);
      } // Move over x-axis

    }, {
      key: "x",
      value: function x(_x) {
        return this.attr('x', _x);
      } // Move over y-axis

    }, {
      key: "y",
      value: function y(_y) {
        return this.attr('y', _y);
      }
    }]);

    return Element;
  }(Dom);

  var Container =
  /*#__PURE__*/
  function (_Element) {
    _inherits(Container, _Element);

    function Container() {
      _classCallCheck(this, Container);

      return _possibleConstructorReturn(this, _getPrototypeOf(Container).apply(this, arguments));
    }

    _createClass(Container, [{
      key: "flatten",
      value: function flatten(parent) {
        this.each(function () {
          if (this instanceof Container) return this.flatten(parent).ungroup(parent);
          return this.toParent(parent);
        }); // we need this so that Doc does not get removed

        this.node.firstElementChild || this.remove();
        return this;
      }
    }, {
      key: "ungroup",
      value: function ungroup(parent) {
        parent = parent || this.parent();
        this.each(function () {
          return this.toParent(parent);
        });
        this.remove();
        return this;
      }
    }]);

    return Container;
  }(Element);

  var Defs =
  /*#__PURE__*/
  function (_Container) {
    _inherits(Defs, _Container);

    function Defs(node) {
      _classCallCheck(this, Defs);

      return _possibleConstructorReturn(this, _getPrototypeOf(Defs).call(this, nodeOrNew('defs', node), Defs));
    }

    _createClass(Defs, [{
      key: "flatten",
      value: function flatten() {
        return this;
      }
    }, {
      key: "ungroup",
      value: function ungroup() {
        return this;
      }
    }]);

    return Defs;
  }(Container);
  register(Defs);

  var Doc$1 =
  /*#__PURE__*/
  function (_Container) {
    _inherits(Doc, _Container);

    function Doc(node) {
      var _this;

      _classCallCheck(this, Doc);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(Doc).call(this, nodeOrNew('svg', node), Doc));

      _this.namespace();

      return _this;
    }

    _createClass(Doc, [{
      key: "isRoot",
      value: function isRoot() {
        return !this.node.parentNode || !(this.node.parentNode instanceof window.SVGElement) || this.node.parentNode.nodeName === '#document';
      } // Check if this is a root svg
      // If not, call docs from this element

    }, {
      key: "doc",
      value: function doc() {
        if (this.isRoot()) return this;
        return _get(_getPrototypeOf(Doc.prototype), "doc", this).call(this);
      } // Add namespaces

    }, {
      key: "namespace",
      value: function namespace() {
        if (!this.isRoot()) return this.doc().namespace();
        return this.attr({
          xmlns: ns,
          version: '1.1'
        }).attr('xmlns:xlink', xlink, xmlns).attr('xmlns:svgjs', svgjs, xmlns);
      } // Creates and returns defs element

    }, {
      key: "defs",
      value: function defs() {
        if (!this.isRoot()) return this.doc().defs();
        return adopt(this.node.getElementsByTagName('defs')[0]) || this.put(new Defs());
      } // custom parent method

    }, {
      key: "parent",
      value: function parent(type) {
        if (this.isRoot()) {
          return this.node.parentNode.nodeName === '#document' ? null : adopt(this.node.parentNode);
        }

        return _get(_getPrototypeOf(Doc.prototype), "parent", this).call(this, type);
      }
    }, {
      key: "clear",
      value: function clear() {
        // remove children
        while (this.node.hasChildNodes()) {
          this.node.removeChild(this.node.lastChild);
        }

        return this;
      }
    }]);

    return Doc;
  }(Container);
  registerMethods({
    Container: {
      // Create nested svg document
      nested: function nested() {
        return this.put(new Doc$1());
      }
    }
  });
  register(Doc$1, 'Doc', true);

  function parser() {
    // Reuse cached element if possible
    if (!parser.nodes) {
      var svg = new Doc$1().size(2, 0);
      svg.node.cssText = ['opacity: 0', 'position: absolute', 'left: -100%', 'top: -100%', 'overflow: hidden'].join(';');
      var path = svg.path().node;
      parser.nodes = {
        svg: svg,
        path: path
      };
    }

    if (!parser.nodes.svg.node.parentNode) {
      var b = document.body || document.documentElement;
      parser.nodes.svg.addTo(b);
    }

    return parser.nodes;
  }

  var Point =
  /*#__PURE__*/
  function () {
    // Initialize
    function Point(x, y, base) {
      _classCallCheck(this, Point);

      var source;
      base = base || {
        x: 0,
        y: 0 // ensure source as object

      };
      source = Array.isArray(x) ? {
        x: x[0],
        y: x[1]
      } : _typeof(x) === 'object' ? {
        x: x.x,
        y: x.y
      } : {
        x: x,
        y: y // merge source

      };
      this.x = source.x == null ? base.x : source.x;
      this.y = source.y == null ? base.y : source.y;
    } // Clone point


    _createClass(Point, [{
      key: "clone",
      value: function clone() {
        return new Point(this);
      } // Convert to native SVGPoint

    }, {
      key: "native",
      value: function native() {
        // create new point
        var point = parser().svg.node.createSVGPoint(); // update with current values

        point.x = this.x;
        point.y = this.y;
        return point;
      } // transform point with matrix

    }, {
      key: "transform",
      value: function transform(m) {
        // Perform the matrix multiplication
        var x = m.a * this.x + m.c * this.y + m.e;
        var y = m.b * this.x + m.d * this.y + m.f; // Return the required point

        return new Point(x, y);
      }
    }]);

    return Point;
  }();
  registerMethods({
    Element: {
      // Get point
      point: function point(x, y) {
        return new Point(x, y).transform(this.screenCTM().inverse());
      }
    }
  });

  var abcdef = 'abcdef'.split('');

  function closeEnough(a, b, threshold) {
    return Math.abs(b - a) < (threshold || 1e-6);
  }

  var Matrix =
  /*#__PURE__*/
  function () {
    function Matrix() {
      _classCallCheck(this, Matrix);

      this.init.apply(this, arguments);
    } // Initialize


    _createClass(Matrix, [{
      key: "init",
      value: function init(source) {
        var base = Matrix.fromArray([1, 0, 0, 1, 0, 0]); // ensure source as object

        source = source instanceof Element ? source.matrixify() : typeof source === 'string' ? Matrix.fromArray(source.split(delimiter).map(parseFloat)) : Array.isArray(source) ? Matrix.fromArray(source) : _typeof(source) === 'object' && Matrix.isMatrixLike(source) ? source : _typeof(source) === 'object' ? new Matrix().transform(source) : arguments.length === 6 ? Matrix.fromArray([].slice.call(arguments)) : base; // Merge the source matrix with the base matrix

        this.a = source.a != null ? source.a : base.a;
        this.b = source.b != null ? source.b : base.b;
        this.c = source.c != null ? source.c : base.c;
        this.d = source.d != null ? source.d : base.d;
        this.e = source.e != null ? source.e : base.e;
        this.f = source.f != null ? source.f : base.f;
      } // Clones this matrix

    }, {
      key: "clone",
      value: function clone() {
        return new Matrix(this);
      } // Transform a matrix into another matrix by manipulating the space

    }, {
      key: "transform",
      value: function transform(o) {
        // Check if o is a matrix and then left multiply it directly
        if (Matrix.isMatrixLike(o)) {
          var matrix = new Matrix(o);
          return matrix.multiplyO(this);
        } // Get the proposed transformations and the current transformations


        var t = Matrix.formatTransforms(o);
        var current = this;

        var _transform = new Point(t.ox, t.oy).transform(current),
            ox = _transform.x,
            oy = _transform.y; // Construct the resulting matrix


        var transformer = new Matrix().translateO(t.rx, t.ry).lmultiplyO(current).translateO(-ox, -oy).scaleO(t.scaleX, t.scaleY).skewO(t.skewX, t.skewY).shearO(t.shear).rotateO(t.theta).translateO(ox, oy); // If we want the origin at a particular place, we force it there

        if (isFinite(t.px) || isFinite(t.py)) {
          var origin = new Point(ox, oy).transform(transformer); // TODO: Replace t.px with isFinite(t.px)

          var dx = t.px ? t.px - origin.x : 0;
          var dy = t.py ? t.py - origin.y : 0;
          transformer.translateO(dx, dy);
        } // Translate now after positioning


        transformer.translateO(t.tx, t.ty);
        return transformer;
      } // Applies a matrix defined by its affine parameters

    }, {
      key: "compose",
      value: function compose(o) {
        if (o.origin) {
          o.originX = o.origin[0];
          o.originY = o.origin[1];
        } // Get the parameters


        var ox = o.originX || 0;
        var oy = o.originY || 0;
        var sx = o.scaleX || 1;
        var sy = o.scaleY || 1;
        var lam = o.shear || 0;
        var theta = o.rotate || 0;
        var tx = o.translateX || 0;
        var ty = o.translateY || 0; // Apply the standard matrix

        var result = new Matrix().translateO(-ox, -oy).scaleO(sx, sy).shearO(lam).rotateO(theta).translateO(tx, ty).lmultiplyO(this).translateO(ox, oy);
        return result;
      } // Decomposes this matrix into its affine parameters

    }, {
      key: "decompose",
      value: function decompose() {
        var cx = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
        var cy = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
        // Get the parameters from the matrix
        var a = this.a;
        var b = this.b;
        var c = this.c;
        var d = this.d;
        var e = this.e;
        var f = this.f; // Figure out if the winding direction is clockwise or counterclockwise

        var determinant = a * d - b * c;
        var ccw = determinant > 0 ? 1 : -1; // Since we only shear in x, we can use the x basis to get the x scale
        // and the rotation of the resulting matrix

        var sx = ccw * Math.sqrt(a * a + b * b);
        var thetaRad = Math.atan2(ccw * b, ccw * a);
        var theta = 180 / Math.PI * thetaRad;
        var ct = Math.cos(thetaRad);
        var st = Math.sin(thetaRad); // We can then solve the y basis vector simultaneously to get the other
        // two affine parameters directly from these parameters

        var lam = (a * c + b * d) / determinant;
        var sy = c * sx / (lam * a - b) || d * sx / (lam * b + a); // Use the translations

        var tx = e - cx + cx * ct * sx + cy * (lam * ct * sx - st * sy);
        var ty = f - cy + cx * st * sx + cy * (lam * st * sx + ct * sy); // Construct the decomposition and return it

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
        };
      } // Left multiplies by the given matrix

    }, {
      key: "multiply",
      value: function multiply(matrix) {
        return this.clone().multiplyO(matrix);
      }
    }, {
      key: "multiplyO",
      value: function multiplyO(matrix) {
        // Get the matrices
        var l = this;
        var r = matrix instanceof Matrix ? matrix : new Matrix(matrix);
        return Matrix.matrixMultiply(l, r, this);
      }
    }, {
      key: "lmultiply",
      value: function lmultiply(matrix) {
        return this.clone().lmultiplyO(matrix);
      }
    }, {
      key: "lmultiplyO",
      value: function lmultiplyO(matrix) {
        var r = this;
        var l = matrix instanceof Matrix ? matrix : new Matrix(matrix);
        return Matrix.matrixMultiply(l, r, this);
      } // Inverses matrix

    }, {
      key: "inverseO",
      value: function inverseO() {
        // Get the current parameters out of the matrix
        var a = this.a;
        var b = this.b;
        var c = this.c;
        var d = this.d;
        var e = this.e;
        var f = this.f; // Invert the 2x2 matrix in the top left

        var det = a * d - b * c;
        if (!det) throw new Error('Cannot invert ' + this); // Calculate the top 2x2 matrix

        var na = d / det;
        var nb = -b / det;
        var nc = -c / det;
        var nd = a / det; // Apply the inverted matrix to the top right

        var ne = -(na * e + nc * f);
        var nf = -(nb * e + nd * f); // Construct the inverted matrix

        this.a = na;
        this.b = nb;
        this.c = nc;
        this.d = nd;
        this.e = ne;
        this.f = nf;
        return this;
      }
    }, {
      key: "inverse",
      value: function inverse() {
        return this.clone().inverseO();
      } // Translate matrix

    }, {
      key: "translate",
      value: function translate(x, y) {
        return this.clone().translateO(x, y);
      }
    }, {
      key: "translateO",
      value: function translateO(x, y) {
        this.e += x || 0;
        this.f += y || 0;
        return this;
      } // Scale matrix

    }, {
      key: "scale",
      value: function scale(x, y, cx, cy) {
        var _this$clone;

        return (_this$clone = this.clone()).scaleO.apply(_this$clone, arguments);
      }
    }, {
      key: "scaleO",
      value: function scaleO(x) {
        var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : x;
        var cx = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
        var cy = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

        // Support uniform scaling
        if (arguments.length === 3) {
          cy = cx;
          cx = y;
          y = x;
        }

        var a = this.a,
            b = this.b,
            c = this.c,
            d = this.d,
            e = this.e,
            f = this.f;
        this.a = a * x;
        this.b = b * y;
        this.c = c * x;
        this.d = d * y;
        this.e = e * x - cx * x + cx;
        this.f = f * y - cy * y + cy;
        return this;
      } // Rotate matrix

    }, {
      key: "rotate",
      value: function rotate(r, cx, cy) {
        return this.clone().rotateO(r, cx, cy);
      }
    }, {
      key: "rotateO",
      value: function rotateO(r) {
        var cx = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
        var cy = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
        // Convert degrees to radians
        r = radians(r);
        var cos = Math.cos(r);
        var sin = Math.sin(r);
        var a = this.a,
            b = this.b,
            c = this.c,
            d = this.d,
            e = this.e,
            f = this.f;
        this.a = a * cos - b * sin;
        this.b = b * cos + a * sin;
        this.c = c * cos - d * sin;
        this.d = d * cos + c * sin;
        this.e = e * cos - f * sin + cy * sin - cx * cos + cx;
        this.f = f * cos + e * sin - cx * sin - cy * cos + cy;
        return this;
      } // Flip matrix on x or y, at a given offset

    }, {
      key: "flip",
      value: function flip(axis, around) {
        return this.clone().flipO(axis, around);
      }
    }, {
      key: "flipO",
      value: function flipO(axis, around) {
        return axis === 'x' ? this.scaleO(-1, 1, around, 0) : axis === 'y' ? this.scaleO(1, -1, 0, around) : this.scaleO(-1, -1, axis, around || axis); // Define an x, y flip point
      } // Shear matrix

    }, {
      key: "shear",
      value: function shear(a, cx, cy) {
        return this.clone().shearO(a, cx, cy);
      }
    }, {
      key: "shearO",
      value: function shearO(lx) {
        var cy = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
        var a = this.a,
            b = this.b,
            c = this.c,
            d = this.d,
            e = this.e,
            f = this.f;
        this.a = a + b * lx;
        this.c = c + d * lx;
        this.e = e + f * lx - cy * lx;
        return this;
      } // Skew Matrix

    }, {
      key: "skew",
      value: function skew(x, y, cx, cy) {
        var _this$clone2;

        return (_this$clone2 = this.clone()).skewO.apply(_this$clone2, arguments);
      }
    }, {
      key: "skewO",
      value: function skewO(x) {
        var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : x;
        var cx = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
        var cy = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

        // support uniformal skew
        if (arguments.length === 3) {
          cy = cx;
          cx = y;
          y = x;
        } // Convert degrees to radians


        x = radians(x);
        y = radians(y);
        var lx = Math.tan(x);
        var ly = Math.tan(y);
        var a = this.a,
            b = this.b,
            c = this.c,
            d = this.d,
            e = this.e,
            f = this.f;
        this.a = a + b * lx;
        this.b = b + a * ly;
        this.c = c + d * lx;
        this.d = d + c * ly;
        this.e = e + f * lx - cy * lx;
        this.f = f + e * ly - cx * ly;
        return this;
      } // SkewX

    }, {
      key: "skewX",
      value: function skewX(x, cx, cy) {
        return this.skew(x, 0, cx, cy);
      }
    }, {
      key: "skewXO",
      value: function skewXO(x, cx, cy) {
        return this.skewO(x, 0, cx, cy);
      } // SkewY

    }, {
      key: "skewY",
      value: function skewY(y, cx, cy) {
        return this.skew(0, y, cx, cy);
      }
    }, {
      key: "skewYO",
      value: function skewYO(y, cx, cy) {
        return this.skewO(0, y, cx, cy);
      } // Transform around a center point

    }, {
      key: "aroundO",
      value: function aroundO(cx, cy, matrix) {
        var dx = cx || 0;
        var dy = cy || 0;
        return this.translateO(-dx, -dy).lmultiplyO(matrix).translateO(dx, dy);
      }
    }, {
      key: "around",
      value: function around(cx, cy, matrix) {
        return this.clone().aroundO(cx, cy, matrix);
      } // Convert to native SVGMatrix

    }, {
      key: "native",
      value: function native() {
        // create new matrix
        var matrix = parser().svg.node.createSVGMatrix(); // update with current values

        for (var i = abcdef.length - 1; i >= 0; i--) {
          matrix[abcdef[i]] = this[abcdef[i]];
        }

        return matrix;
      } // Check if two matrices are equal

    }, {
      key: "equals",
      value: function equals(other) {
        var comp = new Matrix(other);
        return closeEnough(this.a, comp.a) && closeEnough(this.b, comp.b) && closeEnough(this.c, comp.c) && closeEnough(this.d, comp.d) && closeEnough(this.e, comp.e) && closeEnough(this.f, comp.f);
      } // Convert matrix to string

    }, {
      key: "toString",
      value: function toString() {
        return 'matrix(' + this.a + ',' + this.b + ',' + this.c + ',' + this.d + ',' + this.e + ',' + this.f + ')';
      }
    }, {
      key: "toArray",
      value: function toArray() {
        return [this.a, this.b, this.c, this.d, this.e, this.f];
      }
    }, {
      key: "valueOf",
      value: function valueOf() {
        return {
          a: this.a,
          b: this.b,
          c: this.c,
          d: this.d,
          e: this.e,
          f: this.f
        };
      }
    }], [{
      key: "fromArray",
      value: function fromArray(a) {
        return {
          a: a[0],
          b: a[1],
          c: a[2],
          d: a[3],
          e: a[4],
          f: a[5]
        };
      }
    }, {
      key: "isMatrixLike",
      value: function isMatrixLike(o) {
        return o.a != null || o.b != null || o.c != null || o.d != null || o.e != null || o.f != null;
      }
    }, {
      key: "formatTransforms",
      value: function formatTransforms(o) {
        // Get all of the parameters required to form the matrix
        var flipBoth = o.flip === 'both' || o.flip === true;
        var flipX = o.flip && (flipBoth || o.flip === 'x') ? -1 : 1;
        var flipY = o.flip && (flipBoth || o.flip === 'y') ? -1 : 1;
        var skewX = o.skew && o.skew.length ? o.skew[0] : isFinite(o.skew) ? o.skew : isFinite(o.skewX) ? o.skewX : 0;
        var skewY = o.skew && o.skew.length ? o.skew[1] : isFinite(o.skew) ? o.skew : isFinite(o.skewY) ? o.skewY : 0;
        var scaleX = o.scale && o.scale.length ? o.scale[0] * flipX : isFinite(o.scale) ? o.scale * flipX : isFinite(o.scaleX) ? o.scaleX * flipX : flipX;
        var scaleY = o.scale && o.scale.length ? o.scale[1] * flipY : isFinite(o.scale) ? o.scale * flipY : isFinite(o.scaleY) ? o.scaleY * flipY : flipY;
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
        var ry = relative.y; // Populate all of the values

        return {
          scaleX: scaleX,
          scaleY: scaleY,
          skewX: skewX,
          skewY: skewY,
          shear: shear,
          theta: theta,
          rx: rx,
          ry: ry,
          tx: tx,
          ty: ty,
          ox: ox,
          oy: oy,
          px: px,
          py: py
        };
      } // left matrix, right matrix, target matrix which is overwritten

    }, {
      key: "matrixMultiply",
      value: function matrixMultiply(l, r, o) {
        // Work out the product directly
        var a = l.a * r.a + l.c * r.b;
        var b = l.b * r.a + l.d * r.b;
        var c = l.a * r.c + l.c * r.d;
        var d = l.b * r.c + l.d * r.d;
        var e = l.e + l.a * r.e + l.c * r.f;
        var f = l.f + l.b * r.e + l.d * r.f; // make sure to use local variables because l/r and o could be the same

        o.a = a;
        o.b = b;
        o.c = c;
        o.d = d;
        o.e = e;
        o.f = f;
        return o;
      }
    }]);

    return Matrix;
  }();
  registerMethods({
    Element: {
      // Get current matrix
      ctm: function ctm() {
        return new Matrix(this.node.getCTM());
      },
      // Get current screen matrix
      screenCTM: function screenCTM() {
        /* https://bugzilla.mozilla.org/show_bug.cgi?id=1344537
           This is needed because FF does not return the transformation matrix
           for the inner coordinate system when getScreenCTM() is called on nested svgs.
           However all other Browsers do that */
        if (typeof this.isRoot === 'function' && !this.isRoot()) {
          var rect = this.rect(1, 1);
          var m = rect.node.getScreenCTM();
          rect.remove();
          return new Matrix(m);
        }

        return new Matrix(this.node.getScreenCTM());
      }
    }
  });

  /***
  Base Class
  ==========
  The base stepper class that will be
  ***/

  function makeSetterGetter(k, f) {
    return function (v) {
      if (v == null) return this[v];
      this[k] = v;
      if (f) f.call(this);
      return this;
    };
  }

  var easing = {
    '-': function _(pos) {
      return pos;
    },
    '<>': function _(pos) {
      return -Math.cos(pos * Math.PI) / 2 + 0.5;
    },
    '>': function _(pos) {
      return Math.sin(pos * Math.PI / 2);
    },
    '<': function _(pos) {
      return -Math.cos(pos * Math.PI / 2) + 1;
    },
    bezier: function bezier(x1, y1, x2, y2) {
      // see https://www.w3.org/TR/css-easing-1/#cubic-bezier-algo
      return function (t) {
        if (t < 0) {
          if (x1 > 0) {
            return y1 / x1 * t;
          } else if (x2 > 0) {
            return y2 / x2 * t;
          } else {
            return 0;
          }
        } else if (t > 1) {
          if (x2 < 1) {
            return (1 - y2) / (1 - x2) * t + (y2 - x2) / (1 - x2);
          } else if (x1 < 1) {
            return (1 - y1) / (1 - x1) * t + (y1 - x1) / (1 - x1);
          } else {
            return 1;
          }
        } else {
          return 3 * t * Math.pow(1 - t, 2) * y1 + 3 * Math.pow(t, 2) * (1 - t) * y2 + Math.pow(t, 3);
        }
      };
    },
    // https://www.w3.org/TR/css-easing-1/#step-timing-function-algo
    steps: function steps(_steps) {
      var stepPosition = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'end';
      // deal with "jump-" prefix
      stepPosition = stepPosition.split('-').reverse()[0];
      var jumps = _steps;

      if (stepPosition === 'none') {
        --jumps;
      } else if (stepPosition === 'both') {
        ++jumps;
      } // The beforeFlag is essentially useless


      return function (t) {
        var beforeFlag = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
        // Step is called currentStep in referenced url
        var step = Math.floor(t * _steps);
        var jumping = t * step % 1 === 0;

        if (stepPosition === 'start' || stepPosition === 'both') {
          ++step;
        }

        if (beforeFlag && jumping) {
          --step;
        }

        if (t >= 0 && step < 0) {
          step = 0;
        }

        if (t <= 1 && step > jumps) {
          step = jumps;
        }

        return step / jumps;
      };
    }
  };
  var Stepper =
  /*#__PURE__*/
  function () {
    function Stepper() {
      _classCallCheck(this, Stepper);
    }

    _createClass(Stepper, [{
      key: "done",
      value: function done() {
        return false;
      }
    }]);

    return Stepper;
  }();
  /***
  Easing Functions
  ================
  ***/

  var Ease =
  /*#__PURE__*/
  function (_Stepper) {
    _inherits(Ease, _Stepper);

    function Ease(fn) {
      var _this;

      _classCallCheck(this, Ease);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(Ease).call(this));
      _this.ease = easing[fn || timeline.ease] || fn;
      return _this;
    }

    _createClass(Ease, [{
      key: "step",
      value: function step(from, to, pos) {
        if (typeof from !== 'number') {
          return pos < 1 ? from : to;
        }

        return from + (to - from) * this.ease(pos);
      }
    }]);

    return Ease;
  }(Stepper);
  /***
  Controller Types
  ================
  ***/

  var Controller =
  /*#__PURE__*/
  function (_Stepper2) {
    _inherits(Controller, _Stepper2);

    function Controller(fn) {
      var _this2;

      _classCallCheck(this, Controller);

      _this2 = _possibleConstructorReturn(this, _getPrototypeOf(Controller).call(this));
      _this2.stepper = fn;
      return _this2;
    }

    _createClass(Controller, [{
      key: "step",
      value: function step(current, target, dt, c) {
        return this.stepper(current, target, dt, c);
      }
    }, {
      key: "done",
      value: function done(c) {
        return c.done;
      }
    }]);

    return Controller;
  }(Stepper);

  function recalculate() {
    // Apply the default parameters
    var duration = (this._duration || 500) / 1000;
    var overshoot = this._overshoot || 0; // Calculate the PID natural response

    var eps = 1e-10;
    var pi = Math.PI;
    var os = Math.log(overshoot / 100 + eps);
    var zeta = -os / Math.sqrt(pi * pi + os * os);
    var wn = 3.9 / (zeta * duration); // Calculate the Spring values

    this.d = 2 * zeta * wn;
    this.k = wn * wn;
  }

  var Spring =
  /*#__PURE__*/
  function (_Controller) {
    _inherits(Spring, _Controller);

    function Spring(duration, overshoot) {
      var _this3;

      _classCallCheck(this, Spring);

      _this3 = _possibleConstructorReturn(this, _getPrototypeOf(Spring).call(this));

      _this3.duration(duration || 500).overshoot(overshoot || 0);

      return _this3;
    }

    _createClass(Spring, [{
      key: "step",
      value: function step(current, target, dt, c) {
        if (typeof current === 'string') return current;
        c.done = dt === Infinity;
        if (dt === Infinity) return target;
        if (dt === 0) return current;
        if (dt > 100) dt = 16;
        dt /= 1000; // Get the previous velocity

        var velocity = c.velocity || 0; // Apply the control to get the new position and store it

        var acceleration = -this.d * velocity - this.k * (current - target);
        var newPosition = current + velocity * dt + acceleration * dt * dt / 2; // Store the velocity

        c.velocity = velocity + acceleration * dt; // Figure out if we have converged, and if so, pass the value

        c.done = Math.abs(target - newPosition) + Math.abs(velocity) < 0.002;
        return c.done ? target : newPosition;
      }
    }]);

    return Spring;
  }(Controller);
  extend(Spring, {
    duration: makeSetterGetter('_duration', recalculate),
    overshoot: makeSetterGetter('_overshoot', recalculate)
  });
  var PID =
  /*#__PURE__*/
  function (_Controller2) {
    _inherits(PID, _Controller2);

    function PID(p, i, d, windup) {
      var _this4;

      _classCallCheck(this, PID);

      _this4 = _possibleConstructorReturn(this, _getPrototypeOf(PID).call(this));
      p = p == null ? 0.1 : p;
      i = i == null ? 0.01 : i;
      d = d == null ? 0 : d;
      windup = windup == null ? 1000 : windup;

      _this4.p(p).i(i).d(d).windup(windup);

      return _this4;
    }

    _createClass(PID, [{
      key: "step",
      value: function step(current, target, dt, c) {
        if (typeof current === 'string') return current;
        c.done = dt === Infinity;
        if (dt === Infinity) return target;
        if (dt === 0) return current;
        var p = target - current;
        var i = (c.integral || 0) + p * dt;
        var d = (p - (c.error || 0)) / dt;
        var windup = this.windup; // antiwindup

        if (windup !== false) {
          i = Math.max(-windup, Math.min(i, windup));
        }

        c.error = p;
        c.integral = i;
        c.done = Math.abs(p) < 0.001;
        return c.done ? target : current + (this.P * p + this.I * i + this.D * d);
      }
    }]);

    return PID;
  }(Controller);
  extend(PID, {
    windup: makeSetterGetter('windup'),
    p: makeSetterGetter('P'),
    i: makeSetterGetter('I'),
    d: makeSetterGetter('D')
  });

  function from(x, y) {
    return (this._element || this).type === 'radialGradient' ? this.attr({
      fx: new SVGNumber(x),
      fy: new SVGNumber(y)
    }) : this.attr({
      x1: new SVGNumber(x),
      y1: new SVGNumber(y)
    });
  }
  function to(x, y) {
    return (this._element || this).type === 'radialGradient' ? this.attr({
      cx: new SVGNumber(x),
      cy: new SVGNumber(y)
    }) : this.attr({
      x2: new SVGNumber(x),
      y2: new SVGNumber(y)
    });
  }

  var gradiented = /*#__PURE__*/Object.freeze({
    from: from,
    to: to
  });

  function rx(rx) {
    return this.attr('rx', rx);
  } // Radius y value

  function ry(ry) {
    return this.attr('ry', ry);
  } // Move over x-axis

  function x(x) {
    return x == null ? this.cx() - this.rx() : this.cx(x + this.rx());
  } // Move over y-axis

  function y(y) {
    return y == null ? this.cy() - this.ry() : this.cy(y + this.ry());
  } // Move by center over x-axis

  function cx(x) {
    return x == null ? this.attr('cx') : this.attr('cx', x);
  } // Move by center over y-axis

  function cy(y) {
    return y == null ? this.attr('cy') : this.attr('cy', y);
  } // Set width of element

  function width(width) {
    return width == null ? this.rx() * 2 : this.rx(new SVGNumber(width).divide(2));
  } // Set height of element

  function height(height) {
    return height == null ? this.ry() * 2 : this.ry(new SVGNumber(height).divide(2));
  } // Custom size function

  function size(width, height) {
    var p = proportionalSize(this, width, height);
    return this.rx(new SVGNumber(p.width).divide(2)).ry(new SVGNumber(p.height).divide(2));
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

  var Queue =
  /*#__PURE__*/
  function () {
    function Queue() {
      _classCallCheck(this, Queue);

      this._first = null;
      this._last = null;
    }

    _createClass(Queue, [{
      key: "push",
      value: function push(value) {
        // An item stores an id and the provided value
        var item = value.next ? value : {
          value: value,
          next: null,
          prev: null // Deal with the queue being empty or populated

        };

        if (this._last) {
          item.prev = this._last;
          this._last.next = item;
          this._last = item;
        } else {
          this._last = item;
          this._first = item;
        } // Update the length and return the current item


        return item;
      }
    }, {
      key: "shift",
      value: function shift() {
        // Check if we have a value
        var remove = this._first;
        if (!remove) return null; // If we do, remove it and relink things

        this._first = remove.next;
        if (this._first) this._first.prev = null;
        this._last = this._first ? this._last : null;
        return remove.value;
      } // Shows us the first item in the list

    }, {
      key: "first",
      value: function first() {
        return this._first && this._first.value;
      } // Shows us the last item in the list

    }, {
      key: "last",
      value: function last() {
        return this._last && this._last.value;
      } // Removes the item that was returned from the push

    }, {
      key: "remove",
      value: function remove(item) {
        // Relink the previous item
        if (item.prev) item.prev.next = item.next;
        if (item.next) item.next.prev = item.prev;
        if (item === this._last) this._last = item.prev;
        if (item === this._first) this._first = item.next; // Invalidate item

        item.prev = null;
        item.next = null;
      }
    }]);

    return Queue;
  }();

  var Animator = {
    nextDraw: null,
    frames: new Queue(),
    timeouts: new Queue(),
    timer: window.performance || window.Date,
    transforms: [],
    frame: function frame(fn) {
      // Store the node
      var node = Animator.frames.push({
        run: fn
      }); // Request an animation frame if we don't have one

      if (Animator.nextDraw === null) {
        Animator.nextDraw = window.requestAnimationFrame(Animator._draw);
      } // Return the node so we can remove it easily


      return node;
    },
    transform_frame: function transform_frame(fn, id) {
      Animator.transforms[id] = fn;
    },
    timeout: function timeout(fn, delay) {
      delay = delay || 0; // Work out when the event should fire

      var time = Animator.timer.now() + delay; // Add the timeout to the end of the queue

      var node = Animator.timeouts.push({
        run: fn,
        time: time
      }); // Request another animation frame if we need one

      if (Animator.nextDraw === null) {
        Animator.nextDraw = window.requestAnimationFrame(Animator._draw);
      }

      return node;
    },
    cancelFrame: function cancelFrame(node) {
      Animator.frames.remove(node);
    },
    clearTimeout: function clearTimeout(node) {
      Animator.timeouts.remove(node);
    },
    _draw: function _draw(now) {
      // Run all the timeouts we can run, if they are not ready yet, add them
      // to the end of the queue immediately! (bad timeouts!!! [sarcasm])
      var nextTimeout = null;
      var lastTimeout = Animator.timeouts.last();

      while (nextTimeout = Animator.timeouts.shift()) {
        // Run the timeout if its time, or push it to the end
        if (now >= nextTimeout.time) {
          nextTimeout.run();
        } else {
          Animator.timeouts.push(nextTimeout);
        } // If we hit the last item, we should stop shifting out more items


        if (nextTimeout === lastTimeout) break;
      } // Run all of the animation frames


      var nextFrame = null;
      var lastFrame = Animator.frames.last();

      while (nextFrame !== lastFrame && (nextFrame = Animator.frames.shift())) {
        nextFrame.run();
      }

      Animator.transforms.forEach(function (el) {
        el();
      }); // If we have remaining timeouts or frames, draw until we don't anymore

      Animator.nextDraw = Animator.timeouts.first() || Animator.frames.first() ? window.requestAnimationFrame(Animator._draw) : null;
    }
  };

  function isNulledBox(box) {
    return !box.w && !box.h && !box.x && !box.y;
  }

  function domContains(node) {
    return (document.documentElement.contains || function (node) {
      // This is IE - it does not support contains() for top-level SVGs
      while (node.parentNode) {
        node = node.parentNode;
      }

      return node === document;
    }).call(document.documentElement, node);
  }

  var Box =
  /*#__PURE__*/
  function () {
    function Box() {
      _classCallCheck(this, Box);

      this.init.apply(this, arguments);
    }

    _createClass(Box, [{
      key: "init",
      value: function init(source) {
        var base = [0, 0, 0, 0];
        source = typeof source === 'string' ? source.split(delimiter).map(parseFloat) : Array.isArray(source) ? source : _typeof(source) === 'object' ? [source.left != null ? source.left : source.x, source.top != null ? source.top : source.y, source.width, source.height] : arguments.length === 4 ? [].slice.call(arguments) : base;
        this.x = source[0] || 0;
        this.y = source[1] || 0;
        this.width = this.w = source[2] || 0;
        this.height = this.h = source[3] || 0; // Add more bounding box properties

        this.x2 = this.x + this.w;
        this.y2 = this.y + this.h;
        this.cx = this.x + this.w / 2;
        this.cy = this.y + this.h / 2;
      } // Merge rect box with another, return a new instance

    }, {
      key: "merge",
      value: function merge(box) {
        var x = Math.min(this.x, box.x);
        var y = Math.min(this.y, box.y);
        var width = Math.max(this.x + this.width, box.x + box.width) - x;
        var height = Math.max(this.y + this.height, box.y + box.height) - y;
        return new Box(x, y, width, height);
      }
    }, {
      key: "transform",
      value: function transform(m) {
        var xMin = Infinity;
        var xMax = -Infinity;
        var yMin = Infinity;
        var yMax = -Infinity;
        var pts = [new Point(this.x, this.y), new Point(this.x2, this.y), new Point(this.x, this.y2), new Point(this.x2, this.y2)];
        pts.forEach(function (p) {
          p = p.transform(m);
          xMin = Math.min(xMin, p.x);
          xMax = Math.max(xMax, p.x);
          yMin = Math.min(yMin, p.y);
          yMax = Math.max(yMax, p.y);
        });
        return new Box(xMin, yMin, xMax - xMin, yMax - yMin);
      }
    }, {
      key: "addOffset",
      value: function addOffset() {
        // offset by window scroll position, because getBoundingClientRect changes when window is scrolled
        this.x += window.pageXOffset;
        this.y += window.pageYOffset;
        return this;
      }
    }, {
      key: "toString",
      value: function toString() {
        return this.x + ' ' + this.y + ' ' + this.width + ' ' + this.height;
      }
    }, {
      key: "toArray",
      value: function toArray() {
        return [this.x, this.y, this.width, this.height];
      }
    }, {
      key: "isNulled",
      value: function isNulled() {
        return isNulledBox(this);
      }
    }]);

    return Box;
  }();

  function getBox(cb) {
    var box;

    try {
      box = cb(this.node);

      if (isNulledBox(box) && !domContains(this.node)) {
        throw new Error('Element not in the dom');
      }
    } catch (e) {
      try {
        var clone = this.clone().addTo(parser().svg).show();
        box = cb(clone.node);
        clone.remove();
      } catch (e) {
        console.warn('Getting a bounding box of this element is not possible');
      }
    }

    return box;
  }

  registerMethods({
    Element: {
      // Get bounding box
      bbox: function bbox() {
        return new Box(getBox.call(this, function (node) {
          return node.getBBox();
        }));
      },
      rbox: function rbox(el) {
        var box = new Box(getBox.call(this, function (node) {
          return node.getBoundingClientRect();
        }));
        if (el) return box.transform(el.screenCTM().inverse());
        return box.addOffset();
      }
    },
    viewbox: {
      viewbox: function viewbox(x, y, width, height) {
        // act as getter
        if (x == null) return new Box(this.attr('viewBox')); // act as setter

        return this.attr('viewBox', new Box(x, y, width, height));
      }
    }
  });

  var PathArray = subClassArray('PathArray', SVGArray);
  function pathRegReplace(a, b, c, d) {
    return c + d.replace(dots, ' .');
  }

  function arrayToString(a) {
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

    return s + ' ';
  }

  var pathHandlers = {
    M: function M(c, p, p0) {
      p.x = p0.x = c[0];
      p.y = p0.y = c[1];
      return ['M', p.x, p.y];
    },
    L: function L(c, p) {
      p.x = c[0];
      p.y = c[1];
      return ['L', c[0], c[1]];
    },
    H: function H(c, p) {
      p.x = c[0];
      return ['H', c[0]];
    },
    V: function V(c, p) {
      p.y = c[0];
      return ['V', c[0]];
    },
    C: function C(c, p) {
      p.x = c[4];
      p.y = c[5];
      return ['C', c[0], c[1], c[2], c[3], c[4], c[5]];
    },
    S: function S(c, p) {
      p.x = c[2];
      p.y = c[3];
      return ['S', c[0], c[1], c[2], c[3]];
    },
    Q: function Q(c, p) {
      p.x = c[2];
      p.y = c[3];
      return ['Q', c[0], c[1], c[2], c[3]];
    },
    T: function T(c, p) {
      p.x = c[0];
      p.y = c[1];
      return ['T', c[0], c[1]];
    },
    Z: function Z(c, p, p0) {
      p.x = p0.x;
      p.y = p0.y;
      return ['Z'];
    },
    A: function A(c, p) {
      p.x = c[5];
      p.y = c[6];
      return ['A', c[0], c[1], c[2], c[3], c[4], c[5], c[6]];
    }
  };
  var mlhvqtcsaz = 'mlhvqtcsaz'.split('');

  for (var i = 0, il = mlhvqtcsaz.length; i < il; ++i) {
    pathHandlers[mlhvqtcsaz[i]] = function (i) {
      return function (c, p, p0) {
        if (i === 'H') c[0] = c[0] + p.x;else if (i === 'V') c[0] = c[0] + p.y;else if (i === 'A') {
          c[5] = c[5] + p.x;
          c[6] = c[6] + p.y;
        } else {
          for (var j = 0, jl = c.length; j < jl; ++j) {
            c[j] = c[j] + (j % 2 ? p.y : p.x);
          }
        }
        return pathHandlers[i](c, p, p0);
      };
    }(mlhvqtcsaz[i].toUpperCase());
  }

  extend(PathArray, {
    // Convert array to string
    toString: function toString() {
      return arrayToString(this);
    },
    // Move path string
    move: function move(x, y) {
      // get bounding box of current situation
      var box = this.bbox(); // get relative offset

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

      return this;
    },
    // Resize path string
    size: function size(width, height) {
      // get bounding box of current situation
      var box = this.bbox();
      var i, l; // recalculate position of all points according to new size

      for (i = this.length - 1; i >= 0; i--) {
        l = this[i][0];

        if (l === 'M' || l === 'L' || l === 'T') {
          this[i][1] = (this[i][1] - box.x) * width / box.width + box.x;
          this[i][2] = (this[i][2] - box.y) * height / box.height + box.y;
        } else if (l === 'H') {
          this[i][1] = (this[i][1] - box.x) * width / box.width + box.x;
        } else if (l === 'V') {
          this[i][1] = (this[i][1] - box.y) * height / box.height + box.y;
        } else if (l === 'C' || l === 'S' || l === 'Q') {
          this[i][1] = (this[i][1] - box.x) * width / box.width + box.x;
          this[i][2] = (this[i][2] - box.y) * height / box.height + box.y;
          this[i][3] = (this[i][3] - box.x) * width / box.width + box.x;
          this[i][4] = (this[i][4] - box.y) * height / box.height + box.y;

          if (l === 'C') {
            this[i][5] = (this[i][5] - box.x) * width / box.width + box.x;
            this[i][6] = (this[i][6] - box.y) * height / box.height + box.y;
          }
        } else if (l === 'A') {
          // resize radii
          this[i][1] = this[i][1] * width / box.width;
          this[i][2] = this[i][2] * height / box.height; // move position values

          this[i][6] = (this[i][6] - box.x) * width / box.width + box.x;
          this[i][7] = (this[i][7] - box.y) * height / box.height + box.y;
        }
      }

      return this;
    },
    // Test if the passed path array use the same path data commands as this path array
    equalCommands: function equalCommands(pathArray) {
      var i, il, equalCommands;
      pathArray = new PathArray(pathArray);
      equalCommands = this.length === pathArray.length;

      for (i = 0, il = this.length; equalCommands && i < il; i++) {
        equalCommands = this[i][0] === pathArray[i][0];
      }

      return equalCommands;
    },
    // Make path array morphable
    morph: function morph(pathArray) {
      pathArray = new PathArray(pathArray);

      if (this.equalCommands(pathArray)) {
        this.destination = pathArray;
      } else {
        this.destination = null;
      }

      return this;
    },
    // Get morphed path array at given position
    at: function at(pos) {
      // make sure a destination is defined
      if (!this.destination) return this;
      var sourceArray = this;
      var destinationArray = this.destination.value;
      var array = [];
      var pathArray = new PathArray();
      var i, il, j, jl; // Animate has specified in the SVG spec
      // See: https://www.w3.org/TR/SVG11/paths.html#PathElement

      for (i = 0, il = sourceArray.length; i < il; i++) {
        array[i] = [sourceArray[i][0]];

        for (j = 1, jl = sourceArray[i].length; j < jl; j++) {
          array[i][j] = sourceArray[i][j] + (destinationArray[i][j] - sourceArray[i][j]) * pos;
        } // For the two flags of the elliptical arc command, the SVG spec say:
        // Flags and booleans are interpolated as fractions between zero and one, with any non-zero value considered to be a value of one/true
        // Elliptical arc command as an array followed by corresponding indexes:
        // ['A', rx, ry, x-axis-rotation, large-arc-flag, sweep-flag, x, y]
        //   0    1   2        3                 4             5      6  7


        if (array[i][0] === 'A') {
          array[i][4] = +(array[i][4] !== 0);
          array[i][5] = +(array[i][5] !== 0);
        }
      } // Directly modify the value of a path array, this is done this way for performance


      pathArray.value = array;
      return pathArray;
    },
    // Absolutize and parse path to array
    parse: function parse() {
      var array = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [['M', 0, 0]];
      // if it's already a patharray, no need to parse it
      if (array instanceof PathArray) return array; // prepare for parsing

      var s;
      var paramCnt = {
        'M': 2,
        'L': 2,
        'H': 1,
        'V': 1,
        'C': 6,
        'S': 4,
        'Q': 4,
        'T': 2,
        'A': 7,
        'Z': 0
      };

      if (typeof array === 'string') {
        array = array.replace(numbersWithDots, pathRegReplace) // convert 45.123.123 to 45.123 .123
        .replace(pathLetters, ' $& ') // put some room between letters and numbers
        .replace(hyphen, '$1 -') // add space before hyphen
        .trim() // trim
        .split(delimiter); // split into array
      } else {
        array = array.reduce(function (prev, curr) {
          return [].concat.call(prev, curr);
        }, []);
      } // array now is an array containing all parts of a path e.g. ['M', '0', '0', 'L', '30', '30' ...]


      var result = [];
      var p = new Point();
      var p0 = new Point();
      var index = 0;
      var len = array.length;

      do {
        // Test if we have a path letter
        if (isPathLetter.test(array[index])) {
          s = array[index];
          ++index; // If last letter was a move command and we got no new, it defaults to [L]ine
        } else if (s === 'M') {
          s = 'L';
        } else if (s === 'm') {
          s = 'l';
        }

        result.push(pathHandlers[s].call(null, array.slice(index, index = index + paramCnt[s.toUpperCase()]).map(parseFloat), p, p0));
      } while (len > index);

      return result;
    },
    // Get bounding box of path
    bbox: function bbox() {
      parser().path.setAttribute('d', this.toString());
      return parser.nodes.path.getBBox();
    }
  });

  var Morphable =
  /*#__PURE__*/
  function () {
    function Morphable(stepper) {
      _classCallCheck(this, Morphable);

      this._stepper = stepper || new Ease('-');
      this._from = null;
      this._to = null;
      this._type = null;
      this._context = null;
      this._morphObj = null;
    }

    _createClass(Morphable, [{
      key: "from",
      value: function from(val) {
        if (val == null) {
          return this._from;
        }

        this._from = this._set(val);
        return this;
      }
    }, {
      key: "to",
      value: function to(val) {
        if (val == null) {
          return this._to;
        }

        this._to = this._set(val);
        return this;
      }
    }, {
      key: "type",
      value: function type(_type) {
        // getter
        if (_type == null) {
          return this._type;
        } // setter


        this._type = _type;
        return this;
      }
    }, {
      key: "_set",
      value: function _set$$1(value) {
        if (!this._type) {
          var type = _typeof(value);

          if (type === 'number') {
            this.type(SVGNumber);
          } else if (type === 'string') {
            if (Color.isColor(value)) {
              this.type(Color);
            } else if (delimiter.test(value)) {
              this.type(pathLetters.test(value) ? PathArray : SVGArray);
            } else if (numberAndUnit.test(value)) {
              this.type(SVGNumber);
            } else {
              this.type(NonMorphable);
            }
          } else if (morphableTypes.indexOf(value.constructor) > -1) {
            this.type(value.constructor);
          } else if (Array.isArray(value)) {
            this.type(SVGArray);
          } else if (type === 'object') {
            this.type(ObjectBag);
          } else {
            this.type(NonMorphable);
          }
        }

        var result = new this._type(value).toArray();
        this._morphObj = this._morphObj || new this._type();
        this._context = this._context || Array.apply(null, Array(result.length)).map(Object);
        return result;
      }
    }, {
      key: "stepper",
      value: function stepper(_stepper) {
        if (_stepper == null) return this._stepper;
        this._stepper = _stepper;
        return this;
      }
    }, {
      key: "done",
      value: function done() {
        var complete = this._context.map(this._stepper.done).reduce(function (last, curr) {
          return last && curr;
        }, true);

        return complete;
      }
    }, {
      key: "at",
      value: function at(pos) {
        var _this = this;

        return this._morphObj.fromArray(this._from.map(function (i, index) {
          return _this._stepper.step(i, _this._to[index], pos, _this._context[index], _this._context);
        }));
      }
    }]);

    return Morphable;
  }();
  var NonMorphable =
  /*#__PURE__*/
  function () {
    function NonMorphable() {
      _classCallCheck(this, NonMorphable);

      this.init.apply(this, arguments);
    }

    _createClass(NonMorphable, [{
      key: "init",
      value: function init(val) {
        val = Array.isArray(val) ? val[0] : val;
        this.value = val;
      }
    }, {
      key: "valueOf",
      value: function valueOf() {
        return this.value;
      }
    }, {
      key: "toArray",
      value: function toArray() {
        return [this.value];
      }
    }]);

    return NonMorphable;
  }();
  var TransformBag =
  /*#__PURE__*/
  function () {
    function TransformBag() {
      _classCallCheck(this, TransformBag);

      this.init.apply(this, arguments);
    }

    _createClass(TransformBag, [{
      key: "init",
      value: function init(obj) {
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

        Object.assign(this, TransformBag.defaults, obj);
      }
    }, {
      key: "toArray",
      value: function toArray() {
        var v = this;
        return [v.scaleX, v.scaleY, v.shear, v.rotate, v.translateX, v.translateY, v.originX, v.originY];
      }
    }]);

    return TransformBag;
  }();
  TransformBag.defaults = {
    scaleX: 1,
    scaleY: 1,
    shear: 0,
    rotate: 0,
    translateX: 0,
    translateY: 0,
    originX: 0,
    originY: 0
  };
  var ObjectBag =
  /*#__PURE__*/
  function () {
    function ObjectBag() {
      _classCallCheck(this, ObjectBag);

      this.init.apply(this, arguments);
    }

    _createClass(ObjectBag, [{
      key: "init",
      value: function init(objOrArr) {
        this.values = [];

        if (Array.isArray(objOrArr)) {
          this.values = objOrArr;
          return;
        }

        var entries = Object.entries(objOrArr || {}).sort(function (a, b) {
          return a[0] - b[0];
        });
        this.values = entries.reduce(function (last, curr) {
          return last.concat(curr);
        }, []);
      }
    }, {
      key: "valueOf",
      value: function valueOf() {
        var obj = {};
        var arr = this.values;

        for (var i = 0, len = arr.length; i < len; i += 2) {
          obj[arr[i]] = arr[i + 1];
        }

        return obj;
      }
    }, {
      key: "toArray",
      value: function toArray() {
        return this.values;
      }
    }]);

    return ObjectBag;
  }();
  var morphableTypes = [NonMorphable, TransformBag, ObjectBag];
  function registerMorphableType() {
    var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    morphableTypes.push.apply(morphableTypes, _toConsumableArray([].concat(type)));
  }
  function makeMorphable() {
    extend(morphableTypes, {
      to: function to(val) {
        return new Morphable().type(this.constructor).from(this.valueOf()).to(val);
      },
      fromArray: function fromArray(arr) {
        this.init(arr);
        return this;
      }
    });
  }

  var time = window.performance || Date;

  var makeSchedule = function makeSchedule(runnerInfo) {
    var start = runnerInfo.start;
    var duration = runnerInfo.runner.duration();
    var end = start + duration;
    return {
      start: start,
      duration: duration,
      end: end,
      runner: runnerInfo.runner
    };
  };

  var Timeline =
  /*#__PURE__*/
  function () {
    // Construct a new timeline on the given element
    function Timeline() {
      _classCallCheck(this, Timeline);

      this._timeSource = function () {
        return time.now();
      };

      this._dispatcher = document.createElement('div'); // Store the timing variables

      this._startTime = 0;
      this._speed = 1.0; // Play control variables control how the animation proceeds

      this._reverse = false;
      this._persist = 0; // Keep track of the running animations and their starting parameters

      this._nextFrame = null;
      this._paused = false;
      this._runners = [];
      this._order = [];
      this._time = 0;
      this._lastSourceTime = 0;
      this._lastStepTime = 0;
    }

    _createClass(Timeline, [{
      key: "getEventTarget",
      value: function getEventTarget() {
        return this._dispatcher;
      }
      /**
       *
       */
      // schedules a runner on the timeline

    }, {
      key: "schedule",
      value: function schedule(runner, delay, when) {
        if (runner == null) {
          return this._runners.map(makeSchedule).sort(function (a, b) {
            return a.start - b.start || a.duration - b.duration;
          });
        }

        if (!this.active()) {
          this._step();

          if (when == null) {
            when = 'now';
          }
        } // The start time for the next animation can either be given explicitly,
        // derived from the current timeline time or it can be relative to the
        // last start time to chain animations direclty


        var absoluteStartTime = 0;
        delay = delay || 0; // Work out when to start the animation

        if (when == null || when === 'last' || when === 'after') {
          // Take the last time and increment
          absoluteStartTime = this._startTime;
        } else if (when === 'absolute' || when === 'start') {
          absoluteStartTime = delay;
          delay = 0;
        } else if (when === 'now') {
          absoluteStartTime = this._time;
        } else if (when === 'relative') {
          var runnerInfo = this._runners[runner.id];

          if (runnerInfo) {
            absoluteStartTime = runnerInfo.start + delay;
            delay = 0;
          }
        } else {
          throw new Error('Invalid value for the "when" parameter');
        } // Manage runner


        runner.unschedule();
        runner.timeline(this);
        runner.time(-delay); // Save startTime for next runner

        this._startTime = absoluteStartTime + runner.duration() + delay; // Save runnerInfo

        this._runners[runner.id] = {
          persist: this.persist(),
          runner: runner,
          start: absoluteStartTime // Save order and continue

        };

        this._order.push(runner.id);

        this._continue();

        return this;
      } // Remove the runner from this timeline

    }, {
      key: "unschedule",
      value: function unschedule(runner) {
        var index = this._order.indexOf(runner.id);

        if (index < 0) return this;
        delete this._runners[runner.id];

        this._order.splice(index, 1);

        runner.timeline(null);
        return this;
      }
    }, {
      key: "play",
      value: function play() {
        // Now make sure we are not paused and continue the animation
        this._paused = false;
        return this._continue();
      }
    }, {
      key: "pause",
      value: function pause() {
        // Cancel the next animation frame and pause
        this._nextFrame = null;
        this._paused = true;
        return this;
      }
    }, {
      key: "stop",
      value: function stop() {
        // Cancel the next animation frame and go to start
        this.seek(-this._time);
        return this.pause();
      }
    }, {
      key: "finish",
      value: function finish() {
        this.seek(Infinity);
        return this.pause();
      }
    }, {
      key: "speed",
      value: function speed(_speed) {
        if (_speed == null) return this._speed;
        this._speed = _speed;
        return this;
      }
    }, {
      key: "reverse",
      value: function reverse(yes) {
        var currentSpeed = this.speed();
        if (yes == null) return this.speed(-currentSpeed);
        var positive = Math.abs(currentSpeed);
        return this.speed(yes ? positive : -positive);
      }
    }, {
      key: "seek",
      value: function seek(dt) {
        this._time += dt;
        return this._continue();
      }
    }, {
      key: "time",
      value: function time(_time) {
        if (_time == null) return this._time;
        this._time = _time;
        return this;
      }
    }, {
      key: "persist",
      value: function persist(dtOrForever) {
        if (dtOrForever == null) return this._persist;
        this._persist = dtOrForever;
        return this;
      }
    }, {
      key: "source",
      value: function source(fn) {
        if (fn == null) return this._timeSource;
        this._timeSource = fn;
        return this;
      }
    }, {
      key: "_step",
      value: function _step() {
        // If the timeline is paused, just do nothing
        if (this._paused) return; // Get the time delta from the last time and update the time

        var time = this._timeSource();

        var dtSource = time - this._lastSourceTime;
        var dtTime = this._speed * dtSource + (this._time - this._lastStepTime);
        this._lastSourceTime = time; // Update the time

        this._time += dtTime;
        this._lastStepTime = this._time; // this.fire('time', this._time)
        // Run all of the runners directly

        var runnersLeft = false;

        for (var i = 0, len = this._order.length; i < len; i++) {
          // Get and run the current runner and ignore it if its inactive
          var runnerInfo = this._runners[this._order[i]];
          var runner = runnerInfo.runner;
          var dt = dtTime; // Make sure that we give the actual difference
          // between runner start time and now

          var dtToStart = this._time - runnerInfo.start; // Dont run runner if not started yet

          if (dtToStart < 0) {
            runnersLeft = true;
            continue;
          } else if (dtToStart < dt) {
            // Adjust dt to make sure that animation is on point
            dt = dtToStart;
          }

          if (!runner.active()) continue; // If this runner is still going, signal that we need another animation
          // frame, otherwise, remove the completed runner

          var finished = runner.step(dt).done;

          if (!finished) {
            runnersLeft = true; // continue
          } else if (runnerInfo.persist !== true) {
            // runner is finished. And runner might get removed
            var endTime = runner.duration() - runner.time() + this._time;

            if (endTime + this._persist < this._time) {
              // Delete runner and correct index
              delete this._runners[this._order[i]];
              this._order.splice(i--, 1) && --len;
              runner.timeline(null);
            }
          }
        } // Get the next animation frame to keep the simulation going


        if (runnersLeft) {
          this._nextFrame = Animator.frame(this._step.bind(this));
        } else {
          this._nextFrame = null;
        }

        return this;
      } // Checks if we are running and continues the animation

    }, {
      key: "_continue",
      value: function _continue() {
        if (this._paused) return this;

        if (!this._nextFrame) {
          this._nextFrame = Animator.frame(this._step.bind(this));
        }

        return this;
      }
    }, {
      key: "active",
      value: function active() {
        return !!this._nextFrame;
      }
    }]);

    return Timeline;
  }();
  registerMethods({
    Element: {
      timeline: function timeline() {
        this._timeline = this._timeline || new Timeline();
        return this._timeline;
      }
    }
  });

  var Runner =
  /*#__PURE__*/
  function (_EventTarget) {
    _inherits(Runner, _EventTarget);

    function Runner(options) {
      var _this;

      _classCallCheck(this, Runner);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(Runner).call(this)); // Store a unique id on the runner, so that we can identify it later

      _this.id = Runner.id++; // Ensure a default value

      options = options == null ? timeline.duration : options; // Ensure that we get a controller

      options = typeof options === 'function' ? new Controller(options) : options; // Declare all of the variables

      _this._element = null;
      _this._timeline = null;
      _this.done = false;
      _this._queue = []; // Work out the stepper and the duration

      _this._duration = typeof options === 'number' && options;
      _this._isDeclarative = options instanceof Controller;
      _this._stepper = _this._isDeclarative ? options : new Ease(); // We copy the current values from the timeline because they can change

      _this._history = {}; // Store the state of the runner

      _this.enabled = true;
      _this._time = 0;
      _this._last = 0; // Save transforms applied to this runner

      _this.transforms = new Matrix();
      _this.transformId = 1; // Looping variables

      _this._haveReversed = false;
      _this._reverse = false;
      _this._loopsDone = 0;
      _this._swing = false;
      _this._wait = 0;
      _this._times = 1;
      return _this;
    }
    /*
    Runner Definitions
    ==================
    These methods help us define the runtime behaviour of the Runner or they
    help us make new runners from the current runner
    */


    _createClass(Runner, [{
      key: "element",
      value: function element(_element) {
        if (_element == null) return this._element;
        this._element = _element;

        _element._prepareRunner();

        return this;
      }
    }, {
      key: "timeline",
      value: function timeline$$1(_timeline) {
        // check explicitly for undefined so we can set the timeline to null
        if (typeof _timeline === 'undefined') return this._timeline;
        this._timeline = _timeline;
        return this;
      }
    }, {
      key: "animate",
      value: function animate(duration, delay, when) {
        var o = Runner.sanitise(duration, delay, when);
        var runner = new Runner(o.duration);
        if (this._timeline) runner.timeline(this._timeline);
        if (this._element) runner.element(this._element);
        return runner.loop(o).schedule(delay, when);
      }
    }, {
      key: "schedule",
      value: function schedule(timeline$$1, delay, when) {
        // The user doesn't need to pass a timeline if we already have one
        if (!(timeline$$1 instanceof Timeline)) {
          when = delay;
          delay = timeline$$1;
          timeline$$1 = this.timeline();
        } // If there is no timeline, yell at the user...


        if (!timeline$$1) {
          throw Error('Runner cannot be scheduled without timeline');
        } // Schedule the runner on the timeline provided


        timeline$$1.schedule(this, delay, when);
        return this;
      }
    }, {
      key: "unschedule",
      value: function unschedule() {
        var timeline$$1 = this.timeline();
        timeline$$1 && timeline$$1.unschedule(this);
        return this;
      }
    }, {
      key: "loop",
      value: function loop(times, swing, wait) {
        // Deal with the user passing in an object
        if (_typeof(times) === 'object') {
          swing = times.swing;
          wait = times.wait;
          times = times.times;
        } // Sanitise the values and store them


        this._times = times || Infinity;
        this._swing = swing || false;
        this._wait = wait || 0;
        return this;
      }
    }, {
      key: "delay",
      value: function delay(_delay) {
        return this.animate(0, _delay);
      }
      /*
      Basic Functionality
      ===================
      These methods allow us to attach basic functions to the runner directly
      */

    }, {
      key: "queue",
      value: function queue(initFn, runFn, isTransform) {
        this._queue.push({
          initialiser: initFn || noop,
          runner: runFn || noop,
          isTransform: isTransform,
          initialised: false,
          finished: false
        });

        var timeline$$1 = this.timeline();
        timeline$$1 && this.timeline()._continue();
        return this;
      }
    }, {
      key: "during",
      value: function during(fn) {
        return this.queue(null, fn);
      }
    }, {
      key: "after",
      value: function after(fn) {
        return this.on('finish', fn);
      }
      /*
      Runner animation methods
      ========================
      Control how the animation plays
      */

    }, {
      key: "time",
      value: function time(_time) {
        if (_time == null) {
          return this._time;
        }

        var dt = _time - this._time;
        this.step(dt);
        return this;
      }
    }, {
      key: "duration",
      value: function duration() {
        return this._times * (this._wait + this._duration) - this._wait;
      }
    }, {
      key: "loops",
      value: function loops(p) {
        var loopDuration = this._duration + this._wait;

        if (p == null) {
          var loopsDone = Math.floor(this._time / loopDuration);
          var relativeTime = this._time - loopsDone * loopDuration;
          var position = relativeTime / this._duration;
          return Math.min(loopsDone + position, this._times);
        }

        var whole = Math.floor(p);
        var partial = p % 1;
        var time = loopDuration * whole + this._duration * partial;
        return this.time(time);
      }
    }, {
      key: "position",
      value: function position(p) {
        // Get all of the variables we need
        var x$$1 = this._time;
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
          var f = function f(x$$1) {
            var swinging = s * Math.floor(x$$1 % (2 * (w + d)) / (w + d));
            var backwards = swinging && !r || !swinging && r;
            var uncliped = Math.pow(-1, backwards) * (x$$1 % (w + d)) / d + backwards;
            var clipped = Math.max(Math.min(uncliped, 1), 0);
            return clipped;
          }; // Figure out the value by incorporating the start time


          var endTime = t * (w + d) - w;
          position = x$$1 <= 0 ? Math.round(f(1e-5)) : x$$1 < endTime ? f(x$$1) : Math.round(f(endTime - 1e-5));
          return position;
        } // Work out the loops done and add the position to the loops done


        var loopsDone = Math.floor(this.loops());
        var swingForward = s && loopsDone % 2 === 0;
        var forwards = swingForward && !r || r && swingForward;
        position = loopsDone + (forwards ? p : 1 - p);
        return this.loops(position);
      }
    }, {
      key: "progress",
      value: function progress(p) {
        if (p == null) {
          return Math.min(1, this._time / this.duration());
        }

        return this.time(p * this.duration());
      }
    }, {
      key: "step",
      value: function step(dt) {
        // If we are inactive, this stepper just gets skipped
        if (!this.enabled) return this; // Update the time and get the new position

        dt = dt == null ? 16 : dt;
        this._time += dt;
        var position = this.position(); // Figure out if we need to run the stepper in this frame

        var running = this._lastPosition !== position && this._time >= 0;
        this._lastPosition = position; // Figure out if we just started

        var duration = this.duration();
        var justStarted = this._lastTime < 0 && this._time > 0;
        var justFinished = this._lastTime < this._time && this.time > duration;
        this._lastTime = this._time;

        if (justStarted) {
          this.fire('start', this);
        } // Work out if the runner is finished set the done flag here so animations
        // know, that they are running in the last step (this is good for
        // transformations which can be merged)


        var declarative = this._isDeclarative;
        this.done = !declarative && !justFinished && this._time >= duration; // Call initialise and the run function

        if (running || declarative) {
          this._initialise(running); // clear the transforms on this runner so they dont get added again and again


          this.transforms = new Matrix();

          var converged = this._run(declarative ? dt : position);

          this.fire('step', this);
        } // correct the done flag here
        // declaritive animations itself know when they converged


        this.done = this.done || converged && declarative;

        if (this.done) {
          this.fire('finish', this);
        }

        return this;
      }
    }, {
      key: "finish",
      value: function finish() {
        return this.step(Infinity);
      }
    }, {
      key: "reverse",
      value: function reverse(_reverse) {
        this._reverse = _reverse == null ? !this._reverse : _reverse;
        return this;
      }
    }, {
      key: "ease",
      value: function ease(fn) {
        this._stepper = new Ease(fn);
        return this;
      }
    }, {
      key: "active",
      value: function active(enabled) {
        if (enabled == null) return this.enabled;
        this.enabled = enabled;
        return this;
      }
      /*
      Private Methods
      ===============
      Methods that shouldn't be used externally
      */
      // Save a morpher to the morpher list so that we can retarget it later

    }, {
      key: "_rememberMorpher",
      value: function _rememberMorpher(method, morpher) {
        this._history[method] = {
          morpher: morpher,
          caller: this._queue[this._queue.length - 1]
        };
      } // Try to set the target for a morpher if the morpher exists, otherwise
      // do nothing and return false

    }, {
      key: "_tryRetarget",
      value: function _tryRetarget(method, target) {
        if (this._history[method]) {
          // if the last method wasnt even initialised, throw it away
          if (!this._history[method].caller.initialised) {
            var index = this._queue.indexOf(this._history[method].caller);

            this._queue.splice(index, 1);

            return false;
          } // for the case of transformations, we use the special retarget function
          // which has access to the outer scope


          if (this._history[method].caller.isTransform) {
            this._history[method].caller.isTransform(target); // for everything else a simple morpher change is sufficient

          } else {
            this._history[method].morpher.to(target);
          }

          this._history[method].caller.finished = false;
          var timeline$$1 = this.timeline();
          timeline$$1 && timeline$$1._continue();
          return true;
        }

        return false;
      } // Run each initialise function in the runner if required

    }, {
      key: "_initialise",
      value: function _initialise(running) {
        // If we aren't running, we shouldn't initialise when not declarative
        if (!running && !this._isDeclarative) return; // Loop through all of the initialisers

        for (var i = 0, len = this._queue.length; i < len; ++i) {
          // Get the current initialiser
          var current = this._queue[i]; // Determine whether we need to initialise

          var needsIt = this._isDeclarative || !current.initialised && running;
          running = !current.finished; // Call the initialiser if we need to

          if (needsIt && running) {
            current.initialiser.call(this);
            current.initialised = true;
          }
        }
      } // Run each run function for the position or dt given

    }, {
      key: "_run",
      value: function _run(positionOrDt) {
        // Run all of the _queue directly
        var allfinished = true;

        for (var i = 0, len = this._queue.length; i < len; ++i) {
          // Get the current function to run
          var current = this._queue[i]; // Run the function if its not finished, we keep track of the finished
          // flag for the sake of declarative _queue

          var converged = current.runner.call(this, positionOrDt);
          current.finished = current.finished || converged === true;
          allfinished = allfinished && current.finished;
        } // We report when all of the constructors are finished


        return allfinished;
      }
    }, {
      key: "addTransform",
      value: function addTransform(transform, index) {
        this.transforms.lmultiplyO(transform);
        return this;
      }
    }, {
      key: "clearTransform",
      value: function clearTransform() {
        this.transforms = new Matrix();
        return this;
      }
    }], [{
      key: "sanitise",
      value: function sanitise(duration, delay, when) {
        // Initialise the default parameters
        var times = 1;
        var swing = false;
        var wait = 0;
        duration = duration || timeline.duration;
        delay = delay || timeline.delay;
        when = when || 'last'; // If we have an object, unpack the values

        if (_typeof(duration) === 'object' && !(duration instanceof Stepper)) {
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
        };
      }
    }]);

    return Runner;
  }(EventTarget);
  Runner.id = 0;

  var FakeRunner = function FakeRunner() {
    var transforms = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Matrix();
    var id = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : -1;
    var done = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

    _classCallCheck(this, FakeRunner);

    this.transforms = transforms;
    this.id = id;
    this.done = done;
  };

  extend([Runner, FakeRunner], {
    mergeWith: function mergeWith(runner) {
      return new FakeRunner(runner.transforms.lmultiply(this.transforms), runner.id);
    }
  }); // FakeRunner.emptyRunner = new FakeRunner()

  var lmultiply = function lmultiply(last, curr) {
    return last.lmultiplyO(curr);
  };

  var getRunnerTransform = function getRunnerTransform(runner) {
    return runner.transforms;
  };

  function mergeTransforms() {
    // Find the matrix to apply to the element and apply it
    var runners = this._transformationRunners.runners;
    var netTransform = runners.map(getRunnerTransform).reduce(lmultiply, new Matrix());
    this.transform(netTransform);

    this._transformationRunners.merge();

    if (this._transformationRunners.length() === 1) {
      this._frameId = null;
    }
  }

  var RunnerArray =
  /*#__PURE__*/
  function () {
    function RunnerArray() {
      _classCallCheck(this, RunnerArray);

      this.runners = [];
      this.ids = [];
    }

    _createClass(RunnerArray, [{
      key: "add",
      value: function add(runner) {
        if (this.runners.includes(runner)) return;
        var id = runner.id + 1;
        var leftSibling = this.ids.reduce(function (last, curr) {
          if (curr > last && curr < id) return curr;
          return last;
        }, 0);
        var index = this.ids.indexOf(leftSibling) + 1;
        this.ids.splice(index, 0, id);
        this.runners.splice(index, 0, runner);
        return this;
      }
    }, {
      key: "getByID",
      value: function getByID(id) {
        return this.runners[this.ids.indexOf(id + 1)];
      }
    }, {
      key: "remove",
      value: function remove(id) {
        var index = this.ids.indexOf(id + 1);
        this.ids.splice(index, 1);
        this.runners.splice(index, 1);
        return this;
      }
    }, {
      key: "merge",
      value: function merge() {
        var _this2 = this;

        var lastRunner = null;
        this.runners.forEach(function (runner, i) {
          if (lastRunner && runner.done && lastRunner.done) {
            _this2.remove(runner.id);

            _this2.edit(lastRunner.id, runner.mergeWith(lastRunner));
          }

          lastRunner = runner;
        });
        return this;
      }
    }, {
      key: "edit",
      value: function edit(id, newRunner) {
        var index = this.ids.indexOf(id + 1);
        this.ids.splice(index, 1, id);
        this.runners.splice(index, 1, newRunner);
        return this;
      }
    }, {
      key: "length",
      value: function length() {
        return this.ids.length;
      }
    }, {
      key: "clearBefore",
      value: function clearBefore(id) {
        var deleteCnt = this.ids.indexOf(id + 1) || 1;
        this.ids.splice(0, deleteCnt, 0);
        this.runners.splice(0, deleteCnt, new FakeRunner());
        return this;
      }
    }]);

    return RunnerArray;
  }();

  var frameId = 0;
  registerMethods({
    Element: {
      animate: function animate(duration, delay, when) {
        var o = Runner.sanitise(duration, delay, when);
        var timeline$$1 = this.timeline();
        return new Runner(o.duration).loop(o).element(this).timeline(timeline$$1).schedule(delay, when);
      },
      delay: function delay(by, when) {
        return this.animate(0, by, when);
      },
      // this function searches for all runners on the element and deletes the ones
      // which run before the current one. This is because absolute transformations
      // overwfrite anything anyway so there is no need to waste time computing
      // other runners
      _clearTransformRunnersBefore: function _clearTransformRunnersBefore(currentRunner) {
        this._transformationRunners.clearBefore(currentRunner.id);
      },
      _currentTransform: function _currentTransform(current) {
        return this._transformationRunners.runners // we need the equal sign here to make sure, that also transformations
        // on the same runner which execute before the current transformation are
        // taken into account
        .filter(function (runner) {
          return runner.id <= current.id;
        }).map(getRunnerTransform).reduce(lmultiply, new Matrix());
      },
      addRunner: function addRunner(runner) {
        this._transformationRunners.add(runner);

        Animator.transform_frame(mergeTransforms.bind(this), this._frameId);
      },
      _prepareRunner: function _prepareRunner() {
        if (this._frameId == null) {
          this._transformationRunners = new RunnerArray().add(new FakeRunner(new Matrix(this)));
          this._frameId = frameId++;
        }
      }
    }
  });
  extend(Runner, {
    attr: function attr(a, v) {
      return this.styleAttr('attr', a, v);
    },
    // Add animatable styles
    css: function css(s, v) {
      return this.styleAttr('css', s, v);
    },
    styleAttr: function styleAttr(type, name, val) {
      // apply attributes individually
      if (_typeof(name) === 'object') {
        for (var key in val) {
          this.styleAttr(type, key, val[key]);
        }
      }

      var morpher = new Morphable(this._stepper).to(val);
      this.queue(function () {
        morpher = morpher.from(this.element()[type](name));
      }, function (pos) {
        this.element()[type](name, morpher.at(pos));
        return morpher.done();
      });
      return this;
    },
    zoom: function zoom(level, point) {
      var morpher = new Morphable(this._stepper).to(new SVGNumber(level));
      this.queue(function () {
        morpher = morpher.from(this.zoom());
      }, function (pos) {
        this.element().zoom(morpher.at(pos), point);
        return morpher.done();
      });
      return this;
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
    transform: function transform(transforms, relative, affine) {
      // If we have a declarative function, we should retarget it if possible
      relative = transforms.relative || relative;

      if (this._isDeclarative && !relative && this._tryRetarget('transform', transforms)) {
        return this;
      } // Parse the parameters


      var isMatrix = Matrix.isMatrixLike(transforms);
      affine = transforms.affine != null ? transforms.affine : affine != null ? affine : !isMatrix; // Create a morepher and set its type

      var morpher = new Morphable(this._stepper).type(affine ? TransformBag : Matrix);
      var origin;
      var element;
      var current;
      var currentAngle;
      var startTransform;

      function setup() {
        // make sure element and origin is defined
        element = element || this.element();
        origin = origin || getOrigin(transforms, element);
        startTransform = new Matrix(relative ? undefined : element); // add the runner to the element so it can merge transformations

        element.addRunner(this); // Deactivate all transforms that have run so far if we are absolute

        if (!relative) {
          element._clearTransformRunnersBefore(this);
        }
      }

      function run(pos) {
        // clear all other transforms before this in case something is saved
        // on this runner. We are absolute. We dont need these!
        if (!relative) this.clearTransform();

        var _transform = new Point(origin).transform(element._currentTransform(this)),
            x$$1 = _transform.x,
            y$$1 = _transform.y;

        var target = new Matrix(_objectSpread({}, transforms, {
          origin: [x$$1, y$$1]
        }));
        var start = this._isDeclarative && current ? current : startTransform;

        if (affine) {
          target = target.decompose(x$$1, y$$1);
          start = start.decompose(x$$1, y$$1); // Get the current and target angle as it was set

          var rTarget = target.rotate;
          var rCurrent = start.rotate; // Figure out the shortest path to rotate directly

          var possibilities = [rTarget - 360, rTarget, rTarget + 360];
          var distances = possibilities.map(function (a) {
            return Math.abs(a - rCurrent);
          });
          var shortest = Math.min.apply(Math, _toConsumableArray(distances));
          var index = distances.indexOf(shortest);
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
        var affineParameters = morpher.at(pos);
        currentAngle = affineParameters.rotate;
        current = new Matrix(affineParameters);
        this.addTransform(current);
        return morpher.done();
      }

      function retarget(newTransforms) {
        // only get a new origin if it changed since the last call
        if ((newTransforms.origin || 'center').toString() !== (transforms.origin || 'center').toString()) {
          origin = getOrigin(transforms, element);
        } // overwrite the old transformations with the new ones


        transforms = _objectSpread({}, newTransforms, {
          origin: origin
        });
      }

      this.queue(setup, run, retarget);
      this._isDeclarative && this._rememberMorpher('transform', morpher);
      return this;
    },
    // Animatable x-axis
    x: function x$$1(_x, relative) {
      return this._queueNumber('x', _x);
    },
    // Animatable y-axis
    y: function y$$1(_y) {
      return this._queueNumber('y', _y);
    },
    dx: function dx(x$$1) {
      return this._queueNumberDelta('dx', x$$1);
    },
    dy: function dy(y$$1) {
      return this._queueNumberDelta('dy', y$$1);
    },
    _queueNumberDelta: function _queueNumberDelta(method, to$$1) {
      to$$1 = new SVGNumber(to$$1); // Try to change the target if we have this method already registerd

      if (this._tryRetargetDelta(method, to$$1)) return this; // Make a morpher and queue the animation

      var morpher = new Morphable(this._stepper).to(to$$1);
      this.queue(function () {
        var from$$1 = this.element()[method]();
        morpher.from(from$$1);
        morpher.to(from$$1 + to$$1);
      }, function (pos) {
        this.element()[method](morpher.at(pos));
        return morpher.done();
      }); // Register the morpher so that if it is changed again, we can retarget it

      this._rememberMorpher(method, morpher);

      return this;
    },
    _queueObject: function _queueObject(method, to$$1) {
      // Try to change the target if we have this method already registerd
      if (this._tryRetarget(method, to$$1)) return this; // Make a morpher and queue the animation

      var morpher = new Morphable(this._stepper).to(to$$1);
      this.queue(function () {
        morpher.from(this.element()[method]());
      }, function (pos) {
        this.element()[method](morpher.at(pos));
        return morpher.done();
      }); // Register the morpher so that if it is changed again, we can retarget it

      this._rememberMorpher(method, morpher);

      return this;
    },
    _queueNumber: function _queueNumber(method, value) {
      return this._queueObject(method, new SVGNumber(value));
    },
    // Animatable center x-axis
    cx: function cx$$1(x$$1) {
      return this._queueNumber('cx', x$$1);
    },
    // Animatable center y-axis
    cy: function cy$$1(y$$1) {
      return this._queueNumber('cy', y$$1);
    },
    // Add animatable move
    move: function move(x$$1, y$$1) {
      return this.x(x$$1).y(y$$1);
    },
    // Add animatable center
    center: function center(x$$1, y$$1) {
      return this.cx(x$$1).cy(y$$1);
    },
    // Add animatable size
    size: function size$$1(width$$1, height$$1) {
      // animate bbox based size for all other elements
      var box;

      if (!width$$1 || !height$$1) {
        box = this._element.bbox();
      }

      if (!width$$1) {
        width$$1 = box.width / box.height * height$$1;
      }

      if (!height$$1) {
        height$$1 = box.height / box.width * width$$1;
      }

      return this.width(width$$1).height(height$$1);
    },
    // Add animatable width
    width: function width$$1(_width) {
      return this._queueNumber('width', _width);
    },
    // Add animatable height
    height: function height$$1(_height) {
      return this._queueNumber('height', _height);
    },
    // Add animatable plot
    plot: function plot(a, b, c, d) {
      // Lines can be plotted with 4 arguments
      if (arguments.length === 4) {
        return this.plot([a, b, c, d]);
      }

      var morpher = this._element.MorphArray().to(a);

      this.queue(function () {
        morpher.from(this._element.array());
      }, function (pos) {
        this._element.plot(morpher.at(pos));
      });
      return this;
    },
    // Add leading method
    leading: function leading(value) {
      return this._queueNumber('leading', value);
    },
    // Add animatable viewbox
    viewbox: function viewbox(x$$1, y$$1, width$$1, height$$1) {
      return this._queueObject('viewbox', new Box(x$$1, y$$1, width$$1, height$$1));
    },
    update: function update(o) {
      if (_typeof(o) !== 'object') {
        return this.update({
          offset: arguments[0],
          color: arguments[1],
          opacity: arguments[2]
        });
      }

      if (o.opacity != null) this.attr('stop-opacity', o.opacity);
      if (o.color != null) this.attr('stop-color', o.color);
      if (o.offset != null) this.attr('offset', o.offset);
      return this;
    }
  });
  extend(Runner, {
    rx: rx,
    ry: ry,
    from: from,
    to: to
  });

  var sugar = {
    stroke: ['color', 'width', 'opacity', 'linecap', 'linejoin', 'miterlimit', 'dasharray', 'dashoffset'],
    fill: ['color', 'opacity', 'rule'],
    prefix: function prefix(t, a) {
      return a === 'color' ? t : t + '-' + a;
    } // Add sugar for fill and stroke

  };
  ['fill', 'stroke'].forEach(function (m) {
    var extension = {};
    var i;

    extension[m] = function (o) {
      if (typeof o === 'undefined') {
        return this;
      }

      if (typeof o === 'string' || Color.isRgb(o) || o instanceof Element) {
        this.attr(m, o);
      } else {
        // set all attributes from sugar.fill and sugar.stroke list
        for (i = sugar[m].length - 1; i >= 0; i--) {
          if (o[sugar[m][i]] != null) {
            this.attr(sugar.prefix(m, sugar[m][i]), o[sugar[m][i]]);
          }
        }
      }

      return this;
    };

    registerMethods(['Shape', 'Runner'], extension);
  });
  registerMethods(['Element', 'Runner'], {
    // Let the user set the matrix directly
    matrix: function matrix(mat, b, c, d, e, f) {
      // Act as a getter
      if (mat == null) {
        return new Matrix(this);
      } // Act as a setter, the user can pass a matrix or a set of numbers


      return this.attr('transform', new Matrix(mat, b, c, d, e, f));
    },
    // Map rotation to transform
    rotate: function rotate(angle, cx, cy) {
      return this.transform({
        rotate: angle,
        ox: cx,
        oy: cy
      }, true);
    },
    // Map skew to transform
    skew: function skew(x, y, cx, cy) {
      return arguments.length === 1 || arguments.length === 3 ? this.transform({
        skew: x,
        ox: y,
        oy: cx
      }, true) : this.transform({
        skew: [x, y],
        ox: cx,
        oy: cy
      }, true);
    },
    shear: function shear(lam, cx, cy) {
      return this.transform({
        shear: lam,
        ox: cx,
        oy: cy
      }, true);
    },
    // Map scale to transform
    scale: function scale(x, y, cx, cy) {
      return arguments.length === 1 || arguments.length === 3 ? this.transform({
        scale: x,
        ox: y,
        oy: cx
      }, true) : this.transform({
        scale: [x, y],
        ox: cx,
        oy: cy
      }, true);
    },
    // Map translate to transform
    translate: function translate(x, y) {
      return this.transform({
        translate: [x, y]
      }, true);
    },
    // Map relative translations to transform
    relative: function relative(x, y) {
      return this.transform({
        relative: [x, y]
      }, true);
    },
    // Map flip to transform
    flip: function flip(direction, around) {
      var directionString = typeof direction === 'string' ? direction : isFinite(direction) ? 'both' : 'both';
      var origin = direction === 'both' && isFinite(around) ? [around, around] : direction === 'x' ? [around, 0] : direction === 'y' ? [0, around] : isFinite(direction) ? [direction, direction] : [0, 0];
      this.transform({
        flip: directionString,
        origin: origin
      }, true);
    },
    // Opacity
    opacity: function opacity(value) {
      return this.attr('opacity', value);
    },
    // Relative move over x axis
    dx: function dx(x) {
      return this.x(new SVGNumber(x).plus(this instanceof Runner ? 0 : this.x()), true);
    },
    // Relative move over y axis
    dy: function dy(y) {
      return this.y(new SVGNumber(y).plus(this instanceof Runner ? 0 : this.y()), true);
    },
    // Relative move over x and y axes
    dmove: function dmove(x, y) {
      return this.dx(x).dy(y);
    }
  });
  registerMethods('radius', {
    // Add x and y radius
    radius: function radius(x, y) {
      var type = (this._element || this).type;
      return type === 'radialGradient' || type === 'radialGradient' ? this.attr('r', new SVGNumber(x)) : this.rx(x).ry(y == null ? x : y);
    }
  });
  registerMethods('Path', {
    // Get path length
    length: function length() {
      return this.node.getTotalLength();
    },
    // Get point at length
    pointAt: function pointAt(length) {
      return new Point(this.node.getPointAtLength(length));
    }
  });
  registerMethods(['Element', 'Runner'], {
    // Set font
    font: function font(a, v) {
      if (_typeof(a) === 'object') {
        for (v in a) {
          this.font(v, a[v]);
        }
      }

      return a === 'leading' ? this.leading(v) : a === 'anchor' ? this.attr('text-anchor', v) : a === 'size' || a === 'family' || a === 'weight' || a === 'stretch' || a === 'variant' || a === 'style' ? this.attr('font-' + a, v) : this.attr(a, v);
    }
  }); // Add events to elements

  var methods$1 = ['click', 'dblclick', 'mousedown', 'mouseup', 'mouseover', 'mouseout', 'mousemove', 'mouseenter', 'mouseleave', 'touchstart', 'touchmove', 'touchleave', 'touchend', 'touchcancel'].reduce(function (last, event) {
    // add event to Element
    var fn = function fn(f) {
      if (f === null) {
        off(this, event);
      } else {
        on(this, event, f);
      }

      return this;
    };

    last[event] = fn;
    return last;
  }, {});
  registerMethods('Element', methods$1);

  function untransform() {
    return this.attr('transform', null);
  } // merge the whole transformation chain into one matrix and returns it

  function matrixify() {
    var matrix = (this.attr('transform') || ''). // split transformations
    split(transforms).slice(0, -1).map(function (str) {
      // generate key => value pairs
      var kv = str.trim().split('(');
      return [kv[0], kv[1].split(delimiter).map(function (str) {
        return parseFloat(str);
      })];
    }).reverse() // merge every transformation into one matrix
    .reduce(function (matrix, transform) {
      if (transform[0] === 'matrix') {
        return matrix.lmultiply(Matrix.fromArray(transform[1]));
      }

      return matrix[transform[0]].apply(matrix, transform[1]);
    }, new Matrix());
    return matrix;
  } // add an element to another parent without changing the visual representation on the screen

  function toParent(parent) {
    if (this === parent) return this;
    var ctm = this.screenCTM();
    var pCtm = parent.screenCTM().inverse();
    this.addTo(parent).untransform().transform(pCtm.multiply(ctm));
    return this;
  } // same as above with parent equals root-svg

  function toDoc() {
    return this.toParent(this.doc());
  } // Add transformations

  function transform(o, relative) {
    // Act as a getter if no object was passed
    if (o == null || typeof o === 'string') {
      var decomposed = new Matrix(this).decompose();
      return decomposed[o] || decomposed;
    }

    if (!Matrix.isMatrixLike(o)) {
      // Set the origin according to the defined transform
      o = _objectSpread({}, o, {
        origin: getOrigin(o, this)
      });
    } // The user can pass a boolean, an Element or an Matrix or nothing


    var cleanRelative = relative === true ? this : relative || false;
    var result = new Matrix(cleanRelative).transform(o);
    return this.attr('transform', result);
  }
  registerMethods('Element', {
    untransform: untransform,
    matrixify: matrixify,
    toParent: toParent,
    toDoc: toDoc,
    transform: transform
  });

  var Shape =
  /*#__PURE__*/
  function (_Element) {
    _inherits(Shape, _Element);

    function Shape() {
      _classCallCheck(this, Shape);

      return _possibleConstructorReturn(this, _getPrototypeOf(Shape).apply(this, arguments));
    }

    return Shape;
  }(Element);

  var Circle =
  /*#__PURE__*/
  function (_Shape) {
    _inherits(Circle, _Shape);

    function Circle(node) {
      _classCallCheck(this, Circle);

      return _possibleConstructorReturn(this, _getPrototypeOf(Circle).call(this, nodeOrNew('circle', node), Circle));
    }

    _createClass(Circle, [{
      key: "radius",
      value: function radius(r) {
        return this.attr('r', r);
      } // Radius x value

    }, {
      key: "rx",
      value: function rx$$1(_rx) {
        return this.attr('r', _rx);
      } // Alias radius x value

    }, {
      key: "ry",
      value: function ry$$1(_ry) {
        return this.rx(_ry);
      }
    }]);

    return Circle;
  }(Shape);
  extend(Circle, {
    x: x,
    y: y,
    cx: cx,
    cy: cy,
    width: width,
    height: height,
    size: size
  });
  registerMethods({
    Element: {
      // Create circle element
      circle: function circle(size$$1) {
        return this.put(new Circle()).radius(new SVGNumber(size$$1).divide(2)).move(0, 0);
      }
    }
  });
  register(Circle);

  var Ellipse =
  /*#__PURE__*/
  function (_Shape) {
    _inherits(Ellipse, _Shape);

    function Ellipse(node) {
      _classCallCheck(this, Ellipse);

      return _possibleConstructorReturn(this, _getPrototypeOf(Ellipse).call(this, nodeOrNew('ellipse', node), Ellipse));
    }

    return Ellipse;
  }(Shape);
  extend(Ellipse, circled);
  registerMethods('Container', {
    // Create an ellipse
    ellipse: function ellipse(width$$1, height$$1) {
      return this.put(new Ellipse()).size(width$$1, height$$1).move(0, 0);
    }
  });
  register(Ellipse);

  var Stop =
  /*#__PURE__*/
  function (_Element) {
    _inherits(Stop, _Element);

    function Stop(node) {
      _classCallCheck(this, Stop);

      return _possibleConstructorReturn(this, _getPrototypeOf(Stop).call(this, nodeOrNew('stop', node), Stop));
    } // add color stops


    _createClass(Stop, [{
      key: "update",
      value: function update(o) {
        if (typeof o === 'number' || o instanceof SVGNumber) {
          o = {
            offset: arguments[0],
            color: arguments[1],
            opacity: arguments[2]
          };
        } // set attributes


        if (o.opacity != null) this.attr('stop-opacity', o.opacity);
        if (o.color != null) this.attr('stop-color', o.color);
        if (o.offset != null) this.attr('offset', new SVGNumber(o.offset));
        return this;
      }
    }]);

    return Stop;
  }(Element);
  register(Stop);

  function baseFind(query, parent) {
    return map((parent || document).querySelectorAll(query), function (node) {
      return adopt(node);
    });
  } // Scoped find method

  function find(query) {
    return baseFind(query, this.node);
  }
  registerMethods('Dom', {
    find: find
  });

  var Gradient =
  /*#__PURE__*/
  function (_Container) {
    _inherits(Gradient, _Container);

    function Gradient(type) {
      _classCallCheck(this, Gradient);

      return _possibleConstructorReturn(this, _getPrototypeOf(Gradient).call(this, nodeOrNew(type + 'Gradient', typeof type === 'string' ? null : type), Gradient));
    } // Add a color stop


    _createClass(Gradient, [{
      key: "stop",
      value: function stop(offset, color, opacity) {
        return this.put(new Stop()).update(offset, color, opacity);
      } // Update gradient

    }, {
      key: "update",
      value: function update(block) {
        // remove all stops
        this.clear(); // invoke passed block

        if (typeof block === 'function') {
          block.call(this, this);
        }

        return this;
      } // Return the fill id

    }, {
      key: "url",
      value: function url() {
        return 'url(#' + this.id() + ')';
      } // Alias string convertion to fill

    }, {
      key: "toString",
      value: function toString() {
        return this.url();
      } // custom attr to handle transform

    }, {
      key: "attr",
      value: function attr(a, b, c) {
        if (a === 'transform') a = 'gradientTransform';
        return _get(_getPrototypeOf(Gradient.prototype), "attr", this).call(this, a, b, c);
      }
    }, {
      key: "targets",
      value: function targets() {
        return baseFind('svg [fill*="' + this.id() + '"]');
      }
    }, {
      key: "bbox",
      value: function bbox() {
        return new Box();
      }
    }]);

    return Gradient;
  }(Container);
  extend(Gradient, gradiented);
  registerMethods({
    Container: {
      // Create gradient element in defs
      gradient: function gradient(type, block) {
        return this.defs().gradient(type, block);
      }
    },
    // define gradient
    Defs: {
      gradient: function gradient(type, block) {
        return this.put(new Gradient(type)).update(block);
      }
    }
  });
  register(Gradient);

  var Pattern =
  /*#__PURE__*/
  function (_Container) {
    _inherits(Pattern, _Container);

    // Initialize node
    function Pattern(node) {
      _classCallCheck(this, Pattern);

      return _possibleConstructorReturn(this, _getPrototypeOf(Pattern).call(this, nodeOrNew('pattern', node), Pattern));
    } // Return the fill id


    _createClass(Pattern, [{
      key: "url",
      value: function url() {
        return 'url(#' + this.id() + ')';
      } // Update pattern by rebuilding

    }, {
      key: "update",
      value: function update(block) {
        // remove content
        this.clear(); // invoke passed block

        if (typeof block === 'function') {
          block.call(this, this);
        }

        return this;
      } // Alias string convertion to fill

    }, {
      key: "toString",
      value: function toString() {
        return this.url();
      } // custom attr to handle transform

    }, {
      key: "attr",
      value: function attr(a, b, c) {
        if (a === 'transform') a = 'patternTransform';
        return _get(_getPrototypeOf(Pattern.prototype), "attr", this).call(this, a, b, c);
      }
    }, {
      key: "targets",
      value: function targets() {
        return baseFind('svg [fill*="' + this.id() + '"]');
      }
    }, {
      key: "bbox",
      value: function bbox() {
        return new Box();
      }
    }]);

    return Pattern;
  }(Container);
  registerMethods({
    Container: {
      // Create pattern element in defs
      pattern: function pattern(width, height, block) {
        return this.defs().pattern(width, height, block);
      }
    },
    Defs: {
      pattern: function pattern(width, height, block) {
        return this.put(new Pattern()).update(block).attr({
          x: 0,
          y: 0,
          width: width,
          height: height,
          patternUnits: 'userSpaceOnUse'
        });
      }
    }
  });
  register(Pattern);

  var Image =
  /*#__PURE__*/
  function (_Shape) {
    _inherits(Image, _Shape);

    function Image(node) {
      _classCallCheck(this, Image);

      return _possibleConstructorReturn(this, _getPrototypeOf(Image).call(this, nodeOrNew('image', node), Image));
    } // (re)load image


    _createClass(Image, [{
      key: "load",
      value: function load(url, callback) {
        if (!url) return this;
        var img = new window.Image();
        on(img, 'load', function (e) {
          var p = this.parent(Pattern); // ensure image size

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
        return this.attr('href', img.src = url, xlink);
      }
    }]);

    return Image;
  }(Shape);
  registerAttrHook(function (attr$$1, val, _this) {
    // convert image fill and stroke to patterns
    if (attr$$1 === 'fill' || attr$$1 === 'stroke') {
      if (isImage.test(val)) {
        val = _this.doc().defs().image(val);
      }
    }

    if (val instanceof Image) {
      val = _this.doc().defs().pattern(0, 0, function (pattern) {
        pattern.add(val);
      });
    }

    return val;
  });
  registerMethods({
    Container: {
      // create image element, load image and set its size
      image: function image(source, callback) {
        return this.put(new Image()).size(0, 0).load(source, callback);
      }
    }
  });
  register(Image);

  var PointArray = subClassArray('PointArray', SVGArray);
  extend(PointArray, {
    // Convert array to string
    toString: function toString() {
      // convert to a poly point string
      for (var i = 0, il = this.length, array = []; i < il; i++) {
        array.push(this[i].join(','));
      }

      return array.join(' ');
    },
    // Convert array to line object
    toLine: function toLine() {
      return {
        x1: this[0][0],
        y1: this[0][1],
        x2: this[1][0],
        y2: this[1][1]
      };
    },
    // Get morphed array at given position
    at: function at(pos) {
      // make sure a destination is defined
      if (!this.destination) return this; // generate morphed point string

      for (var i = 0, il = this.length, array = []; i < il; i++) {
        array.push([this[i][0] + (this.destination[i][0] - this[i][0]) * pos, this[i][1] + (this.destination[i][1] - this[i][1]) * pos]);
      }

      return new PointArray(array);
    },
    // Parse point string and flat array
    parse: function parse() {
      var array = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [[0, 0]];
      var points = []; // if it is an array

      if (array instanceof Array) {
        // and it is not flat, there is no need to parse it
        if (array[0] instanceof Array) {
          return array;
        }
      } else {
        // Else, it is considered as a string
        // parse points
        array = array.trim().split(delimiter).map(parseFloat);
      } // validate points - https://svgwg.org/svg2-draft/shapes.html#DataTypePoints
      // Odd number of coordinates is an error. In such cases, drop the last odd coordinate.


      if (array.length % 2 !== 0) array.pop(); // wrap points in two-tuples and parse points as floats

      for (var i = 0, len = array.length; i < len; i = i + 2) {
        points.push([array[i], array[i + 1]]);
      }

      return points;
    },
    // Move point string
    move: function move(x, y) {
      var box = this.bbox(); // get relative offset

      x -= box.x;
      y -= box.y; // move every point

      if (!isNaN(x) && !isNaN(y)) {
        for (var i = this.length - 1; i >= 0; i--) {
          this[i] = [this[i][0] + x, this[i][1] + y];
        }
      }

      return this;
    },
    // Resize poly string
    size: function size(width, height) {
      var i;
      var box = this.bbox(); // recalculate position of all points according to new size

      for (i = this.length - 1; i >= 0; i--) {
        if (box.width) this[i][0] = (this[i][0] - box.x) * width / box.width + box.x;
        if (box.height) this[i][1] = (this[i][1] - box.y) * height / box.height + box.y;
      }

      return this;
    },
    // Get bounding box of points
    bbox: function bbox() {
      var maxX = -Infinity;
      var maxY = -Infinity;
      var minX = Infinity;
      var minY = Infinity;
      this.forEach(function (el) {
        maxX = Math.max(el[0], maxX);
        maxY = Math.max(el[1], maxY);
        minX = Math.min(el[0], minX);
        minY = Math.min(el[1], minY);
      });
      return {
        x: minX,
        y: minY,
        width: maxX - minX,
        height: maxY - minY
      };
    }
  });

  var MorphArray = PointArray; // Move by left top corner over x-axis

  function x$1(x) {
    return x == null ? this.bbox().x : this.move(x, this.bbox().y);
  } // Move by left top corner over y-axis

  function y$1(y) {
    return y == null ? this.bbox().y : this.move(this.bbox().x, y);
  } // Set width of element

  function width$1(width) {
    var b = this.bbox();
    return width == null ? b.width : this.size(width, b.height);
  } // Set height of element

  function height$1(height) {
    var b = this.bbox();
    return height == null ? b.height : this.size(b.width, height);
  }

  var pointed = /*#__PURE__*/Object.freeze({
    MorphArray: MorphArray,
    x: x$1,
    y: y$1,
    width: width$1,
    height: height$1
  });

  var Line =
  /*#__PURE__*/
  function (_Shape) {
    _inherits(Line, _Shape);

    // Initialize node
    function Line(node) {
      _classCallCheck(this, Line);

      return _possibleConstructorReturn(this, _getPrototypeOf(Line).call(this, nodeOrNew('line', node), Line));
    } // Get array


    _createClass(Line, [{
      key: "array",
      value: function array() {
        return new PointArray([[this.attr('x1'), this.attr('y1')], [this.attr('x2'), this.attr('y2')]]);
      } // Overwrite native plot() method

    }, {
      key: "plot",
      value: function plot(x1, y1, x2, y2) {
        if (x1 == null) {
          return this.array();
        } else if (typeof y1 !== 'undefined') {
          x1 = {
            x1: x1,
            y1: y1,
            x2: x2,
            y2: y2
          };
        } else {
          x1 = new PointArray(x1).toLine();
        }

        return this.attr(x1);
      } // Move by left top corner

    }, {
      key: "move",
      value: function move(x, y) {
        return this.attr(this.array().move(x, y).toLine());
      } // Set element size to given width and height

    }, {
      key: "size",
      value: function size(width, height) {
        var p = proportionalSize(this, width, height);
        return this.attr(this.array().size(p.width, p.height).toLine());
      }
    }]);

    return Line;
  }(Shape);
  extend(Line, pointed);
  registerMethods({
    Container: {
      // Create a line element
      line: function line() {
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        // make sure plot is called as a setter
        // x1 is not necessarily a number, it can also be an array, a string and a PointArray
        return Line.prototype.plot.apply(this.put(new Line()), args[0] != null ? args : [0, 0, 0, 0]);
      }
    }
  });
  register(Line);

  var Marker =
  /*#__PURE__*/
  function (_Container) {
    _inherits(Marker, _Container);

    // Initialize node
    function Marker(node) {
      _classCallCheck(this, Marker);

      return _possibleConstructorReturn(this, _getPrototypeOf(Marker).call(this, nodeOrNew('marker', node), Marker));
    } // Set width of element


    _createClass(Marker, [{
      key: "width",
      value: function width(_width) {
        return this.attr('markerWidth', _width);
      } // Set height of element

    }, {
      key: "height",
      value: function height(_height) {
        return this.attr('markerHeight', _height);
      } // Set marker refX and refY

    }, {
      key: "ref",
      value: function ref(x, y) {
        return this.attr('refX', x).attr('refY', y);
      } // Update marker

    }, {
      key: "update",
      value: function update(block) {
        // remove all content
        this.clear(); // invoke passed block

        if (typeof block === 'function') {
          block.call(this, this);
        }

        return this;
      } // Return the fill id

    }, {
      key: "toString",
      value: function toString() {
        return 'url(#' + this.id() + ')';
      }
    }]);

    return Marker;
  }(Container);
  registerMethods({
    Container: {
      marker: function marker(width, height, block) {
        // Create marker element in defs
        return this.defs().marker(width, height, block);
      }
    },
    Defs: {
      // Create marker
      marker: function marker(width, height, block) {
        // Set default viewbox to match the width and height, set ref to cx and cy and set orient to auto
        return this.put(new Marker()).size(width, height).ref(width / 2, height / 2).viewbox(0, 0, width, height).attr('orient', 'auto').update(block);
      }
    },
    marker: {
      // Create and attach markers
      marker: function marker(_marker, width, height, block) {
        var attr = ['marker']; // Build attribute name

        if (_marker !== 'all') attr.push(_marker);
        attr = attr.join('-'); // Set marker attribute

        _marker = arguments[1] instanceof Marker ? arguments[1] : this.defs().marker(width, height, block);
        return this.attr(attr, _marker);
      }
    }
  });
  register(Marker);

  var Path =
  /*#__PURE__*/
  function (_Shape) {
    _inherits(Path, _Shape);

    // Initialize node
    function Path(node) {
      _classCallCheck(this, Path);

      return _possibleConstructorReturn(this, _getPrototypeOf(Path).call(this, nodeOrNew('path', node), Path));
    } // Get array


    _createClass(Path, [{
      key: "array",
      value: function array() {
        return this._array || (this._array = new PathArray(this.attr('d')));
      } // Plot new path

    }, {
      key: "plot",
      value: function plot(d) {
        return d == null ? this.array() : this.clear().attr('d', typeof d === 'string' ? d : this._array = new PathArray(d));
      } // Clear array cache

    }, {
      key: "clear",
      value: function clear() {
        delete this._array;
        return this;
      } // Move by left top corner

    }, {
      key: "move",
      value: function move(x, y) {
        return this.attr('d', this.array().move(x, y));
      } // Move by left top corner over x-axis

    }, {
      key: "x",
      value: function x(_x) {
        return _x == null ? this.bbox().x : this.move(_x, this.bbox().y);
      } // Move by left top corner over y-axis

    }, {
      key: "y",
      value: function y(_y) {
        return _y == null ? this.bbox().y : this.move(this.bbox().x, _y);
      } // Set element size to given width and height

    }, {
      key: "size",
      value: function size(width, height) {
        var p = proportionalSize(this, width, height);
        return this.attr('d', this.array().size(p.width, p.height));
      } // Set width of element

    }, {
      key: "width",
      value: function width(_width) {
        return _width == null ? this.bbox().width : this.size(_width, this.bbox().height);
      } // Set height of element

    }, {
      key: "height",
      value: function height(_height) {
        return _height == null ? this.bbox().height : this.size(this.bbox().width, _height);
      }
    }, {
      key: "targets",
      value: function targets() {
        return baseFind('svg textpath [href*="' + this.id() + '"]');
      }
    }]);

    return Path;
  }(Shape); // Define morphable array
  Path.prototype.MorphArray = PathArray; // Add parent method

  registerMethods({
    Container: {
      // Create a wrapped path element
      path: function path(d) {
        // make sure plot is called as a setter
        return this.put(new Path()).plot(d || new PathArray());
      }
    }
  });
  register(Path);

  function array() {
    return this._array || (this._array = new PointArray(this.attr('points')));
  } // Plot new path

  function plot(p) {
    return p == null ? this.array() : this.clear().attr('points', typeof p === 'string' ? p : this._array = new PointArray(p));
  } // Clear array cache

  function clear() {
    delete this._array;
    return this;
  } // Move by left top corner

  function move(x, y) {
    return this.attr('points', this.array().move(x, y));
  } // Set element size to given width and height

  function size$1(width, height) {
    var p = proportionalSize(this, width, height);
    return this.attr('points', this.array().size(p.width, p.height));
  }

  var poly = /*#__PURE__*/Object.freeze({
    array: array,
    plot: plot,
    clear: clear,
    move: move,
    size: size$1
  });

  var Polygon =
  /*#__PURE__*/
  function (_Shape) {
    _inherits(Polygon, _Shape);

    // Initialize node
    function Polygon(node) {
      _classCallCheck(this, Polygon);

      return _possibleConstructorReturn(this, _getPrototypeOf(Polygon).call(this, nodeOrNew('polygon', node), Polygon));
    }

    return Polygon;
  }(Shape);
  registerMethods({
    Container: {
      // Create a wrapped polygon element
      polygon: function polygon(p) {
        // make sure plot is called as a setter
        return this.put(new Polygon()).plot(p || new PointArray());
      }
    }
  });
  extend(Polygon, pointed);
  extend(Polygon, poly);
  register(Polygon);

  var Polyline =
  /*#__PURE__*/
  function (_Shape) {
    _inherits(Polyline, _Shape);

    // Initialize node
    function Polyline(node) {
      _classCallCheck(this, Polyline);

      return _possibleConstructorReturn(this, _getPrototypeOf(Polyline).call(this, nodeOrNew('polyline', node), Polyline));
    }

    return Polyline;
  }(Shape);
  registerMethods({
    Container: {
      // Create a wrapped polygon element
      polyline: function polyline(p) {
        // make sure plot is called as a setter
        return this.put(new Polyline()).plot(p || new PointArray());
      }
    }
  });
  extend(Polyline, pointed);
  extend(Polyline, poly);
  register(Polyline);

  var Rect =
  /*#__PURE__*/
  function (_Shape) {
    _inherits(Rect, _Shape);

    // Initialize node
    function Rect(node) {
      _classCallCheck(this, Rect);

      return _possibleConstructorReturn(this, _getPrototypeOf(Rect).call(this, nodeOrNew('rect', node), Rect));
    }

    return Rect;
  }(Shape);
  extend(Rect, {
    rx: rx,
    ry: ry
  });
  registerMethods({
    Container: {
      // Create a rect element
      rect: function rect(width$$1, height$$1) {
        return this.put(new Rect()).size(width$$1, height$$1);
      }
    }
  });
  register(Rect);

  // Create plain text node
  function plain(text) {
    // clear if build mode is disabled
    if (this._build === false) {
      this.clear();
    } // create text node


    this.node.appendChild(document.createTextNode(text));
    return this;
  } // Get length of text element

  function length() {
    return this.node.getComputedTextLength();
  }

  var textable = /*#__PURE__*/Object.freeze({
    plain: plain,
    length: length
  });

  var Text =
  /*#__PURE__*/
  function (_Shape) {
    _inherits(Text, _Shape);

    // Initialize node
    function Text(node) {
      var _this;

      _classCallCheck(this, Text);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(Text).call(this, nodeOrNew('text', node), Text));
      _this.dom.leading = new SVGNumber(1.3); // store leading value for rebuilding

      _this._rebuild = true; // enable automatic updating of dy values

      _this._build = false; // disable build mode for adding multiple lines
      // set default font

      _this.attr('font-family', attrs['font-family']);

      return _this;
    } // Move over x-axis


    _createClass(Text, [{
      key: "x",
      value: function x(_x) {
        // act as getter
        if (_x == null) {
          return this.attr('x');
        }

        return this.attr('x', _x);
      } // Move over y-axis

    }, {
      key: "y",
      value: function y(_y) {
        var oy = this.attr('y');
        var o = typeof oy === 'number' ? oy - this.bbox().y : 0; // act as getter

        if (_y == null) {
          return typeof oy === 'number' ? oy - o : oy;
        }

        return this.attr('y', typeof _y === 'number' ? _y + o : _y);
      } // Move center over x-axis

    }, {
      key: "cx",
      value: function cx(x) {
        return x == null ? this.bbox().cx : this.x(x - this.bbox().width / 2);
      } // Move center over y-axis

    }, {
      key: "cy",
      value: function cy(y) {
        return y == null ? this.bbox().cy : this.y(y - this.bbox().height / 2);
      } // Set the text content

    }, {
      key: "text",
      value: function text(_text) {
        // act as getter
        if (_text === undefined) {
          var children = this.node.childNodes;
          var firstLine = 0;
          _text = '';

          for (var i = 0, len = children.length; i < len; ++i) {
            // skip textPaths - they are no lines
            if (children[i].nodeName === 'textPath') {
              if (i === 0) firstLine = 1;
              continue;
            } // add newline if its not the first child and newLined is set to true


            if (i !== firstLine && children[i].nodeType !== 3 && adopt(children[i]).dom.newLined === true) {
              _text += '\n';
            } // add content of this node


            _text += children[i].textContent;
          }

          return _text;
        } // remove existing content


        this.clear().build(true);

        if (typeof _text === 'function') {
          // call block
          _text.call(this, this);
        } else {
          // store text and make sure text is not blank
          _text = _text.split('\n'); // build new lines

          for (var j = 0, jl = _text.length; j < jl; j++) {
            this.tspan(_text[j]).newLine();
          }
        } // disable build mode and rebuild lines


        return this.build(false).rebuild();
      } // Set / get leading

    }, {
      key: "leading",
      value: function leading(value) {
        // act as getter
        if (value == null) {
          return this.dom.leading;
        } // act as setter


        this.dom.leading = new SVGNumber(value);
        return this.rebuild();
      } // Rebuild appearance type

    }, {
      key: "rebuild",
      value: function rebuild(_rebuild) {
        // store new rebuild flag if given
        if (typeof _rebuild === 'boolean') {
          this._rebuild = _rebuild;
        } // define position of all lines


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

        return this;
      } // Enable / disable build mode

    }, {
      key: "build",
      value: function build(_build) {
        this._build = !!_build;
        return this;
      } // overwrite method from parent to set data properly

    }, {
      key: "setData",
      value: function setData(o) {
        this.dom = o;
        this.dom.leading = new SVGNumber(o.leading || 1.3);
        return this;
      }
    }]);

    return Text;
  }(Shape);
  extend(Text, textable);
  registerMethods({
    Container: {
      // Create text element
      text: function text(_text2) {
        return this.put(new Text()).text(_text2);
      },
      // Create plain text element
      plain: function plain$$1(text) {
        return this.put(new Text()).plain(text);
      }
    }
  });
  register(Text);

  var Tspan =
  /*#__PURE__*/
  function (_Text) {
    _inherits(Tspan, _Text);

    // Initialize node
    function Tspan(node) {
      _classCallCheck(this, Tspan);

      return _possibleConstructorReturn(this, _getPrototypeOf(Tspan).call(this, nodeOrNew('tspan', node), Tspan));
    } // Set text content


    _createClass(Tspan, [{
      key: "text",
      value: function text(_text) {
        if (_text == null) return this.node.textContent + (this.dom.newLined ? '\n' : '');
        typeof _text === 'function' ? _text.call(this, this) : this.plain(_text);
        return this;
      } // Shortcut dx

    }, {
      key: "dx",
      value: function dx(_dx) {
        return this.attr('dx', _dx);
      } // Shortcut dy

    }, {
      key: "dy",
      value: function dy(_dy) {
        return this.attr('dy', _dy);
      } // Create new line

    }, {
      key: "newLine",
      value: function newLine() {
        // fetch text parent
        var t = this.parent(Text); // mark new line

        this.dom.newLined = true; // apply new position

        return this.dy(t.dom.leading * t.attr('font-size')).attr('x', t.x());
      }
    }]);

    return Tspan;
  }(Text);
  extend(Tspan, textable);
  registerMethods({
    Tspan: {
      tspan: function tspan(text) {
        var tspan = new Tspan(); // clear if build mode is disabled

        if (!this._build) {
          this.clear();
        } // add new tspan


        this.node.appendChild(tspan.node);
        return tspan.text(text);
      }
    }
  });
  register(Tspan);

  var Bare =
  /*#__PURE__*/
  function (_Container) {
    _inherits(Bare, _Container);

    function Bare(node) {
      _classCallCheck(this, Bare);

      return _possibleConstructorReturn(this, _getPrototypeOf(Bare).call(this, nodeOrNew(node, typeof node === 'string' ? null : node), Bare));
    }

    _createClass(Bare, [{
      key: "words",
      value: function words(text) {
        // remove contents
        while (this.node.hasChildNodes()) {
          this.node.removeChild(this.node.lastChild);
        } // create text node


        this.node.appendChild(document.createTextNode(text));
        return this;
      }
    }]);

    return Bare;
  }(Container);
  register(Bare);
  registerMethods('Container', {
    // Create an element that is not described by SVG.js
    element: function element(node, inherit) {
      return this.put(new Bare(node, inherit));
    }
  });

  var ClipPath =
  /*#__PURE__*/
  function (_Container) {
    _inherits(ClipPath, _Container);

    function ClipPath(node) {
      _classCallCheck(this, ClipPath);

      return _possibleConstructorReturn(this, _getPrototypeOf(ClipPath).call(this, nodeOrNew('clipPath', node), ClipPath));
    } // Unclip all clipped elements and remove itself


    _createClass(ClipPath, [{
      key: "remove",
      value: function remove() {
        // unclip all targets
        this.targets().forEach(function (el) {
          el.unclip();
        }); // remove clipPath from parent

        return _get(_getPrototypeOf(ClipPath.prototype), "remove", this).call(this);
      }
    }, {
      key: "targets",
      value: function targets() {
        return baseFind('svg [clip-path*="' + this.id() + '"]');
      }
    }]);

    return ClipPath;
  }(Container);
  registerMethods({
    Container: {
      // Create clipping element
      clip: function clip() {
        return this.defs().put(new ClipPath());
      }
    },
    Element: {
      // Distribute clipPath to svg element
      clipWith: function clipWith(element) {
        // use given clip or create a new one
        var clipper = element instanceof ClipPath ? element : this.parent().clip().add(element); // apply mask

        return this.attr('clip-path', 'url("#' + clipper.id() + '")');
      },
      // Unclip element
      unclip: function unclip() {
        return this.attr('clip-path', null);
      },
      clipper: function clipper() {
        return this.reference('clip-path');
      }
    }
  });
  register(ClipPath);

  var G =
  /*#__PURE__*/
  function (_Container) {
    _inherits(G, _Container);

    function G(node) {
      _classCallCheck(this, G);

      return _possibleConstructorReturn(this, _getPrototypeOf(G).call(this, nodeOrNew('g', node), G));
    }

    return G;
  }(Container);
  registerMethods({
    Element: {
      // Create a group element
      group: function group() {
        return this.put(new G());
      }
    }
  });
  register(G);

  var HtmlNode =
  /*#__PURE__*/
  function (_Dom) {
    _inherits(HtmlNode, _Dom);

    function HtmlNode(node) {
      _classCallCheck(this, HtmlNode);

      return _possibleConstructorReturn(this, _getPrototypeOf(HtmlNode).call(this, node, HtmlNode));
    }

    return HtmlNode;
  }(Dom);
  register(HtmlNode);

  var A =
  /*#__PURE__*/
  function (_Container) {
    _inherits(A, _Container);

    function A(node) {
      _classCallCheck(this, A);

      return _possibleConstructorReturn(this, _getPrototypeOf(A).call(this, nodeOrNew('a', node), A));
    } // Link url


    _createClass(A, [{
      key: "to",
      value: function to(url) {
        return this.attr('href', url, xlink);
      } // Link target attribute

    }, {
      key: "target",
      value: function target(_target) {
        return this.attr('target', _target);
      }
    }]);

    return A;
  }(Container);
  registerMethods({
    Container: {
      // Create a hyperlink element
      link: function link(url) {
        return this.put(new A()).to(url);
      }
    },
    Element: {
      // Create a hyperlink element
      linkTo: function linkTo(url) {
        var link = new A();

        if (typeof url === 'function') {
          url.call(link, link);
        } else {
          link.to(url);
        }

        return this.parent().put(link).put(this);
      }
    }
  });
  register(A);

  var Mask =
  /*#__PURE__*/
  function (_Container) {
    _inherits(Mask, _Container);

    // Initialize node
    function Mask(node) {
      _classCallCheck(this, Mask);

      return _possibleConstructorReturn(this, _getPrototypeOf(Mask).call(this, nodeOrNew('mask', node), Mask));
    } // Unmask all masked elements and remove itself


    _createClass(Mask, [{
      key: "remove",
      value: function remove() {
        // unmask all targets
        this.targets().forEach(function (el) {
          el.unmask();
        }); // remove mask from parent

        return _get(_getPrototypeOf(Mask.prototype), "remove", this).call(this);
      }
    }, {
      key: "targets",
      value: function targets() {
        return baseFind('svg [mask*="' + this.id() + '"]');
      }
    }]);

    return Mask;
  }(Container);
  registerMethods({
    Container: {
      mask: function mask() {
        return this.defs().put(new Mask());
      }
    },
    Element: {
      // Distribute mask to svg element
      maskWith: function maskWith(element) {
        // use given mask or create a new one
        var masker = element instanceof Mask ? element : this.parent().mask().add(element); // apply mask

        return this.attr('mask', 'url("#' + masker.id() + '")');
      },
      // Unmask element
      unmask: function unmask() {
        return this.attr('mask', null);
      },
      masker: function masker() {
        return this.reference('mask');
      }
    }
  });
  register(Mask);

  function cssRule(selector, rule) {
    if (!selector) return '';
    if (!rule) return selector;
    var ret = selector + '{';

    for (var i in rule) {
      ret += unCamelCase(i) + ':' + rule[i] + ';';
    }

    ret += '}';
    return ret;
  }

  var Style =
  /*#__PURE__*/
  function (_Element) {
    _inherits(Style, _Element);

    function Style(node) {
      _classCallCheck(this, Style);

      return _possibleConstructorReturn(this, _getPrototypeOf(Style).call(this, nodeOrNew('style', node), Style));
    }

    _createClass(Style, [{
      key: "words",
      value: function words(w) {
        this.node.textContent += w || '';
        return this;
      }
    }, {
      key: "font",
      value: function font(name, src) {
        var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
        return this.rule('@font-face', _objectSpread({
          fontFamily: name,
          src: src
        }, params));
      }
    }, {
      key: "rule",
      value: function rule(selector, obj) {
        return this.words(cssRule(selector, obj));
      }
    }]);

    return Style;
  }(Element);
  registerMethods('Element', {
    style: function style(selector, obj) {
      return this.put(new Style()).rule(selector, obj);
    },
    fontface: function fontface(name, src, params) {
      return this.put(new Style()).font(name, src, params);
    }
  });

  var _Symbol =
  /*#__PURE__*/
  function (_Container) {
    _inherits(_Symbol, _Container);

    // Initialize node
    function _Symbol(node) {
      _classCallCheck(this, _Symbol);

      return _possibleConstructorReturn(this, _getPrototypeOf(_Symbol).call(this, nodeOrNew('symbol', node), _Symbol));
    }

    return _Symbol;
  }(Container);
  registerMethods({
    Container: {
      symbol: function symbol() {
        return this.put(new _Symbol());
      }
    }
  });
  register(_Symbol);

  var TextPath =
  /*#__PURE__*/
  function (_Text) {
    _inherits(TextPath, _Text);

    // Initialize node
    function TextPath(node) {
      _classCallCheck(this, TextPath);

      return _possibleConstructorReturn(this, _getPrototypeOf(TextPath).call(this, nodeOrNew('textPath', node), TextPath));
    } // return the array of the path track element


    _createClass(TextPath, [{
      key: "array",
      value: function array() {
        var track = this.track();
        return track ? track.array() : null;
      } // Plot path if any

    }, {
      key: "plot",
      value: function plot(d) {
        var track = this.track();
        var pathArray = null;

        if (track) {
          pathArray = track.plot(d);
        }

        return d == null ? pathArray : this;
      } // Get the path element

    }, {
      key: "track",
      value: function track() {
        return this.reference('href');
      }
    }]);

    return TextPath;
  }(Text);
  registerMethods({
    Container: {
      textPath: function textPath(text, path) {
        return this.defs().path(path).text(text).addTo(this);
      }
    },
    Text: {
      // Create path for text to run on
      path: function path(track) {
        var path = new TextPath(); // if track is a path, reuse it

        if (!(track instanceof Path)) {
          // create path element
          track = this.doc().defs().path(track);
        } // link textPath to path and add content


        path.attr('href', '#' + track, xlink); // add textPath element as child node and return textPath

        return this.put(path);
      },
      // Get the textPath children
      textPath: function textPath() {
        return this.find('textPath')[0];
      }
    },
    Path: {
      // creates a textPath from this path
      text: function text(_text) {
        if (_text instanceof Text) {
          var txt = _text.text();

          return _text.clear().path(this).text(txt);
        }

        return this.parent().put(new Text()).path(this).text(_text);
      },
      targets: function targets() {
        return baseFind('svg [href*="' + this.id() + '"]');
      }
    }
  });
  TextPath.prototype.MorphArray = PathArray;
  register(TextPath);

  var Use =
  /*#__PURE__*/
  function (_Shape) {
    _inherits(Use, _Shape);

    function Use(node) {
      _classCallCheck(this, Use);

      return _possibleConstructorReturn(this, _getPrototypeOf(Use).call(this, nodeOrNew('use', node), Use));
    } // Use element as a reference


    _createClass(Use, [{
      key: "element",
      value: function element(_element, file) {
        // Set lined element
        return this.attr('href', (file || '') + '#' + _element, xlink);
      }
    }]);

    return Use;
  }(Shape);
  registerMethods({
    Container: {
      // Create a use element
      use: function use(element, file) {
        return this.put(new Use()).element(element, file);
      }
    }
  });
  register(Use);

  /* Optional Modules */
  extend([Doc$1, Symbol, Image, Pattern, Marker], getMethodsFor('viewbox'));
  extend([Line, Polyline, Polygon, Path], getMethodsFor('marker'));
  extend(Text, getMethodsFor('Text'));
  extend(Path, getMethodsFor('Path'));
  extend(Defs, getMethodsFor('Defs'));
  extend([Text, Tspan], getMethodsFor('Tspan'));
  extend([Rect, Ellipse, Circle, Gradient], getMethodsFor('radius'));
  extend(EventTarget, getMethodsFor('EventTarget'));
  extend(Dom, getMethodsFor('Dom'));
  extend(Element, getMethodsFor('Element'));
  extend(Shape, getMethodsFor('Shape')); // extend(Element, getConstructor('Memory'))

  extend(Container, getMethodsFor('Container'));
  registerMorphableType([SVGNumber, Color, Box, Matrix, SVGArray, PointArray, PathArray]);
  makeMorphable();

  var svgMembers = /*#__PURE__*/Object.freeze({
    Morphable: Morphable,
    registerMorphableType: registerMorphableType,
    makeMorphable: makeMorphable,
    TransformBag: TransformBag,
    ObjectBag: ObjectBag,
    NonMorphable: NonMorphable,
    defaults: defaults,
    parser: parser,
    find: baseFind,
    Animator: Animator,
    Controller: Controller,
    Ease: Ease,
    PID: PID,
    Spring: Spring,
    easing: easing,
    Queue: Queue,
    Runner: Runner,
    Timeline: Timeline,
    SVGArray: SVGArray,
    Box: Box,
    Color: Color,
    EventTarget: EventTarget,
    Matrix: Matrix,
    SVGNumber: SVGNumber,
    PathArray: PathArray,
    Point: Point,
    PointArray: PointArray,
    Bare: Bare,
    Circle: Circle,
    ClipPath: ClipPath,
    Container: Container,
    Defs: Defs,
    Doc: Doc$1,
    Dom: Dom,
    Element: Element,
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
    Shape: Shape,
    Stop: Stop,
    Style: Style,
    Symbol: _Symbol,
    Text: Text,
    TextPath: TextPath,
    Tspan: Tspan,
    Use: Use,
    map: map,
    filter: filter,
    radians: radians,
    degrees: degrees,
    camelCase: camelCase,
    unCamelCase: unCamelCase,
    capitalize: capitalize,
    proportionalSize: proportionalSize,
    getOrigin: getOrigin,
    ns: ns,
    xmlns: xmlns,
    xlink: xlink,
    svgjs: svgjs,
    on: on,
    off: off,
    dispatch: dispatch,
    root: root,
    makeNode: makeNode,
    makeInstance: makeInstance,
    nodeOrNew: nodeOrNew,
    adopt: adopt,
    register: register,
    getClass: getClass,
    eid: eid,
    assignNewId: assignNewId,
    extend: extend
  });

  function SVG(element) {
    return makeInstance(element);
  }
  Object.assign(SVG, svgMembers);
  SVG.utils = SVG;
  SVG.regex = regex;
  SVG.get = SVG;

  return SVG;

}());
