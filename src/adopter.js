// Adopt existing svg elements
SVG.adopt = function(node) {
  // Make sure a node isn't already adopted
  if (node.instance) return node.instance

  // Initialize variables
  var element

  // Adopt with element-specific settings
  if (node.nodeName == 'svg')
    element = node.parentNode instanceof SVGElement ? new SVG.Nested : new SVG.Doc
  else if (node.nodeName == 'lineairGradient')
    element = new SVG.Gradient('lineair')
  else if (node.nodeName == 'radialGradient')
    element = new SVG.Gradient('radial')
  else
    element = new SVG[capitalize(node.nodeName)]

  // Ensure references
  element.type  = node.nodeName
  element.node  = node
  node.instance = element

  // SVG.Class specific preparations
  if (element instanceof SVG.Doc)
    element.namespace().defs()

  return element
}