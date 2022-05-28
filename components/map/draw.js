import { ChunksCache } from "../../utils/map/cache";
import fragmentShader from '../../shaders/background/fragment.glsl'
import vertexShader from '../../shaders/background/vertex.glsl'
import { createProgramInfo, setUniforms, setBuffersAndAttributes, drawBufferInfo } from "twgl.js";
import svgLoader from "svg-webgl-loader-opti";
import vectorFragmentShader from '../../shaders/vectors/fragment.glsl'
import vectorVertexShader from '../../shaders/vectors/vertex.glsl'

let frameRequest;
let assets = {};

function animateScene(gl, cache, center, scale, selector, keyControlers, canvas, programInfo) {
    let previousTime = performance.now();
    gl.viewport(0, 0, canvas.width, canvas.height);

    cache.forEachChunk(center.current, scale.current, (chunk) => {
        gl.useProgram(programInfo.program);
        setUniforms(programInfo, {
            scale: 2 / scale.current,
            ratio: canvas.width / canvas.height,
            center: [center.current.x,
            center.current.y],
        });

        if (!chunk.ready)
            return;
        if (selector.selected && chunk.x == selector.selected[2] && chunk.y == selector.selected[3])
            setUniforms(programInfo, {
                selectedStart: selector.selected[0],
                selectedEnd: selector.selected[1],
                selectedColor: selector.selectedColor,
            });
        else
            setUniforms(programInfo, {
                selectedStart: 0,
                selectedEnd: 0
            });
        setBuffersAndAttributes(gl, programInfo, chunk.bufferInfo);
        drawBufferInfo(gl, chunk.bufferInfo);
        for (const [x, y, variant] of chunk.assets)
            if (assets[variant.sprite]) {
                assets[variant.sprite].draw({
                    uniforms: {
                        scale: 2 / scale.current,
                        zoom: variant.zoom,
                        location: [x, y],
                        center: [center.current.x,
                        center.current.y],
                        ratio: canvas.width / canvas.height,
                    },
                    needFill: true,
                    needStroke: true,
                });
            }
    }, canvas.height / canvas.width)

    frameRequest = window.requestAnimationFrame(function (currentTime) {
        const deltaTime = currentTime - previousTime;
        const speed = keyControlers.getSpeed();
        center.current.x += speed.x * deltaTime / 1000;
        center.current.y += speed.y * deltaTime / 1000;
        animateScene(gl, cache, center, scale, selector, keyControlers, canvas, programInfo);
    });
}

export const startDrawing = (canvas, center, scale, selector, keyControlers) => {
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

    (async () => {
        await loadAssets(gl)
    })();


    const programInfo = createProgramInfo(gl, [vertexShader, fragmentShader]);
    const cache = new ChunksCache(256, gl);
    animateScene(gl, cache, center, scale, selector, keyControlers, canvas, programInfo);
    return cache;
}

async function loadAssets(gl) {
    const conf = {
        gl,
        shaders: {
            vertex: vectorVertexShader,
            fragment: vectorFragmentShader,
        },
        needTrim: false,
    };

    assets.small_mountain = await svgLoader("/textures/mountains/small.svg");
    assets.small_mountain.load(conf);

    assets.flat_mountain = await svgLoader("/textures/mountains/flat.svg");
    assets.flat_mountain.load(conf);

    assets.medium_mountain = await svgLoader("/textures/mountains/medium.svg");
    assets.medium_mountain.load(conf);

    assets.big_mountain = await svgLoader("/textures/mountains/big.svg");
    assets.big_mountain.load(conf);

    assets.huge_mountain = await svgLoader("/textures/mountains/huge.svg");
    assets.huge_mountain.load(conf);

    assets.peak_mountain = await svgLoader("/textures/mountains/peak.svg");
    assets.peak_mountain.load(conf);

    assets.twins_mountain = await svgLoader("/textures/mountains/twins.svg");
    assets.twins_mountain.load(conf);

    assets.arch_mountain = await svgLoader("/textures/mountains/arch.svg");
    assets.arch_mountain.load(conf);

    assets.sharp_mountain = await svgLoader("/textures/mountains/sharp.svg");
    assets.sharp_mountain.load(conf);

    assets.magic_mountain = await svgLoader("/textures/mountains/magic.svg");
    assets.magic_mountain.load(conf);
}

export const stopDrawing = () => {
    window.cancelAnimationFrame(frameRequest);
}