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


let radius = 0; // 旋转角度
// 用缓存设置顶点位置
const initVertexBuffers = gl => {
    var vertices = new Float32Array([
        1.5, 10.0, 1.5, -1.5, 10.0, 1.5, -1.5,  0.0, 1.5,  1.5,  0.0, 1.5, // v0-v1-v2-v3 front
        1.5, 10.0, 1.5,  1.5,  0.0, 1.5,  1.5,  0.0,-1.5,  1.5, 10.0,-1.5, // v0-v3-v4-v5 right
        1.5, 10.0, 1.5,  1.5, 10.0,-1.5, -1.5, 10.0,-1.5, -1.5, 10.0, 1.5, // v0-v5-v6-v1 up
       -1.5, 10.0, 1.5, -1.5, 10.0,-1.5, -1.5,  0.0,-1.5, -1.5,  0.0, 1.5, // v1-v6-v7-v2 left
       -1.5,  0.0,-1.5,  1.5,  0.0,-1.5,  1.5,  0.0, 1.5, -1.5,  0.0, 1.5, // v7-v4-v3-v2 down
        1.5,  0.0,-1.5, -1.5,  0.0,-1.5, -1.5, 10.0,-1.5,  1.5, 10.0,-1.5  // v4-v7-v6-v5 back
      ]);
    
      // Normal
      var normals = new Float32Array([
        0.0, 0.0, 1.0,  0.0, 0.0, 1.0,  0.0, 0.0, 1.0,  0.0, 0.0, 1.0, // v0-v1-v2-v3 front
        1.0, 0.0, 0.0,  1.0, 0.0, 0.0,  1.0, 0.0, 0.0,  1.0, 0.0, 0.0, // v0-v3-v4-v5 right
        0.0, 1.0, 0.0,  0.0, 1.0, 0.0,  0.0, 1.0, 0.0,  0.0, 1.0, 0.0, // v0-v5-v6-v1 up
       -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, // v1-v6-v7-v2 left
        0.0,-1.0, 0.0,  0.0,-1.0, 0.0,  0.0,-1.0, 0.0,  0.0,-1.0, 0.0, // v7-v4-v3-v2 down
        0.0, 0.0,-1.0,  0.0, 0.0,-1.0,  0.0, 0.0,-1.0,  0.0, 0.0,-1.0  // v4-v7-v6-v5 back
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
    // 点的个数
    // const n = vertices.length / 6;
    // 创建缓冲区对象
    const indexBuffer = gl.createBuffer();
    // 将缓冲区对象绑定到目标
    initArrayBuffer(gl, vertices, 3, gl.FLOAT, 'a_Position');
    // initArrayBuffer(gl, colors, 3, gl.FLOAT, 'a_color');
    initArrayBuffer(gl, normals, 3, gl.FLOAT, 'a_Normal');

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

let normalMatrix = new Matrix4();

const drawBox = (gl, n, modalMatrix, u_ModalMatrix, u_NormalMatrix) => {
    normalMatrix.setInverseOf(modalMatrix);
    normalMatrix.transpose();

    gl.uniformMatrix4fv(u_ModalMatrix, false, modalMatrix.elements);
    gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);

    gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
};

let modalMatrix = new Matrix4();

const draw = (gl, n, u_ModalMatrix, u_NormalMatrix) => {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    // arm1的长度
    let arm1Length = 10.0; // arm1的长度
    modalMatrix.setTranslate(0.0, -5.0, 0.0);
    modalMatrix.rotate(g_arm1Angle, 0.0, 1.0, 0.0); // 绕着Y轴
    drawBox(gl, n, modalMatrix, u_ModalMatrix, u_NormalMatrix);

    // arm2的长度
    modalMatrix.translate(0.0, arm1Length, 0.0);
    modalMatrix.rotate(g_arm2Angel, 0.0, 0.0, 1.0);
    modalMatrix.scale(1.3, 1.0, 1.3);
    drawBox(gl, n, modalMatrix, u_ModalMatrix, u_NormalMatrix);
};

const ANGLE_STEP = 3.0; // 每次按键转动的角度
let g_arm1Angle = 0.0; // arm1当前的角度
let g_arm2Angel = 0.0; // arm2当前的角度

const keydown = (ev, gl, n, u_ModalMatrix, u_NormalMatrix) => {
    switch (ev.keyCode) {
        case 38: {// 上方向键 -> arm2绕Z轴正向转动
            if (g_arm2Angel < 135.0) {
                g_arm2Angel += ANGLE_STEP;
            }
            break;
        }
        case 40: {// 下方向键 -> arm2绕Z轴负方向转动
            if (g_arm2Angel > -135.0) {
                g_arm2Angel -= ANGLE_STEP;
            }
            break;
        }
        case 37: {
            // 左方向键 -> arm1绕Y轴负方向转动
            g_arm1Angle = (g_arm1Angle - ANGLE_STEP) % 360; 
            break;
        }
        case 39: {
            // 右方向键 -> arm1绕Y轴正方向转动
            g_arm1Angle = (g_arm1Angle + ANGLE_STEP) % 360; 
            break;
        }
        default:
            return;
    }
    draw(gl, n, u_ModalMatrix, u_NormalMatrix);
};

// 带可视空间的
const main = gl => {
    const nf = document.querySelector('.near-far');

    // 设置顶点坐标和颜色（蓝色三角形在最前面）
    const n = initVertexBuffers(gl);

    const u_ModalMatrix = gl.getUniformLocation(gl.program, 'u_ModalMatrix');
    const u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
    const u_ProjMatrix = gl.getUniformLocation(gl.program, 'u_ProjMatrix');
    const u_LightColor = gl.getUniformLocation(gl.program, 'u_LightColor');
    // const u_LightDirection = gl.getUniformLocation(gl.program, 'u_LightDirection');
    const u_AmbientLight = gl.getUniformLocation(gl.program, 'u_AmbientLight');
    const u_NormalMatrix = gl.getUniformLocation(gl.program, 'u_NormalMatrix');
    const u_LightPosition = gl.getUniformLocation(gl.program, 'u_LightPosition');

    gl.uniform3f(u_LightColor, 1.0, 1.0, 1.0);
    // const lightDirection = new Vector3([0.5, 3.0, 4.0]);
    // lightDirection.normalize();
    // gl.uniform3fv(u_LightDirection, lightDirection.elements);

    // 设置透视矩阵
    const projMatrix = new Matrix4();
    projMatrix.setPerspective(50.0, 1, 1, 100);
    // document.onkeydown = ev => {
    //     keydown(ev, gl, n, u_ProjMatrix, projMatrix, u_ViewModalMatrix, modalMatrix, nf);
    // };

    // projMatrix.setLookAt(0.20, 0.25, 0.25, 0, 0, 0, 0, 1, 0);
    const viewMatrix = new Matrix4();
    viewMatrix.setLookAt(0, 0, 30, 0, 0, 0, 0, 1, 0);
    // const modalMatrix = new Matrix4();
    // modalMatrix.setTranslate(0, 0.5, 0);
    // modalMatrix.rotate(0, 0, 0, 1);
    // const viewModalMatrix = viewMatrix.multiply(modalMatrix);

    // const normalMatrix = new Matrix4();
    // normalMatrix.setInverseOf(modalMatrix);
    // normalMatrix.transpose();

    document.onkeydown = ev => {
        keydown(ev, gl, n, u_ModalMatrix, u_NormalMatrix);
    };

    // // 设置视图模型矩阵
    gl.uniformMatrix4fv(u_ProjMatrix, false, projMatrix.elements);
    gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);
    // gl.uniformMatrix4fv(u_ModalMatrix, false, modalMatrix.elements);
    // gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);

    gl.uniform3f(u_AmbientLight, 0.1, 0.1, 0.1);

    gl.uniform3f(u_LightPosition, 0.0, 3.0, 4.0);

    // // 绘制三角形
    // gl.drawArrays(gl.TRIANGLES, 0, n);
    // 绘制立方体
    // gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
    draw(gl, n, u_ModalMatrix, u_NormalMatrix);
};

window.onload = () => {
    const canvas = document.querySelector('#canvas');
    const gl = canvas.getContext('webgl');
    // 设置顶点着色器
    const VSHADER_SOURCE = `
        attribute vec4 a_Position;  // 用于从外部传输变量
        attribute vec4 a_color;
        attribute vec4 a_Normal; // 顶点的法向量
        uniform mat4 u_NormalMatrix; // 变换矩阵的逆转置矩阵
        // attribute vec2 a_textCoord;
        uniform mat4 u_ModalMatrix; // 变换矩阵
        uniform mat4 u_ViewMatrix; // 视图矩阵
        uniform mat4 u_ProjMatrix; // 可视矩阵
        // uniform vec3 u_LightDirection; // 归一化后的光线方向
        varying vec4 v_color;
        varying vec3 v_Normal;
        varying vec3 v_Position;
        // varying vec2 v_textCoord;
        void main() { // 不可以指定参数
            // gl_PointSize = a_PointSize;  // 设置点的尺寸，内置的变量，当绘制单点时有用，绘制图形时没用
            gl_Position = u_ProjMatrix * u_ViewMatrix * u_ModalMatrix * a_Position;
            // 计算顶点的变换后的坐标
            v_Position = (u_ModalMatrix * a_Position).xyz;
            // 对顶点法向量进行归一化
            v_Normal = normalize(vec3(u_NormalMatrix * a_Normal));
            v_color = vec4(1.0, 0.0, 0.0, 1.0);
            // v_textCoord = a_textCoord;
        }
    `;
    // 片段着色器
    const FSHADER_SOURCE = `
        precision mediump float;
        uniform vec3 u_LightPosition; // 光源的位置
        uniform vec3 u_LightColor; // 平行光线颜色
        uniform vec3 u_AmbientLight; // 环境光颜色
        varying vec4 v_color;
        varying vec3 v_Normal;
        varying vec3 v_Position;
        // varying vec2 v_textCoord;
        // uniform sampler2D u_sampler;
        void main() {
            // gl_FragColor = texture2D(u_sampler, v_textCoord);
            // 对法线进行归一化，因为其内插之后长度不一定是1.0
            vec3 normal = normalize(v_Normal);
            vec3 lightDirection = normalize(u_LightPosition - v_Position);
            // 计算光线方向和法向量的点积
            float nDotL = max(dot(normal, lightDirection), 0.0);
            // 计算漫反射光的颜色
            vec3 diffuse = u_LightColor * vec3(v_color) * nDotL;
            // 计算环境光产生的反射光颜色
            vec3 ambient = u_AmbientLight * v_color.rgb;
            gl_FragColor = vec4(diffuse + ambient, v_color.a);
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
    main(gl);
};