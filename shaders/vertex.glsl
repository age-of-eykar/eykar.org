#version 300 es

uniform vec2 scale;
in vec3 fillColor;
in vec2 position;

out vec3 color;

void main() {
  color = fillColor;
  gl_Position = vec4(position * scale, 0.0, 1.0);
}