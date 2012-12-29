
SVG.Poly = {
  
  // set polygon data with default zero point if no data is passed
  plot: function(p) {
    return this.attr('points', p || '0,0');
  },
  
  // move path using translate
  move: function(x, y) {
    return this.transform({ x: x, y: y });
  }
  
};



SVG.Polyline = function Polyline() {
  this.constructor.call(this, SVG.create('polyline'));
};

// inherit from SVG.Shape
SVG.Polyline.prototype = new SVG.Shape();

// Add polygon-specific functions
SVG.extend(SVG.Polyline, SVG.Poly);



SVG.Polygon = function Polygon() {
  this.constructor.call(this, SVG.create('polygon'));
};

// inherit from SVG.Shape
SVG.Polygon.prototype = new SVG.Shape();

// Add polygon-specific functions
SVG.extend(SVG.Polygon, SVG.Poly);