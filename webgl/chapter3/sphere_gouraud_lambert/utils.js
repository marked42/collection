/**
 * @param {float[]} vertices
 * @param {float[]} indices
 */
export function calculateNormals(vertices, indices) {
  const x = 0
  const y = 1
  const z = 2

  const normals = new Array(vertices.length)
  normals.fill(0.0)

  const SIZE = 3
  for (let i = 0; i < indices.length; i += SIZE) {
    const p0 = 3 * indices[i]
    const p1 = 3 * indices[i + 1]
    const p2 = 3 * indices[i + 2]

    /** vector from p0 -> p1 */
    const v1 = [
      vertices[p1 + x] - vertices[p0 + x],
      vertices[p1 + y] - vertices[p0 + y],
      vertices[p1 + z] - vertices[p0 + z],
    ]
    /** vector from p0 -> p2 */
    const v2 = [
      vertices[p2 + x] - vertices[p0 + x],
      vertices[p2 + y] - vertices[p0 + y],
      vertices[p2 + z] - vertices[p0 + z],
    ]

    // cross product of v1 X v2
    const normal = [
      v1[y] * v2[z] - v1[z] * v2[y],
      v1[z] * v2[x] - v1[x] * v2[z],
      v1[x] * v2[y] - v1[y] * v2[x],
    ]

    for (let j = 0; j < SIZE; j++) {
      normals[3 * indices[i + j] + x] += normal[x]
      normals[3 * indices[i + j] + y] += normal[y]
      normals[3 * indices[i + j] + z] += normal[z]
    }
  }

  for (let i = 0; i < normals.length; i += SIZE) {
    normalize(normals, i, SIZE)
  }

  return normals
}

/**
 * @param {float[]} vector
 */
export function normalize(vector, start, size) {
  let length = Math.sqrt(squareSum(vector, start, size))
  if (length === 0) {
    length = 0.0001
  }

  for (let i = 0; i < size; i++) {
    vector[start + i] /= length
  }
}

export function squareSum(vector, start, size) {
  let squareSum = 0
  for (let i = 0; i < size; i++) {
    squareSum += vector[start + i] * vector[start + i]
  }

  return squareSum
}

/**
 * @param {string} id
 * @returns {WebGLRenderingContext}
 */
export function getWebGLContext(id) {
  /**
   * @type HTMLCanvasElement
   */
  const canvas = document.getElementById(id)

  if (!canvas) {
    panic('there is not canvas on this page')
  }

  const context = canvas.getContext('webgl')

  if (!context) {
    panic('Could not initialize WebGL context')
  }

  return { canvas, gl: context }
}

/**
 * @param {WebGLRenderingContext} gl
 */
export function loadShader(gl, id) {
  const script = document.getElementById(id)
  if (!script) {
    panic('Could not find script ' + id)
  }

  let shader
  if (script.type === 'x-shader/x-fragment') {
    shader = gl.createShader(gl.FRAGMENT_SHADER)
  } else if (script.type === 'x-shader/x-vertex') {
    shader = gl.createShader(gl.VERTEX_SHADER)
  } else {
    panic('Unsupported shader script type ' + script.type)
  }

  gl.shaderSource(shader, script.textContent)
  gl.compileShader(shader)

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    panic(gl.getShaderInfoLog(shader))
  }

  return shader
}

export function panic(message) {
  alert(message)
  console.error(message)
  throw message
}

/**
 * @returns {{gl: WebGLRenderingContext, program: WebGLProgram}}
 */
export function setup(
  canvasId = 'canvas-element-id',
  fragmentScript = 'shader-fs',
  vertexScript = 'shader-vs'
) {
  const { gl, canvas } = getWebGLContext(canvasId)
  const fragmentShader = loadShader(gl, fragmentScript)
  const vertexShader = loadShader(gl, vertexScript)

  const program = gl.createProgram()
  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  gl.linkProgram(program)

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    utils.panic('Could not initialize program ')
  }

  gl.useProgram(program)

  return {
    canvas,
    gl,
    program,
  }
}
