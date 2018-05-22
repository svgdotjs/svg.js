
// TODO: Remove the timeline from the runner
// TODO: Pass in the starting time as a parameter
function Runner (start, duration) {

  // We store a reference to the function to run and the timeline to use
  this.transforms = []
  this.functions = []
  this.done = false

  // We copy the current values from the timeline because they can change
  this._duration = duration || null // if null, declarative methods used
  this._timeline = timeline
  this._last = 0

  // Store the state of the runner
  this._time = -start || 0
  this._enabled = true
  this.tags = {}
}

// The runner gets the time from the timeline
Runner.prototype = {

  add: function (initFn, runFn, alwaysInitialise) {
    this.functions.push({
      alwaysInitialise: alwaysInitialise || false,
      initialiser: initFn || SVG.void,
      runner: runFn || SVG.void,
      finished: false,
    })
    return this
  },

  tag: function (name) {
    if (name == null) return Object.keys(this.tags)

    name = Array.isArray(name) ? name : [name]

    for(var i = name.length; i--;) {
      this.tags[name[i]] = true
    }

    return this
  },

  enable: function (activated) {
    this._enabled = activated
    return this
  },

  time: function (time) {
    let dt = time - this._time
    this.step(dt)
    return this
  },

  step: function (dt) {

    // Increment the time and read out the parameters
    var duration = this._duration
    var time = this._time
    this._time += dt || 16

    // Work out if we are in range to run the function
    var timeInside = 0 <= time && time <= duration
    var position = time / duration
    var finished = time >= duration

    // If we are on the rising edge, initialise everything, otherwise,
    // initialise only what needs to be initialised on the rising edge
    var justStarted = this._last <= 0 && time >= 0
    var justFinished = this._last <= duration && finished
    this._initialise(justStarted)
    this._last = time

    // If we haven't started yet or we are over the time, just exit
    if(!timeInside && !justFinished) return finished

    // Run the runner and store the last time it was run
    this._run(
      duration === null ? dt  // No duration, declarative
      : finished ? 1          // If completed, provide 1
      : position              // If running,
    )

    // Work out if we are finished
    return finished
  },

  // Initialise the runner when we are ready
  _initialise: function (all) {
    for (var i = 0, len = this.functions.length; i < len ; ++i) {

      // Get the current initialiser
      var current = this.functions[i]

      // Determine whether we need to initialise
      var always = current.alwaysInitialise
      var running = !current.finished
      if ((always || all) && running) {
        current.initialiser()
      }
    }
  },

  _run: function (position) {

    // Run all of the functions directly
    var allfinished = false
    for (var i = 0, len = this.functions.length; i < len ; ++i) {

      // Get the current function to run
      var current = this.functions[i]

      // Run the function if its not finished, we keep track of the finished
      // flag for the sake of declarative functions
      current.finished = current.finished
        || (current.runner(position) === true)
      allfinished = allfinished && current.finished
    }

    // We report when all of the constructors are finished
    return allfinished
  },
}
