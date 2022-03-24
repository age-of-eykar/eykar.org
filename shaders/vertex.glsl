#version 300 es

#define PI 3.1415926538

uniform float scale;
uniform vec2 ratio;
uniform vec2 center;
in vec3 fillColor;
in vec2 position;

out vec3 color;

void main() {
  color = fillColor;
  gl_Position = vec4((position - center) * ratio, 0.0, scale);
}