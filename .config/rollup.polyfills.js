import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import { terser } from 'rollup-plugin-terser'
import filesize from 'rollup-plugin-filesize'

// We dont need babel. All polyfills are compatible
const config = (ie) => ({
  input: ie ? './.config/polyfillListIE.js' : './.config/polyfillList.js',
  output: {
    file: ie ? 'dist/polyfillsIE.js' : 'dist/polyfills.js',
    sourceMap: false,
    format: 'iife'
  },
  plugins: [
    resolve({ browser: true }),
    commonjs(),
    terser(),
    filesize()
  ]
})

export default [false, true].map(config)
