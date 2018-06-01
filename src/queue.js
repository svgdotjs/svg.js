SVG.Queue = SVG.invent({
  create: function () {
    this._first = null
    this._last = null
  },

  extend: {
    push: function (value) {

      // An item stores an id and the provided value
      var item = value.next ? value : { value: value, next: null, prev: null }

      // Deal with the queue being empty or populated
      if (this._last) {
        item.prev = this._last
        this._last.next = item
        this._last = item
      } else {
        this._last = item
        this._first = item
      }

      // Update the length and return the current item
      return item
    },

    shift: function () {

      // Check if we have a value
      var remove = this._first
      if (!remove) return null

      // If we do, remove it and relink things
      this._first = remove.next
      if (this._first) this._first.prev = null
      this._last = this._first ? this._last : null
      return remove.value
    },

    // Shows us the first item in the list
    first: function () {
      return this._first && this._first.value
    },

    // Shows us the last item in the list
    last: function () {
      return this._last && this._last.value
    },

    // Removes the item that was returned from the push
    remove: function (item) {

      // Relink the previous item
      if (item.prev) item.prev.next = item.next
      if (item.next) item.next.prev = item.prev
      if (item === this._last) this._last = item.prev
      if (item === this._first) this._first = item.next

      // Invalidate item
      item.prev = null
      item.next = null
    }
  }
})
