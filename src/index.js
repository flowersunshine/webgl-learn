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

// 处理canvas的点击事件
const click = (e, gl, canvas, a_Position, u_color, g_points, g_colors) => {
    let x = e.clientX;
    let y = e.clientY;
    const rect = e.target.getBoundingClientRect();
    x = (x - rect.left - canvas.width / 2) / (canvas.width / 2);
    y = -(y - rect.top - canvas.height / 2) / (canvas.height / 2);
    g_points.push([x, y]);
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

// 创建绕着z轴旋转的旋转矩阵
const createZMatrix = a => {
    return new Float32Array([
        Math.cos(a), Math.sin(a), 0.0, 0.0,
        -Math.sin(a), Math.cos(a), 0.0, 0.0,
        0.0, 0.0, 1.0, 0.0,
        0.0, 0.0, 0.0, 1.0
    ]);
};

let radius = 0; // 旋转角度
// 用缓存设置顶点位置
const initVertexBuffers = gl => {
    // const vertices = new Float32Array([
    //     // 顶点坐标和颜色，三维的了
    //     0.0, 0.5, -0.4, 0.4, 1.0, 0.4, // 绿色三角形在最后面
    //     -0.5, -0.5, -0.4, 0.4, 1.0, 0.4,
    //     0.5, -0.5, -0.4, 1.0, 0.4, 0.4,

    //     0.5, 0.4, -0.2, 1.0, 0.4, 0.4, // 黄色三角形在中间
    //     -0.5, 0.4, -0.2, 1.0, 1.0, 0.4,
    //     0.0, -0.6, -0.2, 1.0, 1.0, 0.4,

    //     0.0, 0.5, 0.0, 0.4, 0.4, 1.0, // 蓝色三角形在最前面
    //     -0.5, -0.5, 0.0, 0.4, 0.4, 1.0,
    //     0.5, -0.5, 0.0, 1.0, 0.4, 0.4
    // ]);

    // 顶点集合
    const vertices = new Float32Array([
        1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, // v0-v1-v2-v3 front
        1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0, // v0-v3-v4-v5 right
        1.0, 1.0, 1.0, 1.0, 1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, // v0-v5-v6-v1 up
        -1.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, // v1-v6-v7-v2 left
        -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, -1.0, -1.0, 1.0, // v7-v4-v3-v2 down
        1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0 // v4-v7-v6-v5 back
    ]);

    // 顶点颜色
    const colors = new Float32Array([
        1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, // v0-v1-v2-v3 front
        1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, // v0-v3-v4-v5 right
        1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, // v0-v5-v6-v1 up
        1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, // v1-v6-v7-v2 left
        1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, // v7-v4-v3-v2 down
        1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0 // v4-v7-v6-v5 back
    ]);

    // 顶点法向量
    const normals = new Float32Array([
        0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, // v0-v1-v2-v3 front
        1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, // v0-v3-v4-v5 right
        0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, // v0-v5-v6-v1 up
        -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, // v1-v6-v7-v2 left
        0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, // v7-v4-v3-v2 down
        0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0 // v4-v7-v6-v5 back
    ]);

    // 顶点索引
    const indices = new Uint8Array([
        0, 1, 2, 0, 2, 3, // front
        4, 5, 6, 4, 6, 7, // right
        8, 9, 10, 8, 10, 11, // up
        12, 13, 14, 12, 14, 15, // left
        16, 17, 18, 16, 18, 19, // down
        20, 21, 22, 20, 22, 23 // back
    ]);
    // 点的个数
    // const n = vertices.length / 6;
    // 创建缓冲区对象
    const indexBuffer = gl.createBuffer();
    // 将缓冲区对象绑定到目标
    initArrayBuffer(gl, vertices, 3, gl.FLOAT, 'a_Position');
    initArrayBuffer(gl, colors, 3, gl.FLOAT, 'a_color');
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

// 绘制图形
// const draw = (gl, n) => {

//     const u_ModalMatrix = gl.getUniformLocation(gl.program, 'u_ModalMatrix');
//     // 创建变换矩阵，先旋转，再平移 
//     const mat4Rotate = glMatrix.mat4.create();
//     glMatrix.mat4.fromRotation(mat4Rotate, (radius / 180) % 2 * Math.PI, glMatrix.vec3.fromValues(0, 0, 1));

//     // const mat4Translate = glMatrix.mat4.create();
//     // glMatrix.mat4.fromTranslation(mat4Translate, glMatrix.vec3.fromValues(0.3, 0.3, 0));
//     // glMatrix.mat4.multiply(mat4Rotate, mat4Translate, mat4Rotate);
//     // gl.uniformMatrix4fv(u_ZFormMatrix, false, createZMatrix(Math.PI / 4));
//     gl.uniformMatrix4fv(u_ModalMatrix, false, mat4Rotate);
//     gl.clear(gl.COLOR_BUFFER_BIT);
//     gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
//     radius += 1;
//     requestAnimationFrame(() =>{
//         draw(gl, n);
//     });
// };

const draw = (gl, n, u_ProjMatrix, projMatrix, u_ViewModalMatrix, modalMatrix, nf) => {
    // 设置视点和视线（正射投影矩阵）
    projMatrix.setOrtho(-0.5, 0.5, -1.0, 1.0, 0.0, 2.0);

    modalMatrix.setLookAt(0, 0, 5, 0, 0, -100, 0, 1, 0);
    // 将视图矩阵传递给u_ViewMatrix变量
    gl.uniformMatrix4fv(u_ProjMatrix, false, projMatrix.elements);
    gl.uniformMatrix4fv(u_ViewModalMatrix, false, modalMatrix.elements);

    gl.clear(gl.COLOR_BUFFER_BIT);

    // nf.innerHTML = `near: ${g_near}, far: ${g_far}`;
    gl.drawArrays(gl.TRIANGLES, 0, n);
};

// 视点
let g_eyeX = 0.20;
let g_eyeY = 0.25;
let g_eyeZ = 0.25;
const keydown = (ev, gl, n, u_ProjMatrix, projMatrix, u_ViewModalMatrix, modalMatrix, nf) => {
    if (ev.keyCode == 39) { // 按下右键
        g_eyeX += 0.01;
    } else if (ev.keyCode == 37) { // 按下左键
        g_eyeX -= 0.01;
    } else if (ev.keyCode == 38) { // 按下上键
        g_eyeY += 0.01;
    } else if (ev.keyCode == 40) { // 按下下键
        g_eyeY -= 0.01;
    } else {
        return;
    }
    draw(gl, n, u_ProjMatrix, projMatrix, u_ViewModalMatrix, modalMatrix, nf);
};

// 视点与近、远裁剪面的距离
// let g_near = 0.0;
// let g_far = 0.5;
// const keydown = (ev, gl, n, u_ProjMatrix, projMatrix, u_ViewModalMatrix, modalMatrix, nf) => {
//     if (ev.keyCode == 39) {  // 按下右键
//         g_near += 0.01;
//     }
//     else if (ev.keyCode == 37) { // 按下左键
//         g_near -= 0.01;
//     }
//     else if (ev.keyCode == 38) { // 按下上键
//         g_far += 0.01;
//     }
//     else if (ev.keyCode == 40) { // 按下下键
//         g_far -= 0.01;
//     }
//     else {
//         return;
//     }
//     draw(gl, n ,u_ProjMatrix, projMatrix, u_ViewModalMatrix, modalMatrix, nf);
// };

// // 带观察者的
// const main = gl => {
//     const nf = document.querySelector('.near-far');

//     // 设置顶点坐标和颜色（蓝色三角形在最前面）
//     const n = initVertexBuffers(gl);

//     // const u_ViewModalMatrix = gl.getUniformLocation(gl.program, 'u_ViewModalMatrix');

//     // 设置视点
//     const viewMatrix = new Matrix4();

//     document.onkeydown = ev => {
//         keydown(ev, gl, n, u_ViewModalMatrix, viewMatrix);
//     };

//     viewMatrix.setLookAt(0.20, 0.25, 0.25, 0, 0, 0, 0, 1, 0);

//     // 设置旋转矩阵
//     // const modalMatrix = new Matrix4();
//     // modalMatrix.setRotate(45, 0, 0, 1);
//     // const viewModalMatrix = viewMatrix.multiply(modalMatrix);

//     // 设置视图模型矩阵
//     gl.uniformMatrix4fv(u_ViewModalMatrix, false, viewMatrix.elements);

//     // 绘制三角形
//     gl.drawArrays(gl.TRIANGLES, 0, n);
// };

// 带可视空间的
const main = gl => {
    const nf = document.querySelector('.near-far');

    // 设置顶点坐标和颜色（蓝色三角形在最前面）
    const n = initVertexBuffers(gl);

    const u_ModalMatrix = gl.getUniformLocation(gl.program, 'u_ModalMatrix');
    const u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
    const u_ProjMatrix = gl.getUniformLocation(gl.program, 'u_ProjMatrix');
    const u_LightColor = gl.getUniformLocation(gl.program, 'u_LightColor');
    const u_LightDirection = gl.getUniformLocation(gl.program, 'u_LightDirection');
    const u_AmbientLight = gl.getUniformLocation(gl.program, 'u_AmbientLight');


    gl.uniform3f(u_LightColor, 1.0, 1.0, 1.0);
    const lightDirection = new Vector3([0.5, 3.0, 4.0]);
    lightDirection.normalize();
    gl.uniform3fv(u_LightDirection, lightDirection.elements);

    // 设置透视矩阵
    const projMatrix = new Matrix4();
    projMatrix.setPerspective(30.0, 1, 1, 100);
    // document.onkeydown = ev => {
    //     keydown(ev, gl, n, u_ProjMatrix, projMatrix, u_ViewModalMatrix, modalMatrix, nf);
    // };

    // projMatrix.setLookAt(0.20, 0.25, 0.25, 0, 0, 0, 0, 1, 0);
    const viewMatrix = new Matrix4();
    viewMatrix.setLookAt(3, 3, 7, 0, 0, 0, 0, 1, 0);
    const modalMatrix = new Matrix4();
    // modalMatrix.setTranslate(0.75, 0, 0);
    // const viewModalMatrix = viewMatrix.multiply(modalMatrix);

    // // 设置视图模型矩阵
    gl.uniformMatrix4fv(u_ProjMatrix, false, projMatrix.elements);
    gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);
    gl.uniformMatrix4fv(u_ModalMatrix, false, modalMatrix.elements);
    gl.uniform3f(u_AmbientLight, 0.2, 0.2, 0.2);


    // // 绘制三角形
    // gl.drawArrays(gl.TRIANGLES, 0, n);
    // 绘制立方体
    gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
    // draw(gl, n ,u_ProjMatrix, projMatrix, u_ViewModalMatrix, modalMatrix, nf);
};

window.onload = () => {
    const canvas = document.querySelector('#canvas');
    const gl = canvas.getContext('webgl');
    // 设置顶点着色器
    const VSHADER_SOURCE = `
        attribute vec4 a_Position;  // 用于从外部传输变量
        // attribute float a_PointSize;
        attribute vec4 a_color;
        attribute vec4 a_Normal; // 顶点的法向量
        // attribute vec2 a_textCoord;
        uniform mat4 u_ModalMatrix; // 变换矩阵
        uniform mat4 u_ViewMatrix; // 视图矩阵
        // uniform mat4 u_ViewModalMatrix; // 视图模型矩阵,不需要每次都重新计算上面两个矩阵的乘积
        uniform mat4 u_ProjMatrix; // 可视矩阵
        uniform vec3 u_LightColor; // 平行光线颜色
        uniform vec3 u_LightDirection; // 归一化后的光线方向
        uniform vec3 u_AmbientLight; // 环境光颜色
        varying vec4 v_color;
        // varying vec2 v_textCoord;
        void main() { // 不可以指定参数
            // gl_PointSize = a_PointSize;  // 设置点的尺寸，内置的变量，当绘制单点时有用，绘制图形时没用
            gl_Position = u_ProjMatrix * u_ViewMatrix * u_ModalMatrix * a_Position;
            // 对顶点法向量进行归一化
            vec3 normal = normalize(vec3(a_Normal));
            // 计算光线方向和法向量的点积
            float nDotL = max(dot(normal, u_LightDirection), 0.0);
            // 计算漫反射光的颜色
            vec3 diffuse = u_LightColor * vec3(a_color) * nDotL;
            // 计算环境光产生的反射光颜色
            vec3 ambient = u_AmbientLight * a_color.rgb;
            v_color = vec4(diffuse + ambient, a_color.a);
            // v_textCoord = a_textCoord;
        }
    `;
    // 片段着色器
    const FSHADER_SOURCE = `
        precision mediump float;
        varying vec4 v_color;
        // varying vec2 v_textCoord;
        // uniform sampler2D u_sampler;
        // uniform float u_width;
        // uniform float u_height;
        void main() {
            // gl_FragColor = vec4(gl_FragCoord.x / 800.0, 0.0, gl_FragCoord.y / 800.0, 1.0); // 设置颜色,内置的变量
            // gl_FragColor = texture2D(u_sampler, v_textCoord);
            gl_FragColor = v_color;
        }
    `;
    // 初始化着色器
    initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE);
    // 获取attribute变量的存储位置
    // const a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    // const u_color = gl.getUniformLocation(gl.program, 'u_color');

    // 将顶点位置传输给attitude变量
    // gl.vertexAttrib4f(a_Position, 0.5, -0.5, 0.0, 1.0);
    // gl.vertexAttrib1f(a_PointSize, 10.0);
    // 设置清空的颜色值
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.POLYGON_OFFSET_FILL);
    gl.polygonOffset(1.0, 1.0);
    gl.clearColor(0.5, 0.5, 0.5, 1.0);
    // 清空指定的缓冲区，颜色缓冲区的内容会自动渲染在浏览器上
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    main(gl);
    // const n = initVertexBuffers(gl);
    // initTextures(gl, n);
    // gl.drawArrays(gl.TRIANGLES, 0, n);

    // const n = initVertexBuffers(gl);
    // gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
    // gl.clear(gl.COLOR_BUFFER_BIT);
    // const n = initVertexBuffers(gl);

    // draw(gl, n);
};