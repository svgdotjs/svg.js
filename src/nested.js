SVG.Nested = function Nested() {
  this.constructor.call(this, SVG.create('svg'));
  this.attr('overflow', 'visible');
};

// Inherit from SVG.Element
SVG.Nested.prototype = new SVG.Element();

// Include the container object
SVG.extend(SVG.Nested, SVG.Container);