// 从字符串中加载着色器程序
const loadShader = (gl, type, source) => {
    // Create shader object
    const shader = gl.createShader(type);
    if (shader == null) {
        console.log('unable to create shader');
        return null;
    }

    // Set the shader program
    gl.shaderSource(shader, source);

    // Compile the shader
    gl.compileShader(shader);

    // Check the result of compilation
    var compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (!compiled) {
        var error = gl.getShaderInfoLog(shader);
        console.log('Failed to compile shader: ' + error);
        gl.deleteShader(shader);
        return null;
    }

    return shader;
};

// 创建着色程序
const createProgram = (gl, vshader, fshader) => {
    // Create shader object
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vshader);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fshader);
    if (!vertexShader || !fragmentShader) {
        return null;
    }

    // Create a program object
    const program = gl.createProgram();
    if (!program) {
        return null;
    }

    // Attach the shader objects
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);

    // Link the program object
    gl.linkProgram(program);

    // Check the result of linking
    const linked = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (!linked) {
        var error = gl.getProgramInfoLog(program);
        console.log('Failed to link program: ' + error);
        gl.deleteProgram(program);
        gl.deleteShader(fragmentShader);
        gl.deleteShader(vertexShader);
        return null;
    }
    return program;
};

// 初始化着色器程序
const initShaders = (gl, vshader, fshader) => {
    // 创建着色程序
    const program = createProgram(gl, vshader, fshader);
    if (!program) {
        console.log('Failed to create program');
        return false;
    }
    // 使用着色程序
    gl.useProgram(program);
    gl.program = program;

    return true;
};

// 处理canvas的点击事件
const click = (e, gl, canvas, a_Position, u_color, g_points, g_colors) => {
    let x = e.clientX;
    let y = e.clientY;
    const rect = e.target.getBoundingClientRect();
    x = (x - rect.left - canvas.width / 2) / (canvas.width / 2);
    y = -(y - rect.top - canvas.height / 2) / (canvas.height / 2);
    g_points.push([x,y]);
    g_colors.push([Math.abs(x), Math.abs(y), Math.abs(Math.random())]);
    gl.clear(gl.COLOR_BUFFER_BIT);
    for (let index = 0; index < g_points.length; index++) {
        gl.vertexAttrib4f(a_Position, g_points[index][0], g_points[index][1], 0.0, 1.0);
        gl.uniform4f(u_color, g_colors[index][0], g_colors[index][1], g_colors[index][2], 1.0);
        gl.drawArrays(gl.POINTS, 0, 1);
    }
    // 为什么下面这样不行,因为webgl是基于颜色缓冲区来绘制的，每次绘制结束都会自动重置颜色缓冲区，
    // 所以这样只会绘制最近的点，之前没有存储的点都将会丢弃
    // gl.vertexAttrib4f(a_Position, x, y, 0.0, 1.0);
    // gl.drawArrays(gl.POINTS, 0, 1);
};

// 用缓存设置顶点位置
const initVertexBuffers = gl => {
    const vertices = new Float32Array([0.0, 0.5, -0.5, -0.5, 0.5, -0.5]);
    // 点的个数
    const n = 3;
    // 创建缓冲区对象
    const vertexBuffer = gl.createBuffer();
    // 将缓冲区对象绑定到目标
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    // 向缓冲区对象中写入数据
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    // 将缓冲区对象分配给a_Position变量
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
    // 连接a_Position变量与分配给它的缓冲区对象.
    gl.enableVertexAttribArray(a_Position);

    return n;
};

window.onload = () => {
    const canvas = document.querySelector('#canvas');
    const gl = canvas.getContext('webgl');
    // 设置顶点着色器
    const VSHADER_SOURCE = `
        attribute vec4 a_Position;  // 用于从外部传输变量
        attribute float a_PointSize;
        void main() { // 不可以指定参数
            gl_Position = a_Position; // 设置坐标位置,内置的变量
            gl_PointSize = a_PointSize; // 设置点的尺寸，内置的变量
        }
    `;
    // 片段着色器
    const FSHADER_SOURCE = `
        precision mediump float;
        uniform vec4 u_color;
        void main() {
            gl_FragColor = u_color; // 设置颜色,内置的变量
        }
    `;
    // 初始化着色器
    initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE);
    // 获取attribute变量的存储位置
    const a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    const a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize');
    const u_color = gl.getUniformLocation(gl.program, 'u_color');
    // 将顶点位置传输给attitude变量
    // gl.vertexAttrib4f(a_Position, 0.5, -0.5, 0.0, 1.0);
    gl.vertexAttrib1f(a_PointSize, 10.0);
    // 设置清空的颜色值
    gl.clearColor(0.5, 0.5, 0.5, 1.0);
    // 清空指定的缓冲区，颜色缓冲区的内容会自动渲染在浏览器上
    gl.clear(gl.COLOR_BUFFER_BIT);
    // const g_points = [];
    // const g_colors = [];
    // canvas.onclick = e => {
    //     click(e, gl, canvas, a_Position, u_color, g_points, g_colors);
    // };
    // 绘制一个点
    // gl.drawArrays(gl.POINTS, 0, 1);

    const n = initVertexBuffers(gl);

    gl.drawArrays(gl.POINTS, 0, n);
};