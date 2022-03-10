import { ChunksCache } from "./calc/cache";
// import { fragment } from '../../shaders/fragment.glsl'
// import { vertex } from '../../shaders/vertex.glsl'

var vertexShaderSource = [
`attribute vec2 aVertexPosition;`,

`uniform vec2 uScalingFactor;`,
`uniform vec2 uRotationVector;`,

`void main() {`,
`  vec2 rotatedPosition = vec2(aVertexPosition.x * uRotationVector.y +`,
`    aVertexPosition.y * uRotationVector.x, aVertexPosition.y * uRotationVector.y -`,
`    aVertexPosition.x * uRotationVector.x);`,
``,
`  gl_Position = vec4(rotatedPosition * uScalingFactor, 0.0, 1.0);`,
`}`,
].join("\n");

var fragmentShaderSource = [
`  #ifdef GL_ES`,
`precision highp float;`,
`  #endif`,
``,
`uniform vec4 uGlobalColor;`,
``,
`void main() {`,
`  gl_FragColor = uGlobalColor;`,
`}`,
].join("\n");

function compileShader(gl, id, type) {
    console.log(id)
    let code = id == "vertex-shader" ? vertexShaderSource : fragmentShaderSource;
    let shader = gl.createShader(type);

    gl.shaderSource(shader, code);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.log(`Error compiling ${type === gl.VERTEX_SHADER ? "vertex" : "fragment"} shader:`);
        console.log(gl.getShaderInfoLog(shader));
    }
    return shader;
}

function buildShaderProgram(gl, shaderInfo) {
    let program = gl.createProgram();

    shaderInfo.forEach(function (desc) {
        let shader = compileShader(gl, desc.id, desc.type);

        if (shader) {
            gl.attachShader(program, shader);
        }
    });

    gl.linkProgram(program)

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.log("Error linking shader program:");
        console.log(gl.getProgramInfoLog(program));
    }

    return program;
}

function animateScene(gl, glCanvas, currentAngle, currentRotation, shaderProgram, currentScale, vertexBuffer, vertexNumComponents, vertexCount) {
    console.log("animateScene", gl)
    gl.viewport(0, 0, glCanvas.width, glCanvas.height);
    gl.clearColor(0.8, 0.9, 1.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    let radians = currentAngle * Math.PI / 180.0;
    currentRotation[0] = Math.sin(radians);
    currentRotation[1] = Math.cos(radians);

    gl.useProgram(shaderProgram);

    const uScalingFactor =
        gl.getUniformLocation(shaderProgram, "uScalingFactor");
    const uGlobalColor =
        gl.getUniformLocation(shaderProgram, "uGlobalColor");
    const uRotationVector =
        gl.getUniformLocation(shaderProgram, "uRotationVector");

    gl.uniform2fv(uScalingFactor, currentScale);
    gl.uniform2fv(uRotationVector, currentRotation);
    gl.uniform4fv(uGlobalColor, [0.1, 0.7, 0.2, 1.0]);

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    const aVertexPosition =
        gl.getAttribLocation(shaderProgram, "aVertexPosition");

    gl.enableVertexAttribArray(aVertexPosition);
    gl.vertexAttribPointer(aVertexPosition, vertexNumComponents,
        gl.FLOAT, false, 0, 0);

    gl.drawArrays(gl.TRIANGLES, 0, vertexCount);

    let previousTime = performance.now();
    window.requestAnimationFrame(function (currentTime) {
        let deltaAngle = ((currentTime - previousTime) / 1000.0)
            * Math.cos(Math.random() * 1000.0) * 300.0;

        currentAngle = (currentAngle + deltaAngle) % 360;

        previousTime = currentTime;
        animateScene(gl, glCanvas, currentAngle, currentRotation, shaderProgram, currentScale, vertexBuffer, vertexNumComponents, vertexCount);
    });
}

export const redraw = (canvas, cache, center, scale, windowSize) => {


    // canvas fixes
    canvas.width = windowSize.width;
    canvas.height = windowSize.height;
    canvas.focus();
    const gl = canvas.getContext("webgl");

    const shaderSet = [
        {
            type: gl.VERTEX_SHADER,
            id: "vertex-shader"
        },
        {
            type: gl.FRAGMENT_SHADER,
            id: "fragment-shader"
        }
    ];

    const shaderProgram = buildShaderProgram(gl, shaderSet);

    const aspectRatio = canvas.width / canvas.height;
    const currentRotation = [0, 1];
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

    const currentAngle = 0.0;
    console.log("HERE", gl)
    animateScene(gl, canvas, currentAngle, currentRotation, shaderProgram, currentScale, vertexBuffer, vertexNumComponents, vertexCount);

    return true;
}