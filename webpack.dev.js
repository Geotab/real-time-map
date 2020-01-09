const webpack = require("webpack");
const path = require("path");
const merge = require("webpack-merge");
const defaultConfig = require("./webpack.common.js");

module.exports = merge(defaultConfig, {
	mode: "development",
	devtool: "inline-source-map",
	output: {
		path: path.resolve(__dirname, "dist"),
		filename: "bundle.js",
		publicPath: "/dist/"
	},
	plugins: [
		new webpack.DefinePlugin({
			"process.env.NODE_ENV": JSON.stringify("development")
		}),
	]
});
