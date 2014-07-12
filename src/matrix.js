SVG.Matrix = SVG.invent({
	// Initialize
	create: function(source) {
		var i, base = arrayToMatrix([1, 0, 0, 1, 0, 0])

		// Ensure source as object
		source = source && source.node && source.node.getCTM ?
			source.node.getCTM() :
		typeof source === 'string' ?
			arrayToMatrix(source.replace(/\s/g, '').split(',')) :
		arguments.length == 6 ?
			arrayToMatrix([].slice.call(arguments)) :
		typeof source === 'object' ?
			source : base

		// Merge source
		for (i = abcdef.length - 1; i >= 0; i--)
			this[abcdef[i]] = typeof source[abcdef[i]] === 'number' ?
				source[abcdef[i]] : base[abcdef[i]]
		
	}
	
	// Add methods
, extend: {
		// Extract individual transformations
	  extract: function() {
			// Find transform points
			var px 		= deltaTransformPoint(this, 0, 1)
				, py 		= deltaTransformPoint(this, 1, 0)
				, skewX = 180 / Math.PI * Math.atan2(px.y, px.x) - 90
	
			return {
				// Translation
				x: 				this.e
			, y: 				this.f
				// Skew
			, skewX: 		skewX
			, skewY: 		180 / Math.PI * Math.atan2(py.y, py.x)
				// Scale
			, scaleX: 	Math.sqrt(this.a * this.a + this.b * this.b)
			, scaleY: 	Math.sqrt(this.c * this.c + this.d * this.d)
				// Rotation
			, rotation: skewX
			}
		}
		// Multiply
	, multiply: function(matrix) {
			return new SVG.Matrix(this.native().multiply(matrix.native()))
		}
		// Inverse
	, inverse: function() {
			return new SVG.Matrix(this.native().inverse())
		}
		// Translate
	, translate: function(x, y) {
			return new SVG.Matrix(this.native().translate(x || 0, y || 0))	
		}
		// Scale
	, scale: function(x, y, cx, cy) {
			// Support universal scale
			if (arguments.length == 1 || arguments.length == 3)
				y = x
			if (arguments.length == 3) {
				cy = cx
				cx = y
			}

			return this
				.multiply(new SVG.Matrix(1, 0, 0, 1, cx || 0, cy || 0))
				.multiply(new SVG.Matrix(x, 0, 0, y, 0, 0))
				.multiply(new SVG.Matrix(1, 0, 0, 1, -cx || 0, -cy || 0))
		}
		// Rotate
	, rotate: function(d, cx, cy) {
			// Convert degrees to radians
			d = SVG.utils.radians(d)
			
			return this
				.multiply(new SVG.Matrix(1, 0, 0, 1, cx || 0, cy || 0))
				.multiply(new SVG.Matrix(Math.cos(d), Math.sin(d), -Math.sin(d), Math.cos(d), 0, 0))
				.multiply(new SVG.Matrix(1, 0, 0, 1, -cx || 0, -cy || 0))
		}
		// Flip
	, flip: function(a) {
			return new SVG.Matrix(this.native()['flip' + a.toUpperCase()]())
		}
		// Skew
	, skew: function(x, y, cx, cy) {
			// IMPLEMENT SKEW CENTER POINT
			return new SVG.Matrix(this.native().skewX(x || 0).skewY(y || 0))
		}
		// Convert this to SVGMatrix
	, native: function() {
			// Create new matrix
			var i, matrix = SVG.parser.draw.node.createSVGMatrix()
	
			// Update with current values
			for (i = abcdef.length - 1; i >= 0; i--)
				matrix[abcdef[i]] = this[abcdef[i]]

			return matrix
		}
		// Convert array to string
	, toString: function() {
			return 'matrix(' + [this.a, this.b, this.c, this.d, this.e, this.f].join() + ')'
		}
	}

	// Define parent
, parent: SVG.Element

	// Add parent method
, construct: {
		// Get current matrix
		ctm: function() {
			return new SVG.Matrix(this)
		}
	
	}

})