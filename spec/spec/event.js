describe('Event', function() {
  var rect, context
    , toast = null
    , fruitsInDetail = null,
    action = function(e) {
        toast = 'ready'
        context = this
        fruitsInDetail = e.detail || null
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

    /*describe('mouseenter()', function() {
      it('attaches an onmouseenter event to the node of the element', function() {
        expect(typeof rect.node.onmouseenter).not.toBe('function')
        rect.mouseenter(action)
        expect(typeof rect.node.onmouseenter).toBe('function')
      })
      it('fires the event on mouseenter', function() {
        dispatchEvent(rect.mouseenter(action), 'mouseenter')
        expect(toast).toBe('ready')
      })
      it('applies the element as context', function() {
        dispatchEvent(rect.mouseenter(action), 'mouseenter')
        expect(context).toBe(rect)
      })
      it('returns the called element', function() {
        expect(rect.mouseenter(action)).toBe(rect)
      })
    })

    describe('mouseleave()', function() {
      it('attaches an onmouseleave event to the node of the element', function() {
        expect(typeof rect.node.onmouseleave).not.toBe('function')
        rect.mouseleave(action)
        expect(typeof rect.node.onmouseleave).toBe('function')
      })
      it('fires the event on mouseleave', function() {
        dispatchEvent(rect.mouseleave(action), 'mouseleave')
        expect(toast).toBe('ready')
      })
      it('applies the element as context', function() {
        dispatchEvent(rect.mouseleave(action), 'mouseleave')
        expect(context).toBe(rect)
      })
      it('returns the called element', function() {
        expect(rect.mouseleave(action)).toBe(rect)
      })
    })*/

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


  describe('on()', function() {

    it('attaches and event to the element', function() {
      dispatchEvent(rect.on('event', action), 'event')
      expect(toast).toBe('ready')
    })
    it('attaches multiple handlers on different element', function() {
      var listenerCnt = SVG.listeners.length

      var rect2 = draw.rect(100,100);
      var rect3 = draw.rect(100,100);

      rect.on('event', action)
      rect2.on('event', action)
      rect3.on('event', function(){ butter = 'melting' })
      rect3.on('event', action)

      expect(Object.keys(SVG.listeners[SVG.handlerMap.indexOf(rect.node)]['event']['*']).length).toBe(1)  // 1 listener on rect
      expect(Object.keys(SVG.listeners[SVG.handlerMap.indexOf(rect2.node)]['event']['*']).length).toBe(1) // 1 listener on rect2
      expect(Object.keys(SVG.listeners[SVG.handlerMap.indexOf(rect3.node)]['event']['*']).length).toBe(2) // 2 listener on rect3

      expect(SVG.listeners.length).toBe(listenerCnt + 3)                                                  // added listeners on 3 different elements
    })
    if('attaches a handler to a namespaced event', function(){
      var listenerCnt = SVG.listeners.length

      var rect2 = draw.rect(100,100);
      var rect3 = draw.rect(100,100);

      rect.on('event.namespace1', action)
      rect2.on('event.namespace2', action)
      rect3.on('event.namespace3', function(){ butter = 'melting' })
      rect3.on('event', action)

      expect(Object.keys(SVG.listeners[SVG.handlerMap.indexOf(rect.node)]['event']['*'])).toBeUndefined()          // no global listener on rect
      expect(Object.keys(SVG.listeners[SVG.handlerMap.indexOf(rect.node)]['event']['namespace1']).length).toBe( 1) // 1 namespaced listener on rect
      expect(Object.keys(SVG.listeners[SVG.handlerMap.indexOf(rect2.node)]['event']['namespace2']).length).toBe(1) // 1 namespaced listener on rect
      expect(Object.keys(SVG.listeners[SVG.handlerMap.indexOf(rect3.node)]['event']['*']).length).toBe(1)          // 1 gobal listener on rect3
      expect(Object.keys(SVG.listeners[SVG.handlerMap.indexOf(rect3.node)]['event']['namespace3']).length).toBe(1) // 1 namespaced listener on rect3
      expect(SVG.listeners.length).toBe(listenerCnt + 3)                                                           // added listeners on 3 different elements
    })
    it('applies the element as context', function() {
      dispatchEvent(rect.on('event', action), 'event')
      expect(context).toBe(rect)
    })
    it('applies given object as context', function() {
      dispatchEvent(rect.on('event', action, this), 'event')
      expect(context).toBe(this)
    })
    it('stores the listener for future reference', function() {
      rect.on('event', action)
      expect(SVG.listeners[SVG.handlerMap.indexOf(rect.node)]['event']['*'][action._svgjsListenerId]).not.toBeUndefined()
    })
    it('returns the called element', function() {
      expect(rect.on('event', action)).toBe(rect)
    })
  })

  describe('off()', function() {
    var butter = null

    beforeEach(function() {
      butter = null
    })

    it('detaches a specific event listener, all other still working', function() {
      rect2 = draw.rect(100,100);
      rect3 = draw.rect(100,100);

      rect.on('event', action)
      rect2.on('event', action)
      rect3.on('event', function(){ butter = 'melting' })

      rect.off('event', action)

      expect(Object.keys(SVG.listeners[SVG.handlerMap.indexOf(rect.node)]['event']['*']).length).toBe(0)

      dispatchEvent(rect, 'event')
      expect(toast).toBeNull()

      dispatchEvent(rect2, 'event')
      expect(toast).toBe('ready')

      dispatchEvent(rect3, 'event')
      expect(butter).toBe('melting')

      expect(SVG.listeners[SVG.handlerMap.indexOf(rect.node)]['event']['*'][action]).toBeUndefined()
    })
    it('detaches a specific namespaced event listener, all other still working', function() {
      rect2 = draw.rect(100,100);
      rect3 = draw.rect(100,100);

      rect.on('event.namespace', action)
      rect2.on('event.namespace', action)
      rect3.on('event.namespace', function(){ butter = 'melting' })

      rect.off('event.namespace', action)

      expect(Object.keys(SVG.listeners[SVG.handlerMap.indexOf(rect.node)]['event']['namespace']).length).toBe(0)

      dispatchEvent(rect, 'event')
      expect(toast).toBeNull()

      dispatchEvent(rect2, 'event')
      expect(toast).toBe('ready')

      dispatchEvent(rect3, 'event')
      expect(butter).toBe('melting')

      expect(SVG.listeners[SVG.handlerMap.indexOf(rect.node)]['event']['namespace'][action]).toBeUndefined()
    })
    it('detaches all listeners for a specific namespace', function() {
      rect.on('event', action)
      rect.on('event.namespace', function() { butter = 'melting'; })
      rect.off('.namespace')

      dispatchEvent(rect, 'event')
      expect(toast).toBe('ready')
      expect(butter).toBeNull()
    })
    it('detaches all listeners for an event without a listener given', function() {
      rect.on('event', action)
      rect.on('event.namespace', function() { butter = 'melting'; })
      rect.off('event')

      dispatchEvent(rect, 'event')
      expect(toast).toBeNull()
      expect(butter).toBeNull()
      expect(SVG.listeners[SVG.handlerMap.indexOf(rect.node)]['event']).toBeUndefined()
    })
    it('detaches all listeners without an argument', function() {
      rect.on('event', action)
      rect.on('click', function() { butter = 'melting' })
      rect.off()
      dispatchEvent(rect, 'event')
      dispatchEvent(rect, 'click')
      expect(toast).toBeNull()
      expect(butter).toBeNull()
      expect(SVG.listeners[SVG.handlerMap.indexOf(rect.node)]).toBeUndefined()
    })
    it('returns the called element', function() {
      expect(rect.off('event', action)).toBe(rect)
    })
  })

  describe('fire()', function() {

    beforeEach(function() {
      rect.on('event', action)
    })

    it('fires an event for the element', function() {
      expect(toast).toBeNull()
      rect.fire('event')
      expect(toast).toBe('ready')
      expect(fruitsInDetail).toBe(null)
    })
    it('returns the called element', function() {
      expect(rect.fire('event')).toBe(rect)
    })
    it('fires event with additional data', function() {
      expect(fruitsInDetail).toBeNull()
      rect.fire('event', {apple:1})
      expect(fruitsInDetail).not.toBe(null)
      expect(fruitsInDetail.apple).toBe(1)
    })
    it('fires my own event', function() {
      toast = null
      rect.fire(new CustomEvent('event'))
      expect(toast).toBe('ready')
    })
  })


})






