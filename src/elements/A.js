import { nodeOrNew, register, wrapWithAttrCheck } from '../utils/adopter.js'
import { registerMethods } from '../utils/methods.js'
import { xlink } from '../modules/core/namespaces.js'
import Container from './Container.js'

export default class A extends Container {
  constructor (node) {
    super(nodeOrNew('a', node), node)
  }

  // Link url
  to (url) {
    return this.attr('href', url, xlink)
  }

  // Link target attribute
  target (target) {
    return this.attr('target', target)
  }
}

registerMethods({
  Container: {
    // Create a hyperlink element
    link: wrapWithAttrCheck(function (url) {
      return this.put(new A()).to(url)
    })
  },
  Element: {
    // Create a hyperlink element
    linkTo: function (url) {
      var link = new A()

      if (typeof url === 'function') {
        url.call(link, link)
      } else {
        link.to(url)
      }

      return this.parent().put(link).put(this)
    }
  }
})

register(A, 'A')
