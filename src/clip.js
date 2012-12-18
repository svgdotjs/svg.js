
// initialize id sequence
var clipID = 0;

SVG.Clip = function Clip() {
  this.constructor.call(this, SVG.create('clipPath'));
  this.id = '_' + (clipID++);
  this.attr('id', this.id);
};

// inherit from SVG.Element
SVG.Clip.prototype = new SVG.Element();

// include the container object
SVG.extend(SVG.Clip, SVG.Container);
