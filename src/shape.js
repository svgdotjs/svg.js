
SVG.Shape = function Shape(element) {
  this.constructor.call(this, element);
};

// inherit from SVG.Element
SVG.Shape.prototype = new SVG.Element();

// Add shape-specific functions
SVG.Utils.merge(SVG.Shape, {
  
  // set fill color and opacity
  fill: function(f) {
    if (f.color != null)
      this.attr('fill', f.color);

    if (f.opacity != null)
      this.attr('fill-opacity', f.opacity);

    return this;
  },

  // set stroke color and opacity
  stroke: function(s) {
    if (s.color)
      this.attr('stroke', s.color);

    if (s.width != null)
      this.attr('stroke-width', s.width);

    if (s.opacity != null)
      this.attr('stroke-opacity', s.opacity);

    if (this.attrs['fill-opacity'] == null)
      this.fill({ opacity: 0 });

    return this;
  }
  
});