
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

// add clipping functionality to element
SVG.extend(SVG.Element, {
  
  // clip element using another element
  clip: function(block) {
    var p = this.mother().defs().clipPath();
    block(p);

    return this.clipTo(p);
  },

  // distribute clipping path to svg element
  clipTo: function(p) {
    return this.attr('clip-path', 'url(#' + p.id + ')');
  }
  
});
