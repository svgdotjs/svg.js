# svg.js

svg.js is a small JavaScript library for manipulating SVG.

Have a look at [svgjs.com](http://svgjs.com) for a examples.

svg.js is licensed under the terms of the MIT License.


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

#### Setting attributes
You can set an element's attributes directly with 'attr()':

```javascript
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
rect.setAttribute('x', 50, 'http://www.w3.org/2000/svg');
```

#### Move 
Move the element to a given x and y position by its upper left corner:
```javascript
rect.move(200, 350);
```
Note that you can also use the following code to move elements around:
```javascript
rect.attr({ x: 20, y: 60 })
``` 
Although 'move()' is much more convenient because it will also use the upper left corner as the position reference, whereas with using 'attr()' the x an y reference differ between element types. For example, rect uses the upper left corner and circle uses the center.


#### Size
Set the size of an element by a given width and height:
```javascript
rect.size(200, 300);
```
Same as with 'move()' the size of an element could be set by using 'attr()'. But because every type of element is handles its size differently the 'size()' function is much more convenient.


#### Fill
The 'fill()' function is a pretty alternative to the 'attr()' method:
```javascript
rect.fill({ color: '#f06', opacity: 0.6 });
```

#### Stroke
The 'stroke()' function is similar to 'fill()':
```javascript
rect.stroke({ color: '#f06', opacity: 0.6, width: 5 });
```

#### Removing elements
Pretty straightforward:
```javascript
rect.remove();
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