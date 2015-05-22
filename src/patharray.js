// Path points array
SVG.PathArray = function(array, fallback) {
  this.constructor.call(this, array, fallback)
}

// Inherit from SVG.Array
SVG.PathArray.prototype = new SVG.Array

SVG.extend(SVG.PathArray, {
  // Convert array to string
  toString: function() {
    return arrayToString(this.value)
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
      for (var l, i = this.value.length - 1; i >= 0; i--) {
        l = this.value[i][0]

        if (l == 'M' || l == 'L' || l == 'T')  {
          this.value[i][1] += x
          this.value[i][2] += y

        } else if (l == 'H')  {
          this.value[i][1] += x

        } else if (l == 'V')  {
          this.value[i][1] += y

        } else if (l == 'C' || l == 'S' || l == 'Q')  {
          this.value[i][1] += x
          this.value[i][2] += y
          this.value[i][3] += x
          this.value[i][4] += y

          if (l == 'C')  {
            this.value[i][5] += x
            this.value[i][6] += y
          }

        } else if (l == 'A')  {
          this.value[i][6] += x
          this.value[i][7] += y
        }

      }
    }

    return this
  }
  // Resize path string
, size: function(width, height) {
		/* get bounding box of current situation */
		var i, l, box = this.bbox()

    /* recalculate position of all points according to new size */
    for (i = this.value.length - 1; i >= 0; i--) {
      l = this.value[i][0]

      if (l == 'M' || l == 'L' || l == 'T')  {
        this.value[i][1] = ((this.value[i][1] - box.x) * width)  / box.width  + box.x
        this.value[i][2] = ((this.value[i][2] - box.y) * height) / box.height + box.y

      } else if (l == 'H')  {
        this.value[i][1] = ((this.value[i][1] - box.x) * width)  / box.width  + box.x

      } else if (l == 'V')  {
        this.value[i][1] = ((this.value[i][1] - box.y) * height) / box.height + box.y

      } else if (l == 'C' || l == 'S' || l == 'Q')  {
        this.value[i][1] = ((this.value[i][1] - box.x) * width)  / box.width  + box.x
        this.value[i][2] = ((this.value[i][2] - box.y) * height) / box.height + box.y
        this.value[i][3] = ((this.value[i][3] - box.x) * width)  / box.width  + box.x
        this.value[i][4] = ((this.value[i][4] - box.y) * height) / box.height + box.y

        if (l == 'C')  {
          this.value[i][5] = ((this.value[i][5] - box.x) * width)  / box.width  + box.x
          this.value[i][6] = ((this.value[i][6] - box.y) * height) / box.height + box.y
        }

      } else if (l == 'A')  {
        /* resize radii */
        this.value[i][1] = (this.value[i][1] * width)  / box.width
        this.value[i][2] = (this.value[i][2] * height) / box.height

        /* move position values */
        this.value[i][6] = ((this.value[i][6] - box.x) * width)  / box.width  + box.x
        this.value[i][7] = ((this.value[i][7] - box.y) * height) / box.height + box.y
      }

    }

    return this
  }
  // Absolutize and parse path to array
, parse: function(array) {
    /* if it's already is a patharray, no need to parse it */
    if (array instanceof SVG.PathArray) return array.valueOf()

    /* prepare for parsing */
    var i, il, x0, y0, x1, y1, x2, y2, s, seg, segs
      , x = 0
      , y = 0
    
    /* populate working path */
    SVG.parser.path.setAttribute('d', typeof array === 'string' ? array : arrayToString(array))
    
    /* get segments */
    segs = SVG.parser.path.pathSegList

    for (i = 0, il = segs.numberOfItems; i < il; ++i) {
      seg = segs.getItem(i)
      s = seg.pathSegTypeAsLetter

      /* yes, this IS quite verbose but also about 30 times faster than .test() with a precompiled regex */
      if (s == 'M' || s == 'L' || s == 'H' || s == 'V' || s == 'C' || s == 'S' || s == 'Q' || s == 'T' || s == 'A') {
        if ('x' in seg) x = seg.x
        if ('y' in seg) y = seg.y

      } else {
        if ('x1' in seg) x1 = x + seg.x1
        if ('x2' in seg) x2 = x + seg.x2
        if ('y1' in seg) y1 = y + seg.y1
        if ('y2' in seg) y2 = y + seg.y2
        if ('x'  in seg) x += seg.x
        if ('y'  in seg) y += seg.y

        if (s == 'm')
          segs.replaceItem(SVG.parser.path.createSVGPathSegMovetoAbs(x, y), i)
        else if (s == 'l')
          segs.replaceItem(SVG.parser.path.createSVGPathSegLinetoAbs(x, y), i)
        else if (s == 'h')
          segs.replaceItem(SVG.parser.path.createSVGPathSegLinetoHorizontalAbs(x), i)
        else if (s == 'v')
          segs.replaceItem(SVG.parser.path.createSVGPathSegLinetoVerticalAbs(y), i)
        else if (s == 'c')
          segs.replaceItem(SVG.parser.path.createSVGPathSegCurvetoCubicAbs(x, y, x1, y1, x2, y2), i)
        else if (s == 's')
          segs.replaceItem(SVG.parser.path.createSVGPathSegCurvetoCubicSmoothAbs(x, y, x2, y2), i)
        else if (s == 'q')
          segs.replaceItem(SVG.parser.path.createSVGPathSegCurvetoQuadraticAbs(x, y, x1, y1), i)
        else if (s == 't')
          segs.replaceItem(SVG.parser.path.createSVGPathSegCurvetoQuadraticSmoothAbs(x, y), i)
        else if (s == 'a')
          segs.replaceItem(SVG.parser.path.createSVGPathSegArcAbs(x, y, seg.r1, seg.r2, seg.angle, seg.largeArcFlag, seg.sweepFlag), i)
        else if (s == 'z' || s == 'Z') {
          x = x0
          y = y0
        }
      }

      /* record the start of a subpath */
      if (s == 'M' || s == 'm') {
        x0 = x
        y0 = y
      }
    }

    /* build internal representation */
    array = []
    segs  = SVG.parser.path.pathSegList
    
    for (i = 0, il = segs.numberOfItems; i < il; ++i) {
      seg = segs.getItem(i)
      s = seg.pathSegTypeAsLetter
      x = [s]

      if (s == 'M' || s == 'L' || s == 'T')
        x.push(seg.x, seg.y)
      else if (s == 'H')
        x.push(seg.x)
      else if (s == 'V')
        x.push(seg.y)
      else if (s == 'C')
        x.push(seg.x1, seg.y1, seg.x2, seg.y2, seg.x, seg.y)
      else if (s == 'S')
        x.push(seg.x2, seg.y2, seg.x, seg.y)
      else if (s == 'Q')
        x.push(seg.x1, seg.y1, seg.x, seg.y)
      else if (s == 'A')
        x.push(seg.r1, seg.r2, seg.angle, seg.largeArcFlag|0, seg.sweepFlag|0, seg.x, seg.y)

      /* store segment */
      array.push(x)
    }
    
    return array
  }
  // Get bounding box of path
, bbox: function() {
    SVG.parser.path.setAttribute('d', this.toString())

    return SVG.parser.path.getBBox()
  }

})