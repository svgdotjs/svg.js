// Define list of available attributes for stroke and fill
var sugar = {
  stroke: ['color', 'width', 'opacity', 'linecap', 'linejoin', 'miterlimit', 'dasharray', 'dashoffset'],
  fill: ['color', 'opacity', 'rule'],
  prefix: function (t, a) {
    return a === 'color' ? t : t + '-' + a
  }
}

// Add sugar for fill and stroke
;['fill', 'stroke'].forEach(function (m) {
  var extension = {}
  var i

  extension[m] = function (o) {
    if (typeof o === 'undefined') {
      return this
    }
    if (typeof o === 'string' || SVG.Color.isRgb(o) || (o && typeof o.fill === 'function')) {
      this.attr(m, o)
    } else {
      // set all attributes from sugar.fill and sugar.stroke list
      for (i = sugar[m].length - 1; i >= 0; i--) {
        if (o[sugar[m][i]] != null) {
          this.attr(sugar.prefix(m, sugar[m][i]), o[sugar[m][i]])
        }
      }
    }

    return this
  }

  SVG.extend([SVG.Element, SVG.Timeline], extension)
})

SVG.extend([SVG.Element, SVG.Timeline], {
  // Let the user set the matrix directly
  matrix: function (mat, b, c, d, e, f) {
    // Act as a getter
    if (mat == null) {
      return new SVG.Matrix(this)
    }

    // Act as a setter, the user can pass a matrix or a set of numbers
    return this.attr('transform', new SVG.Matrix(mat, b, c, d, e, f))
  },

  // Map rotation to transform
  rotate: function (angle, cx, cy) {
    return this.transform({rotate: angle, ox: cx, oy: cy}, true)
  },

  // Map skew to transform
  skew: function (x, y, cx, cy) {
    return arguments.length === 1 || arguments.length === 3
      ? this.transform({skew: x, ox: y, oy: cx}, true)
      : this.transform({skew: [x, y], ox: cx, oy: cy}, true)
  },

  shear: function (lam, cx, cy) {
    return this.transform({shear: lam, ox: cx, oy: cy}, true)
  },

  // Map scale to transform
  scale: function (x, y, cx, cy) {
    return arguments.length === 1 || arguments.length === 3
      ? this.transform({ scale: x, ox: y, oy: cx }, true)
      : this.transform({ scale: [x, y], ox: cx, oy: cy }, true)
  },

  // Map translate to transform
  translate: function (x, y) {
    return this.transform({ translate: [x, y] }, true)
  },

  // Map relative translations to transform
  relative: function (x, y) {
    return this.transform({ relative: [x, y] }, true)
  },

  // Map flip to transform
  flip: function (direction, around) {
    var directionString = typeof direction === 'string' ? direction
      : isFinite(direction) ? 'both'
      : 'both'
    var origin = (direction === 'both' && isFinite(around)) ? [around, around]
      : (direction === 'x') ? [around, 0]
      : (direction === 'y') ? [0, around]
      : isFinite(direction) ? [direction, direction]
      : [0, 0]
    this.transform({flip: directionString, origin: origin}, true)
  },

  // Opacity
  opacity: function (value) {
    return this.attr('opacity', value)
  },

  // Relative move over x axis
  dx: function (x) {
    return this.x(new SVG.Number(x).plus(this instanceof SVG.Timeline ? 0 : this.x()), true)
  },

  // Relative move over y axis
  dy: function (y) {
    return this.y(new SVG.Number(y).plus(this instanceof SVG.Timeline ? 0 : this.y()), true)
  },

  // Relative move over x and y axes
  dmove: function (x, y) {
    return this.dx(x).dy(y)
  }
})

SVG.extend([SVG.Rect, SVG.Ellipse, SVG.Circle, SVG.Gradient, SVG.Timeline], {
  // Add x and y radius
  radius: function (x, y) {
    var type = (this._target || this).type
    return type === 'radialGradient' || type === 'radialGradient'
      ? this.attr('r', new SVG.Number(x))
      : this.rx(x).ry(y == null ? x : y)
  }
})

SVG.extend(SVG.Path, {
  // Get path length
  length: function () {
    return this.node.getTotalLength()
  },
  // Get point at length
  pointAt: function (length) {
    return new SVG.Point(this.node.getPointAtLength(length))
  }
})

SVG.extend([SVG.Parent, SVG.Text, SVG.Tspan, SVG.Timeline], {
  // Set font
  font: function (a, v) {
    if (typeof a === 'object') {
      for (v in a) this.font(v, a[v])
    }

    return a === 'leading'
        ? this.leading(v)
      : a === 'anchor'
        ? this.attr('text-anchor', v)
      : a === 'size' || a === 'family' || a === 'weight' || a === 'stretch' || a === 'variant' || a === 'style'
        ? this.attr('font-' + a, v)
      : this.attr(a, v)
  }
})
