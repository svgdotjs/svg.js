import { register } from '../utils/adopter.js'
import Dom from './Dom.js'

export default class HtmlNode extends Dom {
  constructor (node) {
    super(node, HtmlNode)
  }
}

register(HtmlNode)
