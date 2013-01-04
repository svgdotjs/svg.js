SVG.Image = function Image() {
  this.constructor.call(this, SVG.create('image'));
};

// Inherit from SVG.Element
SVG.Image.prototype = new SVG.Shape();

SVG.extend(SVG.Image, {
  
  /* (re)load image */
  load: function(url) {
    this.src = url;
    return (url ? this.attr('xlink:href', url, SVG.xlink) : this);
  }
  
});