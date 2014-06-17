// Method for getting an element by id
SVG.get = function(id) {
  var node = document.getElementById(idFromReference(id) || id)
  if (node) return node.instance
}