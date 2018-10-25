import Shape from './Shape.js'
import Container from './Container.js'
import Pattern from './Pattern.js'
import {on, off} from './event.js'
import {nodeOrNew, addFactory} from './tools.js'
import {xlink} from './namespaces.js'

export default class Image extends Shape {
  constructor (node) {
    super(nodeOrNew('image', node))
  }

  // (re)load image
  load (url, callback) {
    if (!url) return this

    var img = new window.Image()

    on(img, 'load', function (e) {
      var p = this.parent(Pattern)

      // ensure image size
      if (this.width() === 0 && this.height() === 0) {
        this.size(img.width, img.height)
      }

      if (p instanceof Pattern) {
        // ensure pattern size if not set
        if (p.width() === 0 && p.height() === 0) {
          p.size(this.width(), this.height())
        }
      }

      if (typeof callback === 'function') {
        callback.call(this, {
          width: img.width,
          height: img.height,
          ratio: img.width / img.height,
          url: url
        })
      }
    }, this)

    on(img, 'load error', function () {
      // dont forget to unbind memory leaking events
      off(img)
    })

    return this.attr('href', (img.src = url), xlink)
  }
}

addFactory(Container, {
  // create image element, load image and set its size
  image (source, callback) {
    return this.put(new Image()).size(0, 0).load(source, callback)
  }
})
