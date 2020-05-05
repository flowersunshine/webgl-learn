import * as glMatrix from 'gl-matrix';
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

// 用缓存设置顶点位置
const initVertexBuffers = gl => {
    // Vertex coordinate (prepare coordinates of cuboids for all segments)
    let vertices = new Float32Array([
        1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, // v0-v1-v2-v3 front
        1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0, // v0-v3-v4-v5 right
        1.0, 1.0, 1.0, 1.0, 1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, // v0-v5-v6-v1 up
        -1.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, // v1-v6-v7-v2 left
        -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, -1.0, -1.0, 1.0, // v7-v4-v3-v2 down
        1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0 // v4-v7-v6-v5 back
    ]);

    var texCoords = new Float32Array([
        1.0, 1.0,   0.0, 1.0,   0.0, 0.0,   1.0, 0.0,    // v0-v1-v2-v3 front
        0.0, 1.0,   0.0, 0.0,   1.0, 0.0,   1.0, 1.0,    // v0-v3-v4-v5 right
        1.0, 0.0,   1.0, 1.0,   0.0, 1.0,   0.0, 0.0,    // v0-v5-v6-v1 up
        1.0, 1.0,   0.0, 1.0,   0.0, 0.0,   1.0, 0.0,    // v1-v6-v7-v2 left
        0.0, 0.0,   1.0, 0.0,   1.0, 1.0,   0.0, 1.0,    // v7-v4-v3-v2 down
        0.0, 0.0,   1.0, 0.0,   1.0, 1.0,   0.0, 1.0     // v4-v7-v6-v5 back
    ]);

    // Indices of the vertices
    var indices = new Uint8Array([
        0, 1, 2,   0, 2, 3,    // front
        4, 5, 6,   4, 6, 7,    // right
        8, 9,10,   8,10,11,    // up
       12,13,14,  12,14,15,    // left
       16,17,18,  16,18,19,    // down
       20,21,22,  20,22,23     // back
    ]);

    // 创建缓冲区对象
    const indexBuffer = gl.createBuffer();
    // 将缓冲区对象绑定到目标
    initArrayBuffer(gl, vertices, 3, gl.FLOAT, 'a_Position');
    initArrayBuffer(gl, texCoords, 2, gl.FLOAT, 'a_textCoord');

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

    return indices.length;
};

// 初始化纹理信息
const initTextures = (gl) => {
    const texture = gl.createTexture(); // 创建纹理对象
    const u_sampler = gl.getUniformLocation(gl.program, 'u_sampler');

    const image = new Image();

    image.onload = () => {
        loadTexture(gl, texture, u_sampler, image);
    };

    image.src = sky_clound;

    return true;
};

// 加载纹理
const loadTexture = (gl, texture, u_sampler, image) => {
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
};

const draw = (gl, n, u_ModalMatrix, currentAngle) => {
    let modalMatrix = new Matrix4();
    modalMatrix.setRotate(currentAngle[0], 1.0, 0.0, 0.0);
    modalMatrix.rotate(currentAngle[1], 0.0, 1.0, 0.0);

    gl.uniformMatrix4fv(u_ModalMatrix, false, modalMatrix.elements);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
};

const initEventHandlers = (canvas, currentAngle) => {
    let dragging = false; // 是否在拖动
    let lastX = -1;
    let lastY = -1; // 鼠标的最后位置

    canvas.onmousedown = ev => {
        let x = ev.clientX;
        let y = ev.clientY; // 鼠标的位置

        let rect = ev.target.getBoundingClientRect();
        if (rect.left <= x && x < rect.right && rect.top <= y && y < rect.bottom) {
            lastX = x;
            lastY = y;
            dragging = true;
        }
    };

    canvas.onmousemove = ev => {
        let x = ev.clientX;
        let y = ev.clientY;
        if (dragging) {
            let factor = 100 / canvas.height; // 旋转因子
            let dx = factor * (x - lastX);
            let dy = factor * (y - lastY);
            // 将沿Y轴旋转的角度控制在-90到90度之间
            currentAngle[0] = Math.max(Math.min(currentAngle[0] + dy, 90.0), -90.0);
            currentAngle[1] = currentAngle[1] + dx;
        }
        lastX = x;
        lastY = y;
    };

    canvas.onmouseup = ev => {
        dragging = false;
    };
};

// 带可视空间的
const main = (gl, canvas) => {

    const n = initVertexBuffers(gl);

    const u_ModalMatrix = gl.getUniformLocation(gl.program, 'u_ModalMatrix');
    const u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
    const u_ProjMatrix = gl.getUniformLocation(gl.program, 'u_ProjMatrix');

    // 设置透视矩阵
    const projMatrix = new Matrix4();
    projMatrix.setPerspective(30.0, 1, 1, 100);

    const viewMatrix = new Matrix4();
    viewMatrix.setLookAt(3.0, 3.0, 7.0, 0, 0, 0, 0, 1, 0);

    let currentAngle = [0.0, 0.0]; // 绕x轴和y轴的旋转角度
    initEventHandlers(canvas, currentAngle);

    initTextures(gl);

    const tick = () => {
        draw(gl, n, u_ModalMatrix, currentAngle);
        requestAnimationFrame(tick);
    };

    tick();

    // // 设置视图模型矩阵
    gl.uniformMatrix4fv(u_ProjMatrix, false, projMatrix.elements);
    gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);

    draw(gl, n, u_ModalMatrix, currentAngle);
};

window.onload = () => {
    const canvas = document.querySelector('#canvas');
    const gl = canvas.getContext('webgl');
    // 设置顶点着色器
    const VSHADER_SOURCE = `
        attribute vec4 a_Position;  // 用于从外部传输变量
        attribute vec2 a_textCoord;
        uniform mat4 u_ModalMatrix; // 变换矩阵
        uniform mat4 u_ViewMatrix; // 视图矩阵
        uniform mat4 u_ProjMatrix; // 可视矩阵
        varying vec2 v_textCoord;
        void main() { // 不可以指定参数
            // gl_PointSize = a_PointSize;  // 设置点的尺寸，内置的变量，当绘制单点时有用，绘制图形时没用
            gl_Position = u_ProjMatrix * u_ViewMatrix * u_ModalMatrix * a_Position;
            v_textCoord = a_textCoord;
        }
    `;
    // 片段着色器
    const FSHADER_SOURCE = `
        precision mediump float;
        varying vec2 v_textCoord;
        uniform sampler2D u_sampler;
        void main() {
            gl_FragColor = texture2D(u_sampler, v_textCoord);
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