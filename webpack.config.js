const path = require('path');

module.exports = {
  entry: './src/index.ts',
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'notifyx.min.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'Toast',
    libraryTarget: 'umd',
    globalObject: 'this'
  },
};
