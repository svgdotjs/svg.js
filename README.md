# SVG.js

A lightweight library for manipulating and animating SVG.

Svg.js has no dependencies and aims to be as small as possible.

Svg.js is licensed under the terms of the MIT License.

See [svgjs.com](http://svgjs.com) for an introduction, [documentation](http://documentup.com/wout/SVG.js) and [some action](http://svgjs.com/test).

## Usage

### Create an SVG document

Use the `SVG()` function to create an SVG document within a given html element:

```javascript
var draw = SVG('drawing').size(300, 300)
var rect = draw.rect(100, 100).attr({ fill: '#f06' })
```
The first argument can either be an id of the element or the selected element itself.
This will generate the following output:

```html
<div id="drawing">
  <svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" width="300" height="300">
    <rect width="100" height="100" fill="#f06"></rect>
  </svg>
</div>
```

By default the svg drawing follows the dimensions of its parent, in this case `#drawing`:

```javascript
var draw = SVG('drawing').size('100%', '100%')
```

### Checking for SVG support

By default this library assumes the client's browser supports SVG. You can test support as follows:

```javascript
if (SVG.supported) {
  var draw = SVG('drawing')
  var rect = draw.rect(100, 100)
} else {
  alert('SVG not supported')
}
```


### SVG document
Svg.js also works outside of the HTML DOM, inside an SVG document for example:

```xml
<?xml version="1.0" encoding="utf-8" ?>
<svg id="drawing" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" >
  <script type="text/javascript" xlink:href="svg.min.js"></script>
  <script type="text/javascript">
    <![CDATA[
      var draw = SVG('drawing')
      draw.rect(100,100).animate().fill('#f03').move(100,100)
    ]]>
  </script>
</svg>
```

### Sub-pixel offset fix
Call the `spof()` method to fix sub-pixel offset:

```javascript
var draw = SVG('drawing').spof()
```

To enable automatic sub-pixel offset correction when the window is resized:

```javascript
SVG.on(window, 'resize', function() { draw.spof() })
```

## Parent elements

### Main svg document
The main SVG.js initializer function creates a root svg node in the given element and returns an instance of `SVG.Doc`:

```javascript
var draw = SVG('drawing')
```

__`returns`: `SVG.Doc`__

_Javascript inheritance stack: `SVG.Doc` < `SVG.Container` < `SVG.Parent`_

### Nested svg
With this feature you can nest svg documents within each other. Nested svg documents have exactly the same features as the main, top-level svg document:

```javascript
var nested = draw.nested()

var rect = nested.rect(200, 200)
```

__`returns`: `SVG.Nested`__

_Javascript inheritance stack: `SVG.Nested` < `SVG.Container` < `SVG.Parent`_

### Groups
Grouping elements is useful if you want to transform a set of elements as if it were one. All element within a group maintain their position relative to the group they belong to. A group has all the same element methods as the root svg document:

```javascript
var group = draw.group()
group.path('M10,20L30,40')
```

Existing elements from the svg document can also be added to a group:

```javascript
group.add(rect)
```

__Note:__ Groups do not have a geometry of their own, it's inherited from their content. Therefore groups do not listen to `x`, `y`, `width` and `height` attributes. If that is what you are looking for, use a `nested()` svg instead.

__`returns`: `SVG.G`__

_Javascript inheritance stack: `SVG.G` < `SVG.Container` < `SVG.Parent`_

### Hyperlink
A hyperlink or `<a>` tag creates a container that enables a link on all children:

```javascript
var link = draw.link('http://svgjs.com')
var rect = link.rect(100, 100)
```

The link url can be updated with the `to()` method:

```javascript
link.to('http://apple.com')
```

Furthermore, the link element has a `show()` method to create the `xlink:show` attribute:

```javascript
link.show('replace')
```

And the `target()` method to create the `target` attribute:

```javascript
link.target('_blank')
```

Elements can also be linked the other way around with the `linkTo()` method:

```javascript
rect.linkTo('http://svgjs.com')
```

Alternatively a block can be passed instead of a url for more options on the link element:

```javascript
rect.linkTo(function(link) {
  link.to('http://svgjs.com').target('_blank')
})
```

__`returns`: `SVG.A`__

_Javascript inheritance stack: `SVG.A` < `SVG.Container` < `SVG.Parent`_

### Defs
The `<defs>` element is a container element for referenced elements. Elements that are descendants of a ‘defs’ are not rendered directly. The `<defs>` node lives in the main `<svg>` document and can be accessed with the `defs()` method:

```javascript
var defs = draw.defs()
```

The defs are also available on any other element through the `doc()` method:

```javascript
var defs = rect.doc().defs()
```

The defs node works exactly the same as groups.

__`returns`: `SVG.Defs`__

_Javascript inheritance stack: `SVG.Defs` < `SVG.Container` < `SVG.Parent`_

## Rect
Rects have two arguments, their `width` and `height`:

```javascript
var rect = draw.rect(100, 100)
```

__`returns`: `SVG.Rect`__

_Javascript inheritance stack: `SVG.Rect` < `SVG.Shape` < `SVG.Element`_

### radius()
Rects can also have rounded corners:

```javascript
rect.radius(10)
```

This will set the `rx` and `ry` attributes to `10`. To set `rx` and `ry` individually:

```javascript
rect.radius(10, 20)
```

__`returns`: `itself`__

## Circle
The only argument necessary for a circle is the diameter:

```javascript
var circle = draw.circle(100)
```

__`returns`: `SVG.Circle`__

_Javascript inheritance stack: `SVG.Circle` < `SVG.Shape` < `SVG.Element`_

### radius()
Circles can also be redefined by their radius:

```javascript
rect.radius(75)
```

__`returns`: `itself`__

## Ellipse
Ellipses, like rects, have two arguments, their `width` and `height`:

```javascript
var ellipse = draw.ellipse(200, 100)
```

__`returns`: `SVG.Ellipse`__

_Javascript inheritance stack: `SVG.Ellipse` < `SVG.Shape` < `SVG.Element`_

### radius()
Ellipses can also be redefined by their radii:

```javascript
rect.radius(75, 50)
```

__`returns`: `itself`__

## Line
Create a line from point A to point B:

```javascript
var line = draw.line(0, 0, 100, 150).stroke({ width: 1 })
```

Creating a line element can be done in four ways. Look at the `plot()` method to see all the possiblilities.

__`returns`: `SVG.Line`__

_Javascript inheritance stack: `SVG.Line` < `SVG.Shape` < `SVG.Element`_

### plot()
Updating a line is done with the `plot()` method:

```javascript
line.plot(50, 30, 100, 150)
```

Alternatively it also accepts a point string:

```javascript
line.plot('0,0 100,150')
```

Or a point array:

```javascript
line.plot([[0, 0], [100, 150]])
```

Or an instance of `SVG.PointArray`:

```javascript
var array = new SVG.PointArray([[0, 0], [100, 150]])
line.plot(array)
```

__`returns`: `itself`__

### array()
References the `SVG.PointArray` instance. This method is rather intended for internal use:

```javascript
polyline.array()
```

__`returns`: `SVG.PointArray`__


## Polyline
The polyline element defines a set of connected straight line segments. Typically, polyline elements define open shapes:

```javascript
// polyline('x,y x,y x,y')
var polyline = draw.polyline('0,0 100,50 50,100').fill('none').stroke({ width: 1 })
```

Polyline strings consist of a list of points separated by spaces: `x,y x,y x,y`.

As an alternative an array of points will work as well:

```javascript
// polyline([[x,y], [x,y], [x,y]])
var polyline = draw.polyline([[0,0], [100,50], [50,100]]).fill('none').stroke({ width: 1 })
```

__`returns`: `SVG.Polyline`__

_Javascript inheritance stack: `SVG.Polyline` < `SVG.Shape` < `SVG.Element`_

### plot()
Polylines can be updated using the `plot()` method:

```javascript
polyline.plot([[0,0], [100,50], [50,100], [150,50], [200,50]])
```

The `plot()` method can also be animated:

```javascript
polyline.animate(3000).plot([[0,0], [100,50], [50,100], [150,50], [200,50], [250,100], [300,50], [350,50]])
```

__`returns`: `itself`__

### array()
References the `SVG.PointArray` instance. This method is rather intended for internal use:

```javascript
polyline.array()
```

__`returns`: `SVG.PointArray`__

## Polygon
The polygon element, unlike the polyline element, defines a closed shape consisting of a set of connected straight line segments:

```javascript
// polygon('x,y x,y x,y')
var polygon = draw.polygon('0,0 100,50 50,100').fill('none').stroke({ width: 1 })
```

Polygon strings are exactly the same as polyline strings. There is no need to close the shape as the first and last point will be connected automatically.

__`returns`: `SVG.Polygon`__

_Javascript inheritance stack: `SVG.Polygon` < `SVG.Shape` < `SVG.Element`_

### plot()
Like polylines, polygons can be updated using the `plot()` method:

```javascript
polygon.plot([[0,0], [100,50], [50,100], [150,50], [200,50]])
```

The `plot()` method can also be animated:

```javascript
polygon.animate(3000).plot([[0,0], [100,50], [50,100], [150,50], [200,50], [250,100], [300,50], [350,50]])
```

__`returns`: `itself`__

### array()
References the `SVG.PointArray` instance. This method is rather intended for internal use:

```javascript
polygon.array()
```

__`returns`: `SVG.PointArray`__

## Path
The path string is similar to the polygon string but much more complex in order to support curves:

```javascript
draw.path('M 100 200 C 200 100 300  0 400 100 C 500 200 600 300 700 200 C 800 100 900 100 900 100')
```

__`returns`: `SVG.Path`__

_Javascript inheritance stack: `SVG.Path` < `SVG.Shape` < `SVG.Element`_

For more details on path data strings, please refer to the SVG documentation:
http://www.w3.org/TR/SVG/paths.html#PathData

### plot()
Paths can be updated using the `plot()` method:

```javascript
path.plot('M100,200L300,400')
```

__`returns`: `itself`__

### array()
References the `SVG.PathArray` instance. This method is rather intended for internal use:

```javascript
path.array()
```

__`returns`: `SVG.PathArray`__

## Image
Creating images is as you might expect:

```javascript
var image = draw.image('/path/to/image.jpg')
```

If you know the size of the image, those parameters can be passed as the second and third arguments:

```javascript
var image = draw.image('/path/to/image.jpg', 200, 300)
```

__`returns`: `SVG.Image`__

_Javascript inheritance stack: `SVG.Image` < `SVG.Shape` < `SVG.Element`_

### load()
Loading another image can be done with the `load()` method:

```javascript
image.load('/path/to/another/image.jpg')
```

__`returns`: `itself`__

### loaded()
If you don't know the size of the image, obviously you will have to wait for the image to be `loaded`:

```javascript
var image = draw.image('/path/to/image.jpg').loaded(function(loader) {
  this.size(loader.width, loader.height)
})
```

The returned `loader` object as first the argument of the loaded method contains four values:
- `width`
- `height`
- `ratio` (width / height)
- `url`

__`returns`: `itself`__


## Text
Unlike html, text in svg is much harder to tame. There is no way to create flowing text, so newlines should be entered manually. In SVG.js there are two ways to create text elements.

The first and easiest method is to provide a string of text, split by newlines:

```javascript
var text = draw.text("Lorem ipsum dolor sit amet consectetur.\nCras sodales imperdiet auctor.")
```

This will automatically create a block of text and insert newlines where necessary.

The second method will give you much more control but requires a bit more code:

```javascript
var text = draw.text(function(add) {
  add.tspan('Lorem ipsum dolor sit amet ').newLine()
  add.tspan('consectetur').fill('#f06')
  add.tspan('.')
  add.tspan('Cras sodales imperdiet auctor.').newLine().dx(20)
  add.tspan('Nunc ultrices lectus at erat').newLine()
  add.tspan('dictum pharetra elementum ante').newLine()
})
```

If you want to go the other way and don't want to add tspans at all, just one line of text, you can use the `plain()` method instead:

```javascript
var text = draw.plain('Lorem ipsum dolor sit amet consectetur.')
```

This is a shortcut to the `plain` method on the `SVG.Text` instance which doesn't render newlines at all.

_Javascript inheritance stack: `SVG.Text` < `SVG.Shape` < `SVG.Element`_

__`returns`: `SVG.Text`__

### text()
Changing text afterwards is also possible with the `text()` method:

```javascript
text.text('Brilliant!')
```

__`returns`: `itself`__

To get the raw text content:

```javascript
text.text()
```

__`returns`: `string`__

### tspan()
Just adding one tspan is also possible:

```javascript
text.tspan(' on a train...').fill('#f06')
```

__`returns`: `SVG.Tspan`__

### plain()
If the content of the element doesn't need any stying or multiple lines, it might be sufficient to just add some plain text:

```javascript
text.plain('I do not have any expectations.')
```

__`returns`: `itself`__

### font()
The sugar.js module provides some syntax sugar specifically for this element type:

```javascript
text.font({
  family:   'Helvetica'
, size:     144
, anchor:   'middle'
, leading:  '1.5em'
})
```

__`returns`: `itself`__

### leading()
As opposed to html, where leading is defined by `line-height`, svg does not have a natural leading equivalent. In svg, lines are not defined naturally. They are defined by `<tspan>` nodes with a `dy` attribute defining the line height and a `x` value resetting the line to the `x` position of the parent text element. But you can also have many nodes in one line defining a different `y`, `dy`, `x` or even `dx` value. This gives us a lot of freedom, but also a lot more responsibility. We have to decide when a new line is defined, where it starts, what its offset is and what it's height is. The `leading()` method in SVG.js tries to ease the pain by giving you behaviour that is much closer to html. In combination with newline separated text, it works just like html:

```javascript
var text = draw.text("Lorem ipsum dolor sit amet consectetur.\nCras sodales imperdiet auctor.")
text.leading(1.3)
```

This will render a text element with a tspan element for each line, with a `dy` value of `130%` of the font size.

Note that the `leading()` method assumes that every first level tspan in a text node represents a new line. Using `leading()` on text elements containing multiple tspans in one line (e.g. without a wrapping tspan defining a new line) will render scrambeled. So it is advisable to use this method with care, preferably only when throwing newline separated text at the text element or calling the `newLine()` method on every first level tspan added in the block passed as argument to the text element.

__`returns`: `itself`__

### build()
The `build()` can be used to enable / disable build mode. With build mode disabled, the `plain()` and `tspan()` methods will first call the `clear()` bethod before adding the new content. So when build mode is enabled, `plain()` and `tspan()` will append the new content to the existing content. When passing a block to the `text()` method, build mode is toggled automatically before and after the block is called. But in some cases it might be useful to be able to toggle it manually:


```javascript
var text = draw.text('This is just the start, ')

text.build(true)  // enables build mode

var tspan = text.tspan('something pink in the middle ').fill('#00ff97')
text.plain('and again boring at the end.')

text.build(false) // disables build mode

tspan.animate('2s').fill('#f06')
```

__`returns`: `itself`__

### rebuild()
This is an internal callback that probably never needs to be called manually. Basically it rebuilds the text element whenerver `font-size` and `x` attributes or the `leading()` of the text element are modified. This method also acts a setter to enable or disable rebuilding:

```javascript
text.rebuild(false) //-> disables rebuilding
text.rebuild(true)  //-> enables rebuilding and instantaneously rebuilds the text element
```

__`returns`: `itself`__

### clear()
Clear all the contents of the called text element:

```javascript
text.clear()
```

__`returns`: `itself`__

### length()
Gets the total computed text length of all tspans together:

```javascript
text.length()
```

__`returns`: `number`__


### lines()
All first level tspans can be referenced with the `lines()` method:

```javascript
text.lines()
```

This will return an intance of `SVG.Set` including all `tspan` elements.

__`returns`: `SVG.Set`__

### events
The text element has one event. It is fired every time the `rebuild()` method is called:

```javascript
text.on('rebuild', function() {
  // whatever you need to do after rebuilding
})
```

## Tspan
The tspan elements are only available inside text elements or inside other tspan elements. In SVG.js they have a class of their own:

_Javascript inheritance stack: `SVG.Tspan` < `SVG.Shape` < `SVG.Element`_

### text()
Update the content of the tspan. This can be done by either passing a string:


```javascript
tspan.text('Just a string.')
```

Which will basicly call the `plain()` method.

Or by passing a block to add more specific content inside the called tspan:

```javascript
tspan.text(function(add) {
  add.plain('Just plain text.')
  add.tspan('Fancy text wrapped in a tspan.').fill('#f06')
  add.tspan(function(addMore) {
    addMore.tspan('And you can doo deeper and deeper...')
  })
})
```

__`returns`: `itself`__

### tspan()
Add a nested tspan:

```javascript
tspan.tspan('I am a child of my parent').fill('#f06')
```

__`returns`: `SVG.Tspan`__

### plain()
Just adds some plain text:

```javascript
tspan.plain('I do not have any expectations.')
```

__`returns`: `itself`__

### dx()
Define the dynamic `x` value of the element, much like a html element with `position:relative` and `left` defined:

```javascript
tspan.dx(30)
```

__`returns`: `itself`__

### dy()
Define the dynamic `y` value of the element, much like a html element with `position:relative` and `top` defined:

```javascript
tspan.dy(30)
```

__`returns`: `itself`__

### newLine()
The `newLine()` is a convenience method for adding a new line with a `dy` attribute using the current "leading":

```javascript
var text = draw.text(function(add) {
  add.tspan('Lorem ipsum dolor sit amet ').newLine()
  add.tspan('consectetur').fill('#f06')
  add.tspan('.')
  add.tspan('Cras sodales imperdiet auctor.').newLine().dx(20)
  add.tspan('Nunc ultrices lectus at erat').newLine()
  add.tspan('dictum pharetra elementum ante').newLine()
})
```

__`returns`: `itself`__

### clear()
Clear all the contents of the called tspan element:

```javascript
tspan.clear()
```

__`returns`: `itself`__

### length()
Gets the total computed text length:

```javascript
tspan.length()
```

__`returns`: `number`__

## TextPath
A nice feature in svg is the ability to run text along a path:

```javascript
var text = draw.text(function(add) {
  add.tspan('We go ')
  add.tspan('up').fill('#f09').dy(-40)
  add.tspan(', then we go down, then up again').dy(40)
})
text
  .path('M 100 200 C 200 100 300 0 400 100 C 500 200 600 300 700 200 C 800 100 900 100 900 100')
  .font({ size: 42.5, family: 'Verdana' })
```

When calling the `path()` method on a text element, the text element is mutated into an intermediate between a text and a path element. From that point on the text element will also feature a `plot()` method to update the path:

```javascript
text.plot('M 300 500 C 200 100 300 0 400 100 C 500 200 600 300 700 200 C 800 100 900 100 900 100')
```

Attributes specific to the `<textPath>` element can be applied to the textPath instance itself:

```javascript
text.textPath().attr('startOffset', 0.5)
```

And they can be animated as well of course:

```javascript
text.textPath().animate(3000).attr('startOffset', 0.8)
```

__`returns`: `SVG.TextPath`__

_Javascript inheritance stack: `SVG.TextPath` < `SVG.Element`_

### textPath()
Referencing the textPath node directly:

```javascript
var textPath = text.textPath()
```

__`returns`: `SVG.TextPath`__

### track()
Referencing the linked path element directly:

```javascript
var path = text.track()
```

__`returns`: `SVG.Path`__

## Use
The use element simply emulates another existing element. Any changes on the master element will be reflected on all the `use` instances. The usage of `use()` is very straightforward:

```javascript
var rect = draw.rect(100, 100).fill('#f09')
var use  = draw.use(rect).move(200, 200)
```

In the case of the example above two rects will appear on the svg drawing, the original and the `use` instance. In some cases you might want to hide the original element. the best way to do this is to create the original element in the defs node:

```javascript
var rect = draw.defs().rect(100, 100).fill('#f09')
var use  = draw.use(rect).move(200, 200)
```

In this way the rect element acts as a library element. You can edit it but it won't be rendered.

Another way is to point an external SVG file, just specified the element `id` and path to file.

```javascript
var use  = draw.use('elementId', 'path/to/file.svg')
```

This way is usefull when you have complex images already created.
Note that, for external images (outside your domain) it may be necessary to load the file with XHR.

__`returns`: `SVG.Use`__

_Javascript inheritance stack: `SVG.Use` < `SVG.Shape` < `SVG.Element`_

## Symbol
Not unlike the `group` element, the `symbol` element is a container element. The only difference between symbols and groups is that symbols are not rendered. Therefore a `symbol` element is ideal in combination with the `use` element:

```javascript
var symbol = draw.symbol()
symbol.rect(100, 100).fill('#f09')

var use  = draw.use(symbol).move(200, 200)
```

__`returns`: `SVG.Bare`__

_Javascript inheritance stack: `SVG.Bare` < `SVG.Element` [with a shallow inheritance from `SVG.Parent`]_

## Bare
For all SVG elements that are not described by SVG.js, the `SVG.Bare` class comes in handy. This class inherits directly from `SVG.Element` and makes it possible to add custom methods in a separate namespace without polluting the main `SVG.Element` namespace. Consider it your personal playground.

### element()
The `SVG.Bare` class can be instantiated with the `element()` method on any parent element:

```javascript
var element = draw.element('title')
```
The string value passed as the first argument is the node name that should be generated.

Additionally any existing class name can be passed as the second argument to define from which class the element should inherit:

```javascript
var element = draw.element('symbol', SVG.Parent)
```

This gives you as the user a lot of power. But remember, with great power comes great responsibility.

__`returns`: `SVG.Bare`__

### words()
The `SVG.Bare` instance carries an additional method to add plain text:

```javascript
var element = draw.element('title').words('This is a title.')
//-> <title>This is a title.</title>
```

__`returns`: `itself`__

## Referencing elements

### By id
If you want to get an element created by SVG.js by its id, you can use the `SVG.get()` method:

```javascript
var element = SVG.get('my_element')

element.fill('#f06')
```

### Using CSS selectors
There are two ways to select elements using CSS selectors.

The first is to search globally. This will search in all svg elements in a document and return them in an instance of `SVG.Set`:

```javascript
var elements = SVG.select('rect.my-class').fill('#f06')
```

The second is to search within a parent element:

```javascript
var elements = group.select('rect.my-class').fill('#f06')
```

### Using jQuery or Zepto
Another way is to use [jQuery](http://jquery.com/) or [Zepto](http://zeptojs.com/). Here is an example:

```javascript
// add elements 
var draw   = SVG('drawing')
var group  = draw.group().addClass('my-group')
var rect   = group.rect(100,100).addClass('my-element')
var circle = group.circle(100).addClass('my-element').move(100, 100)

// get elements in group 
var elements = $('#drawing g.my-group .my-element').each(function() {
  this.instance.animate().fill('#f09')
})
```

## Circular reference
Every element instance within SVG.js has a reference to the actual `node`:

### node
```javascript
element.node
```
__`returns`: `node`__

### native()
The same can be achieved with the `native()` method:
```javascript
element.native()
```
__`returns`: `node`__


### instance
Similar, the node carries a reference to the SVG.js `instance`:

```javascript
node.instance
```
__`returns`: `element`__

## Parent reference
Every element has a reference to its parent with the `parent()` method:

### parent()

```javascript
element.parent()
```

__`returns`: `element`__

Alternatively a class or css selector can be passed as the first argument:

```javascript
var draw   = SVG('drawing')
var nested = draw.nested().addClass('test')
var group  = nested.group()
var rect   = group.rect(100, 100)

rect.parent()           //-> returns group
rect.parent(SVG.Doc)    //-> returns draw
rect.parent(SVG.Nested) //-> returns nested
rect.parent(SVG.G)      //-> returns group
rect.parent('.test')    //-> returns nested
```

__`returns`: `element`__

Even the main svg document:

```javascript
var draw = SVG('drawing')

draw.parent() //-> returns the wrappig html element with id 'drawing'
```

__`returns`: `HTMLNode`__


### doc()
For retrieving the root svg you can use `doc()`

```javascript
var draw = SVG('drawing')
var rect = draw.rect(100, 100)

rect.doc() //-> returns draw
```

### parents()
To get all ancestors of the element filtered by type or css selector (see `parent()` method)

```javascript
var group1 = draw.group().addClass('test')
  , group2 = group1.group()
  , rect   = group2.rect(100,100)
  
rect.parents()        // returns [group1, group2, draw]
rect.parents('.test') // returns [group1]
rect.parents(SVG.G)   // returns [group1, group2]
```

__`returns`: `Array`__

## Child references

### first()
To get the first child of a parent element:

```javascript
draw.first()
```
__`returns`: `element`__

### last()
To get the last child of a parent element:

```javascript
draw.last()
```
__`returns`: `element`__

### children()
An array of all children will can be retreives with the `children` method:

```javascript
draw.children()
```
__`returns`: `array`__

### each()
The `each()` allows you to iterate over the all children of a parent element:

```javascript
draw.each(function(i, children) {
  this.fill({ color: '#f06' })
})
```

Deep traversing is also possible by passing true as the second argument:

```javascript
// draw.each(block, deep)
draw.each(function(i, children) {
  this.fill({ color: '#f06' })
}, true)
```

Note that `this` refers to the current child element.

__`returns`: `itself`__

### has()
Checking the existence of an element within a parent:

```javascript
var rect  = draw.rect(100, 50)
var group = draw.group()

draw.has(rect)  //-> returns true
group.has(rect) //-> returns false
```
__`returns`: `boolean`__

### index()
Returns the index of given element and returns -1 when it is not a child:

```javascript
var rect  = draw.rect(100, 50)
var group = draw.group()

draw.index(rect)  //-> returns 0
group.index(rect) //-> returns -1
```
__`returns`: `number`__

### get()
Get an element on a given position in the children array:

```javascript
var rect   = draw.rect(20, 30)
var circle = draw.circle(50)

draw.get(0) //-> returns rect
draw.get(1) //-> returns circle
```
__`returns`: `element`__

### clear()
To remove all elements from a parent element:

```javascript
draw.clear()
```
__`returns`: `itself`__


## Import / export SVG

### svg()
Exporting the full generated SVG, or a part of it, can be done with the `svg()` method:

```javascript
draw.svg()
```

Exporting works on all elements.

Importing is done with the same method:

```javascript
draw.svg('<g><rect width="100" height="50" fill="#f06"></rect></g>')
```

Importing works on any element that inherits from `SVG.Parent`, which is basically every element that can contain other elements.

`getter`__`returns`: `string`__

`setter`__`returns`: `itself`__

## Attributes and styles

### attr()
You can get and set an element's attributes directly using `attr()`.

Get a single attribute:
```javascript
rect.attr('x')
```

Set a single attribute:
```javascript
rect.attr('x', 50)
```

Set multiple attributes at once:
```javascript
rect.attr({
  fill: '#f06'
, 'fill-opacity': 0.5
, stroke: '#000'
, 'stroke-width': 10
})
```

Set an attribute with a namespace:
```javascript
rect.attr('x', 50, 'http://www.w3.org/2000/svg')
```

Explicitly remove an attribute:
```javascript
rect.attr('fill', null)
```

`getter`__`returns`: `value`__

`setter`__`returns`: `itself`__


### style()
With the `style()` method the `style` attribute can be managed like attributes with `attr`:

```javascript
rect.style('cursor', 'pointer')
```

Multiple styles can be set at once using an object:

```javascript
rect.style({ cursor: 'pointer', fill: '#f03' })
```

Or a css string:

```javascript
rect.style('cursor:pointer;fill:#f03;')
```

Similar to `attr()` the `style()` method can also act as a getter:

```javascript
rect.style('cursor')
// => pointer
```

Or even a full getter:

```javascript
rect.style()
// => 'cursor:pointer;fill:#f03;'
```

Explicitly deleting individual style definitions works the same as with the `attr()` method:

```javascript
rect.style('cursor', null)
```

`getter`__`returns`: `value`__

`setter`__`returns`: `itself`__

### fill()
The `fill()` method is a pretty alternative to the `attr()` method:

```javascript
rect.fill({ color: '#f06', opacity: 0.6 })
```

A single hex string will work as well:

```javascript
rect.fill('#f06')
```

Last but not least, you can also use an image as fill, simply by passing an image url:

```javascript
rect.fill('images/shade.jpg')
```

Or if you want more control over the size of the image, you can pass an image instance as well:

```javascript
rect.fill(draw.image('images/shade.jpg', 20, 20))
```

__`returns`: `itself`__

### stroke()
The `stroke()` method is similar to `fill()`:

```javascript
rect.stroke({ color: '#f06', opacity: 0.6, width: 5 })
```

Like fill, a single hex string will work as well:

```javascript
rect.stroke('#f06')
```

Not unlike the `fill()` method, you can also use an image as stroke, simply by passing an image url:

```javascript
rect.stroke('images/shade.jpg')
```

Or if you want more control over the size of the image, you can pass an image instance as well:

```javascript
rect.stroke(draw.image('images/shade.jpg', 20, 20))
```

__`returns`: `itself`__

### opacity()
To set the overall opacity of an element:

```javascript
rect.opacity(0.5)
```

__`returns`: `itself`__

### reference()
In cases where an element is linked to another element through an attribute, the linked element instance can be fetched with the `reference()` method. The only thing required is the attribute name:

```javascript
use.reference('href') //-> returns used element instance
// or
rect.reference('fill') //-> returns gradient or pattern instance for example
// or
circle.reference('clip-path') //-> returns clip instance
```

### hide()
Hide element:

```javascript
rect.hide()
```

__`returns`: `itself`__

### show()
Show element:

```javascript
rect.show()
```

__`returns`: `itself`__

### visible()
To check if the element is visible:

```javascript
rect.visible()
```

__`returns`: `boolean`__

## Classes

### classes()
Fetches the css classes for the node as an array:

```javascript
rect.classes()
```

`getter`__`returns`: `array`__

### hasClass()
Test the presence of a given css class:

```javascript
rect.hasClass('purple-rain')
```

`getter`__`returns`: `boolean`__

### addClass()
Adds a given css class:

```javascript
rect.addClass('pink-flower')
```

`setter`__`returns`: `itself`__

### removeClass()
Removes a given css class:

```javascript
rect.removeClass('pink-flower')
```

`setter`__`returns`: `itself`__

### toggleClass()
Toggles a given css class:

```javascript
rect.toggleClass('pink-flower')
```

`setter`__`returns`: `itself`__

## Size and position

While positioning an element by directly setting its attributes works only if the attributes are used natively by that type of element, the positioning methods described below are much more convenient as they work for all element types.

For example, the following code works because each element is positioned by setting native attributes:

```javascript
rect.attr({ x: 20, y: 60 })
circle.attr({ cx: 50, cy: 40 })
```

The `rect` will be moved by its upper left corner to the new coordinates, and the `circle` will be moved by its center. However, trying to move a `circle` by its 'corner' or a `rect` by its center in this way will fail. The following lines will get silently ignored as the attributes that are addressed are not natively used by the element setting them:

```javascript
rect.attr({ cx: 20, cy: 60 })
circle.attr({ x: 50, y: 40 })
```

However, the positioning methods detailed below will work for all element types, regardless of whether the attributes being addressed are native to the type. So, unlike the lines above, these lines work just fine:

```javascript
rect.cx(20).cy(60)
circle.x(50).y(40)
```

It is important to note, though, that these methods are only intended for use with user (unitless) coordinates. If, for example, an element has its size set via percentages or other units, the positioning methods that address its native attributes will most likely still work, but the ones that address non-native attributes will give unexpected results -- as both getters and setters!


### size()
Set the size of an element to a given `width` and `height`:

```javascript
rect.size(200, 300)
```

Proportional resizing is also possible by leaving out `height`:

```javascript
rect.size(200)
```

Or by passing `null` as the value for `width`:

```javascript
rect.size(null, 200)
```

As with positioning, the size of an element could be set by using `attr()`. But because every type of element is handles its size differently the `size()` method is much more convenient.

There is one exception though: for `SVG.Text` elements, this method takes only one argument and applies the given value to the `font-size` attribute.

__`returns`: `itself`__

### width()
Set the width of an element:

```javascript
rect.width(200)
```

This method also acts as a getter:

```javascript
rect.width() //-> returns 200
```

`getter`__`returns`: `value`__

`setter`__`returns`: `itself`__

### height()
Set the height of an element:

```javascript
rect.height(325)
```

This method also acts as a getter:

```javascript
rect.height() //-> returns 325
```

`getter`__`returns`: `value`__

`setter`__`returns`: `itself`__

### radius()
Circles, ellipses, and rects may use the `radius()` method. On rects, it defines rounded corners.

For a circle, the argument sets the `r` attribute. 

```javascript
circle.radius(10)
```

For ellipses and rects, pass two arguments to set the `rx` and `ry` attributes individually. Or, pass a single argument, to make the two attributes equal.

```javascript
ellipse.radius(10, 20)
rect.radius(5)
```

_This functionality requires the sugar.js module which is included in the default distribution._

__`returns`: `itself`__

### move()
Move the element by its upper left corner to a given `x` and `y` position:

```javascript
rect.move(200, 350)
```

__`returns`: `itself`__

### x()
Move the element by its upper left corner along the x-axis only:

```javascript
rect.x(200)
```

Without an argument the `x()` method serves as a getter as well:

```javascript
rect.x() //-> returns 200
```

`getter`__`returns`: `value`__

`setter`__`returns`: `itself`__

### y()
Move the element by its upper left corner along the y-axis only:

```javascript
rect.y(350)
```

Without an argument the `y()` method serves as a getter as well:

```javascript
rect.y() //-> returns 350
```

`getter`__`returns`: `value`__

`setter`__`returns`: `itself`__

### center()
Move the element by its center to a given `cx` and `cy` position:

```javascript
rect.center(150, 150)
```

__`returns`: `itself`__

### cx()
Move the element by its center in the `x` direction only:

```javascript
rect.cx(200)
```

Without an argument the `cx()` method serves as a getter as well:

```javascript
rect.cx() //-> returns 200
```

`getter`__`returns`: `value`__

`setter`__`returns`: `itself`__

### cy()
Move the element by its center in the `y` direction only:

```javascript
rect.cy(350)
```

Without an argument the `cy()` method serves as a getter as well:

```javascript
rect.cy() //-> returns 350
```

`getter`__`returns`: `value`__

`setter`__`returns`: `itself`__

### dmove()
Shift the element in both the `x` and `y` directions relative to its current position:

```javascript
rect.dmove(10, 30)
```

__`returns`: `itself`__

### dx()
Shift the element in the `x` direction relative to its current position:

```javascript
rect.dx(200)
```

__`returns`: `itself`__

### dy()
Shift the element in the `y` direction relative to its current position:

```javascript
rect.dy(200)
```

__`returns`: `itself`__

## Document tree manipulations

### clone()
To make an exact copy of an element the `clone()` method comes in handy:

```javascript
var clone = rect.clone()
```

__`returns`: `element`__

This will create a new, unlinked copy. For making a linked clone, see the [use](#use) element.

### remove()
Removes the calling element from the svg document:

```javascript
rect.remove()
```

__`returns`: `itself`__

### replace()
At the calling element's position in the svg document, replace the calling element with the element passed to the method.

```javascript
rect.replace(draw.circle(100))
```

__`returns`: `element`__


### add()
Sets the calling element as the parent node of the argument. Returns the parent:

```javascript
var rect = draw.rect(100, 100)
var group = draw.group()

group.add(rect) //-> returns group
```

__`returns`: `itself`__

### put()
Sets the calling element as the parent node of the argument. Returns the child:

```javascript
group.put(rect) //-> returns rect
```

__`returns`: `element`__

### addTo()
Sets the calling element as a child node of the argument. Returns the child:

```javascript
rect.addTo(group) //-> returns rect
```

__`returns`: `itself`__

### putIn()
Sets the calling element as a child node of the argument. Returns the parent:

```javascript
rect.putIn(group) //-> returns group
```

__`returns`: `element`__

### toParent()
Moves an element to a different parent (similar to `addTo`), but without changing its visual representation. All transformations are merged and applied to the element.

```javascript
rect.toParent(group) // looks the same as before
```

__`returns`: `itself`__

### toDoc()
Same as `toParent()` but with the root-node as parent

__`returns`: `itself`__

### ungroup() / flatten()
Break up a group/container and move all the elements to a given parent node without changing their visual representations. The result is a flat svg structure, e.g. for exporting.

```javascript
// ungroups all elements in this group recursively and places them into the given parent
// (default: parent container of the calling element)
group.ungroup(parent, depth)

// call it on the whole document to get a flat svg structure
drawing.ungroup()

// breaks up the group and places all elements in drawing
group.ungroup(drawing)

// breaks up all groups until it reaches a depth of 3
drawing.ungroup(null, 3)

// flat and export svg
var svgString = drawing.ungroup().svg()
```

__`returns`: `itself`__


## Transforms

### transform()

The `transform()` method acts as a full getter without an argument:

```javascript
element.transform()
```

The returned __`object`__ contains the following values:

- `x` (translation on the x-axis)
- `y` (translation on the y-axis)
- `skewX` (calculated skew on x-axis)
- `skewY` (calculated skew on y-axis)
- `scaleX` (calculated scale on x-axis)
- `scaleY` (calculated scale on y-axis)
- `rotation` (calculated rotation)
- `cx` (last used rotation centre on x-axis)
- `cy` (last used rotation centre on y-axis)

Additionally a string value for the required property can be passed:

```javascript
element.transform('rotation')
```

In this case the returned value is a __`number`__.


As a setter it has two ways of working. By default transformations are absolute. For example, if you call:

```javascript
element.transform({ rotation: 125 }).transform({ rotation: 37.5 })
```

The resulting rotation will be `37.5` and not the sum of the two transformations. But if that's what you want there is a way out by adding the `relative` parameter. That would be:


```javascript
element.transform({ rotation: 125 }).transform({ rotation: 37.5, relative: true })
```

Alternatively a relative flag can be passed as the second argument:

```javascript
element.transform({ rotation: 125 }).transform({ rotation: 37.5 }, true)
```

Available transformations are:

- `rotation` with optional `cx` and `cy`
- `scale` with optional `cx` and `cy`
- `scaleX` with optional `cx` and `cy`
- `scaleY` with optional `cx` and `cy`
- `skewX` with optional `cx` and `cy`
- `skewY` with optional `cx` and `cy`
- `x`
- `y`
- `a`, `b`, `c`, `d`, `e` and/or `f` or an existing matrix instead of the object

`getter`__`returns`: `value`__

`setter`__`returns`: `itself`__

### rotate()
The `rotate()` method will automatically rotate elements according to the center of the element:

```javascript
// rotate(degrees)
rect.rotate(45)
```

Although you can also define a specific rotation point:

```javascript
// rotate(degrees, cx, cy)
rect.rotate(45, 50, 50)
```

__`returns`: `itself`__

### skew()
The `skew()` method will take an `x` and `y` value:

```javascript
// skew(x, y)
rect.skew(0, 45)
```

__`returns`: `itself`__

### scale()
The `scale()` method will take an `x` and `y` value:

```javascript
// scale(x, y)
rect.scale(0.5, -1)
```

__`returns`: `itself`__

### translate()
The `translate()` method will take an `x` and `y` value:

```javascript
// translate(x, y)
rect.translate(0.5, -1)
```


## Geometry

### viewbox()

The `viewBox` attribute of an `<svg>` element can be managed with the `viewbox()` method. When supplied with four arguments it will act as a setter:

```javascript
draw.viewbox(0, 0, 297, 210)
```

Alternatively you can also supply an object as the first argument:

```javascript
draw.viewbox({ x: 0, y: 0, width: 297, height: 210 })
```

Without any arguments an instance of `SVG.ViewBox` will be returned:

```javascript
var box = draw.viewbox()
```

But the best thing about the `viewbox()` method is that you can get the zoom of the viewbox:

```javascript
var box = draw.viewbox()
var zoom = box.zoom
```

If the size of the viewbox equals the size of the svg drawing, the zoom value will be 1.

`getter`__`returns`: `SVG.ViewBox`__

`setter`__`returns`: `itself`__

### bbox()
Get the bounding box of an element. This is a wrapper for the native `getBBox()` method but adds more values:

```javascript
path.bbox()
```

This will return an instance of `SVG.BBox` containing the following values:

- `width` (value from native `getBBox`)
- `height` (value from native `getBBox`)
- `w` (shorthand for `width`)
- `h` (shorthand for `height`)
- `x` (value from native `getBBox`) 
- `y` (value from native `getBBox`)
- `cx` (center `x` of the bounding box)
- `cy` (center `y` of the bounding box)
- `x2` (lower right `x` of the bounding box)
- `y2` (lower right `y` of the bounding box)

The `SVG.BBox` has one other nifty little feature, enter the `merge()` method. With `merge()` two `SVG.BBox` instances can be merged into one new instance, basically being the bounding box of the two original bounding boxes:

```javascript
var box1 = draw.rect(100,100).move(50,50)
var box2 = draw.rect(100,100).move(200,200)
var box3 = box1.merge(box2)
```

__`returns`: `SVG.BBox`__

### tbox()
Where `bbox()` returns a bounding box mindless of any transformations, the `tbox()` method does take transformations into account. So any translation or scale will be applied to the resulting values to get closer to the actual visual representation:

```javascript
path.tbox()
```

This will return an instance of `SVG.TBox` containing the following values:

- `width` (value from native getBBox influenced by the `scaleX` of the current matrix)
- `height` (value from native getBBox influenced by the `scaleY` of the current matrix)
- `w` (shorthand for `width`)
- `h` (shorthand for `height`)
- `x` (value from native getBBox influenced by the `x` of the current matrix)
- `y` (value from native getBBox influenced by the `y` of the current matrix)
- `cx` (center `x` of the bounding box)
- `cy` (center `y` of the bounding box)
- `x2` (lower right `x` of the bounding box)
- `y2` (lower right `y` of the bounding box)

Note that the rotation of the element will not be added to the calculation.

__`returns`: `SVG.TBox`__

### rbox()
Is similar to `bbox()` but will give you the box around the exact visual representation of the element, taking all transformations into account.

```javascript
path.rbox()
```

This will return an instance of `SVG.RBox` containing the following values:

- `width` (the actual visual width)
- `height` (the actual visual height)
- `w` (shorthand for `width`)
- `h` (shorthand for `height`)
- `x` (the actual visual position on the x-axis)
- `y` (the actual visual position on the y-axis)
- `cx` (center `x` of the bounding box)
- `cy` (center `y` of the bounding box)
- `x2` (lower right `x` of the bounding box)
- `y2` (lower right `y` of the bounding box)

__Important__: Mozilla browsers include stroke widths where other browsers do not. Therefore the resulting box might be different in Mozilla browsers. It is very hard to modify this behavior so for the time being this is an inconvenience we have to live with.

__`returns`: `SVG.RBox`__

### ctm()
Retreives the current transform matrix of the element relative to the nearest viewport parent:

```javascript
path.ctm()
```

__`returns`: `SVG.Matrix`__

### screenCTM()
Retreives the current transform matrix of the element relative to the screen:

```javascript
path.screenCTM()
```

__`returns`: `SVG.Matrix`__

### matrixify()
Merges all transformations of the element into one single matrix which is returned

```javascript
path.matrixify()
```

__`returns`: `SVG.Matrix`__


### inside()
To check if a given point is inside the bounding box of an element you can use the `inside()` method:

```javascript
var rect = draw.rect(100, 100).move(50, 50)

rect.inside(25, 30) //-> returns false
rect.inside(60, 70) //-> returns true
```

Note: the `x` and `y` positions are tested against the relative position of the element. Any offset on the parent element is not taken into account.

__`returns`: `boolean`__

### length()
Get the total length of a path element:

```javascript
var length = path.length()
```

__`returns`: `number`__

### pointAt()
Get point on a path at given length:

```javascript
var point = path.pointAt(105) //-> returns { x : 96.88497924804688, y : 58.062747955322266 }
```

__`returns`: `object`__


## Animating elements

### Animatable method chain
Note that the `animate()` method will not return the targeted element but an instance of SVG.FX which will take the following methods:

Of course `attr()`:
```javascript
rect.animate().attr({ fill: '#f03' })
```

The `x()`, `y()` and `move()` methods:
```javascript
rect.animate().move(100, 100)
```

And the `cx()`, `cy()` and `center()` methods:
```javascript
rect.animate().center(200, 200)
```

If you include the sugar.js module, `fill()`, `stroke()`, `rotate()`, `skew()`, `scale()`, `matrix()`, `opacity()`, `radius()` will be available as well:
```javascript
rect.animate().rotate(45).skew(25, 0)
```

You can also animate non-numeric unit values using the `attr()` method:
```javascript
rect.attr('x', '10%').animate().attr('x', '50%')
```

### easing
All available ease types are:

- `<>`: ease in and out
- `>`: ease out
- `<`: ease in
- `-`: linear
- `=`: external control
- a function

For the latter, here is an example of the default `<>` function:

```javascript
function(pos) { return (-Math.cos(pos * Math.PI) / 2) + 0.5 }
```

For more easing equations, have a look at the [svg.easing.js](https://github.com/wout/svg.easing.js) plugin.

### animate()
Animating elements is very much the same as manipulating elements, the only difference is you have to include the `animate()` method:

```javascript
rect.animate().move(150, 150)
```

The `animate()` method will take three arguments. The first is `duration`, the second `ease` and the third `delay`:

```javascript
rect.animate(2000, '>', 1000).attr({ fill: '#f03' })
```

Alternatively you can pass an object as the first argument:

```javascript
rect.animate({ ease: '<', delay: '1.5s' }).attr({ fill: '#f03' })
```

By default `duration` will be set to `1000`, `ease` will be set to `<>`.

__`returns`: `SVG.FX`__


### pause()
Pausing an animations is fairly straightforward:

```javascript
rect.animate().move(200, 200)

rect.mouseover(function() { this.pause() })
```

__`returns`: `itself`__

### play()
Will start playing a paused animation:

```javascript
rect.animate().move(200, 200)

rect.mouseover(function() { this.pause() })
rect.mouseout(function() { this.play() })
```
__`returns`: `itself`__

### stop()
Animations can be stopped in two ways.

By calling the `stop()` method:
```javascript
rect.animate().move(200, 200)

rect.stop()
```

Or by invoking another animation:
```javascript
rect.animate().move(200, 200)

rect.animate().center(200, 200)
```

By calling `stop()`, the transition is left at its current position. By passing `true` as the first argument to `stop()`, the animation will be fulfilled instantly:

```javascript
rect.animate().move(200, 200)

rect.stop(true)
```

Stopping an animation is irreversable.

__`returns`: `itself`__

### during()
If you want to perform your own actions during the animations you can use the `during()` method:

```javascript
var position
  , from = 100
  , to   = 300

rect.animate(3000).move(100, 100).during(function(pos) {
  position = from + (to - from) * pos 
})
```
Note that `pos` is `0` in the beginning of the animation and `1` at the end of the animation.

To make things easier a morphing function is passed as the second argument. This function accepts a `from` and `to` value as the first and second argument and they can be a number, unit or hex color:

```javascript
var ellipse = draw.ellipse(100, 100).attr('cx', '20%').fill('#333')

rect.animate(3000).move(100, 100).during(function(pos, morph) {
  // numeric values
  ellipse.size(morph(100, 200), morph(100, 50))
  
  // unit strings
  ellipse.attr('cx', morph('20%', '80%'))
  
  // hex color strings
  ellipse.fill(morph('#333', '#ff0066'))
})
```

__`returns`: `SVG.FX`__

### loop()
By default the `loop()` method creates and eternal loop:

```javascript
rect.animate(3000).move(100, 100).loop()
```

But the loop can also be a predefined number of times:

```javascript
rect.animate(3000).move(100, 100).loop(3)
```

Loops go from beginning to end and start over again (`0->1.0->1.0->1.`).

There is also a reverse flag that should be passed as the second argument:

```javascript
rect.animate(3000).move(100, 100).loop(3, true)
```

Loops will then be completely reversed before starting over (`0->1->0->1->0->1.`).

__`returns`: `SVG.FX`__

### after()
Finally, you can add callback methods using `after()`:

```javascript
rect.animate(3000).move(100, 100).after(function() {
  this.animate().attr({ fill: '#f06' })
})
```

Note that the `after()` method will never be called if the animation is looping eternally. 

__`returns`: `SVG.FX`__

### at()
Say you want to control the position of an animation with an external event, then the `at()` method will proove very useful:

```javascript
var animation = draw.rect(100, 100).move(50, 50).animate('=').move(200, 200)

document.onmousemove = function(event) {
  animation.at(event.clientX / 1000)
}
```

In order to be able to use the `at()` method, the duration of the animation should be set to `'='`. The value passed as the first argument of `at()` should be a number between `0` and `1`, `0` being the beginning of the animation and `1` being the end. Note that any values below `0` and above `1` will be normalized.

_This functionality requires the fx.js module which is included in the default distribution._

__`returns`: `SVG.FX`__


### situation
The current situation of an animation is stored in the `situation` object:

```javascript
rect.animate(3000).move(100, 100)
rect.fx.situation //-> everything is in here
```

Available values are:

- `start` (start time as a number in milliseconds)
- `play` (animation playing or not; `true` or `false`)
- `pause` (time when the animation was last paused)
- `duration` (the chosen duration of the animation)
- `ease` (the chosen easing calculation)
- `finish` (start + duration)
- `loop` (the current loop; counting down if a number; `true`, `false` or a number)
- `loops` (if a number, the total number loops; `true`, `false` or a number)
- `reverse` (whether or not the loop should be reversed; `true` or `false`)
- `reversing` (`true` if the loop is currently reversing, otherwise `false`)
- `during` (the function that should be called on every keyframe)
- `after` (the function that should be called after completion)


## Masking elements

### maskWith()
The easiest way to mask is to use a single element:

```javascript
var ellipse = draw.ellipse(80, 40).move(10, 10).fill({ color: '#fff' })

rect.maskWith(ellipse)
```

__`returns`: `itself`__

### mask()
But you can also use multiple elements:

```javascript
var ellipse = draw.ellipse(80, 40).move(10, 10).fill({ color: '#fff' })
var text = draw.text('SVG.JS').move(10, 10).font({ size: 36 }).fill({ color: '#fff' })

var mask = draw.mask().add(text).add(ellipse)

rect.maskWith(mask)
```

If you want the masked object to be rendered at 100% you need to set the fill color of the masking object to white. But you might also want to use a gradient:

```javascript
var gradient = draw.gradient('linear', function(stop) {
  stop.at({ offset: 0, color: '#000' })
  stop.at({ offset: 1, color: '#fff' })
})

var ellipse = draw.ellipse(80, 40).move(10, 10).fill({ color: gradient })

rect.maskWith(ellipse)
```

__`returns`: `SVG.Mask`__

### unmask()
Unmasking the elements can be done with the `unmask()` method:

```javascript
rect.unmask()
```

The `unmask()` method returns the masking element.

__`returns`: `itself`__

### remove()
Removing the mask alltogether will also `unmask()` all masked elements as well:

```javascript
mask.remove()
```

__`returns`: `itself`__

### masker
For your convenience, the masking element is also referenced in the masked element. This can be useful in case you want to change the mask:

```javascript
rect.masker.fill('#fff')
```

_This functionality requires the mask.js module which is included in the default distribution._


## Clipping elements
Clipping elements works exactly the same as masking elements. The only difference is that clipped elements will adopt the geometry of the clipping element. Therefore events are only triggered when entering the clipping element whereas with masks the masked element triggers the event. Another difference is that masks can define opacity with their fill color and clipPaths don't.

### clipWith()
```javascript
var ellipse = draw.ellipse(80, 40).move(10, 10)

rect.clipWith(ellipse)
```

__`returns`: `itself`__

### clip()
Clip multiple elements:

```javascript
var ellipse = draw.ellipse(80, 40).move(10, 10)
var text = draw.text('SVG.JS').move(10, 10).font({ size: 36 })

var clip = draw.clip().add(text).add(ellipse)

rect.clipWith(clip)
```

__`returns`: `SVG.ClipPath`__

### unclip()
Unclipping the elements can be done with the `unclip()` method:

```javascript
rect.unclip()
```

__`returns`: `itself`__

### remove()
Removing the clip alltogether will also `unclip()` all clipped elements as well:

```javascript
clip.remove()
```

__`returns`: `itself`__

### clipper
For your convenience, the clipping element is also referenced in the clipped element. This can be useful in case you want to change the clipPath:

```javascript
rect.clipper.move(10, 10)
```

_This functionality requires the clip.js module which is included in the default distribution._


## Arranging elements
You can arrange elements within their parent SVG document using the following methods.

### front()
Move element to the front:

```javascript
rect.front()
```

__`returns`: `itself`__

### back()
Move element to the back:

```javascript
rect.back()
```

__`returns`: `itself`__

### forward()
Move element one step forward:

```javascript
rect.forward()
```

__`returns`: `itself`__

### backward()
Move element one step backward:

```javascript
rect.backward()
```

__`returns`: `itself`__

### siblings()
The arrange.js module brings some additional methods. To get all siblings of rect, including rect itself:

```javascript
rect.siblings()
```

__`returns`: `array`__

### position()
Get the position (a number) of rect between its siblings:

```javascript
rect.position()
```

__`returns`: `number`__

### next()
Get the next sibling:

```javascript
rect.next()
```

__`returns`: `element`__

### previous()
Get the previous sibling:

```javascript
rect.previous()
```

__`returns`: `element`__

### before()
Insert an element before another:

```javascript
// inserts circle before rect
rect.before(circle)
```

__`returns`: `itself`__

### after()
Insert an element after another:

```javascript
// inserts circle after rect
rect.after(circle)
```

__`returns`: `itself`__

_This functionality requires the arrange.js module which is included in the default distribution._


## Sets
Sets are very useful if you want to modify or animate multiple elements at once. A set will accept all the same methods accessible on individual elements, even the ones that you add with your own plugins! Creating a set is exactly as you would expect:

```javascript
// create some elements
var rect = draw.rect(100,100)
var circle = draw.circle(100).move(100,100).fill('#f09')

// create a set and add the elements
var set = draw.set()
set.add(rect).add(circle)

// change the fill of all elements in the set at once
set.fill('#ff0')
```

A single element can be a member of many sets. Sets also don't have a structural representation, in fact they are just fancy array's.

### add()
Add an element to a set:

```javascript
set.add(rect)
```

Quite a useful feature of sets is the ability to accept multiple elements at once:

```javascript
set.add(rect, circle)
```

__`returns`: `itself`__

### each()
Iterating over all members in a set is the same as with svg containers:

```javascript
set.each(function(i) {
  this.attr('id', 'shiny_new_id_' + i)
})
```

Note that `this` refers to the current child element.

__`returns`: `itself`__

### has()
Determine if an element is member of the set:

```javascript
set.has(rect)
```

__`returns`: `boolean`__

### index()
Returns the index of a given element in the set.

```javascript
set.index(rect) //-> -1 if element is not a member
```

__`returns`: `number`__

### get()
Gets the element at a given index:

```javascript
set.get(1)
```

__`returns`: `element`__

### first()
Gets the first element:

```javascript
set.first()
```

__`returns`: `element`__

### last()
Gets the last element:

```javascript
set.last()
```

__`returns`: `element`__

### bbox()
Get the bounding box of all elements in the set:

```javascript
set.bbox()
```

__`returns`: `SVG.BBox`__

### remove()
To remove an element from a set:

```javascript
set.remove(rect)
```

__`returns`: `itself`__

### clear()
Or to remove all elements from a set:

```javascript
set.clear()
```

__`returns`: `itself`__

### animate()
Sets work with animations as well:

```javascript
set.animate(3000).fill('#ff0')
```

__`returns`: `SVG.SetFX`__


## Gradient

### gradient()
There are linear and radial gradients. The linear gradient can be created like this:

```javascript
var gradient = draw.gradient('linear', function(stop) {
  stop.at(0, '#333')
  stop.at(1, '#fff')
})
```

__`returns`: `SVG.Gradient`__

### at()
The `offset` and `color` parameters are required for stops, `opacity` is optional. Offset is float between 0 and 1, or a percentage value (e.g. `33%`). 

```javascript
stop.at(0, '#333')
```

or

```javascript
stop.at({ offset: 0, color: '#333', opacity: 1 })
```

__`returns`: `itself`__

### from()
To define the direction you can set from `x`, `y` and to `x`, `y`:

```javascript
gradient.from(0, 0).to(0, 1)
```

The from and to values are also expressed in percent.

__`returns`: `itself`__

### to()
To define the direction you can set from `x`, `y` and to `x`, `y`:

```javascript
gradient.from(0, 0).to(0, 1)
```

The from and to values are also expressed in percent.

__`returns`: `itself`__

### radius()
Radial gradients have a `radius()` method to define the outermost radius to where the inner color should develop:

```javascript
var gradient = draw.gradient('radial', function(stop) {
  stop.at(0, '#333')
  stop.at(1, '#fff')
})

gradient.from(0.5, 0.5).to(0.5, 0.5).radius(0.5)
```

__`returns`: `itself`__

### update()
A gradient can also be updated afterwards:

```javascript
gradient.update(function(stop) {
  stop.at(0.1, '#333', 0.2)
  stop.at(0.9, '#f03', 1)
})
```

And even a single stop can be updated:

```javascript
var s1, s2, s3

draw.gradient('radial', function(stop) {
  s1 = stop.at(0, '#000')
  s2 = stop.at(0.5, '#f03')
  s3 = stop.at(1, '#066')
})

s1.update(0.1, '#0f0', 1)
```

__`returns`: `itself`__

### get()
The `get()` method makes it even easier to get a stop from an existing gradient:

```javascript
var gradient = draw.gradient('radial', function(stop) {
  stop.at({ offset: 0, color: '#000', opacity: 1 })   // -> first
  stop.at({ offset: 0.5, color: '#f03', opacity: 1 }) // -> second
  stop.at({ offset: 1, color: '#066', opacity: 1 })   // -> third
})

var s1 = gradient.get(0) // -> returns "first" stop
```

__`returns`: `SVG.Stop`__

### fill()
Finally, to use the gradient on an element:

```javascript
rect.attr({ fill: gradient })
```

Or:

```javascript
rect.fill(gradient)
```

By passing the gradient instance as the fill on any element, the `fill()` method will be called:

```javascript
gradient.fill() //-> returns 'url(#SvgjsGradient1234)'
```

[W3Schools](http://www.w3schools.com/svg/svg_grad_linear.asp) has a great example page on how
[linear gradients](http://www.w3schools.com/svg/svg_grad_linear.asp) and
[radial gradients](http://www.w3schools.com/svg/svg_grad_radial.asp) work.

_This functionality requires the gradient.js module which is included in the default distribution._

__`returns`: `value`__


## Pattern

### pattern()
Creating a pattern is very similar to creating gradients:

```javascript
var pattern = draw.pattern(20, 20, function(add) {
  add.rect(20,20).fill('#f06')
  add.rect(10,10)
  add.rect(10,10).move(10,10)
})
```

This creates a checkered pattern of 20 x 20 pixels. You can add any available element to your pattern.

__`returns`: `SVG.Pattern`__


### update()
A pattern can also be updated afterwards:

```javascript
pattern.update(function(add) {
  add.circle(15).center(10,10)
})
```

__`returns`: `itself`__


### fill()
Finally, to use the pattern on an element:

```javascript
rect.attr({ fill: pattern })
```

Or:

```javascript
rect.fill(pattern)
```

By passing the pattern instance as the fill on any element, the `fill()` method will be called on th pattern instance:

```javascript
pattern.fill() //-> returns 'url(#SvgjsPattern1234)'
```

__`returns`: `value`__


## Marker

### marker()
Markers can be added to every individual point of a `line`, `polyline`, `polygon` and `path`. There are three types of markers: `start`, `mid` and `end`. Where `start` represents the first point, `end` the last and `mid` every point in between.

```javascript
var path = draw.path('M 100 200 C 200 100 300  0 400 100 C 500 200 600 300 700 200 C 800 100 900 100 900 100z')

path.fill('none').stroke({ width: 1 })

path.marker('start', 10, 10, function(add) {
  add.circle(10).fill('#f06')
})
path.marker('mid', 10, 10, function(add) {
  add.rect(10, 10)
})
path.marker('end', 20, 20, function(add) {
  add.circle(6).center(4, 5)
  add.circle(6).center(4, 15)
  add.circle(6).center(16, 10)

  this.fill('#0f6')
})
```

The `marker()` method can be used in three ways. Firstly, a marker can be created on any container element (e.g. svg, nested, group, ...). This is useful if you plan to reuse the marker many times so it will create a marker in the defs but not show it yet:

```javascript
var marker = draw.marker(10, 10, function(add) {
  add.rect(10, 10)
})
```

Secondly a marker can be created and applied directly on its target element:

```javascript
path.marker('start', 10, 10, function(add) {
  add.circle(10).fill('#f06')
})
```

This will create a marker in the defs and apply it directly. Note that the first argument defines the position of the marker and that there are four arguments as opposed to three with the first example.

Lastly, if a marker is created for reuse on a container element, it can be applied directly on the target element:

```javascript
path.marker('mid', marker)
```

Finally, to get a marker instance from the target element reference:

```javascript
path.reference('marker-end')
```


### ref()
By default the `refX` and `refY` attributes of a marker are set to respectively half the `width` nd `height` values. To define the `refX` and `refY` of a marker differently:

```javascript
marker.ref(2, 7)
```

__`returns`: `itself`__

### update()
Updating the contents of a marker will `clear()` the existing content and add the content defined in the block passed as the first argument:

```javascript
marker.update(function(add) {
  add.circle(10)
})
```

__`returns`: `itself`__

### width()
Defines the `markerWidth` attribute:

```javascript
marker.width(10)
```

__`returns`: `itself`__

### height()
Defines the `markerHeight` attribute:

```javascript
marker.height(10)
```

__`returns`: `itself`__

### size()
Defines the `markerWidth` and `markerHeight` attributes:

```javascript
marker.size(10, 10)
```

__`returns`: `itself`__


## Data

### Setting
The `data()` method allows you to bind arbitrary objects, strings and numbers to SVG elements:

```javascript
rect.data('key', { value: { data: 0.3 }})
```

Or set multiple values at once:

```javascript
rect.data({
  forbidden: 'fruit'
, multiple: {
    values: 'in'
  , an: 'object'
  }
})
```

__`returns`: `itself`__

### Getting
Fetching the values is similar to the `attr()` method:

```javascript
rect.data('key')
```

__`returns`: `itself`__

### Removing
Removing the data altogether:

```javascript
rect.data('key', null)
```

__`returns`: `itself`__

### Sustaining data types
Your values will always be stored as JSON and in some cases this might not be desirable. If you want to store the value as-is, just pass true as the third argument:

```javascript
rect.data('key', 'value', true)
```

__`returns`: `itself`__


## Memory

### remember() 
Storing data in-memory is very much like setting attributes:

```javascript
rect.remember('oldBBox', rect.bbox())
```

Multiple values can also be remembered at once:

```javascript
rect.remember({
  oldFill:    rect.attr('fill')
, oldStroke:  rect.attr('stroke')
})
```

To retrieve a memory

```javascript
rect.remember('oldBBox')
```

__`returns`: `itself`__

### forget()
Erasing a single memory:

```javascript
rect.forget('oldBBox')
```

Or erasing multiple memories at once:


```javascript
rect.forget('oldFill', 'oldStroke')
```

And finally, just erasing the whole memory:

```javascript
rect.forget()
```

__`returns`: `itself`__

## Events

### Basic events
Events can be bound to elements as follows:

```javascript
rect.click(function() {
  this.fill({ color: '#f06' })
})
```

Removing it is quite as easy:

```javascript
rect.click(null)
```

All available events are: `click`, `dblclick`, `mousedown`, `mouseup`, `mouseover`, `mouseout`, `mousemove`, `touchstart`, `touchmove`, `touchleave`, `touchend` and `touchcancel`.

__`returns`: `itself`__

### Event listeners
You can also bind event listeners to elements:

```javascript
var click = function() {
  this.fill({ color: '#f06' })
}

rect.on('click', click)
```

**Note:** The context of `this` in the callback is bound to the element. You can change this context by applying your own object:

```javascript
rect.on('click', click, window) // context of this is window
```

__`returns`: `itself`__

Unbinding events is just as easy:

```javascript
rect.off('click', click)
```

Or to unbind all listeners for a given event:

```javascript
rect.off('click')
```

Or even unbind all listeners for all events:

```javascript
rect.off()
```

__`returns`: `itself`__

But there is more to event listeners. You can bind events to html elements as well:

```javascript
SVG.on(window, 'click', click)
```

Obviously unbinding is practically the same:

```javascript
SVG.off(window, 'click', click)
```

### Custom events
You can even use your own events.

Just add an event listener for your event:
```javascript
rect.on('myevent', function() {
  alert('ta-da!')
})
```

Now you are ready to fire the event whenever you need:

```javascript
function whenSomethingHappens() {
  rect.fire('myevent') 
}

// or if you want to pass an event
function whenSomethingHappens(event) {
  rect.fire(event) 
}

```

You can also pass some data to the event:

```javascript
function whenSomethingHappens() {
  rect.fire('myevent', {some:'data'}) 
}

rect.on('myevent', function(e) {
  alert(e.detail.some) // outputs 'data'
})
```

svg.js supports namespaced events following the syntax `event.namespace`.

A namespaced event behaves like a normal event with the difference that you can remove it without touching handlers from other namespaces.

```
// attach
rect.on('myevent.namespace', function(e) {
  // do something
})

// detach all handlers of namespace for myevent
rect.off('myevent.namespace')

// detach all handlers of namespace
rect.off('.namespace')

// detach all handlers including all namespaces
rect.off('myevent)
```

However you can't fire a specific namespaced event. Calling `rect.fire('myevent.namespace')` won't do anything while `rect.fire('myevent')` works and fires all attached handlers of the event

_Important: always make sure you namespace your event to avoid conflicts. Preferably use something very specific. So `event.wicked` for example would be better than something generic like `event.svg`._

## Numbers

Numbers in SVG.js have a dedicated number class to be able to process string values. Creating a new number is simple:

```javascript
var number = new SVG.Number('78%')
number.plus('3%').toString() //-> returns '81%'
number.valueOf() //-> returns 0.81
```

Operators are defined as methods on the `SVG.Number` instance.

### plus()
Addition:

```javascript
number.plus('3%')
```

__`returns`: `SVG.Number`__

### minus()
Subtraction:

```javascript
number.minus('3%')
```

__`returns`: `SVG.Number`__

### times()
Multiplication:

```javascript
number.times(2)
```

__`returns`: `SVG.Number`__

### divide()
Division:

```javascript
number.divide('3%')
```

__`returns`: `SVG.Number`__

### to()
Change number to another unit:

```javascript
number.to('px')
```

__`returns`: `SVG.Number`__

### morph()
Make a number morphable:

```javascript
number.morph('11%')
```

__`returns`: `itself`__


### at()
Get morphable number at given position:

```javascript
var number = new SVG.Number('79%').morph('3%')
number.at(0.55).toString() //-> '37.2%'
```

__`returns`: `SVG.Number`__


## Colors

Svg.js has a dedicated color class handling different types of colors. Accepted values are:

- hex string; three based (e.g. #f06) or six based (e.g. #ff0066) `new SVG.Color('#f06')`
- rgb string; e.g. rgb(255, 0, 102) `new SVG.Color('rgb(255, 0, 102)')`
- rgb object; e.g. { r: 255, g: 0, b: 102 } `new SVG.Color({ r: 255, g: 0, b: 102 })`

Note that when working with objects is important to provide all three values every time.

The `SVG.Color` instance has a few methods of its own.

### toHex()
Get hex value:

```javascript
color.toHex() //-> returns '#ff0066'
```

__`returns`: hex color string__

### toRgb()
Get rgb string value:

```javascript
color.toRgb() //-> returns 'rgb(255,0,102)'
```

__`returns`: rgb color string__

### brightness()
Get the brightness of a color:

```javascript
color.brightness() //-> returns 0.344
```

This is the perceived brighness where `0` is black and `1` is white.

__`returns`: `number`__

### morph()
Make a color morphable:

```javascript
color.morph('#000')
```

__`returns`: `itself`__

### at()
Get morphable color at given position:

```javascript
var color = new SVG.Color('#ff0066').morph('#000')
color.at(0.5).toHex() //-> '#7f0033'
```

__`returns`: `SVG.Color`__


## Arrays
In SVG.js every value list string can be cast and passed as an array. This makes writing them more convenient but also adds a lot of key functionality to them.

### SVG.Array
Is for simple, whitespace separated value strings:

```javascript
'0.343 0.669 0.119 0 0 0.249 -0.626 0.13 0 0 0.172 0.334 0.111 0 0 0 0 0 1 0'
```

Can also be passed like this in a more manageable format:

```javascript
new SVG.Array([ .343,  .669, .119, 0,   0 
              , .249, -.626, .130, 0,   0
              , .172,  .334, .111, 0,   0
              , .000,  .000, .000, 1,  -0 ])
```

### SVG.PointArray 
Is a bit more complex and is used for polyline and polygon elements. This is a poly-point string:

```javascript
'0,0 100,100'
```

The dynamic representation:

```javascript
[
  [0, 0]
, [100, 100]
]
```

Precompiling it as an `SVG.PointArray`:

```javascript
new SVG.PointArray([
  [0, 0]
, [100, 100]
])
```

Note that every instance of `SVG.Polyline` and `SVG.Polygon` carries a reference to the `SVG.PointArray` instance:

```javascript
polygon.array() //-> returns the SVG.PointArray instance
```

_Javascript inheritance stack: `SVG.PointArray` < `SVG.Array`_

### SVG.PathArray
Path arrays carry arrays representing every segment in a path string:

```javascript
'M0 0L100 100z'
```

The dynamic representation:

```javascript
[
  ['M', 0, 0]
, ['L', 100, 100]
, ['z']
]
```

Precompiling it as an `SVG.PathArray`:

```javascript
new SVG.PathArray([
  ['M', 0, 0]
, ['L', 100, 100]
, ['z']
])
```

Note that every instance of `SVG.Path` carries a reference to the `SVG.PathArray` instance:

```javascript
path.array() //-> returns the SVG.PathArray instance
```

#### Syntax
The syntax for patharrays is very predictable. They are basically literal representations in the form of two dimentional arrays.

##### Move To
Original syntax is `M0 0` or `m0 0`. The SVG.js syntax `['M',0,0]` or `['m',0,0]`.

##### Line To
Original syntax is `L100 100` or `l100 100`. The SVG.js syntax `['L',100,100]` or `['l',100,100]`.

##### Horizontal line
Original syntax is `H200` or `h200`. The SVG.js syntax `['H',200]` or `['h',200]`.

##### Vertical line
Original syntax is `V300` or `v300`. The SVG.js syntax `['V',300]` or `['v',300]`.

##### Bezier curve
Original syntax is `C20 20 40 20 50 10` or `c20 20 40 20 50 10`. The SVG.js syntax `['C',20,20,40,20,50,10]` or `['c',20,20,40,20,50,10]`.

Or mirrored with `S`:

Original syntax is `S40 20 50 10` or `s40 20 50 10`. The SVG.js syntax `['S',40,20,50,10]` or `['s',40,20,50,10]`.

Or quadratic with `Q`:

Original syntax is `Q20 20 50 10` or `q20 20 50 10`. The SVG.js syntax `['Q',20,20,50,10]` or `['q',20,20,50,10]`.

Or a complete shortcut with `T`:

Original syntax is `T50 10` or `t50 10`. The SVG.js syntax `['T',50,10]` or `['t',50,10]`.

##### Arc
Original syntax is `A 30 50 0 0 1 162 163` or `a 30 50 0 0 1 162 163`. The SVG.js syntax `['A',30,50,0,0,1,162,163]` or `['a',30,50,0,0,1,162,163]`.

##### Close
Original syntax is `Z` or `z`. The SVG.js syntax `['Z']` or `['z']`.

The best documentation on paths can be found at https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Paths.


_Javascript inheritance stack: `SVG.PathArray` < `SVG.Array`_

### morph()
In order to animate array values the `morph()` method lets you pass a destination value. This can be either the string value, a plain array or an instance of the same type of SVG.js array:

```javascript
var array = new SVG.PointArray([[0, 0], [100, 100]])
array.morph('100,0 0,100 200,200')
```

This method will prepare the array ensuring both the source and destination arrays have the same length.

In order to morph paths you need to include the [svg.pathmorphing.js](https://github.com/wout/svg.pathmorphing.js) extension.

__`returns`: `itself`__

### at()
This method will morph the array to a given position between `0` and `1`. Continuing with the previous example:

```javascript
array.at(0.27).toString() //-> returns '27,0 73,100 127,127'
```

Note that this method is currently not available on `SVG.PathArray` but will be soon.

__`returns`: new instance__

### settle()
When morphing is done the `settle()` method will eliminate any transitional points like duplicates:

```javascript
array.settle()
```

Note that this method is currently not available on `SVG.PathArray` but will be soon.

__`returns`: `itself`__

### move()
Moves geometry of the array with the given `x` and `y` values:

```javascript
var array = new SVG.PointArray([[0, 0], [100, 100]])
array.move(33,75)
array.toString() //-> returns '33,75 133,175'
```

Note that this method is only available on `SVG.PointArray` and `SVG.PathArray`

__`returns`: `itself`__

### size()
Resizes geometry of the array by the given `width` and `height` values:

```javascript
var array = new SVG.PointArray([[0, 0], [100, 100]])
array.move(100,100).size(222,333)
array.toString() //-> returns '100,100 322,433'
```

Note that this method is only available on `SVG.PointArray` and `SVG.PathArray`

__`returns`: `itself`__

### reverse()
Reverses the order of the array:

```javascript
var array = new SVG.PointArray([[0, 0], [100, 100]])
array.reverse()
array.toString() //-> returns '100,100 0,0'
```

__`returns`: `itself`__

### bbox()
Gets the bounding box of the geometry of the array:

```javascript
array.bbox()
```

Note that this method is only available on `SVG.PointArray` and `SVG.PathArray`

__`returns`: `object`__


## Matrices
Matrices in SVG.js have their own class `SVG.Matrix`, wrapping the native `SVGMatrix`. They add a lot of functionality like extracting transform values, matrix morphing and improvements on the native methods.

### SVG.Matrix
In SVG.js matrices accept various values on initialization.

Without a value:

```javascript
var matrix = new SVG.Matrix
matrix.toString() //-> returns matrix(1,0,0,1,0,0)
```

Six arguments:

```javascript
var matrix = new SVG.Matrix(1, 0, 0, 1, 100, 150)
matrix.toString() //-> returns matrix(1,0,0,1,100,150)
```

A string value:

```javascript
var matrix = new SVG.Matrix('1,0,0,1,100,150')
matrix.toString() //-> returns matrix(1,0,0,1,100,150)
```

An object value:

```javascript
var matrix = new SVG.Matrix({ a: 1, b: 0, c: 0, d: 1, e: 100, f: 150 })
matrix.toString() //-> returns matrix(1,0,0,1,100,150)
```

A native `SVGMatrix`:

```javascript
var svgMatrix = svgElement.getCTM()
var matrix = new SVG.Matrix(svgMatrix)
matrix.toString() //-> returns matrix(1,0,0,1,0,0)
```

Even an instance of `SVG.Element`:

```javascript
var rect = draw.rect(50, 25)
var matrix = new SVG.Matrix(rect)
matrix.toString() //-> returns matrix(1,0,0,1,0,0)
```

### extract()
Gets the calculated values of the matrix as an object:

```javascript
matrix.extract()
```

The returned object contains the following values:

- `x` (translation on the x-axis)
- `y` (translation on the y-axis)
- `skewX` (calculated skew on x-axis)
- `skewY` (calculated skew on y-axis)
- `scaleX` (calculated scale on x-axis)
- `scaleY` (calculated scale on y-axis)
- `rotation` (calculated rotation)

__`returns`: `object`__

### clone()
Returns an exact copy of the matrix:

```javascript
matrix.clone()
```

__`returns`: `SVG.Matrix`__

### morph()
In order to animate matrices the `morph()` method lets you pass a destination matrix. This can be any value a `SVG.Matrix` would accept on initialization:

```javascript
matrix.morph('matrix(2,0,0,2,100,150)')
```

__`returns`: `itself`__

### at()
This method will morph the matrix to a given position between `0` and `1`:

```javascript
matrix.at(0.27)
```

This will only work when a destination matirx is defined using the `morph()` method.

__`returns`: `SVG.Matrix`__

### multiply()
Multiplies by another given matrix:

```javascript
matrix.matrix(matrix2)
```

__`returns`: `SVG.Matrix`__

### inverse()
Creates an inverted matix:

```javascript
matrix.inverse()
```

__`returns`: `SVG.Matrix`__

### translate()
Translates matrix by a given x and y value:

```javascript
matrix.translate(10, 20)
```

__`returns`: `SVG.Matrix`__

### scale()
Scales matrix uniformal with one value:

```javascript
// scale
matrix.scale(2)
```

Scales matrix non-uniformal with two values:

```javascript
// scaleX, scaleY
matrix.scale(2, 3)
```

Scales matrix uniformal on a given center point with three values:

```javascript
// scale, cx, cy
matrix.scale(2, 100, 150)
```

Scales matrix non-uniformal on a given center point with four values:

```javascript
// scaleX, scaleY, cx, cy
matrix.scale(2, 3, 100, 150)
```

__`returns`: `SVG.Matrix`__

### rotate()
Rotates matrix by degrees with one value given:

```javascript
// degrees
matrix.rotate(45)
```

Rotates a matrix by degrees around a given point with three values:

```javascript
// degrees, cx, cy
matrix.rotate(45, 100, 150)
```

__`returns`: `SVG.Matrix`__

### flip()
Flips matrix over a given axis:

```javascript
matrix.flip('x')
```

or

```javascript
matrix.flip('y')
```

By default elements are flipped over their center point. The flip axis position can be defined with the second argument:

```javascript
matrix.flip('x', 150)
```

or

```javascript
matrix.flip('y', 100)
```

__`returns`: `SVG.Matrix`__

### skew()
Skews matrix a given degrees over x and or y axis with two values:

```javascript
// degreesX, degreesY
matrix.skew(0, 45)
```

Skews matrix a given degrees over x and or y axis on a given point with four values:

```javascript
// degreesX, degreesY, cx, cy
matrix.skew(0, 45, 150, 100)
```

__`returns`: `SVG.Matrix`__

### around()
Performs a given matrix transformation around a given center point:

```javascript
// cx, cy, matrix
matrix.around(100, 150, new SVG.Matrix().skew(0, 45))
```

The matrix passed as the third argument will be used to multiply.

__`returns`: `SVG.Matrix`__

### native()
Returns a native `SVGMatrix` extracted from the `SVG.Matrix` instance:

```javascript
matrix.native()
```

__`returns`: `SVGMatrix`__

### toString()
Converts the matrix to a transform string:

```javascript
matrix.toString()
// -> matrix(1,0,0,1,0,0)
```

__`returns`: `string`__

## Extending functionality

### SVG.invent()
Creating your own custom elements with SVG.js is a piece of cake thanks to the `SVG.invent` function. For the sake of this example, lets "invent" a shape. We want a `rect` with rounded corners that are always proportional to the height of the element. The new shape lives in the `SVG` namespace and is called `Rounded`. Here is how we achieve that.

```javascript
SVG.Rounded = SVG.invent({
  // Define the type of element that should be created
  create: 'rect'

  // Specify from which existing class this shape inherits
, inherit: SVG.Shape

  // Add custom methods to invented shape
, extend: {
    // Create method to proportionally scale the rounded corners
    size: function(width, height) {
      return this.attr({
        width:  width
      , height: height
      , rx:     height / 5
      , ry:     height / 5
      })
    }
  }

  // Add method to parent elements
, construct: {
    // Create a rounded element
    rounded: function(width, height) {
      return this.put(new SVG.Rounded).size(width, height)
    }
    
  }
})
```

To create the element in your drawing:

```javascript
var rounded = draw.rounded(200, 100)
```

That's it, the invention is now ready to be used!

#### Accepted values
The `SVG.invent()` function always expects an object. The object can have the following configuration values:

- `create`: can be either a string with the node name (e.g. `rect`, `ellipse`, ...) or a custom initializer function; `[required]`
- `inherit`: the desired SVG.js class to inherit from (e.g. `SVG.Shape`, `SVG.Element`, `SVG.Container`, `SVG.Rect`, ...); `[optional but recommended]`
- `extend`: an object with the methods that should be applied to the element's prototype; `[optional]`
- `construct`: an object with the methods to create the element on the parent element; `[optional]`
- `parent`: an SVG.js parent class on which the methods in the passed `construct` object should be available - defaults to `SVG.Container`; `[optional]`

#### Usage notes

It should be emphasized that in the configuration object passed to `SVG.invent()`:

- `construct` does not supply constructors, but rather methods that are likely to *call* constructors;
- `create` specifies the constructor for the type you are defining, and is not analogous to `Object.create()`.

When defining specialized svg elements (such as `SVG.Rounded` in the example above), the function specified by `create` needs to do all the work of adding the element to the DOM for the svg document and connecting the DOM node to the SVG.js interface. All this is done automatically when the value of `create` is a string identifying an element type. If needed, see the source for a sense of how to do it explicitly.

Though the defaults are geared toward creating svg elements for the SVG.js framework, `SVG.invent()` can be used as a generalized function for defining types in Javascript. When used in this more general way, the function supplied as a value for `create` should be written as an ordinary JS constructor. (Indeed, the function is simply returned as the constructor for your newly defined type.)

Svg.js uses the `SVG.invent()` function to create all internal elements. A look at the source will show how this function is used in various ways.



### SVG.extend()
SVG.js has a modular structure. It is very easy to add your own methods at different levels. Let's say we want to add a method to all shape types then we would add our method to SVG.Shape:

```javascript
SVG.extend(SVG.Shape, {
  paintRed: function() {
    return this.fill('red')
  }
})
```

Now all shapes will have the paintRed method available. Say we want to have the paintRed method on an ellipse apply a slightly different color:

```javascript
SVG.extend(SVG.Ellipse, {
  paintRed: function() {
    return this.fill('orangered')
  }
})

```
The complete inheritance stack for `SVG.Ellipse` is:

_`SVG.Ellipse` < `SVG.Shape` < `SVG.Element`_

The SVG document can be extended by using:

```javascript
SVG.extend(SVG.Doc, {
  paintAllPink: function() {
    this.each(function() {
      this.fill('pink')
    })
  }
})
```

You can also extend multiple elements at once:
```javascript
SVG.extend(SVG.Ellipse, SVG.Path, SVG.Polygon, {
  paintRed: function() {
    return this.fill('orangered')
  }
})
```


## Plugins
Here are a few nice plugins that are available for SVG.js:

### pathmorphing
[svg.pathmorphing.js](https://github.com/wout/svg.pathmorphing.js) to make path animatable

### textmorphing
[svg.textmorph.js](https://github.com/wout/svg.textmorph.js) to make text animatable

### absorb
[svg.absorb.js](https://github.com/wout/svg.absorb.js) absorb raw SVG data into an SVG.js instance.

### draggable
[svg.draggable.js](https://github.com/wout/svg.draggable.js) to make elements draggable.

### connectable
[svg.connectable.js](https://github.com/jillix/svg.connectable.js) to connect elements.

[svg.connectable.js fork](https://github.com/loredanacirstea/svg.connectable.js) to connect elements (added: curved connectors, you can use any self-made path as a connector, choosable 'center'/'perifery' attachment, 'perifery' attachment for source / target SVG Paths uses smallest-distance algorithm between PathArray points)

### easing
[svg.easing.js](https://github.com/wout/svg.easing.js) for more easing methods on animations.

### export
[svg.export.js](https://github.com/wout/svg.export.js) export raw SVG.

### filter
[svg.filter.js](https://github.com/wout/svg.filter.js) adding svg filters to elements.

### foreignobject
[svg.foreignobject.js](https://github.com/john-memloom/svg.foreignobject.js) foreignObject implementation (by john-memloom).

### import
[svg.import.js](https://github.com/wout/svg.import.js) import raw SVG data.

### math
[svg.math.js](https://github.com/otm/svg.math.js) a math extension (by Nils Lagerkvist).

### path
[svg.path.js](https://github.com/otm/svg.path.js) for manually drawing paths (by Nils Lagerkvist).

## screenBBox
[svg.screenbbox.js](https://github.com/fuzzyma/svg.screenbbox.js) to get the bbox in screen coordinates from transformed path/polygon/polyline

### shapes
[svg.shapes.js](https://github.com/wout/svg.shapes.js) for more polygon based shapes.

### topath
[svg.topath.js](https://github.com/wout/svg.topath.js) to convert any other shape to a path.

### topoly
[svg.topoly.js](https://github.com/wout/svg.topoly.js) to convert a path to polygon or polyline.

### wiml
[svg.wiml.js](https://github.com/wout/svg.wiml.js) a templating language for svg output.

### comic
[comic.js](https://github.com/balint42/comic.js) to cartoonize any given svg.

### draw
[svg.draw.js](https://github.com/fuzzyma/svg.draw.js) to draw elements with your mouse

### select
[svg.select.js](https://github.com/fuzzyma/svg.select.js) to select elements

### resize
[svg.resize.js](https://github.com/fuzzyma/svg.resize.js) to resize elements with your mouse

## Contributing
We love contributions. Yes indeed, we used the word LOVE! But please make sure you follow the same coding style. Here are some guidelines.

### Indentation
We do it with __two spaces__. Make sure you don't start using tabs because then things get messy.

### Avoid hairy code
We like to keep things simple and clean, don't write anything you don't need. So use __single quotes__ where possible and __avoid semicolons__, we're not writing PHP here.

__Good__:
```javascript
var text = draw.text('with single quotes here')
  , nest = draw.nested().attr('x', '50%')

for (var i = 0; i < 5; i++)
  if (i != 3)
    nest.circle(i * 100)
```

__Bad__:
```javascript
var text = draw.text("with double quotes here");
var nest = draw.nested().attr("x", "50%");

for (var i = 0; i < 5; i++) {
  if (i != 3) {
    nest.circle(100);
  };
};
```

### Minimize variable declarations
All local variables should be declared at the beginning of a function or method unless there is ony one variable to declare. Although it is not required to assign them at the same moment. When if statements are involved, requiring some variables only to be present in the statement, the necessary variables should be declared right after the if statement.

__Good__:
```javascript
function reading_board() {
  var aap, noot, mies

  aap  = 1
  noot = 2
  mies = aap + noot
}
```

__Bad__:
```javascript
function reading_board() {
  var aap  = 1
  var noot = 2
  var mies = aap + noot
}
```

### Let your code breathe people!
Don't try to be a code compressor yourself, they do way a better job anyway. Give your code some spaces and newlines.

__Good__:
```javascript
var nest = draw.nested().attr({
  x:      10
, y:      20
, width:  200
, height: 300
})

for (var i = 0; i < 5; i++)
  nest.circle(100)
```

__Bad__:
```javascript
var nest=draw.nested().attr({x:10,y:20,width:200,height:300});
for(var i=0;i<5;i++)nest.circle(100);
```

### It won't hurt to add a few comments
Where necessary tell us what you are doing but be concise. We only use single-line comments. Also keep your variable and method names short while maintaining readability.

__Good__:
```javascript
// Adds orange-specific methods
SVG.extend(SVG.Rect, {
  // Add a nice, transparent orange
  orangify: function() {
    // fill with orange color
    this.fill('orange')

    // add a slight opacity
    return this.opacity(0.85)
  }
})
```

__Bad__:
```javascript
/*
 *
 * does something with orange and opacity
 *
 */
SVG.extend(SVG.Rect, {
  orgf: function() {
    return this.fill('orange').opacity(0.85)
  }
})
```

### Refactor your code
Once your implementation is ready, revisit and rework it. We like to keep it [DRY](http://en.wikipedia.org/wiki/Don't_repeat_yourself).

### Test. Your. Code.
It's not that hard to write at least one example per implementation, although we prefer more. Your code might seem to work by quickly testing it in your brwoser but more than often you can't forsee everything.

Before running the specs you will need to build the library. Be aware that pull requests without specs will be declined.


## Building
After contributing you probably want to build the library to run some specs. Make sure you have Node.js installed on your system, `cd` to the svg.js directory and run:

``` sh
$ npm install
```

Build SVG.js by running `gulp`:

``` sh
$ gulp
```

The resulting files are:

1. `dist/svg.js`
2. `dist/svg.min.js`


## Compatibility

### Desktop
- Firefox 3+
- Chrome 4+
- Safari 3.2+
- Opera 9+
- IE9+

### Mobile
- iOS Safari 3.2+
- Android Browser 3+
- Opera Mobile 10+
- Chrome for Android 18+
- Firefox for Android 15+

Visit the [SVG.js test page](http://svgjs.com/test) if you want to check compatibility with different browsers.

## Acknowledgements & Thanks

Documentation kindly provided by [DocumentUp](http://documentup.com)

SVG.js and its documentation is released under the terms of the MIT license.
