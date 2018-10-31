const PUBLIC_PATH = require('path').join(__dirname, 'public');
const { CheckerPlugin } = require('awesome-typescript-loader');

module.exports = {
  resolve: {
    extensions: ['.ts', '.js']
  },

  devtool: 'source-map',
  mode: 'production',
  entry: {
    events: './src/js/index.ts',

    another: './src/js/card-template.ts'
  },
  output: {
    path: PUBLIC_PATH,
    filename: '[name].bundle.js'
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'awesome-typescript-loader'
      }
    ]
  },
  plugins: [
    new CheckerPlugin()
  ]
};
