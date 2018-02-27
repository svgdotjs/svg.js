SVG.Image = SVG.invent({
  // Initialize node
  create: 'image',

  // Inherit from
  inherit: SVG.Shape,

  // Add class methods
  extend: {
    // (re)load image
    load: function (url, callback) {
      if (!url) return this

      var img = new window.Image()

      SVG.on(img, 'load', function (e) {
        var p = this.parent(SVG.Pattern)

        // ensure image size
        if (this.width() === 0 && this.height() === 0) {
          this.size(img.width, img.height)
        }

        if (p instanceof SVG.Pattern) {
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

      SVG.on(img, 'load error', function () {
        // dont forget to unbind memory leaking events
        SVG.off(img)
      })

      return this.attr('href', (img.src = url), SVG.xlink)
    }
  },

  // Add parent method
  construct: {
    // create image element, load image and set its size
    image: function (source, callback) {
      return this.put(new SVG.Image()).size(0, 0).load(source, callback)
    }
  }
})
