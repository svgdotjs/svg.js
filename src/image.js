
SVG.Image = function Image() {
  this.constructor.call(this, SVG.create('image'));
};

// inherit from SVG.Element
SVG.Image.prototype = new SVG.Shape();

// add image-specific functions
SVG.extend(SVG.Image, {
  
  // (re)load image
  load: function(u) {
    this.src = u;
    return (u ? this.attr('xlink:href', u, SVG.xlink) : this);
  }
  
});