#version 300 es

in vec3 fillColor;
in vec2 position;
uniform mat4 matrix;

out vec3 color;

void main() {
  color = fillColor;
  gl_Position = matrix*vec4(position, 0.0, 1.0);
}