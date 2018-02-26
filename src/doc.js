SVG.Doc = SVG.invent({
  // Initialize node
  create: function (node) {
    this.constructor.call(this, node || SVG.create('svg'))

    // set svg element attributes and ensure defs node
    this.namespace().defs()
  },

  // Inherit from
  inherit: SVG.Container,

  // Add class methods
  extend: {
    // Add namespaces
    namespace: function () {
      return this
        .attr({ xmlns: SVG.ns, version: '1.1' })
        .attr('xmlns:xlink', SVG.xlink, SVG.xmlns)
        .attr('xmlns:svgjs', SVG.svgjs, SVG.xmlns)
    },
    // Creates and returns defs element
    defs: function () {
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
    },
    toNested: function () {
      var el = SVG.create('svg')
      this.node.instance = null
      el.appendChild(this.node)

      return SVG.adopt(this.node)
    }
  }

})
