const CopyPlugin = require("copy-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const LodashPlugin = require("lodash-webpack-plugin");
const UniteJsonPlugin = require("./build_tools/webpack_plugins/UniteJsonPlugin");
const jaRule = require("deinja/src/data");

const mode = process.env.NODE_ENV || "development";
const isProd = mode === "production";

const copyWebpackPluginConfigs = {
  patterns: [
    { from: "static", to: "." },
    { from: __dirname + "/node_modules/milligram/dist/milligram.min.css", to: "options/" },
    { from: __dirname + "/node_modules/ace-builds/src-min-noconflict/worker-html.js", to: "options/" },
    { from: __dirname + "/node_modules/ace-builds/src-min-noconflict/worker-json.js", to: "options/" },
  ],
};

if (!isProd) {
  copyWebpackPluginConfigs.patterns.push({ from: "static_overwrite", to: "." });
}

module.exports = {
  mode: mode,
  entry: {
    "sidebar/sidebar": "./src/sidebar/sidebar.js",
    "options/options": "./src/options/app.tsx",
    main: "./src/main/main.js",
  },
  output: {
    path: __dirname + "/dist",
  },
  module: {
    rules: [
      {
        test: /\.(:?js|ts)$/,
        use: {
          loader: "babel-loader",
          options: {
            cacheDirectory: !isProd,
          },
        },
        exclude: /node_modules/,
      },
      {
        test: /\.(:?jsx|tsx)$/,
        use: [
          {
            loader: "babel-loader",
            options: {
              cacheDirectory: !isProd,
              presets: ["@babel/env", "@babel/react"],
            },
          },
        ],
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"],
  },
  plugins: [
    new CopyPlugin(copyWebpackPluginConfigs),
    new UniteJsonPlugin([
      {
        from: [
          { name: "letters", file: "rule/letters.json5" },
          { name: "noun", file: "rule/noun.json5" },
          { name: "phrase", file: "rule/phrase.json5" },
          { name: "pronoun", file: "rule/pronoun.json5" },
          { name: "spelling", file: "rule/spelling.json5" },
          { name: "trailing", file: "rule/trailing.json5" },
          { name: "verb", file: "rule/verb.json5" },
          { name: "ja", data: jaRule },
        ],
        to: "data/rule.json",
      },
    ]),
    new LodashPlugin(),
  ],
  devtool: isProd ? false : "cheap-module-inline-source-map",
  performance: {
    maxEntrypointSize: 1000000,
    maxAssetSize: 3000000,
  },
  optimization: {
    minimize: isProd,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            pure_funcs: ["console.info", "console.warn", "console.time", "console.timeEnd"],
          },
        },
      }),
    ],
  },
};
