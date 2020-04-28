### webgl重要api

- clearColor(0, 0, 0, 1)

  设置清空canvas的颜色，后面的4个参数分别表示rgba。注意，这步并不会执行清空效果，只是设置一个清空颜色。颜色值的范围并不是0-255而是0.0-1.0

- clear(gl.COLOR_BUFFER_BIT)

  清空canvas，这步才会真正的清空。

  - gl.COLOR_BUFFER_BIT  实际上清空画布清空的是颜色缓冲区。用clearColor指定的颜色清空，并填充。

  这个函数实际上可以清空传入参数的缓冲区，并不仅仅可以传入颜色缓冲区，还可以传入深度缓冲区等等。

  - gl.DEPTH_BUFFER_BIT  深度缓冲区，一个中间对象，其作用就是帮助WebGL进行隐藏面消除。在绘制任意一帧之前，都必须清除深度缓冲区，以消除绘制上一帧时在其中留下的痕迹。如果不这样做，就会出现错误的结果。

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

- uniform3fv(location, vec3)

  将矢量vec3传给location参数指定的uniform变量

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

- enable(cap)

  开启cap表示的功能（capability）

  - gl.DEPTH_TEST  隐藏面消除
  - gl.BLEND  混合
  - gl.POLYGON_OFFSET_FILL  多边形位移

- disable(cap)

  关闭cap表示的功能；

- polygonOffset(factor, units)

  指定加到每个顶点绘制后Z值上的偏移量，偏移量按照公司m\*factor+r\*units计算，其中m表示顶点所在表面相对于观察者的视线的角度，而r表示硬件能够区分两个Z值之差的最小值。

- gl.ELEMENT_ARRAY_BUFFER

  它管理着具有索引结构的三维模型数据。

- drawElements(mode, count, type, offset)

  执行着色器，按照mode参数指定的方式，根据绑定到gl.ELEMENT_ARRAY_BUFFER的缓冲区中的顶点索引值绘制图形。

  - mode

    指定绘制方式，可接收一下常量符号：gl.POINTS, gl.LINES, gl.LINE_STRIP, gl.LINE_LOOP, gl.TRIANGLES, gl.TRIANGLE_STRIP, gl.TRIANGLE_FAN

  - count

    指定绘制顶点的个数

  - type

    指定索引值数据类型：gl.UNSIGNED_BYTE或gl.UNSIGNED_SHORT

  - offset

    指定索引数组中开始绘制的位置，以字节为单位

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

##### 视图矩阵：

视图矩阵其实和变换矩阵可以相互的转换替代，但是在比较复杂的情况下我们一般是使用视图模型矩阵（视图矩阵右乘模型矩阵）；

##### 可视空间:

观察者的水平视角、垂直视角和可视深度，定义了可视空间。

有两种常用的可视空间：

- 长方体可视空间，也称盒状空间，由正射投影产生。

  盒状可视空间由前后两个矩形表面确定，分别称近裁剪面和远裁剪面。

  便于真实观察物体，同样大小的物体，不论距离观察者的距离，都是一样大的，便于对物体结构进行分析。

  <canvas>上显示的就是可视空间中物体在近裁剪面上的投影。如果裁剪面的宽高比和<canvas>不一样，那么画面就会被按照<canvas>的宽高比进行压缩，物体会被扭曲。近裁剪面与远裁剪面之间的盒型空间就是可视空间，只有在此空间内的物体会被显示出来。如果某个物体一部分在可视空间内，一部分在其外，那就只显示空间内的部分。

- 四棱锥/金字塔可视空间，由透视投影产生。

  具有深度感，同样大小的物体，距离观察者的距离不同，那么显示的大小也不相同，是符合人眼在正常情况下的视觉观察的。

在上面说过，如果可视空间近裁剪面的宽高比与<canvas>不一致，显示出的物体就会被压缩变形。如将近裁剪面的宽度和高度改为了原来的一半，但是保持了宽高比。结果显示三角形变成了之前大小的两倍。这是由于<canvas>的大小没有发生变化，但是它表示的可视空间却缩小了一半。

再比如，把近裁剪面的宽度缩小为原先的一半，保持其高度不变。结果显示，由于近裁剪面宽度缩小而高度不变，相当于把长方形的近裁剪面映射到了正方形的<canvas>上，所以绘制出来的三角形就在宽度上拉伸而导致变形了。

##### 顶点坐标，视图矩阵，变换矩阵，可视空间矩阵如何算出最终的顶点坐标？

最终的顶点坐标 = 可视空间矩阵 * 视图矩阵 * 变换矩阵 * 初始的顶点坐标

##### 顶点坐标

一般来说顶点坐标只包含一个三维的（x，y，z）的顶点数据，但是如果考虑到颜色的话（因为在缓冲区中，顶点坐标的数据和顶点的颜色信息是放在一起的），其实一个顶点的具体信息是包括（x,y,z,r,g,b,a）这些信息的。也就是说，即使顶点位置坐标相同，但是颜色信息不同，那么这也是两个不同的顶点。

##### 隐藏面消除

这个功能会帮助我们消除那些被遮挡的表面（隐藏面），你可以放心的绘制场景而不必顾及各物体在缓冲区中的顺序，因为哪些远处的物体会自动被近处的物体挡住，不会被绘制出来。

开启方式：

1. gl.enable(gl.DEPTH_TEST);
2. gl.clear(gl.DEPTH_BUFFER_BIT);

注意：隐藏面消除的前提是正确设置可视空间，否则就可能产生错误的结果。不管是盒状的正射投影空间，还是金字塔状的透视投影空间，必须使用一个。

##### 深度冲突

隐藏面消除是WebGL的一项复杂而又强大的特性，在绝大多数情况下，它都能很好滴完成任务。然而，当几何图形或物体的两个表面极为接近时，就会出现新的问题，使得表面看上去斑斑驳驳的，这种现象被称为深度冲突。

解决这个问题有两种方式：

1. 在三维建模的时候就注意每个物体的深度值，避免物体之间的深度值过于接近；
2. 但是在移动的物体当中，上一个解决方案基本无效，所以WebGL引入了多边形偏移的机制；

##### 多边形偏移

该机制将自动在Z值加上一个偏移量，偏移量的值由物体表面相对于观察者视线的角度来确定。

开启方式：

1. 启用多边形偏移

   gl.enable(gl.POLYGON_OFFSET_FILL)

2. 在绘制之前指定用来计算偏移量的参数

   gl.polygonOffset(1.0, 1.0)

##### 光源类型

真实世界中的光主要有两种类型：平行光，类似于自然中的太阳光；点光源光，类似于人造灯泡的光。此外，我们还用环境光来模拟真实世界中的非直射光（也就是由光源发出后经过墙壁或其他物体反射后的光）。三维图形学还使用一些其他类型的光，比如用聚光灯光来模拟电筒，车前灯。

- 平行光   可以用一个方向和一个颜色来定义。
- 点光源光   指定点光源的位置和颜色，光线的方向将根据点光源的位置和被照射之处的位置计算出来，因为点光源的光线的方向在场景内的不同位置是不同的。
- 环境光   从各个角度照射物体，其强度都是一致的。环境光不用指定位置和方向，只需要指定颜色即可。

##### 反射类型

物体表面反射光向的方式有两种：漫反射和环境反射。

- 漫反射   漫反射是针对平行光或点光源而言的。<漫反射光颜色>=<入射光颜色>\*<表面基底色>\*cos(a)

  cos(a)=<光线方向>点乘<法线方向>

  <漫反射光颜色>=<入射光颜色>\*<表面基底色>\*(<光线方向>点乘<法线方向>)     前提是归一化，还有这里的光线方向实际上是入射方向的反方向

- 环境反射   环境反射是针对环境光的。<环境反射光颜色>=<入射光颜色>\*<表面基底色>

综上，<表面的反射光颜色>=<漫反射光颜色>+<环境反射光颜色>

##### 坐标变换引起的法向量的变化

- 平移变换不会改变法向量，因为平移不会改变物体的方向；
- 旋转变换会改变法向量，因为旋转改变了物体的方向；
- 缩放变换对法向量的影响较为复杂。

##### 逆转置矩阵

对顶点进行变换的矩阵称为模型变换矩阵。如何计算变换之后的法向量呢？只要将变换之前的法向量乘以模型矩阵的**逆转置矩阵**即可。所谓逆转置矩阵，就是逆矩阵的转置。

- 逆矩阵   如果矩阵M的逆矩阵是R，那么R\*M或M\*R的结果都是单位矩阵。
- 转置矩阵  将矩阵的行列进行调换。

**规则：用法向量乘以模型变换矩阵的逆转置矩阵，就可以求得变换后的法向量。**

求逆转置矩阵的两个步骤：

1. 求原矩阵的逆矩阵；
2. 将上一步求得的逆矩阵进行转置；

### JavaScript与着色器之间的数据传输

- attribute

  传输的是那些与顶点相关的数据。用来从外部向顶点着色器内传输数据，只有顶点着色器能使用它。

  例子：attribute vec4 a_Position;

  1. 在顶点着色器中声明attribute变量
  2. 将attribute变量赋值给gl_Position变量
  3. 向attribute变量传输数据

- uniform

  传输的是那些对于所有顶点都相同（或者是无关）的数据。只读数据，可以是除了数组或结构体之外的任意类型。如果顶点着色器和片元着色器中声明了同名的uniform变量，那么它就会被两种着色器共享。

  1. 在片段着色器中准备uniform变量；
  2. 用这个uniform变量向gl_FragColor赋值；
  3. 将颜色数据从JavaScript传给该uniform变量；

- varying

  用于从顶点着色器向片段着色器传值。

- 进度限定字

  用来控制程序的变量进度的，影响内存开销和运行速度；默认值为

  ```glsl
  precision mediump float;
  ```

  WebGl程序支持三种精度，其限定字分别为highp(高精度)，mediump（中精度）,low(低精度)。

  | 精度限定字 | 描述                                                 |
  | :--------: | ---------------------------------------------------- |
  |   highp    | 高精度，顶点着色器的最低精度                         |
  |  mediump   | 中精度，介于高精度与低精度之间，片元着色器的最低精度 |
  |    lowp    | 低精度，低于中精度，可以表示所有颜色                 |

  数据类型的默认精度

  | 着色器类型 | 数据类型    | 默认精度 |
  | ---------- | ----------- | -------- |
  | 顶点着色器 | int         | highp    |
  |            | float       | highp    |
  |            | sampler2D   | lowp     |
  |            | samplerCube | lowp     |
  | 片元着色器 | int         | mediump  |
  |            | float       | 无       |
  |            | sampler2D   | lowp     |
  |            | samplerCUbe | lowp     |

- 预处理指令

  预处理指令用来在真正编译之前对代码进行预处理，都以#开始。

  ```glsl
  #ifdef GL_ES
  precision mediump float;
  #endif
  ```

  

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

##### 数据值类型：支持两种数据值类型（不支持字符串类型，虽然字符串对尚未图形语言来说还是有一定意义的）

- 数值类型

  支持整形数和浮点数。

- 布尔值类型

  包括true和false。

##### 数组

只支持一维数组，例子：

```glsl
float floatArray[4];  // 声明含有4个浮点数元素的数组
```

数组不能再声明时被一次性的初始化，而必须显示的对每个元素进行初始化。

##### 取样器（纹理）

取样器变量只能是uniform变量，或者需要访问纹理的函数；

##### 参数限定词

我们可以将函数参数定义成：（1）传递给函数的；（2）将要在函数中被赋值的；（3）既是传递给函数的，也是将要在函数中被赋值的；

|   类别   |                  规则                  | 描述                                                         |
| :------: | :------------------------------------: | ------------------------------------------------------------ |
|    in    |             向函数中传入值             | 参数传入函数，函数内可以使用参数的值，也可以修改其值。但函数内部的修改不会影响传入的值 |
| const in |             向函数中传入值             | 参数传入函数，函数内可以使用参数的值，但不能修改             |
|   out    |        在函数中被赋值，并被传出        | 传入变量的引用，若其在函数内被修改，会影响到函数外部传入的变量 |
|  inout   | 传入函数，同时在函数中被赋值，并被传出 | 传入变量的引用，函数会用到变量的初始值，然后修改变量的值，会影响到函数外部传入的变量。 |



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

### Matrix4矩阵库关键函数说明

- setLookAt(eyeX, eyeY, eyeZ, atX, atY, atZ, upX, upY, upZ)

  根据视点，观察点，上方向创建视图矩阵。视图矩阵的类型是Matrix4，其观察点映射到<canvas>的中心点。

- setOrtho(left, right, bottom, top, near, far)

  通过各参数计算正射投影矩阵，将其存储在Matrix4中。注意，left不一定与right相等，bottom不一定与top相等，near与far不相等。

  此矩阵叫做正射投影矩阵。

- setPerspective(fov, aspect, near, far)

  通过各参数计算透视投影矩阵，将其存储在Matrix中。注意，near的值必须小于far。

  - fov  指定垂直视角，即可视空间顶面和底面间的夹角，必须大于0
  - aspect  指定近裁剪面的宽高比（宽度/高度）
  - near，far  指定近裁剪面和远裁剪面的位置，即可视空间的近边界和远边界（near和far必须都大于0）

  定义了透视投影可视空间的矩阵被称为透视投影矩阵。

- setInverseOf(m)

  使自身（调用本方法的Matrix4类型的实例）成为矩阵m的逆矩阵；

- transpose()

  对自身进行转置操作，并将自身设为转置后的结果；