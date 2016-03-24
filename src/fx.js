SVG.easing = {
  '-': function(pos){return pos}
, '<>':function(pos){return -Math.cos(pos * Math.PI) / 2 + 0.5}
, '>': function(pos){return  Math.sin(pos * Math.PI / 2)}
, '<': function(pos){return -Math.cos(pos * Math.PI / 2) + 1}
}

var someVar = 0

SVG.Situation = SVG.invent({

  create: function(o){
    this.init = false
    this.reversed = false
    this.reversing = false

    this.duration = o.duration
    this.delay = o.delay

    this.start = +new Date() + this.delay
    this.end = this.start + this.duration
    this.easing = o.easing

    this.animations = {
      // functionToCall: [list of morphable objects]
      // e.g. move: [SVG.Number, SVG.Number]
    }

    this.attrs = {
      // holds all attributes which are not represented from a function svg.js provides
      // e.g. someAttr: SVG.Number
    }

    this.styles = {
      // holds all styles which should be animated
      // e.g. fill-color: SVG.Color
    }

    this.transforms = [
      // holds all transformations of the form:
      // [A, B, C] or, [A, [25, 0, 0]] where ABC are matrixes and the array represents a rotation
    ]

    this.once = {
      // functions to fire at a specific position
      // e.g. "0.5": function foo(){}
    }

  }

})

SVG.Delay = function(delay){
  this.delay = delay
}

SVG.FX = SVG.invent({

  create: function(element) {
    this._target = element
    this.situations = []
    this.active = false
    this.current = null
    this.paused = false
    this.lastPos = 0
    this.pos = 0
  }

, extend: {

    /**
     * sets or returns the target of this animation
     * @param o object || number In case of Object it holds all parameters. In case of number its the duration of the animation
     * @param easing function || string Function which should be used for easing or easing keyword
     * @param delay Number indicating the delay before the animation starts
     * @return target || this
     */
    animate: function(o, easing, delay){

      if(typeof o == 'object'){
        easing = o.ease
        delay = o.delay
        o = o.duration
      }

      var situation = new SVG.Situation({
        duration: o || 1000,
        delay: delay || 0,
        easing: SVG.easing[easing || '-'] || easing
      })

      this.queue(situation)

      return this
    }

    /**
     * sets a delay before the next element of the queue is called
     * @param delay Duration of delay in milliseconds
     * @return this.target()
     */
    // FIXME: the function needs to get a delay property to make sure, that the totalProgress can be calculated
  , delay: function(delay){
      var delay = new SVG.Delay(delay)

      return this.queue(delay)
    }

    /**
     * sets or returns the target of this animation
     * @param null || target SVG.Elemenet which should be set as new target
     * @return target || this
     */
  , target: function(target){
      if(target && target instanceof SVG.Element){
        this._target = target
        return this
      }

      return this._target
    }

    // returns the position at a given time
  , timeToPos: function(timestamp){
      return (timestamp - this.current.start) / (this.current.duration)
    }

    // returns the timestamp from a given positon
  , posToTime: function(pos){
      return this.current.duration * pos + this.current.start
    }

    // starts the animationloop
    // TODO: It may be enough to call just this.step()
  , startAnimFrame: function(){
      this.stopAnimFrame()
      this.animationFrame = requestAnimationFrame(function(){ this.step() }.bind(this))
    }

    // cancels the animationframe
    // TODO: remove this in favour of the oneliner
  , stopAnimFrame: function(){
      cancelAnimationFrame(this.animationFrame)
    }

    // kicks off the animation - only does something when the queue is curretly not active and at least one situation is set
  , start: function(){
      // dont start if already started
      if(!this.active && this.current){
        this.current.start = +new Date + this.current.delay
        this.current.end = this.current.start + this.current.duration

        this.initAnimations()
        this.active = true
        this.startAnimFrame()
      }

      return this
    }

    /**
     * adds a function / Situation to the animation queue
     * @param fn function / situation to add
     * @return this
     */
  , queue: function(fn){
      if(typeof fn == 'function' || fn instanceof SVG.Situation || fn instanceof SVG.Delay)
        this.situations.push(fn)

      if(!this.current) this.current = this.situations.shift()

      return this
    }

    /**
     * pulls next element from the queue and execute it
     * @return this
     */
  , dequeue: function(){
      // stop current animation
      this.current && this.current.stop && this.current.stop()

      // get next animation from queue
      this.current = this.situations.shift()

      if(this.current){

        var fn = function(){
          if(this.current instanceof SVG.Situation)
            this.initAnimations().seek(0)
          else if(this.current instanceof SVG.Delay)
            this.dequeue()
          else
            this.current.call(this)
        }.bind(this)

        // start next animation
        if(this.current.delay){
          setTimeout(function(){fn()}, this.current.delay)
        }else{
          fn()
        }

      }

      return this
    }

    // updates all animations to the current state of the element
    // this is important when one property could be changed from another property
  , initAnimations: function() {
      var i
      var s = this.current

      if(s.init) return this

      for(i in s.animations){

        if(i == 'viewbox'){
          s.animations[i] = this.target().viewbox().morph(s.animations[i])
        }else{

          // TODO: this is not a clean clone of the array. We may have some unchecked references
          s.animations[i].value = (i == 'plot' ? this.target().array().value : this.target()[i]())

          // sometimes we get back an object and not the real value, fix this
          if(s.animations[i].value.value){
            s.animations[i].value = s.animations[i].value.value
          }

          if(s.animations[i].relative)
            s.animations[i].destination.value = s.animations[i].destination.value + s.animations[i].value

        }

      }

      for(i in s.attrs){
        if(s.attrs[i] instanceof SVG.Color){
          var color = new SVG.Color(this.target().attr(i))
          s.attrs[i].r = color.r
          s.attrs[i].g = color.g
          s.attrs[i].b = color.b
        }else{
          s.attrs[i].value = this.target().attr(i)// + s.attrs[i].value
        }
      }

      for(i in s.styles){
        s.styles[i].value = this.target().style(i)
      }

      s.transformations = this.target().matrixify()

      s.init = true
      return this
    }
  , clearQueue: function(){
      this.situations = []
      return this
    }
  , clearCurrent: function(){
      this.current = null
      return this
    }
    /** stops the animation immediately
     * @param jumpToEnd A Boolean indicating whether to complete the current animation immediately.
     * @param clearQueue A Boolean indicating whether to remove queued animation as well.
     * @return this
     */
  , stop: function(jumpToEnd, clearQueue){
      if(!this.active) this.start()

      if(clearQueue){
        this.clearQueue()
      }

      this.active = false

      if(jumpToEnd){
        this.seek(1)
      }

      this.stopAnimFrame()
      clearTimeout(this.timeout)

      return this.clearCurrent()
    }

    /** resets the element to the state where the current element has started
     * @return this
     */
  , reset: function(){
      if(this.current){
        var temp = this.current
        this.stop()
        this.current = temp
        this.seek(0)
      }
      return this
    }

    // Stop the currently-running animation, remove all queued animations, and complete all animations for the element.
  , finish: function(){

      this.stop(true, false)

      while(this.dequeue().current && this.stop(true, false));

      return this.clearQueue().clearCurrent()
    }

    // set the internal animation pointer to the specified position and updates the visualisation
  , seek: function(pos){
      this.pos = pos
      this.current.start = +new Date - pos * this.current.duration
      this.current.end = this.current.start + this.current.duration
      return this.step(true)
    }

    // speeds up the animation by the given factor
    // this changes the duration of the animation
  , speed: function(speed){
      this.current.duration = this.current.duration * this.pos + (1-this.pos) * this.current.duration / speed
      this.current.end = this.current.start + this.current.duration
      return this.seek(this.pos)
    }
    // Make loopable
  , loop: function(times, reverse) {
      // store current loop and total loops
      this.current.loop = times || true

      if(reverse) this.last().reversing = true
      return this
    }

    // pauses the animation
  , pause: function(){
      this.paused = true
      this.stopAnimFrame()
      clearTimeout(this.timeout)
      return this
    }

    // unpause the animation
  , play: function(){
      if(!this.paused) return this
      this.paused = false
      return this.seek(this.pos)
    }

    /** toggle or set the direction of the animation
     * true sets direction to backwards while false sets it to forwards
     * @param reversed Boolean indicating whether to reverse the animation or not (default: toggle the reverse status)
     * @return this
     */
  , reverse: function(reversed){
      var c = this.last()

      if(typeof reversed == 'undefined') c.reversed = !c.reversed
      else c.reversed = reversed

      return this
    }


    /**
     * returns a float from 0-1 indicating the progress of the current animation
     * @param eased Boolean indicating whether the returned position should be eased or not
     * @return number
     */
  , progress: function(easeIt){
      return easeIt ? this.current.easing(this.pos) : this.pos
    }

    /**
     * adds a callback function which is called when the current animation is finished
     * @param fn Function which should be executed as callback
     * @return number
     */
  , after: function(fn){
      var c = this.last()
        , wrapper = function wrapper(e){
            if(e.detail.situation == c){
              fn.call(this, c)
              this.off('finished.fx', wrapper) // prevent memory leak
            }
          }

      this.target().on('finished.fx', wrapper)
      return this
    }

    // adds a callback which is called whenever one animation step is performed
  , during: function(fn){
      var c = this.last()
        , wrapper = function(e){
            if(e.detail.situation == c){
              fn.call(this, e.detail.pos, e.detail.eased, c)
            }
          }

      // see above
      this.target().off('during.fx', wrapper).on('during.fx', wrapper)

      return this.after(function(){
        this.off('during.fx', wrapper)
      })
    }

    // calls after ALL animations in the queue are finished
  , afterAll: function(fn){
      var wrapper = function wrapper(e){
            fn.call(this)
            this.off('allfinished.fx', wrapper)
          }

      // see above
      this.target().off('allfinished.fx', wrapper).on('allfinished.fx', wrapper)
      return this
    }

    // calls on every animation step for all animations
  , duringAll: function(fn){
      var wrapper = function(e){
            fn.call(this, e.detail.pos, e.detail.eased, e.detail.fx, e.detail.situation)
          }

      this.target().off('during.fx', wrapper).on('during.fx', wrapper)

      return this.afterAll(function(){
        this.off('during.fx', wrapper)
      })
    }

    /**
     * returns a float from 0-1 indicating the progress of the whole animation queue
     * we recalculate the end time because it may be changed from methods like seek()
     * @return number
     */
   // FIXME: current start always changes so the progress get a reset whenever one situation finishes. We need a global start which is only modified on pause and stop
  , totalProgress: function(){
      var start = this.current.start
        , end = this.current

      for(var i = 0, len = this.situations.length; i < len; ++i){
        end += (situations[i].duration || 0) + (situations[i].delay || 0)
      }

      return (this.pos * this.current.duration + this.start - start) / (end - start)
    }

  , last: function(){
      return this.situations.length ? this.situations[this.situations.length-1] : this.current
    }

    // adds one property to the animations
  , add: function(method, args, type){
      this.last()[type || 'animations'][method] = args
      setTimeout(function(){this.start()}.bind(this), 0)
      return this
    }

    /** perform one step of the animation
     *  @param ignoreTime Boolean indicating whether to ignore time and use position directly or recalculate position based on time
     *  @return this
     */
  , step: function(ignoreTime){

      // convert current time to position
      if(!ignoreTime) this.pos = this.timeToPos(+new Date)

      if(this.pos >= 1 && (this.current.loop === true || (typeof this.current.loop == 'number' && --this.current.loop))){
        
        if(this.current.reversing){
          this.current.reversed = !this.current.reversed
        }
        return this.seek(this.pos-1)
      }

      if(this.current.reversed) this.pos = 1 - this.pos

      // correct position
      if(this.pos > 1)this.pos = 1
      if(this.pos < 0)this.pos = 0

      // apply easing
      var eased = this.current.easing(this.pos)

      // call once-callbacks
      for(var i in this.current.once){
        if(i > this.lastPos && i <= eased){
          this.current.once[i].call(this.target(), this.pos, eased)
          delete this.current.once[i]
        }
      }

      // fire during callback with position, eased position and current situation as parameter
      this.target().fire('during', {pos: this.pos, eased: eased, fx: this, situation: this.current})

      // apply the actual animation to every property
      this.eachAt()

      // do final code when situation is finished
      if((this.pos == 1 && !this.current.reversed) || (this.current.reversed && this.pos == 0)){

        // stop animation callback
        cancelAnimationFrame(this.animationFrame)

        // fire finished callback with current situation as parameter
        this.target().fire('finished', {fx:this, situation: this.current})

        if(!this.situations.length && !this.current && this.active){
          this.target().fire('allfinished')
          this.target().off('.fx')
          this.active = false
        }

        // start next animation
        if(this.active) this.dequeue()
        else this.clearCurrent()

      }else if(!this.paused && this.active){
        // we continue animating when we are not at the end
        this.startAnimFrame()
      }

      // save last eased position for once callback triggering
      this.lastPos = eased
      return this

    }

    // calculates the step for every property and calls block with it
    // todo: include block directly cause it is used only for this purpose
  , eachAt: function(){
      var i, at, self = this, target = this.target(), c = this.current

      // apply animations which can be called trough a method
      for(i in c.animations){

        at = [].concat(c.animations[i]).map(function(el){
          return el.at ? el.at(c.easing(self.pos), self.pos) : el
        })

        target[i].apply(target, at)

      }

      // apply animation which has to be applied with attr()
      for(i in c.attrs){

        at = [i].concat(c.attrs[i]).map(function(el){
          return el.at ? el.at(c.easing(self.pos), self.pos) : el
        })

        target.attr.apply(target, at)

      }

      // apply animation which has to be applied with style()
      for(i in c.styles){

        at = [i].concat(c.styles[i]).map(function(el){
          return el.at ? el.at(c.easing(self.pos), self.pos) : el
        })

        target.style.apply(target, at)

      }

      // animate transformations which has to be chained
      if(c.transforms.length){

        // get inital transformations
        at = c.transformations
        for(i in c.transforms){

          // get next transformation in chain
          var a = c.transforms[i]

          // multiply matrix directly
          if(a instanceof SVG.Matrix){

            if(a.relative){
              at = at.multiply(a.at(this.pos))
            }else{
              at = at.morph(a).at(c.easing(this.pos))
            }
            continue
          }

          // when transformation is absolute we have to reset the needed transformation first
          if(!a.relative)
            a.undo(at.extract())

          // and reapply it after
          at = at.multiply(a.at(c.easing(this.pos)))
          continue;

        }

        // set new matrix on element
        target.matrix(at)
      }

      return this

    }


    // adds an once-callback which is called at a specific position and never again
  , once: function(pos, fn, isEased){

      if(!isEased)pos = this.current.easing(pos)

      this.current.once[pos] = fn

      return this
    }

  }

, parent: SVG.Element

  // Add method to parent elements
, construct: {
    // Get fx module or create a new one, then animate with given duration and ease
    animate: function(o, easing, delay) {
      return (this.fx || (this.fx = new SVG.FX(this))).animate(o, easing, delay)
    }
  , delay: function(delay){
      return (this.fx || (this.fx = new SVG.FX(this))).delay(delay)
    }
  , stop: function(jumpToEnd, clearQueue) {
      if (this.fx)
        this.fx.stop(jumpToEnd, clearQueue)

      return this
    }
    // Pause current animation
  , pause: function() {
      if (this.fx)
        this.fx.pause()

      return this
    }
    // Play paused current animation
  , play: function() {
      if (this.fx)
        this.fx.play()

      return this
    }
  }

})

// MorphObj is used whenever no morphable object is given
SVG.MorphObj = SVG.invent({

  create: function(to){
    // prepare color for morphing
    if(SVG.Color.isColor(to)) return new SVG.Color().morph(to)
    // prepare number for morphing
    if(SVG.regex.numberAndUnit.test(to)) return new SVG.Number().morph(to)

    // prepare for plain morphing
    this.value = 0
    this.destination = to
  }

, extend: {
    at: function(pos, real){
      return real < 1 ? this.value : this.destination
    },

    valueOf: function(){
      return this.value
    }
  }

})

SVG.extend(SVG.FX, {
  // Add animatable attributes
  attr: function(a, v, relative) {
    // apply attributes individually
    if (typeof a == 'object') {
      for (var key in a)
        this.attr(key, a[key])

    } else {
      // the MorphObj takes care about the right function used
      this.add(a, new SVG.MorphObj(v), 'attrs')
    }

    return this
  }
  // Add animatable styles
, style: function(s, v) {
    if (typeof s == 'object')
      for (var key in s)
        this.style(key, s[key])

    else
      this.add(s, new SVG.MorphObj(v), 'styles')

    return this
  }
  // Animatable x-axis
, x: function(x, relative) {
    if(this.target() instanceof SVG.G){
      this.transform({x:x}, relative)
      return this
    }

    var num = new SVG.Number().morph(x)
    num.relative = relative
    return this.add('x', num)
  }
  // Animatable y-axis
, y: function(y, relative) {
    if(this.target() instanceof SVG.G){
      this.transform({y:y}, relative)
      return this
    }

    var num = new SVG.Number().morph(y)
    num.relative = relative
    return this.add('y', num)
  }
  // Animatable center x-axis
, cx: function(x) {
    return this.add('cx', new SVG.Number().morph(x))
  }
  // Animatable center y-axis
, cy: function(y) {
    return this.add('cy', new SVG.Number().morph(y))
  }
  // Add animatable move
, move: function(x, y) {
    return this.x(x).y(y)
  }
  // Add animatable center
, center: function(x, y) {
    return this.cx(x).cy(y)
  }
  // Add animatable size
, size: function(width, height) {
    if (this.target() instanceof SVG.Text) {
      // animate font size for Text elements
      this.attr('font-size', width)

    } else {
      // animate bbox based size for all other elements
      var box

      if(!width || !height){
        box = this.target().bbox()
      }

      if(!width){
        width = box.width / box.height  * height
      }

      if(!height){
        height = box.height / box.width  * width
      }

      this.add('width' , new SVG.Number().morph(width))
          .add('height', new SVG.Number().morph(height))

    }

    return this
  }
  // Add animatable plot
, plot: function(p) {
    return this.add('plot', this.target().array().morph(p))
  }
  // Add leading method
, leading: function(value) {
    return this.target().leading ?
      this.add('leading', new SVG.Number().morph(value)) :
      this
  }
  // Add animatable viewbox
, viewbox: function(x, y, width, height) {
    if (this.target() instanceof SVG.Container) {
      this.add('viewbox', new SVG.ViewBox(x, y, width, height))
    }

    return this
  }
, update: function(o) {
    if (this.target() instanceof SVG.Stop) {
      if (typeof o == 'number' || o instanceof SVG.Number) {
        return this.update({
          offset:  arguments[0]
        , color:   arguments[1]
        , opacity: arguments[2]
        })
      }

      if (o.opacity != null) this.attr('stop-opacity', o.opacity)
      if (o.color   != null) this.attr('stop-color', o.color)
      if (o.offset  != null) this.attr('offset', o.offset)
    }

    return this
  }
})