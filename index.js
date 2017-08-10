const path = require("path");
const webpack = require("webpack");
const CompressionPlugin = require("compression-webpack-plugin");
const autoprefixerPlugin = require("autoprefixer");
const DefinePlugin = webpack.DefinePlugin;
const UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;

const luskConfig = (options = {}) => {
  const {
    sourceDir = "client",
    outDir = "static",
    extraEntries = [],
    minify = false,
  } = options;

  const entry = [`./${sourceDir}/index.js`, ...extraEntries];

  const output = {
    filename: "app.js",
    path: path.resolve(`${outDir}/js`),
    publicPath: "/js/",
  };

  // See https://webpack.js.org/configuration/devtool/ for more on devtools.
  const devtool = "cheap-source-map";

  const resolve = {
    modules: [path.resolve(sourceDir), "node_modules"],
    extensions: [".js", ".less", ".json"],
  };

  const scripts = {
    test: /\.js$/,
    use: [{ loader: "babel-loader" }],
    include: path.resolve(sourceDir),
  };

  const autoprefixer = autoprefixerPlugin({
    browsers: ["last 2 version", "ie 9", "firefox 20", "safari 6", "chrome 25"],
  });

  const styles = {
    test: /\.less$/,
    use: [
      { loader: "style-loader" },
      { loader: "css-loader" },
      { loader: "postcss-loader", options: { plugins: [autoprefixer] } },
      { loader: "less-loader" },
    ],
  };

  const plugins = [];

  plugins.push(
    new DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(minify ? "production" : ""),
    }),
  );

  if (minify) {
    plugins.push(new UglifyJsPlugin());
    plugins.push(
      new CompressionPlugin({
        asset: "[path].gz",
        algorithm: "gzip",
        test: /\.js$/,
      }),
    );
  }

  return {
    entry,
    output,
    devtool,
    resolve,
    plugins,
    module: { rules: [scripts, styles] },
  };
};

module.exports = luskConfig;
