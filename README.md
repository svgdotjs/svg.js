# Svg.js

Svg.js is a lightweight (2k gzipped) library for manipulating SVG.

Svg.js is licensed under the terms of the MIT License.

Important: this library is still in alpha, therefore the API might be subject to change in the course of development.


## Usage

### Create a SVG document

Use the 'svg()' function to create a SVG document within a given html element:

```javascript
var draw = svg('paper').size(300, 300);
var rect = draw.rect({ width:100, height:100 }).attr({ fill: '#f06' });
```
The first argument can either be an id of the element or the selected element itself.
This will generate the following output:

```html
<div id="paper">
	<svg xmlns="http://www.w3.org/2000/svg" version="1.1" xlink="http://www.w3.org/1999/xlink" width="300" height="300">
		<rect width="100" height="100" fill-color="#f06"></rect>
	</svg>
</div>
```

### Manipulating elements

#### Attributes
You can get and set an element's attributes directly using 'attr()':

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


#### Transform
With the transform attribute elements can be scaled, rotated, translated, skewed... :
```javascript
rect.transform('rotate(45, 100, 100)');
```
These operations are always absolute. If every transformation needs remembered, so multiple rotate operations will be stacked together making them relative to previous operations, a boolean value can be passed as a second argument:
```javascript
rect.transform('rotate(45, 100, 100)', true);
```
More details on available transformations can be found here:
http://www.w3.org/TR/SVG/coords.html#TransformAttribute


#### Move 
Move the element to a given x and y position by its upper left corner:
```javascript
rect.move(200, 350);
```
Note that you can also use the following code to move elements around:
```javascript
rect.attr({ x: 20, y: 60 });
``` 
Although 'move()' is much more convenient because it will always use the upper left corner as the position reference, whereas with using 'attr()' the x an y reference differ between element types. For example, rect uses the upper left corner and circle uses the centre.


#### Size
Set the size of an element by a given width and height:
```javascript
rect.size(200, 300);
```
Same as with 'move()' the size of an element could be set by using 'attr()'. But because every type of element is handles its size differently the 'size()' method is much more convenient.


#### Removing elements
Pretty straightforward:
```javascript
rect.remove();
```


### Image element
When creating images the width and height values should be defined:
```javascript
var image = draw.image({
  width:  200,
  height: 200,
  x:      100,
  y:      100,
  src:    '/path/to/image.jpg'
});
```


### Path element
```javascript
var path = draw.path({ data: "M10,20L30,40" }).attr({ fill: '#9dffd3' });
```

For more details on path data strings, please read the SVG documentation:
http://www.w3.org/TR/SVG/paths.html#PathData


### Bounding box

```javascript
path.bbox();
```
This will return a SVGRect element as a js object:

```javascript
{ height: 20, width: 20, y: 20, x: 10 } 
```


### Syntax sugar
Fill and stroke are used quite often. Therefore two convenience methods are provided:

#### Fill
The 'fill()' method is a pretty alternative to the 'attr()' method:
```javascript
rect.fill({ color: '#f06', opacity: 0.6 });
```

#### Stroke
The 'stroke()' method is similar to 'fill()':
```javascript
rect.stroke({ color: '#f06', opacity: 0.6, width: 5 });
```

#### Rotate
The 'rotate()' method will automatically rotate elements according to the centre of the element:
```javascript
rect.rotate({ deg: 45 });
```
But you also define a rotation point:
```javascript
rect.rotate({ deg: 45, x: 100, y: 100 });
```
To make the operation relative:
```javascript
rect.rotate({ deg: 45, x: 100, y: 100, relative: true });
```

_This functionality requires the sugar.js module which is included in the default distribution._


### Clipping elements
Clipping elements can be done with either 'clip()' or 'clipTo()'.

Using 'clip()' creates a clip path in the parents 'defs' node, and passes it to a block:

```javascript
rect.clip(function(clipPath) {
	clipPath.rect({ x:10, y:10, width:80, height:80 });
});
```

You can also reuse clip paths for multiple elements using 'clipTo()'.
```javascript
var clipPath = doc.defs().clipPath();
clipRect = clipPath.rect({ x:10, y:10, width:80, height:80 });
rect.clipTo(clipPath);
```

_This functionality requires the clip.js module which is included in the default distribution._


### Arranging elements
You can arrange elements within their parent SVG document using the following methods:

```javascript
// move element to the front
rect.front();

// move element to the back
rect.back();

// move element one step forward
rect.forward();

// move element one step backward
rect.backward();
```

_This functionality requires the arrange.js module which is included in the default distribution._


### Grouping elements
Grouping elements is useful if you want to transform a set of elements as if it were one. All element within a group maintain their position relative to the group they belong to. A group has all the same element methods as the root svg document: 
```javascript
var group = draw.group();
group.path({ data: "M10,20L30,40" });
```
Existing elements from the svg document can also be added to a group:
```javascript
group.add(rect);
```

_This functionality requires the group.js module which is included in the default distribution._


## Extending functionality
Svg.js has a modular structure. It is very easy to add you own methods at different levels. Let's say we want to add a method to all shape types then we would add our method to SVG.Shape:
```javascript
SVG.extend(SVG.Shape, {
  
  paintRed: function() {
    return this.fill({ color: 'red' });
  }
  
});
```
Now all shapes will have the paintRed method available. Say we want to have the paintRed method on a circle apply a slightly different color:
```javascript
SVG.extend(SVG.Circle, {
  
  paintRed: function() {
    return this.fill({ color: 'orangered' });
  }
  
});
```
The complete inheritance stack for 'SVG.Circle' is:

_SVG.Circle < SVG.Shape < SVG.Element_

The SVG document can be extended by using:

```javascript
SVG.extend(SVG.Doc, {
  
  paintAllPink: function() {
    var children = this.children();
    
    for (var i = 0, l = children.length; i < l; i++) {
      this.fill({ color: 'pink' });
    };
    
    return this;
  }
  
});
```


## To-do
- Animation module (element animation, path tweens and easing)
- Draggable module (make elements and groups draggable)
- Shapes module (add preset shapes like star, n-gon)



## Compatibility

### Desktop
- Firefox 3+
- Chrome 4+
- Safari 3.2+
- Opera 9+
- IE 9+

### Mobile
- iOS Safari 3.2+
- Android Browser 3+
- Blackberry 7+
- Opera Mini 5+
- Opera Mobile 10+
- Chrome for Android 18+
- Firefox for Android 15+