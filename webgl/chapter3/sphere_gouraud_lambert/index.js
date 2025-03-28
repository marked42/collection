import { sphereGeometry } from './sphere.js'
import * as utils from '../../utils.js'

/**
 * @param {WebGLRenderingContext} gl
 */
export function initBuffers(gl) {
  const { vertices, indices, normals } = sphereGeometry()

  const verticesBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, verticesBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW)

  const indicesBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, indicesBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW)

  const normalsBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, normalsBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW)

  return {
    verticesBuffer,
    indicesBuffer,
    normalsBuffer,
  }
}

export function runWebGLApp() {
  //Initializes the program (shaders)
  const { program, gl, canvas } = utils.setup()
  //Initializes the buffers that we are going to use
  const { indices, indicesBuffer, verticesBuffer, normalsBuffer } =
    initBuffers(gl)

  //Initializes lights
  initLights()
  //Renders the scene!
  renderLoop()

  function renderLoop() {
    requestAnimationFrame(renderLoop)
    drawScene()
  }

  function initBuffers() {
    const { vertices, indices, normals } = sphereGeometry()

    const verticesBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, verticesBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW)

    const indicesBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indicesBuffer)
    gl.bufferData(
      gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(indices),
      gl.STATIC_DRAW
    )

    const normalsBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, normalsBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW)

    gl.bindBuffer(gl.ARRAY_BUFFER, null)
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null)

    return {
      verticesBuffer,
      indicesBuffer,
      normalsBuffer,
      indices,
    }
  }

  function initLights() {
    program.uMaterialDiffuse = gl.getUniformLocation(
      program,
      'uMaterialDiffuse'
    )
    program.uLightDiffuse = gl.getUniformLocation(program, 'uLightDiffuse')
    program.uLightDirection = gl.getUniformLocation(program, 'uLightDirection')

    gl.uniform3fv(program.uLightDirection, [0.0, -1.0, -1.0])
    gl.uniform4fv(program.uLightDiffuse, [1.0, 1.0, 1.0, 1.0])
    gl.uniform4fv(program.uMaterialDiffuse, [0.5, 0.8, 0.1, 1.0])
  }

  function drawScene() {
    gl.clearColor(0.3, 0.3, 0.3, 1.0)
    gl.clearDepth(100.0)
    gl.enable(gl.DEPTH_TEST)
    gl.depthFunc(gl.LEQUAL)
    gl.viewport(0, 0, canvas.width, canvas.height)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

    const pMatrix = mat4.create()
    mat4.perspective(pMatrix, 45, canvas.width / canvas.height, 0.1, 10000.0)

    const mvMatrix = mat4.create()
    mat4.identity(mvMatrix)
    mat4.translate(mvMatrix, mvMatrix, [0.0, 0.0, -1.5]) //Sets the camera to a reasonable distance to view the part

    gl.uniformMatrix4fv(program.uMVMatrix, false, mvMatrix)
    gl.uniformMatrix4fv(program.uPMatrix, false, pMatrix)

    const nMatrix = mat4.create()
    mat4.set(mvMatrix, nMatrix)
    mat4.invert(nMatrix, nMatrix)
    mat4.transpose(nMatrix, nMatrix)

    gl.uniformMatrix4fv(program.uNMatrix, false, nMatrix)

    try {
      gl.enableVertexAttribArray(program.aVertexPosition)
      gl.enableVertexAttribArray(program.aVertexNormal)

      //2. bind buffers
      gl.bindBuffer(gl.ARRAY_BUFFER, verticesBuffer)
      gl.vertexAttribPointer(program.aVertexPosition, 3, gl.FLOAT, false, 0, 0)
      // gl.bindBuffer(gl.ARRAY_BUFFER, null)

      gl.bindBuffer(gl.ARRAY_BUFFER, normalsBuffer)
      gl.vertexAttribPointer(program.aVertexNormal, 3, gl.FLOAT, false, 0, 0)

      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indicesBuffer)
      gl.drawElements(gl.POINTS, indices.length, gl.UNSIGNED_SHORT, 0)

      gl.bindBuffer(gl.ARRAY_BUFFER, null)
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null)
    } catch (err) {
      utils.panic(err.message)
    }
  }
}

runWebGLApp()
