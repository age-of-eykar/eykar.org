import { ChunksCache } from "./calc/cache";
import fragmentShader from '../../shaders/fragment.glsl'
import vertexShader from '../../shaders/vertex.glsl'
import { buildShaderProgram } from "./shadertools";


// gl, cache, center, scale, stops, colors, glCanvas, shaderProgram
function animateScene(gl, cache, center, scale, stops, canvas, shaderProgram,
    vertexBuffer, colorBuffer) {

    if (!cache.refreshed) {
        const data = cache.exportData(center.current, scale.current);
        stops = data.stops;

        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, data.points, gl.DYNAMIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, data.colors, gl.DYNAMIC_DRAW)
    }

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.8, 0.9, 1.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(shaderProgram);

    const shaderScale = gl.getUniformLocation(shaderProgram, "scale");
    gl.uniform2fv(shaderScale, [2 * ChunksCache.sideSize / scale.current.width,
    2 * (canvas.width / canvas.height) * ChunksCache.sideSize / scale.current.height]);
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    const fillColor = gl.getAttribLocation(shaderProgram, "fillColor");
    gl.enableVertexAttribArray(fillColor);
    gl.vertexAttribPointer(fillColor, 3,
        gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    const position = gl.getAttribLocation(shaderProgram, "position");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2,
        gl.FLOAT, false, 0, 0);

    if (stops.length !== 0)
        gl.drawArrays(gl.TRIANGLES, 0, stops[stops.length - 1]);

    window.requestAnimationFrame(function (currentTime) {
        animateScene(gl, cache, center, scale, stops, canvas, shaderProgram,
            vertexBuffer, colorBuffer);
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
    const data = cache.exportData(center.current, scale.current);

    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, data.points, gl.DYNAMIC_DRAW);

    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, data.colors, gl.DYNAMIC_DRAW);

    animateScene(gl, cache, center, scale, data.stops, canvas, shaderProgram,
        vertexBuffer, colorBuffer);
}