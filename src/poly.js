SVG.Poly = {
  // Set polygon data with default zero point if no data is passed
  plot: function(points) {
    this.attr('points', points || '0,0');
    
    return this;
  }
};

SVG.Polyline = function Polyline() {
  this.constructor.call(this, SVG.create('polyline'));
};

// Inherit from SVG.Shape
SVG.Polyline.prototype = new SVG.Shape();

// Add polygon-specific functions
SVG.extend(SVG.Polyline, SVG.Poly);

SVG.Polygon = function Polygon() {
  this.constructor.call(this, SVG.create('polygon'));
};

// Inherit from SVG.Shape
SVG.Polygon.prototype = new SVG.Shape();

// Add polygon-specific functions
SVG.extend(SVG.Polygon, SVG.Poly);