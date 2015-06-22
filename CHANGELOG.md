# 2.0.0-rc.2 (?/11/2014)

- added `morph()` method to `SVG.PathArray` -> __TODO!__
- added `rotate()` method to linear gradients -> __TODO!__
- added `'random'` option and `randomize()` method to `SVG.Color` -> __TODO!__
- added `parents()` method to get an array of all parenting elements -> __TODO!__
- added support for css selectors with the `parent()` method -> __TODO!__
- added `enqueue()` method to `SVG.FX` -> __TODO!__
- added `ungroup()` method -> __TODO!__ [thanks to Peter Uithoven]

# 2.0.0-rc.1 (?/10/2014)

- added specs for `SVG.FX` -> __TODO!__
- fixed a bug in clipping and masking where empty nodes persists after removal -> __TODO!__
- fixed a bug in IE11 with `mouseenter` and `mouseleave` -> __TODO!__
- added `precision()` method to round numeric element attributes -> __TODO!__

# 2.0.2 (22/06/2015)

- Fixed zoom consideration in circle and ellipse

# 2.0.1 (21/06/2015)

- fixed bug with `doc()` which always should return root svg
- removed target reference from use which caused bugs in `dmove()` and `use()` with external file
- added possibility to remove all events from a certain namespace
- fixed bug in `SVG.FX` when animating with `plot()`
- removed scale consideration in `move()` duo to incompatibilities with other move-functions e.g. in `SVG.PointArray`

# 2.0.0 (11/06/2015)

- implemented an SVG adoption system to be able to manipulate existing SVG's not created with svg.js
- changed `parent` reference on elements to `parent()` method
- using `CustomEvent` instead of `Event` to be able to fire events with a `detail` object [thanks @Fuzzyma]
- added polyfill for IE9 and IE10 custom events [thanks @Fuzzyma]
- added DOM query selector with the `select()` method globally or on parent elements
- added the intentionally neglected `SVG.Circle` element
- fixed bug in `radius()` method when `y` value equals `0`
- renamed `SVG.TSpan` class to `SVG.Tspan` to play nice with the adoption system
- added `rx()` and `ry()` to `SVG.Rect`, `SVG.Circle`, `SVG.Ellispe` and `SVG.FX`
- changed `array` reference to `array()` method on `SVG.Polyline`, `SVG.Polygon` and `SVG.Path`
- completely reworked `clone()` method to use the adoption system
- added support to clone manually built text elements
- added `svg.wiml.js` plugin to plugins list
- added `ctm()` method to for matrix-centric transformations
- added `morph()` method to `SVG.Matrix`
- added support for new matrix system to `SVG.FX`
- completely reworked transformations to be chainable and more true to their nature
- changed `lines` reference to `lines()` on `SVG.Text`
- changed `track` reference to `track()` on `SVG.Text`
- changed `textPath` reference to `textPath()` on `SVG.Text`
- added raw svg import functionality with the `svg()` method
- reworked sup-pixel offset implementation to be more compact
- added `native()` method to elements and matrix to get to the native api
- added `untransform()` method to remove all transformations
- switched from Ruby's `rake` to Node's `gulp` for building [thanks to Alex Ewerlöf]
- added coding style description to README
- changed `to()` method to `at()` method in `SVG.FX`
- added reverse functionality for animations
- documented the `situation` object in `SVG.FX`
- renamed `SVG.SetFX` to `SVG.FX.Set`
- added distinction between relative and absolute matrix transformations
- implemented the `element()` method using the `SVG.Bare` class to create elements that are not described by SVG.js
- removed `SVG.Symbol` but kept the `symbol()` method using the new `element()` method
- reworked `SVG.Number` to return new instances with calculations rather than itself
- added `w` and `h` properties as shorthand for `width` and `height` to `SVG.BBox`
- added `SVG.TBox` to get a bounding box that is affected by transformation values
- reworked animatable matrix rotations
- fixed a bug where events are not detached properly
- added event-based or complete detaching of event listeners in `off()` method

# 1.0.0-rc.9 (17/06/2014)

- added `SVG.Marker`
- added `SVG.Symbol`
- added `first()` and `last()` methods to `SVG.Set`
- added `length()` method to `SVG.Text` and `SVG.TSpan` to calculate total text length
- `SVG.get()` will now also fetch elements with a `xlink:href="#elementId"` or `url(#elementId)` value given
- added `reference()` method to get referenced elements from a given attribute value
- fixed infinite loop in viewbox when element has a percentage width / height [thanks @shabegger]

# 1.0.0-rc.8 (12/06/2014)

- fixed bug in `SVG.off`
- fixed offset by window scroll position in `rbox()` [thanks @bryhoyt]

# 1.0.0-rc.7 (11/06/2014)

- calling `after()` when calling `stop(true)` (fulfill flag) [thanks @vird]
- added `classes()`, `hasClass()`, `addClass()`, `removeClass()` and `toggleClass()` [thanks @pklingem]
- fixed a bug where `Element#style()` would not save empty values in IE11 [thanks @Shtong]
- fixed `SVG is not defined error` [thanks @anvaka]
- fixed a bug in `move()`on text elements with a string based value
- binding events listeners to svg.js instance
- text element fires `rebuild` event whenever the `rebuild()` method is called
- fix for `text()` method on text element when acting as getter [thanks @Lochemage]
- fix in `style()` method with a css string [thanks @TobiasHeckel]

# 1.0.0-rc.6 (03/03/2014)

- fine-tuned text element positioning
- fixed a bug in text `dy()` method
- added `leading()` method to `SVG.FX`
- removed internal representation for `style`
- added `reverse()` method to `SVG.Array` (and thereby also to `SVG.PointArray` and `SVG.PathArray`)
- added `fulfill` option to `stop()` method in `SVG.FX` to finalise animations
- calling `at()` method directly on morphable svg.js instances in `SVG.FX` module
- moved most `_private` methods to local named functions
- moved helpers to a separate file
- added more output values to `bbox()` and `rbox()` methods

# 1.0.0-rc.5 (14/02/2014)

- added `plain()` method to `SVG.Text` element to add plain text content, without tspans
- added `plain()` method to parent elements to create a text element without tspans
- updated `SVG.TSpan` to accept nested tspan elements, not unlike the `text()` method in `SVG.Text`
- removed the `relative()` method in favour of `dx()`, `dy()` and `dmove()`
- switched form objects to arrays in `SVG.PathArray` for compatibility with other libraries and better performance on parsing and rendering (up-to 48% faster than 1.0.0-rc.4)
- refined docs on element-specific methods and `SVG.PathArray` structure
- added `build()` to enable/disable build mode
- removed verbose style application to tspans
- reworked `leading()` implementation to be more font-size "aware"
- refactored the `attr` method on `SVG.Element`
- applied Helvetica as default font
- building `SVG.FX` class with `SVG.invent()` function

# 1.0.0-rc.4 (04/02/2014)

- switched to `MAJOR`.`MINOR`.`PATCH` versioning format to play nice with package managers
- made svg.pattern.js part of the core library
- automatic pattern creation by passing an image url or instance as `fill` attribute on elements
- added `loaded()` method to image tag
- fix in `animate('=').to()`
- added `pointAt()` method to `SVG.Path`, wrapping the native `getPointAtLength()`
- moved `length()` method to sugar module
- fix for arcs in patharray `toString()` method [thanks @dotnetCarpenter]

# v1.0rc3 (03/02/2014)

- fix for html-less documents
- added the `SVG.invent` function to ease invention of new elements
- using `SVG.invent` to generate core shapes as well for leaner code
- added second values for `animate('2s')`
- fix for arcs in patharray `toString()` method
- added `length()` mehtod to path, wrapping the native `getTotalLength()`

# v1.0rc2 (01/02/2014)

- added `index()` method to `SVG.Parent` and `SVG.Set`
- modified `cx()` and `cy()` methods on elements with native `x`, `y`, `width` and `height` attributes for better performance
- added `morph()` and `at()` methods to `SVG.Number` for unit morphing

# v1.0rc1 (31/01/2014)

- added `SVG.PathArray` for real path transformations
- removed `unbiased` system for paths
- enabled proportional resizing on `size()` method with `null` for either `width` or `height` values
- moved data module to separate file
- `data()` method now accepts object for for multiple key / value assignments
- added `bbox()` method to `SVG.Set`
- added `relative()` method for moves relative to the current position
- added `morph()` and `at()` methods to `SVG.Color` for color morphing

# v0.38 (28/01/2014)

- added `loop()` method to `SVG.FX`
- switched from `setInterval` to `requestAnimFrame` for animations

# v0.37 (26/01/2014)

- added `get()` to `SVG.Set`
- moved `SVG.PointArray` to a separate file

# v0.36 (25/01/2014)

- added `linkTo()`, `addTo()` and `putIn()` methods on `SVG.Element`
- provided more detailed documentation on parent elements

# v0.35 (23/01/2014)

- added `SVG.A` element with the `link()`

# v0.34 (23/01/2014)

- added `pause()` and `play()` to `SVG.FX`
- storing animation values in `situation` object

# v0.33 (22/01/2014)

- added `has()` method to `SVG.Set`
- added `width()` and `height()` as setter and getter methods on all shapes
- moved sub-pixel offset fix to be an optional method (e.g. `SVG('drawing').fixSubPixelOffset()`)
- added `replace()` method to elements
- added `radius()` method to `SVG.Rect` and `SVG.Ellipse`
- added reference to parent node in defs
- merged plotable.js and path.js

# v0.32

- added library to [cdnjs](http://cdnjs.com)