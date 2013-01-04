SVG.Mask = function Mask() {
  this.constructor.call(this, SVG.create('mask'));
  
  /* set unique id */
  this.id = 'svgjs_' + (SVG.did++);
  this.attr('id', this.id);
};

// Inherit from SVG.Element
SVG.Mask.prototype = new SVG.Element();

// Include the container object
SVG.extend(SVG.Mask, SVG.Container);

SVG.extend(SVG.Element, {
  
  // Distribute mask to svg element
  maskWith: function(element) {
    return this.attr('mask', 'url(#' + (element instanceof SVG.Mask ? element : this.parent.mask().add(element)).id + ')');
  }
  
});