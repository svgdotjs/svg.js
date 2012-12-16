// initialize id sequence
var clipID = 0;

SVG.ClipPath = function ClipPath() {
  this.constructor.call(this, SVG.createElement('clipPath'));
  this.id = '_' + (clipID++);
  this.setAttribute('id', this.id);
};

// inherit from SVG.Element
SVG.ClipPath.prototype = new SVG.Element();

// include the container object
SVG.ClipPath.include(SVG.Container);