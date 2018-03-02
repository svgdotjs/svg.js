SVG.extend(SVG.Parent, {
  flatten: function (parent) {
    // flattens is only possible for nested svgs and groups
    if (!(this instanceof SVG.G || this instanceof SVG.Doc)) {
      return this
    }

    parent = parent || (this instanceof SVG.Doc && this.isRoot() ? this : this.parent(SVG.Parent))

    this.each(function () {
      if (this instanceof SVG.Defs) return this
      if (this instanceof SVG.Parent) return this.flatten(parent)
      return this.toParent(parent)
    })

    // we need this so that SVG.Doc does not get removed
    this.node.firstElementChild || this.remove()

    return this
  },
  ungroup: function (parent) {
    // ungroup is only possible for nested svgs and groups
    if (!(this instanceof SVG.G || (this instanceof SVG.Doc && !this.isRoot()))) {
      return this
    }

    parent = parent || this.parent(SVG.Parent)

    this.each(function () {
      return this.toParent(parent)
    })

    // we need this so that SVG.Doc does not get removed
    this.remove()

    return this
  }
})
