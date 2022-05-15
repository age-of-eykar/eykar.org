#version 300 es

uniform vec4 shapeColor;
// vector position
uniform vec2 location;
uniform float scale;

// vertex position
in vec2 position;
out vec4 color;

void main() {
  gl_Position = vec4(position.x + location.x, position.y + location.y, 0.0, scale);
  color = shapeColor;
}