import { ChunksCache } from "./calc/cache";
import fragmentShader from '../../shaders/fragment.glsl'
import vertexShader from '../../shaders/vertex.glsl'
import { buildShaderProgram } from "./shadertools";

function animateScene(gl, glCanvas, shaderProgram, currentScale, vertexBuffer, vertexNumComponents, vertexCount) {
    gl.viewport(0, 0, glCanvas.width, glCanvas.height);
    gl.clearColor(0.8, 0.9, 1.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(shaderProgram);

    const uScalingFactor =
        gl.getUniformLocation(shaderProgram, "uScalingFactor");
    const uGlobalColor =
        gl.getUniformLocation(shaderProgram, "uGlobalColor");

    gl.uniform2fv(uScalingFactor, currentScale);
    gl.uniform4fv(uGlobalColor, [0.1, 0.7, 0.8, 1.0]);

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    const aVertexPosition =
        gl.getAttribLocation(shaderProgram, "aVertexPosition");

    gl.enableVertexAttribArray(aVertexPosition);
    gl.vertexAttribPointer(aVertexPosition, vertexNumComponents,
        gl.FLOAT, false, 0, 0);

    gl.drawArrays(gl.TRIANGLES, 0, vertexCount);

    let previousTime = performance.now();
    window.requestAnimationFrame(function (currentTime) {
        previousTime = currentTime;
        animateScene(gl, glCanvas, shaderProgram, currentScale, vertexBuffer, vertexNumComponents, vertexCount);
    });
}

export const startDrawing = (canvas, windowSize, cache, center, scale) => {

    // canvas fixes
    canvas.width = windowSize.width;
    canvas.height = windowSize.height;
    canvas.focus();
    const gl = canvas.getContext("webgl");

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

    const vertexArray = new Float32Array([
        -0.5, 0.5, 0.5, 0.5, 0.5, -0.5,
        -0.5, 0.5, 0.5, -0.5, -0.5, -0.5
    ]);

    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertexArray, gl.STATIC_DRAW);

    const vertexNumComponents = 2;
    const vertexCount = vertexArray.length / vertexNumComponents;
    animateScene(gl, canvas, shaderProgram, currentScale, vertexBuffer, vertexNumComponents, vertexCount);

    return true;
}