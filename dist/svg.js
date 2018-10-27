/*!
* svg.js - A lightweight library for manipulating and animating SVG.
* @version 3.0.0
* https://svgdotjs.github.io/
*
* @copyright Wout Fierens <wout@mick-wout.com>
* @license MIT
*
* BUILT: Sat Oct 27 2018 04:58:03 GMT+0200 (CEST)
*/;

(function(root, factory) {
  /* istanbul ignore next */
  if (typeof define === 'function' && define.amd) {
    define(function(){
      return factory(root, root.document)
    })
  } else if (typeof exports === 'object') {
    module.exports = root.document ? factory(root, root.document) : function(w){ return factory(w, w.document) }
  } else {
    root.SVG = factory(root, root.document)
  }
}(typeof window !== "undefined" ? window : this, function(window, document) {

// Check that our browser supports svg
var supported = !! document.createElementNS &&
  !! document.createElementNS('http://www.w3.org/2000/svg','svg').createSVGRect

// If we don't support svg, just exit without doing anything
if (!supported)
  return {supported: false}

// Otherwise, the library will be here
"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/* global createElement, capitalize */

/* eslint-disable new-cap */
// The main wrapping element
var SVG = window.SVG = function (element) {
  if (SVG.supported) {
    element = createElement(element);
    return element;
  }
}; // Svg must be supported if we reached this stage


SVG.supported = true; // Default namespaces

SVG.ns = 'http://www.w3.org/2000/svg';
SVG.xmlns = 'http://www.w3.org/2000/xmlns/';
SVG.xlink = 'http://www.w3.org/1999/xlink';
SVG.svgjs = 'http://svgjs.com/svgjs'; // Element id sequence

SVG.did = 1000; // Get next named element id

SVG.eid = function (name) {
  return 'Svgjs' + capitalize(name) + SVG.did++;
}; // Method for element creation


SVG.create = function (name) {
  // create element
  return document.createElementNS(this.ns, name);
}; // Method for extending objects


SVG.extend = function (modules, methods) {
  var key, i;
  modules = Array.isArray(modules) ? modules : [modules];

  for (i = modules.length - 1; i >= 0; i--) {
    if (modules[i]) {
      for (key in methods) {
        modules[i].prototype[key] = methods[key];
      }
    }
  }
}; // Invent new element


SVG.invent = function (config) {
  // Create element initializer
  var initializer = typeof config.create === 'function' ? config.create : function (node) {
    config.inherit.call(this, node || SVG.create(config.create));
  }; // Inherit prototype

  if (config.inherit) {
    initializer.prototype = new config.inherit();
    initializer.prototype.constructor = initializer;
  } // Extend with methods


  if (config.extend) {
    SVG.extend(initializer, config.extend);
  } // Attach construct method to parent


  if (config.construct) {
    SVG.extend(config.parent || SVG.Container, config.construct);
  }

  return initializer;
}; // Adopt existing svg elements


SVG.adopt = function (node) {
  // check for presence of node
  if (!node) return null; // make sure a node isn't already adopted

  if (node.instance instanceof SVG.Element) return node.instance;

  if (!(node instanceof window.SVGElement)) {
    return new SVG.HtmlNode(node);
  } // initialize variables


  var element; // adopt with element-specific settings

  if (node.nodeName === 'svg') {
    element = new SVG.Doc(node);
  } else if (node.nodeName === 'linearGradient' || node.nodeName === 'radialGradient') {
    element = new SVG.Gradient(node);
  } else if (SVG[capitalize(node.nodeName)]) {
    element = new SVG[capitalize(node.nodeName)](node);
  } else {
    element = new SVG.Parent(node);
  }

  return element;
}; // Storage for regular expressions


SVG.regex = {
  // Parse unit value
  numberAndUnit: /^([+-]?(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?)([a-z%]*)$/i,
  // Parse hex value
  hex: /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i,
  // Parse rgb value
  rgb: /rgb\((\d+),(\d+),(\d+)\)/,
  // Parse reference id
  reference: /#([a-z0-9\-_]+)/i,
  // splits a transformation chain
  transforms: /\)\s*,?\s*/,
  // Whitespace
  whitespace: /\s/g,
  // Test hex value
  isHex: /^#[a-f0-9]{3,6}$/i,
  // Test rgb value
  isRgb: /^rgb\(/,
  // Test css declaration
  isCss: /[^:]+:[^;]+;?/,
  // Test for blank string
  isBlank: /^(\s+)?$/,
  // Test for numeric string
  isNumber: /^[+-]?(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i,
  // Test for percent value
  isPercent: /^-?[\d.]+%$/,
  // Test for image url
  isImage: /\.(jpg|jpeg|png|gif|svg)(\?[^=]+.*)?/i,
  // split at whitespace and comma
  delimiter: /[\s,]+/,
  // The following regex are used to parse the d attribute of a path
  // Matches all hyphens which are not after an exponent
  hyphen: /([^e])-/gi,
  // Replaces and tests for all path letters
  pathLetters: /[MLHVCSQTAZ]/gi,
  // yes we need this one, too
  isPathLetter: /[MLHVCSQTAZ]/i,
  // matches 0.154.23.45
  numbersWithDots: /((\d?\.\d+(?:e[+-]?\d+)?)((?:\.\d+(?:e[+-]?\d+)?)+))+/gi,
  // matches .
  dots: /\./g
};
SVG.utils = {
  // Map function
  map: function map(array, block) {
    var i;
    var il = array.length;
    var result = [];

    for (i = 0; i < il; i++) {
      result.push(block(array[i]));
    }

    return result;
  },
  // Filter function
  filter: function filter(array, block) {
    var i;
    var il = array.length;
    var result = [];

    for (i = 0; i < il; i++) {
      if (block(array[i])) {
        result.push(array[i]);
      }
    }

    return result;
  },
  // Degrees to radians
  radians: function radians(d) {
    return d % 360 * Math.PI / 180;
  },
  // Radians to degrees
  degrees: function degrees(r) {
    return r * 180 / Math.PI % 360;
  },
  filterSVGElements: function filterSVGElements(nodes) {
    return this.filter(nodes, function (el) {
      return el instanceof window.SVGElement;
    });
  }
};

SVG.void = function () {};

SVG.defaults = {
  // Default animation values
  timeline: {
    duration: 400,
    ease: '>',
    delay: 0
  },
  // Default attribute values
  attrs: {
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
  }
};
SVG.Queue = SVG.invent({
  create: function create() {
    this._first = null;
    this._last = null;
  },
  extend: {
    push: function push(value) {
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
    },
    shift: function shift() {
      // Check if we have a value
      var remove = this._first;
      if (!remove) return null; // If we do, remove it and relink things

      this._first = remove.next;
      if (this._first) this._first.prev = null;
      this._last = this._first ? this._last : null;
      return remove.value;
    },
    // Shows us the first item in the list
    first: function first() {
      return this._first && this._first.value;
    },
    // Shows us the last item in the list
    last: function last() {
      return this._last && this._last.value;
    },
    // Removes the item that was returned from the push
    remove: function remove(item) {
      // Relink the previous item
      if (item.prev) item.prev.next = item.next;
      if (item.next) item.next.prev = item.prev;
      if (item === this._last) this._last = item.prev;
      if (item === this._first) this._first = item.next; // Invalidate item

      item.prev = null;
      item.next = null;
    }
  }
});
/* globals fullHex, compToHex */

/*

Color {
  constructor (a, b, c, space) {
    space: 'hsl'
    a: 30
    b: 20
    c: 10
  },

  toRgb () { return new Color in rgb space }
  toHsl () { return new Color in hsl space }
  toLab () { return new Color in lab space }

  toArray () { [space, a, b, c] }
  fromArray () { convert it back }
}

// Conversions aren't always exact because of monitor profiles etc...
new Color(h, s, l, 'hsl') !== new Color(r, g, b).hsl()
new Color(100, 100, 100, [space])
new Color('hsl(30, 20, 10)')

// Sugar
SVG.rgb(30, 20, 50).lab()
SVG.hsl()
SVG.lab('rgb(100, 100, 100)')
*/
// Module for color convertions

SVG.Color = function (color, g, b) {
  var match; // initialize defaults

  this.r = 0;
  this.g = 0;
  this.b = 0;
  if (!color) return; // parse color

  if (typeof color === 'string') {
    if (SVG.regex.isRgb.test(color)) {
      // get rgb values
      match = SVG.regex.rgb.exec(color.replace(SVG.regex.whitespace, '')); // parse numeric values

      this.r = parseInt(match[1]);
      this.g = parseInt(match[2]);
      this.b = parseInt(match[3]);
    } else if (SVG.regex.isHex.test(color)) {
      // get hex values
      match = SVG.regex.hex.exec(fullHex(color)); // parse numeric values

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
};

SVG.extend(SVG.Color, {
  // Default to hex conversion
  toString: function toString() {
    return this.toHex();
  },
  toArray: function toArray() {
    return [this.r, this.g, this.b];
  },
  fromArray: function fromArray(a) {
    return new SVG.Color(a);
  },
  // Build hex value
  toHex: function toHex() {
    return '#' + compToHex(Math.round(this.r)) + compToHex(Math.round(this.g)) + compToHex(Math.round(this.b));
  },
  // Build rgb value
  toRgb: function toRgb() {
    return 'rgb(' + [this.r, this.g, this.b].join() + ')';
  },
  // Calculate true brightness
  brightness: function brightness() {
    return this.r / 255 * 0.30 + this.g / 255 * 0.59 + this.b / 255 * 0.11;
  },
  // Make color morphable
  morph: function morph(color) {
    this.destination = new SVG.Color(color);
    return this;
  },
  // Get morphed color at given position
  at: function at(pos) {
    // make sure a destination is defined
    if (!this.destination) return this; // normalise pos

    pos = pos < 0 ? 0 : pos > 1 ? 1 : pos; // generate morphed color

    return new SVG.Color({
      r: ~~(this.r + (this.destination.r - this.r) * pos),
      g: ~~(this.g + (this.destination.g - this.g) * pos),
      b: ~~(this.b + (this.destination.b - this.b) * pos)
    });
  }
}); // Testers
// Test if given value is a color string

SVG.Color.test = function (color) {
  color += '';
  return SVG.regex.isHex.test(color) || SVG.regex.isRgb.test(color);
}; // Test if given value is a rgb object


SVG.Color.isRgb = function (color) {
  return color && typeof color.r === 'number' && typeof color.g === 'number' && typeof color.b === 'number';
}; // Test if given value is a color


SVG.Color.isColor = function (color) {
  return SVG.Color.isRgb(color) || SVG.Color.test(color);
};
/* global arrayClone */
// Module for array conversion


SVG.Array = function (array, fallback) {
  array = (array || []).valueOf(); // if array is empty and fallback is provided, use fallback

  if (array.length === 0 && fallback) {
    array = fallback.valueOf();
  } // parse array


  this.value = this.parse(array);
};

SVG.extend(SVG.Array, {
  // Make array morphable
  morph: function morph(array) {
    this.destination = this.parse(array); // normalize length of arrays

    if (this.value.length !== this.destination.length) {
      var lastValue = this.value[this.value.length - 1];
      var lastDestination = this.destination[this.destination.length - 1];

      while (this.value.length > this.destination.length) {
        this.destination.push(lastDestination);
      }

      while (this.value.length < this.destination.length) {
        this.value.push(lastValue);
      }
    }

    return this;
  },
  // Clean up any duplicate points
  settle: function settle() {
    // find all unique values
    for (var i = 0, il = this.value.length, seen = []; i < il; i++) {
      if (seen.indexOf(this.value[i]) === -1) {
        seen.push(this.value[i]);
      }
    } // set new value


    this.value = seen;
    return seen;
  },
  // Get morphed array at given position
  at: function at(pos) {
    // make sure a destination is defined
    if (!this.destination) return this; // generate morphed array

    for (var i = 0, il = this.value.length, array = []; i < il; i++) {
      array.push(this.value[i] + (this.destination[i] - this.value[i]) * pos);
    }

    return new SVG.Array(array);
  },
  toArray: function toArray() {
    return this.value;
  },
  // Convert array to string
  toString: function toString() {
    return this.value.join(' ');
  },
  // Real value
  valueOf: function valueOf() {
    return this.value;
  },
  // Parse whitespace separated string
  parse: function parse(array) {
    array = array.valueOf(); // if already is an array, no need to parse it

    if (Array.isArray(array)) return array;
    return array.trim().split(SVG.regex.delimiter).map(parseFloat);
  },
  // Reverse array
  reverse: function reverse() {
    this.value.reverse();
    return this;
  },
  clone: function clone() {
    var clone = new this.constructor();
    clone.value = arrayClone(this.value);
    return clone;
  }
}); // Poly points array

SVG.PointArray = function (array, fallback) {
  SVG.Array.call(this, array, fallback || [[0, 0]]);
}; // Inherit from SVG.Array


SVG.PointArray.prototype = new SVG.Array();
SVG.PointArray.prototype.constructor = SVG.PointArray;
SVG.extend(SVG.PointArray, {
  // Convert array to string
  toString: function toString() {
    // convert to a poly point string
    for (var i = 0, il = this.value.length, array = []; i < il; i++) {
      array.push(this.value[i].join(','));
    }

    return array.join(' ');
  },
  toArray: function toArray() {
    return this.value.reduce(function (prev, curr) {
      return [].concat.call(prev, curr);
    }, []);
  },
  // Convert array to line object
  toLine: function toLine() {
    return {
      x1: this.value[0][0],
      y1: this.value[0][1],
      x2: this.value[1][0],
      y2: this.value[1][1]
    };
  },
  // Get morphed array at given position
  at: function at(pos) {
    // make sure a destination is defined
    if (!this.destination) return this; // generate morphed point string

    for (var i = 0, il = this.value.length, array = []; i < il; i++) {
      array.push([this.value[i][0] + (this.destination[i][0] - this.value[i][0]) * pos, this.value[i][1] + (this.destination[i][1] - this.value[i][1]) * pos]);
    }

    return new SVG.PointArray(array);
  },
  // Parse point string and flat array
  parse: function parse(array) {
    var points = [];
    array = array.valueOf(); // if it is an array

    if (Array.isArray(array)) {
      // and it is not flat, there is no need to parse it
      if (Array.isArray(array[0])) {
        return array;
      }
    } else {
      // Else, it is considered as a string
      // parse points
      array = array.trim().split(SVG.regex.delimiter).map(parseFloat);
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
      for (var i = this.value.length - 1; i >= 0; i--) {
        this.value[i] = [this.value[i][0] + x, this.value[i][1] + y];
      }
    }

    return this;
  },
  // Resize poly string
  size: function size(width, height) {
    var i;
    var box = this.bbox(); // recalculate position of all points according to new size

    for (i = this.value.length - 1; i >= 0; i--) {
      if (box.width) this.value[i][0] = (this.value[i][0] - box.x) * width / box.width + box.x;
      if (box.height) this.value[i][1] = (this.value[i][1] - box.y) * height / box.height + box.y;
    }

    return this;
  },
  // Get bounding box of points
  bbox: function bbox() {
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
    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY
    };
  }
});
/* globals arrayToString, pathRegReplace */

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
} // Path points array


SVG.PathArray = function (array, fallback) {
  SVG.Array.call(this, array, fallback || [['M', 0, 0]]);
}; // Inherit from SVG.Array


SVG.PathArray.prototype = new SVG.Array();
SVG.PathArray.prototype.constructor = SVG.PathArray;
SVG.extend(SVG.PathArray, {
  // Convert array to string
  toString: function toString() {
    return arrayToString(this.value);
  },
  toArray: function toArray() {
    return this.value.reduce(function (prev, curr) {
      return [].concat.call(prev, curr);
    }, []);
  },
  // Move path string
  move: function move(x, y) {
    // get bounding box of current situation
    var box = this.bbox(); // get relative offset

    x -= box.x;
    y -= box.y;

    if (!isNaN(x) && !isNaN(y)) {
      // move every point
      for (var l, i = this.value.length - 1; i >= 0; i--) {
        l = this.value[i][0];

        if (l === 'M' || l === 'L' || l === 'T') {
          this.value[i][1] += x;
          this.value[i][2] += y;
        } else if (l === 'H') {
          this.value[i][1] += x;
        } else if (l === 'V') {
          this.value[i][1] += y;
        } else if (l === 'C' || l === 'S' || l === 'Q') {
          this.value[i][1] += x;
          this.value[i][2] += y;
          this.value[i][3] += x;
          this.value[i][4] += y;

          if (l === 'C') {
            this.value[i][5] += x;
            this.value[i][6] += y;
          }
        } else if (l === 'A') {
          this.value[i][6] += x;
          this.value[i][7] += y;
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

    for (i = this.value.length - 1; i >= 0; i--) {
      l = this.value[i][0];

      if (l === 'M' || l === 'L' || l === 'T') {
        this.value[i][1] = (this.value[i][1] - box.x) * width / box.width + box.x;
        this.value[i][2] = (this.value[i][2] - box.y) * height / box.height + box.y;
      } else if (l === 'H') {
        this.value[i][1] = (this.value[i][1] - box.x) * width / box.width + box.x;
      } else if (l === 'V') {
        this.value[i][1] = (this.value[i][1] - box.y) * height / box.height + box.y;
      } else if (l === 'C' || l === 'S' || l === 'Q') {
        this.value[i][1] = (this.value[i][1] - box.x) * width / box.width + box.x;
        this.value[i][2] = (this.value[i][2] - box.y) * height / box.height + box.y;
        this.value[i][3] = (this.value[i][3] - box.x) * width / box.width + box.x;
        this.value[i][4] = (this.value[i][4] - box.y) * height / box.height + box.y;

        if (l === 'C') {
          this.value[i][5] = (this.value[i][5] - box.x) * width / box.width + box.x;
          this.value[i][6] = (this.value[i][6] - box.y) * height / box.height + box.y;
        }
      } else if (l === 'A') {
        // resize radii
        this.value[i][1] = this.value[i][1] * width / box.width;
        this.value[i][2] = this.value[i][2] * height / box.height; // move position values

        this.value[i][6] = (this.value[i][6] - box.x) * width / box.width + box.x;
        this.value[i][7] = (this.value[i][7] - box.y) * height / box.height + box.y;
      }
    }

    return this;
  },
  // Test if the passed path array use the same path data commands as this path array
  equalCommands: function equalCommands(pathArray) {
    var i, il, equalCommands;
    pathArray = new SVG.PathArray(pathArray);
    equalCommands = this.value.length === pathArray.value.length;

    for (i = 0, il = this.value.length; equalCommands && i < il; i++) {
      equalCommands = this.value[i][0] === pathArray.value[i][0];
    }

    return equalCommands;
  },
  // Make path array morphable
  morph: function morph(pathArray) {
    pathArray = new SVG.PathArray(pathArray);

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
    var sourceArray = this.value;
    var destinationArray = this.destination.value;
    var array = [];
    var pathArray = new SVG.PathArray();
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
  parse: function parse(array) {
    // if it's already a patharray, no need to parse it
    if (array instanceof SVG.PathArray) return array.valueOf(); // prepare for parsing

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
      array = array.replace(SVG.regex.numbersWithDots, pathRegReplace) // convert 45.123.123 to 45.123 .123
      .replace(SVG.regex.pathLetters, ' $& ') // put some room between letters and numbers
      .replace(SVG.regex.hyphen, '$1 -') // add space before hyphen
      .trim() // trim
      .split(SVG.regex.delimiter); // split into array
    } else {
      array = array.reduce(function (prev, curr) {
        return [].concat.call(prev, curr);
      }, []);
    } // array now is an array containing all parts of a path e.g. ['M', '0', '0', 'L', '30', '30' ...]


    var result = [];
    var p = new SVG.Point();
    var p0 = new SVG.Point();
    var index = 0;
    var len = array.length;

    do {
      // Test if we have a path letter
      if (SVG.regex.isPathLetter.test(array[index])) {
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
    SVG.parser().path.setAttribute('d', this.toString());
    return SVG.parser.nodes.path.getBBox();
  }
}); // Module for unit convertions

SVG.Number = SVG.invent({
  // Initialize
  create: function create(value, unit) {
    unit = Array.isArray(value) ? value[1] : unit;
    value = Array.isArray(value) ? value[0] : value; // initialize defaults

    this.value = 0;
    this.unit = unit || ''; // parse value

    if (typeof value === 'number') {
      // ensure a valid numeric value
      this.value = isNaN(value) ? 0 : !isFinite(value) ? value < 0 ? -3.4e+38 : +3.4e+38 : value;
    } else if (typeof value === 'string') {
      unit = value.match(SVG.regex.numberAndUnit);

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
      if (value instanceof SVG.Number) {
        this.value = value.valueOf();
        this.unit = value.unit;
      }
    }
  },
  // Add methods
  extend: {
    // Stringalize
    toString: function toString() {
      return (this.unit === '%' ? ~~(this.value * 1e8) / 1e6 : this.unit === 's' ? this.value / 1e3 : this.value) + this.unit;
    },
    toJSON: function toJSON() {
      return this.toString();
    },
    // Convert to primitive
    toArray: function toArray() {
      return [this.value, this.unit];
    },
    valueOf: function valueOf() {
      return this.value;
    },
    // Add number
    plus: function plus(number) {
      number = new SVG.Number(number);
      return new SVG.Number(this + number, this.unit || number.unit);
    },
    // Subtract number
    minus: function minus(number) {
      number = new SVG.Number(number);
      return new SVG.Number(this - number, this.unit || number.unit);
    },
    // Multiply number
    times: function times(number) {
      number = new SVG.Number(number);
      return new SVG.Number(this * number, this.unit || number.unit);
    },
    // Divide number
    divide: function divide(number) {
      number = new SVG.Number(number);
      return new SVG.Number(this / number, this.unit || number.unit);
    },
    // Make number morphable
    morph: function morph(number) {
      this.destination = new SVG.Number(number);

      if (number.relative) {
        this.destination.value += this.value;
      }

      return this;
    },
    // Get morphed number at given position
    at: function at(pos) {
      // Make sure a destination is defined
      if (!this.destination) return this; // Generate new morphed number

      return new SVG.Number(this.destination).minus(this).times(pos).plus(this);
    }
  }
});
SVG.EventTarget = SVG.invent({
  create: function create() {},
  extend: {
    // Bind given event to listener
    on: function on(event, listener, binding, options) {
      SVG.on(this, event, listener, binding, options);
      return this;
    },
    // Unbind event from listener
    off: function off(event, listener) {
      SVG.off(this, event, listener);
      return this;
    },
    dispatch: function dispatch(event, data) {
      return SVG.dispatch(this, event, data);
    },
    // Fire given event
    fire: function fire(event, data) {
      this.dispatch(event, data);
      return this;
    }
  }
});
/* global createElement */

SVG.HtmlNode = SVG.invent({
  inherit: SVG.EventTarget,
  create: function create(element) {
    this.node = element;
  },
  extend: {
    add: function add(element, i) {
      element = createElement(element);

      if (element.node !== this.node.children[i]) {
        this.node.insertBefore(element.node, this.node.children[i] || null);
      }

      return this;
    },
    put: function put(element, i) {
      this.add(element, i);
      return element;
    },
    getEventTarget: function getEventTarget() {
      return this.node;
    }
  }
});
/* global proportionalSize, assignNewId, createElement, matches, is */

SVG.Element = SVG.invent({
  inherit: SVG.EventTarget,
  // Initialize node
  create: function create(node) {
    // event listener
    this.events = {}; // initialize data object

    this.dom = {}; // create circular reference

    this.node = node;

    if (this.node) {
      this.type = node.nodeName;
      this.node.instance = this;
      this.events = node.events || {};

      if (node.hasAttribute('svgjs:data')) {
        // pull svgjs data from the dom (getAttributeNS doesn't work in html5)
        this.setData(JSON.parse(node.getAttribute('svgjs:data')) || {});
      }
    }
  },
  // Add class methods
  extend: {
    // Move over x-axis
    x: function x(_x) {
      return this.attr('x', _x);
    },
    // Move over y-axis
    y: function y(_y) {
      return this.attr('y', _y);
    },
    // Move by center over x-axis
    cx: function cx(x) {
      return x == null ? this.x() + this.width() / 2 : this.x(x - this.width() / 2);
    },
    // Move by center over y-axis
    cy: function cy(y) {
      return y == null ? this.y() + this.height() / 2 : this.y(y - this.height() / 2);
    },
    // Move element to given x and y values
    move: function move(x, y) {
      return this.x(x).y(y);
    },
    // Move element by its center
    center: function center(x, y) {
      return this.cx(x).cy(y);
    },
    // Set width of element
    width: function width(_width) {
      return this.attr('width', _width);
    },
    // Set height of element
    height: function height(_height) {
      return this.attr('height', _height);
    },
    // Set element size to given width and height
    size: function size(width, height) {
      var p = proportionalSize(this, width, height);
      return this.width(new SVG.Number(p.width)).height(new SVG.Number(p.height));
    },
    // Clone element
    clone: function clone(parent) {
      // write dom data to the dom so the clone can pickup the data
      this.writeDataToDom(); // clone element and assign new id

      var clone = assignNewId(this.node.cloneNode(true)); // insert the clone in the given parent or after myself

      if (parent) parent.add(clone);else this.after(clone);
      return clone;
    },
    // Remove element
    remove: function remove() {
      if (this.parent()) {
        this.parent().removeElement(this);
      }

      return this;
    },
    // Replace element
    replace: function replace(element) {
      this.after(element).remove();
      return element;
    },
    // Add element to given container and return self
    addTo: function addTo(parent) {
      return createElement(parent).put(this);
    },
    // Add element to given container and return container
    putIn: function putIn(parent) {
      return createElement(parent).add(this);
    },
    // Get / set id
    id: function id(_id) {
      // generate new id if no id set
      if (typeof _id === 'undefined' && !this.node.id) {
        this.node.id = SVG.eid(this.type);
      } // dont't set directly width this.node.id to make `null` work correctly


      return this.attr('id', _id);
    },
    // Checks whether the given point inside the bounding box of the element
    inside: function inside(x, y) {
      var box = this.bbox();
      return x > box.x && y > box.y && x < box.x + box.width && y < box.y + box.height;
    },
    // Show element
    show: function show() {
      return this.css('display', '');
    },
    // Hide element
    hide: function hide() {
      return this.css('display', 'none');
    },
    // Is element visible?
    visible: function visible() {
      return this.css('display') !== 'none';
    },
    // Return id on string conversion
    toString: function toString() {
      return this.id();
    },
    // Return array of classes on the node
    classes: function classes() {
      var attr = this.attr('class');
      return attr == null ? [] : attr.trim().split(SVG.regex.delimiter);
    },
    // Return true if class exists on the node, false otherwise
    hasClass: function hasClass(name) {
      return this.classes().indexOf(name) !== -1;
    },
    // Add class to the node
    addClass: function addClass(name) {
      if (!this.hasClass(name)) {
        var array = this.classes();
        array.push(name);
        this.attr('class', array.join(' '));
      }

      return this;
    },
    // Remove class from the node
    removeClass: function removeClass(name) {
      if (this.hasClass(name)) {
        this.attr('class', this.classes().filter(function (c) {
          return c !== name;
        }).join(' '));
      }

      return this;
    },
    // Toggle the presence of a class on the node
    toggleClass: function toggleClass(name) {
      return this.hasClass(name) ? this.removeClass(name) : this.addClass(name);
    },
    // Get referenced element form attribute value
    reference: function reference(attr) {
      return SVG.get(this.attr(attr));
    },
    // Returns the parent element instance
    parent: function parent(type) {
      var parent = this; // check for parent

      if (!parent.node.parentNode) return null; // get parent element

      parent = SVG.adopt(parent.node.parentNode);
      if (!type) return parent; // loop trough ancestors if type is given

      while (parent && parent.node instanceof window.SVGElement) {
        if (typeof type === 'string' ? parent.matches(type) : parent instanceof type) return parent;
        parent = SVG.adopt(parent.node.parentNode);
      }
    },
    // Get parent document
    doc: function doc() {
      var p = this.parent(SVG.Doc);
      return p && p.doc();
    },
    // Get defs
    defs: function defs() {
      return this.doc().defs();
    },
    // return array of all ancestors of given type up to the root svg
    parents: function parents(type) {
      var parents = [];
      var parent = this;

      do {
        parent = parent.parent(type);
        if (!parent || !parent.node) break;
        parents.push(parent);
      } while (parent.parent);

      return parents;
    },
    // matches the element vs a css selector
    matches: function matches(selector) {
      return _matches(this.node, selector);
    },
    // Returns the svg node to call native svg methods on it
    native: function native() {
      return this.node;
    },
    // Import raw svg
    svg: function svg(_svg) {
      var well, len; // act as a setter if svg is given

      if (typeof _svg === 'string' && this instanceof SVG.Parent) {
        // create temporary holder
        well = document.createElementNS(SVG.ns, 'svg'); // dump raw svg

        well.innerHTML = _svg; // transplant nodes

        for (len = well.children.length; len--;) {
          this.node.appendChild(well.firstElementChild);
        } // otherwise act as a getter

      } else {
        // expose node modifiers
        if (typeof _svg === 'function') {
          this.each(function () {
            well = _svg(this);

            if (well instanceof SVG.Element) {
              this.replace(well);
            }

            if (typeof well === 'boolean' && !well) {
              this.remove();
            }
          });
        } // write svgjs data to the dom


        this.writeDataToDom();
        return this.node.outerHTML;
      }

      return this;
    },
    // write svgjs data to the dom
    writeDataToDom: function writeDataToDom() {
      // dump variables recursively
      if (this.is(SVG.Parent)) {
        this.each(function () {
          this.writeDataToDom();
        });
      } // remove previously set data


      this.node.removeAttribute('svgjs:data');

      if (Object.keys(this.dom).length) {
        this.node.setAttribute('svgjs:data', JSON.stringify(this.dom)); // see #428
      }

      return this;
    },
    // set given data to the elements data property
    setData: function setData(o) {
      this.dom = o;
      return this;
    },
    is: function is(obj) {
      return _is(this, obj);
    },
    getEventTarget: function getEventTarget() {
      return this.node;
    }
  }
}) // Add events to elements
;
['click', 'dblclick', 'mousedown', 'mouseup', 'mouseover', 'mouseout', 'mousemove', 'mouseenter', 'mouseleave', 'touchstart', 'touchmove', 'touchleave', 'touchend', 'touchcancel'].forEach(function (event) {
  // add event to SVG.Element
  SVG.Element.prototype[event] = function (f) {
    if (f === null) {
      SVG.off(this, event);
    } else {
      SVG.on(this, event, f);
    }

    return this;
  };
});
SVG.listenerId = 0; // Add event binder in the SVG namespace

SVG.on = function (node, events, listener, binding, options) {
  var l = listener.bind(binding || node);
  var n = node instanceof SVG.EventTarget ? node.getEventTarget() : node; // events can be an array of events or a string of events

  events = Array.isArray(events) ? events : events.split(SVG.regex.delimiter); // ensure instance object for nodes which are not adopted

  n.instance = n.instance || {
    events: {} // pull event handlers from the element

  };
  var bag = n.instance.events; // add id to listener

  if (!listener._svgjsListenerId) {
    listener._svgjsListenerId = ++SVG.listenerId;
  }

  events.forEach(function (event) {
    var ev = event.split('.')[0];
    var ns = event.split('.')[1] || '*'; // ensure valid object

    bag[ev] = bag[ev] || {};
    bag[ev][ns] = bag[ev][ns] || {}; // reference listener

    bag[ev][ns][listener._svgjsListenerId] = l; // add listener

    n.addEventListener(ev, l, options || false);
  });
}; // Add event unbinder in the SVG namespace


SVG.off = function (node, events, listener, options) {
  var n = node instanceof SVG.EventTarget ? node.getEventTarget() : node;
  if (!n.instance) return; // listener can be a function or a number

  if (typeof listener === 'function') {
    listener = listener._svgjsListenerId;
    if (!listener) return;
  } // pull event handlers from the element


  var bag = n.instance.events; // events can be an array of events or a string or undefined

  events = Array.isArray(events) ? events : (events || '').split(SVG.regex.delimiter);
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
          SVG.off(n, [ev, ns].join('.'), l);
        }

        delete bag[ev][ns];
      }
    } else if (ns) {
      // remove all listeners for a specific namespace
      for (event in bag) {
        for (namespace in bag[event]) {
          if (ns === namespace) {
            SVG.off(n, [event, ns].join('.'));
          }
        }
      }
    } else if (ev) {
      // remove all listeners for the event
      if (bag[ev]) {
        for (namespace in bag[ev]) {
          SVG.off(n, [ev, namespace].join('.'));
        }

        delete bag[ev];
      }
    } else {
      // remove all listeners on a given node
      for (event in bag) {
        SVG.off(n, event);
      }

      n.instance.events = {};
    }
  });
};

SVG.dispatch = function (node, event, data) {
  var n = node instanceof SVG.EventTarget ? node.getEventTarget() : node; // Dispatch event

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
};
/* global abcdef arrayToMatrix closeEnough formatTransforms isMatrixLike matrixMultiply */


SVG.Matrix = SVG.invent({
  // Initialize
  create: function create(source) {
    var base = arrayToMatrix([1, 0, 0, 1, 0, 0]); // ensure source as object

    source = source instanceof SVG.Element ? source.matrixify() : typeof source === 'string' ? arrayToMatrix(source.split(SVG.regex.delimiter).map(parseFloat)) : Array.isArray(source) ? arrayToMatrix(source) : _typeof(source) === 'object' && isMatrixLike(source) ? source : _typeof(source) === 'object' ? new SVG.Matrix().transform(source) : arguments.length === 6 ? arrayToMatrix([].slice.call(arguments)) : base; // Merge the source matrix with the base matrix

    this.a = source.a != null ? source.a : base.a;
    this.b = source.b != null ? source.b : base.b;
    this.c = source.c != null ? source.c : base.c;
    this.d = source.d != null ? source.d : base.d;
    this.e = source.e != null ? source.e : base.e;
    this.f = source.f != null ? source.f : base.f;
  },
  // Add methods
  extend: {
    // Clones this matrix
    clone: function clone() {
      return new SVG.Matrix(this);
    },
    // Transform a matrix into another matrix by manipulating the space
    transform: function transform(o) {
      // Check if o is a matrix and then left multiply it directly
      if (isMatrixLike(o)) {
        var matrix = new SVG.Matrix(o);
        return matrix.multiplyO(this);
      } // Get the proposed transformations and the current transformations


      var t = formatTransforms(o);
      var current = this;

      var _transform = new SVG.Point(t.ox, t.oy).transform(current),
          ox = _transform.x,
          oy = _transform.y; // Construct the resulting matrix


      var transformer = new SVG.Matrix().translateO(t.rx, t.ry).lmultiplyO(current).translateO(-ox, -oy).scaleO(t.scaleX, t.scaleY).skewO(t.skewX, t.skewY).shearO(t.shear).rotateO(t.theta).translateO(ox, oy); // If we want the origin at a particular place, we force it there

      if (isFinite(t.px) || isFinite(t.py)) {
        var origin = new SVG.Point(ox, oy).transform(transformer); // TODO: Replace t.px with isFinite(t.px)

        var dx = t.px ? t.px - origin.x : 0;
        var dy = t.py ? t.py - origin.y : 0;
        transformer.translateO(dx, dy);
      } // Translate now after positioning


      transformer.translateO(t.tx, t.ty);
      return transformer;
    },
    // Applies a matrix defined by its affine parameters
    compose: function compose(o) {
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

      var result = new SVG.Matrix().translateO(-ox, -oy).scaleO(sx, sy).shearO(lam).rotateO(theta).translateO(tx, ty).lmultiplyO(this).translateO(ox, oy);
      return result;
    },
    // Decomposes this matrix into its affine parameters
    decompose: function decompose() {
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
    },
    // Morph one matrix into another
    morph: function morph(matrix) {
      // Store new destination
      this.destination = new SVG.Matrix(matrix);
      return this;
    },
    // Get morphed matrix at a given position
    at: function at(pos) {
      // Make sure a destination is defined
      if (!this.destination) return this; // Calculate morphed matrix at a given position

      var matrix = new SVG.Matrix({
        a: this.a + (this.destination.a - this.a) * pos,
        b: this.b + (this.destination.b - this.b) * pos,
        c: this.c + (this.destination.c - this.c) * pos,
        d: this.d + (this.destination.d - this.d) * pos,
        e: this.e + (this.destination.e - this.e) * pos,
        f: this.f + (this.destination.f - this.f) * pos
      });
      return matrix;
    },
    // Left multiplies by the given matrix
    multiply: function multiply(matrix) {
      return this.clone().multiplyO(matrix);
    },
    multiplyO: function multiplyO(matrix) {
      // Get the matrices
      var l = this;
      var r = matrix instanceof SVG.Matrix ? matrix : new SVG.Matrix(matrix);
      return matrixMultiply(l, r, this);
    },
    lmultiply: function lmultiply(matrix) {
      return this.clone().lmultiplyO(matrix);
    },
    lmultiplyO: function lmultiplyO(matrix) {
      var r = this;
      var l = matrix instanceof SVG.Matrix ? matrix : new SVG.Matrix(matrix);
      return matrixMultiply(l, r, this);
    },
    // Inverses matrix
    inverseO: function inverseO() {
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
    },
    inverse: function inverse() {
      return this.clone().inverseO();
    },
    // Translate matrix
    translate: function translate(x, y) {
      return this.clone().translateO(x, y);
    },
    translateO: function translateO(x, y) {
      this.e += x || 0;
      this.f += y || 0;
      return this;
    },
    // Scale matrix
    scale: function scale(x, y, cx, cy) {
      var _this$clone;

      return (_this$clone = this.clone()).scaleO.apply(_this$clone, arguments);
    },
    scaleO: function scaleO(x) {
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
    },
    // Rotate matrix
    rotate: function rotate(r, cx, cy) {
      return this.clone().rotateO(r, cx, cy);
    },
    rotateO: function rotateO(r) {
      var cx = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var cy = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      // Convert degrees to radians
      r = SVG.utils.radians(r);
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
    },
    // Flip matrix on x or y, at a given offset
    flip: function flip(axis, around) {
      return this.clone().flipO(axis, around);
    },
    flipO: function flipO(axis, around) {
      return axis === 'x' ? this.scaleO(-1, 1, around, 0) : axis === 'y' ? this.scaleO(1, -1, 0, around) : this.scaleO(-1, -1, axis, around || axis); // Define an x, y flip point
    },
    // Shear matrix
    shear: function shear(a, cx, cy) {
      return this.clone().shearO(a, cx, cy);
    },
    shearO: function shearO(lx) {
      var cx = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
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
    },
    // Skew Matrix
    skew: function skew(x, y, cx, cy) {
      var _this$clone2;

      return (_this$clone2 = this.clone()).skewO.apply(_this$clone2, arguments);
    },
    skewO: function skewO(x) {
      var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : x;
      var cx = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      var cy = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

      // support uniformal skew
      if (arguments.length === 3) {
        cy = cx;
        cx = y;
        y = x;
      } // Convert degrees to radians


      x = SVG.utils.radians(x);
      y = SVG.utils.radians(y);
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
    },
    // SkewX
    skewX: function skewX(x, cx, cy) {
      return this.skew(x, 0, cx, cy);
    },
    skewXO: function skewXO(x, cx, cy) {
      return this.skewO(x, 0, cx, cy);
    },
    // SkewY
    skewY: function skewY(y, cx, cy) {
      return this.skew(0, y, cx, cy);
    },
    skewYO: function skewYO(y, cx, cy) {
      return this.skewO(0, y, cx, cy);
    },
    // Transform around a center point
    aroundO: function aroundO(cx, cy, matrix) {
      var dx = cx || 0;
      var dy = cy || 0;
      return this.translateO(-dx, -dy).lmultiplyO(matrix).translateO(dx, dy);
    },
    around: function around(cx, cy, matrix) {
      return this.clone().aroundO(cx, cy, matrix);
    },
    // Convert to native SVGMatrix
    native: function native() {
      // create new matrix
      var matrix = SVG.parser.nodes.svg.node.createSVGMatrix(); // update with current values

      for (var i = abcdef.length - 1; i >= 0; i--) {
        matrix[abcdef[i]] = this[abcdef[i]];
      }

      return matrix;
    },
    // Check if two matrices are equal
    equals: function equals(other) {
      var comp = new SVG.Matrix(other);
      return closeEnough(this.a, comp.a) && closeEnough(this.b, comp.b) && closeEnough(this.c, comp.c) && closeEnough(this.d, comp.d) && closeEnough(this.e, comp.e) && closeEnough(this.f, comp.f);
    },
    // Convert matrix to string
    toString: function toString() {
      return 'matrix(' + this.a + ',' + this.b + ',' + this.c + ',' + this.d + ',' + this.e + ',' + this.f + ')';
    },
    toArray: function toArray() {
      return [this.a, this.b, this.c, this.d, this.e, this.f];
    },
    valueOf: function valueOf() {
      return {
        a: this.a,
        b: this.b,
        c: this.c,
        d: this.d,
        e: this.e,
        f: this.f
      };
    }
  },
  // Define parent
  parent: SVG.Element,
  // Add parent method
  construct: {
    // Get current matrix
    ctm: function ctm() {
      return new SVG.Matrix(this.node.getCTM());
    },
    // Get current screen matrix
    screenCTM: function screenCTM() {
      /* https://bugzilla.mozilla.org/show_bug.cgi?id=1344537
         This is needed because FF does not return the transformation matrix
         for the inner coordinate system when getScreenCTM() is called on nested svgs.
         However all other Browsers do that */
      if (this instanceof SVG.Doc && !this.isRoot()) {
        var rect = this.rect(1, 1);
        var m = rect.node.getScreenCTM();
        rect.remove();
        return new SVG.Matrix(m);
      }

      return new SVG.Matrix(this.node.getScreenCTM());
    }
  }
}); // let extensions = {}
// ['rotate'].forEach((method) => {
//   let methodO = method + 'O'
//   extensions[method] = function (...args) {
//     return new SVG.Matrix(this)[methodO](...args)
//   }
// })
//
// SVG.extend(SVG.Matrix, extensions)
// function matrixMultiplyParams (matrix, a, b, c, d, e, f) {
//   return matrixMultiply({a, b, c, d, e, f}, matrix, matrix)
// }

SVG.Point = SVG.invent({
  // Initialize
  create: function create(x, y, base) {
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
  },
  // Add methods
  extend: {
    // Clone point
    clone: function clone() {
      return new SVG.Point(this);
    },
    // Morph one point into another
    morph: function morph(x, y) {
      // store new destination
      this.destination = new SVG.Point(x, y);
      return this;
    },
    // Get morphed point at a given position
    at: function at(pos) {
      // make sure a destination is defined
      if (!this.destination) return this; // calculate morphed matrix at a given position

      var point = new SVG.Point({
        x: this.x + (this.destination.x - this.x) * pos,
        y: this.y + (this.destination.y - this.y) * pos
      });
      return point;
    },
    // Convert to native SVGPoint
    native: function native() {
      // create new point
      var point = SVG.parser.nodes.svg.node.createSVGPoint(); // update with current values

      point.x = this.x;
      point.y = this.y;
      return point;
    },
    // transform point with matrix
    transform: function transform(m) {
      // Perform the matrix multiplication
      var x = m.a * this.x + m.c * this.y + m.e;
      var y = m.b * this.x + m.d * this.y + m.f; // Return the required point

      return new SVG.Point(x, y);
    }
  }
});
SVG.extend(SVG.Element, {
  // Get point
  point: function point(x, y) {
    return new SVG.Point(x, y).transform(this.screenCTM().inverse());
  }
});
SVG.extend(SVG.Element, {
  // Set svg element attribute
  attr: function attr(a, v, n) {
    // act as full getter
    if (a == null) {
      // get an object of attributes
      a = {};
      v = this.node.attributes;

      for (n = v.length - 1; n >= 0; n--) {
        a[v[n].nodeName] = SVG.regex.isNumber.test(v[n].nodeValue) ? parseFloat(v[n].nodeValue) : v[n].nodeValue;
      }

      return a;
    } else if (_typeof(a) === 'object') {
      // apply every attribute individually if an object is passed
      for (v in a) {
        this.attr(v, a[v]);
      }
    } else if (v === null) {
      // remove value
      this.node.removeAttribute(a);
    } else if (v == null) {
      // act as a getter if the first and only argument is not an object
      v = this.node.getAttribute(a);
      return v == null ? SVG.defaults.attrs[a] : SVG.regex.isNumber.test(v) ? parseFloat(v) : v;
    } else {
      // convert image fill and stroke to patterns
      if (a === 'fill' || a === 'stroke') {
        if (SVG.regex.isImage.test(v)) {
          v = this.doc().defs().image(v);
        }

        if (v instanceof SVG.Image) {
          v = this.doc().defs().pattern(0, 0, function () {
            this.add(v);
          });
        }
      } // ensure correct numeric values (also accepts NaN and Infinity)


      if (typeof v === 'number') {
        v = new SVG.Number(v);
      } else if (SVG.Color.isColor(v)) {
        // ensure full hex color
        v = new SVG.Color(v);
      } else if (Array.isArray(v)) {
        // parse array values
        v = new SVG.Array(v);
      } // if the passed attribute is leading...


      if (a === 'leading') {
        // ... call the leading method instead
        if (this.leading) {
          this.leading(v);
        }
      } else {
        // set given attribute on node
        typeof n === 'string' ? this.node.setAttributeNS(n, a, v.toString()) : this.node.setAttribute(a, v.toString());
      } // rebuild if required


      if (this.rebuild && (a === 'font-size' || a === 'x')) {
        this.rebuild(a, v);
      }
    }

    return this;
  }
});
/* global arrayToMatrix getOrigin isMatrixLike */

SVG.extend(SVG.Element, {
  // Reset all transformations
  untransform: function untransform() {
    return this.attr('transform', null);
  },
  // merge the whole transformation chain into one matrix and returns it
  matrixify: function matrixify() {
    var matrix = (this.attr('transform') || ''). // split transformations
    split(SVG.regex.transforms).slice(0, -1).map(function (str) {
      // generate key => value pairs
      var kv = str.trim().split('(');
      return [kv[0], kv[1].split(SVG.regex.delimiter).map(function (str) {
        return parseFloat(str);
      })];
    }).reverse() // merge every transformation into one matrix
    .reduce(function (matrix, transform) {
      if (transform[0] === 'matrix') {
        return matrix.lmultiply(arrayToMatrix(transform[1]));
      }

      return matrix[transform[0]].apply(matrix, transform[1]);
    }, new SVG.Matrix());
    return matrix;
  },
  // add an element to another parent without changing the visual representation on the screen
  toParent: function toParent(parent) {
    if (this === parent) return this;
    var ctm = this.screenCTM();
    var pCtm = parent.screenCTM().inverse();
    this.addTo(parent).untransform().transform(pCtm.multiply(ctm));
    return this;
  },
  // same as above with parent equals root-svg
  toDoc: function toDoc() {
    return this.toParent(this.doc());
  }
});
SVG.extend(SVG.Element, {
  // Add transformations
  transform: function transform(o, relative) {
    // Act as a getter if no object was passed
    if (o == null || typeof o === 'string') {
      var decomposed = new SVG.Matrix(this).decompose();
      return decomposed[o] || decomposed;
    }

    if (!isMatrixLike(o)) {
      // Set the origin according to the defined transform
      o = _objectSpread({}, o, {
        origin: getOrigin(o, this)
      });
    } // The user can pass a boolean, an SVG.Element or an SVG.Matrix or nothing


    var cleanRelative = relative === true ? this : relative || false;
    var result = new SVG.Matrix(cleanRelative).transform(o);
    return this.attr('transform', result);
  }
});
/* global camelCase */

SVG.extend(SVG.Element, {
  // Dynamic style generator
  css: function css(s, v) {
    var ret = {};
    var t, i;

    if (arguments.length === 0) {
      // get full style as object
      this.node.style.cssText.split(/\s*;\s*/).filter(function (el) {
        return !!el.length;
      }).forEach(function (el) {
        t = el.split(/\s*:\s*/);
        ret[t[0]] = t[1];
      });
      return ret;
    }

    if (arguments.length < 2) {
      // get style properties in the array
      if (Array.isArray(s)) {
        for (i = s.length; i--;) {
          ret[camelCase(s[i])] = this.node.style[camelCase(s[i])];
        }

        return ret;
      } // get style for property


      if (typeof s === 'string') {
        return this.node.style[camelCase(s)];
      } // set styles in object


      if (_typeof(s) === 'object') {
        for (i in s) {
          // set empty string if null/undefined/'' was given
          this.node.style[camelCase(i)] = s[i] == null || SVG.regex.isBlank.test(s[i]) ? '' : s[i];
        }
      }
    } // set style for property


    if (arguments.length === 2) {
      this.node.style[camelCase(s)] = v == null || SVG.regex.isBlank.test(v) ? '' : v;
    }

    return this;
  }
});
/* global createElement */

SVG.Parent = SVG.invent({
  // Initialize node
  create: function create(node) {
    SVG.Element.call(this, node);
  },
  // Inherit from
  inherit: SVG.Element,
  // Add class methods
  extend: {
    // Returns all child elements
    children: function children() {
      return SVG.utils.map(this.node.children, function (node) {
        return SVG.adopt(node);
      });
    },
    // Add given element at a position
    add: function add(element, i) {
      element = createElement(element);

      if (element.node !== this.node.children[i]) {
        this.node.insertBefore(element.node, this.node.children[i] || null);
      }

      return this;
    },
    // Basically does the same as `add()` but returns the added element instead
    put: function put(element, i) {
      this.add(element, i);
      return element.instance || element;
    },
    // Checks if the given element is a child
    has: function has(element) {
      return this.index(element) >= 0;
    },
    // Gets index of given element
    index: function index(element) {
      return [].slice.call(this.node.children).indexOf(element.node);
    },
    // Get a element at the given index
    get: function get(i) {
      return SVG.adopt(this.node.children[i]);
    },
    // Get first child
    first: function first() {
      return this.get(0);
    },
    // Get the last child
    last: function last() {
      return this.get(this.node.children.length - 1);
    },
    // Iterates over all children and invokes a given block
    each: function each(block, deep) {
      var children = this.children();
      var i, il;

      for (i = 0, il = children.length; i < il; i++) {
        if (children[i] instanceof SVG.Element) {
          block.apply(children[i], [i, children]);
        }

        if (deep && children[i] instanceof SVG.Parent) {
          children[i].each(block, deep);
        }
      }

      return this;
    },
    // Remove a given child
    removeElement: function removeElement(element) {
      this.node.removeChild(element.node);
      return this;
    },
    // Remove all elements in this container
    clear: function clear() {
      // remove children
      while (this.node.hasChildNodes()) {
        this.node.removeChild(this.node.lastChild);
      } // remove defs reference


      delete this._defs;
      return this;
    }
  }
});
SVG.extend(SVG.Parent, {
  flatten: function flatten(parent) {
    // flattens is only possible for nested svgs and groups
    if (!(this instanceof SVG.G || this instanceof SVG.Doc)) {
      return this;
    }

    parent = parent || (this instanceof SVG.Doc && this.isRoot() ? this : this.parent(SVG.Parent));
    this.each(function () {
      if (this instanceof SVG.Defs) return this;
      if (this instanceof SVG.Parent) return this.flatten(parent);
      return this.toParent(parent);
    }); // we need this so that SVG.Doc does not get removed

    this.node.firstElementChild || this.remove();
    return this;
  },
  ungroup: function ungroup(parent) {
    // ungroup is only possible for nested svgs and groups
    if (!(this instanceof SVG.G || this instanceof SVG.Doc && !this.isRoot())) {
      return this;
    }

    parent = parent || this.parent(SVG.Parent);
    this.each(function () {
      return this.toParent(parent);
    }); // we need this so that SVG.Doc does not get removed

    this.remove();
    return this;
  }
});
SVG.Container = SVG.invent({
  // Initialize node
  create: function create(node) {
    SVG.Element.call(this, node);
  },
  // Inherit from
  inherit: SVG.Parent
});
SVG.Defs = SVG.invent({
  // Initialize node
  create: 'defs',
  // Inherit from
  inherit: SVG.Container
});
SVG.G = SVG.invent({
  // Initialize node
  create: 'g',
  // Inherit from
  inherit: SVG.Container,
  // Add class methods
  extend: {},
  // Add parent method
  construct: {
    // Create a group element
    group: function group() {
      return this.put(new SVG.G());
    }
  }
}); // ### This module adds backward / forward functionality to elements.
//

SVG.extend(SVG.Element, {
  // Get all siblings, including myself
  siblings: function siblings() {
    return this.parent().children();
  },
  // Get the curent position siblings
  position: function position() {
    return this.parent().index(this);
  },
  // Get the next element (will return null if there is none)
  next: function next() {
    return this.siblings()[this.position() + 1];
  },
  // Get the next element (will return null if there is none)
  prev: function prev() {
    return this.siblings()[this.position() - 1];
  },
  // Send given element one step forward
  forward: function forward() {
    var i = this.position() + 1;
    var p = this.parent(); // move node one step forward

    p.removeElement(this).add(this, i); // make sure defs node is always at the top

    if (p instanceof SVG.Doc) {
      p.node.appendChild(p.defs().node);
    }

    return this;
  },
  // Send given element one step backward
  backward: function backward() {
    var i = this.position();

    if (i > 0) {
      this.parent().removeElement(this).add(this, i - 1);
    }

    return this;
  },
  // Send given element all the way to the front
  front: function front() {
    var p = this.parent(); // Move node forward

    p.node.appendChild(this.node); // Make sure defs node is always at the top

    if (p instanceof SVG.Doc) {
      p.node.appendChild(p.defs().node);
    }

    return this;
  },
  // Send given element all the way to the back
  back: function back() {
    if (this.position() > 0) {
      this.parent().removeElement(this).add(this, 0);
    }

    return this;
  },
  // Inserts a given element before the targeted element
  before: function before(element) {
    element.remove();
    var i = this.position();
    this.parent().add(element, i);
    return this;
  },
  // Insters a given element after the targeted element
  after: function after(element) {
    element.remove();
    var i = this.position();
    this.parent().add(element, i + 1);
    return this;
  }
});
SVG.Mask = SVG.invent({
  // Initialize node
  create: 'mask',
  // Inherit from
  inherit: SVG.Container,
  // Add class methods
  extend: {
    // Unmask all masked elements and remove itself
    remove: function remove() {
      // unmask all targets
      this.targets().forEach(function (el) {
        el.unmask();
      }); // remove mask from parent

      return SVG.Element.prototype.remove.call(this);
    },
    targets: function targets() {
      return SVG.select('svg [mask*="' + this.id() + '"]');
    }
  },
  // Add parent method
  construct: {
    // Create masking element
    mask: function mask() {
      return this.defs().put(new SVG.Mask());
    }
  }
});
SVG.extend(SVG.Element, {
  // Distribute mask to svg element
  maskWith: function maskWith(element) {
    // use given mask or create a new one
    var masker = element instanceof SVG.Mask ? element : this.parent().mask().add(element); // apply mask

    return this.attr('mask', 'url("#' + masker.id() + '")');
  },
  // Unmask element
  unmask: function unmask() {
    return this.attr('mask', null);
  },
  masker: function masker() {
    return this.reference('mask');
  }
});
SVG.ClipPath = SVG.invent({
  // Initialize node
  create: 'clipPath',
  // Inherit from
  inherit: SVG.Container,
  // Add class methods
  extend: {
    // Unclip all clipped elements and remove itself
    remove: function remove() {
      // unclip all targets
      this.targets().forEach(function (el) {
        el.unclip();
      }); // remove clipPath from parent

      return SVG.Element.prototype.remove.call(this);
    },
    targets: function targets() {
      return SVG.select('svg [clip-path*="' + this.id() + '"]');
    }
  },
  // Add parent method
  construct: {
    // Create clipping element
    clip: function clip() {
      return this.defs().put(new SVG.ClipPath());
    }
  }
}); //

SVG.extend(SVG.Element, {
  // Distribute clipPath to svg element
  clipWith: function clipWith(element) {
    // use given clip or create a new one
    var clipper = element instanceof SVG.ClipPath ? element : this.parent().clip().add(element); // apply mask

    return this.attr('clip-path', 'url("#' + clipper.id() + '")');
  },
  // Unclip element
  unclip: function unclip() {
    return this.attr('clip-path', null);
  },
  clipper: function clipper() {
    return this.reference('clip-path');
  }
});
SVG.Gradient = SVG.invent({
  // Initialize node
  create: function create(type) {
    SVG.Element.call(this, _typeof(type) === 'object' ? type : SVG.create(type + 'Gradient'));
  },
  // Inherit from
  inherit: SVG.Container,
  // Add class methods
  extend: {
    // Add a color stop
    stop: function stop(offset, color, opacity) {
      return this.put(new SVG.Stop()).update(offset, color, opacity);
    },
    // Update gradient
    update: function update(block) {
      // remove all stops
      this.clear(); // invoke passed block

      if (typeof block === 'function') {
        block.call(this, this);
      }

      return this;
    },
    // Return the fill id
    url: function url() {
      return 'url(#' + this.id() + ')';
    },
    // Alias string convertion to fill
    toString: function toString() {
      return this.url();
    },
    // custom attr to handle transform
    attr: function attr(a, b, c) {
      if (a === 'transform') a = 'gradientTransform';
      return SVG.Container.prototype.attr.call(this, a, b, c);
    }
  },
  // Add parent method
  construct: {
    // Create gradient element in defs
    gradient: function gradient(type, block) {
      return this.defs().gradient(type, block);
    }
  }
}); // Add animatable methods to both gradient and fx module

SVG.extend([SVG.Gradient, SVG.Timeline], {
  // From position
  from: function from(x, y) {
    return (this._target || this).type === 'radialGradient' ? this.attr({
      fx: new SVG.Number(x),
      fy: new SVG.Number(y)
    }) : this.attr({
      x1: new SVG.Number(x),
      y1: new SVG.Number(y)
    });
  },
  // To position
  to: function to(x, y) {
    return (this._target || this).type === 'radialGradient' ? this.attr({
      cx: new SVG.Number(x),
      cy: new SVG.Number(y)
    }) : this.attr({
      x2: new SVG.Number(x),
      y2: new SVG.Number(y)
    });
  }
}); // Base gradient generation

SVG.extend(SVG.Defs, {
  // define gradient
  gradient: function gradient(type, block) {
    return this.put(new SVG.Gradient(type)).update(block);
  }
});
SVG.Stop = SVG.invent({
  // Initialize node
  create: 'stop',
  // Inherit from
  inherit: SVG.Element,
  // Add class methods
  extend: {
    // add color stops
    update: function update(o) {
      if (typeof o === 'number' || o instanceof SVG.Number) {
        o = {
          offset: arguments[0],
          color: arguments[1],
          opacity: arguments[2]
        };
      } // set attributes


      if (o.opacity != null) this.attr('stop-opacity', o.opacity);
      if (o.color != null) this.attr('stop-color', o.color);
      if (o.offset != null) this.attr('offset', new SVG.Number(o.offset));
      return this;
    }
  }
});
SVG.Pattern = SVG.invent({
  // Initialize node
  create: 'pattern',
  // Inherit from
  inherit: SVG.Container,
  // Add class methods
  extend: {
    // Return the fill id
    url: function url() {
      return 'url(#' + this.id() + ')';
    },
    // Update pattern by rebuilding
    update: function update(block) {
      // remove content
      this.clear(); // invoke passed block

      if (typeof block === 'function') {
        block.call(this, this);
      }

      return this;
    },
    // Alias string convertion to fill
    toString: function toString() {
      return this.url();
    },
    // custom attr to handle transform
    attr: function attr(a, b, c) {
      if (a === 'transform') a = 'patternTransform';
      return SVG.Container.prototype.attr.call(this, a, b, c);
    }
  },
  // Add parent method
  construct: {
    // Create pattern element in defs
    pattern: function pattern(width, height, block) {
      return this.defs().pattern(width, height, block);
    }
  }
});
SVG.extend(SVG.Defs, {
  // Define gradient
  pattern: function pattern(width, height, block) {
    return this.put(new SVG.Pattern()).update(block).attr({
      x: 0,
      y: 0,
      width: width,
      height: height,
      patternUnits: 'userSpaceOnUse'
    });
  }
});
SVG.Doc = SVG.invent({
  // Initialize node
  create: function create(node) {
    SVG.Element.call(this, node || SVG.create('svg')); // set svg element attributes and ensure defs node

    this.namespace();
  },
  // Inherit from
  inherit: SVG.Container,
  // Add class methods
  extend: {
    isRoot: function isRoot() {
      return !this.node.parentNode || !(this.node.parentNode instanceof window.SVGElement) || this.node.parentNode.nodeName === '#document';
    },
    // Check if this is a root svg. If not, call docs from this element
    doc: function doc() {
      if (this.isRoot()) return this;
      return SVG.Element.prototype.doc.call(this);
    },
    // Add namespaces
    namespace: function namespace() {
      if (!this.isRoot()) return this.doc().namespace();
      return this.attr({
        xmlns: SVG.ns,
        version: '1.1'
      }).attr('xmlns:xlink', SVG.xlink, SVG.xmlns).attr('xmlns:svgjs', SVG.svgjs, SVG.xmlns);
    },
    // Creates and returns defs element
    defs: function defs() {
      if (!this.isRoot()) return this.doc().defs();
      return SVG.adopt(this.node.getElementsByTagName('defs')[0]) || this.put(new SVG.Defs());
    },
    // custom parent method
    parent: function parent(type) {
      if (this.isRoot()) {
        return this.node.parentNode.nodeName === '#document' ? null : this.node.parentNode;
      }

      return SVG.Element.prototype.parent.call(this, type);
    },
    // Removes the doc from the DOM
    remove: function remove() {
      if (!this.isRoot()) {
        return SVG.Element.prototype.remove.call(this);
      }

      if (this.parent()) {
        this.parent().removeChild(this.node);
      }

      return this;
    },
    clear: function clear() {
      // remove children
      while (this.node.hasChildNodes()) {
        this.node.removeChild(this.node.lastChild);
      }

      return this;
    }
  },
  construct: {
    // Create nested svg document
    nested: function nested() {
      return this.put(new SVG.Doc());
    }
  }
});
SVG.Shape = SVG.invent({
  // Initialize node
  create: function create(node) {
    SVG.Element.call(this, node);
  },
  // Inherit from
  inherit: SVG.Element
});
SVG.Bare = SVG.invent({
  // Initialize
  create: function create(element, inherit) {
    // construct element
    SVG.Element.call(this, SVG.create(element)); // inherit custom methods

    if (inherit) {
      for (var method in inherit.prototype) {
        if (typeof inherit.prototype[method] === 'function') {
          this[method] = inherit.prototype[method];
        }
      }
    }
  },
  // Inherit from
  inherit: SVG.Element,
  // Add methods
  extend: {
    // Insert some plain text
    words: function words(text) {
      // remove contents
      while (this.node.hasChildNodes()) {
        this.node.removeChild(this.node.lastChild);
      } // create text node


      this.node.appendChild(document.createTextNode(text));
      return this;
    }
  }
});
SVG.extend(SVG.Parent, {
  // Create an element that is not described by SVG.js
  element: function element(_element, inherit) {
    return this.put(new SVG.Bare(_element, inherit));
  }
});
SVG.Symbol = SVG.invent({
  // Initialize node
  create: 'symbol',
  // Inherit from
  inherit: SVG.Container,
  construct: {
    // create symbol
    symbol: function symbol() {
      return this.put(new SVG.Symbol());
    }
  }
});
SVG.Use = SVG.invent({
  // Initialize node
  create: 'use',
  // Inherit from
  inherit: SVG.Shape,
  // Add class methods
  extend: {
    // Use element as a reference
    element: function element(_element2, file) {
      // Set lined element
      return this.attr('href', (file || '') + '#' + _element2, SVG.xlink);
    }
  },
  // Add parent method
  construct: {
    // Create a use element
    use: function use(element, file) {
      return this.put(new SVG.Use()).element(element, file);
    }
  }
});
SVG.Rect = SVG.invent({
  // Initialize node
  create: 'rect',
  // Inherit from
  inherit: SVG.Shape,
  // Add parent method
  construct: {
    // Create a rect element
    rect: function rect(width, height) {
      return this.put(new SVG.Rect()).size(width, height);
    }
  }
});
/* global proportionalSize */

SVG.Circle = SVG.invent({
  // Initialize node
  create: 'circle',
  // Inherit from
  inherit: SVG.Shape,
  // Add parent method
  construct: {
    // Create circle element, based on ellipse
    circle: function circle(size) {
      return this.put(new SVG.Circle()).rx(new SVG.Number(size).divide(2)).move(0, 0);
    }
  }
});
SVG.extend([SVG.Circle, SVG.Timeline], {
  // Radius x value
  rx: function rx(_rx) {
    return this.attr('r', _rx);
  },
  // Alias radius x value
  ry: function ry(_ry) {
    return this.rx(_ry);
  }
});
SVG.Ellipse = SVG.invent({
  // Initialize node
  create: 'ellipse',
  // Inherit from
  inherit: SVG.Shape,
  // Add parent method
  construct: {
    // Create an ellipse
    ellipse: function ellipse(width, height) {
      return this.put(new SVG.Ellipse()).size(width, height).move(0, 0);
    }
  }
});
SVG.extend([SVG.Ellipse, SVG.Rect, SVG.Timeline], {
  // Radius x value
  rx: function rx(_rx2) {
    return this.attr('rx', _rx2);
  },
  // Radius y value
  ry: function ry(_ry2) {
    return this.attr('ry', _ry2);
  }
}); // Add common method

SVG.extend([SVG.Circle, SVG.Ellipse], {
  // Move over x-axis
  x: function x(_x2) {
    return _x2 == null ? this.cx() - this.rx() : this.cx(_x2 + this.rx());
  },
  // Move over y-axis
  y: function y(_y2) {
    return _y2 == null ? this.cy() - this.ry() : this.cy(_y2 + this.ry());
  },
  // Move by center over x-axis
  cx: function cx(x) {
    return x == null ? this.attr('cx') : this.attr('cx', x);
  },
  // Move by center over y-axis
  cy: function cy(y) {
    return y == null ? this.attr('cy') : this.attr('cy', y);
  },
  // Set width of element
  width: function width(_width2) {
    return _width2 == null ? this.rx() * 2 : this.rx(new SVG.Number(_width2).divide(2));
  },
  // Set height of element
  height: function height(_height2) {
    return _height2 == null ? this.ry() * 2 : this.ry(new SVG.Number(_height2).divide(2));
  },
  // Custom size function
  size: function size(width, height) {
    var p = proportionalSize(this, width, height);
    return this.rx(new SVG.Number(p.width).divide(2)).ry(new SVG.Number(p.height).divide(2));
  }
});
/* global proportionalSize */

SVG.Line = SVG.invent({
  // Initialize node
  create: 'line',
  // Inherit from
  inherit: SVG.Shape,
  // Add class methods
  extend: {
    // Get array
    array: function array() {
      return new SVG.PointArray([[this.attr('x1'), this.attr('y1')], [this.attr('x2'), this.attr('y2')]]);
    },
    // Overwrite native plot() method
    plot: function plot(x1, y1, x2, y2) {
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
        x1 = new SVG.PointArray(x1).toLine();
      }

      return this.attr(x1);
    },
    // Move by left top corner
    move: function move(x, y) {
      return this.attr(this.array().move(x, y).toLine());
    },
    // Set element size to given width and height
    size: function size(width, height) {
      var p = proportionalSize(this, width, height);
      return this.attr(this.array().size(p.width, p.height).toLine());
    }
  },
  // Add parent method
  construct: {
    // Create a line element
    line: function line(x1, y1, x2, y2) {
      // make sure plot is called as a setter
      // x1 is not necessarily a number, it can also be an array, a string and a SVG.PointArray
      return SVG.Line.prototype.plot.apply(this.put(new SVG.Line()), x1 != null ? [x1, y1, x2, y2] : [0, 0, 0, 0]);
    }
  }
});
/* global proportionalSize */

SVG.Polyline = SVG.invent({
  // Initialize node
  create: 'polyline',
  // Inherit from
  inherit: SVG.Shape,
  // Add parent method
  construct: {
    // Create a wrapped polyline element
    polyline: function polyline(p) {
      // make sure plot is called as a setter
      return this.put(new SVG.Polyline()).plot(p || new SVG.PointArray());
    }
  }
});
SVG.Polygon = SVG.invent({
  // Initialize node
  create: 'polygon',
  // Inherit from
  inherit: SVG.Shape,
  // Add parent method
  construct: {
    // Create a wrapped polygon element
    polygon: function polygon(p) {
      // make sure plot is called as a setter
      return this.put(new SVG.Polygon()).plot(p || new SVG.PointArray());
    }
  }
}); // Add polygon-specific functions

SVG.extend([SVG.Polyline, SVG.Polygon], {
  // Get array
  array: function array() {
    return this._array || (this._array = new SVG.PointArray(this.attr('points')));
  },
  // Plot new path
  plot: function plot(p) {
    return p == null ? this.array() : this.clear().attr('points', typeof p === 'string' ? p : this._array = new SVG.PointArray(p));
  },
  // Clear array cache
  clear: function clear() {
    delete this._array;
    return this;
  },
  // Move by left top corner
  move: function move(x, y) {
    return this.attr('points', this.array().move(x, y));
  },
  // Set element size to given width and height
  size: function size(width, height) {
    var p = proportionalSize(this, width, height);
    return this.attr('points', this.array().size(p.width, p.height));
  }
}); // unify all point to point elements

SVG.extend([SVG.Line, SVG.Polyline, SVG.Polygon], {
  // Define morphable array
  MorphArray: SVG.PointArray,
  // Move by left top corner over x-axis
  x: function x(_x3) {
    return _x3 == null ? this.bbox().x : this.move(_x3, this.bbox().y);
  },
  // Move by left top corner over y-axis
  y: function y(_y3) {
    return _y3 == null ? this.bbox().y : this.move(this.bbox().x, _y3);
  },
  // Set width of element
  width: function width(_width3) {
    var b = this.bbox();
    return _width3 == null ? b.width : this.size(_width3, b.height);
  },
  // Set height of element
  height: function height(_height3) {
    var b = this.bbox();
    return _height3 == null ? b.height : this.size(b.width, _height3);
  }
});
/* global proportionalSize */

SVG.Path = SVG.invent({
  // Initialize node
  create: 'path',
  // Inherit from
  inherit: SVG.Shape,
  // Add class methods
  extend: {
    // Define morphable array
    MorphArray: SVG.PathArray,
    // Get array
    array: function array() {
      return this._array || (this._array = new SVG.PathArray(this.attr('d')));
    },
    // Plot new path
    plot: function plot(d) {
      return d == null ? this.array() : this.clear().attr('d', typeof d === 'string' ? d : this._array = new SVG.PathArray(d));
    },
    // Clear array cache
    clear: function clear() {
      delete this._array;
      return this;
    },
    // Move by left top corner
    move: function move(x, y) {
      return this.attr('d', this.array().move(x, y));
    },
    // Move by left top corner over x-axis
    x: function x(_x4) {
      return _x4 == null ? this.bbox().x : this.move(_x4, this.bbox().y);
    },
    // Move by left top corner over y-axis
    y: function y(_y4) {
      return _y4 == null ? this.bbox().y : this.move(this.bbox().x, _y4);
    },
    // Set element size to given width and height
    size: function size(width, height) {
      var p = proportionalSize(this, width, height);
      return this.attr('d', this.array().size(p.width, p.height));
    },
    // Set width of element
    width: function width(_width4) {
      return _width4 == null ? this.bbox().width : this.size(_width4, this.bbox().height);
    },
    // Set height of element
    height: function height(_height4) {
      return _height4 == null ? this.bbox().height : this.size(this.bbox().width, _height4);
    }
  },
  // Add parent method
  construct: {
    // Create a wrapped path element
    path: function path(d) {
      // make sure plot is called as a setter
      return this.put(new SVG.Path()).plot(d || new SVG.PathArray());
    }
  }
});
SVG.Image = SVG.invent({
  // Initialize node
  create: 'image',
  // Inherit from
  inherit: SVG.Shape,
  // Add class methods
  extend: {
    // (re)load image
    load: function load(url, callback) {
      if (!url) return this;
      var img = new window.Image();
      SVG.on(img, 'load', function (e) {
        var p = this.parent(SVG.Pattern); // ensure image size

        if (this.width() === 0 && this.height() === 0) {
          this.size(img.width, img.height);
        }

        if (p instanceof SVG.Pattern) {
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
      SVG.on(img, 'load error', function () {
        // dont forget to unbind memory leaking events
        SVG.off(img);
      });
      return this.attr('href', img.src = url, SVG.xlink);
    }
  },
  // Add parent method
  construct: {
    // create image element, load image and set its size
    image: function image(source, callback) {
      return this.put(new SVG.Image()).size(0, 0).load(source, callback);
    }
  }
});
SVG.Text = SVG.invent({
  // Initialize node
  create: function create(node) {
    SVG.Element.call(this, node || SVG.create('text'));
    this.dom.leading = new SVG.Number(1.3); // store leading value for rebuilding

    this._rebuild = true; // enable automatic updating of dy values

    this._build = false; // disable build mode for adding multiple lines
    // set default font

    this.attr('font-family', SVG.defaults.attrs['font-family']);
  },
  // Inherit from
  inherit: SVG.Parent,
  // Add class methods
  extend: {
    // Move over x-axis
    x: function x(_x5) {
      // act as getter
      if (_x5 == null) {
        return this.attr('x');
      }

      return this.attr('x', _x5);
    },
    // Move over y-axis
    y: function y(_y5) {
      var oy = this.attr('y');
      var o = typeof oy === 'number' ? oy - this.bbox().y : 0; // act as getter

      if (_y5 == null) {
        return typeof oy === 'number' ? oy - o : oy;
      }

      return this.attr('y', typeof _y5 === 'number' ? _y5 + o : _y5);
    },
    // Move center over x-axis
    cx: function cx(x) {
      return x == null ? this.bbox().cx : this.x(x - this.bbox().width / 2);
    },
    // Move center over y-axis
    cy: function cy(y) {
      return y == null ? this.bbox().cy : this.y(y - this.bbox().height / 2);
    },
    // Set the text content
    text: function text(_text) {
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


          if (i !== firstLine && children[i].nodeType !== 3 && SVG.adopt(children[i]).dom.newLined === true) {
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
    },
    // Set / get leading
    leading: function leading(value) {
      // act as getter
      if (value == null) {
        return this.dom.leading;
      } // act as setter


      this.dom.leading = new SVG.Number(value);
      return this.rebuild();
    },
    // Rebuild appearance type
    rebuild: function rebuild(_rebuild) {
      // store new rebuild flag if given
      if (typeof _rebuild === 'boolean') {
        this._rebuild = _rebuild;
      } // define position of all lines


      if (this._rebuild) {
        var self = this;
        var blankLineOffset = 0;
        var dy = this.dom.leading * new SVG.Number(this.attr('font-size'));
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
    },
    // Enable / disable build mode
    build: function build(_build) {
      this._build = !!_build;
      return this;
    },
    // overwrite method from parent to set data properly
    setData: function setData(o) {
      this.dom = o;
      this.dom.leading = new SVG.Number(o.leading || 1.3);
      return this;
    }
  },
  // Add parent method
  construct: {
    // Create text element
    text: function text(_text2) {
      return this.put(new SVG.Text()).text(_text2);
    },
    // Create plain text element
    plain: function plain(text) {
      return this.put(new SVG.Text()).plain(text);
    }
  }
});
SVG.Tspan = SVG.invent({
  // Initialize node
  create: 'tspan',
  // Inherit from
  inherit: SVG.Parent,
  // Add class methods
  extend: {
    // Set text content
    text: function text(_text3) {
      if (_text3 == null) return this.node.textContent + (this.dom.newLined ? '\n' : '');
      typeof _text3 === 'function' ? _text3.call(this, this) : this.plain(_text3);
      return this;
    },
    // Shortcut dx
    dx: function dx(_dx) {
      return this.attr('dx', _dx);
    },
    // Shortcut dy
    dy: function dy(_dy) {
      return this.attr('dy', _dy);
    },
    // Create new line
    newLine: function newLine() {
      // fetch text parent
      var t = this.parent(SVG.Text); // mark new line

      this.dom.newLined = true; // apply new position

      return this.dy(t.dom.leading * t.attr('font-size')).attr('x', t.x());
    }
  }
});
SVG.extend([SVG.Text, SVG.Tspan], {
  // Create plain text node
  plain: function plain(text) {
    // clear if build mode is disabled
    if (this._build === false) {
      this.clear();
    } // create text node


    this.node.appendChild(document.createTextNode(text));
    return this;
  },
  // Create a tspan
  tspan: function tspan(text) {
    var tspan = new SVG.Tspan(); // clear if build mode is disabled

    if (!this._build) {
      this.clear();
    } // add new tspan


    this.node.appendChild(tspan.node);
    return tspan.text(text);
  },
  // FIXME: Does this also work for textpath?
  // Get length of text element
  length: function length() {
    return this.node.getComputedTextLength();
  }
});
SVG.TextPath = SVG.invent({
  // Initialize node
  create: 'textPath',
  // Inherit from
  inherit: SVG.Text,
  // Define parent class
  parent: SVG.Parent,
  // Add parent method
  extend: {
    MorphArray: SVG.PathArray,
    // return the array of the path track element
    array: function array() {
      var track = this.track();
      return track ? track.array() : null;
    },
    // Plot path if any
    plot: function plot(d) {
      var track = this.track();
      var pathArray = null;

      if (track) {
        pathArray = track.plot(d);
      }

      return d == null ? pathArray : this;
    },
    // Get the path element
    track: function track() {
      return this.reference('href');
    }
  },
  construct: {
    textPath: function textPath(text, path) {
      return this.defs().path(path).text(text).addTo(this);
    }
  }
});
SVG.extend([SVG.Text], {
  // Create path for text to run on
  path: function path(track) {
    var path = new SVG.TextPath(); // if d is a path, reuse it

    if (!(track instanceof SVG.Path)) {
      // create path element
      track = this.doc().defs().path(track);
    } // link textPath to path and add content


    path.attr('href', '#' + track, SVG.xlink); // add textPath element as child node and return textPath

    return this.put(path);
  },
  // Todo: make this plural?
  // Get the textPath children
  textPath: function textPath() {
    return this.select('textPath');
  }
});
SVG.extend([SVG.Path], {
  // creates a textPath from this path
  text: function text(_text4) {
    if (_text4 instanceof SVG.Text) {
      var txt = _text4.text();

      return _text4.clear().path(this).text(txt);
    }

    return this.parent().put(new SVG.Text()).path(this).text(_text4);
  } // TODO: Maybe add `targets` to get all textPaths associated with this path

});
SVG.A = SVG.invent({
  // Initialize node
  create: 'a',
  // Inherit from
  inherit: SVG.Container,
  // Add class methods
  extend: {
    // Link url
    to: function to(url) {
      return this.attr('href', url, SVG.xlink);
    },
    // Link target attribute
    target: function target(_target) {
      return this.attr('target', _target);
    }
  },
  // Add parent method
  construct: {
    // Create a hyperlink element
    link: function link(url) {
      return this.put(new SVG.A()).to(url);
    }
  }
});
SVG.extend(SVG.Element, {
  // Create a hyperlink element
  linkTo: function linkTo(url) {
    var link = new SVG.A();

    if (typeof url === 'function') {
      url.call(link, link);
    } else {
      link.to(url);
    }

    return this.parent().put(link).put(this);
  }
});
SVG.Marker = SVG.invent({
  // Initialize node
  create: 'marker',
  // Inherit from
  inherit: SVG.Container,
  // Add class methods
  extend: {
    // Set width of element
    width: function width(_width5) {
      return this.attr('markerWidth', _width5);
    },
    // Set height of element
    height: function height(_height5) {
      return this.attr('markerHeight', _height5);
    },
    // Set marker refX and refY
    ref: function ref(x, y) {
      return this.attr('refX', x).attr('refY', y);
    },
    // Update marker
    update: function update(block) {
      // remove all content
      this.clear(); // invoke passed block

      if (typeof block === 'function') {
        block.call(this, this);
      }

      return this;
    },
    // Return the fill id
    toString: function toString() {
      return 'url(#' + this.id() + ')';
    }
  },
  // Add parent method
  construct: {
    marker: function marker(width, height, block) {
      // Create marker element in defs
      return this.defs().marker(width, height, block);
    }
  }
});
SVG.extend(SVG.Defs, {
  // Create marker
  marker: function marker(width, height, block) {
    // Set default viewbox to match the width and height, set ref to cx and cy and set orient to auto
    return this.put(new SVG.Marker()).size(width, height).ref(width / 2, height / 2).viewbox(0, 0, width, height).attr('orient', 'auto').update(block);
  }
});
SVG.extend([SVG.Line, SVG.Polyline, SVG.Polygon, SVG.Path], {
  // Create and attach markers
  marker: function marker(_marker, width, height, block) {
    var attr = ['marker']; // Build attribute name

    if (_marker !== 'all') attr.push(_marker);
    attr = attr.join('-'); // Set marker attribute

    _marker = arguments[1] instanceof SVG.Marker ? arguments[1] : this.doc().marker(width, height, block);
    return this.attr(attr, _marker);
  }
}); // Define list of available attributes for stroke and fill

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

    if (typeof o === 'string' || SVG.Color.isRgb(o) || o && typeof o.fill === 'function') {
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

  SVG.extend([SVG.Element, SVG.Timeline], extension);
});
SVG.extend([SVG.Element, SVG.Timeline], {
  // Let the user set the matrix directly
  matrix: function matrix(mat, b, c, d, e, f) {
    // Act as a getter
    if (mat == null) {
      return new SVG.Matrix(this);
    } // Act as a setter, the user can pass a matrix or a set of numbers


    return this.attr('transform', new SVG.Matrix(mat, b, c, d, e, f));
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
    return this.x(new SVG.Number(x).plus(this instanceof SVG.Timeline ? 0 : this.x()), true);
  },
  // Relative move over y axis
  dy: function dy(y) {
    return this.y(new SVG.Number(y).plus(this instanceof SVG.Timeline ? 0 : this.y()), true);
  },
  // Relative move over x and y axes
  dmove: function dmove(x, y) {
    return this.dx(x).dy(y);
  }
});
SVG.extend([SVG.Rect, SVG.Ellipse, SVG.Circle, SVG.Gradient, SVG.Timeline], {
  // Add x and y radius
  radius: function radius(x, y) {
    var type = (this._target || this).type;
    return type === 'radialGradient' || type === 'radialGradient' ? this.attr('r', new SVG.Number(x)) : this.rx(x).ry(y == null ? x : y);
  }
});
SVG.extend(SVG.Path, {
  // Get path length
  length: function length() {
    return this.node.getTotalLength();
  },
  // Get point at length
  pointAt: function pointAt(length) {
    return new SVG.Point(this.node.getPointAtLength(length));
  }
});
SVG.extend([SVG.Parent, SVG.Text, SVG.Tspan, SVG.Timeline], {
  // Set font
  font: function font(a, v) {
    if (_typeof(a) === 'object') {
      for (v in a) {
        this.font(v, a[v]);
      }
    }

    return a === 'leading' ? this.leading(v) : a === 'anchor' ? this.attr('text-anchor', v) : a === 'size' || a === 'family' || a === 'weight' || a === 'stretch' || a === 'variant' || a === 'style' ? this.attr('font-' + a, v) : this.attr(a, v);
  }
});
SVG.extend(SVG.Element, {
  // Store data values on svg nodes
  data: function data(a, v, r) {
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
});
SVG.extend(SVG.Element, {
  // Remember arbitrary data
  remember: function remember(k, v) {
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
  },
  // Erase a given memory
  forget: function forget() {
    if (arguments.length === 0) {
      this._memory = {};
    } else {
      for (var i = arguments.length - 1; i >= 0; i--) {
        delete this.memory()[arguments[i]];
      }
    }

    return this;
  },
  // Initialize or return local memory object
  memory: function memory() {
    return this._memory || (this._memory = {});
  }
});
/* global idFromReference */
// Method for getting an element by id

SVG.get = function (id) {
  var node = document.getElementById(idFromReference(id) || id);
  return SVG.adopt(node);
}; // Select elements by query string


SVG.select = function (query, parent) {
  return SVG.utils.map((parent || document).querySelectorAll(query), function (node) {
    return SVG.adopt(node);
  });
};

SVG.$$ = function (query, parent) {
  return SVG.utils.map((parent || document).querySelectorAll(query), function (node) {
    return SVG.adopt(node);
  });
};

SVG.$ = function (query, parent) {
  return SVG.adopt((parent || document).querySelector(query));
};

SVG.extend(SVG.Parent, {
  // Scoped select method
  select: function select(query) {
    return SVG.select(query, this.node);
  }
});
/* eslint no-unused-vars: 0 */

function createElement(element, makeNested) {
  if (element instanceof SVG.Element) return element;

  if (_typeof(element) === 'object') {
    return SVG.adopt(element);
  }

  if (element == null) {
    return new SVG.Doc();
  }

  if (typeof element === 'string' && element.charAt(0) !== '<') {
    return SVG.adopt(document.querySelector(element));
  }

  var node = SVG.create('svg');
  node.innerHTML = element;
  element = SVG.adopt(node.firstElementChild);
  return element;
}

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

function pathRegReplace(a, b, c, d) {
  return c + d.replace(SVG.regex.dots, ' .');
} // creates deep clone of array


function arrayClone(arr) {
  var clone = arr.slice(0);

  for (var i = clone.length; i--;) {
    if (Array.isArray(clone[i])) {
      clone[i] = arrayClone(clone[i]);
    }
  }

  return clone;
} // tests if a given element is instance of an object


function _is(el, obj) {
  return el instanceof obj;
} // tests if a given selector matches an element


function _matches(el, selector) {
  return (el.matches || el.matchesSelector || el.msMatchesSelector || el.mozMatchesSelector || el.webkitMatchesSelector || el.oMatchesSelector).call(el, selector);
} // Convert dash-separated-string to camelCase


function camelCase(s) {
  return s.toLowerCase().replace(/-(.)/g, function (m, g) {
    return g.toUpperCase();
  });
} // Capitalize first letter of a string


function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
} // Ensure to six-based hex


function fullHex(hex) {
  return hex.length === 4 ? ['#', hex.substring(1, 2), hex.substring(1, 2), hex.substring(2, 3), hex.substring(2, 3), hex.substring(3, 4), hex.substring(3, 4)].join('') : hex;
} // Component to hex value


function compToHex(comp) {
  var hex = comp.toString(16);
  return hex.length === 1 ? '0' + hex : hex;
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
} // Map matrix array to object


function arrayToMatrix(a) {
  return {
    a: a[0],
    b: a[1],
    c: a[2],
    d: a[3],
    e: a[4],
    f: a[5]
  };
} // Add centre point to transform object


function ensureCentre(o, target) {
  o.cx = o.cx == null ? target.bbox().cx : o.cx;
  o.cy = o.cy == null ? target.bbox().cy : o.cy;
} // PathArray Helpers


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
} // Deep new id assignment


function assignNewId(node) {
  // do the same for SVG child nodes as well
  for (var i = node.children.length - 1; i >= 0; i--) {
    assignNewId(node.children[i]);
  }

  if (node.id) {
    return SVG.adopt(node).id(SVG.eid(node.nodeName));
  }

  return SVG.adopt(node);
} // Add more bounding box properties


function fullBox(b) {
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
  return b;
} // Get id from reference string


function idFromReference(url) {
  var m = (url || '').toString().match(SVG.regex.reference);
  if (m) return m[1];
} // Create matrix array for looping


var abcdef = 'abcdef'.split('');

function closeEnough(a, b, threshold) {
  return Math.abs(b - a) < (threshold || 1e-6);
}

function isMatrixLike(o) {
  return o.a != null || o.b != null || o.c != null || o.d != null || o.e != null || o.f != null;
} // TODO: Refactor this to a static function of matrix.js


function formatTransforms(o) {
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
  var origin = new SVG.Point(o.origin || o.around || o.ox || o.originX, o.oy || o.originY);
  var ox = origin.x;
  var oy = origin.y;
  var position = new SVG.Point(o.position || o.px || o.positionX, o.py || o.positionY);
  var px = position.x;
  var py = position.y;
  var translate = new SVG.Point(o.translate || o.tx || o.translateX, o.ty || o.translateY);
  var tx = translate.x;
  var ty = translate.y;
  var relative = new SVG.Point(o.relative || o.rx || o.relativeX, o.ry || o.relativeY);
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


function matrixMultiply(l, r, o) {
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
/* globals fullBox, domContains, isNulledBox, Exception */


SVG.Box = SVG.invent({
  create: function create(source) {
    var base = [0, 0, 0, 0];
    source = typeof source === 'string' ? source.split(SVG.regex.delimiter).map(parseFloat) : Array.isArray(source) ? source : _typeof(source) === 'object' ? [source.left != null ? source.left : source.x, source.top != null ? source.top : source.y, source.width, source.height] : arguments.length === 4 ? [].slice.call(arguments) : base;
    this.x = source[0];
    this.y = source[1];
    this.width = source[2];
    this.height = source[3]; // add center, right, bottom...

    fullBox(this);
  },
  extend: {
    // Merge rect box with another, return a new instance
    merge: function merge(box) {
      var x = Math.min(this.x, box.x);
      var y = Math.min(this.y, box.y);
      return new SVG.Box(x, y, Math.max(this.x + this.width, box.x + box.width) - x, Math.max(this.y + this.height, box.y + box.height) - y);
    },
    transform: function transform(m) {
      var xMin = Infinity;
      var xMax = -Infinity;
      var yMin = Infinity;
      var yMax = -Infinity;
      var pts = [new SVG.Point(this.x, this.y), new SVG.Point(this.x2, this.y), new SVG.Point(this.x, this.y2), new SVG.Point(this.x2, this.y2)];
      pts.forEach(function (p) {
        p = p.transform(m);
        xMin = Math.min(xMin, p.x);
        xMax = Math.max(xMax, p.x);
        yMin = Math.min(yMin, p.y);
        yMax = Math.max(yMax, p.y);
      });
      return new SVG.Box(xMin, yMin, xMax - xMin, yMax - yMin);
    },
    addOffset: function addOffset() {
      // offset by window scroll position, because getBoundingClientRect changes when window is scrolled
      this.x += window.pageXOffset;
      this.y += window.pageYOffset;
      return this;
    },
    toString: function toString() {
      return this.x + ' ' + this.y + ' ' + this.width + ' ' + this.height;
    },
    toArray: function toArray() {
      return [this.x, this.y, this.width, this.height];
    },
    morph: function morph(x, y, width, height) {
      this.destination = new SVG.Box(x, y, width, height);
      return this;
    },
    at: function at(pos) {
      if (!this.destination) return this;
      return new SVG.Box(this.x + (this.destination.x - this.x) * pos, this.y + (this.destination.y - this.y) * pos, this.width + (this.destination.width - this.width) * pos, this.height + (this.destination.height - this.height) * pos);
    }
  },
  // Define Parent
  parent: SVG.Element,
  // Constructor
  construct: {
    // Get bounding box
    bbox: function bbox() {
      var box;

      try {
        // find native bbox
        box = this.node.getBBox();

        if (isNulledBox(box) && !domContains(this.node)) {
          throw new Exception('Element not in the dom');
        }
      } catch (e) {
        try {
          var clone = this.clone(SVG.parser().svg).show();
          box = clone.node.getBBox();
          clone.remove();
        } catch (e) {
          console.warn('Getting a bounding box of this element is not possible');
        }
      }

      return new SVG.Box(box);
    },
    rbox: function rbox(el) {
      // IE11 throws an error when element not in dom
      try {
        var box = new SVG.Box(this.node.getBoundingClientRect());
        if (el) return box.transform(el.screenCTM().inverse());
        return box.addOffset();
      } catch (e) {
        return new SVG.Box();
      }
    }
  }
});
SVG.extend([SVG.Doc, SVG.Symbol, SVG.Image, SVG.Pattern, SVG.Marker, SVG.ForeignObject, SVG.View], {
  viewbox: function viewbox(x, y, width, height) {
    // act as getter
    if (x == null) return new SVG.Box(this.attr('viewBox')); // act as setter

    return this.attr('viewBox', new SVG.Box(x, y, width, height));
  }
});

SVG.parser = function () {
  var b;

  if (!SVG.parser.nodes.svg.node.parentNode) {
    b = document.body || document.documentElement;
    SVG.parser.nodes.svg.addTo(b);
  }

  return SVG.parser.nodes;
};

SVG.parser.nodes = {
  svg: SVG().size(2, 0).css({
    opacity: 0,
    position: 'absolute',
    left: '-100%',
    top: '-100%',
    overflow: 'hidden'
  })
};
SVG.parser.nodes.path = SVG.parser.nodes.svg.path().node;
/* global requestAnimationFrame */

SVG.Animator = {
  nextDraw: null,
  frames: new SVG.Queue(),
  timeouts: new SVG.Queue(),
  timer: window.performance || window.Date,
  transforms: [],
  frame: function frame(fn) {
    // Store the node
    var node = SVG.Animator.frames.push({
      run: fn
    }); // Request an animation frame if we don't have one

    if (SVG.Animator.nextDraw === null) {
      SVG.Animator.nextDraw = requestAnimationFrame(SVG.Animator._draw);
    } // Return the node so we can remove it easily


    return node;
  },
  transform_frame: function transform_frame(fn, id) {
    SVG.Animator.transforms[id] = fn;
  },
  timeout: function timeout(fn, delay) {
    delay = delay || 0; // Work out when the event should fire

    var time = SVG.Animator.timer.now() + delay; // Add the timeout to the end of the queue

    var node = SVG.Animator.timeouts.push({
      run: fn,
      time: time
    }); // Request another animation frame if we need one

    if (SVG.Animator.nextDraw === null) {
      SVG.Animator.nextDraw = requestAnimationFrame(SVG.Animator._draw);
    }

    return node;
  },
  cancelFrame: function cancelFrame(node) {
    SVG.Animator.frames.remove(node);
  },
  clearTimeout: function clearTimeout(node) {
    SVG.Animator.timeouts.remove(node);
  },
  _draw: function _draw(now) {
    // Run all the timeouts we can run, if they are not ready yet, add them
    // to the end of the queue immediately! (bad timeouts!!! [sarcasm])
    var nextTimeout = null;
    var lastTimeout = SVG.Animator.timeouts.last();

    while (nextTimeout = SVG.Animator.timeouts.shift()) {
      // Run the timeout if its time, or push it to the end
      if (now >= nextTimeout.time) {
        nextTimeout.run();
      } else {
        SVG.Animator.timeouts.push(nextTimeout);
      } // If we hit the last item, we should stop shifting out more items


      if (nextTimeout === lastTimeout) break;
    } // Run all of the animation frames


    var nextFrame = null;
    var lastFrame = SVG.Animator.frames.last();

    while (nextFrame !== lastFrame && (nextFrame = SVG.Animator.frames.shift())) {
      nextFrame.run();
    }

    SVG.Animator.transforms.forEach(function (el) {
      el();
    }); // If we have remaining timeouts or frames, draw until we don't anymore

    SVG.Animator.nextDraw = SVG.Animator.timeouts.first() || SVG.Animator.frames.first() ? requestAnimationFrame(SVG.Animator._draw) : null;
  }
};
SVG.Morphable = SVG.invent({
  create: function create(stepper) {
    // FIXME: the default stepper does not know about easing
    this._stepper = stepper || new SVG.Ease('-');
    this._from = null;
    this._to = null;
    this._type = null;
    this._context = null;
    this._morphObj = null;
  },
  extend: {
    from: function from(val) {
      if (val == null) {
        return this._from;
      }

      this._from = this._set(val);
      return this;
    },
    to: function to(val) {
      if (val == null) {
        return this._to;
      }

      this._to = this._set(val);
      return this;
    },
    type: function type(_type) {
      // getter
      if (_type == null) {
        return this._type;
      } // setter


      this._type = _type;
      return this;
    },
    _set: function _set(value) {
      if (!this._type) {
        var type = _typeof(value);

        if (type === 'number') {
          this.type(SVG.Number);
        } else if (type === 'string') {
          if (SVG.Color.isColor(value)) {
            this.type(SVG.Color);
          } else if (SVG.regex.delimiter.test(value)) {
            this.type(SVG.regex.pathLetters.test(value) ? SVG.PathArray : SVG.Array);
          } else if (SVG.regex.numberAndUnit.test(value)) {
            this.type(SVG.Number);
          } else {
            this.type(SVG.Morphable.NonMorphable);
          }
        } else if (SVG.MorphableTypes.indexOf(value.constructor) > -1) {
          this.type(value.constructor);
        } else if (Array.isArray(value)) {
          this.type(SVG.Array);
        } else if (type === 'object') {
          this.type(SVG.Morphable.ObjectBag);
        } else {
          this.type(SVG.Morphable.NonMorphable);
        }
      }

      var result = new this._type(value).toArray();
      this._morphObj = this._morphObj || new this._type();
      this._context = this._context || Array.apply(null, Array(result.length)).map(Object);
      return result;
    },
    stepper: function stepper(_stepper) {
      if (_stepper == null) return this._stepper;
      this._stepper = _stepper;
      return this;
    },
    done: function done() {
      var complete = this._context.map(this._stepper.done).reduce(function (last, curr) {
        return last && curr;
      }, true);

      return complete;
    },
    at: function at(pos) {
      var _this = this;

      return this._morphObj.fromArray(this._from.map(function (i, index) {
        return _this._stepper.step(i, _this._to[index], pos, _this._context[index], _this._context);
      }));
    }
  }
});
SVG.Morphable.NonMorphable = SVG.invent({
  create: function create(val) {
    val = Array.isArray(val) ? val[0] : val;
    this.value = val;
  },
  extend: {
    valueOf: function valueOf() {
      return this.value;
    },
    toArray: function toArray() {
      return [this.value];
    }
  }
});
SVG.Morphable.TransformBag = SVG.invent({
  create: function create(obj) {
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

    Object.assign(this, SVG.Morphable.TransformBag.defaults, obj);
  },
  extend: {
    toArray: function toArray() {
      var v = this;
      return [v.scaleX, v.scaleY, v.shear, v.rotate, v.translateX, v.translateY, v.originX, v.originY];
    }
  }
});
SVG.Morphable.TransformBag.defaults = {
  scaleX: 1,
  scaleY: 1,
  shear: 0,
  rotate: 0,
  translateX: 0,
  translateY: 0,
  originX: 0,
  originY: 0
};
SVG.Morphable.ObjectBag = SVG.invent({
  create: function create(objOrArr) {
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
  },
  extend: {
    valueOf: function valueOf() {
      var obj = {};
      var arr = this.values;

      for (var i = 0, len = arr.length; i < len; i += 2) {
        obj[arr[i]] = arr[i + 1];
      }

      return obj;
    },
    toArray: function toArray() {
      return this.values;
    }
  }
});
SVG.MorphableTypes = [SVG.Number, SVG.Color, SVG.Box, SVG.Matrix, SVG.Array, SVG.PointArray, SVG.PathArray, SVG.Morphable.NonMorphable, SVG.Morphable.TransformBag, SVG.Morphable.ObjectBag];
SVG.extend(SVG.MorphableTypes, {
  to: function to(val, args) {
    return new SVG.Morphable().type(this.constructor).from(this.valueOf()).to(val, args);
  },
  fromArray: function fromArray(arr) {
    this.constructor(arr);
    return this;
  }
});
/* global isMatrixLike getOrigin */

SVG.easing = {
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
  }
};
SVG.Runner = SVG.invent({
  parent: SVG.Element,
  create: function create(options) {
    // Store a unique id on the runner, so that we can identify it later
    this.id = SVG.Runner.id++; // Ensure a default value

    options = options == null ? SVG.defaults.timeline.duration : options; // Ensure that we get a controller

    options = typeof options === 'function' ? new SVG.Controller(options) : options; // Declare all of the variables

    this._element = null;
    this._timeline = null;
    this.done = false;
    this._queue = []; // Work out the stepper and the duration

    this._duration = typeof options === 'number' && options;
    this._isDeclarative = options instanceof SVG.Controller;
    this._stepper = this._isDeclarative ? options : new SVG.Ease(); // We copy the current values from the timeline because they can change

    this._history = {}; // Store the state of the runner

    this.enabled = true;
    this._time = 0;
    this._last = 0; // Save transforms applied to this runner

    this.transforms = new SVG.Matrix();
    this.transformId = 1; // Looping variables

    this._haveReversed = false;
    this._reverse = false;
    this._loopsDone = 0;
    this._swing = false;
    this._wait = 0;
    this._times = 1;
  },
  construct: {
    animate: function animate(duration, delay, when) {
      var o = SVG.Runner.sanitise(duration, delay, when);
      var timeline = this.timeline();
      return new SVG.Runner(o.duration).loop(o).element(this).timeline(timeline).schedule(delay, when);
    },
    delay: function delay(by, when) {
      return this.animate(0, by, when);
    }
  },
  extend: {
    /*
    Runner Definitions
    ==================
    These methods help us define the runtime behaviour of the Runner or they
    help us make new runners from the current runner
    */
    element: function element(_element3) {
      if (_element3 == null) return this._element;
      this._element = _element3;

      _element3._prepareRunner();

      return this;
    },
    timeline: function timeline(_timeline) {
      // check explicitly for undefined so we can set the timeline to null
      if (typeof _timeline === 'undefined') return this._timeline;
      this._timeline = _timeline;
      return this;
    },
    animate: function animate(duration, delay, when) {
      var o = SVG.Runner.sanitise(duration, delay, when);
      var runner = new SVG.Runner(o.duration);
      if (this._timeline) runner.timeline(this._timeline);
      if (this._element) runner.element(this._element);
      return runner.loop(o).schedule(delay, when);
    },
    schedule: function schedule(timeline, delay, when) {
      // The user doesn't need to pass a timeline if we already have one
      if (!(timeline instanceof SVG.Timeline)) {
        when = delay;
        delay = timeline;
        timeline = this.timeline();
      } // If there is no timeline, yell at the user...


      if (!timeline) {
        throw Error('Runner cannot be scheduled without timeline');
      } // Schedule the runner on the timeline provided


      timeline.schedule(this, delay, when);
      return this;
    },
    unschedule: function unschedule() {
      var timeline = this.timeline();
      timeline && timeline.unschedule(this);
      return this;
    },
    loop: function loop(times, swing, wait) {
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
    },
    delay: function delay(_delay) {
      return this.animate(0, _delay);
    },

    /*
    Basic Functionality
    ===================
    These methods allow us to attach basic functions to the runner directly
    */
    queue: function queue(initFn, runFn, isTransform) {
      this._queue.push({
        initialiser: initFn || SVG.void,
        runner: runFn || SVG.void,
        isTransform: isTransform,
        initialised: false,
        finished: false
      });

      var timeline = this.timeline();
      timeline && this.timeline()._continue();
      return this;
    },
    during: function during(fn) {
      return this.queue(null, fn);
    },
    after: function after(fn) {
      return this.on('finish', fn);
    },

    /*
    Runner animation methods
    ========================
    Control how the animation plays
    */
    time: function time(_time) {
      if (_time == null) {
        return this._time;
      }

      var dt = _time - this._time;
      this.step(dt);
      return this;
    },
    duration: function duration() {
      return this._times * (this._wait + this._duration) - this._wait;
    },
    loops: function loops(p) {
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
    },
    position: function position(p) {
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
        var f = function f(x) {
          var swinging = s * Math.floor(x % (2 * (w + d)) / (w + d));
          var backwards = swinging && !r || !swinging && r;
          var uncliped = Math.pow(-1, backwards) * (x % (w + d)) / d + backwards;
          var clipped = Math.max(Math.min(uncliped, 1), 0);
          return clipped;
        }; // Figure out the value by incorporating the start time


        var endTime = t * (w + d) - w;
        position = x <= 0 ? Math.round(f(1e-5)) : x < endTime ? f(x) : Math.round(f(endTime - 1e-5));
        return position;
      } // Work out the loops done and add the position to the loops done


      var loopsDone = Math.floor(this.loops());
      var swingForward = s && loopsDone % 2 === 0;
      var forwards = swingForward && !r || r && swingForward;
      position = loopsDone + (forwards ? p : 1 - p);
      return this.loops(position);
    },
    progress: function progress(p) {
      if (p == null) {
        return Math.min(1, this._time / this.duration());
      }

      return this.time(p * this.duration());
    },
    step: function step(dt) {
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

      if (justStarted) {} // this.fire('start', this)
      // Work out if the runner is finished set the done flag here so animations
      // know, that they are running in the last step (this is good for
      // transformations which can be merged)


      var declarative = this._isDeclarative;
      this.done = !declarative && !justFinished && this._time >= duration; // Call initialise and the run function

      if (running || declarative) {
        this._initialise(running); // clear the transforms on this runner so they dont get added again and again


        this.transforms = new SVG.Matrix();

        var converged = this._run(declarative ? dt : position); // this.fire('step', this)

      } // correct the done flag here
      // declaritive animations itself know when they converged


      this.done = this.done || converged && declarative; // if (this.done) {
      //   this.fire('finish', this)
      // }

      return this;
    },
    finish: function finish() {
      return this.step(Infinity);
    },
    reverse: function reverse(_reverse) {
      this._reverse = _reverse == null ? !this._reverse : _reverse;
      return this;
    },
    ease: function ease(fn) {
      this._stepper = new SVG.Ease(fn);
      return this;
    },
    active: function active(enabled) {
      if (enabled == null) return this.enabled;
      this.enabled = enabled;
      return this;
    },

    /*
    Private Methods
    ===============
    Methods that shouldn't be used externally
    */
    // Save a morpher to the morpher list so that we can retarget it later
    _rememberMorpher: function _rememberMorpher(method, morpher) {
      this._history[method] = {
        morpher: morpher,
        caller: this._queue[this._queue.length - 1]
      };
    },
    // Try to set the target for a morpher if the morpher exists, otherwise
    // do nothing and return false
    _tryRetarget: function _tryRetarget(method, target) {
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
        var timeline = this.timeline();
        timeline && timeline._continue();
        return true;
      }

      return false;
    },
    // Run each initialise function in the runner if required
    _initialise: function _initialise(running) {
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
    },
    // Run each run function for the position or dt given
    _run: function _run(positionOrDt) {
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
    },
    addTransform: function addTransform(transform, index) {
      this.transforms.lmultiplyO(transform);
      return this;
    },
    clearTransform: function clearTransform() {
      this.transforms = new SVG.Matrix();
      return this;
    }
  }
});
SVG.Runner.id = 0;

SVG.Runner.sanitise = function (duration, delay, when) {
  // Initialise the default parameters
  var times = 1;
  var swing = false;
  var wait = 0;
  duration = duration || SVG.defaults.timeline.duration;
  delay = delay || SVG.defaults.timeline.delay;
  when = when || 'last'; // If we have an object, unpack the values

  if (_typeof(duration) === 'object' && !(duration instanceof SVG.Stepper)) {
    delay = duration.delay || delay;
    when = duration.when || when;
    swing = duration.swing || swing;
    times = duration.times || times;
    wait = duration.wait || wait;
    duration = duration.duration || SVG.defaults.timeline.duration;
  }

  return {
    duration: duration,
    delay: delay,
    swing: swing,
    times: times,
    wait: wait,
    when: when
  };
};

SVG.FakeRunner =
/*#__PURE__*/
function () {
  function _class() {
    var transforms = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new SVG.Matrix();
    var id = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : -1;
    var done = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

    _classCallCheck(this, _class);

    this.transforms = transforms;
    this.id = id;
    this.done = done;
  }

  return _class;
}();

SVG.extend([SVG.Runner, SVG.FakeRunner], {
  mergeWith: function mergeWith(runner) {
    return new SVG.FakeRunner(runner.transforms.lmultiply(this.transforms), runner.id);
  }
}); // SVG.FakeRunner.emptyRunner = new SVG.FakeRunner()

var lmultiply = function lmultiply(last, curr) {
  return last.lmultiplyO(curr);
};

var getRunnerTransform = function getRunnerTransform(runner) {
  return runner.transforms;
};

function mergeTransforms() {
  // Find the matrix to apply to the element and apply it
  var runners = this._transformationRunners.runners;
  var netTransform = runners.map(getRunnerTransform).reduce(lmultiply, new SVG.Matrix());
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
      this.runners.splice(0, deleteCnt, new SVG.FakeRunner());
      return this;
    }
  }]);

  return RunnerArray;
}();

SVG.extend(SVG.Element, {
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
    }).map(getRunnerTransform).reduce(lmultiply, new SVG.Matrix());
  },
  addRunner: function addRunner(runner) {
    this._transformationRunners.add(runner);

    SVG.Animator.transform_frame(mergeTransforms.bind(this), this._frameId);
  },
  _prepareRunner: function _prepareRunner() {
    if (this._frameId == null) {
      this._transformationRunners = new RunnerArray().add(new SVG.FakeRunner(new SVG.Matrix(this)));
      this._frameId = SVG.Element.frameId++;
    }
  }
});
SVG.Element.frameId = 0;
SVG.extend(SVG.Runner, {
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

    var morpher = new SVG.Morphable(this._stepper).to(val);
    this.queue(function () {
      morpher = morpher.from(this.element()[type](name));
    }, function (pos) {
      this.element()[type](name, morpher.at(pos));
      return morpher.done();
    });
    return this;
  },
  zoom: function zoom(level, point) {
    var morpher = new SVG.Morphable(this._stepper).to(new SVG.Number(level));
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


    var isMatrix = isMatrixLike(transforms);
    affine = transforms.affine != null ? transforms.affine : affine != null ? affine : !isMatrix; // Create a morepher and set its type

    var morpher = new SVG.Morphable().type(affine ? SVG.Morphable.TransformBag : SVG.Matrix).stepper(this._stepper);
    var origin;
    var element;
    var current;
    var currentAngle;
    var startTransform;

    function setup() {
      // make sure element and origin is defined
      element = element || this.element();
      origin = origin || getOrigin(transforms, element);
      startTransform = new SVG.Matrix(relative ? undefined : element); // add the runner to the element so it can merge transformations

      element.addRunner(this); // Deactivate all transforms that have run so far if we are absolute

      if (!relative) {
        element._clearTransformRunnersBefore(this);
      }
    }

    function run(pos) {
      // clear all other transforms before this in case something is saved
      // on this runner. We are absolute. We dont need these!
      if (!relative) this.clearTransform();

      var _transform2 = new SVG.Point(origin).transform(element._currentTransform(this)),
          x = _transform2.x,
          y = _transform2.y;

      var target = new SVG.Matrix(_objectSpread({}, transforms, {
        origin: [x, y]
      }));
      var start = this._isDeclarative && current ? current : startTransform;

      if (affine) {
        target = target.decompose(x, y);
        start = start.decompose(x, y); // Get the current and target angle as it was set

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
        // with the rotate method of SVG.Matrix
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
      current = new SVG.Matrix(affineParameters);
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
  x: function x(_x6, relative) {
    return this._queueNumber('x', _x6);
  },
  // Animatable y-axis
  y: function y(_y6) {
    return this._queueNumber('y', _y6);
  },
  dx: function dx(x) {
    return this._queueNumberDelta('dx', x);
  },
  dy: function dy(y) {
    return this._queueNumberDelta('dy', y);
  },
  _queueNumberDelta: function _queueNumberDelta(method, to) {
    to = new SVG.Number(to); // Try to change the target if we have this method already registerd

    if (this._tryRetargetDelta(method, to)) return this; // Make a morpher and queue the animation

    var morpher = new SVG.Morphable(this._stepper).to(to);
    this.queue(function () {
      var from = this.element()[method]();
      morpher.from(from);
      morpher.to(from + to);
    }, function (pos) {
      this.element()[method](morpher.at(pos));
      return morpher.done();
    }); // Register the morpher so that if it is changed again, we can retarget it

    this._rememberMorpher(method, morpher);

    return this;
  },
  _queueObject: function _queueObject(method, to) {
    // Try to change the target if we have this method already registerd
    if (this._tryRetarget(method, to)) return this; // Make a morpher and queue the animation

    var morpher = new SVG.Morphable(this._stepper).to(to);
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
    return this._queueObject(method, new SVG.Number(value));
  },
  // Animatable center x-axis
  cx: function cx(x) {
    return this._queueNumber('cx', x);
  },
  // Animatable center y-axis
  cy: function cy(y) {
    return this._queueNumber('cy', y);
  },
  // Add animatable move
  move: function move(x, y) {
    return this.x(x).y(y);
  },
  // Add animatable center
  center: function center(x, y) {
    return this.cx(x).cy(y);
  },
  // Add animatable size
  size: function size(width, height) {
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

    return this.width(width).height(height);
  },
  // Add animatable width
  width: function width(_width6) {
    return this._queueNumber('width', _width6);
  },
  // Add animatable height
  height: function height(_height6) {
    return this._queueNumber('height', _height6);
  },
  // Add animatable plot
  plot: function plot(a, b, c, d) {
    // Lines can be plotted with 4 arguments
    if (arguments.length === 4) {
      return this.plot([a, b, c, d]);
    } // FIXME: this needs to be rewritten such that the element is only accesed
    // in the init function


    return this._queueObject('plot', new this._element.MorphArray(a));
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
  leading: function leading(value) {
    return this._queueNumber('leading', value);
  },
  // Add animatable viewbox
  viewbox: function viewbox(x, y, width, height) {
    return this._queueObject('viewbox', new SVG.Box(x, y, width, height));
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
}); // Must Change ....

SVG.easing = {
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
  }
};
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

SVG.Timeline = SVG.invent({
  inherit: SVG.EventTarget,
  // Construct a new timeline on the given element
  create: function create() {
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
  },
  extend: {
    getEventTarget: function getEventTarget() {
      return this._dispatcher;
    },

    /**
     *
     */
    // schedules a runner on the timeline
    schedule: function schedule(runner, delay, when) {
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
    },
    // Remove the runner from this timeline
    unschedule: function unschedule(runner) {
      var index = this._order.indexOf(runner.id);

      if (index < 0) return this;
      delete this._runners[runner.id];

      this._order.splice(index, 1);

      runner.timeline(null);
      return this;
    },
    play: function play() {
      // Now make sure we are not paused and continue the animation
      this._paused = false;
      return this._continue();
    },
    pause: function pause() {
      // Cancel the next animation frame and pause
      this._nextFrame = null;
      this._paused = true;
      return this;
    },
    stop: function stop() {
      // Cancel the next animation frame and go to start
      this.seek(-this._time);
      return this.pause();
    },
    finish: function finish() {
      this.seek(Infinity);
      return this.pause();
    },
    speed: function speed(_speed) {
      if (_speed == null) return this._speed;
      this._speed = _speed;
      return this;
    },
    reverse: function reverse(yes) {
      var currentSpeed = this.speed();
      if (yes == null) return this.speed(-currentSpeed);
      var positive = Math.abs(currentSpeed);
      return this.speed(yes ? positive : -positive);
    },
    seek: function seek(dt) {
      this._time += dt;
      return this._continue();
    },
    time: function time(_time2) {
      if (_time2 == null) return this._time;
      this._time = _time2;
      return this;
    },
    persist: function persist(dtOrForever) {
      if (dtOrForever == null) return this._persist;
      this._persist = dtOrForever;
      return this;
    },
    source: function source(fn) {
      if (fn == null) return this._timeSource;
      this._timeSource = fn;
      return this;
    },
    _step: function _step() {
      // If the timeline is paused, just do nothing
      if (this._paused) return; // Get the time delta from the last time and update the time
      // TODO: Deal with window.blur window.focus to pause animations

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
          // TODO: Figure out end time of runner
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
        this._nextFrame = SVG.Animator.frame(this._step.bind(this));
      } else {
        this._nextFrame = null;
      }

      return this;
    },
    // Checks if we are running and continues the animation
    _continue: function _continue() {
      if (this._paused) return this;

      if (!this._nextFrame) {
        this._nextFrame = SVG.Animator.frame(this._step.bind(this));
      }

      return this;
    },
    active: function active() {
      return !!this._nextFrame;
    }
  },
  // These methods will be added to all SVG.Element objects
  parent: SVG.Element,
  construct: {
    timeline: function timeline() {
      this._timeline = this._timeline || new SVG.Timeline();
      return this._timeline;
    }
  }
}); // c = {
//   finished: Whether or not we are finished
// }

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

SVG.Stepper = SVG.invent({
  create: function create() {}
});
/***
Easing Functions
================
***/

SVG.Ease = SVG.invent({
  inherit: SVG.Stepper,
  create: function create(fn) {
    SVG.Stepper.call(this, fn);
    this.ease = SVG.easing[fn || SVG.defaults.timeline.ease] || fn;
  },
  extend: {
    step: function step(from, to, pos) {
      if (typeof from !== 'number') {
        return pos < 1 ? from : to;
      }

      return from + (to - from) * this.ease(pos);
    },
    done: function done(dt, c) {
      return false;
    }
  }
});
SVG.easing = {
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
  bezier: function bezier(t0, x0, t1, x1) {
    return function (t) {// TODO: FINISH
    };
  }
  /***
  Controller Types
  ================
  ***/

};
SVG.Controller = SVG.invent({
  inherit: SVG.Stepper,
  create: function create(fn) {
    SVG.Stepper.call(this, fn);
    this.stepper = fn;
  },
  extend: {
    step: function step(current, target, dt, c) {
      return this.stepper(current, target, dt, c);
    },
    done: function done(c) {
      return c.done;
    }
  }
});

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

SVG.Spring = SVG.invent({
  inherit: SVG.Controller,
  create: function create(duration, overshoot) {
    this.duration(duration || 500).overshoot(overshoot || 0);
  },
  extend: {
    step: function step(current, target, dt, c) {
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
    },
    duration: makeSetterGetter('_duration', recalculate),
    overshoot: makeSetterGetter('_overshoot', recalculate)
  }
});
SVG.PID = SVG.invent({
  inherit: SVG.Controller,
  create: function create(p, i, d, windup) {
    SVG.Controller.call(this);
    p = p == null ? 0.1 : p;
    i = i == null ? 0.01 : i;
    d = d == null ? 0 : d;
    windup = windup == null ? 1000 : windup;
    this.p(p).i(i).d(d).windup(windup);
  },
  extend: {
    step: function step(current, target, dt, c) {
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
    },
    windup: makeSetterGetter('windup'),
    p: makeSetterGetter('P'),
    i: makeSetterGetter('I'),
    d: makeSetterGetter('D')
  }
});

return SVG

}));
//# sourceMappingURL=svg.js.map
