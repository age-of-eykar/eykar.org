import { ChunksCache } from "./calc/cache";
import fragmentShader from '../../shaders/fragment.glsl'
import vertexShader from '../../shaders/vertex.glsl'
import { createProgramInfo, setUniforms, setBuffersAndAttributes, drawBufferInfo } from "twgl.js";

function animateScene(gl, cache, center, scale, keyControlers, canvas, programInfo) {
    let previousTime = performance.now();
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.useProgram(programInfo.program);

    setUniforms(programInfo, {
        scale: scale.current / 2,
        ratio: [1.0, (canvas.width / canvas.height)],
        center: [center.current.x,
        center.current.y],
    });

    cache.forEachChunk(center.current, scale.current, (chunk) => {
        if (!chunk.ready)
            return;
        setBuffersAndAttributes(gl, programInfo, chunk.bufferInfo);
        drawBufferInfo(gl, chunk.bufferInfo);
    }, canvas.height / canvas.width)

    window.requestAnimationFrame(function (currentTime) {
        const deltaTime = currentTime - previousTime;
        const speed = keyControlers.getSpeed();
        center.current.x += speed.x * deltaTime / 1000;
        center.current.y += speed.y * deltaTime / 1000;
        animateScene(gl, cache, center, scale, keyControlers, canvas, programInfo);
    });
}

export const startDrawing = (canvas, windowSize, center, scale, keyControlers) => {
    // canvas fixes
    canvas.width = windowSize.width;
    canvas.height = windowSize.height;
    canvas.focus();
    const gl = canvas.getContext("webgl2");
    const programInfo = createProgramInfo(gl, [vertexShader, fragmentShader]);
    const cache = new ChunksCache(256, gl);
    animateScene(gl, cache, center, scale, keyControlers, canvas, programInfo);
    return cache;
}