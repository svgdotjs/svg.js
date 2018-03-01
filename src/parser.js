
SVG.parser = function () {
  var b

  if (!SVG.parser.nodes.svg.node.parentNode) {
    b = document.body || document.documentElement
    SVG.parser.nodes.svg.addTo(b)
  }

  return SVG.parser.nodes
}

SVG.parser.nodes = {
  svg: SVG().size(2, 0).css({
    opacity: 0,
    position: 'absolute',
    left: '-100%',
    top: '-100%',
    overflow: 'hidden'
  })
}

SVG.parser.nodes.path = SVG.parser.nodes.svg.path().node
