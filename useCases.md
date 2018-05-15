

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
