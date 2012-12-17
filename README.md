# svg.js

svg.js is a small JavaScript library for manipulating SVG.

Have a look at [svgjs.com](http://svgjs.com) for a examples.

svg.js is licensed under the terms of the MIT License.


## Usage

### Create a SVG document

Use the svg() function to create a SVG document within a given html element:

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

### Path elements

```javascript
var path = draw.path({ data: "M10,20L30,40" }).attr({ fill: '#9dffd3' });
```

For more details on path data strings, check SVG documentation:
http://www.w3.org/TR/SVG/paths.html#PathData


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