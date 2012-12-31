
SVG.Mask = function Mask() {
  this.constructor.call(this, SVG.create('mask'));
  
  // set unique id
  this.id = 'svgjs_' + (SVG.did++);
  this.attr('id', this.id);
};

// inherit from SVG.Element
SVG.Mask.prototype = new SVG.Element();

// include the container object
SVG.extend(SVG.Mask, SVG.Container);

// add clipping functionality to element
SVG.extend(SVG.Element, {
  
  // mask element using another element
  mask: function(b) {
    var m = this.parent.defs().mask();
    b(m);

    return this.maskTo(m);
  },

  // distribute mask to svg element
  maskTo: function(m) {
    return this.attr('mask', 'url(#' + m.id + ')');
  }
  
});

// add def-specific functions
SVG.extend(SVG.Defs, {
  
  // create clippath
  mask: function() {
    return this.put(new SVG.Mask());
  }
  
});