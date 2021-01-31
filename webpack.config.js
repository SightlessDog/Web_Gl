// webpack.config.js
module.exports = {
  entry: [
    "./Rest/objects/box.js",
    "./Rest/objects/pyramid.js",
    "./Rest/util.js",
    "./Rest/gl-matrix.js",
    "./Rest/useProgram.js",
    "./Rest/drawShape.js",
    "./Rest/drawShapeWithTexture.js",
    "./Rest/file.js",
    "./Rest/initializeProgram.js",
    "./Rest/loadShapeWithTexture.js",
    "./Rest/app.js",
    ],
  output: {
    path: __dirname,
    publicPath: "/",
    filename: "bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "script-loader",
        },
      },
      {
        test: /\.glsl/,
        loader: "webpack-glsl-loader",
      },
    ],
  },
};
