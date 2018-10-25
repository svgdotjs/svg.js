SVG.EventTarget = SVG.invent({
  create: function () {},
  extend: {
    // Bind given event to listener
    on: function (event, listener, binding, options) {
      SVG.on(this, event, listener, binding, options)
      return this
    },
    // Unbind event from listener
    off: function (event, listener) {
      SVG.off(this, event, listener)
      return this
    },
    dispatch: function (event, data) {
      return SVG.dispatch(this, event, data)
    },
    // Fire given event
    fire: function (event, data) {
      this.dispatch(event, data)
      return this
    }
  }
})
