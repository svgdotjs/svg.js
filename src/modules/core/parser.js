import { globals } from '../../utils/window.js'
import { makeInstance } from '../../utils/adopter.js'

export default function parser () {
  // Reuse cached element if possible
  if (!parser.nodes) {
    let svg = makeInstance().size(2, 0)
    svg.node.style.cssText = [
      'opacity: 0',
      'position: absolute',
      'left: -100%',
      'top: -100%',
      'overflow: hidden'
    ].join(';')

    svg.attr('focusable', 'false')

    let path = svg.path().node

    parser.nodes = { svg, path }
  }

  if (!parser.nodes.svg.node.parentNode) {
    let b = globals.document.body || globals.document.documentElement
    parser.nodes.svg.addTo(b)
  }

  return parser.nodes
}
