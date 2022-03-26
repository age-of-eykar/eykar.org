import { ChunksCache } from "./calc/cache";
import fragmentShader from '../../shaders/fragment.glsl'
import vertexShader from '../../shaders/vertex.glsl'
import { createProgramInfo, setUniforms, setBuffersAndAttributes, drawBufferInfo, m4 } from "twgl.js";

function animateScene(gl, cache, center, scale, keyControlers, canvas, programInfo) {
    let previousTime = performance.now();
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.useProgram(programInfo.program);

    const fPosition = [center.x, center.y, 0];
    const cameraAngleRadians = 3.14/4;
    const cameraMatrix = m4.rotationZ(cameraAngleRadians);
    cameraMatrix = m4.translate(cameraMatrix, center.x, center,y, radius * 1.5);
    console.log(cameraMatrix)
  

    setUniforms(programInfo, {
        matrix: matrix,
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