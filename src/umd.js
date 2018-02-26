
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
<%= contents %>

return SVG

}));
