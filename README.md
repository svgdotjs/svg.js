# svg.js

A lightweight library for manipulating SVG.

Svg.js is licensed under the terms of the MIT License.

The base library is 2.7k gzipped, with all bells and whistles just under 5k.

## Usage

### Create a SVG document

Use the `svg()` function to create a SVG document within a given html element:

```javascript
var draw = svg('paper').size(300, 300);
var rect = draw.rect(100, 100).attr({ fill: '#f06' });
```
The first argument can either be an id of the element or the selected element itself.
This will generate the following output:

```html
<div id="paper">
	<svg xmlns="http://www.w3.org/2000/svg" version="1.1" xlink="http://www.w3.org/1999/xlink" width="300" height="300">
		<rect width="100" height="100" fill="#f06"></rect>
	</svg>
</div>
```
By default the svg canvas follows the dimensions of its parent, in this case `#paper`:
```javascript
var draw = svg('paper').size('100%', '100%');
```


## Elements

### Rect
Rects have two arguments, their `width` and `height`:

```javascript
var text = draw.rect(100, 100);
```


### Ellipse
Ellipses, like rects, have two arguments, their `width` and `height`:

```javascript
var ellipse = draw.ellipse(100, 100);
```

### Circle
The only argument necessary for a circle is the diameter:

```javascript
var circle = draw.circle(100);
```

_Note that this generates an `<ellipse>` element instead of a `<circle>`. This choice has been made to keep the size of the library down._


### Polyline
The polyline element defines a set of connected straight line segments. Typically, polyline elements define open shapes:

```javascript
// polyline('x,y x,y x,y')
var polyline = draw.polyline('10,20 30,40 50,60');
```

Polyline strings consist of a list of points separated by spaces: `x,y x,y x,y`.

_Not unlike the `<circle>` element, the svg `<line>` element has not been implemented to keep the library as small as possible. Therefore you might want to use the `polyline()` method to create a single line segment._


### Polygon
The polygon element, unlike the polyline element, defines a closed shape consisting of a set of connected straight line segments:

```javascript
// polygon('x,y x,y x,y')
var polygon = draw.polygon('10,20 30,40 50,60');
```

Polygon strings are exactly the same as polyline strings. There is no need to close the shape as the first and last point will be connected automatically.


### Path
The path string is similar to the polygon string but much more complex in order to support curves:

```javascript
// path('path data')
var path = draw.path('M10,20L30,40');
```

For more details on path data strings, please refer to the SVG documentation:
http://www.w3.org/TR/SVG/paths.html#PathData


### Image
When creating images the `width` and `height` values should be defined:

```javascript
// image(src, width, height)
var image = draw.image('/path/to/image.jpg', 200, 200).move(100, 100);
```


### Text
The first argument of a text element is the actual text content:
```javascript
var text = draw.text("svg\nto\nthe\npoint.").move(300, 0);
```
Changing text afterwards is also possible with the `text()` method:
```javascript
text.text('Brilliant!');
```
To get the raw text content:
```javascript
text.content;
```
The sugar.js module provides some syntax sugar specifically for this element type:
```javascript
text.font({
  family:   'Helvetica',
  size:     144,
  anchor:   'middle',
  leading:  1.5
});
```


## Manipulating elements

### Attributes
You can get and set an element's attributes directly using `attr()`:

```javascript
// get a single attribute
rect.attr('x');

// set a single attribute
rect.attr('x', 50);

// set multiple attributes at once
rect.attr({
  fill: '#f06',
  'fill-opacity': 0.5,
  stroke: '#000',
  'stroke-width': 10
});

// set an attribute with a namespace
rect.attr('x', 50, 'http://www.w3.org/2000/svg');
```


### Transform
With the `transform()` method elements can be scaled, rotated, translated and skewed:

```javascript
rect.transform({
  rotation: 45,
  cx:       100,
  cy:       100
});
```

All available transformations are:

```javascript
rect.transform({
  x:        [translation on x-axis],
  y:        [translation on y-axis],
  rotation: [degrees],
  cx:       [x rotation point],
  cy:       [y rotation point],
  scaleX:   [scaling on x-axis],
  scaleX:   [scaling on y-axis],
  skewX:    [skewing on x-axis],
  skewY:    [skewing on y-axis]
});
```

Important: matrix transformations are not yet supported.


### Move 
Move the element to a given `x` and `y` position by its upper left corner:

```javascript
rect.move(200, 350);
```

Note that you can also use the following code to move elements around:

```javascript
rect.attr({ x: 20, y: 60 });
``` 

Although `move()` is much more convenient because it will always use the upper left corner as the position reference, whereas with using `attr()` the `x` and `y` reference differ between element types. For example, rect uses the upper left corner with the `x` and `y` attributes, circle and ellipse use their center with the `cx` and `cy` attributes and thereby simply ignoring the `x` and `y` values you might assign.


### Size
Set the size of an element by a given `width` and `height`:

```javascript
rect.size(200, 300);
```

Same as with `move()` the size of an element could be set by using `attr()`. But because every type of element is handles its size differently the `size()` method is much more convenient.


### Center
This is an extra method to move an element by its center:

```javascript
rect.center(150, 150);
```

### Hide and show
We all love to have a little hide:

```javascript
rect.hide();
```

and show:

```javascript
rect.show();
```

### Removing elements
Pretty straightforward:

```javascript
rect.remove();
```

To remove all elements in the svg document:

```javascript
draw.clear();
```


### Bounding box

```javascript
path.bbox();
```
This will return an object with the following values:

```javascript
{ height: 20, width: 20, y: 20, x: 10, cx: 30, cy: 20 } 
```

As opposed to the native `getBBox()` method any translations used with the `transform()` method will be taken into account. 


### Iterating over all children

If you would iterate over all the `children()` of the svg document, you might notice also the `<defs>` and `<g>` elements will be included. To iterate the shapes only, you can use the `each()` method: 

```javascript
draw.each(function(i, children) {
  this.fill({ color: '#f06' });
});
```


## Animating elements

Animating elements is very much the same as manipulating elements, the only difference is you have to include the `animate()` method:

```javascript
rect.animate().move(150, 150);
```

The `animate()` method will take two arguments. The first is `milliseconds`, the second `ease`:

```javascript
rect.animate(2000, '>').fill({ color: '#f03' });
```

By default `milliseconds` will be set to `1000`, `ease` will be set to `<>`. All available ease types are:

- `<>`: ease in and out
- `>`: ease out
- `<`: ease in
- `-`: linear
- a function

For the latter, here is an example of the default `<>` function:

```javascript
function(pos) { return (-Math.cos(pos * Math.PI) / 2) + 0.5; };
```

Note that the `animate()` method will not return the targeted element but an instance of SVG.FX which will take the following methods:

Of course `attr()`:
```javascript
rect.animate().attr({ fill: '#f03' });
```

The `move()` method:
```javascript
rect.animate().move(100, 100);
```

And the `center()` method:
```javascript
rect.animate().center(200, 200);
```

If you include the sugar.js module, `fill()`, `stroke()`, `animate()` and `skwe()` will be available as well:
```javascript
rect.animate().fill({ color: '#f03' }).stroke({ width: 10 });
```

Animations can be stopped in to ways.

By calling the `stop()` method:
```javascript
var rectfx = rect.animate().move(200, 200);

rectfx.stop();
```

Or by invoking another animation:
```javascript
var rectfx = rect.animate().move(200, 200);

rect.animate().center(200, 200);
```

Finally, you can add callback methods using `after()`:
```javascript
rect.animate(3000).move(100, 100).after(function() {
  this.animate().fill({ color: '#f06' });
});
```


## Syntax sugar

Fill and stroke are used quite often. Therefore two convenience methods are provided:

### Fill
The `fill()` method is a pretty alternative to the `attr()` method:
```javascript
rect.fill({ color: '#f06', opacity: 0.6 });
```

### Stroke
The `stroke()` method is similar to `fill()`:

```javascript
rect.stroke({ color: '#f06', opacity: 0.6, width: 5 });
```

### Rotate
The `rotate()` method will automatically rotate elements according to the center of the element:

```javascript
// rotate(degrees)
rect.rotate(45);
```

### Skew
The `skew()` method will take an `x` and `y` value:

```javascript
// skew(x, y)
rect.skew(0, 45);
```

_This functionality requires the sugar.js module which is included in the default distribution._



## Masking elements
The easiest way to mask is to use a single element:

```javascript
var ellipse = draw.ellipse(80, 40).move(10, 10).fill({ color: '#fff' });

rect.maskWith(ellipse);
```

But you can also use multiple elements:

```javascript
var ellipse = draw.ellipse(80, 40).move(10, 10).fill({ color: '#fff' });
var text = draw.text('SVG.JS').move(10, 10).font({ size: 36 }).fill({ color: '#fff' });

var mask = draw.mask().add(text).add(ellipse);

rect.maskWith(mask);
```

If you want the masked object to be rendered at 100% you need to set the fill color of the masking object to white. But you might also want to use a gradient:

```javascript
var gradient = image.parent.gradient('linear', function(stop) {
  stop.at({ offset: 0, color: '#000' });
  stop.at({ offset: 100, color: '#fff' });
});

var ellipse = draw.ellipse(80, 40).move(10, 10).fill({ color: gradient.fill() });

rect.maskWith(ellipse);
```

_This functionality requires the mask.js module which is included in the default distribution._


## Arranging elements
You can arrange elements within their parent SVG document using the following methods.

Move element to the front:

```javascript
rect.front();
```

Move element to the back:

```javascript
rect.back();
```

Note that `back()` will move the element to position 1, not 0, because the `<defs>` node is already located at position 0.

Move element one step forward:

```javascript
rect.forward();
```

Move element one step backward:

```javascript
rect.backward();
```

The arrange.js module brings some additional methods. To get all siblings of rect, including rect itself:

```javascript
rect.siblings();
```

Get the position (a number) of rect between its siblings:

```javascript
rect.position();
```

Get the next sibling:

```javascript
rect.next();
```

Get the previous sibling:

```javascript
rect.previous();
```


_This functionality requires the arrange.js module which is included in the default distribution._


## Grouping elements
Grouping elements is useful if you want to transform a set of elements as if it were one. All element within a group maintain their position relative to the group they belong to. A group has all the same element methods as the root svg document: 

```javascript
var group = draw.group();
group.path('M10,20L30,40');
```

Existing elements from the svg document can also be added to a group:

```javascript
group.add(rect);
```

_This functionality requires the group.js module which is included in the default distribution._



## Nested svg
With this feature you can nest svg documents within each other. Nested svg documents have exactly the same features as the main, top-level svg document:

```javascript
var nested = draw.nested();

var rect = nested.rect(200, 200);
```


_This functionality requires the nested.js module which is included in the default distribution._


## Gradients

There are linear and radial gradients. The linear gradient can be created like this:

```javascript
var gradient = draw.gradient('linear', function(stop) {
  stop.at({ offset: 0, color: '#333', opacity: 1 });
  stop.at({ offset: 100, color: '#fff', opacity: 1 });
});
```

The `offset` and `color` parameters are required for stops, `opacity` is optional. Offset is an integer expressed in percentage. To define the direction you can set from `x`, `y` and to `x`, `y`:

```javascript
gradient.from(0, 0).to(0, 100);
```

The from and to values are also expressed in percent.
Finally, to use the gradient on an element:

```javascript
rect.attr({ fill: gradient.fill() });
```

Radial gradients have a `radius()` method to define the outermost radius to where the inner color should develop:

```javascript
var gradient = draw.gradient('radial', function(stop) {
  stop.at({ offset: 0, color: '#333', opacity: 1 });
  stop.at({ offset: 100, color: '#fff', opacity: 1 });
});

gradient.from(50, 50).to(50, 50).radius(50);
```

A gradient can also be updated afterwards:

```javascript
gradient.update(function(stop) {
  stop.at({ offset: 10, color: '#333', opacity: 0.2 });
  stop.at({ offset: 90, color: '#f03', opacity: 1 });
});
```

And even a single stop can be updated:

```javascript
var s1, s2, s3;

draw.gradient('radial', function(stop) {
  s1 = stop.at({ offset: 0, color: '#000', opacity: 1 });
  s2 = stop.at({ offset: 50, color: '#f03', opacity: 1 });
  s3 = stop.at({ offset: 100, color: '#066', opacity: 1 });
});

s1.update({ offset: 10, color: '#0f0', opacity: 1 });
```

[W3Schools](http://www.w3schools.com/svg/svg_grad_linear.asp) has a great example page on how
[linear gradients](http://www.w3schools.com/svg/svg_grad_linear.asp) and
[radial gradients](http://www.w3schools.com/svg/svg_grad_radial.asp) work.

_This functionality requires the gradient.js module which is included in the default distribution._


## Events
All usual events are accessible on elements:

```javascript
rect.click(function() {
  this.fill({ color: '#f06' });
});
```

Available events are `click`, `dblclick`, `mousedown`, `mouseup`, `mouseover`, `mouseout`, `mousemove`, `touchstart`, `touchend`, `touchmove` and `touchcancel`.



## Extending functionality
Svg.js has a modular structure. It is very easy to add you own methods at different levels. Let's say we want to add a method to all shape types then we would add our method to SVG.Shape:

```javascript
SVG.extend(SVG.Shape, {
  paintRed: function() {
    return this.fill({ color: 'red' });
  }
});
```

Now all shapes will have the paintRed method available. Say we want to have the paintRed method on an ellipse apply a slightly different color:

```javascript
SVG.extend(SVG.Ellipse, {
  paintRed: function() {
    return this.fill({ color: 'orangered' });
  }
});

```
The complete inheritance stack for `SVG.Ellipse` is:

_SVG.Ellipse < SVG.Shape < SVG.Element_

The SVG document can be extended by using:

```javascript

SVG.extend(SVG.Doc, {
  paintAllPink: function() {
    var children = this.children();
    
    for (var i = 0, l = children.length; i < l; i++) {
      children[i].fill({ color: 'pink' });
    };
    
    return this;
  }
});
```


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

_The Rakefile has been borrowed from [madrobby's](https://github.com/madrobby) [Zepto](https://github.com/madrobby/zepto)_


## To-do
- Animation module (element animation, path tweens and easing)
- Draggable module (make elements and groups draggable)
- Shapes module (add preset shapes like star, n-gon)
- Text on path module (write text along paths)
- Nested SVG (add a svg document inside another svg document)



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

Important: this library is still in alpha, therefore the API might be subject to change in the course of development.
