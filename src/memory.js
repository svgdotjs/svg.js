SVG.extend(SVG.Element, {
   // Initialize local memory object
  _memory: {}

  // Remember arbitrary data
, remember: function(k, v) {
    /* remember every item in an object individually */
    if (typeof arguments[0] == 'object')
      for (var v in k)
        this.remember(v, k[v])

    /* retrieve memory */
    else if (arguments.length == 1)
      return this._memory[k]

    /* store memory */
    else
      this._memory[k] = v

    return this
  }

  // Erase a given memory
, forget: function() {
    if (arguments.length == 0)
      this._memory = {}
    else
      for (var i = arguments.length - 1; i >= 0; i--)
        delete this._memory[arguments[i]]

    return this
  }

})