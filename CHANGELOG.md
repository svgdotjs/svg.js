# v1.0rc2 (01/02/2014)

- added `index()` method to `SVG.Parent` and `SVG.Set`

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