#version 300 es

uniform float scale;
uniform float ratio;
uniform vec2 center;
in vec3 fillColor;
in vec2 position;

out vec3 color;

void main() {
  color = fillColor;
  vec2 point = (position - center) * scale;
  point.y *= ratio;
  float w = 0.25 * point.y + 1.0; // slope = 0.25
  gl_Position = vec4(point.x, point.y, 0.0, w);
}