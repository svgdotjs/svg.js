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
- fix for arcs in patharray `toString()` method

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