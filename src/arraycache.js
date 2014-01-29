SVG.extend(SVG.PointArray, SVG.PathArray, {
	// Cache bbox
  cache: function() {
		this._cachedBBox = this.uncache().bbox()

		return this
  }
  // Remove cache
, uncache: function() {
		delete this._cachedBBox
		return this
	}

})