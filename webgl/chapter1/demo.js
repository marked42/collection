function main() {
  var gl = getGLContext()
  var c_width = 0
  var c_height = 0

  window.onkeydown = checkKey

  function checkKey(ev) {
    switch (ev.keyCode) {
      case 49: {
        gl.clearColor(0.3, 0.7, 0.2, 1.0)
        clear(gl)
        break
      }
      case 50: {
        gl.clearColor(0.3, 0.2, 0.7, 1.0)
        clear(gl)
        break
      }
      case 51: {
        var color = gl.getParameter(gl.COLOR_CLEAR_VALUE)
        alert(
          'clearColor = (' +
            Math.round(color[0] * 10) / 10 +
            ',' +
            Math.round(color[1] * 10) / 10 +
            ',' +
            Math.round(color[2] * 10) / 10 +
            ')'
        )
        window.focus()
        break
      }
    }

    function clear(ctx) {
      ctx.clear(ctx.COLOR_BUFFER_BIT)
      ctx.viewport(0, 0, c_width, c_height)
    }
  }
}

function getGLContext() {
  /** @type {WebGLRenderingContext} */
  var canvas = document.getElementById('canvas-element-id')
  if (canvas == null) {
    alert("there's no canvas on this page")
    return
  }

  var names = ['webgl', 'experimental-webgl', 'webkit-3d', 'moz-webgl']

  for (var i = 0; i < names.length; i++) {
    try {
      gl = canvas.getContext(names[i])
    } catch {}
    if (gl) break
  }

  var gl
  if (gl === null) {
    alert('WebGL is not available')
    return
  } else {
    alert('Hooray! You got a WebGL context')
    return gl
  }
}

main()
