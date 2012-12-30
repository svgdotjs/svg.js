
var eventTypes = ['click', 'dblclick', 'mousedown', 'mouseup', 'mouseover', 'mouseout', 'mousemove'];

// generate events
for (var i = eventTypes.length - 1; i >= 0; i--) {
  var t = eventTypes[i];
  
  // add event to SVG.Elment
  SVG.Element.prototype[t] = function(f) {
    var e = this;
    
    // bind event to element rather than element node
    this.node['on' + t] = function() {
      return f.apply(e, arguments);
    };
    
    // return self
    return this;
  };
};