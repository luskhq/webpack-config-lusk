# Webpack Config Lusk

This lib is an opinionated webpack config that relies on conventions over configuration. Intended for use in [Lusk](https://lusk.io) apps.

## Install

```sh
npm install --save webpack-config-lusk
```

## Usage

In your `webpack.config.js`:

```js
const luskConfig = require("webpack-config-lusk");
module.exports = luskConfig({ minify: true });
```

## API

The config has four options:

### minify: boolean (`false`)

Enables production optimizations. Usually, you'd want to set this value dynamically based on something like `process.env.MINIFY`.

### extraEntries: array (`[]`)

Allows for requiring additional dependencies into the bundle at build time. You might want to use this for stuff like i18n locale data or polyfills.

```js
module.exports = luskConfig({
  extraEntries: config.SUPPORTED_LANGUAGES.map(
    lang => `intl-messageformat/dist/locale-data/${lang}`
  ),
})
```

> See the documentation for more info: https://webpack.js.org/concepts/entry-points/#single-entry-shorthand-syntax

### sourceDir: string (`"client"`)

Name of the folder where the client source code lives. Only supply this if you need to support a legacy app.

### outDir: string (`"static"`)

Name of the folder where the final bundle will be written to. Only supply this if you need to support a legacy app.
