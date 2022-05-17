import { ChunksCache } from "../../utils/map/cache";
import fragmentShader from '../../shaders/background/fragment.glsl'
import vertexShader from '../../shaders/background/vertex.glsl'
import { createProgramInfo, setUniforms, setBuffersAndAttributes, drawBufferInfo } from "twgl.js";
import svgLoader from "svg-webgl-loader-opti";
import vectorFragmentShader from '../../shaders/vectors/fragment.glsl'
import vectorVertexShader from '../../shaders/vectors/vertex.glsl'

let frameRequest;
let loader;

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
                selectedStart: 0,
                selectedEnd: 0
            });
        setBuffersAndAttributes(gl, programInfo, chunk.bufferInfo);
        drawBufferInfo(gl, chunk.bufferInfo);
    }, canvas.height / canvas.width)

    if (loader)
        loader.draw({
            uniforms: {
                scale: 2 / scale.current,
                zoom: 3.0,
                location: [4.0, 3.0],
                center: [center.current.x,
                center.current.y],
                ratio: canvas.width / canvas.height,
            },
            needFill: true,
            needStroke: true,
        });


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
    const gl = canvas.getContext('webgl2', {
        alpha: true,
        depth: false,
        stencil: true,
        antialias: true,
        preserveDrawingBuffer: false,
        powerPreference: 'default',
    });

    loader = false;
    (async () => {
        loader = await svgLoader("/textures/mountains/medium.svg");
        loader.load({
            gl,
            shaders: {
                vertex: vectorVertexShader,
                fragment: vectorFragmentShader,
            },
            loc: {
                width: 400,
                height: 400,
            },
            needTrim: false,
        });
    })();
    const programInfo = createProgramInfo(gl, [vertexShader, fragmentShader]);
    const cache = new ChunksCache(256, gl);
    animateScene(gl, cache, center, scale, selected, keyControlers, canvas, programInfo);
    return cache;
}

export const stopDrawing = () => {
    window.cancelAnimationFrame(frameRequest);
}