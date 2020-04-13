### webgl重要api

- clearColor(0, 0, 0, 1)

  设置清空canvas的颜色，后面的4个参数分别表示rgba。注意，这步并不会执行清空效果，只是设置一个清空颜色。颜色值的范围并不是0-255而是0.0-1.0

- clear(gl.COLOR_BUFFER_BIT)

  清空canvas，这步才会真正的清空。实际上清空画布清空的是颜色缓冲区。用clearColor指定的颜色清空，并填充。
  
  这个函数实际上可以清空传入参数的缓冲区，并不仅仅可以传入颜色缓冲区，还可以传入深度缓冲区等等。

- drawArrays(mode, first, count)

  执行顶点着色器，按照mode参数指定的方式绘制图形。顶点着色器将被执行count次，每次处理一个顶点。顶点着色器执行完之后会自动执行片段着色器。

  - mode

    指定绘制的方式，可接收以下常量符号：gl.POINTS,gl.LINES,gl.LINE_STRIP,gl.LINE_LOOP,gl.TRIANGLES,gl.TRIANGLE_STRIP,gl.TRIANGLE_FAN

  - first：int

    指定从哪个顶点开始绘制

  - count：int

    指定绘制需要用到多少个顶点

- getAttribLocation(program, name)

  获取由name参数指定的attribute变量的存储地址。

  - program

    指定包含顶点着色器和片段着色器的着色器程序对象

  - name

    指定想要获取其存储地址的attribute变量的名称

  返回变量的存储地址.

- getUniformLocation(program, name)

  获取指定名称的uniform变量的存储位置

  - program

    指定包含顶点着色器和片段着色器的着色器程序对象

  - name

    指定想要获取其存储地址的uniform变量的名称

- vertexAttrib3f(location, v0, v1, v2)

  将数据(v0, v1, v2)传给由location参数指定的attribute变量。

  - location

    指定将要修改的attribute变量的存储位置。

  - v0

    指定填充attribute变量第一个分量的值

  - v1

    指定填充attribute变量第二个分量的值

  - v2

    指定填充attribute变量第三个分量的值

- uniform4f(location, v0, v1, v2, v3)

  将数据(v0, v1, v2, v3)传给由location参数指定的uniform变量。

### webgl中的坐标系

webgl是一个三维的坐标系，x轴是横轴，正方向向右，y轴为竖轴，正方向向上，z轴为垂直于屏幕的，正方向向外。

canvas为二维坐标系，x轴是横轴，正方向向右，y轴为竖轴，正方向向上，原点在canvas的中心，并且画布的大小是从-1到1.

### JavaScript与着色器之间的数据传输

- attribute

  传输的是那些与顶点相关的数据。用来从外部向顶点着色器内传输数据，只有顶点着色器能使用它。

  例子：attribute vec4 a_Position;

  1. 在顶点着色器中声明attribute变量
  2. 将attribute变量赋值给gl_Position变量
  3. 向attribute变量传输数据

- uniform

  传输的是那些对于所有顶点都相同（或者是无关）的数据。

  1. 在片段着色器中准备uniform变量；
  2. 用这个uniform变量向gl_FragColor赋值；
  3. 将颜色数据从JavaScript传给该uniform变量；

### GLSL ES语言

- vec4

  表示由四个浮点数组成的矢量

- float

  浮点数

### 着色器知识

- 顶点着色器

  - gl_Position: vec4

    内置的变量，表示位置坐标

  - gl_PointSize: float

    内置的变量，表示点的尺寸

- 片段着色器

  - gl_FragColor: vec4

    内置的变量，表示像素的颜色