import babel from 'rollup-plugin-babel'
import { uglify } from "rollup-plugin-uglify"
import uglifyEs6 from "rollup-plugin-uglify-es"
import filesize from 'rollup-plugin-filesize'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
const pkg = require('./package.json')

const buildDate = Date()

const headerLong = `/*!
* ${pkg.name} - ${pkg.description}
* @version ${pkg.version}
* ${pkg.homepage}
*
* @copyright ${pkg.author}
* @license ${pkg.license}
*
* BUILT: ${buildDate}
*/;`

var headerShort = `/*! ${pkg.name} v${pkg.version} ${pkg.license}*/;`

// const baseConfig = {
//   input: 'src/svg.js',
//   output: {
//     // file: 'dist/svg.js',
//     name: 'SVG',
//     sourceMap: true,
//     // format: 'iife',
//     // banner: headerLong
//   },
//   plugins: [
//     // babel({
//     //   include: 'src/**'
//     // }),
//     // filesize(),
//   ]
// }
//
// const createConfig = (file = 'dist/svg.js', format = 'iife', minify = false) => {
//   const config = JSON.parse(JSON.stringify(baseConfig))
//   config.output.file = file
//   config.output.format = format
//   config.output.banner = minify ? headerShort : headerLong
//
//   config.plugins.push(resolve({browser: true}))
//   config.plugins.push(commonjs())
//
//   if (format == 'esm') {
//     config.plugins.push(
//       babel({
//         runtimeHelpers: true,
//         include: 'src/**',
//         babelrc: false,
//         presets: [["@babel/preset-env", {
//           "modules": false,
//           targets: {
//             chrome: 49,
//             edge: 14,
//             firefox: 45,
//             safari: 10
//           },
//           useBuiltIns: "usage"
//         }]],
//         "plugins": [
//           [
//             "@babel/plugin-transform-runtime",
//             {
//               "corejs": 2,
//               "helpers": true,
//               "regenerator": true,
//               "useESModules": true
//             }
//           ]
//         ]
//       })
//     )
//   } else {
//     config.plugins.push(
//       babel({
//         include: 'src/**',
//         runtimeHelpers: true,
//         babelrc: false,
//         presets: [
//           ["@babel/preset-env", {
//             modules: false,
//             targets: {
//               ie: "9"
//             },
//             useBuiltIns: "entry"
//           }]
//         ],
//         plugins: [
//           [
//             "@babel/plugin-transform-runtime",
//             {
//               corejs: false,
//               helpers: true,
//               regenerator: true,
//               useESModules: true
//             }
//           ]
//         ]
//       })
//     )
//   }
//
//   if (minify) {
//     config.plugins.push(format == 'esm' ? uglifyEs6() : uglify())
//   } else {
//     config.plugins.push(filesize())
//   }
//
//   return config
// }

export default [
  //createConfig('dist/svg.js', 'iife', false),
  // createConfig('dist/svg.min.js', 'iife', true),
  // createConfig('dist/svg.es6.js', 'esm', false),
  // createConfig('dist/svg.es6.min.js', 'esm', true)
  {
    input: 'src/svg.js',
    output: {
      file: 'dist/svg.js',
      name: 'SVG',
      sourceMap: true,
      format: 'iife',
      banner: headerLong
    },
    plugins: [
      // resolve({browser: true}),
      // commonjs(),
      babel({
        include: 'src/**',
        runtimeHelpers: true,
        babelrc: false,
        presets: [["@babel/preset-env", {
          modules: false,
          // targets: {
          //   firefox: "63"
          // },
          // useBuiltIns: "usage"
        }]],
        // plugins: [["@babel/plugin-transform-runtime", {
        //   corejs: false,
        //   helpers: true,
        //   regenerator: true,
        //   useESModules: true
        // }]]
      }),
      filesize()
    ]
  }
]
