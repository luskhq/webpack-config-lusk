#!/usr/bin/env node

const cli = require('caporal');
const pkg = require("./package")
const build = require("./build")

cli
  .version(pkg.version)
  .description(pkg.description)

  .command('build', 'Transpile and bundle an app using webpack and babel') 
  .action(build);

cli.parse(process.argv);
