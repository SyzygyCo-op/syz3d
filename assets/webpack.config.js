const path = require("path");
const glob = require("glob");
const HardSourceWebpackPlugin = require("hard-source-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
require("dotenv").config();

module.exports = (env, options) => {
  const devMode = options.mode !== "production";

  return {
    optimization: {
      minimizer: [
        new TerserPlugin({ cache: true, parallel: true, sourceMap: devMode }),
        new OptimizeCSSAssetsPlugin({}),
      ],
    },
    entry: {
      app: glob.sync("./vendor/**/*.js").concat(["./js/app.js"]),
    },
    output: {
      filename: "[name].js",
      path: path.resolve(__dirname, "../priv/static/js"),
      publicPath: `http://${process.env.HOST_NAME}:${process.env.PORT}/js/`,
    },
    devtool: devMode ? "eval-cheap-module-source-map" : undefined,
    devServer: {
      hot: true,
      port: 8080,
      public: `${process.env.HOST_NAME}:${process.env.PORT}`,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      // docs recommend this matches output.publicPath
      publicPath: `http://${process.env.HOST_NAME}:${process.env.PORT}/js/`,
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              plugins: [
                devMode && require.resolve("react-refresh/babel"),
              ].filter(Boolean),
            },
          },
        },
        {
          test: /\.css$/,
          use: ["style-loader", "css-loader"],
        },
        {
          test: /\.scss$/,
          use: ["style-loader", "css-loader", "sass-loader"],
        },
      ],
    },
    plugins: [new CopyWebpackPlugin([{ from: "static/", to: "../" }])].concat(
      devMode
        ? [new HardSourceWebpackPlugin(), new ReactRefreshWebpackPlugin()]
        : []
    ),
  };
};
