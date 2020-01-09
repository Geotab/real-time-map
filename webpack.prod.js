const webpack = require("webpack");
const path = require("path");
const merge = require("webpack-merge");
const defaultConfig = require("./webpack.common.js");
const TerserPlugin = require('terser-webpack-plugin');

module.exports = merge(defaultConfig, {
  mode: "production",
  devtool: "source-map",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist")
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify("production")
    })
  ],
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
});
