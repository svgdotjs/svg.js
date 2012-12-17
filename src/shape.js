
SVG.Shape = function Shape(element) {
  this.constructor.call(this, element);
};

// inherit from SVG.Element
SVG.Shape.prototype = new SVG.Element();

// Add shape-specific functions
SVG.Utils.merge(SVG.Shape, {
  
  // set fill color and opacity
  fill: function(fill) {
    if (fill.color != null)
      this.attr('fill', fill.color);

    if (fill.opacity != null)
      this.attr('fill-opacity', fill.opacity);

    return this;
  },

  // set stroke color and opacity
  stroke: function(stroke) {
    if (stroke.color != null)
      this.attr('stroke', stroke.color);

    if (stroke.width != null)
      this.attr('stroke-width', stroke.width);

    if (stroke.opacity != null)
      this.attr('stroke-opacity', stroke.opacity);

    if (this.attrs['fill-opacity'] == null)
      this.fill({ opacity: 0 });

    return this;
  }
  
});