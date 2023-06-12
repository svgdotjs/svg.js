import { getWindow } from '../src/utils/window.js'
import { svg } from '../src/modules/core/namespaces.js'

function tag(name, attrs, children) {
  const doc = getWindow().document
  const el = doc.createElementNS(svg, name)
  let i

  for (i in attrs) {
    el.setAttribute(i, attrs[i])
  }

  for (i in children) {
    if (typeof children[i] === 'string') {
      children[i] = doc.createTextNode(children[i])
    }

    el.appendChild(children[i])
  }

  return el
}

export function fixtures() {
  return tag(
    'svg',
    {
      height: 0,
      width: 0,
      id: 'inlineSVG'
    },
    [
      tag('defs', {}, [
        tag('linearGradient', {}, [
          tag('stop', { offset: '5%', 'stop-color': 'green' }),
          tag('stop', { offset: '95%', 'stop-color': 'gold' })
        ]),
        tag('radialGradient', {}, [
          tag('stop', { offset: '5%', 'stop-color': 'green' }),
          tag('stop', { offset: '95%', 'stop-color': 'gold' })
        ])
      ]),
      tag('desc', {}, ['Some description']),
      tag('path', {
        id: 'lineAB',
        d: 'M 100 350 l 150 -300',
        stroke: 'red',
        'stroke-width': '3',
        fill: 'none'
      }),
      tag('path', {
        id: 'lineBC',
        d: 'M 250 50 l 150 300',
        stroke: 'red',
        'stroke-width': '3',
        fill: 'none'
      }),
      tag('path', {
        d: 'M 175 200 l 150 0',
        stroke: 'green',
        'stroke-width': '3',
        fill: 'none'
      }),
      tag('path', {
        d: 'M 100 350 q 150 -300 300 0',
        stroke: 'blue',
        'stroke-width': '5',
        fill: 'none'
      }),
      tag(
        'g',
        {
          stroke: 'black',
          'stroke-width': '2',
          fill: 'black',
          id: 'pointGroup'
        },
        [
          tag('circle', {
            id: 'pointA',
            cx: '100',
            cy: '350',
            r: '3'
          }),
          tag('circle', {
            id: 'pointB',
            cx: '250',
            cy: '50',
            r: '50'
          }),
          tag('circle', {
            id: 'pointC',
            cx: '400',
            cy: '350',
            r: '50'
          })
        ]
      ),
      tag(
        'g',
        {
          'font-size': '30',
          font: 'sans-serif',
          fill: 'black',
          stroke: 'none',
          'text-anchor': 'middle',
          id: 'labelGroup'
        },
        [
          tag(
            'text',
            {
              x: '100',
              y: '350',
              dy: '-30'
            },
            ['A']
          ),
          tag(
            'text',
            {
              x: '250',
              y: '50',
              dy: '-10'
            },
            ['B']
          ),
          tag(
            'text',
            {
              x: '400',
              y: '350',
              dx: '30'
            },
            ['C']
          )
        ]
      ),
      tag('polygon', { points: '200,10 250,190 160,210' }),
      tag('polyline', { points: '20,20 40,25 60,40 80,120 120,140 200,180' })
    ]
  )
}

export function buildFixtures() {
  const doc = getWindow().document
  const body = doc.body || doc.documentElement

  const div = doc.createElement('div')
  div.id = 'fixtures'

  try {
    // FIXME: doesn't work in svgdom
    div.style.position = 'absolute'
    div.style.top = 0
    div.style.left = 0
  } catch (e) {}

  div.appendChild(fixtures())
  body.appendChild(div)
}

export function buildCanvas() {
  const doc = getWindow().document
  const body = doc.body || doc.documentElement

  const div = doc.createElement('div')
  div.id = 'canvas'

  try {
    // FIXME: doesn't work in svgdom
    div.style.position = 'absolute'
    div.style.top = 0
    div.style.left = 0
  } catch (e) {}
  body.appendChild(div)
}

export function clear() {
  const doc = getWindow().document
  const canvas = doc.getElementById('canvas')
  const fixtures = doc.getElementById('fixtures')

  // remove if present
  fixtures && fixtures.parentNode.removeChild(fixtures)
  canvas.parentNode.removeChild(canvas)
  ;[...doc.querySelectorAll('svg')].forEach((el) =>
    el.parentNode.removeChild(el)
  )
}
