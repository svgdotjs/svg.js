
SVG.Group = function Group() {
  this.constructor.call(this, SVG.createElement("g"));
};

// inherit from SVG.Element
SVG.Group.prototype = new SVG.Element();

// group rotation
SVG.Group.prototype.rotate = function(d) {
  this.setAttribute('transform', 'rotate(' + d + ')');
  return this;
};

// include the container object
SVG.Group.include(SVG.Container);