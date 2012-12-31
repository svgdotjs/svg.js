
SVG.G = function G() {
  this.constructor.call(this, SVG.create('g'));
};

// inherit from SVG.Element
SVG.G.prototype = new SVG.Element();

// include the container object
SVG.extend(SVG.G, SVG.Container);

SVG.extend(SVG.G, {
  
  defs: function() {
    return this.parentDoc().defs();
  }
  
});