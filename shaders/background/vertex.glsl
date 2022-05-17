#version 300 es

uniform float scale;
uniform float ratio;
uniform vec2 center;
//range
uniform int selectedStart;
uniform int selectedEnd;

in vec3 fillColor;
in vec2 position;

out vec3 color;

bool isInRange(int rangeStart, int rangeEnd, int value) {
  return value >= rangeStart && value < rangeEnd;
}

void main() {
  color = isInRange(selectedStart, selectedEnd, gl_VertexID) ? fillColor + vec3(0.15, 0.15, 0.15) : fillColor;
  vec2 point = (position - center) * scale;
  point.y *= ratio;
  float w = 0.25 * point.y + 1.0; // slope = 0.25
  gl_Position = vec4(point.x, point.y, 0.0, w);
}