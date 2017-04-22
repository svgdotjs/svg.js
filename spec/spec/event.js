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
    spyOn(SVG,'on').and.callThrough()
  })

  afterEach(function() {
    toast = context = null
  })

  if (!this.isTouchDevice) {

    describe('click()', function() {
      it('attaches an onclick event to the node of the element', function() {
        rect.click(action)
        expect(SVG.on).toHaveBeenCalledWith(rect.node, 'click', action)
      })
      it('fires the event on click', function() {
        rect.click(action).fire('click')
        expect(toast).toBe('ready')
      })
      it('applies the element as context', function() {
        rect.click(action).fire('click')
        expect(context).toBe(rect)
      })
      it('returns the called element', function() {
        expect(rect.click(action)).toBe(rect)
      })
    })

    describe('dblclick()', function() {
      it('attaches an ondblclick event to the node of the element', function() {
        rect.dblclick(action)
        expect(SVG.on).toHaveBeenCalledWith(rect.node, 'dblclick', action)
      })
      it('fires the event on dblclick', function() {
        rect.dblclick(action).fire('dblclick')
        expect(toast).toBe('ready')
      })
      it('applies the element as context', function() {
        rect.dblclick(action).fire('dblclick')
        expect(context).toBe(rect)
      })
      it('returns the called element', function() {
        expect(rect.dblclick(action)).toBe(rect)
      })
    })

    describe('mousedown()', function() {
      it('attaches an onmousedown event to the node of the element', function() {
        rect.mousedown(action)
        expect(SVG.on).toHaveBeenCalledWith(rect.node, 'mousedown', action)
      })
      it('fires the event on mousedown', function() {
        rect.mousedown(action).fire('mousedown')
        expect(toast).toBe('ready')
      })
      it('applies the element as context', function() {
        rect.mousedown(action).fire('mousedown')
        expect(context).toBe(rect)
      })
      it('returns the called element', function() {
        expect(rect.mousedown(action)).toBe(rect)
      })
    })

    describe('mouseup()', function() {
      it('attaches an onmouseup event to the node of the element', function() {
        rect.mouseup(action)
        expect(SVG.on).toHaveBeenCalledWith(rect.node, 'mouseup', action)
      })
      it('fires the event on mouseup', function() {
        rect.mouseup(action).fire('mouseup')
        expect(toast).toBe('ready')
      })
      it('applies the element as context', function() {
        rect.mouseup(action).fire('mouseup')
        expect(context).toBe(rect)
      })
      it('returns the called element', function() {
        expect(rect.mouseup(action)).toBe(rect)
      })
    })

    describe('mouseover()', function() {
      it('attaches an onmouseover event to the node of the element', function() {
        rect.mouseover(action)
        expect(SVG.on).toHaveBeenCalledWith(rect.node, 'mouseover', action)
      })
      it('fires the event on mouseover', function() {
        rect.mouseover(action).fire('mouseover')
        expect(toast).toBe('ready')
      })
      it('applies the element as context', function() {
        rect.mouseover(action).fire('mouseover')
        expect(context).toBe(rect)
      })
      it('returns the called element', function() {
        expect(rect.mouseover(action)).toBe(rect)
      })
    })

    describe('mouseout()', function() {
      it('attaches an onmouseout event to the node of the element', function() {
        rect.mouseout(action)
        expect(SVG.on).toHaveBeenCalledWith(rect.node, 'mouseout', action)
      })
      it('fires the event on mouseout', function() {
        rect.mouseout(action).fire('mouseout')
        expect(toast).toBe('ready')
      })
      it('applies the element as context', function() {
        rect.mouseout(action).fire('mouseout')
        expect(context).toBe(rect)
      })
      it('returns the called element', function() {
        expect(rect.mouseout(action)).toBe(rect)
      })
    })

    describe('mousemove()', function() {
      it('attaches an onmousemove event to the node of the element', function() {
        rect.mousemove(action)
        expect(SVG.on).toHaveBeenCalledWith(rect.node, 'mousemove', action)
      })
      it('fires the event on mousemove', function() {
        rect.mousemove(action).fire('mousemove')
        expect(toast).toBe('ready')
      })
      it('applies the element as context', function() {
        rect.mousemove(action).fire('mousemove')
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
        rect.mouseenter(action).fire('mouseenter')
        expect(toast).toBe('ready')
      })
      it('applies the element as context', function() {
        rect.mouseenter(action).fire('mouseenter')
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
        rect.mouseleave(action).fire('mouseleave')
        expect(toast).toBe('ready')
      })
      it('applies the element as context', function() {
        rect.mouseleave(action).fire('mouseleave')
        expect(context).toBe(rect)
      })
      it('returns the called element', function() {
        expect(rect.mouseleave(action)).toBe(rect)
      })
    })*/

  } else {

    describe('touchstart()', function() {
      it('attaches an ontouchstart event to the node of the element', function() {
        rect.touchstart(action)
        expect(SVG.on).toHaveBeenCalledWith(rect.node, 'touchstart', action)
      })
      it('fires the event on touchstart', function() {
        rect.touchstart(action).fire('touchstart')
        expect(toast).toBe('ready')
      })
      it('applies the element as context', function() {
        rect.touchstart(action).fire('touchstart')
        expect(context).toBe(rect)
      })
      it('returns the called element', function() {
        expect(rect.touchstart(action)).toBe(rect)
      })
    })

    describe('touchmove()', function() {
      it('attaches an ontouchmove event to the node of the element', function() {
        rect.touchmove(action)
        expect(SVG.on).toHaveBeenCalledWith(rect.node, 'touchmove', action)
      })
      it('fires the event on touchmove', function() {
        rect.touchmove(action).fire('touchmove')
        expect(toast).toBe('ready')
      })
      it('applies the element as context', function() {
        rect.touchmove(action).fire('touchmove')
        expect(context).toBe(rect)
      })
      it('returns the called element', function() {
        expect(rect.touchmove(action)).toBe(rect)
      })
    })

    describe('touchleave()', function() {
      it('attaches an ontouchleave event to the node of the element', function() {
        rect.touchleave(action)
        expect(SVG.on).toHaveBeenCalledWith(rect.node, 'touchleave', action)
      })
      it('fires the event on touchleave', function() {
        rect.touchleave(action).fire('touchleave')
        expect(toast).toBe('ready')
      })
      it('applies the element as context', function() {
        rect.touchleave(action).fire('touchleave')
        expect(context).toBe(rect)
      })
      it('returns the called element', function() {
        expect(rect.touchleave(action)).toBe(rect)
      })
    })

    describe('touchend()', function() {
      it('attaches an ontouchend event to the node of the element', function() {
        rect.touchend(action)
        expect(SVG.on).toHaveBeenCalledWith(rect.node, 'touchend', action)
      })
      it('fires the event on touchend', function() {
        rect.touchend(action).fire('touchend')
        expect(toast).toBe('ready')
      })
      it('applies the element as context', function() {
        rect.touchend(action).fire('touchend')
        expect(context).toBe(rect)
      })
      it('returns the called element', function() {
        expect(rect.touchend(action)).toBe(rect)
      })
    })

    describe('touchcancel()', function() {
      it('attaches an ontouchcancel event to the node of the element', function() {
        rect.touchcancel(action)
        expect(SVG.on).toHaveBeenCalledWith(rect.node, 'touchcancel', action)
      })
      it('fires the event on touchcancel', function() {
        rect.touchcancel(action).fire('touchcancel')
        expect(toast).toBe('ready')
      })
      it('applies the element as context', function() {
        rect.touchcancel(action).fire('touchcancel')
        expect(context).toBe(rect)
      })
      it('returns the called element', function() {
        expect(rect.touchcancel(action)).toBe(rect)
      })
    })

  }


  describe('on()', function() {

    it('attaches an event to the element', function() {
      rect.on('event', action).fire('event')
      expect(toast).toBe('ready')
    })
    it('attaches an event to a non svg element', function() {
      var el = document.createElement('div')
      SVG.on(el, 'event', action)
      el.dispatchEvent(new window.CustomEvent('event'))
      expect(toast).toBe('ready')
      SVG.off(el, 'event', action)
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
      rect.on('event', action).fire('event')
      expect(context).toBe(rect)
    })
    it('applies given object as context', function() {
      rect.on('event', action, this).fire('event')
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

      rect.fire('event')
      expect(toast).toBeNull()

      rect2.fire('event')
      expect(toast).toBe('ready')

      rect3.fire('event')
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

      rect.fire('event')
      expect(toast).toBeNull()

      rect2.fire('event')
      expect(toast).toBe('ready')

      rect3.fire('event')
      expect(butter).toBe('melting')

      expect(SVG.listeners[SVG.handlerMap.indexOf(rect.node)]['event']['namespace'][action]).toBeUndefined()
    })
    it('detaches all listeners for a specific namespace', function() {
      rect.on('event', action)
      rect.on('event.namespace', function() { butter = 'melting'; })
      rect.off('.namespace')

      rect.fire('event')
      expect(toast).toBe('ready')
      expect(butter).toBeNull()
    })
    it('detaches all listeners for an event without a listener given', function() {
      rect.on('event', action)
      rect.on('event.namespace', function() { butter = 'melting'; })
      rect.off('event')

      rect.fire('event')
      expect(toast).toBeNull()
      expect(butter).toBeNull()
      expect(SVG.listeners[SVG.handlerMap.indexOf(rect.node)]['event']).toBeUndefined()
    })
    it('detaches all listeners without an argument', function() {
      rect.on('event', action)
      rect.on('click', function() { butter = 'melting' })
      rect.off()
      rect.fire('event')
      rect.fire('click')
      expect(toast).toBeNull()
      expect(butter).toBeNull()
      expect(SVG.listeners[SVG.handlerMap.indexOf(rect.node)]).toBeUndefined()
    })
    it('returns the called element', function() {
      expect(rect.off('event', action)).toBe(rect)
    })
    it('does not throw when event is removed which was already removed with a global off', function() {
      var undefined

      rect.on('event', action)
      rect.off()
      try{
        rect.off('event')
      }catch(e){
        expect('Should not error out').toBe(true)
      }

      expect(SVG.handlerMap[SVG.handlerMap.indexOf(rect.node)]).toBe(undefined)
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
      rect.fire(new window.CustomEvent('event'))
      expect(toast).toBe('ready')
    })
    it('makes the event cancelable', function() {
      rect.on('event', function(e) {
        e.preventDefault()
      })
      rect.fire('event')
      expect(rect._event.defaultPrevented).toBe(true)
    })
  })

  describe('event()', function() {
    it('returns null when no event was fired', function() {
      expect(rect.event()).toBe(null)
    })
    it('returns the last fired event', function() {
      var event = new window.CustomEvent('foo')
      rect.fire(event)
      expect(rect.event()).toBe(event)

      event = new window.CustomEvent('bar')
      rect.fire(event)
      expect(rect.event()).toBe(event)
    })
  })
})
