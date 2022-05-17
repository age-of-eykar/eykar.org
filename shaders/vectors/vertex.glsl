#version 300 es

uniform vec4 shapeColor;
// vector position
uniform vec2 location;
uniform float scale;
uniform float ratio;
uniform vec2 center;
uniform float zoom;

// vertex position
in vec2 position;
out vec4 color;

void main() {
  color = vec4(107.0/255.0, 87.0/255.0, 57.0/255.0, 1.0);
  vec2 point = (position*zoom + location - center) * scale;
  point.y *= ratio;
  float w = 0.25 * point.y + 1.0; // slope = 0.25
  
  gl_Position = vec4(point.x, point.y, 0.0, w);

}
