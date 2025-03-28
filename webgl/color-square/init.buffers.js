export function initBuffers(gl) {
  const positionBuffer = initPositionBuffer(gl)
  const colorBuffer = initColorBuffer(gl)

  return {
    position: positionBuffer,
    color: colorBuffer,
  }
}

/**
 * @param {WebGLRenderingContext} gl
 */
function initPositionBuffer(gl) {
  const positionBuffer = gl.createBuffer()

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)

  const positions = [1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, -1.0]

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)

  return positionBuffer
}

/**
 * @param {WebGLRenderingContext} gl
 */
function initColorBuffer(gl) {
  const colorBuffer = gl.createBuffer()
  const colors = [
    1.0,
    1.0,
    1.0,
    1.0, // 白
    1.0,
    0.0,
    0.0,
    1.0, // 红
    0.0,
    1.0,
    0.0,
    1.0, // 绿
    0.0,
    0.0,
    1.0,
    1.0, // 蓝
  ]

  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW)

  return colorBuffer
}
