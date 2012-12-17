
SVG.Image = function Image() {
  this.constructor.call(this, SVG.createElement('image'));
};

// inherit from SVG.Element
SVG.Image.prototype = new SVG.Element();

// (re)load image
SVG.Image.prototype.load = function(url) {
  this.setAttribute('href', url, SVG.xlink);
  return this;
};

// include the container object
SVG.Image.include(SVG.Container);