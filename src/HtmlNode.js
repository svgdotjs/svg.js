/* global createElement */

SVG.HtmlNode = SVG.invent({
  inherit: SVG.EventTarget,
  create: function (element) {
    this.node = element
  },

  extend: {
    add: function (element, i) {
      element = createElement(element)

      if (element.node !== this.node.children[i]) {
        this.node.insertBefore(element.node, this.node.children[i] || null)
      }

      return this
    },

    put: function (element, i) {
      this.add(element, i)
      return element
    },

    getEventTarget: function () {
      return this.node
    }
  }
})
