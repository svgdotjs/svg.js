

# Tagged Animations

The user can tag and control the runner for any animation

```js

var animation = element
  .loop(300, true)
    .tag('first')
    .rotate(360)
    .translate(50)
  .animate(300, 200)
    .tag('second')
    .scale(3)

animation.finish('first')
animation.pause('first')
animation.stop('first')
animation.play('first')

```


# Absolute Timeline Times

The user can specify their time which is relative to the timelines time.


```js

var animation = element
  .animate(2000).move(200, 200)

// after 1000 ms
animation.animate(1000, 0, 500).scale(2)

```

This block of code would:
- Spend the first 1000ms moving the element
- At this time, it will snap the scale to 1.5 (halfway to 2)
- After this time, the scale and the move should go together


# Rotating While Scaling

The user may want to run multiple animations concurrently and have
control over each animation that they define.

```js

let animationA = element.loop(300, ">").rotate(360).runner()
let animationB = element
    .loop(200, "><")
    .scale(2)
    .runner(tag)

// After some time, they might want to end the first animation abruptly
animationB.enable(false).end()

// Maybe they want to pause a runner
animationB.enable(false)

// Maybe they want to remove an animation matching a tag
animationB.tag('B')
element.timeline().remove('B')

// They can move around a runner as well
element.timeline()
    .schedule('B', 300) // Moves a runner to start at 300
        // time(currentAbsolute - newAbsolute)
    .shift('B', 300)    // Shifts the runner start time by 300
        // seek(shiftTime)

```


# A Sequenced Animation

The user might want to be able to run a long sequenced animation that they have
predesigned as they please.

```js

let timeline = element.loop(300, "><").scale(2)
    .animate(300).rotate(30)
    .animate(300, 200).fill(blue)

// They might want to move forwards or backwards
timeline.seek(-300)

// They might want to set a specific time
timeline.time(200)

// Or a specific position
timeline.position(0.3)

// Maybe they want to clear the timeline
timeline.reset()

```


# User wants to Loop Something

If the user wants to loop something, they should be able to call the loop
method at any time, and it will just change the behaviour of the current
runner. If we are running declaratively, we will throw an error.

## Correct Usages

They can invoke this from the timeline

```js
element.loop(duration, times, swing)
```

If they want to work with absolute times, they should animate first

```js
element.animate(300, 200, true)
    .loop(Infinity, true)
```

Or alternatively, they could equivalently do this:

```js
element.loop({
    now: true,
    times: Infinity,
    delay: 200,
    duration: 300,
    swing: true,
    wait: [200, 300]
})
```

## Error Case



# Declarative Animations

The user might want to have something chase their mouse around. This would
require a declarative animation.

```js

el.animate((curr, target, dt, ctx) => {

    // Find the error and the value
    let error = target - current
    ctx.speed = (ctx.error - error) / dt
    ctx.error = error
    return newPos

})

SVG.on(document, 'mousemove', (ev) => {

  el.timeline(controller)
    .move(ev.pageX, ev.pageY)

})

```


## Springy Mouse Chaser

Pretend we gave the user a springy controller that basically springs to a
target in 300ms for example. They might be constantly changing the target with:

```js

el.animate(Spring(500), 200)
    .tag('declarative')
    .persist()
    .move(10, 10)

el.animate('declarative')
    .move(300, 200)



SVG.on(document, 'mousemove', function (ev) {

  el.animate(springy, 200)
      .tag('declarative')
      .move(ev.pageX, ev.pageY)

})

```


# Repeated Animations

The user might want to duplicate an animation and have it rerun a few times

```js

// User makes two copies of an animation
let animA = el.animate(300, 300, 'now')...(animation)...
let animB = animA.clone() // Deep copy

// Now let the user attach and reschedule their animations
el.timeline()
    .schedule(animA, 500, 'absolute')
    .schedule(animB, 2000, 'absolute')

```

Then the user can loop the timeline, by changing its play mode

```js
el.timeline()
    .loop(times, swing, waits)
```


# Advanced Animations

The user can create their own runners and then attach it to the timeline
themselves if they like.

```js

// They declare their animation
let rotation = () => new SVG.Runner().rotate(500)

// They attach an element, and schedule the runner
let leftAnimation = rotation().element(leftSquare).reverse()

// They might want to animate another
let rightAnimation = rotation().element(rightSquare)

// They can schedule these two runners to a master element
timelineElement.timeline()
    .schedule(leftAnimation, 300, 'absolute')
    .schedule(rightAnimation, 500, 'now')
    .schedule(rightAnimation, 300, 'end')

// Or they can schedule it to a timeline as well
let timeline = new SVG.Timeline()
    .schedule(leftAnimation, 300, 'absolute')
    .schedule(rightAnimation, 500, 'now')

```
