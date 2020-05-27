const path = require("path");
const glob = require("glob");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const CircularDependencyPlugin = require("circular-dependency-plugin");

module.exports = {
   entry: "./src/app.js",
   module: {
      rules: [{
         test: /(\.jsx|\.js)$/,
         exclude: /(node_modules|bower_components)/,
         // When using with transpiling loaders (like babel-loader), make sure they are in correct order (bottom to top).
         // Otherwise files will be check after being processed by babel-loader
         use: [{
            loader: "babel-loader",
            query: {
               presets: ["@babel/preset-env", "@babel/react"],
               plugins: ["@babel/plugin-proposal-object-rest-spread", ["babel-plugin-root-import", { "rootPathSuffix": "src" }]]
            }
         },
         {
            loader: "eslint-loader",
            options: {
               quiet: true
            }
         }
         ]
      },
      {
         test: /\.css$/,
         use: ["style-loader", "css-loader"]
      },
      {
         test: /\.scss$/,
         use: ["style-loader",
            "css-loader",
            {
               loader: "sass-loader",
               options: {
                  sourceMap: true,
                  includePaths: glob.sync(
                     path.join(__dirname, "**/node_modules/@material")
                  ).map((dir) => path.dirname(dir)),
               },
            }
         ]
      },
      {
         test: /\.(png|svg|jpg|gif)$/,
         use: [{
            loader: 'url-loader',
            options: {
               limit: 8000, // Convert images < 8kb to base64 strings
               name: 'images/[hash]-[name].[ext]'
            }
         }]
      }
      ]
   },
   plugins: [
      new CopyWebpackPlugin({
         patterns: [
            { from: "./translations/**/*" }
         ]
      }),
      new CopyWebpackPlugin({
         patterns: [
            { from: "./img/**/*" }
         ]
      }),
      new CircularDependencyPlugin({
         exclude: /a\.js|node_modules/,
         failOnError: true //change to false when debugging to fix these circular dependencies
      }),
      new HtmlWebpackPlugin({
         title: "Real Time Map",
         template: "./index-template.ejs",
         favicon: "./favicon.png"
      }),
      new webpack.NamedModulesPlugin()
   ],
   resolve: {
      alias: {
         actions: path.resolve(__dirname, "src", "actions"),
         components: path.resolve(__dirname, "src", "components"),
         constants: path.resolve(__dirname, "src", "constants"),
         global: path.resolve(__dirname, "src", "components", "global"),
         services: path.resolve(__dirname, "src", "services"),
         utils: path.resolve(__dirname, "src", "utils")
      }
   },
};
