import { ChunksCache } from "./calc/cache";
import fragmentShader from '../../shaders/fragment.glsl'
import vertexShader from '../../shaders/vertex.glsl'
import { createProgramInfo, setUniforms, setBuffersAndAttributes, drawBufferInfo } from "twgl.js";

let frameRequest;

function animateScene(gl, cache, center, scale, keyControlers, canvas, programInfo) {
    let previousTime = performance.now();
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.useProgram(programInfo.program);
    setUniforms(programInfo, {
        scale: 2 / scale.current,
        ratio: canvas.width / canvas.height,
        center: [center.current.x,
        center.current.y],
    });

    cache.forEachChunk(center.current, scale.current, (chunk) => {
        if (!chunk.ready)
            return;
        setBuffersAndAttributes(gl, programInfo, chunk.bufferInfo);
        drawBufferInfo(gl, chunk.bufferInfo);
    }, canvas.height / canvas.width)

    frameRequest = window.requestAnimationFrame(function (currentTime) {
        const deltaTime = currentTime - previousTime;
        const speed = keyControlers.getSpeed();
        center.current.x += speed.x * deltaTime / 1000;
        center.current.y += speed.y * deltaTime / 1000;
        animateScene(gl, cache, center, scale, keyControlers, canvas, programInfo);
    });
}

export const startDrawing = (canvas, center, scale, keyControlers) => {
    // canvas fixes
    canvas.focus();
    const gl = canvas.getContext("webgl2");
    const programInfo = createProgramInfo(gl, [vertexShader, fragmentShader]);
    const cache = new ChunksCache(256, gl);
    animateScene(gl, cache, center, scale, keyControlers, canvas, programInfo);
    return cache;
}

export const stopDrawing = () => {
    window.cancelAnimationFrame(frameRequest);
}