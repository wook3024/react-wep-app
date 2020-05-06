const path = require("path");
// const webpack = require("webpack");
const webpack = require("webpack");
// const compressionPlugin = require("compression-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const AppCachePlugin = require("appcache-webpack-plugin");

// const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
//   .BundleAnalyzerPlugin;

module.exports = {
  entry: {
    "js/app": ["./src/index.js"],
  },
  output: {
    path: path.resolve(__dirname, "/public/"),
    publicPath: "http://swook.ml/",
  },
  optimization: { minimize: true },
  devServer: {
    inline: true,
    contentBase: path.join(__dirname, "src"),
    https: true,
    hot: true,
    watchOptions: {
      ignored: [path.resolve(__dirname, "path/to/images")],
    },
    host: "0.0.0.0",
    port: 80,
    disableHostCheck: true,
    historyApiFallback: true,
  },
  mode: "production",
  // performance: {
  //   hints: false,
  //   maxEntrypointSize: 512000,
  //   maxAssetSize: 512000,
  // },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: ["babel-loader"],
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: "style-loader",
          },
          {
            loader: "css-loader",
          },
        ],
      },
      {
        test: /\.(ttf|eot|svg|woff|woff2)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: [
          {
            loader: "file-loader",
          },
        ],
      },
      {
        test: /.(sass|scss)$/,
        use: [
          { loader: "style-loader" },
          { loader: "css-loader" },
          { loader: "sass-loader" },
        ],
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: "file-loader",
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
      filename: "index.html",
    }),
    // new AppCachePlugin({
    //   explude: [".htaccess"],
    // }),
    // new webpack.config.optimization.minimize(),
    // new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /ru/),
    // new compressionPlugin(),
    // new BundleAnalyzerPlugin({
    //   analyzerHost: "127.0.0.1",
    //   analyzerPort: 8080,
    // }),
  ],
};
