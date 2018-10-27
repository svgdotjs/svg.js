import {remove, attr} from './Element.js'
import {find} from './selector.js'
import {makeInstance} from './adopter.js'

// Unclip all clipped elements and remove itself
export function clipPathRemove () {
  // unclip all targets
  this.targets().forEach(function (el) {
    el.unclip()
  })

  // remove clipPath from parent
  return remove.call(this)
}

export function clipPathTargets () {
  return find('svg [clip-path*="' + this.id() + '"]')
}

// Unclip all clipped elements and remove itself
export function maskRemove () {
  // unclip all targets
  this.targets().forEach(function (el) {
    el.unmask()
  })

  // remove clipPath from parent
  return remove.call(this)
}

export function maskTargets () {
  return find('svg [mask*="' + this.id() + '"]')
}

// Unclip all clipped elements and remove itself
export function patternGradientRemove () {
  // unclip all targets
  this.targets().forEach(function (el) {
    el.unFill()
  })

  // remove clipPath from parent
  return remove.call(this)
}

export function unFill () {
  this.attr('fill', null)
}

export function patternGradientTargets () {
  return find('svg [fill*="' + this.id() + '"]')
}

// custom attr to handle transform
export function patternAttr (a, b, c) {
  if (a === 'transform') a = 'patternTransform'
  return attr.call(this, a, b, c)
}

// custom attr to handle transform
export function gradientAttr (a, b, c) {
  if (a === 'transform') a = 'gradientTransform'
  return attr.call(this, a, b, c)
}

export function pathTargets () {
  return find('svg textpath [href*="' + this.id() + '"]')
}

export function HtmlNodeAdd (element, i) {
  element = makeInstance(element)

  if (element.node !== this.node.children[i]) {
    this.node.insertBefore(element.node, this.node.children[i] || null)
  }

  return this
}
