/**
 * @param {WebGLRenderingContext} gl
 */
export function drawScene(gl, programInfo, buffers, texture, cubeRotation) {
  gl.clearColor(0.0, 0.0, 0.0, 1.0)
  gl.clearDepth(1.0)
  gl.enable(gl.DEPTH_TEST)
  gl.depthFunc(gl.LEQUAL)
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

  const fieldOfView = (45 * Math.PI) / 180
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight
  const zNear = 0.1
  const zFar = 100.0
  const projectionMatrix = mat4.create()

  // note: glmatrix.js always has the first argument
  // as the destination to receive the result.
  mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar)

  // Set the drawing position to the "identity" point, which is
  // the center of the scene.
  const modelViewMatrix = mat4.create()

  // Now move the drawing position a bit to where we want to
  // start drawing the square.

  mat4.translate(
    modelViewMatrix, // destination matrix
    modelViewMatrix, // matrix to translate
    [-0.0, 0.0, -6.0]
  ) // amount to translate

  // mat4.rotate(modelViewMatrix, modelViewMatrix, cubeRotation, [0, 0, 1])
  mat4.rotate(
    modelViewMatrix, // destination matrix
    modelViewMatrix, // matrix to rotate
    cubeRotation, // amount to rotate in radians
    [0, 0, 1]
  ) // axis to rotate around (Z)
  mat4.rotate(
    modelViewMatrix, // destination matrix
    modelViewMatrix, // matrix to rotate
    cubeRotation * 0.7, // amount to rotate in radians
    [0, 1, 0]
  ) // axis to rotate around (Y)
  mat4.rotate(
    modelViewMatrix, // destination matrix
    modelViewMatrix, // matrix to rotate
    cubeRotation * 0.3, // amount to rotate in radians
    [1, 0, 0]
  ) // axis to rotate around (X)

  // Tell WebGL how to pull out the positions from the position
  // buffer into the vertexPosition attribute.
  {
    const numComponents = 3 // pull out 2 values per iteration
    const type = gl.FLOAT // the data in the buffer is 32bit floats
    const normalize = false // don't normalize
    const stride = 0 // how many bytes to get from one set of values to the next
    // 0 = use type and numComponents above
    const offset = 0 // how many bytes inside the buffer to start from
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position)
    gl.vertexAttribPointer(
      programInfo.attribLocations.vertexPosition,
      numComponents,
      type,
      normalize,
      stride,
      offset
    )
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition)

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices)

    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.cubeVerticesNormalBuffer)
    gl.vertexAttribPointer(
      programInfo.attribLocations.vertexNormalAttribute,
      3,
      gl.FLOAT,
      false,
      0,
      0
    )
  }

  // Tell WebGL to use our program when drawing

  gl.useProgram(programInfo.program)

  // Set the shader uniforms
  // let normalMatrix = modelViewMatrix.inverse()
  // normalMatrix = normalMatrix.transpose()

  let normalMatrix = mat4.create()
  mat4.inverse(normalMatrix, modelViewMatrix)
  mat4.transpose(normalMatrix, normalMatrix)
  let nUniform = gl.getUniformLocation(shaderProgram, 'uNormalMatrix')

  gl.uniformMatrix4fv(nUniform, false, new Float32Array(normalMatrix.flatten()))

  gl.uniformMatrix4fv(
    programInfo.uniformLocations.projectionMatrix,
    false,
    projectionMatrix
  )
  gl.uniformMatrix4fv(
    programInfo.uniformLocations.modelViewMatrix,
    false,
    modelViewMatrix
  )

  // setColorAttribute(gl, buffers, programInfo)
  setTextureAttribute(gl, buffers, programInfo)

  gl.activeTexture(gl.TEXTURE0)
  gl.bindTexture(gl.TEXTURE_2D, texture)
  // gl.TEXTURE_21
  // Tell the shader we bound the texture to texture unit 0
  gl.uniform1i(programInfo.uniformLocations.uSampler, 0)

  {
    // const offset = 0
    // const vertexCount = 4
    // gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount)
    const vertexCount = 36
    const type = gl.UNSIGNED_SHORT
    const offset = 0
    gl.drawElements(gl.TRIANGLES, vertexCount, type, offset)
  }
}

// Tell WebGL how to pull out the positions from the position
// buffer into the vertexPosition attribute.
function setPositionAttribute(gl, buffers, programInfo) {
  const numComponents = 2 // pull out 2 values per iteration
  const type = gl.FLOAT // the data in the buffer is 32bit floats
  const normalize = false // don't normalize
  const stride = 0 // how many bytes to get from one set of values to the next
  // 0 = use type and numComponents above
  const offset = 0 // how many bytes inside the buffer to start from
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position)
  gl.vertexAttribPointer(
    programInfo.attribLocations.vertexPosition,
    numComponents,
    type,
    normalize,
    stride,
    offset
  )
  gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition)
}

function setColorAttribute(gl, buffers, programInfo) {
  const numComponents = 4
  const type = gl.FLOAT
  const normalize = false
  const stride = 0
  const offset = 0
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color)
  gl.vertexAttribPointer(
    programInfo.attribLocations.vertexColor,
    numComponents,
    type,
    normalize,
    stride,
    offset
  )
  gl.enableVertexAttribArray(programInfo.attribLocations.vertexColor)
}

// 告诉 WebGL 如何从缓冲区中提取纹理坐标
function setTextureAttribute(gl, buffers, programInfo) {
  const num = 2 // 每个坐标由 2 个值组成
  const type = gl.FLOAT // 缓冲区中的数据为 32 位浮点数
  const normalize = false // 不做标准化处理
  const stride = 0 // 从一个坐标到下一个坐标要获取多少字节
  const offset = 0 // 从缓冲区内的第几个字节开始获取数据
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.textureCoord)
  gl.vertexAttribPointer(
    programInfo.attribLocations.textureCoord,
    num,
    type,
    normalize,
    stride,
    offset
  )
  gl.enableVertexAttribArray(programInfo.attribLocations.textureCoord)
}
