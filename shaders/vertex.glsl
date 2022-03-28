#version 300 es

uniform float scale;
uniform vec2 ratio;
uniform vec2 center;
in vec3 fillColor;
in vec2 position;

out vec3 color;

void main() {
  color = fillColor;
  vec2 pos = (position - center) * ratio;
  float bottomScale = 1.25;
  gl_Position = vec4(bottomScale * pos.x / scale, pos.y / scale, 0.0, (pos.y / scale + 1.0) / 2.0 * (bottomScale - 1.0) + 1.0);
}