SVG.Queue = SVG.invent({
  create: function () {
    this._first = null
    this._last = null
    this.length = 0
    this.id = 0
  },

  extend: {
    push: function (value) {

      // An item stores an id and the provided value
      var item = { id: this.id++, value: value }

      // Deal with the queue being empty or populated
      if (this._last) {
        this._last = this._last.next = item
      } else {
        this._last = this._first = item
      }

      this.length++
    },

    shift: function () {
      if (this.length == 0) {
        return
      }

      var remove = this._first
      this._first = remove.next
      this._last = --this.length ? this._last : null
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

    // Removes the first item from the front where matcher returns true
    remove: function (matcher) {
      // Find the first match
      var previous = null
      var current = this._first
      while (current) {

        // If we have a match, we are done
        if (matcher(current)) break

        // Otherwise, advance both of the pointers
        previous = current
        current = current.next
      }

      // If we got the first item, adjust the first pointer
      if (current && current === this._first)
        this._first = this._first.next

      // If we got the last item, adjust the last pointer
      if (current && current === this._last)
        this._last = previous

      // If we got an item, fix the list and return the item
      if (current) {
        --this.length

        if (previous) {
          previous.next = current.next
        }

        return current.item
      }
    }
  }
})
