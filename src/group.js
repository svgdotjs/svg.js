SVG.G = function G() {
  this.constructor.call(this, SVG.create('g'));
};

// Inherit from SVG.Container
SVG.G.prototype = new SVG.Container();

SVG.extend(SVG.G, {
  
  defs: function() {
    return this.doc().defs();
  }
  
});