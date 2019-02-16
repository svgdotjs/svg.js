const path = require('path')

module.exports = {
   mode: 'development',
   entry: { main: './spec/types/index.ts' },
   output: {
      filename: 'bundle.js'
   },
   bail: true,
   target: 'web',
   resolve: {
      extensions: ['.ts', '.js'],
      mainFields: ['module', 'main'],
      alias: {
         "@svgdotjs/svg.js": path.resolve(__dirname, "..")
      },
      aliasFields: ['module', 'main'],
   },
   devtool: "inline-source-map",
   node: {
      fs: 'empty',
      path: true,
      url: false,
      console: true,
      global: true,
      process: 'mock',
      __filename: 'mock',
      __dirname: 'mock',
      Buffer: true,
      setImmediate: true
   },
   module: {
      rules: [
         {
            test: /\.ts$/,
            use: 'ts-loader',
            exclude: /node_modules|\.d\.ts$/
         },
         {
            test: /\.d\.ts$/,
            loader: 'ignore-loader'
         }
      ],
   }
};