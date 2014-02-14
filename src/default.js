
SVG.defaults = {
  // Default matrix
  matrix:       '1 0 0 1 0 0'
  
  // Default attribute values
, attrs: {
    /* fill and stroke */
    'fill-opacity':     1
  , 'stroke-opacity':   1
  , 'stroke-width':     0
  , 'stroke-linejoin':  'miter'
  , 'stroke-linecap':   'butt'
  , fill:               '#000000'
  , stroke:             '#000000'
  , opacity:            1
    /* position */
  , x:                  0
  , y:                  0
  , cx:                 0
  , cy:                 0
    /* size */  
  , width:              0
  , height:             0
    /* radius */  
  , r:                  0
  , rx:                 0
  , ry:                 0
    /* gradient */  
  , offset:             0
  , 'stop-opacity':     1
  , 'stop-color':       '#000000'
    /* text */
  , 'font-size':        16
  , 'font-family':      'Helvetica, Arial, sans-serif'
  , 'text-anchor':      'start'
  }
  
  // Default transformation values
, trans: function() {
    return {
      /* translate */
      x:        0
    , y:        0
      /* scale */
    , scaleX:   1
    , scaleY:   1
      /* rotate */
    , rotation: 0
      /* skew */
    , skewX:    0
    , skewY:    0
      /* matrix */
    , matrix:   this.matrix
    , a:        1
    , b:        0
    , c:        0
    , d:        1
    , e:        0
    , f:        0
    }
  }
  
}