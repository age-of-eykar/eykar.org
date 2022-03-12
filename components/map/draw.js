import { ChunksCache } from "./calc/cache";
import fragmentShader from '../../shaders/fragment.glsl'
import vertexShader from '../../shaders/vertex.glsl'
import { buildShaderProgram } from "./shadertools";

function animateScene(gl, glCanvas, shaderProgram, currentScale, size) {
    gl.viewport(0, 0, glCanvas.width, glCanvas.height);
    gl.clearColor(0.8, 0.9, 1.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(shaderProgram);

    const scale = gl.getUniformLocation(shaderProgram, "scale");
    gl.uniform2fv(scale, currentScale);

    const fillColor = gl.getUniformLocation(shaderProgram, "fillColor");
    gl.uniform4fv(fillColor, [0.1, 0.7, 0.8, 1.0]);

    const position = gl.getAttribLocation(shaderProgram, "position");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2,
        gl.FLOAT, false, 0, 0);

    gl.drawArrays(gl.TRIANGLES, 0, 6);
    gl.uniform4fv(fillColor, [0.9, 0.7, 0.8, 1.0]);
    gl.drawArrays(gl.TRIANGLES, 6, 3);
    window.requestAnimationFrame(function (currentTime) {
        animateScene(gl, glCanvas, shaderProgram, currentScale, size);
    });
}

export const startDrawing = (canvas, windowSize, cache, center, scale) => {

    // canvas fixes
    canvas.width = windowSize.width;
    canvas.height = windowSize.height;
    canvas.focus();
    const gl = canvas.getContext("webgl2");

    const shaderSet = [
        {
            type: gl.VERTEX_SHADER,
            src: vertexShader
        },
        {
            type: gl.FRAGMENT_SHADER,
            src: fragmentShader
        }
    ];

    const shaderProgram = buildShaderProgram(gl, shaderSet);
    const aspectRatio = canvas.width / canvas.height;
    const currentScale = [1.0, aspectRatio];

    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    const vertexArray = new Float32Array([
        -0.5, 0.5, 0, 0.5, 0.0, 0,
        -0.5, 0.5, 0, 0, -0.5, 0,
        -0.25, 0.25, 0.25, 0.25, 0, -0.25,
    ]);
    gl.bufferData(gl.ARRAY_BUFFER, vertexArray, gl.DYNAMIC_DRAW);
    animateScene(gl, canvas, shaderProgram, currentScale, 6);
}