# Notes

1. http://www.webglacademy.com/
1. [MDN WebGL Tutorial](https://developer.mozilla.org/zh-CN/docs/Web/API/WebGL_API/Tutorial)
1. [WebGL Fundamentals](https://webglfundamentals.org/)
1. https://web.dev/articles/webgl-fundamentals
1. [An intro to modern OpenGL](https://duriansoftware.com/joe/an-intro-to-modern-opengl.-table-of-contents)
1. https://www.youtube.com/embed/H4c8t6myAWU/?feature=player_detailpage
1. https://github.com/RayTracing/raytracing.github.io
1. [ray-tracing in one weekend](https://raytracing.github.io/)

1. https://learnwebgl.brown37.net/
1. https://github.com/Mindsblend/3D-Web-Roadmap/blob/master/02-graphics-and-3d-concepts/Introduction%20to%203D%20Graphics/main.md#what-is-3d-graphics
1. [从头开始学习 GLSL 着色器 Learn GLSL Shaders from Scratch](https://www.bilibili.com/video/BV1kP4y1Y7MT/?spm_id_from=333.999.0.0&vd_source=192c54645a419374c428d6a7836b2ab0)
1. [【Shader 入门】创建你的第一个 Shader.p1](https://www.bilibili.com/video/BV17a411W79p/?vd_source=192c54645a419374c428d6a7836b2ab0)

1. [GAMES101-现代计算机图形学入门-闫令琪](https://www.bilibili.com/video/BV1X7411F744/?spm_id_from=333.337.search-card.all.click&vd_source=192c54645a419374c428d6a7836b2ab0)
1. [GAMES102:几何建模与处理](https://www.bilibili.com/video/BV1NA411E7Yr/?spm_id_from=333.337.search-card.all.click&vd_source=192c54645a419374c428d6a7836b2ab0)
1. https://threejs-journey.com/#highlights
1. https://threejs.org/manual/

1. https://thebookofshaders.com/?lan=ch
1. https://www.shadertoy.com/

## GLSG

1. Storage qualifier (attribute / uniform / varying / const)

1. is a state machine, clear/drawArray/drawElements
1. drawArray
1. drawElements

mode:

1. POINTS 一个点一组
1. 两个点一组
   1. LINES 每两个组成一组，点不重复使用
   1. LINE_LOOP 每个点与后边的点组成一组，共 n 个线段，形成闭环。
   1. LINE_STRIP 每个点与后边的点组成一组，共 n - 1 个线段
1. 三个点一组
   1. TRIANGLE 不重复使用
   1. TRIANGLE_STRIP 重复使用
   1. TRIANGLE_FAN 第一个点重复使用
1. [Introduction to Computer Graphics](https://www.youtube.com/playlist?list=PLplnkTzzqsZTfYh4UbhLGpI5kGd5oW_Hh)

1. 二次 translation / rotation / scale
1. https://www.youtube.com/watch?v=kjBOesZCoqc&list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab

1. 其次坐标，点的齐次坐标使用 w 分量使用 1.0， 向量的 w 分量使用 0.0 M = inverse transpose (M^-1)^T

1. Object Space -> Model Transform (Model Matrix)
1. Euclidian Space -> View Transform (View Matrix)
1. Projection transform ( perspective / orthographic)
1. Projective Space (x, y, z, w) w 是 perspective

   1. perspective division
   1. Normalized Device Coordinates( NDC)

1. View Transform (gl.viewport 函数) 将 NDC 映射到 视口（viewport）

### Camera

1. Model View Matrix 的逆时 Camera Matrix
   1. orbiting camera 物品展示
   1. tracking camera 场景漫游
1. Perspective Matrix
   1. perspective field-of-view, aspect, near, far
   1. https://stackoverflow.com/questions/28286057/trying-to-understand-the-math-behind-the-perspective-matrix-in-webgl/28301213#28301213
   1. https://unspecified.wordpress.com/2012/06/21/calculating-the-gluperspective-matrix-and-other-opengl-matrix-maths/
   1. orthogonal, left, right, top, bottom, near, far

### Interaction

1. Action 世界中物体移动
2. Picking 用户与 3D 物体交互
