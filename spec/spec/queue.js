
describe ('SVG.Queue()', function () {

  describe('first ()', function () {

    it('returns null if no item in the queue', function () {
      var queue = new SVG.Queue()
      expect(queue.first()).toEqual(null)
    })

    it ('returns the first value in the queue', function () {
      var queue = new SVG.Queue()
      queue.push(1)
      expect(queue.first()).toBe(1)
      queue.push(2)
      expect(queue.first()).toBe(1)
    })
  })

  describe('last ()', function () {

    it ('returns null if no item in the queue', function () {
      var queue = new SVG.Queue()
      expect(queue.last()).toEqual(null)
    })

    it ('returns the last value added', function () {
      var queue = new SVG.Queue()
      queue.push(1)
      expect(queue.last()).toBe(1)
      queue.push(2)
      expect(queue.last()).toBe(2)
    })
  })

  describe('push ()', function () {

    it ('adds an element to the end of the queue', function () {
      var queue = new SVG.Queue()
      queue.push(1)
      queue.push(2)
      queue.push(3)

      expect(queue.first()).toBe(1)
      expect(queue.last()).toBe(3)
    })

    it ('changes the length when you add things', function () {
      var queue = new SVG.Queue()
      queue.push(1)
      expect(queue.length).toBe(1)
      queue.push(2)
      expect(queue.length).toBe(2)
    })
  })

  describe('remove ()', function () {
    it('removes an item from the queue which matches the matcher', function () {
      var queue = new SVG.Queue()
      queue.push(1)
      queue.push(2)
      queue.push(3)

      queue.remove(function(item) {
        return item.value == 3
      })

      expect(queue.length).toBe(2)
      expect(queue.last()).toBe(2)
      expect(queue.first()).toBe(1)
    })

    it('removes no item from the queue if nothing is matched', function () {
      var queue = new SVG.Queue()
      queue.push(1)
      queue.push(2)
      queue.push(3)

      queue.remove(function(item) {
        return item.value == 4
      })

      expect(queue.length).toBe(3)
      expect(queue.last()).toBe(3)
      expect(queue.first()).toBe(1)
    })
  })

  describe('shift ()', function () {
    it('returns nothing if queue is empty', function () {
      var queue = new SVG.Queue()
      var val = queue.shift()
      expect(val).toBeFalsy()
    })

    it('returns the first item of the queue and removes it', function () {
      var queue = new SVG.Queue()
      queue.push(1)
      queue.push(2)
      queue.push(3)

      var val = queue.shift()

      expect(queue.length).toBe(2)
      expect(queue.last()).toBe(3)
      expect(queue.first()).toBe(2)

      expect(val).toBe(1)
    })
  })
})
