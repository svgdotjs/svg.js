SVG.Defs = function Defs() {
  this.constructor.call(this, SVG.createElement('defs'));
};

// inherit from SVG.Element
SVG.Defs.prototype = new SVG.Element();

// define clippath
SVG.Defs.prototype.clipPath = function() {
  var e = new SVG.ClipPath();
  this.add(e);
  
  return e;
};

// include the container object
SVG.Defs.include(SVG.Container);