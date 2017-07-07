SVG.TextPath = SVG.invent({
  // Initialize node
  create: 'textPath'

  // Inherit from
, inherit: SVG.Text

  // Define parent class
, parent: SVG.Parent

  // Add parent method
, extend: {
    morphArray: SVG.PathArray
    // return the array of the path track element
  , array: function() {
      var track = this.track()

      return track ? track.array() : null
    }
    // Plot path if any
  , plot: function(d) {
      var track = this.track()
        , pathArray = null

      if (track) {
        pathArray = track.plot(d)
      }

      return (d == null) ? pathArray : this
    }
    // Get the path element
  , track: function() {
      return this.reference('href')
    }
  }
, construct: {
    textPath: function(text, path) {
      return this.defs().path(path).text(text).addTo(this)
    }
  }
})

SVG.extend([SVG.Text], {
    // Create path for text to run on
  path: function(track) {
    var path = new SVG.TextPath

    // if d is a path, reuse it
    if(!(track instanceof SVG.Path)) {
      // create path element
      track = this.doc().defs().path(track)
    }

    // link textPath to path and add content
    path.attr('href', '#' + track, SVG.xlink)

    // add textPath element as child node and return textPath
    return this.put(path)
  }
  // Todo: make this plural?
  // Get the textPath children
  , textPath: function() {
    return this.select('textPath')
  }
})

SVG.extend([SVG.Path], {
  // creates a textPath from this path
  text: function(text) {
    if(text instanceof SVG.Text) {
      var txt = text.text()
      return text.clear().path(this).text(txt)
    }
    return this.parent().put(new SVG.Text()).path(this).text(text)
  }
  // TODO: Maybe add `targets` to get all textPaths associated with this path
})
