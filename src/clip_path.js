// initialize id sequence
var clipID = 0;

SVG.ClipPath = function ClipPath() {
  this.constructor.call(this, SVG.create('clipPath'));
  this.id = '_' + (clipID++);
  this.attr('id', this.id);
};

// inherit from SVG.Element
SVG.ClipPath.prototype = new SVG.Element();

// include the container object
SVG.Utils.merge(SVG.ClipPath, SVG.Container);