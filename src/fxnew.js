SVG.easing = {
  '-': function(pos){return pos}
, '<>':function(pos){return -Math.cos(pos * Math.PI) / 2 + 0.5}
, '>': function(pos){return  Math.sin(pos * Math.PI / 2)}
, '<': function(pos){return -Math.cos(pos * Math.PI / 2) + 1}
}

var someVar = 0

SVG.FX = SVG.invent({

  create: function(element) {

    this.pos = 0        // position before easing
    this.lastPos = 0    // needed for once callbacks
    this.paused = false
    this.finished = false
    this.active = false
    this.shared = {current:this}
    this.target = element
    this._next = null
    this._prev = null

    this.id = someVar++

    this.animations = {
      // functionToCall: [morphable object, destination value]
      // e.g. x: [SVG.Number, 5]
      // this way its assured, that the start value is set correctly
    }

    this.attrs = {
      // holds all attributes which are not represented from a function svg.js provides
    }

    this.styles = {
      // holds all styles which should be animated
    }

    this.transforms = [
      // holds all transformations of the form:
      // [A, B, C] or, [A, [25, 0, 0]] where ABC are matrixes and the array represents a rotation
    ]

    this._once = {
      // functions to fire at a specific position
      // e.g. "0.5": function foo(){}
    }


  }

, extend: {

    // sets up the animation
    animate: function(o, easing, delay){
      // the end time of the previous is our start
      var start = this._prev ? this._prev._end : +new Date

      if(typeof o == 'object'){
        easing = o.ease
        delay = o.delay
        o = o.duration
      }

      //if(typeof o == 'number') o = {duration:o}

      this._duration = o || 1000
      this._delay = delay || 0

      this._start = start + this._delay
      this._end = this._start + this._duration

      this.easing = SVG.easing[easing || '-'] || easing // when easing is a function, its not in SVG.easing

      this.init = false

      return this
    }

    // adds a new fx obj to the animation chain
  , enqueue: function(o){
      // create new istance from o or use it directly
      return this.next(
        o instanceof SVG.FX ? o :
          new SVG.FX(this.target)
      ).next().share(this.shared).animate(o)
    }

    // sets or gets the next situation object in the animation queue
  , next: function(next){
      if(!next) return this._next

      this._next = next
      next._prev = this // dont use function to prevent recursion
      return this
    }

    // sets or gets the previous situation object in the animation queue
  , prev: function(prev){
      if(!prev) return this._prev

      this._prev = prev
      prev._next = this
      return this
    }

    // returns the first situation object...
  , first: function(){
      var prev = this
      while(prev.prev()){
        prev = prev.prev()
      }
      return prev
    }

    // returns the last situation object...
  , last: function(){
      var next = this
      while(next.next()){
        next = next.next()
      }
      return next
    }

    // sets the shared object which is just a shared reference between all objects
  , share: function(shared){
      this.shared = shared
      return this
    }

    // returns the position at a given time
  , timeToPos: function(timestamp){
      return (timestamp - this._start) / (this._duration)
    }

    // returns the timestamp from a given positon
  , posToTime: function(pos){
      return this._duration * pos + this._start
    }

    // starts the animationloop
    // TODO: It may be enough to call just this.step()
  , startAnimFrame: function(){
      this.animationFrame = requestAnimationFrame(function(){ this.step() }.bind(this))
    }

    // cancels the animationframe
    // TODO: remove this in favour of the oneliner
  , stopAnimFrame: function(){
      cancelAnimationFrame(this.animationFrame)
    }

    // returns the current (active) fx object
  , current: function(){
      return this.shared.current
    }

    // set this object as current
  , setAsCurrent: function(){
      this.shared.current = this
      return this
    }

    // kicks off the animation - only does something when this obejct is the current
    // todo: remove timeout. we dont rly need a delay. it can be accomplished from the user itself
  , start: function(){
      // dont start if already started
      if(!this.active && this.current() == this){
        this._start = +new Date + this._delay
        this._end = this._start + this._duration
        this.active = true

        this.init || this.initAnimations()

        this.timeout = setTimeout(function(){ this.startAnimFrame() }.bind(this), this._delay)
      }

      return this
    }

    // updates all animations to the current state of the element
    // this is important when one property could be changed from another property
  , initAnimations: function() {
      var i

      for(i in this.animations){
        // TODO: this is not a clean clone of the array. We may have some unchecked references
        this.animations[i].value = (i == 'plot' ? this.target.array().value : this.target[i]())

        // sometimes we get back an object and not the real value, fix this
        if(this.animations[i].value.value){
          this.animations[i].value = this.animations[i].value.value
        }

        if(this.animations[i].relative)
          this.animations[i].destination.value = this.animations[i].destination.value + this.animations[i].value
      }

      for(i in this.attrs){
        if(this.attrs[i] instanceof SVG.Color){
          var color = new SVG.Color(this.target.attr(i))
          this.attrs[i].r = color.r
          this.attrs[i].g = color.g
          this.attrs[i].b = color.b
        }else{
          this.attrs[i].value = this.target.attr(i) + this.attrs[i].value
        }
      }

      for(i in this.styles){
        this.styles[i].value = this.target.style(i)
      }

      this.transformations = this.target.matrixify()

      this.init = true
    }

    // resets the animation to the initial state
  , stop: function(){
      if(!this.active) return this
      this.active = false
      this.stopAnimFrame()
      clearTimeout(this.timeout)

      return this
    }

    // do we need this one?
  , reset: function(){
      return this.stop().seek(0)
    }

    // finish off the animation
    // param next: true if next animation should be started
  , finish: function(next){
      this.finished = true
      this.loop = false
      if(!next)this.stop()
      return this.seek(1)
    }

    // set the internal animation pointer to the specified position and updates the visualisation
  , seek: function(pos){
      this.pos = pos
      this._start = +new Date - pos * this._duration
      this._end = this._start + this._duration
      return this.step(true)
    }

    // speeds up the animation by the given factor
    // this changes the duration of the animation
  , speed: function(speed){
      this._duration = this._duration * this.pos + (1-this.pos) * this._duration / speed
      this._end = this._start + this._duration
      return this.seek(this.pos)
    }
    // Make loopable
  , loop: function(times, reverse) {
      // store current loop and total loops
      this.loop = times || true

      if(reverse) return this.reverse()
      return this
    }

    // pauses the animation
  , pause: function(){
      this.paused = true
      this.stopAnimFrame()
      clearTimeout(this.timeout)
      return this
    }

    // sets the direction to forward
  , play: function(){
      if(this.shared.reversed){
        this.shared.reversed = false
        this.seek(this.pos)
      }

      return this
    }

    // sets the direction to backwards
  , reverse: function(){
      if(!this.shared.reversed){
        this.shared.reversed = true
        //this.seek(1-this.pos)
      }
      return this
    }

    // resumes a currently paused animation
  , resume: function(){
      if(this.paused){
        this.seek(this.shared.reversed ? 1-this.pos : this.pos)
        this.paused = false
        this.startAnimFrame()
      }
      return this
    }

    // adds a callback function for the current animation which is called when this animation finished
  , after: function(fn){
      var _this = this
        , wrapper = function wrapper(e){
            if(e.detail.fx == _this){
              fn.call(this)
              this.off('finished.fx', wrapper) // prevent memory leak
            }
          }

      // unbind previously set bindings because they would be overwritten anyway
      this.target.off('finished.fx', wrapper).on('finished.fx', wrapper)
      return this
    }

    // adds a callback which is called whenever one animation step is performed
  , during: function(fn){
      var _this = this
        , wrapper = function(e){
            if(e.detail.fx == _this){
              fn.call(this, e.detail.pos, e.detail.eased, e.detail.fx)
            }
          }

      // see above
      this.target.off('during.fx', wrapper).on('during.fx', wrapper)

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
      this.target.off('allfinished.fx', wrapper).on('allfinished.fx', wrapper)
      return this
    }

    // calls on every animation step for all animations
  , duringAll: function(fn){
      var _this = this
        , wrapper = function(e){
            fn.call(this, e.detail.fx.totalPosition(), e.detail.pos, e.detail.eased, e.detail.fx)
          }

      this.target.off('during.fx', wrapper).on('during.fx', wrapper)

      return this.afterAll(function(){
        this.off('during.fx', wrapper)
      })
    }

    // returns an integer from 0-1 indicating the progress of the whole animation queue
    // we recalculate the end time because it may be changed from methods like seek()
    // todo: rename position to progress?
  , totalPosition: function(){
      var start = this.first()._start
        , end = this._end
        , next = this

      while(next = next.next()){
        end += next._duration + next._delay
      }

      return (this.pos * this._duration + this._start - start) / (end - start)
    }

    // adds one property to the animations
  , push: function(method, args, type){
      this[type || 'animations'][method] = args
      setTimeout(function(){this.start()}.bind(this), 0)
      return this
    }

    // removes the specified animation and returns it
  , pop: function(method, type){
      var ret = this[type || 'animations'][method]
      this.drop(method)
      return ret
    }

    // removes the specified animation
  , drop: function(method, type){
      delete this[type || 'animations'][method]
      return this
    }

    // returns the specified animation
  , get: function(method, type){
      return this[type || 'animations'][method]
    }

    // perform one step of the animation
    // when ignoreTime is set the method uses the currently set position.
    // Otherwise it will calculate the position based on the time passed
  , step: function(ignoreTime){

      // convert current time to position
      if(!ignoreTime) this.pos = this.timeToPos(+new Date)

      if(this.pos >= 1 && (this.loop === true || (typeof this.loop == 'number' && --this.loop))){
        return this.seek(this.pos-1)
      }

      if(this.shared.reversed) this.pos = 1 - this.pos

      // correct position
      if(this.pos > 1)this.pos = 1
      if(this.pos < 0)this.pos = 0

      // apply easing
      var eased = this.easing(this.pos)

      // call once-callbacks
      for(var i in this._once){
        if(i > this.lastPos && i <= eased){
          this._once[i](this.pos, eased)
          delete this._once[i]
        }
      }

      // fire during callback with position, eased position and current situation as parameter
      this.target.fire('during', {pos: this.pos, eased: eased, fx: this})

      // apply the actual animation to every property
      this.eachAt()

      // do final code when situation is finished
      if(this.pos == 1 && !this.shared.reversed){

        // stop animation callback
        cancelAnimationFrame(this.animationFrame)

        this.finished = true
        this.active = false

        // fire finished callback with current situation as parameter
        this.target.fire('finished', {fx:this})

        // start the next animation in the queue and mark it as current
        if(this.next()){
          this.next().setAsCurrent().start()
        // or finish off the animation
        }else{
          this.target.fire('allfinished')
          this.target.off('.fx')
          this.target.fx = null
        }

      // todo: this is more or less duplicate code. has to be removed
      }else if(this.shared.reversed && this.pos == 0){

        // stop animation callback
        cancelAnimationFrame(this.animationFrame)

        this.finished = true
        this.active = false

        // fire finished callback with current situation as parameter
        this.target.fire('finished', {fx:this})

        // start the next animation in the queue and mark it as current
        if(this.prev()){
          this.prev().setAsCurrent().start()
        // or finish off the animation
        }else{
          this.target.fire('allfinished')
          this.target.off('.fx')
          this.target.fx = null
        }
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
      var i, at, self = this, target = this.target

      // apply animations which can be called trough a method
      for(i in this.animations){

        at = [].concat(this.animations[i]).map(function(el){
          return el.at ? el.at(self.easing(self.pos), self.pos) : el
        })

        target[i].apply(target, at)

      }

      // apply animation which has to be applied with attr()
      for(i in this.attrs){

        at = [i].concat(this.attrs[i]).map(function(el){
          return el.at ? el.at(self.easing(self.pos), self.pos) : el
        })

        target.attr.apply(target, at)

      }

      // apply animation which has to be applied with style()
      for(i in this.styles){

        at = [i].concat(this.styles[i]).map(function(el){
          return el.at ? el.at(self.easing(self.pos), self.pos) : el
        })

        target.style.apply(target, at)

      }

      // animate transformations which has to be chained
      if(this.transforms.length){
        at = this.transformations
        for(i in this.transforms){

          // we have to deal with absolute transformations
          // very stupid stuff
          //if(!this.transforms[i].relative){

              var a = this.transforms[i]

              if(a instanceof SVG.Matrix){

                if(a.relative){
                  at = at.multiply(a.at(pos))
                }else{
                  at = at.morph(a).at(this.easing(pos))
                }
                continue
              }

              if(!a.relative)
                a.undo(at.extract())

              if(a instanceof SVG.Translate && this.pos == 1){
              //console.log(at, a.at(this.easing(this.pos)), at.multiply(a.at(this.easing(this.pos))))
              }

              at = at.multiply(a.at(this.easing(this.pos)))
              continue;
              // get the current transformation
              /*var current = at.extract()

              var undoArgs = []
              var absArgs = []

              // collect the arguments for the method we have to call
              for(var j in this.transforms[i].order){
                if(this.transforms[i].args[this.transforms[i].order[j]] == null)undoArgs.push(0)
                else undoArgs.push(current[this.transforms[i].order[j]])
                absArgs.push(this.transforms[i].args[this.transforms[i].order[j]])
              }



              // create a new matrix and call this method with its arguments on it
              var diff = new SVG.Matrix()
              diff = diff[this.transforms[i].method].apply(diff, undoArgs)

              // build the inverse (we just undo the changes) and apply the new absolute ones
              diff = diff.inverse()
              if(this.transforms[i].method == 'rotate'){
                diff = diff.rotate(new SVG.Number().morph(absArgs[0]).at(this.easing(this.pos)), absArgs[1], absArgs[2])
              }else{
                diff = diff[this.transforms[i].method].apply(diff, absArgs)
              }

              // the resulting matrix is the matrix with the value set absolute
              at = at.multiply(new SVG.Matrix().morph(diff).at(this.easing(this.pos)))
              //this.transforms[i] = new SVG.Matrix().morph(diff)
              continue*/

          //}


          /*if(Array.isArray(this.transforms[i])){
            at = at.rotate(this.transforms[i][0].at(this.easing(this.pos)), this.transforms[i][1], this.transforms[i][2])
          }else{
            at = at.multiply(this.transforms[i].at(this.easing(this.pos)))
          }*/
        }

        target.matrix(at)
      }

      return this

    }


    // adds an once-callback which is called at a specific position and never again
  , once: function(pos, fn, isEased){

      if(!isEased)pos = this.easing(pos)

      this._once[pos] = fn

      return this
    }

    // searchs for a property in the animation chain to make relative movement possible
    // TODO: this method is outdated because of the use of initAnimations which cover this topic quite well
  , search: function(method, key) {
      var situation = this

      while(situation = situation.prev()){

        // get method of situation if present (always try animation object first before accessing attrs or styles)
        var attr = situation.get(key || method) || this.styles[key] || this.attrs[key]
        if(!attr) continue

        // return value from the morphed object
        return attr.destination

      }

      // return the elements attribute as fallback
      return this.target[method](key)

    }

  }

, parent: SVG.Element

  // Add method to parent elements
, construct: {
    // Get fx module or create a new one, then animate with given duration and ease
    animate: function(o) {
      return (this.fx || (this.fx = new SVG.FX(this))).stop().animate(o)
    }
  , delay: function(delay){
      return (this.fx || (this.fx = new SVG.FX(this))).animate({delay:delay})
    }
  }

})

// MorphObj is used whenever no morphable object is given
SVG.MorphObj = SVG.invent({

  create: function(from, to){
    // prepare color for morphing
    if(SVG.Color.isColor(to)) return new SVG.Color(from).morph(to)
    // prepare number for morphing
    if(SVG.regex.unit.test(to) || typeof from == 'number') return new SVG.Number(from).morph(to)

    // prepare for plain morphing
    this.value = from
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
      // get the current state
      var from = this.search('attr', a)

      // detect format
      /*if (a == 'transform') {

        // we have to calculate the rotation on our own to make sure we animate it correctly.
        // thats why we just add the parameters instead of the matrix
        if(v.rotation && !v.a){
          this.transforms.push([new SVG.Number(0).morph(v.rotation), v.cx || 0, v.cy || 0])
          this.start()
        }else{
          if(!relative){
            this.transforms.push(v)
          }else{
            this.transforms.push(new SVG.Matrix().morph(v))
          }
          this.start()
        }

      } else {*/
        // FIXME: from is obsolete
        this.push(a, new SVG.MorphObj(from, v), 'attrs')
      //}
    }

    return this
  }
  // Add animatable styles
, style: function(s, v) {
    if (typeof s == 'object')
      for (var key in s)
        this.style(key, s[key])

    else
      this.push(s, new SVG.MorphObj(this.search('style', s), v), 'styles')

    return this
  }
  // Animatable x-axis
, x: function(x, relative) {
    if(this.target instanceof SVG.G){
      this.transform({x:x}, relative)
      return this
    }

    var num = new SVG.Number(/*this.search('x')*/).morph(x)
    //var num = new SVG.Number(this.target.x()).morph(x)
    num.relative = relative
    return this.push('x', num)
  }
  // Animatable y-axis
, y: function(y, relative) {
    if(this.target instanceof SVG.G){
      this.transform({y:y}, relative)
      return this
    }

    var num = new SVG.Number(/*this.search('y')*/).morph(y)
    //var num = new SVG.Number(this.target.y()).morph(y)
    num.relative = relative
    return this.push('y', num)
  }
  // Animatable center x-axis
, cx: function(x) {
    return this.push('cx', new SVG.Number(/*this.search('cx')*/).morph(x))
  }
  // Animatable center y-axis
, cy: function(y) {
    return this.push('cy', new SVG.Number(/*this.search('cy')*/).morph(y))
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
    if (this.target instanceof SVG.Text) {
      // animate font size for Text elements
      this.attr('font-size', width)

    } else {
      // animate bbox based size for all other elements
      var w = this.search('width')
        , h = this.search('height')
        , box

      if(!w || !h){
        box = this.target.bbox()
      }

      this.push('width' , new SVG.Number(/*w || box.width*/).morph(width))
          .push('height', new SVG.Number(/*h || box.height*/).morph(height))

    }

    return this
  }
  // Add animatable plot
, plot: function(p) {
    return this.push('plot', this.target.array().morph(p))
  }
  // Add leading method
, leading: function(value) {
    return this.target.leading ?
      this.push('leading', new SVG.Number(/*this.search('leading')*/).morph(value)) :
      this
  }
  // Add animatable viewbox
, viewbox: function(x, y, width, height) {
    if (this.target instanceof SVG.Container) {
      var box = this.target.viewbox()
      this.push('viewbox', [
        new SVG.Number(box.x).morph(x),
        new SVG.Number(box.y).morph(y),
        new SVG.Number(box.width).morph(width),
        new SVG.Number(box.height).morph(height)
      ])
    }

    return this
  }
, update: function(o) {
    if (this.target instanceof SVG.Stop) {
      if (o.opacity != null) this.attr('stop-opacity', o.opacity)
      if (o.color   != null) this.attr('stop-color', o.color)
      if (o.offset  != null) this.attr('offset', new SVG.Number(o.offset))
    }

    return this
  }
})