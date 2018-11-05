import Doc from './Doc.js'

export default function parser () {
  // Reuse cached element if possible
  if (!parser.nodes) {
    let svg = new Doc().size(2, 0).css({
      opacity: 0,
      position: 'absolute',
      left: '-100%',
      top: '-100%',
      overflow: 'hidden'
    })

    let path = svg.path().node

    parser.nodes = { svg, path }
  }

  if (!parser.nodes.svg.node.parentNode) {
    let b = document.body || document.documentElement
    parser.nodes.svg.addTo(b)
  }

  return parser.nodes
}
