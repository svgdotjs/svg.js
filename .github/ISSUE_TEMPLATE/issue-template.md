---
name: Issue Template
about: The main issue template for svg.js

---

**Note: for support questions, please use [stackoverflow](https://stackoverflow.com/questions/tagged/svg.js) with the tag svg.js or head to our chat over at [gitter](https://gitter.im/svgdotjs/svg.js)**. You should only post here if you have a bug to report or a feature that you think would make the library better.

Delete the section that isn't relevant to you and fill out the one that is 🎉

# Bug report

- What is the expected behaviour?
- What is actually happening?
- What error message are you getting?
- Modify [this fiddle](https://jsfiddle.net/Fuzzy/s06mfv5u/) to demonstrate the problem clearly, just fork it and paste the resulting fiddle in your issue.

# Feature request

- Add example code and usage for feature requests to see how a user would use it
- Tell us the benefits (everything is allowed)
- Make a simple use case like the one below. Obviously your feature request shouldn't be so silly. But make it clear to the maintainers what you want added and how you plan to use it 😃

## Drawing [Smiley the Meme](http://i0.kym-cdn.com/entries/icons/original/000/000/107/smily.jpg)

It would be cool if SVG.js could be used to easily draw smiley the meme, it would make my life so much easier when I want to have memes in my svg.

### Benefits
- Drawing memes would be quick and easy
- Memes are funny

I think the syntax to achieve this should be:

```js
let meme = draw.meme({radius: 300, cx: 50, cy: 80, lookAt: [30, 50]})
```

Then the user could easily change where the smiley is looking with:

```js
meme.lookAt(50, 40)
// OR
meme.lookAt([30, 20])
// OR
meme.lookAt(new SVG.Point(30, 20))
```
