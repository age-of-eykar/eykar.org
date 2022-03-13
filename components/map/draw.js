import { ChunksCache } from "./calc/cache";
import fragmentShader from '../../shaders/fragment.glsl'
import vertexShader from '../../shaders/vertex.glsl'
import { buildShaderProgram } from "./shadertools";


// gl, cache, center, scale, stops, colors, glCanvas, shaderProgram
function animateScene(gl, cache, center, scale, stops, colors, canvas, shaderProgram) {

    if (!cache.refreshed) {
        const data = cache.exportData(center.current, scale.current);
        gl.bufferData(gl.ARRAY_BUFFER, data.points, gl.DYNAMIC_DRAW);
        stops = data.stops;
        colors = data.colors;
    }

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.8, 0.9, 1.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(shaderProgram);

    let lastStop = 0;
    for (const i = 0; i < stops.length; i++) {
        const stop = stops[i];
        const color = colors[i];

        const scale2 = gl.getUniformLocation(shaderProgram, "scale");
        gl.uniform2fv(scale2, [1.0, canvas.width / canvas.height]);

        const fillColor = gl.getUniformLocation(shaderProgram, "fillColor");
        gl.uniform4fv(fillColor, [Math.random(), Math.random(), Math.random(), 1.0]);

        const position = gl.getAttribLocation(shaderProgram, "position");
        gl.enableVertexAttribArray(position);
        gl.vertexAttribPointer(position, 2,
            gl.FLOAT, false, 0, 0);

        gl.drawArrays(gl.TRIANGLES, lastStop / 2, (stop - lastStop) / 2);
        lastStop = stop;
    }
    window.requestAnimationFrame(function (currentTime) {
        animateScene(gl, cache, center, scale, stops, colors, canvas, shaderProgram);
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

    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    const data = cache.exportData(center.current, scale.current);
    gl.bufferData(gl.ARRAY_BUFFER, data.points, gl.DYNAMIC_DRAW);

    animateScene(gl, cache, center, scale, data.stops, data.colors, canvas, shaderProgram);
}