
// initialize id sequence
var clipID = 0;

SVG.Clip = function Clip() {
  this.constructor.call(this, SVG.create('clipPath'));
  this.id = 'svgjs_clip_' + (clipID++);
  this.attr('id', this.id);
};

// inherit from SVG.Element
SVG.Clip.prototype = new SVG.Element();

// include the container object
SVG.extend(SVG.Clip, SVG.Container);

// add clipping functionality to element
SVG.extend(SVG.Element, {
  
  // clip element using another element
  clip: function(b) {
    var p = this.mother().defs().clip();
    b(p);

    return this.clipTo(p);
  },

  // distribute clipping path to svg element
  clipTo: function(p) {
    return this.attr('clip-path', 'url(#' + p.id + ')');
  }
  
});

// add def-specific functions
SVG.extend(SVG.Defs, {
  
  // define clippath
  clip: function() {
    var e = new SVG.Clip();
    this.add(e);

    return e;
  }
  
});