
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
  
  // distribute mask to svg element
  maskWith: function(e) {
    return this.attr('mask', 'url(#' + (e instanceof SVG.Mask ? e : this.parent.mask().add(e)).id + ')');
  }
  
});