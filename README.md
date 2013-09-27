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
var draw = SVG('canvas').size(300, 300)
var rect = draw.rect(100, 100).attr({ fill: '#f06' })
```
The first argument can either be an id of the element or the selected element itself.
This will generate the following output:

```html
<div id="canvas">
	<svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" width="300" height="300">
		<rect width="100" height="100" fill="#f06"></rect>
	</svg>
</div>
```

By default the svg canvas follows the dimensions of its parent, in this case `#canvas`:

```javascript
var draw = SVG('canvas').size('100%', '100%')
```

### Checking for SVG support

By default this library assumes the client's browser supports SVG. You can test support as follows:

```javascript
if (SVG.supported) {
  var draw = SVG('canvas')
  var rect = draw.rect(100, 100)
} else {
  alert('SVG not supported')
}
```

### ViewBox

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

If the size of the viewbox equals the size of the svg canvas, the zoom value will be 1.

### Nested svg
With this feature you can nest svg documents within each other. Nested svg documents have exactly the same features as the main, top-level svg document:

```javascript
var nested = draw.nested()

var rect = nested.rect(200, 200)
```


_This functionality requires the nested.js module which is included in the default distribution._


### SVG document
Svg.js also works outside of the HTML DOM, inside an SVG document for example:

```xml
<?xml version="1.0" encoding="utf-8" ?>
<svg id="viewport" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" >
  <script type="text/javascript" xlink:href="svg.min.js"></script>
  <script type="text/javascript">
    <![CDATA[
      var draw = SVG('viewport')
      draw.rect(100,100).animate().fill('#f03').move(100,100)
    ]]>
  </script>
</svg>
```


## Elements

### Rect
Rects have two arguments, their `width` and `height`:

```javascript
var rect = draw.rect(100, 100)
```


### Ellipse
Ellipses, like rects, have two arguments, their `width` and `height`:

```javascript
var ellipse = draw.ellipse(200, 100)
```

### Circle
The only argument necessary for a circle is the diameter:

```javascript
var circle = draw.circle(100)
```

_Note that this generates an `<ellipse>` element instead of a `<circle>`. This choice has been made to keep the size of the library down._


### Line
The line element always takes four arguments, `x1`, `y1`, `x2` and `y2`:

```javascript
var line = draw.line(0, 0, 100, 150).stroke({ width: 1 })
```


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


### Polygon
The polygon element, unlike the polyline element, defines a closed shape consisting of a set of connected straight line segments:

```javascript
// polygon('x,y x,y x,y')
var polygon = draw.polygon('0,0 100,50 50,100').fill('none').stroke({ width: 1 })
```

Polygon strings are exactly the same as polyline strings. There is no need to close the shape as the first and last point will be connected automatically.


### Path
The path string is similar to the polygon string but much more complex in order to support curves:

```javascript
// path('path data')
var path = draw.path('M10,20L30,40')
```

For more details on path data strings, please refer to the SVG documentation:
http://www.w3.org/TR/SVG/paths.html#PathData

Note that paths will always be positioned at x=0, y=0 on creation. This is to make the unified `move()` api possible. Svg.js assumes you are creating a path to move it afterwards. If you need to constantly update your path you probably don't want to use the `move()` method at all. In that case you can create an "unbiased" path like so:

```javascript
// path('path data', unbiased)
var path = draw.path('M10,20L30,40', true)
```

This logic is also applicable to polylines and polygons.


### Image
When creating images the `width` and `height` values should be defined:

```javascript
// image(src, width, height)
var image = draw.image('/path/to/image.jpg', 200, 200).move(100, 100)
```


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


### Use
The use element simply emulates another existing element. Any changes on the master element will be reflected on all the `use` instances. The usage of `use()` is very straightforward:

```javascript
var rect = draw.rect(100, 100).fill('#f09')
var use  = draw.use(rect).move(200, 200)
```

In the case of the example above two rects will appear on the svg canvas, the original and the `use` instance. In some cases you might want to hide the original element. the best way to do this is to create the original element in the defs node:

```javascript
var rect = draw.defs().rect(100, 100).fill('#f09')
var use  = draw.use(rect).move(200, 200)
```

In this way the rect element acts as a library element. You can edit it but it won't be rendered.


## Referencing elements

### By id
If you want to get an element created by svg.js by its id, you can use the `SVG.get()` method:

```javascript
var element = SVG.get('my_element')

element.fill('#f06')
```

### By class name
There is no DOM querying system built into svg.js but [jQuery](http://jquery.com/) or [Zepto](http://zeptojs.com/) will hep you achieve this. Here is an example:

```javascript
/* add elements */
var draw   = SVG('canvas')
var group  = draw.group().attr('class', 'my-group')
var rect   = group.rect(100,100).attr('class', 'my-element')
var circle = group.circle(100).attr('class', 'my-element').move(100, 100)

/* get elements in group */
var elements = $('#canvas g.my-group .my-element').each(function() {
  this.instance.animate().fill('#f09')
})
```

### Circluar reference
Every element instance within svg.js has a reference to the actual `node`:

```javascript
element.node
```

Similarly, the node carries a reference to the svg.js `instance`:

```javascript
node.instance
```


## Manipulating elements

### Attributes
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



### Transform
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


### Style
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


### Move 
Move the element to a given `x` and `y` position by its upper left corner:

```javascript
rect.move(200, 350)
```

This will have the same effect as:

```javascript
rect.x(200).y(350)
```

Note that you can also use the following code to move elements around:

```javascript
rect.attr({ x: 20, y: 60 })
``` 

Although `move()` is much more convenient because it will always use the upper left corner as the position reference, whereas with using `attr()` the `x` and `y` reference differ between element types. For example, rect uses the upper left corner with the `x` and `y` attributes, circle and ellipse use their center with the `cx` and `cy` attributes and thereby simply ignoring the `x` and `y` values you might assign.

The `text` element has one optional argument:

```javascript
// move(x, y, anchor)
rect.move(200, 350, true)
```

The third argument can be used to move the text element by its anchor point rather than the calculated left top position. This can also be used on the individual axes:

```javascript
rect.x(200, true).y(350, true)
```


### Center
This is an extra method to move an element by its center:

```javascript
rect.center(150, 150)
```

This will have the same effect as:

```javascript
rect.cx(150).cy(150)
```

The `text` element has one optional argument:

```javascript
// center(x, y, anchor)
rect.center(150, 150, true)
```

The third argument can be used to center the text element by its anchor point rather than the calculated center position. This can also be used on the individual axes:

```javascript
rect.cx(150, true).cy(150, true)
```


### Size
Set the size of an element by a given `width` and `height`:

```javascript
rect.size(200, 300)
```

Same as with `move()` the size of an element could be set by using `attr()`. But because every type of element is handles its size differently the `size()` method is much more convenient.

### Size (centered)
Set the size of an element by a given `width` and `height`, but maintains the
center:

```javascript
rect.sizeCentered(200, 300)
```

### Hide and show
We all love to have a little hide:

```javascript
rect.hide()
```

and show:

```javascript
rect.show()
```

To check if the element is visible:
```javascript
rect.visible()
```

### Removing elements
Pretty straightforward:

```javascript
rect.remove()
```

To remove all elements in the svg document:

```javascript
draw.clear()
```


### Bounding box

```javascript
path.bbox()
```
This will return an instance of `SVG.BBox` containing the following values:

```javascript
{ height: 20, width: 20, y: 20, x: 10, cx: 30, cy: 20 } 
```

As opposed to the native `getBBox()` method any translations used with the `transform()` method will be taken into account.

The `SVG.BBox` has one other nifty little feature, enter the `merge()` method. With `merge()` two `SVG.BBox` instances can be merged into one new instance, basically being the bounding box of the two original bounding boxes:

```javascript
var box1 = draw.rect(100,100).move(50,50)
var box2 = draw.rect(100,100).move(200,200)
var box3 = box1.merge(box2)
```

### Rectagular box
Is similar to `bbox()` but will give you the box around the exact representation of the element, taking all transformations into account.

```javascript
path.rbox()
```

This will return an instance of `SVG.RBox`.


### Iterating over all children

If you would iterate over all the `children` of the svg document, you might notice also the `<defs>` and `<g>` elements will be included. To iterate the shapes only, you can use the `each()` method: 

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

## Colors

Svg.js has a dedicated color module handling different types of colors. Accepted values are:

- hex string; three based (e.g. #f06) or six based (e.g. #ff0066)
- rgb string; e.g. rgb(255, 0, 102)
- rgb object; e.g. { r: 255, g: 0, b: 102 }

Note that when working with objects is important to provide all three values every time.


## Animating elements

### Invoking an animation
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

### Easing
All available ease types are:

- `<>`: ease in and out
- `>`: ease out
- `<`: ease in
- `-`: linear
- a function

For the latter, here is an example of the default `<>` function:

```javascript
function(pos) { return (-Math.cos(pos * Math.PI) / 2) + 0.5; }
```

For more easing equations, have a look at the [svg.easing.js](https://github.com/wout/svg.easing.js) plugin.

### Animatable methods
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

If you include the sugar.js module, `fill()`, `stroke()`, `rotate()`, `skew()`, `scale()`, `matrix()` and `opacity()` will be available as well:
```javascript
rect.animate().rotate(45).skew(25, 0)
```

You can also animate non-numeric unit values unsing the `attr()` method:
```javascript
rect.animate().attr('x', '10%').animate().attr('x', '50%')
```

### Stopping animations
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

### Synchronising animations
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

### Controlling animations externally
Say you want to control the position of an animation with an external event, then the `to()` method will proove very useful:

```javascript
var animate = draw.rect(100, 100).move(50, 50).animate('=').move(200, 200)

document.onmousemove = function(event) {
  animate.to(event.clientX / 1000)
}
```

In order to be able use the `to()` method the duration of the animation should be set to `'='`. The value passed as the first argument of `to()` should be a number between `0` and `1`, `0` being the beginning of the animation and `1` being the end. Note that any values below `0` and above `1` will be normalized.


### After animation callback
Finally, you can add callback methods using `after()`:

```javascript
rect.animate(3000).move(100, 100).after(function() {
  this.animate().attr({ fill: '#f06' })
})
```

_This functionality requires the fx.js module which is included in the default distribution._


## Syntax sugar

Fill and stroke are used quite often. Therefore two convenience methods are provided:

### Fill
The `fill()` method is a pretty alternative to the `attr()` method:

```javascript
rect.fill({ color: '#f06', opacity: 0.6 })
```

A single hex string will work as well:

```javascript
rect.fill('#f06')
```

### Stroke
The `stroke()` method is similar to `fill()`:

```javascript
rect.stroke({ color: '#f06', opacity: 0.6, width: 5 })
```

Like fill, a single hex string will work as well:

```javascript
rect.stroke('#f06')
```

### Opacity
To set the overall opacity of an element:

```javascript
rect.opacity(0.5)
```

### Rotate
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

### Skew
The `skew()` method will take an `x` and `y` value:

```javascript
// skew(x, y)
rect.skew(0, 45)
```

### Scale
The `scale()` method will take an `x` and `y` value:

```javascript
// scale(x, y)
rect.scale(0.5, -1)
```

### Translate
The `translate()` method will take an `x` and `y` value:

```javascript
// translate(x, y)
rect.translate(0.5, -1)
```

_This functionality requires the sugar.js module which is included in the default distribution._



## Masking elements
The easiest way to mask is to use a single element:

```javascript
var ellipse = draw.ellipse(80, 40).move(10, 10).fill({ color: '#fff' })

rect.maskWith(ellipse)
```

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

For your convenience, the masking element is also referenced in the masked element. This can be useful in case you want to change the mask:

```javascript
rect.masker.fill('#fff')
```

Unmasking the elements can be done with the `unmask()` method:

```javascript
rect.unmask()
```

Removing the mask alltogether will also `unmask()` all masked elements:

```javascript
rect.masker.remove()
```

The `unmask()` method returns the masking element. So if you would like to remove the 

_This functionality requires the mask.js module which is included in the default distribution._


## Clipping elements
Clipping elements is exactly the same as masking elements:

```javascript
var ellipse = draw.ellipse(80, 40).move(10, 10).fill({ color: '#fff' })

rect.clipWith(ellipse)
```

Similar to masking, the clipping element can be referenced in the clipped element:

```javascript
rect.clipper.move(20,30)
```

Unclipping the elements can be done with the `unclip()` method:

```javascript
rect.unclip()
```

Removing the clipPath alltogether will also `unclip()` all clipped elements:

```javascript
rect.clipper.remove()
```

_This functionality requires the clip.js module which is included in the default distribution._


## Arranging elements
You can arrange elements within their parent SVG document using the following methods.

Move element to the front:

```javascript
rect.front()
```

Move element to the back:

```javascript
rect.back()
```

Note that `back()` will move the element to position 0.

Move element one step forward:

```javascript
rect.forward()
```

Move element one step backward:

```javascript
rect.backward()
```

The arrange.js module brings some additional methods. To get all siblings of rect, including rect itself:

```javascript
rect.siblings()
```

Get the position (a number) of rect between its siblings:

```javascript
rect.position()
```

Get the next sibling:

```javascript
rect.next()
```

Get the previous sibling:

```javascript
rect.previous()
```

Insert an element before another:

```javascript
// inserts circle before rect
rect.before(circle)
```

Insert an element after another:

```javascript
// inserts circle after rect
rect.after(circle)
```

_This functionality requires the arrange.js module which is included in the default distribution._


## Grouping elements
Grouping elements is useful if you want to transform a set of elements as if it were one. All element within a group maintain their position relative to the group they belong to. A group has all the same element methods as the root svg document: 

```javascript
var group = draw.group()
group.path('M10,20L30,40')
```

Existing elements from the svg document can also be added to a group:

```javascript
group.add(rect)
```

_This functionality requires the group.js module which is included in the default distribution._


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

Quite a useful caracteristic of sets is the ability to accept multiple elements at once:

```javascript
set.add(rect, circle)
```

Sets work with animations as well:

```javascript
set.animate(3000).fill('#ff0')
```

A single element can be a member of many sets. Sets also don't have a structural representation, in fact they are just fancy array's.

Iterating over all members in a set is the same as with svg containers:

```javascript
set.each(function(i) {
  this.attr('id', 'shiny_new_id_' + i)
})
```

To remove an element from a set:

```javascript
set.remove(rect)
```

Or to remove all elements from a set:

```javascript
set.clear()
```


## Gradients

There are linear and radial gradients. The linear gradient can be created like this:

```javascript
var gradient = draw.gradient('linear', function(stop) {
  stop.at({ offset: 0, color: '#333', opacity: 1 })
  stop.at({ offset: 1, color: '#fff', opacity: 1 })
})
```

The `offset` and `color` parameters are required for stops, `opacity` is optional. Offset is float between 0 and 1, or a percentage value (e.g. `33%`). To define the direction you can set from `x`, `y` and to `x`, `y`:

```javascript
gradient.from(0, 0).to(0, 1)
```

The from and to values are also expressed in percent.
Finally, to use the gradient on an element:

```javascript
rect.attr({ fill: gradient })
```

Radial gradients have a `radius()` method to define the outermost radius to where the inner color should develop:

```javascript
var gradient = draw.gradient('radial', function(stop) {
  stop.at({ offset: 0, color: '#333', opacity: 1 })
  stop.at({ offset: 1, color: '#fff', opacity: 1 })
})

gradient.from(0.5, 0.5).to(0.5, 0.5).radius(0.5)
```

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

The `get()` method makes it even easier to get a stop from an existing gradient:

```javascript
var gradient = draw.gradient('radial', function(stop) {
  stop.at({ offset: 0, color: '#000', opacity: 1 })   // -> first
  stop.at({ offset: 0.5, color: '#f03', opacity: 1 }) // -> second
  stop.at({ offset: 1, color: '#066', opacity: 1 })   // -> third
})

var s1 = gradient.get(0) // -> returns "first" stop
```

[W3Schools](http://www.w3schools.com/svg/svg_grad_linear.asp) has a great example page on how
[linear gradients](http://www.w3schools.com/svg/svg_grad_linear.asp) and
[radial gradients](http://www.w3schools.com/svg/svg_grad_radial.asp) work.

_This functionality requires the gradient.js module which is included in the default distribution._


## Events
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

You can also bind event listeners to elements:

```javascript
var click = function() {
  rect.fill({ color: '#f06' })
};

rect.on('click', click)
```

Note that the context of event listeners is not the same as events, which are applied directly to the element. Therefore `this` will not refer to the element when using event listeners.

Unbinding events is just as easy:

```javascript
rect.off('click', click)
```

But there is more to event listeners. You can bind events to html elements as well:

```javascript
SVG.on(window, 'click', click)
```

Obviously unbinding is practically the same:

```javascript
SVG.off(window, 'click', click)
```

## Data
The `data()` method allows you to bind arbitrary objects, strings and numbers to SVG elements:

```javascript
rect.data('key', { value: { data: 0.3 }})
```

Fetching the values is similar to the `attr()` method:

```javascript
rect.data('key')
```

Removing the data altogether:

```javascript
rect.data('key', null)
```

Your values will always be stored as JSON and in some cases this might not be desirable. If you want to store the value as-is, just pass true as the third argument:

```javascript
rect.data('key', 'value', true)
```


## Memory

### Remember 
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


### Forget
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


## Extending functionality
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

- [svg.draggable.js](https://github.com/wout/svg.draggable.js) to make elements draggable.
- [svg.easing.js](https://github.com/wout/svg.easing.js) for more easing methods on animations.
- [svg.export.js](https://github.com/wout/svg.export.js) export raw SVG.
- [svg.filter.js](https://github.com/wout/svg.filter.js) adding svg filters to elements.
- [svg.foreignobject.js](https://github.com/john-memloom/svg.foreignobject.js) foreignObject implementation (by john-memloom).
- [svg.import.js](https://github.com/wout/svg.import.js) import raw SVG data.
- [svg.math.js](https://github.com/otm/svg.math.js) a math extension (by Nils Lagerkvist).
- [svg.path.js](https://github.com/otm/svg.path.js) for manually drawing paths (by Nils Lagerkvist).
- [svg.pattern.js](https://github.com/wout/svg.pattern.js) add fill patterns.
- [svg.shapes.js](https://github.com/wout/svg.shapes.js) for more polygon based shapes.


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
