attribute vec2 position;
uniform vec2 scale;

void main() {
  gl_Position = vec4(position * scale, 0.0, 1.0);
}