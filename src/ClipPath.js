import Base from './Base.js'
import {nodeOrNew, extend} from './tools.js'
import find from './selector.js'
import {remove} from './Element.js'

export default class ClipPath extends Base {
  constructor (node) {
    super(nodeOrNew('clipPath', node), ClipPath)
  }

  // Unclip all clipped elements and remove itself
  remove () {
    // unclip all targets
    this.targets().forEach(function (el) {
      el.unclip()
    })

    // remove clipPath from parent
    return remove.call(this)
  }

  targets () {
    return find('svg [clip-path*="' + this.id() + '"]')
  }
}


ClipPath.constructors = {
  Container: {
    // Create clipping element
    clip: function() {
      return this.defs().put(new ClipPath)
    }
  },
  Element: {
    // Distribute clipPath to svg element
    clipWith (element) {
      // use given clip or create a new one
      let clipper = element instanceof ClipPath
        ? element
        : this.parent().clip().add(element)

      // apply mask
      return this.attr('clip-path', 'url("#' + clipper.id() + '")')
    },

    // Unclip element
    unclip () {
      return this.attr('clip-path', null)
    },

    clipper () {
      return this.reference('clip-path')
    }
  }
}
