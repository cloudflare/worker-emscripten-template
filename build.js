var $ = require('shelljs')

// Emscripten command:
var cmd = `emcc -O2 \
  -s WASM=1 \
  -s EXTRA_EXPORTED_RUNTIME_METHODS='["cwrap", "setValue"]' \
  -s ALLOW_MEMORY_GROWTH=1 \
  -s DYNAMIC_EXECUTION=0 \
  -s TEXTDECODER=0 \
  -s MODULARIZE=1 \
  -s ENVIRONMENT="web" \
  -s EXPORT_NAME="emscripten" \
  --pre-js "./pre.js" \
  -o ./build/module.js \
  ./src/main.c
`

// If user doesn't have Emscripten installed locally, try launching it through docker.
if(!$.which('emcc')) {
  cmd = `docker run --rm -v $(pwd):/src trzeci/emscripten ${cmd}`

  if (!$.which('docker')) {
    $.echo('This template requires docker to work. Please install docker and try again.',)
    $.exit(1)
  }
}

$.mkdir('-p', 'build')
$.exec(cmd)
