# svg.js

A lightweight library for manipulating and animating SVG.

Svg.js has no dependencies and aims to be as small as possible.

Svg.js is licensed under the terms of the MIT License.

See [svgjs.com](http://svgjs.com) for an introduction, [documentation](http://documentup.com/wout/svg.js) and [some action](http://svgjs.com/test).

[![Wout on Gittip](http://files.wout.co.uk/github/gittip.png)](https://www.gittip.com/wout/)

## Usage

### Create a SVG document

Use the `SVG()` function to create a SVG document within a given html element:

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

### Sub pixel offset fix
By default sub pixel offset won't be corrected. To enable it, call the `fixSubPixelOffset()` method:

```javascript
var draw = SVG('drawing').fixSubPixelOffset()
```

## Parent elements

### Main svg document
The main svg.js initializer function creates a root svg node in the given element and retuns an instance of `SVG.Doc`:

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

The defs are also availabel on any other element through the `doc()` method:

```javascript
var defs = rect.doc().defs()
```

The defs node works exactly the same as groups.

__`returns`: `SVG.Defs`__

_Javascript inheritance stack: `SVG.Defs` < `SVG.Container` < `SVG.Parent`_


## Elements

### Rect
Rects have two arguments, their `width` and `height`:

```javascript
var rect = draw.rect(100, 100)
```

Rects can also have rounded corners:

```javascript
rect.radius(10)
```

This will set the `rx` and `ry` attributes to `10`. To set `rx` and `ry` individually:

```javascript
rect.radius(10, 20)
```

__`returns`: `SVG.Rect`__

_Javascript inheritance stack: `SVG.Rect` < `SVG.Shape` < `SVG.Element`_


### Ellipse
Ellipses, like rects, have two arguments, their `width` and `height`:

```javascript
var ellipse = draw.ellipse(200, 100)
```

__`returns`: `SVG.Ellipse`__

_Javascript inheritance stack: `SVG.Ellipse` < `SVG.Shape` < `SVG.Element`_

### Circle
The only argument necessary for a circle is the diameter:

```javascript
var circle = draw.circle(100)
```

__`returns`: `SVG.Ellipse`__

_Javascript inheritance stack: `SVG.Ellipse` < `SVG.Shape` < `SVG.Element`_

_Note that this generates an `<ellipse>` element instead of a `<circle>`. This choice has been made to keep the size of the library down._

### Line
The line element always takes four arguments, `x1`, `y1`, `x2` and `y2`:

```javascript
var line = draw.line(0, 0, 100, 150).stroke({ width: 1 })
```

Updating a line is done with the `plot()` method:

```javascript
line.plot(50, 30, 100, 150)
```

__`returns`: `SVG.Line`__

_Javascript inheritance stack: `SVG.Line` < `SVG.Shape` < `SVG.Element`_

### Polyline
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

Polylines can be updated using the `plot()` method:

```javascript
polyline.plot([[0,0], [100,50], [50,100], [150,50], [200,50]])
```

The `plot()` method can also be animated:

```javascript
polyline.animate(3000).plot([[0,0], [100,50], [50,100], [150,50], [200,50], [250,100], [300,50], [350,50]])
```

__`returns`: `SVG.Polyline`__

_Javascript inheritance stack: `SVG.Polyline` < `SVG.Shape` < `SVG.Element`_

### Polygon
The polygon element, unlike the polyline element, defines a closed shape consisting of a set of connected straight line segments:

```javascript
// polygon('x,y x,y x,y')
var polygon = draw.polygon('0,0 100,50 50,100').fill('none').stroke({ width: 1 })
```

Polygon strings are exactly the same as polyline strings. There is no need to close the shape as the first and last point will be connected automatically.

__`returns`: `SVG.Polygon`__

_Javascript inheritance stack: `SVG.Polygon` < `SVG.Shape` < `SVG.Element`_

### Path
The path string is similar to the polygon string but much more complex in order to support curves:

```javascript
var path = draw.path('M10,20L30,40')
```

Paths can be updated using the `plot()` method:

```javascript
path.plot('M100,200L300,400')
```

__`returns`: `SVG.Path`__

_Javascript inheritance stack: `SVG.Path` < `SVG.Shape` < `SVG.Element`_

For more details on path data strings, please refer to the SVG documentation:
http://www.w3.org/TR/SVG/paths.html#PathData


### Image
When creating images the `width` and `height` values should be defined:

```javascript
// image(src, width, height)
var image = draw.image('/path/to/image.jpg', 200, 200).move(100, 100)
```

__`returns`: `SVG.Image`__

_Javascript inheritance stack: `SVG.Image` < `SVG.Shape` < `SVG.Element`_


### Text
Unlike html, text in svg is much harder to tame. There is no way to create flowing text, so newlines should be entered manually. In svg.js there are two ways to create text elements.

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

Changing text afterwards is also possible with the `text()` method:

```javascript
text.text('Brilliant!')
```

To get the raw text content:

```javascript
text.content
```

The sugar.js module provides some syntax sugar specifically for this element type:

```javascript
text.font({
  family:   'Helvetica'
, size:     144
, anchor:   'middle'
, leading:  '1.5em'
})
```

__`returns`: `SVG.Text`__

_Javascript inheritance stack: `SVG.Text` < `SVG.Shape` < `SVG.Element`_

### TextPath
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
text.textPath.attr('startOffset', 0.5)
```

And they can be animated as well of course:

```javascript
text.textPath.animate(3000).attr('startOffset', 0.8)
```

Referencing the linked path element directly:

```javascript
var path = text.track
```

__`returns`: `SVG.TextPath`__

_Javascript inheritance stack: `SVG.TextPath` < `SVG.Element`_


### Use
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

__`returns`: `SVG.Use`__

_Javascript inheritance stack: `SVG.Use` < `SVG.Shape` < `SVG.Element`_

## Referencing elements

### By id
If you want to get an element created by svg.js by its id, you can use the `SVG.get()` method:

```javascript
var element = SVG.get('my_element')

element.fill('#f06')
```

### By class name
There is no DOM querying system built into svg.js but [jQuery](http://jquery.com/) or [Zepto](http://zeptojs.com/) will help you achieve this. Here is an example:

```javascript
/* add elements */
var draw   = SVG('drawing')
var group  = draw.group().attr('class', 'my-group')
var rect   = group.rect(100,100).attr('class', 'my-element')
var circle = group.circle(100).attr('class', 'my-element').move(100, 100)

/* get elements in group */
var elements = $('#drawing g.my-group .my-element').each(function() {
  this.instance.animate().fill('#f09')
})
```

## Circular reference
Every element instance within svg.js has a reference to the actual `node`:

### node
```javascript
element.node
```
__`returns`: node__

### instance
Similarly, the node carries a reference to the svg.js `instance`:

```javascript
node.instance
```
__`returns`: element__

## Parent reference
Every element has a reference to its parent:

### parent

```javascript
element.parent
```

__`returns`: <span color="pink">element</span>__

Even the main svg document:

```javascript
var draw = SVG('drawing')

draw.parent //-> returns the wrappig html element with id 'drawing'
```

__`returns`: node__


### doc()
For more specific parent filtering the `doc()` method can be used:

```javascript
var draw = SVG('drawing')
var rect = draw.rect(100, 100)

rect.doc() //-> returns draw
```

Alternatively a class can be passed as the first argument:

```javascript
var draw   = SVG('drawing')
var nested = draw.nested()
var group  = nested.group()
var rect   = group.rect(100, 100)

rect.doc()           //-> returns draw
rect.doc(SVG.Doc)    //-> returns draw
rect.doc(SVG.Nested) //-> returns nested
rect.doc(SVG.G)      //-> returns group
```
__`returns`: element__

## Child references

### first()
To get the first child of a parent element:

```javascript
draw.first()
```
__`returns`: element__

### last()
To get the last child of a parent element:

```javascript
draw.last()
```
__`returns`: element__

### children()
An array of all children will can be retreives with the `children` method:

```javascript
draw.children()
```
__`returns`: array__

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

__`returns`: itself__

### has()
Checking the existence of an element within a parent:

```javascript
var rect  = draw.rect(100, 50)
var group = draw.group()

draw.has(rect)  //-> returns true
group.has(rect) //-> returns false
```
__`returns`: boolean__

### index()
Returns the index of given element and retuns -1 when it is not a child:

```javascript
var rect  = draw.rect(100, 50)
var group = draw.group()

draw.index(rect)  //-> returns 0
group.index(rect) //-> returns -1
```
__`returns`: number__

### get()
Get an element on a given position in the children array:

```javascript
var rect   = draw.rect(20, 30)
var circle = draw.circle(50)

draw.get(0) //-> returns rect
draw.get(1) //-> returns circle
```
__`returns`: element__

### clear()
To remove all elements from a parent element:

```javascript
draw.clear()
```
__`returns`: itself__


## Manipulating elements

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

`getter`__`returns`: value__

`setter`__`returns`: itself__


### transform()
With the `transform()` method elements can be scaled, rotated, translated and skewed:

```javascript
rect.transform({
  rotation: 45
, cx:       100
, cy:       100
})
```

You can also provide two arguments as property and value:

```javascript
rect.transform('matrix', '1,0.5,0.5,1,0,0')
```

All available transformations are:

```javascript
rect.transform({
  x:        [translation on x-axis]
, y:        [translation on y-axis]

, rotation: [degrees]
, cx:       [x rotation point]
, cy:       [y rotation point]

, scaleX:   [scaling on x-axis]
, scaleY:   [scaling on y-axis]

, skewX:    [skewing on x-axis]
, skewY:    [skewing on y-axis]

, matrix:   [a 6-digit matrix string; e.g. '1,0,0,1,0,0']
, a:        [the first matrix digit]
, b:        [the second matrix digit]
, c:        [the third matrix digit]
, d:        [the fourth matrix digit]
, e:        [the fifth matrix digit]
, f:        [the sixth matrix digit]
})
```

Note that you can also apply transformations directly using the `attr()` method:

```javascript
rect.attr('transform', 'matrix(1,0.5,0.5,1,0,0)')
```

Although that would mean you can't use the `transform()` method because it would overwrite any manually applied transformations. You should only go down this route if you know exactly what you are doing and you want to achieve an effect that is not achievable with the `transform()` method.

`getter`__`returns`: number__

`setter`__`returns`: itself__

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

Similarly to `attr()` the `style()` method can also act as a getter:

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

`getter`__`returns`: value__

`setter`__`returns`: itself__


### move()
Move the element to a given `x` and `y` position by its upper left corner:

```javascript
rect.move(200, 350)
```

The `text` element has one optional argument:

```javascript
// move(x, y, anchor)
rect.move(200, 350, true)
```

The third argument can be used to move the text element by its anchor point rather than the calculated left top position.

Note that you can also use the following code to move some elements (like images and rects) around:

```javascript
rect.attr({ x: 20, y: 60 })
``` 

Although `move()` is much more convenient because it will always use the upper left corner as the position reference, whereas with using `attr()` the `x` and `y` reference differ between element types. For example, rect uses the upper left corner with the `x` and `y` attributes, circle and ellipse use their center with the `cx` and `cy` attributes and thereby simply ignoring the `x` and `y` values you might assign.

__`returns`: itself__

### x()
Move element only along x-axis by its upper left corner:

```javascript
rect.x(200)
```

Without an argument the `x()` method serves as a getter as well:

```javascript
rect.x() //-> returns 200
```

`getter`__`returns`: value__

`setter`__`returns`: itself__

### y()
Move element only along y-axis by its upper left corner:

```javascript
rect.y(350)
```

Without an argument the `y()` method serves as a getter as well:

```javascript
rect.y() //-> returns 350
```

`getter`__`returns`: value__

`setter`__`returns`: itself__

### relative()
The `move()`, `x()` and `y()` methods move an element to an absolute position. With the `relative()` method, elements can be moved relatively to their current position. This can be done by calling the `relative()` method before the `move()`, `x()` or `y()` methods in the method chain:

```javascript
rect.move(100, 100).relative().move(20, -50)
```

This will set the `x` position of the element to `120` and the `y` position to `50`.

It works the same way for `relative().x()` and  `relative().y()`.

__`returns`: object__


### center()
This is an extra method to move an element by its center:

```javascript
rect.center(150, 150)
```

The `text` element has one optional argument:

```javascript
// center(x, y, anchor)
rect.center(150, 150, true)
```

The third argument can be used to center the text element by its anchor point rather than the calculated center position.

__`returns`: itself__

### cx()
Move element only along x-axis by its center:

```javascript
rect.cx(200)
```

Without an argument the `cx()` method serves as a getter as well:

```javascript
rect.cx() //-> returns 200
```

`getter`__`returns`: value__

`setter`__`returns`: itself__

### cy()
Move element only along y-axis by its center:

```javascript
rect.cy(350)
```

Without an argument the `cy()` method serves as a getter as well:

```javascript
rect.cy() //-> returns 350
```

`getter`__`returns`: value__

`setter`__`returns`: itself__

### size()
Set the size of an element by a given `width` and `height`:

```javascript
rect.size(200, 300)
```

Proporional resizing is also possible by leaving out `height`:

```javascript
rect.size(200)
```

Or by passing `null` as the value for `width`:

```javascript
rect.size(null, 200)
```

Same as with `move()` the size of an element could be set by using `attr()`. But because every type of element is handles its size differently the `size()` method is much more convenient.

__`returns`: itself__

### width()
Set only width of an element:

```javascript
rect.width(200)
```

This method also acts as a getter:

```javascript
rect.width() //-> returns 200
```

`getter`__`returns`: value__

`setter`__`returns`: itself__

### height()
Set only height of an element:

```javascript
rect.height(325)
```

This method also acts as a getter:

```javascript
rect.height() //-> returns 325
```

`getter`__`returns`: value__

`setter`__`returns`: itself__

### hide()
Hide element:

```javascript
rect.hide()
```

__`returns`: itself__

### show()
Show element:

```javascript
rect.show()
```

__`returns`: itself__

### visible()
To check if the element is visible:

```javascript
rect.visible()
```

__`returns`: boolean__

### clone()
To make an exact copy of an element the `clone()` method comes in handy:

```javascript
var clone = rect.clone()
```

__`returns`: element__

This will create an new, unlinked copy. If you want to make a linked clone have a look at the [use](#elements/use) element.

### remove()
Pretty straightforward:

```javascript
rect.remove()
```

__`returns`: itself__

### replace()
This method will replace the called element with the given element in the same position in the stack:

```javascript
rect.replace(draw.circle(100))
```

__`returns`: element__


## Inserting elements

### add()
Elements can be moved between parents via the `add()` method on any parent:

```javascript
var rect = draw.rect(100, 100)
var group = draw.group()

group.add(rect) //-> returns group
```

__`returns`: itself__

### put()
Where the `add()` method returns the parent itself, the `put()` method returns the given element:

```javascript
group.put(rect) //-> returns rect
```

__`returns`: element__

### addTo()
Similarly to the `add()` method on a parent element, elements have the `addTo()` method:

```javascript
rect.addTo(group) //-> returns rect
```

__`returns`: itself__

### putIn()
Similarly to the `put()` method on a parent element, elements have the `putIn()` method:

```javascript
rect.putIn(group) //-> returns group
```

__`returns`: element__

## Geometry

### viewBox()

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

`setter`__`returns`: itself__

### bbox()

```javascript
path.bbox()
```
This will return an instance of `SVG.BBox` containing the following values:

```javascript
{ width: 20, height: 20, x: 10, y: 20, cx: 30, cy: 20 } 
```

As opposed to the native `getBBox()` method any translations used with the `transform()` method will be taken into account.

The `SVG.BBox` has one other nifty little feature, enter the `merge()` method. With `merge()` two `SVG.BBox` instances can be merged into one new instance, basically being the bounding box of the two original bounding boxes:

```javascript
var box1 = draw.rect(100,100).move(50,50)
var box2 = draw.rect(100,100).move(200,200)
var box3 = box1.merge(box2)
```

__`returns`: `SVG.BBox`__

### rbox()
Is similar to `bbox()` but will give you the box around the exact representation of the element, taking all transformations into account.

```javascript
path.rbox()
```

__`returns`: `SVG.RBox`__

### inside()
To check if a given point is inside the bounding box of an element you can use the `inside()` method:

```javascript
var rect = draw.rect(100, 100).move(50, 50)

rect.inside(25, 30) //-> returns false
rect.inside(60, 70) //-> returns true
```

Note: the `x` and `y` positions are tested against the relative position of the element. Any offset on the parent element is not taken into account.

__`returns`: boolean__


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

You can also animate non-numeric unit values unsing the `attr()` method:
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
rect.animate({ ease: '<', delay: 1500 }).attr({ fill: '#f03' })
```

By default `duration` will be set to `1000`, `ease` will be set to `<>`.

__`returns`: `SVG.FX`__


### pause()
Pausing an animations is fairly straightforward:

```javascript
rect.animate().move(200, 200)

rect.mouseenter(function() { this.pause() })
```

__`returns`: itself__

### play()
Will start playing a paused animation:

```javascript
rect.animate().move(200, 200)

rect.mouseenter(function() { this.pause() })
rect.mouseleave(function() { this.play() })
```
__`returns`: itself__

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

Stopping an animation is irreversable.

__`returns`: itself__

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
  /* numeric values */
  ellipse.size(morph(100, 200), morph(100, 50))
  
  /* unit strings */
  ellipse.attr('cx', morph('20%', '80%'))
  
  /* hex color strings */
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
rect.animate(3000).move(100, 100).loop(5)
```

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

### to()
Say you want to control the position of an animation with an external event, then the `to()` method will proove very useful:

```javascript
var animate = draw.rect(100, 100).move(50, 50).animate('=').move(200, 200)

document.onmousemove = function(event) {
  animate.to(event.clientX / 1000)
}
```

In order to be able use the `to()` method the duration of the animation should be set to `'='`. The value passed as the first argument of `to()` should be a number between `0` and `1`, `0` being the beginning of the animation and `1` being the end. Note that any values below `0` and above `1` will be normalized.

_This functionality requires the fx.js module which is included in the default distribution._

__`returns`: `SVG.FX`__


## Syntax sugar

Fill and stroke are used quite often. Therefore two convenience methods are provided:

### fill()
The `fill()` method is a pretty alternative to the `attr()` method:

```javascript
rect.fill({ color: '#f06', opacity: 0.6 })
```

A single hex string will work as well:

```javascript
rect.fill('#f06')
```

__`returns`: itself__

### stroke()
The `stroke()` method is similar to `fill()`:

```javascript
rect.stroke({ color: '#f06', opacity: 0.6, width: 5 })
```

Like fill, a single hex string will work as well:

```javascript
rect.stroke('#f06')
```

__`returns`: itself__

### opacity()
To set the overall opacity of an element:

```javascript
rect.opacity(0.5)
```

__`returns`: itself__

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

__`returns`: itself__

### skew()
The `skew()` method will take an `x` and `y` value:

```javascript
// skew(x, y)
rect.skew(0, 45)
```

__`returns`: itself__

### scale()
The `scale()` method will take an `x` and `y` value:

```javascript
// scale(x, y)
rect.scale(0.5, -1)
```

__`returns`: itself__

### translate()
The `translate()` method will take an `x` and `y` value:

```javascript
// translate(x, y)
rect.translate(0.5, -1)
```

### radius()
Rects and ellipses have a `radius()` method. On rects it defines rounded corners, on ellipses the radii:

```javascript
rect.radius(10)
```

This will set the `rx` and `ry` attributes to `10`. To set `rx` and `ry` individually:

```javascript
rect.radius(10, 20)
```

_This functionality requires the sugar.js module which is included in the default distribution._

__`returns`: itself__


## Masking elements

### maskWith()
The easiest way to mask is to use a single element:

```javascript
var ellipse = draw.ellipse(80, 40).move(10, 10).fill({ color: '#fff' })

rect.maskWith(ellipse)
```

__`returns`: itself__

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

__`returns`: itself__

### remove()
Removing the mask alltogether will also `unmask()` all masked elements as well:

```javascript
mask.remove()
```

__`returns`: itself__

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

__`returns`: itself__

### clip()
Clip multiple elements:

```javascript
var ellipse = draw.ellipse(80, 40).move(10, 10)
var text = draw.text('SVG.JS').move(10, 10).font({ size: 36 })

var clip = draw.clip().add(text).add(ellipse)

rect.clipWith(clip)
```

__`returns`: `SVG.Clip`__

### unclip()
Unclipping the elements can be done with the `unclip()` method:

```javascript
rect.unclip()
```

__`returns`: itself__

### remove()
Removing the clip alltogether will also `unclip()` all clipped elements as well:

```javascript
clip.remove()
```

__`returns`: itself__

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

__`returns`: itself__

### back()
Move element to the back:

```javascript
rect.back()
```

__`returns`: itself__

### forward()
Move element one step forward:

```javascript
rect.forward()
```

__`returns`: itself__

### backward()
Move element one step backward:

```javascript
rect.backward()
```

__`returns`: itself__

### siblings()
The arrange.js module brings some additional methods. To get all siblings of rect, including rect itself:

```javascript
rect.siblings()
```

__`returns`: array__

### position()
Get the position (a number) of rect between its siblings:

```javascript
rect.position()
```

__`returns`: number__

### next()
Get the next sibling:

```javascript
rect.next()
```

__`returns`: element__

### previous()
Get the previous sibling:

```javascript
rect.previous()
```

__`returns`: element__

### before()
Insert an element before another:

```javascript
// inserts circle before rect
rect.before(circle)
```

__`returns`: itself__

### after()
Insert an element after another:

```javascript
// inserts circle after rect
rect.after(circle)
```

__`returns`: itself__

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

__`returns`: itself__

### each()
Iterating over all members in a set is the same as with svg containers:

```javascript
set.each(function(i) {
  this.attr('id', 'shiny_new_id_' + i)
})
```

Note that `this` refers to the current child element.

__`returns`: itself__

### has()
Determine if an element is member of the set:

```javascript
set.has(rect)
```

__`returns`: boolean__

### index()
Returns the index of a given element in the set.

```javascript
set.index(rect) //-> -1 if element is not a member
```

__`returns`: number__

### get()
Get the element at a given index:

```javascript
set.get(1)
```

__`returns`: element__

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

__`returns`: itself__

### clear()
Or to remove all elements from a set:

```javascript
set.clear()
```

__`returns`: itself__

### animate()
Sets work with animations as well:

```javascript
set.animate(3000).fill('#ff0')
```

__`returns`: `SVG.SetFX`__


## Gradients

### gradient()
There are linear and radial gradients. The linear gradient can be created like this:

```javascript
var gradient = draw.gradient('linear', function(stop) {
  stop.at({ offset: 0, color: '#333', opacity: 1 })
  stop.at({ offset: 1, color: '#fff', opacity: 1 })
})
```

__`returns`: `SVG.Gradient`__

### at()
The `offset` and `color` parameters are required for stops, `opacity` is optional. Offset is float between 0 and 1, or a percentage value (e.g. `33%`). 

```javascript
stop.at({ offset: 0, color: '#333', opacity: 1 })
```

__`returns`: itself__

### from() and to()
To define the direction you can set from `x`, `y` and to `x`, `y`:

```javascript
gradient.from(0, 0).to(0, 1)
```

The from and to values are also expressed in percent.

__`returns`: itself__

### radius()
Radial gradients have a `radius()` method to define the outermost radius to where the inner color should develop:

```javascript
var gradient = draw.gradient('radial', function(stop) {
  stop.at({ offset: 0, color: '#333', opacity: 1 })
  stop.at({ offset: 1, color: '#fff', opacity: 1 })
})

gradient.from(0.5, 0.5).to(0.5, 0.5).radius(0.5)
```

__`returns`: itself__

### update()
A gradient can also be updated afterwards:

```javascript
gradient.update(function(stop) {
  stop.at({ offset: 0.1, color: '#333', opacity: 0.2 })
  stop.at({ offset: 0.9, color: '#f03', opacity: 1 })
})
```

And even a single stop can be updated:

```javascript
var s1, s2, s3

draw.gradient('radial', function(stop) {
  s1 = stop.at({ offset: 0, color: '#000', opacity: 1 })
  s2 = stop.at({ offset: 0.5, color: '#f03', opacity: 1 })
  s3 = stop.at({ offset: 1, color: '#066', opacity: 1 })
})

s1.update({ offset: 0.1, color: '#0f0', opacity: 1 })
```

__`returns`: itself__

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

By passing the gradient instance as the fill on any element, the `fill()` method will be called:

```javascript
gradient.fill() //-> returns 'url(#SvgjsGradient1234)'
```

[W3Schools](http://www.w3schools.com/svg/svg_grad_linear.asp) has a great example page on how
[linear gradients](http://www.w3schools.com/svg/svg_grad_linear.asp) and
[radial gradients](http://www.w3schools.com/svg/svg_grad_radial.asp) work.

_This functionality requires the gradient.js module which is included in the default distribution._

__`returns`: value__

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

__`returns`: itself__

### Getting
Fetching the values is similar to the `attr()` method:

```javascript
rect.data('key')
```

__`returns`: itself__

### Removing
Removing the data altogether:

```javascript
rect.data('key', null)
```

__`returns`: itself__

### Sustaining data types
Your values will always be stored as JSON and in some cases this might not be desirable. If you want to store the value as-is, just pass true as the third argument:

```javascript
rect.data('key', 'value', true)
```

__`returns`: itself__


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

__`returns`: itself__

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

__`returns`: itself__

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

All available evenets are: `click`, `dblclick`, `mousedown`, `mouseup`, `mouseover`, `mouseout`, `mousemove`, `mouseenter` and `mouseleave`.

__`returns`: itself__

### Event listeners

You can also bind event listeners to elements:

```javascript
var click = function() {
  rect.fill({ color: '#f06' })
}

rect.on('click', click)
```

__`returns`: itself__

Note that the context of event listeners is not the same as events, which are applied directly to the element. Therefore `this` will not refer to the element when using event listeners.

Unbinding events is just as easy:

```javascript
rect.off('click', click)
```

__`returns`: itself__

But there is more to event listeners. You can bind events to html elements as well:

```javascript
SVG.on(window, 'click', click)
```

Obviously unbinding is practically the same:

```javascript
SVG.off(window, 'click', click)
```

## Colors

Svg.js has a dedicated color module handling different types of colors. Accepted values are:

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

__`returns`: number__

### morph()
Make a color morphable:

```javascript
color.morph('#000')
```

__`returns`: itself__

### at()
Get morphable color at given position:

```javascript
var color = new SVG.Color('#ff0066').morph('#000')
color.at(0.5).toHex() //-> '#7f0033'
```

__`returns`: `SVG.Color`__


## Arrays
In svg.js every value list string can be cast and passed as an array. This makes writing them more convenient but also adds a lot of key functionality to them.

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
new SVG.PointArray([[0, 0], [100, 100]])
```

Note that every instance of `SVG.Polyline` and `SVG.Polygon` carries a reference to the `SVG.PointArray` instance:

```javascript
polygon.array //-> returns the SVG.PointArray instance
```

_Javascript inheritance stack: `SVG.PointArray` < `SVG.Array`_

### SVG.PathArray
Path arrays carry objects representing every point in a path string:

```javascript
'M 0 0 L 100 100 z'
```

The dynamic representation:

```javascript
new SVG.PathArray([
  { type: 'M', x: 0, y: 0 }
, { type: 'L', x: 100, y: 100 }
, { type: 'z' }
])
```

Note that every instance of `SVG.Path` carries a reference to the `SVG.PathArray` instance:

```javascript
polygon.array //-> returns the SVG.PointArray instance
```

_Javascript inheritance stack: `SVG.PathArray` < `SVG.Array`_


### morph()
In order to animate array values the `morph()` method lets you pass a destination value. This can be either the string value, a plain array or an instance of the same type of svg.js array:

```javascript
var array = new SVG.PointArray([[0, 0], [100, 100]])
array.morph('100,0 0,100 200,200')
```

This method will prepare the array ensuring both the source and destination arrays have the same length.

Note that this method is currently not available on `SVG.PathArray` but will be soon.

__`returns`: itself__

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

__`returns`: itself__

### move()
Moves geometry of the array with the given `x` and `y` values:

```javascript
var array = new SVG.PointArray([[0, 0], [100, 100]])
array.move(33,75)
array.toString() //-> returns '33,75 133,175'
```

Note that this method is only available on `SVG.PointArray` and `SVG.PathArray`

__`returns`: itself__

### size()
Resizes geometry of the array by the given `width` and `height` values:

```javascript
var array = new SVG.PointArray([[0, 0], [100, 100]])
array.move(100,100).size(222,333)
array.toString() //-> returns '100,100 322,433'
```

Note that this method is only available on `SVG.PointArray` and `SVG.PathArray`

__`returns`: itself__

### bbox()
Gets the bounding box of the geometry of the array:

```javascript
array.bbox()
```

Note that this method is only available on `SVG.PointArray` and `SVG.PathArray`

__`returns`: object__


## Extending functionality

### SVG.extend
Svg.js has a modular structure. It is very easy to add you own methods at different levels. Let's say we want to add a method to all shape types then we would add our method to SVG.Shape:

```javascript
SVG.extend(SVG.Shape, {
  paintRed: function() {
    return this.fill({ color: 'red' })
  }
})
```

Now all shapes will have the paintRed method available. Say we want to have the paintRed method on an ellipse apply a slightly different color:

```javascript
SVG.extend(SVG.Ellipse, {
  paintRed: function() {
    return this.fill({ color: 'orangered' })
  }
})

```
The complete inheritance stack for `SVG.Ellipse` is:

_SVG.Ellipse < SVG.Shape < SVG.Element_

The SVG document can be extended by using:

```javascript
SVG.extend(SVG.Doc, {
  paintAllPink: function() {
    for (var i = 0, l = this.children.length; i < l; i++) {
      this.children[i].fill({ color: 'pink' })
    }
    
    return this
  }
})
```

You can also extend multiple elements at once:
```javascript
SVG.extend(SVG.Ellipse, SVG.Path, SVG.Polygon, {
  paintRed: function() {
    return this.fill({ color: 'orangered' })
  }
})

```


## Plugins
Here are a few nice plugins that are available for svg.js:

### draggable
[svg.draggable.js](https://github.com/wout/svg.draggable.js) to make elements draggable.

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

### pattern
[svg.pattern.js](https://github.com/wout/svg.pattern.js) add fill patterns.

### shapes
[svg.shapes.js](https://github.com/wout/svg.shapes.js) for more polygon based shapes.

### topath
[svg.topath.js](https://github.com/wout/svg.topath.js) to convert any other shape to a path.


## Building
Starting out with the default distribution of svg.js is good. Although you might want to remove some modules to keep the size at minimum.

You will need ruby, RubyGems, and rake installed on your system.

``` sh
# dependencies:
$ ruby -v
$ gem -v
$ rake -V

# required to generate the minified version:
$ gem install uglifier
```

Build svg.js by running `rake`:

``` sh
$ rake
Original version: 32.165k
Minified: 14.757k
Minified and gzipped: 4.413k, compression factor 7.289
```

The resulting files are:

1. `dist/svg.js`
2. `dist/svg.min.js`

To include optional modules and remove default ones, use the `concat` task. In
this example, 'clip' is removed, but 'group' and 'arrange' are added:

``` sh
$ rake concat[-clip:group:arrange] dist
```

To build the base library only including shapes:

``` sh
rake concat[-fx:-event:-group:-arrange:-mask:-gradient:-nested:-sugar] dist
```


## Compatibility

### Desktop
- Firefox 3+
- Chrome 4+
- Safari 3.2+
- Opera 9+
- IE9 +

### Mobile
- iOS Safari 3.2+
- Android Browser 3+
- Opera Mobile 10+
- Chrome for Android 18+
- Firefox for Android 15+

Visit the [svg.js test page](http://svgjs.com/test) if you want to check compatibility with different browsers.

Important: this library is still in beta, therefore the API might be subject to change in the course of development.
