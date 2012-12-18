
SVG.Image = function Image() {
  this.constructor.call(this, SVG.create('image'));
};

// inherit from SVG.Element
SVG.Image.prototype = new SVG.Element();

// include the container object
SVG.extend(SVG.Image, SVG.Container);

// Add image-specific functions
SVG.extend(SVG.Image, {
  
  // (re)load image
  load: function(u) {
    this.attr('href', u, SVG.xlink);
    return this;
  }
  
});