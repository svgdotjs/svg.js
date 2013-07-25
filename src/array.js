// Module for array conversion
SVG.Array = function(array, fallback) {
	this.value = array || []

	if (this.value.length == 0 && fallback)
		this.value = fallback
}

SVG.extend(SVG.Array, {
  // Convert array to string
  toString: function() {
    var array = []

    /* detect array type */
    if (Array.isArray(this.value[0])) {
    	/* it is a poly point string */
    	for (var i = 0, il = this.value.length; i < il; i++)
    		array.push(this.value[i].join(','))
	    
    } else {
    	/* it's a regular array */
    	array = this.value
    }

    return array.join(' ')
  }
  // Real value
, valueOf: function() {
		return this.value
	}

})