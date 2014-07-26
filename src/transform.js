SVG.extend(SVG.Element, SVG.FX, {
	// Add transformations
	transform: function(o) {
		// get target in case of the fx module, otherwise reference this
		var target = this.target || this

		// full getter
		if (o == null)
			return target.ctm().extract()

		// singular getter
		else if (typeof o === 'string')
			return target.ctm().extract()[o]

		// get current matrix
		var matrix = new SVG.Matrix(target)

		// act on matrix
		if (o.a != null)
			matrix = matrix.multiply(new SVG.Matrix(o))
		
		// act on rotate
		else if (o.rotation)
			matrix = matrix.rotate(
				o.rotation
			, o.cx == null ? target.bbox().cx : o.cx
			, o.cy == null ? target.bbox().cy : o.cy
			)

		// act on scale
		else if (o.scale != null || o.scaleX != null || o.scaleY != null)
			matrix = matrix.scale(
				o.scale != null ? o.scale : o.scaleX != null ? o.scaleX : 1
			, o.scale != null ? o.scale : o.scaleY != null ? o.scaleY : 1
			, o.cx 		!= null ? o.cx 		: target.bbox().x
			, o.cy 		!= null ? o.cy 		: target.bbox().y
			)

		// act on skew
		else if (o.skewX || o.skewY)
			matrix = matrix.skew(o.skewX, o.skewY)

		// act on translate
		else if (o.x || o.y)
			matrix = matrix.translate(o.x, o.y)

		return this.attr('transform', matrix)
	}
})

SVG.extend(SVG.Element, {
	// Reset all transformations
  untransform: function() {
		return this.attr('transform', null)
	}
})