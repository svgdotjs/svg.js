
SVG.Defs = function Defs() {
  this.constructor.call(this, SVG.create('defs'));
};

// inherit from SVG.Element
SVG.Defs.prototype = new SVG.Element();

// include the container object
SVG.Utils.merge(SVG.Defs, SVG.Container);

// Add def-specific functions
SVG.Utils.merge(SVG.Defs, {
  
  // define clippath
  clipPath: function() {
    var e = new SVG.Clip();
    this.add(e);

    return e;
  }
  
});