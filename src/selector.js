// Method for getting an element by id
SVG.get = function(id) {
  var node = document.getElementById(idFromReference(id) || id)
  return SVG.adopt(node)
}

// Select elements by query string
SVG.select = function(query, parent) {
  return SVG.utils.map((parent || document).querySelectorAll(query), function(node) {
    return SVG.adopt(node)
  })
}

SVG.$$ = function(query, parent) {
  return SVG.utils.map((parent || document).querySelectorAll(query), function(node) {
    return SVG.adopt(node)
  })
}

SVG.$ = function(query, parent) {
  return SVG.adopt((parent || document).querySelector(query))
}

SVG.extend(SVG.Parent, {
  // Scoped select method
  select: function(query) {
    return SVG.select(query, this.node)
  }
})
