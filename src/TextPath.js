import {Path, Text, PathArray} from './classes.js'
import {nodeOrNew} from './tools.js'
import {xlink} from './namespaces.js'

export default class TextPath extends Text {
  // Initialize node
  constructor (node) {
    super(nodeOrNew('textPath', node))
  }

  // return the array of the path track element
  array () {
    var track = this.track()

    return track ? track.array() : null
  }

  // Plot path if any
  plot (d) {
    var track = this.track()
    var pathArray = null

    if (track) {
      pathArray = track.plot(d)
    }

    return (d == null) ? pathArray : this
  }

  // Get the path element
  track () {
    return this.reference('href')
  }
}

TextPath.constructors = {
  Container: {
    textPath (text, path) {
      return this.defs().path(path).text(text).addTo(this)
    }
  },
  Text: {
      // Create path for text to run on
    path: function (track) {
      var path = new TextPath()

      // if d is a path, reuse it
      if (!(track instanceof Path)) {
        // create path element
        track = this.doc().defs().path(track)
      }

      // link textPath to path and add content
      path.attr('href', '#' + track, xlink)

      // add textPath element as child node and return textPath
      return this.put(path)
    },

    // FIXME: make this plural?
    // Get the textPath children
    textPath: function () {
      return this.select('textPath')
    }
  },
  Path: {
    // creates a textPath from this path
    text: function (text) {
      if (text instanceof Text) {
        var txt = text.text()
        return text.clear().path(this).text(txt)
      }
      return this.parent().put(new Text()).path(this).text(text)
    }
    // FIXME: Maybe add `targets` to get all textPaths associated with this path
  }
}

TextPath.prototype.MorphArray = PathArray
