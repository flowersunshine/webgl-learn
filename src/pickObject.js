import sky_clound from './resource/sky_cloud.jpg';
import {
    Matrix4,
    Vector3
} from './cuon-matrix';
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

// 初始化数组缓冲区
const initArrayBuffer = (gl, data, num, type, attribute) => {
    const buffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

    const a_attribute = gl.getAttribLocation(gl.program, attribute);

    gl.vertexAttribPointer(a_attribute, num, type, false, 0, 0);
    gl.enableVertexAttribArray(a_attribute);

    return true;
};

// 初始化缓冲区对象，但是不赋值给着色器
const initArrayBufferForLaterUse = (gl, data, num, type) => {
    const buffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    buffer.num = num;
    buffer.type = type;
    return buffer;
};

// 用缓存设置顶点位置
const initVertexBuffers = gl => {
    // Vertex coordinate (prepare coordinates of cuboids for all segments)
    var vertices = new Float32Array([   // Vertex coordinates
        1.0, 1.0, 1.0,  -1.0, 1.0, 1.0,  -1.0,-1.0, 1.0,   1.0,-1.0, 1.0,    // v0-v1-v2-v3 front
        1.0, 1.0, 1.0,   1.0,-1.0, 1.0,   1.0,-1.0,-1.0,   1.0, 1.0,-1.0,    // v0-v3-v4-v5 right
        1.0, 1.0, 1.0,   1.0, 1.0,-1.0,  -1.0, 1.0,-1.0,  -1.0, 1.0, 1.0,    // v0-v5-v6-v1 up
       -1.0, 1.0, 1.0,  -1.0, 1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0,-1.0, 1.0,    // v1-v6-v7-v2 left
       -1.0,-1.0,-1.0,   1.0,-1.0,-1.0,   1.0,-1.0, 1.0,  -1.0,-1.0, 1.0,    // v7-v4-v3-v2 down
        1.0,-1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0, 1.0,-1.0,   1.0, 1.0,-1.0     // v4-v7-v6-v5 back
     ]);
   
     var colors = new Float32Array([   // Colors
       0.2, 0.58, 0.82,   0.2, 0.58, 0.82,   0.2,  0.58, 0.82,  0.2,  0.58, 0.82, // v0-v1-v2-v3 front
       0.5,  0.41, 0.69,  0.5, 0.41, 0.69,   0.5, 0.41, 0.69,   0.5, 0.41, 0.69,  // v0-v3-v4-v5 right
       0.0,  0.32, 0.61,  0.0, 0.32, 0.61,   0.0, 0.32, 0.61,   0.0, 0.32, 0.61,  // v0-v5-v6-v1 up
       0.78, 0.69, 0.84,  0.78, 0.69, 0.84,  0.78, 0.69, 0.84,  0.78, 0.69, 0.84, // v1-v6-v7-v2 left
       0.32, 0.18, 0.56,  0.32, 0.18, 0.56,  0.32, 0.18, 0.56,  0.32, 0.18, 0.56, // v7-v4-v3-v2 down
       0.73, 0.82, 0.93,  0.73, 0.82, 0.93,  0.73, 0.82, 0.93,  0.73, 0.82, 0.93, // v4-v7-v6-v5 back
      ]);

    // Indices of the vertices
    var indices = new Uint8Array([
        0, 1, 2, 0, 2, 3, // front
        4, 5, 6, 4, 6, 7, // right
        8, 9, 10, 8, 10, 11, // up
        12, 13, 14, 12, 14, 15, // left
        16, 17, 18, 16, 18, 19, // down
        20, 21, 22, 20, 22, 23 // back
    ]);

    // 创建缓冲区对象
    const indexBuffer = gl.createBuffer();
    // 将缓冲区对象绑定到目标
    initArrayBuffer(gl, vertices, 3, gl.FLOAT, 'a_Position');
    initArrayBuffer(gl, colors, 3, gl.FLOAT, 'a_color');

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

    return indices.length;
};

// 初始化纹理信息
const initTextures = (gl, n) => {
    const texture = gl.createTexture(); // 创建纹理对象
    const u_sampler = gl.getUniformLocation(gl.program, 'u_sampler');

    const image = new Image();

    image.onload = () => {
        loadTexture(gl, n, texture, u_sampler, image);
    };

    image.src = sky_clound;

    return true;
};

// 加载纹理
const loadTexture = (gl, n, texture, u_sampler, image) => {
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // 对纹理图像进行y轴反转
    // 开启0号纹理单元
    gl.activeTexture(gl.TEXTURE0);
    // 向target绑定纹理对象
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // 配置纹理参数
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    // 配置纹理图像
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

    // 将0号纹理传递给着色器
    gl.uniform1i(u_sampler, 0);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
};

const draw = (gl, n, currentAngle, u_ModalMatrix) => {

    const modalMatrix = new Matrix4();
    modalMatrix.setRotate(currentAngle, 1.0, 0.0, 0.0);
    modalMatrix.rotate(currentAngle, 0.0, 1.0, 0.0);
    modalMatrix.rotate(currentAngle, 0.0, 0.0, 1.0);


    gl.uniformMatrix4fv(u_ModalMatrix, false, modalMatrix.elements);
    
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
};

var last = Date.now(); // Last time that this function was called
function animate(angle) {
  var now = Date.now();   // Calculate the elapsed time
  var elapsed = now - last;
  last = now;
  // Update the current rotation angle (adjusted by the elapsed time)
  var newAngle = angle + (ANGLE_STEP * elapsed) / 1000.0;
  return newAngle % 360;
}


const check = (gl, n, x, y, currentAngle, u_Clicked, u_ModalMatrix) => {
    let picked = false;
    gl.uniform1i(u_Clicked, 1); // 将立方体绘制为红色
    draw(gl, n, currentAngle, u_ModalMatrix);
    // 读取点击位置的像素颜色值
    let pixels = new Uint8Array(4); // 存储像素的数组
    gl.readPixels(x, y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
    if (pixels[0] == 255) { // 如果pixels[0]是255则说明点击在物体上
        picked = true;
    }
    gl.uniform1i(u_Clicked, 0);
    draw(gl, n, currentAngle, u_ModalMatrix);
    return picked;
};

// 带可视空间的
const main = (gl, canvas) => {
    // 设置顶点坐标和颜色（蓝色三角形在最前面）
    const n = initVertexBuffers(gl);

    const u_ModalMatrix = gl.getUniformLocation(gl.program, 'u_ModalMatrix');
    const u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
    const u_ProjMatrix = gl.getUniformLocation(gl.program, 'u_ProjMatrix');
    const u_Clicked = gl.getUniformLocation(gl.program, 'u_Clicked');

    // 设置透视矩阵
    const projMatrix = new Matrix4();
    projMatrix.setPerspective(50.0, 1, 1, 100);
    
    const viewMatrix = new Matrix4();
    viewMatrix.setLookAt(0, 0, 7, 0, 0, 0, 0, 1, 0);

    let currentAngle = 0.0; // 当前的旋转角度


    canvas.onmousedown = ev => {
        let x = ev.clientX;
        let y = ev.clientY;
        let rect = ev.target.getBoundingClientRect();
        if (rect.left <= x && x < rect.right && rect.top <= y && y < rect.bottom) {
            // 检查是否点击在物体上
            let x_in_canvas = x - rect.left;
            let y_in_canvas = rect.bottom - y;
            let picked = check(gl, n, x_in_canvas, y_in_canvas, currentAngle, u_Clicked, u_ModalMatrix);
            if (picked) {
                alert('The cube was selected');
            }
        }
    };

    // // 设置视图模型矩阵
    gl.uniformMatrix4fv(u_ProjMatrix, false, projMatrix.elements);
    gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);
    // gl.uniformMatrix4fv(u_ModalMatrix, false, modalMatrix.elements);

    gl.uniform1i(u_Clicked, 0);

    // // 绘制三角形
    // gl.drawArrays(gl.TRIANGLES, 0, n);
    // 绘制立方体
    // gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
    var tick = function() {   // Start drawing
        currentAngle = animate(currentAngle);
        draw(gl, n, currentAngle, u_ModalMatrix);
        requestAnimationFrame(tick);
    };
    tick();
};

var ANGLE_STEP = 20.0; // Rotation angle (degrees/second)
window.onload = () => {
    const canvas = document.querySelector('#canvas');
    const gl = canvas.getContext('webgl');
    // 设置顶点着色器
    const VSHADER_SOURCE = `
        attribute vec4 a_Position;  // 用于从外部传输变量
        attribute vec4 a_color;
        uniform mat4 u_ModalMatrix; // 变换矩阵
        uniform mat4 u_ViewMatrix; // 视图矩阵
        uniform mat4 u_ProjMatrix; // 可视矩阵
        uniform bool u_Clicked; // 鼠标按下
        varying vec4 v_color;
        void main() { // 不可以指定参数
            gl_Position = u_ProjMatrix * u_ViewMatrix * u_ModalMatrix * a_Position;
            if (u_Clicked) {
                v_color = vec4(1.0, 0.0, 0.0, 1.0);
            }
            else {
                v_color = a_color;
            }
        }
    `;
    // 片段着色器
    const FSHADER_SOURCE = `
        precision mediump float;
        varying vec4 v_color;
        void main() {
            gl_FragColor = v_color;
        }
    `;
    // 初始化着色器
    initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE);
    // 设置清空的颜色值
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.POLYGON_OFFSET_FILL);
    gl.polygonOffset(1.0, 1.0);
    gl.clearColor(0.5, 0.5, 0.5, 1.0);
    // 清空指定的缓冲区，颜色缓冲区的内容会自动渲染在浏览器上
    // gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    main(gl, canvas);
};