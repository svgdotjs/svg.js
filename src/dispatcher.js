SVG.Dispatcher = {
  
  on: function(events, listener) {
    events = events.split(' ');
    
    for (var i = 0, l = events.length; i < l; i++)
      this.svgElement.addEventListener(events[i], listener)
  },
  
  off: function(events, listener) {
    events = events.split(' ');
    
    for (var i = 0, l = events.length; i < l; i++)
      this.svgElement.removeEventListener(events[i], listener)
  }
  
};