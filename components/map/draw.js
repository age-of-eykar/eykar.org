import { ChunksCache } from "../../utils/map/cache";
import fragmentShader from '../../shaders/fragment.glsl'
import vertexShader from '../../shaders/vertex.glsl'
import { createProgramInfo, setUniforms, setBuffersAndAttributes, drawBufferInfo } from "twgl.js";
import { MOUNTAINS_ASSET } from "../../utils/map/assets";

let frameRequest;

function animateScene(gl, cache, center, scale, selected, keyControlers, canvas, programInfo) {
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
        if (chunk.x == selected.current[2] && chunk.y == selected.current[3])
            setUniforms(programInfo, {
                selectedStart: selected.current[0],
                selectedEnd: selected.current[1]
            });
        else
            setUniforms(programInfo, {
                selectedStart: Number.MAX_SAFE_INTEGER,
                selectedEnd: Number.MAX_SAFE_INTEGER
            });
        setBuffersAndAttributes(gl, programInfo, chunk.bufferInfo);
        drawBufferInfo(gl, chunk.bufferInfo);
        if (cache.assets_loaded)
            MOUNTAINS_ASSET.apply(chunk.getTopLeft(), ChunksCache.sideSize, canvas)
    }, canvas.height / canvas.width)

    frameRequest = window.requestAnimationFrame(function (currentTime) {
        const deltaTime = currentTime - previousTime;
        const speed = keyControlers.getSpeed();
        center.current.x += speed.x * deltaTime / 1000;
        center.current.y += speed.y * deltaTime / 1000;
        animateScene(gl, cache, center, scale, selected, keyControlers, canvas, programInfo);
    });
}

export const startDrawing = (canvas, center, scale, selected, keyControlers) => {
    // canvas fixes
    canvas.focus();
    const gl = canvas.getContext("webgl2");
    const programInfo = createProgramInfo(gl, [vertexShader, fragmentShader]);
    const cache = new ChunksCache(256, gl);
    animateScene(gl, cache, center, scale, selected, keyControlers, canvas, programInfo);
    return cache;
}

export const stopDrawing = () => {
    window.cancelAnimationFrame(frameRequest);
}