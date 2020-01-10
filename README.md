# 👷 `worker-emscripten-template`

A template for kick starting a Cloudflare worker project with emscripten

[`index.js`](index.js) is the content of the Workers script.  
[`main.c`](src/main.c) is the c source code that calls into the stb image resizer library.  
[`build.js`](build.js) holds the command we use to call emscripten.  
[`webpack.config.js`](webpack.config.js) holds the webpack config we use to bundle the emscripten output together with your script.

To compile your C code to WebAssembly, this template uses [Emscripten](https://emscripten.org/docs/getting_started/downloads.html) if it is installed on your machine. Otherwise, it requires [docker](https://docs.docker.com/install/) for providing the emscripten build environment.

#### Wrangler

This template requires the ^1.1.0 version of [wrangler](https://github.com/cloudflare/wrangler)

```
wrangler generate myapp https://github.com/ashleygwilliams/worker-emscripten-template
```

To demo

```
wrangler preview
```

then change the url to `https://placehold.co/600x400.jpg?width=100`

Shoutout to [Surma](https://twitter.com/dassurma) for his [webpack-emscripten-wasm](https://gist.github.com/surma/b2705b6cca29357ebea1c9e6e15684cc) gist that was instrumental in getting this working!
