
SVG.Shape = function Shape(element) {
  this.constructor.call(this, element);
};

// inherit from SVG.Element
SVG.Shape.prototype = new SVG.Element();

// set fill color and opacity
SVG.Shape.prototype.fill = function(fill) {
  if (fill.color != null)
    this.setAttribute('fill', fill.color);
  
  if (fill.opacity != null)
    this.setAttribute('fill-opacity', fill.opacity);
  
  return this;
};

// set stroke color and opacity
SVG.Shape.prototype.stroke = function(stroke) {
  if (stroke.color != null)
    this.setAttribute('stroke', stroke.color);
  
  if (stroke.width != null)
    this.setAttribute('stroke-width', stroke.width);
  
  if (stroke.opacity != null)
    this.setAttribute('stroke-opacity', stroke.opacity);
  
  if (this.attributes['fill-opacity'] == null)
    this.fill({ opacity: 0 });
  
  return this;
};