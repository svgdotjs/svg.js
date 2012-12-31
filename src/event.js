
[ 'click',
  'dblclick',
  'mousedown',
  'mouseup',
  'mouseover',
  'mouseout',
  'mousemove',
  'touchstart',
  'touchend',
  'touchmove',
  'touchcancel' ].forEach(function(e) {
  
  // add event to SVG.Elment
  SVG.Element.prototype[e] = function(f) {
    var s = this;

    // bind event to element rather than element node
    this.node['on' + e] = function() {
      return f.apply(s, arguments);
    };

    // return self
    return this;
  };
});
