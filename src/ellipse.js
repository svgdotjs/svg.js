
SVG.Ellipse = function Ellipse() {
  this.constructor.call(this, SVG.createElement('ellipse'));
};

// inherit from SVG.Shape
SVG.Ellipse.prototype = new SVG.Shape();

// custom move function
SVG.Ellipse.prototype.move = function(x, y) {
  this.attributes.x = x;
  this.attributes.y = y;
  this.center();
  
  return this;
};

// custom size function
SVG.Ellipse.prototype.size = function(w, h) {
  this.setAttribute('rx', w / 2);
  this.setAttribute('ry', h / 2);
  this.center();
  
  return this; 
};

SVG.Ellipse.prototype.center = function(cx, cy) {
  this.setAttribute('cx', cx || ((this.attributes.x || 0) + (this.attributes.rx || 0)));
  this.setAttribute('cy', cy || ((this.attributes.y || 0) + (this.attributes.ry || 0)));
};