import Base from './Base.js'
import {nodeOrNew} from './tools.js'
import {xlink} from './namespaces.js'

export default class A extends Base{
  constructor (node) {
    super(nodeOrNew('a', node), A)
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

A.constructors = {
  Container: {
    // Create a hyperlink element
    link: function (url) {
      return this.put(new A()).to(url)
    }
  },
  Element: {
    // Create a hyperlink element
    linkTo: function (url) {
      var link = new A()

      if (typeof url === 'function') { url.call(link, link) } else {
        link.to(url)
      }

      return this.parent().put(link).put(this)
    }
  }
}
