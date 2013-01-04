// ### Manage events on elements

//     rect.click(function() {
//       this.fill({ color: '#f06' });
//     });
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
  'touchcancel' ].forEach(function(event) {
  
  /* add event to SVG.Element */
  SVG.Element.prototype[event] = function(f) {
    var self = this;

    /* bind event to element rather than element node */
    this.node['on' + event] = function() {
      return f.apply(self, arguments);
    };
    
    return this;
  };
});
