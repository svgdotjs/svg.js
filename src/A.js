import {Container, Element} from './classes.js'
import {nodeOrNew, addFactory} from './tools.js'
import {xlink} from './namespaces.js'

export default class A extends Container {
  constructor (node) {
    super(nodeOrNew('a', node))
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

addFactory(Container, {
  // Create a hyperlink element
  link: function (url) {
    return this.put(new A()).to(url)
  }
})

addFactory(Element, {
  // Create a hyperlink element
  linkTo: function (url) {
    var link = new A()

    if (typeof url === 'function') { url.call(link, link) } else {
      link.to(url)
    }

    return this.parent().put(link).put(this)
  }
})
