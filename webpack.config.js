const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const postcssPresetEnv = require("postcss-preset-env");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const webpack = require("webpack");

module.exports = (env, { mode }) => {
  console.log(mode);
  return {
    output: {
      filename: "script.js"
    },
    devServer: {
      overlay: true,
      hot: true
    },
    module: {
      rules: [
        {
          test: /\.html$/,
          use: [
            {
              loader: "html-srcsets-loader",
              options: {
                attrs: [":src", ":srcset"]
              }
            }
          ]
        },
        {
          test: /\.(glsl|frag|vert)$/,
          use: ["glslify-import-loader", "raw-loader", "glslify-loader"]
        },
        {
          test: /\.(jpe?g|png|svg|webp)$/,
          use: {
            loader: "file-loader",
            options: {
              // limit: 1,
              context: "./src",
              name: "[path][name].[ext]"
            }
          }
        },
        {
          test: /\.css$/,
          use: [
            mode === "production"
              ? MiniCssExtractPlugin.loader
              : "style-loader",
            "css-loader",
            "resolve-url-loader",
            {
              loader: "postcss-loader",
              options: {
                sourceMap: true,
                plugins: [
                  require("postcss-import"),
                  postcssPresetEnv({ stage: 0 })
                ]
              }
            }
          ]
        }
      ]
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: "style.css"
      }),
      new OptimizeCSSAssetsPlugin(),
      new webpack.HotModuleReplacementPlugin()
    ]
  };
};
