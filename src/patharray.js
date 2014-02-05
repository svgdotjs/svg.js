// Path points array
SVG.PathArray = function(array, fallback) {
  this.constructor.call(this, array, fallback)
}

// Inherit from SVG.Array
SVG.PathArray.prototype = new SVG.Array

SVG.extend(SVG.PathArray, {
  // Convert array to string
  toString: function() {
    for (var s, i = 0, il = this.value.length, array = []; i < il; i++) {
      s = [this.value[i].type]
      
      switch(this.value[i].type) {
        case 'H':
          s.push(this.value[i].x)
        break
        case 'V':
          s.push(this.value[i].y)
        break
        case 'M':
        case 'L':
        case 'T':
        case 'S':
        case 'Q':
        case 'C':
          if (/[QC]/.test(this.value[i].type))
            s.push(this.value[i].x1, this.value[i].y1)
          if (/[CS]/.test(this.value[i].type))
            s.push(this.value[i].x2, this.value[i].y2)

          s.push(this.value[i].x, this.value[i].y)

        break
        case 'A':
          s.push(
            this.value[i].r1
          , this.value[i].r2
          , this.value[i].a
          , this.value[i].l
          , this.value[i].s
          , this.value[i].x
          , this.value[i].y
          )
        break
      }

      /* add to array */
      array.push(s.join(' '))
    }
    
    return array.join(' ')
  }
  // Move path string
, move: function(x, y) {
		/* get bounding box of current situation */
		var box = this.bbox()
		
    /* get relative offset */
    x -= box.x
    y -= box.y

    if (!isNaN(x) && !isNaN(y)) {
      /* move every point */
      for (var i = this.value.length - 1; i >= 0; i--) {
        switch (this.value[i].type) {
          case 'H':
            /* move along x axis only */
            this.value[i].x += x
          break
          case 'V':
            /* move along y axis only */
            this.value[i].y += y
          break
          case 'M':
          case 'L':
          case 'T':
          case 'S':
          case 'Q':
          case 'C':
            /* move first point along x and y axes */
            this.value[i].x += x
            this.value[i].y += y

            /* move third points along x and y axes */
            if (/[CQ]/.test(this.value[i].type)) {
              this.value[i].x1 += x
              this.value[i].y1 += y
            }

            /* move second points along x and y axes */
            if (/[CS]/.test(this.value[i].type)) {
              this.value[i].x2 += x
              this.value[i].y2 += y
            }

          break
          case 'A':
            /* only move position values */
            this.value[i].x += x
            this.value[i].y += y
          break
        }
      }
    }

    return this
  }
  // Resize path string
, size: function(width, height) {
		/* get bounding box of current situation */
		var box = this.bbox()

    /* recalculate position of all points according to new size */
    for (var i = this.value.length - 1; i >= 0; i--) {
      switch (this.value[i].type) {
        case 'H':
          /* move along x axis only */
          this.value[i].x = ((this.value[i].x - box.x) * width)  / box.width  + box.x
        break
        case 'V':
          /* move along y axis only */
          this.value[i].y = ((this.value[i].y - box.y) * height) / box.height + box.y
        break
        case 'M':
        case 'L':
        case 'T':
        case 'S':
        case 'Q':
        case 'C':
          this.value[i].x = ((this.value[i].x - box.x) * width)  / box.width  + box.x
          this.value[i].y = ((this.value[i].y - box.y) * height) / box.height + box.y

          /* move third points along x and y axes */
          if (/[CQ]/.test(this.value[i].type)) {
            this.value[i].x1 = ((this.value[i].x1 - box.x) * width)  / box.width  + box.x
            this.value[i].y1 = ((this.value[i].y1 - box.y) * height) / box.height + box.y
          }

          /* move second points along x and y axes */
          if (/[CS]/.test(this.value[i].type)) {
            this.value[i].x2 = ((this.value[i].x2 - box.x) * width)  / box.width  + box.x
            this.value[i].y2 = ((this.value[i].y2 - box.y) * height) / box.height + box.y
          }

        break
        case 'A':
          /* resize radii */
          this.value[i].values.r1 = (this.value[i].values.r1 * width)  / box.width
          this.value[i].values.r2 = (this.value[i].values.r2 * height) / box.height

          /* move position values */
          this.value[i].values.x = ((this.value[i].values.x - box.x) * width)  / box.width  + box.x
          this.value[i].values.y = ((this.value[i].values.y - box.y) * height) / box.height + box.y
        break
      }
    }

    return this
  }
  // Absolutize and parse path to array
, parse: function(array) {
    array = array.valueOf()

    /* if already is an array, no need to parse it */
    if (Array.isArray(array)) return array

    /* prepare for parsing */
    var i, il, x0, y0, x1, y1, x2, y2, s, seg, segs
      , x = 0
      , y = 0
    
    /* populate working path */
    SVG.parser.path.setAttribute('d', array)
    
    /* get segments */
    segs = SVG.parser.path.pathSegList

    for (i = 0, il = segs.numberOfItems; i < il; ++i) {
      seg = segs.getItem(i)
      s = seg.pathSegTypeAsLetter

      if (/[MLHVCSQTA]/.test(s)) {
        if ('x' in seg) x = seg.x
        if ('y' in seg) y = seg.y

      } else {
        if ('x1' in seg) x1 = x + seg.x1
        if ('x2' in seg) x2 = x + seg.x2
        if ('y1' in seg) y1 = y + seg.y1
        if ('y2' in seg) y2 = y + seg.y2
        if ('x'  in seg) x += seg.x
        if ('y'  in seg) y += seg.y

        switch(s){
          case 'm': 
            segs.replaceItem(SVG.parser.path.createSVGPathSegMovetoAbs(x, y), i)
          break
          case 'l': 
            segs.replaceItem(SVG.parser.path.createSVGPathSegLinetoAbs(x, y), i)
          break
          case 'h': 
            segs.replaceItem(SVG.parser.path.createSVGPathSegLinetoHorizontalAbs(x), i)
          break
          case 'v': 
            segs.replaceItem(SVG.parser.path.createSVGPathSegLinetoVerticalAbs(y), i)
          break
          case 'c': 
            segs.replaceItem(SVG.parser.path.createSVGPathSegCurvetoCubicAbs(x, y, x1, y1, x2, y2), i)
          break
          case 's': 
            segs.replaceItem(SVG.parser.path.createSVGPathSegCurvetoCubicSmoothAbs(x, y, x2, y2), i)
          break
          case 'q': 
            segs.replaceItem(SVG.parser.path.createSVGPathSegCurvetoQuadraticAbs(x, y, x1, y1), i)
          break
          case 't': 
            segs.replaceItem(SVG.parser.path.createSVGPathSegCurvetoQuadraticSmoothAbs(x, y), i)
          break
          case 'a': 
            segs.replaceItem(SVG.parser.path.createSVGPathSegArcAbs(x, y, seg.r1, seg.r2, seg.angle, seg.largeArcFlag, seg.sweepFlag), i) 
          break
          case 'z':
          case 'Z':
            x = x0
            y = y0
          break
        }
      }

      /* record the start of a subpath */
      if (/[Mm]/.test(s)) {
        x0 = x
        y0 = y
      }
    }

    /* build internal representation */
    array = []
    segs = SVG.parser.path.pathSegList
    
    for (i = 0, il = segs.numberOfItems; i < il; ++i) {
      seg = segs.getItem(i)
      s = {}

      switch (seg.pathSegTypeAsLetter) {
        case 'M':
        case 'L':
        case 'T':
        case 'S':
        case 'Q':
        case 'C':
          if (/[QC]/.test(seg.pathSegTypeAsLetter)) {
            s.x1 = seg.x1
            s.y1 = seg.y1
          }

          if (/[SC]/.test(seg.pathSegTypeAsLetter)) {
            s.x2 = seg.x2
            s.y2 = seg.y2
          }

        break
        case 'A':
          s = {
            r1: seg.r1
          , r2: seg.r2
          , a:  seg.angle
          , l:  seg.largeArcFlag|0
          , s:  seg.sweepFlag|0
          }
        break
      }

      /* make the letter, x and y values accessible as key/values */
      s.type = seg.pathSegTypeAsLetter
      s.x = seg.x
      s.y = seg.y

      /* store segment */
      array.push(s)
    }
    
    return array
  }
  // Get bounding box of path
, bbox: function() {
    SVG.parser.path.setAttribute('d', this.toString())

    return SVG.parser.path.getBBox()
  }

})