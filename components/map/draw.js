import { ChunksCache } from "./calc/cache";
import fragmentShader from '../../shaders/fragment.glsl'
import vertexShader from '../../shaders/vertex.glsl'
import { buildShaderProgram } from "./shadertools";


// gl, cache, center, scale, stops, colors, glCanvas, shaderProgram
function animateScene(gl, cache, center, scale, keyControlers, canvas, shaderProgram) {
    let previousTime = performance.now();
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.useProgram(shaderProgram);

    const shaderScale = gl.getUniformLocation(shaderProgram, "scale");
    gl.uniform1f(shaderScale, scale.current / 2);

    const ratio = gl.getUniformLocation(shaderProgram, "ratio");
    gl.uniform2fv(ratio, [1.0, (canvas.width / canvas.height)]);

    const vecCenter = gl.getUniformLocation(shaderProgram, "center");
    gl.uniform2fv(vecCenter, [center.current.x,
    center.current.y]);

    cache.forEachChunk(center.current, scale.current, (chunk) => {
        gl.bindBuffer(gl.ARRAY_BUFFER, chunk.colorBuffer);
        const fillColor = gl.getAttribLocation(shaderProgram, "fillColor");
        gl.enableVertexAttribArray(fillColor);
        gl.vertexAttribPointer(fillColor, 3,
            gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, chunk.vertexBuffer);
        const position = gl.getAttribLocation(shaderProgram, "position");
        gl.enableVertexAttribArray(position);
        gl.vertexAttribPointer(position, 2,
            gl.FLOAT, false, 0, 0);

        if (chunk.vertexes)
            gl.drawArrays(gl.TRIANGLES, 0, chunk.vertexes.length / 2);
    }, canvas.height / canvas.width)

    window.requestAnimationFrame(function (currentTime) {
        const deltaTime = currentTime - previousTime;
        const speed = keyControlers.getSpeed();
        center.current.x += speed.x * deltaTime / 1000;
        center.current.y += speed.y * deltaTime / 1000;
        animateScene(gl, cache, center, scale, keyControlers, canvas, shaderProgram);
    });
}

export const startDrawing = (canvas, windowSize, center, scale, keyControlers) => {

    // canvas fixes
    canvas.width = windowSize.width;
    canvas.height = windowSize.height;
    canvas.focus();
    const gl = canvas.getContext("webgl2");
    const cache = new ChunksCache(256, gl);
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
    animateScene(gl, cache, center, scale, keyControlers, canvas, shaderProgram);
    return cache;
}