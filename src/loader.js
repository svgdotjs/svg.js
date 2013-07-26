
// Use AMD or CommonJS if either is present
if (typeof define === 'function' && define.amd)
  define(function() { return SVG })
else if (typeof exports !== 'undefined')
  exports.SVG = SVG