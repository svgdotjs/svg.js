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