SVG.Doc = SVG.invent({
  // Initialize node
  create: function (node) {
    this.constructor(node || SVG.create('svg'))

    // set svg element attributes and ensure defs node
    this.namespace().defs()
  },

  // Inherit from
  inherit: SVG.Container,

  // Add class methods
  extend: {
    isRoot: function() {
      return !this.node.parentNode || !this.node.parentNode instanceof window.SVGElement || this.node.parentNode.nodeName == '#document'
    },
    doc: function() {
      if(this.isRoot()) return this

      var parent
      while(parent = this.parent(SVG.Doc)) {
        if(parent.isRoot()) return parent
      }

      // this can only happen when you have something like
      // <g><svg>...</svg></g>
      return null
    },
    // Add namespaces
    namespace: function() {
      if(!this.isRoot()) return this.doc().namespace()
      return this
        .attr({ xmlns: SVG.ns, version: '1.1' })
        .attr('xmlns:xlink', SVG.xlink, SVG.xmlns)
        .attr('xmlns:svgjs', SVG.svgjs, SVG.xmlns)
    },
    // Creates and returns defs element
    defs: function() {
      if(!this.isRoot()) return this.doc().defs()
      return SVG.adopt(this.node.getElementsByTagName('defs')[0]) || this.put(new SVG.Defs())
    },
    // custom parent method
    parent: function () {
      return this.node.parentNode.nodeName === '#document' ? null : this.node.parentNode
    },
    // Removes the doc from the DOM
    remove: function () {
      if (this.parent()) {
        this.parent().removeChild(this.node)
      }

      return this
    },
    clear: function () {
      // remove children
      while (this.node.hasChildNodes()) {
        this.node.removeChild(this.node.lastChild)
      }
      return this
    }
  },
  construct: {
    // Create nested svg document
    nested: function() {
      return this.put(new SVG.Doc)
    }
  }
})
