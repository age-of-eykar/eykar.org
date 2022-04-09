#version 300 es

uniform float scale;
uniform vec2 ratio;
uniform vec2 center;
in vec3 fillColor;
in vec2 position;

out vec3 color;

void main() {
  vec2 pos = (position - center) * ratio;
  color = fillColor;
  float bottomScale = 1.25;
  float w = (pos.y / scale + 1.0) / 2.0 * (bottomScale - 1.0) + 1.0;
  gl_Position = vec4(
          (bottomScale * pos.x / scale),
          (pos.y / scale),
          0.0,
          w);
}