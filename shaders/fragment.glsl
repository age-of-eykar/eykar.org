  #ifdef GL_ES
precision highp float;
  #endif

uniform vec4 fillColor;

void main() {
    gl_FragColor = fillColor;
}