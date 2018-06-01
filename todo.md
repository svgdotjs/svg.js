

# Where We Left Off

Saivan
======


Ulima
=====
- Use runners[runnerid] = {startTime, runner, persist}
timeline.persist('monkey-in', Infinity)


Both
====
- We discussed that matrices should always be applied from the left for animation, so we have:
    - If we have C R x where C is the current Matrix and R is the relative matrix that we want to apply
    - It could be animated by instead left multiplying (C R inv(C)) so that we have (C R inv(C)) C R
    - This allows us to always left multiply (which greatly simplifies things)
    => Conclusion: We dont do this. We apply transformations left or right whatever is necessary

Latest
======
- Runners would call an element.mergeMatrix() function that requests a native animation frame. Each runner would cancel the call made by the last runner, so that the function only runs once per frame.
-https://en.wikipedia.org/wiki/Change_of_basis#Change_of_coordinates_of_a_vector



# Timeline Description

- [T] Timeline constructors
  - [T] timeline () - Returns the timeline context to the user

- [T] Time Management
    - [T] play () - Lets the timeline keep playing from here
    - [T] pause () - Pauses the timeline where it currently is
    - [T] stop () - Pauses the timeline and sets time = 0
    - [T] finish () - Moves the time to the final time for the final animation, forces declaratives to snap to their final positions
    - [T] speed (newSpeed) - Sets the playback speed
    - [T] seek (dt) - Scrubs the timeline time forward or backward by dt
    - [T] time (t) - Sets the absolute time to t
    - [T] backwards (back) - Sets the speed to (back ? speed : -speed)
    - [T] position (p) - sets the position in range [0, 1]
    - [T] loop (times, swing, waits)

- [T] Runner Management
    - [T] remove(tagOrRunner, end) - Removes all runners with tag from the timeline
    - [T] reset () - Deletes all of the runners and resets the timeline
    - [T] persist (tag, lifetime) - how long to keep a reference to an animation after it is completed
    - [T] schedule (tag, time, when) - move the start time of the runner to time otherwise, returns all of the scheduled runners start and end times.

- [T] Hidden Methods
    - [x] `_step (dt)`
    - [x] `_continue ()`


# Runner

- [x] Constructors
    - [x] animate (duration, delay, when) - Makes a new runner and returns the timeline context to the user with the new runner active.
    - [x] loop (duration, times, swing) - Makes a new runner with the looping set as described by the parameters, returns timeline
    - [x] delay (by, when) - Makes a new runner to start <by> ms after the last active runner is complete

- [x] Runner Methods
    - [x] element (svgElement) - Given an element, you can bind it directly
    - [x] animate (args) - Calls animate if we have an element set
    - [x] loop (args) - Calls loop with arguments if we have an element
    - [x] delay (args) - calls delay if we have an element

- [x] Runner Events
    - [x] on (eventName, fn) - Binds a function to an event
    - [x] off (eventName) - Unbinds all function from that event
    - [x] fire () - Fires an event

- [x] Basic Functionality
    - [x] queue (initFn, runFn, alwaysInitialise) - Given two functions, the runner will run initFn once, and run runFn on every step. If alwaysInitialise is true, it will always run the initialisation as well.
    - [x] during (runFn) - The function to run on each frame

- [x] Runner Animation Methods
    - [x] time (time) - Sets the time to the given time and runs the runner
    - [x] step (dt) - Runs the runner method if
    - [x] finish () - runs step with dT = Infinity
    - [x] reverse () - Makes non-declarative runners play backwards
    - [x] ease (fn) - Sets the easing function, can not be used to convert a non-declarative to a declarative animation.
    - [x] active (activated) - Activates or deactivates a runner
    - [x] loop (o) - Activates a loop sequence

- [x] Runner Management
    - [x] tag (name) - Name a runner or act as a getter
    - [x] untag ()
