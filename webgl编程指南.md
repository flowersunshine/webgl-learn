### webgl重要api

- clearColor(0, 0, 0, 1)

  设置清空canvas的颜色，后面的4个参数分别表示rgba。注意，这步并不会执行清空效果，只是设置一个清空颜色。颜色值的范围并不是0-255而是0.0-1.0

- clear(gl.COLOR_BUFFER_BIT)

  清空canvas，这步才会真正的清空。实际上清空画布清空的是颜色缓冲区。用clearColor指定的颜色清空，并填充。
  
  这个函数实际上可以清空传入参数的缓冲区，并不仅仅可以传入颜色缓冲区，还可以传入深度缓冲区等等。

- drawArrays(mode, first, count)

  执行顶点着色器，按照mode参数指定的方式绘制图形。顶点着色器将被执行count次，每次处理一个顶点。顶点着色器执行完之后会自动执行片段着色器。

  - mode

    指定绘制的方式，可接收以下常量符号：

    - gl.POINTS

      一系列点

    - gl.LINES

      一系列单独的线段，绘制在(v0, v1), (v2, v3)

    - gl.LINE_STRIP

      一系列连接的线段，绘制在(v0, v1), (v1, v2)，第1个点事第1条线段的起点，第2个点事第1条线段的终点和第2条线段的起点

    - gl.LINE_LOOP

      一系列连接的线段，与上一个类型相比，增加了一条从最后一个点到第1个点的线段。

    - gl.TRIANGLES

      一系列单独的三角形，绘制在(v0, v1, v2), (v3, v4, v5)处，如果点的个数不是3的倍数，最后剩下的一或两个点将被忽略。

    - gl.TRIANGLE_STRIP

      一系列条带状的三角形，前三个点构成了第1个三角形，从第2个点开始的三个点构成了第2个三角形（该三角形与前一个三角形共享一条边），以此类推。

    - gl.TRIANGLE_FAN

      一系列三角形组成的类似于扇形的图形，前三个点构成了第1个三角形，接下来的一个点和前三角形的最后一条边组成接下来的一个三角形。

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

- uniformMatrix4fv(location, transpose, array)

  将array表示的4*4矩阵分配给由location指定的uniform变量。

  - location

    uniform变量的存储位置。

  - transpose

    在webgl中必须设置为false

  - array

    待传输的类型化数组，4*4矩阵按照列主序存储在其中。

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

- enableVertexAttribArray(location)

  开启location指定的attribute变量。

  - location

    指定location变量的存储位置

- disableVertexAttribArray(location)

  与上面正好相反，关闭location指定的attribute变量。

  - location

    指定attribute变量的存储位置。

- createTexture()

  创建纹理对象以存储纹理图像。

- deleteTexture(texture)

  使用texture删除纹理对象。如果试图删除一个已经被删除的纹理对象，不会报错也不会产生任何影响。

- pixelStorei(pname, param)

  - pname
    - gl.UNPACK_FLIP_Y_WEBGL 对图像进行Y轴反转，默认值为false；
    - gl.UNPACK_PERMULTIPLY_ALPHA_WEBGL 将图像RGB颜色值的每一个分量乘以A，默认值为false；

  - param

    指定非0（true）或0（false）。必须为整数。

- activeTexture(texUnit)

  激活texUnit指定的纹理单元。

- bindTexture(target, texture)

  开启texture指定的纹理对象，并将其绑定到target（目标）上。此外，如果已经通过gl.activeTexture()激活了某个纹理单元，则纹理对象也会绑定到这个纹理单元上。

  - target

    gl.TEXTURE_2D或gl.TEXTURE_BUVE_MAP

  - texture

    表示绑定的纹理单元

- texParameteri(target, pname, param)

  将param的值赋给绑定到目标的纹理对象的pname参数上。

  - target

    gl.TEXTURE_2D或gl.TEXTURE_CUBE_MAP

  - pname

    纹理参数（参加下表）

  - param

    纹理参数的值（参加下表）



​		pname可以指定4个纹理参数

- 放大方法：gl.TEXTURE_MAG_FILTER 当纹理的绘制范围比纹理本身更大时，如何获取纹素颜色。比如说，将16\*16的纹理图像映射到32\*32像素的空间里时，纹理的尺寸就变成了原始的两倍。WebGL需要填充由于放大而造成的像素间的空隙，该参数就表示填充这些空隙的具体方法。

- 缩小方法：gl.TEXTURE_MIN_FILTER 当纹理的绘制范围比纹理本身更小时，如何获取纹素颜色。

- 水平填充方法：gl.TEXTURE_WRAP_S 如何对纹理图像左侧或右侧的区域进行填充。

- 垂直填充方法：gl.TEXTURE_WRAP_T 如何对纹理图像上方和下方的区域进行填充。

  |       纹理参数        |     描述     |          默认值          |
  | :-------------------: | :----------: | :----------------------: |
  | gl.TEXTURE_MAG_FILTER |   纹理放大   |        gl.LINEAR         |
  | gl.TEXTURE_MIN_FILTER |   纹理缩小   | gl.NEAREST_MIPMAP_LINEAR |
  |   gl.TEXTURE_WRAP_S   | 纹理水平填充 |        gl.REPEAT         |
  |   gl.TEXTURE_WRAP_T   | 纹理垂直填充 |        gl.REPEAT         |

  可以赋值给gl.TEXTURE_MAG_FILTER和gl.TEXTURE_MIN_FILTER的非金字塔纹理类型常亮。

  |     值     |                             描述                             |
  | :--------: | :----------------------------------------------------------: |
  | gl.NEAREST | 使用原纹理上距离映射后像素（新像素）中心最近的那个像素的颜色值，作为新像素的值（使用曼哈顿距离）。 |
  | gl.LINEAR  | 使用距离新像素中心最近的四个像素的颜色值的加权平均， 作为新像素的值（与gl.NEAREST相比，该方法图像质量更好，但是会有较大的开销）。 |

  可以赋值给gl.TEXTURE_WRAP_S和gl.TEXTURE_WRAP_T的常量。

  | 值                 | 描述                 |
  | ------------------ | -------------------- |
  | gl.REPEAT          | 平铺式的重复纹理     |
  | gl.MIRRORED_REPEAT | 镜像对称式的重复纹理 |
  | gl.CLAMP_TO_EDGE   | 使用纹理图像边缘值   |

- texImage2D(target, level, internalformat, format, type, image)

  将image指定的图像分配给绑定到目标上的纹理图像。

  - target

    gl.TEXTURE_2D或gl.TEXTURE_CUBE_MAP

  - level

    传入0（本参数是为金字塔纹理准备的）

  - internalformat

    图像的内部格式（见下表）

  - format

    纹理数据的格式，必须使用与internalformat相同的值

  - type

    纹理数据的类型

  - image

    包含纹理图像的Image对象

  format纹素数据的格式

  |        格式        |          描述           |
  | :----------------: | :---------------------: |
  |       gl.RGB       |       红，绿，蓝        |
  |      gl.RGBA       |   红，绿，蓝，透明度    |
  |      gl.ALPHA      | (0,0, 0,0, 0.0, 透明度) |
  |    gl.LUMINANCE    |    L, L, L, 1L:流明     |
  | gl.LUMINANCE_ALPHA |     L, L, L, 透明度     |

  type纹理数据的数据格式

  |           格式            |                     描述                     |
  | :-----------------------: | :------------------------------------------: |
  |     gl.UNSIGNED_BYTE      |      无符号整形，每个颜色分量占据1字节       |
  |  gl.UNSIGNED_SHORT_5_6_5  |       RGB：每个分量分别占据5、6、5比特       |
  | gl.UNSIGNED_SHORT_4_4_4_4 |      RGBA：每个分量分别占据4,4,4,4比特       |
  | gl.UNSIGNED_SHORT_5_5_5_1 | RGBA：RGB每个分量各占据5比特，A分量占据1比特 |

- uniform1i(u_Sampler, 0)

  将0号纹理传递给着色器中的取样器变量。

- 

### webgl中的坐标系

webgl是一个三维的坐标系，x轴是横轴，正方向向右，y轴为竖轴，正方向向上，z轴为垂直于屏幕的，正方向向外。原点在canvas画布的中心，并且画布的大小是从-1到1.

canvas为二维坐标系，x轴是横轴，正方向向右，y轴为竖轴，正方向向上，原点在canvas的中心，并且画布的大小是从-1到1.

纹理坐标系：是一个二维的坐标系，为了将纹理坐标和广泛使用的x坐标和y坐标区分开来，使用s和t命名纹理坐标。s方向向右，t方向向上，原点在图像的左下角。范围为0.0到1.0；

平移操作：平移操作的本质就是对每个顶点都在同一个方向上，移动相同的距离，应该对顶点进行操作。

平移矩阵：

|  1   |  0   |  0   |  x   |
| :--: | :--: | :--: | :--: |
|  0   |  1   |  0   |  y   |
|  0   |  0   |  1   |  z   |
|  0   |  0   |  0   |  1   |

旋转操作：旋转操作本质上也是对每个顶点的操作，可以更细的参数有旋转轴，旋转方向，旋转角度。旋转方向一般根据旋转角度来判断，旋转角度为正则是逆时针，旋转角度为负则是顺时针。

旋转的公式：
$$
x' = x*cosa - y*sina\\
y' = x*sina + ycousa\\
z' = z\\
$$
旋转矩阵：(绕着z轴进行旋转)

| cos(a) | -sin(a) |  0   |  0   |
| :----: | :-----: | :--: | :--: |
| sin(a) | cos(a)  |  0   |  0   |
|   0    |    0    |  1   |  0   |
|   0    |    0    |  0   |  1   |

缩放操作：缩放操作同样可以使用一个矩阵来进行变换

缩放矩阵：

|  a   |  0   |  0   |  0   |
| :--: | :--: | :--: | :--: |
|  0   |  b   |  0   |  0   |
|  0   |  0   |  c   |  0   |
|  0   |  0   |  0   |  1   |

模型变换的相乘顺序是与真正的变换顺序是相反的。

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

- varying

  用于从顶点着色器向片段着色器传值。

- 使用缓冲区对象向顶点着色器传入多个顶点的数据的步骤
  1. 创建缓冲区对象。
  2. 绑定缓冲区对象。
  3. 将数据写入缓冲区对象。
  4. 将缓冲区对象分配给一个attribute变量。
  5. 开启attribute变量。

- 纹理映射的步骤
  1. 准备好映射到几何图形上的纹理图像。
  2. 为几何图形配置纹理映射方式。
  3. 加载纹理图像，对其进行一些配置，以在webgl中使用它。
  4. 在片元着色器中将相应的纹素从纹理中抽取出来，并将纹素的颜色赋给片元。
  
  程序化的步骤分为：
  
  1. 顶点着色器中接收顶点的纹理坐标，光栅化后传递给片元着色器。
  2. 片元着色器根据片元的纹理坐标，从纹理图像中抽取出纹素颜色，赋给当前片元。
  3. 设置顶点的纹理坐标。
  4. 准备待加载的纹理图像，令浏览器读取它。
  5. 监听纹理图像的加载事件，一旦加载完成，就在WebGL系统中使用纹理。

专用于纹理的数据类型

- sampler2D  绑定到gl.TEXTURE_2D上的纹理数据类型
- samplerCube  绑定到gl.TEXTURE_CUBE_MAP上的纹理数据类型

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

    内置的变量，表示点的尺寸，只在绘制点的时候有用，但是绘制图形的时候是没有用的。

- 片段着色器

  - gl_FragColor: vec4

    内置的变量，表示像素的颜色
  
  - gl_FragCoord: vec4
  
    内置变量，第1个和第2个分量表示片元在canvas坐标系统（窗口坐标系统，2维坐标系统）中的坐标值。
  
  - texture2D(sampler2D sampler, vec2 coord)
  
    从sampler指定的纹理上获取coord指定的纹理坐标处的像素颜色。
  
    - sampler 指定纹理单元编号
    - coord  指定纹理坐标