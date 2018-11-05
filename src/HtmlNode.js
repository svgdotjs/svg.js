import Dom from './Dom.js'
import { register } from './adopter.js'

export default class HtmlNode extends Dom {
  constructor (node) {
    super(node, HtmlNode)
  }
}

register(HtmlNode)
