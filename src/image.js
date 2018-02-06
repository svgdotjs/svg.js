SVG.Image = SVG.invent({
  // Initialize node
  create: 'image'

  // Inherit from
, inherit: SVG.Shape

  // Add class methods
, extend: {
    remove: function() {
        SVG.Element.prototype.remove.call(this);
        SVG.off(this.img);
        return this
    }
    // (re)load image
    , load: function(url) {
        if (!url) return this

        var self = this;
        this.img  = new window.Image()

        // preload image
        SVG.on(this.img, 'load', function() {
            var p = self.parent(SVG.Pattern)

            if(p === null) return

            // ensure image size
            if (self.width() == 0 && self.height() == 0)
                self.size(self.img.width, self.img.height)

            // ensure pattern size if not set
            if (p && p.width() == 0 && p.height() == 0)
                p.size(self.width(), self.height())

            // callback
            if (typeof self._loaded === 'function')
                self._loaded.call(self, {
                    width:  self.img.width
                    , height: self.img.height
                    , ratio:  self.img.width / img.height
                    , url:    url
                })
        })

        SVG.on(this.img, 'error', function(e){
            if (typeof self._error === 'function'){
                self._error.call(self, e)
            }

        })

        return this.attr('href', (this.img.src = this.src = url), SVG.xlink)
    }
    // Add loaded callback
    , loaded: function(loaded) {
        this._loaded = loaded
        return this
    }

    , error: function(error) {
        this._error = error
        return this
    }
  }
  
  // Add parent method
, construct: {
    // create image element, load image and set its size
    image: function(source, width, height) {
      return this.put(new SVG.Image).load(source).size(width || 0, height || width || 0)
    }
  }

})