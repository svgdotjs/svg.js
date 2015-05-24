// Invent new element
SVG.invent = function(config) {
	/* create element initializer */
	var initializer = typeof config.create == 'function' ?
		config.create :
		function() {
			this.constructor.call(this, SVG.create(config.create))
		}

	/* inherit prototype */
	if (config.inherit)
		initializer.prototype = new config.inherit

	/* extend with methods */
	if (config.extend)
		SVG.extend(initializer, config.extend)

	/* attach construct method to parent */
	if (config.construct)
		SVG.extend(config.parent || SVG.Container, config.construct)

	return initializer
}