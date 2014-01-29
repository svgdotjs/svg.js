
// Use the `SVG()` function to create a SVG document within a given html element. The first argument can either be an id of the element or the selected element itself.
//
//     var draw = SVG('paper').size(300, 300)
//     var rect = draw.rect(100, 100).attr({ fill: '#f06' })



// The main wrapping element
this.SVG = function(element) {
  if (SVG.supported)
    return new SVG.Doc(element)
}

// Default namespaces
SVG.ns    = 'http://www.w3.org/2000/svg'
SVG.xmlns = 'http://www.w3.org/2000/xmlns/'
SVG.xlink = 'http://www.w3.org/1999/xlink'

// Element id sequence
SVG.did  = 1000

// Get next named element id
SVG.eid = function(name) {
  return 'Svgjs' + name.charAt(0).toUpperCase() + name.slice(1) + (SVG.did++)
}

// Method for element creation
SVG.create = function(name) {
  /* create element */
  var element = document.createElementNS(this.ns, name)
  
  /* apply unique id */
  element.setAttribute('id', this.eid(name))
  
  return element
}

// Method for extending objects
SVG.extend = function() {
  var modules, methods, key, i
  
  /* get list of modules */
  modules = [].slice.call(arguments)
  
  /* get object with extensions */
  methods = modules.pop()
  
  for (i = modules.length - 1; i >= 0; i--)
    if (modules[i])
      for (key in methods)
        modules[i].prototype[key] = methods[key]

  /* make sure SVG.Set inherits any newly added methods */
  if (SVG.Set && SVG.Set.inherit)
    SVG.Set.inherit()
}

// Method for getting an eleemnt by id
SVG.get = function(id) {
  var node = document.getElementById(id)
  if (node) return node.instance
}

// svg support test
SVG.supported = (function() {
  return !! document.createElementNS &&
         !! document.createElementNS(SVG.ns,'svg').createSVGRect
})()

if (!SVG.supported) return false

// Initialize parsing element
SVG.parser = (function() {
  /* select document body and create svg element*/
  var body = document.getElementsByTagName('body')[0] || document.getElementsByTagName('svg')[0]
    , svg  = SVG.create('svg')
    , poly = SVG.create('polygon')
    , path = SVG.create('path')

  /* make svg element presently invisible to ensure geometry  */
  svg.setAttributeNS(SVG.xmlns, 'xmlns:xlink', SVG.xlink)
  svg.setAttribute('style', 'opacity:0;position:fixed;left:100%;top:100%')
  svg.setAttribute('width', '2')
  svg.setAttribute('height', '2')

  /* build node structure */
  body.appendChild(svg)
  svg.appendChild(poly)
  svg.appendChild(path)

  /* return parser object */
  return {
    body: body
  , doc:  svg
  , poly: poly
  , path: path
  }

})()