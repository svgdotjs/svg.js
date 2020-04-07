import Dom from './Dom.js'
import { globals } from '../utils/window.js'
import { register } from '../utils/adopter.js'
import Svg from './Svg.js'

class Fragment extends Dom {
  constructor (node = globals.document.createDocumentFragment()) {
    super(node)
  }

  // Import / Export raw svg
  svg (svgOrFn, outerHTML) {
    if (svgOrFn === false) {
      outerHTML = false
      svgOrFn = null
    }

    // act as getter if no svg string is given
    if (svgOrFn == null || typeof svgOrFn === 'function') {
      const wrapper = new Svg()
      wrapper.add(this.node.cloneNode(true))

      return wrapper.svg(svgOrFn, false)
    }

    // Act as setter if we got a string
    return super.svg(svgOrFn, false)
  }

}

register(Fragment, 'Fragment')

export default Fragment
