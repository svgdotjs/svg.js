// The main wrapping element
var SVG = this.SVG = function(element) {
  if (SVG.supported) {
    element = new SVG.Doc(element)

    if (!SVG.parser)
      SVG.prepare(element)

    return element
  }
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

// Initialize parsing element
SVG.prepare = function(element) {
  /* select document body and create invisible svg element */
  var body = document.getElementsByTagName('body')[0]
    , draw = (body ? new SVG.Doc(body) : element.nested()).size(2, 0)
    , path = SVG.create('path')

  /* insert parsers */
  draw.node.appendChild(path)

  /* create parser object */
  SVG.parser = {
    body: body || element.parent
  , draw: draw.style('opacity:0;position:fixed;left:100%;top:100%;overflow:hidden')
  , poly: draw.polyline().node
  , path: path
  }
}

// svg support test
SVG.supported = (function() {
  return !! document.createElementNS &&
         !! document.createElementNS(SVG.ns,'svg').createSVGRect
})()

if (!SVG.supported) return false
