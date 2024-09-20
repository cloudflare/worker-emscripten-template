// import the emscripten glue code
import emscripten from './build/module.js'

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event))
})

// this is where the magic happens
// we send our own instantiateWasm function
// to the emscripten module
// so we can initialize the WASM instance ourselves
// since Workers puts your wasm file in global scope
// as a binding. In this case, this binding is called
// `WASM_MODULE` as that is the name Wrangler uses
// for any uploaded wasm module
let emscripten_module = new Promise((resolve, reject) => {
  emscripten({
    instantiateWasm(info, receive) {
      let instance = new WebAssembly.Instance(WASM_MODULE, info)
      receive(instance)
      return instance.exports
    },
  }).then(module => {
    resolve({
      init: module.cwrap('init', 'number', ['number']),
      resize: module.cwrap('resize', 'number', ['number', 'number']),
      module: module,
    })
  })
})

async function handleRequest(event) {
  let request = event.request
  let response = await fetch(request)

  let type = response.headers.get('Content-Type') || ''
  if (!type.startsWith('image/')) return response

  let width = new URL(request.url).searchParams.get('width')
  if (!width) return response

  let resizer = await emscripten_module

  let bytes = new Uint8Array(await response.arrayBuffer())

  let ptr = resizer.init(bytes.length)

  resizer.module.HEAPU8.set(bytes, ptr)

  let newSize = resizer.resize(bytes.length, parseInt(width))

  if (newSize == 0) {
    return new Response(bytes, response)
  }

  let resultBytes = resizer.module.HEAPU8.slice(ptr, ptr + newSize)

  // Create a new response with the image bytes. Our resizer module always
  // outputs JPEG regardless of input type, so change the header.
  let newResponse = new Response(resultBytes, response)
  newResponse.headers.set('Content-Type', 'image/jpeg')

  // Return the response.
  return newResponse
}
