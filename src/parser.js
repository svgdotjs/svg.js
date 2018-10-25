import Doc from './Doc.js'

let parser = function () {
  if (!parser.nodes.svg.node.parentNode) {
    let b = document.body || document.documentElement
    parser.nodes.svg.addTo(b)
  }

  return parser.nodes
}

parser.nodes = {
  svg: new Doc().size(2, 0).css({
    opacity: 0,
    position: 'absolute',
    left: '-100%',
    top: '-100%',
    overflow: 'hidden'
  })
}

parser.nodes.path = parser.nodes.svg.path().node

export default parser
