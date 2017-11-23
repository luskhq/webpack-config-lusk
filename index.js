const path = require("path");
const webpack = require("webpack");
const CompressionPlugin = require("compression-webpack-plugin");
const autoprefixerPlugin = require("autoprefixer");
const DefinePlugin = webpack.DefinePlugin;
const UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
const ModuleConcatenationPlugin = webpack.optimize.ModuleConcatenationPlugin;
const CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;

const luskConfig = (options = {}) => {
  const {
    sourceDir = "client",
    outDir = "static",
    extraEntries = [],
    vendorEntries = [],
    minify = false,
  } = options;

  const entry = {
    app: [`./${sourceDir}/index.js`, ...extraEntries],
    vendor: vendorEntries,
  };

  const output = {
    filename: "[name].js",
    chunkFilename: "[id]-[name].js",
    path: path.resolve(`${outDir}/js`),
    publicPath: "/js/",
  };

  // This will force webpack to give up trying to create a bundle if it runs
  // into errors. More info http://bit.ly/2vw5Gas
  const bail = true;

  // See https://webpack.js.org/configuration/devtool/ for more on devtools.
  const devtool = "cheap-source-map";

  const resolve = {
    modules: [path.resolve(sourceDir), "node_modules"],
    extensions: [".js", ".less", ".json"],
  };

  const scripts = {
    test: /\.js$/,
    use: [{ loader: require.resolve("babel-loader") }],
    include: path.resolve(sourceDir),
  };

  const autoprefixer = autoprefixerPlugin({
    browsers: ["last 2 version", "ie 9", "firefox 20", "safari 6", "chrome 25"],
  });

  const styles = {
    test: /\.less$/,
    use: [
      { loader: require.resolve("style-loader") },
      { loader: require.resolve("css-loader") },
      {
        loader: require.resolve("postcss-loader"),
        options: { plugins: [autoprefixer] },
      },
      { loader: require.resolve("less-loader") },
    ],
  };

  const plugins = [];

  plugins.push(
    new DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(
        minify ? "production" : "development",
      ),
    }),
  );

  // Creates a `vendor` chunk that should be included as a script tag inside the
  // index.html wrapper. This is configured through the `vendorEntries` option,
  // and should include stuff like React, ReactDOM, Fela, Ramda, etc...
  //
  // Making it a separate chunk is useful because the browser can parallelize
  // their download, and it opens the doors for long-term caching.
  plugins.push(
    new CommonsChunkPlugin({
      name: "vendor",
      minChunks: Infinity, // Makes sure that only modules specifid in `vendorEntries` are used.
    }),
  );

  // Creates a `shared` chunk that will be served along with the first dynamic
  // import.
  //
  // Making it a separate chunk means that common code doesn't have to be
  // included in every dynamically code-split bundle, which saves significant
  // amount of bandwidth if multiple bundles are requested in one session.
  plugins.push(
    new CommonsChunkPlugin({
      async: "shared",
      children: true,
    }),
  );

  if (minify) {
    plugins.push(new ModuleConcatenationPlugin());
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
    bail,
    entry,
    output,
    devtool,
    resolve,
    plugins,
    module: { rules: [scripts, styles] },
  };
};

module.exports = luskConfig;
