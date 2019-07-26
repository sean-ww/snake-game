# snake-game

A Vue.js snake game using Nuxt.js that uses [sean-ww/snake-game-api](https://github.com/sean-ww/snake-game-api) to upload high scores.

## Build Setup

``` bash
# install dependencies
$ npm install

# serve with hot reload at localhost:8282
$ npm run dev
```

## Sass Lint

Sass-lint is used to inspect our sass code detecting issues and where possible applying quick fixes.
Please setup sass-lint for your editor using the rules within the root of this project (.sass-lint.yml).

For PhpStorm, you can download a plugin.
When doing so, please select the yaml config file location, as the plugin may not find the config otherwise.
(It will still work, but you would be unaware that it had the wrong rule-set.)

You could also setup auto-fixing files using a watcher and/or external tool (right click and fix).
In PhpStorm, go to preferences, tools, then file watchers/external tools.

Example watchers/external tool setup:

Program
```
node_modules/.bin/sass-lint-auto-fix
```

Arguments
```
"$FilePathRelativeToProjectRoot$"
```

Bear in mind that only some sass-lint rules can be auto-fixed. Package.json also contains linting scripts.
