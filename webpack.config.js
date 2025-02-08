const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  // Set the mode to 'development' for debugging or 'production' for minification.
  mode: 'development',

  // Define separate entry points for the background and content scripts.
  entry: {
    background: path.resolve(__dirname, 'src/background.js'),
    content: path.resolve(__dirname, 'src/content.js')
  },

  // Output bundled files into the 'dist' folder.
  output: {
    path: path.resolve(__dirname, 'dist'),
    // [name] will be replaced by the entry name (background, content).
    filename: '[name].js'
  },

  module: {
    rules: [
      {
        // Use Babel to transpile modern JavaScript for broader compatibility.
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            // Presets can be customized as needed.
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },

  plugins: [
    // Copy static assets (like manifest.json and icons) to the output folder.
    new CopyWebpackPlugin({
      patterns: [
        // Copy the manifest file.
        { from: 'src/manifest.json', to: '.' },
        // Copy the icons folder. Adjust the source path if needed.
        { from: 'src/icons', to: 'icons' }
      ]
    })
  ],

  // Enable source maps for easier debugging.
  devtool: 'inline-source-map'
};
