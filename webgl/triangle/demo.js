function main() {
  /** @type {HTMLCanvasELement} */
  var canvas = document.querySelector('#c')
  /** @type {WebGLRenderingContext} */
  var gl = canvas.getContext('webgl')

  if (!gl) {
    alert('')
  }

  var vertexShaderSource =
    document.querySelector('#vertex-shader-2d').textContent
  var fragmentShaderSource = document.querySelector(
    '#fragment-shader-2d'
  ).textContent

  var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource)
  var fragmentShader = createShader(
    gl,
    gl.FRAGMENT_SHADER,
    fragmentShaderSource
  )

  var program = createProgram(gl, vertexShader, fragmentShader)

  var positionAttributeLocation = gl.getAttribLocation(program, 'a_position')
  var positionBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)

  // three 2d positions
  var positions = [0, 0, 0, 0.5, 0.7, 0]
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)

  // webglUtils.resizeCanvasToDisplay(gl.canvas)
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)

  gl.clearColor(0, 0, 0, 0)
  gl.clear(gl.COLOR_BUFFER_BIT)

  gl.useProgram(program)

  gl.enableVertexAttribArray(positionAttributeLocation)

  var size = 2
  var type = gl.FLOAT
  var normalize = false
  var stride = 0
  var offset = 0
  gl.vertexAttribPointer(
    positionAttributeLocation,
    size,
    type,
    normalize,
    stride,
    offset
  )

  var primitiveType = gl.TRIANGLES
  var offset = 0
  var count = positions.length / size

  gl.drawArrays(primitiveType, offset, count)
}

/**
 * @param {WebGLRenderingContext} gl
 * @returns {WebGLShader}
 */
function createShader(gl, type, source) {
  var shader = gl.createShader(type)
  gl.shaderSource(shader, source)
  gl.compileShader(shader)

  var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS)
  if (success) {
    return shader
  }

  console.log(gl.getShaderInfoLog(shader))
  gl.deleteShader(shader)
}

/**
 * @param {WebGL2RenderingContext} gl
 * @param {WebGLShader} vertexShader
 * @param {WebGLShader} fragmentShader
 */
function createProgram(gl, vertexShader, fragmentShader) {
  var program = gl.createProgram()
  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  gl.linkProgram(program)

  var success = gl.getProgramParameter(program, gl.LINK_STATUS)
  if (success) {
    return program
  }

  console.log(gl.getProgramInfoLog(program))
  gl.deleteProgram(program)
}

/**
 * @param {HTMLCanvasElement} canvas
 */
function resizeCanvasToDisplay(canvas) {
  const displayWidth = canvas.clientWidth
  const displayHeight = canvas.clientHeight

  const needResize =
    canvas.width !== displayWidth || canvas.height !== displayHeight

  if (needResize) {
    canvas.width = displayWidth
    canvas.height = displayHeight
  }

  return needResize
}

main()
