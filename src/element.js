
SVG.Element = function Element(svgElement) {
  this.svgElement = svgElement;
  this.attributes = {};
};

//-D // inherit from SVG.Object
//-D SVG.Element.prototype = new SVG.Object();

// move element to given x and y values
SVG.Element.prototype.move = function(x, y) {
  this.setAttribute('x', x);
  this.setAttribute('y', y);
  
  return this;
};

// set element opacity
SVG.Element.prototype.opacity = function(o) {
  return this.setAttribute('opacity', Math.max(0, Math.min(1, o)));
};

// set element size to given width and height
SVG.Element.prototype.size = function(w, h) {
  this.setAttribute('width', w);
  this.setAttribute('height', h);
  
  return this;
};

// clip element using another element
SVG.Element.prototype.clip = function(block) {
  var p = this.parentSVG().defs().clipPath();
  block(p);
  
  return this.clipTo(p);
};

// distribute clipping path to svg element
SVG.Element.prototype.clipTo = function(p) {
  return this.setAttribute('clip-path', 'url(#' + p.id + ')');
};

// remove element
SVG.Element.prototype.destroy = function() {
  return this.parent != null ? this.parent.remove(this) : void 0;
};

// get parent document
SVG.Element.prototype.parentDoc = function() {
  return this._findParent(SVG.Document);
};

// get parent svg wrapper
SVG.Element.prototype.parentSVG = function() {
  return this._findParent(SVG.Nested) || this.parentDoc();
};

// set svg element attribute
SVG.Element.prototype.setAttribute = function(a, v, ns) {
  this.attributes[a] = v;
  
  if (ns != null)
    this.svgElement.setAttributeNS(ns, a, v);
  else
    this.svgElement.setAttribute(a, v);
  
  return this;
};

// get bounding box
SVG.Element.prototype.getBBox = function() {
  return this.svgElement.getBBox();
};

// private: find svg parent
SVG.Element.prototype._findParent = function(pt) {
  var e = this;
  
  while (e != null && !(e instanceof pt))
    e = e.parent;
  
  return e;
};

// include the dispatcher object
SVG.Element.include(SVG.Dispatcher);





