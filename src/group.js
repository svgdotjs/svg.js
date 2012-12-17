
SVG.Group = function Group() {
  this.constructor.call(this, SVG.create('g'));
};

// inherit from SVG.Element
SVG.Group.prototype = new SVG.Element();

// include the container object
SVG.Utils.merge(SVG.Group, SVG.Container);

// Add group-specific functions
SVG.Utils.merge(SVG.Group, {
  
  // group rotation
  rotate: function(d) {
    this.attr('transform', 'rotate(' + d + ')');
    return this;
  }
  
});