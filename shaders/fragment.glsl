  #ifdef GL_ES
precision highp float;
  #endif

uniform vec4 uGlobalColor;

void main() {
    gl_FragColor = uGlobalColor;
}