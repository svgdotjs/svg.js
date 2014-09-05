describe('Event', function() {
  var rect, context
    , toast = null
    , action = function() {
        toast = 'ready'
        context = this
      }

  beforeEach(function() {
    rect = draw.rect(100, 100)
  })

  afterEach(function() {
    toast = context = null
  })

  if (!window.isTouchDevice) {

    describe('click()', function() {
      it('attaches an onclick event to the node of the element', function() {
        expect(typeof rect.node.onclick).not.toBe('function')
        rect.click(action)
        expect(typeof rect.node.onclick).toBe('function')
      })
      it('fires the event on click', function() {
        dispatchEvent(rect.click(action), 'click')
        expect(toast).toBe('ready')
      })
      it('applies the element as context', function() {
        dispatchEvent(rect.click(action), 'click')
        expect(context).toBe(rect)
      })
      it('returns the called element', function() {
        expect(rect.click(action)).toBe(rect)
      })
    })

    describe('dblclick()', function() {
      it('attaches an ondblclick event to the node of the element', function() {
        expect(typeof rect.node.ondblclick).not.toBe('function')
        rect.dblclick(action)
        expect(typeof rect.node.ondblclick).toBe('function')
      })
      it('fires the event on dblclick', function() {
        dispatchEvent(rect.dblclick(action), 'dblclick')
        expect(toast).toBe('ready')
      })
      it('applies the element as context', function() {
        dispatchEvent(rect.dblclick(action), 'dblclick')
        expect(context).toBe(rect)
      })
      it('returns the called element', function() {
        expect(rect.dblclick(action)).toBe(rect)
      })
    })

    describe('mousedown()', function() {
      it('attaches an onmousedown event to the node of the element', function() {
        expect(typeof rect.node.onmousedown).not.toBe('function')
        rect.mousedown(action)
        expect(typeof rect.node.onmousedown).toBe('function')
      })
      it('fires the event on mousedown', function() {
        dispatchEvent(rect.mousedown(action), 'mousedown')
        expect(toast).toBe('ready')
      })
      it('applies the element as context', function() {
        dispatchEvent(rect.mousedown(action), 'mousedown')
        expect(context).toBe(rect)
      })
      it('returns the called element', function() {
        expect(rect.mousedown(action)).toBe(rect)
      })
    })

    describe('mouseup()', function() {
      it('attaches an onmouseup event to the node of the element', function() {
        expect(typeof rect.node.onmouseup).not.toBe('function')
        rect.mouseup(action)
        expect(typeof rect.node.onmouseup).toBe('function')
      })
      it('fires the event on mouseup', function() {
        dispatchEvent(rect.mouseup(action), 'mouseup')
        expect(toast).toBe('ready')
      })
      it('applies the element as context', function() {
        dispatchEvent(rect.mouseup(action), 'mouseup')
        expect(context).toBe(rect)
      })
      it('returns the called element', function() {
        expect(rect.mouseup(action)).toBe(rect)
      })
    })

    describe('mouseover()', function() {
      it('attaches an onmouseover event to the node of the element', function() {
        expect(typeof rect.node.onmouseover).not.toBe('function')
        rect.mouseover(action)
        expect(typeof rect.node.onmouseover).toBe('function')
      })
      it('fires the event on mouseover', function() {
        dispatchEvent(rect.mouseover(action), 'mouseover')
        expect(toast).toBe('ready')
      })
      it('applies the element as context', function() {
        dispatchEvent(rect.mouseover(action), 'mouseover')
        expect(context).toBe(rect)
      })
      it('returns the called element', function() {
        expect(rect.mouseover(action)).toBe(rect)
      })
    })

    describe('mouseout()', function() {
      it('attaches an onmouseout event to the node of the element', function() {
        expect(typeof rect.node.onmouseout).not.toBe('function')
        rect.mouseout(action)
        expect(typeof rect.node.onmouseout).toBe('function')
      })
      it('fires the event on mouseout', function() {
        dispatchEvent(rect.mouseout(action), 'mouseout')
        expect(toast).toBe('ready')
      })
      it('applies the element as context', function() {
        dispatchEvent(rect.mouseout(action), 'mouseout')
        expect(context).toBe(rect)
      })
      it('returns the called element', function() {
        expect(rect.mouseout(action)).toBe(rect)
      })
    })

    describe('mousemove()', function() {
      it('attaches an onmousemove event to the node of the element', function() {
        expect(typeof rect.node.onmousemove).not.toBe('function')
        rect.mousemove(action)
        expect(typeof rect.node.onmousemove).toBe('function')
      })
      it('fires the event on mousemove', function() {
        dispatchEvent(rect.mousemove(action), 'mousemove')
        expect(toast).toBe('ready')
      })
      it('applies the element as context', function() {
        dispatchEvent(rect.mousemove(action), 'mousemove')
        expect(context).toBe(rect)
      })
      it('returns the called element', function() {
        expect(rect.mousemove(action)).toBe(rect)
      })
    })

    // NOT SUPPORTED BY IE
    // describe('mouseenter()', function() {
    //   it('attaches an onmouseenter event to the node of the element', function() {
    //     expect(typeof rect.node.onmouseenter).not.toBe('function')
    //     rect.mouseenter(action)
    //     expect(typeof rect.node.onmouseenter).toBe('function')
    //   })
    //   it('fires the event on mouseenter', function() {
    //     dispatchEvent(rect.mouseenter(action), 'mouseenter')
    //     expect(toast).toBe('ready')
    //   })
    //   it('applies the element as context', function() {
    //     dispatchEvent(rect.mouseenter(action), 'mouseenter')
    //     expect(context).toBe(rect)
    //   })
    //   it('returns the called element', function() {
    //     expect(rect.mouseenter(action)).toBe(rect)
    //   })
    // })
    
    // NOT SUPPORTED BY IE
    // describe('mouseleave()', function() {
    //   it('attaches an onmouseleave event to the node of the element', function() {
    //     expect(typeof rect.node.onmouseleave).not.toBe('function')
    //     rect.mouseleave(action)
    //     expect(typeof rect.node.onmouseleave).toBe('function')
    //   })
    //   it('fires the event on mouseleave', function() {
    //     dispatchEvent(rect.mouseleave(action), 'mouseleave')
    //     expect(toast).toBe('ready')
    //   })
    //   it('applies the element as context', function() {
    //     dispatchEvent(rect.mouseleave(action), 'mouseleave')
    //     expect(context).toBe(rect)
    //   })
    //   it('returns the called element', function() {
    //     expect(rect.mouseleave(action)).toBe(rect)
    //   })
    // })

  } else {

    describe('touchstart()', function() {
      it('attaches an ontouchstart event to the node of the element', function() {
        expect(typeof rect.node.ontouchstart).not.toBe('function')
        rect.touchstart(action)
        expect(typeof rect.node.ontouchstart).toBe('function')
      })
      it('fires the event on touchstart', function() {
        dispatchEvent(rect.touchstart(action), 'touchstart')
        expect(toast).toBe('ready')
      })
      it('applies the element as context', function() {
        dispatchEvent(rect.touchstart(action), 'touchstart')
        expect(context).toBe(rect)
      })
      it('returns the called element', function() {
        expect(rect.touchstart(action)).toBe(rect)
      })
    })

    describe('touchmove()', function() {
      it('attaches an ontouchmove event to the node of the element', function() {
        expect(typeof rect.node.ontouchmove).not.toBe('function')
        rect.touchmove(action)
        expect(typeof rect.node.ontouchmove).toBe('function')
      })
      it('fires the event on touchmove', function() {
        dispatchEvent(rect.touchmove(action), 'touchmove')
        expect(toast).toBe('ready')
      })
      it('applies the element as context', function() {
        dispatchEvent(rect.touchmove(action), 'touchmove')
        expect(context).toBe(rect)
      })
      it('returns the called element', function() {
        expect(rect.touchmove(action)).toBe(rect)
      })
    })

    describe('touchleave()', function() {
      it('attaches an ontouchleave event to the node of the element', function() {
        expect(typeof rect.node.ontouchleave).not.toBe('function')
        rect.touchleave(action)
        expect(typeof rect.node.ontouchleave).toBe('function')
      })
      it('fires the event on touchleave', function() {
        dispatchEvent(rect.touchleave(action), 'touchleave')
        expect(toast).toBe('ready')
      })
      it('applies the element as context', function() {
        dispatchEvent(rect.touchleave(action), 'touchleave')
        expect(context).toBe(rect)
      })
      it('returns the called element', function() {
        expect(rect.touchleave(action)).toBe(rect)
      })
    })

    describe('touchend()', function() {
      it('attaches an ontouchend event to the node of the element', function() {
        expect(typeof rect.node.ontouchend).not.toBe('function')
        rect.touchend(action)
        expect(typeof rect.node.ontouchend).toBe('function')
      })
      it('fires the event on touchend', function() {
        dispatchEvent(rect.touchend(action), 'touchend')
        expect(toast).toBe('ready')
      })
      it('applies the element as context', function() {
        dispatchEvent(rect.touchend(action), 'touchend')
        expect(context).toBe(rect)
      })
      it('returns the called element', function() {
        expect(rect.touchend(action)).toBe(rect)
      })
    })

    describe('touchcancel()', function() {
      it('attaches an ontouchcancel event to the node of the element', function() {
        expect(typeof rect.node.ontouchcancel).not.toBe('function')
        rect.touchcancel(action)
        expect(typeof rect.node.ontouchcancel).toBe('function')
      })
      it('fires the event on touchcancel', function() {
        dispatchEvent(rect.touchcancel(action), 'touchcancel')
        expect(toast).toBe('ready')
      })
      it('applies the element as context', function() {
        dispatchEvent(rect.touchcancel(action), 'touchcancel')
        expect(context).toBe(rect)
      })
      it('returns the called element', function() {
        expect(rect.touchcancel(action)).toBe(rect)
      })
    })

  }

  describe('registerEvent()', function() {
    it('creates a new custom event and stores it in the events object', function() {
      expect(SVG.events['my:event']).toBeUndefined()
      SVG.registerEvent('my:event')
      expect(SVG.events['my:event'] instanceof CustomEvent).toBeTruthy()
    })
  })

  describe('on()', function() {

    beforeEach(function() {
      SVG.registerEvent('my:event')
    })

    it('attaches and event to the element', function() {
      dispatchEvent(rect.on('my:event', action), 'my:event')
      expect(toast).toBe('ready')
    })
    it('applies the element as context', function() {
      dispatchEvent(rect.on('my:event', action), 'my:event')
      expect(context).toBe(rect)
    })
    it('stores the listener for future reference', function() {
      rect.on('my:event', action)
      expect(SVG.listeners[rect.node]['my:event'][action]).not.toBeUndefined()
    })
    it('returns the called element', function() {
      expect(rect.on('my:event', action)).toBe(rect)
    })
  })

  describe('off()', function() {
    var butter = null

    beforeEach(function() {
      butter = null
      SVG.registerEvent('my:event')
    })

    it('detaches a specific event listener', function() {
      rect.on('my:event', action)
      rect.off('my:event', action)
      dispatchEvent(rect, 'my:event')
      expect(toast).toBeNull()
      expect(SVG.listeners[rect.node]['my:event'][action]).toBeUndefined()
    })
    it('detaches all listeners for an event without a listener given', function() {
      rect.on('my:event', action)
      rect.on('my:event', function() { butter = 'melting' })
      rect.off('my:event')
      dispatchEvent(rect, 'my:event')
      expect(toast).toBeNull()
      expect(butter).toBeNull()
      expect(SVG.listeners[rect.node]['my:event']).toBeUndefined()
    })
    it('detaches all listeners without an argument', function() {
      rect.on('my:event', action)
      rect.on('click', function() { butter = 'melting' })
      rect.off()
      dispatchEvent(rect, 'my:event')
      dispatchEvent(rect, 'click')
      expect(toast).toBeNull()
      expect(butter).toBeNull()
      expect(SVG.listeners[rect.node]).toBeUndefined()
    })
    it('returns the called element', function() {
      expect(rect.off('my:event', action)).toBe(rect)
    })
  })

  describe('fire()', function() {

    beforeEach(function() {
      SVG.registerEvent('my:event')
      rect.on('my:event', action)
    })

    it('fires an event for the element', function() {
      expect(toast).toBeNull()
      rect.fire('my:event')
      expect(toast).toBe('ready')
    })
    it('returns the called element', function() {
      expect(rect.fire('my:event')).toBe(rect)
    })

  })

})






