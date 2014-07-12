SVG.extend(SVG.Element, {
	// Add transformations
	transform: function(o) {
		// Full getter
		if (o == null)
			return this.ctm().extract()

		// Singular getter
		else if (typeof o === 'string')
			return this.ctm().extract()[o]

		// Get current matrix
		var matrix = new SVG.Matrix(this)

		// Act on matrix
		if (o.a != null)
			matrix = matrix.multiply(new SVG.Matrix(o))
		
		// Act on rotate
		else if (o.rotation)
			matrix = matrix.rotate(
				o.rotation
			, o.cx == null ? this.bbox().cx : o.cx
			, o.cy == null ? this.bbox().cy : o.cy
			)

		// Act on scale
		else if (o.scale != null || o.scaleX != null || o.scaleY != null)
			matrix = matrix.scale(
				o.scale != null ? o.scale : o.scaleX != null ? o.scaleX : 1
			, o.scale != null ? o.scale : o.scaleY != null ? o.scaleY : 1
			, o.cx 		!= null ? o.cx 		: this.bbox().x
			, o.cy 		!= null ? o.cy 		: this.bbox().y
			)

		// Act on skew
		else if (o.skewX || o.skewY)
			matrix = matrix.skew(o.skewX, o.skewY)

		// Act on translate
		else if (o.x || o.y)
			matrix = matrix.translate(o.x, o.y)

		return this.attr('transform', matrix)
	}
	// Reset all transformations
, untransform: function() {
		return this.attr('transform', null)
	}

})