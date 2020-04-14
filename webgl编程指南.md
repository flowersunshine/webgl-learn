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

- createBuffer()

  创建缓冲区对象。

- deleteBuffer(buffer)

  删除参数buffer表示的缓冲区对象。

- bindBuffer(target, buffer)

  允许使用buffer表示的缓冲区对象并将其绑定到target表示的目标上。

  - target

    可以是以下中的一个：

    - gl.ARRAY_BUFFER 表示缓冲区对象中包含了顶点的数据；
    - gl.ELEMENT_ARRAY_BUFFER 表示缓冲区对象中包含了顶点的索引值

  - buffer

    指定之前由createBuffer返回的待绑定的对象

- bufferData(target, data, usage)

  开辟存储空间，向绑定在target上的缓冲区对象中写入数据data

  - target

    gl.ARRAY_BUFFER或者是gl.ELEMENT_ARRAY_BUFFER

  - data

    写入缓冲区对象的数据（类型化数组）

  - usage

    表示程序将如何使用存储在缓冲区对象中的数据。该参数见帮助WebGL优化操作，但是就算你闯入了错误的值，也不会终止程序（仅仅是降低程序的效率）。可以为以下值：

    - gl.STATIC_DRAW 只会向缓冲区对象中写入一次数据，但需要绘制很多次
    - gl.STREAM_DRAW 只会向缓冲区对象中写入一次数据，然后绘制若干次
    - gl.DYNAMIC_DRAW 会向缓冲区对象中多次写入数据，并绘制很多次

- vertexAttribPointer(location, size, type, normalized, stride, offset)

  将绑定到gl.ARRAY_BUFFER的缓冲区对象分配给由location指定的attribute变量。

  - location

    指定待分配变量的存储位置。

  - size

    指定缓冲区中每个顶点的分量个数（1到4）。若size比attribute变量需要的分量数小，缺失分量将按照与gl.vertexAttrib[1234]f()相同的规则补全。

  - type

    用以下类型之一来指定数据格式。

    - gl.UNSIGNED_BYTE 无符号字节，Uint8Array
    - gl.SHORT 短整形，Int16Array
    - gl.UNSIGNED_SHORT 无符号短整形，Uint16Array
    - gl.INT 整形，Int32Array
    - gl.UNSIGNED_INT 无符号整形，Uint32Array
    - gl.FLOAT 浮点数，Float32Array

  - normalize

    传入true或false，表明是否将非浮点型的数据归一化到[0,1]或[-1,1]区间

  - stride

    指定相邻两个顶点间的字节数，默认为0

  - offset

    指定缓冲区对象中的偏移量（以字节为单位），即attribute变量从缓冲区中的何处开始存储。

  

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

- 使用缓冲区对象向顶点着色器传入多个顶点的数据的步骤
  1. 创建缓冲区对象。
  2. 绑定缓冲区对象。
  3. 将数据写入缓冲区对象。
  4. 将缓冲区对象分配给一个attribute变量。
  5. 开启attribute变量。

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