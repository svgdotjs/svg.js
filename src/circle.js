
SVG.Circle = function Circle() {
  this.constructor.call(this, SVG.createElement('circle'));
};

// inherit from SVG.Shape
SVG.Circle.prototype = new SVG.Shape();

// custom move function
SVG.Circle.prototype.move = function(x, y) {
  this.attributes.x = x;
  this.attributes.y = y;
  this.center();
  
  return this;
};

// custom size function
SVG.Circle.prototype.size = function(w, h) {
  this.setAttribute('r', w / 2);
  this.center();
  
  return this;
};

// private: center 
SVG.Circle.prototype.center = function(cx, cy) {
  var r = this.attributes.r || 0;
  
  this.setAttribute('cx', cx || ((this.attributes.x || 0) + r));
  this.setAttribute('cy', cy || ((this.attributes.y || 0) + r));
};