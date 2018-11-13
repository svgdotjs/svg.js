import { uglify } from "rollup-plugin-uglify"
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'

export default [
  {
    input: './.config/polyfills.js',
    output: {
      file: 'dist/polyfills.js',
      name: 'polyfills',
      sourceMap: 'external',
      format: 'iife'
    },
    plugins: [
      resolve({browser: true}),
      commonjs(),
      uglify()
    ]
  }
]
