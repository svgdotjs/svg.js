
SVG.G = function G() {
  this.constructor.call(this, SVG.create('g'));
};

// inherit from SVG.Element
SVG.G.prototype = new SVG.Element();

// include the container object
SVG.Utils.merge(SVG.G, SVG.Container);

// Add group-specific functions
SVG.Utils.merge(SVG.G, {
  
  // group rotation
  rotate: function(d) {
    this.attr('transform', 'rotate(' + d + ')');
    return this;
  }
  
});