import type { Palette, Pointer, Variant } from "./runtime";

/**
 * A slow mesh gradient in a WebGL fragment shader: domain-warped noise mixes
 * the page colour with a lifted neutral and a low-strength accent, and the
 * pointer gently pulls the flow toward itself. Kept low-contrast so it reads
 * as light moving across the page, not as a colour field.
 */
const VERT = `
attribute vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`;

const FRAG = `
precision mediump float;
uniform vec2 u_res;
uniform float u_time;
uniform vec3 u_bg;
uniform vec3 u_lift;
uniform vec3 u_accent;
uniform vec3 u_pointer; // xy in px (y down), z = presence
uniform float u_strength;

vec2 hash(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
}
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(dot(hash(i), f), dot(hash(i + vec2(1, 0)), f - vec2(1, 0)), u.x),
             mix(dot(hash(i + vec2(0, 1)), f - vec2(0, 1)), dot(hash(i + vec2(1, 1)), f - vec2(1, 1)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++) { v += a * noise(p); p *= 2.0; a *= 0.5; }
  return v;
}

void main() {
  vec2 frag = vec2(gl_FragCoord.x, u_res.y - gl_FragCoord.y);
  vec2 uv = frag / u_res.y;
  float t = u_time * 0.00006;

  // Pointer pulls the field toward itself.
  vec2 pp = u_pointer.xy / u_res.y;
  vec2 toP = pp - uv;
  float pull = exp(-dot(toP, toP) * 6.0) * u_pointer.z;
  uv += toP * pull * 0.25;

  vec2 q = vec2(fbm(uv * 1.4 + t), fbm(uv * 1.4 - t + 5.2));
  vec2 r = vec2(fbm(uv * 1.6 + q * 1.8 + vec2(1.7, 9.2) + t * 1.3),
                fbm(uv * 1.6 + q * 1.8 + vec2(8.3, 2.8) - t));
  float f = fbm(uv * 1.2 + r * 1.5);

  vec3 col = u_bg;
  col = mix(col, u_lift, smoothstep(-0.25, 0.55, f) * 0.85);
  col = mix(col, u_accent, smoothstep(0.05, 0.7, r.x * f + 0.25) * u_strength);
  col = mix(col, u_accent, pull * 0.18);

  // Fine grain so the gradient never bands.
  float grain = fract(sin(dot(frag, vec2(12.9898, 78.233))) * 43758.5453);
  col += (grain - 0.5) / 255.0 * 2.0;

  gl_FragColor = vec4(col, 1.0);
}
`;

export function createGradient(canvas: HTMLCanvasElement): Variant | null {
  const gl = canvas.getContext("webgl", { antialias: false, premultipliedAlpha: false });
  if (!gl) return null;

  const compile = (type: number, src: string) => {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return s;
  };
  const program = gl.createProgram()!;
  gl.attachShader(program, compile(gl.VERTEX_SHADER, VERT));
  gl.attachShader(program, compile(gl.FRAGMENT_SHADER, FRAG));
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null;
  gl.useProgram(program);

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(program, "a_pos");
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  const u = (name: string) => gl.getUniformLocation(program, name);
  const uRes = u("u_res");
  const uTime = u("u_time");
  const uBg = u("u_bg");
  const uLift = u("u_lift");
  const uAccent = u("u_accent");
  const uPointer = u("u_pointer");
  const uStrength = u("u_strength");

  let dpr = 1;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  const n = (c: number[]) => c.map((v) => v / 255) as [number, number, number];

  return {
    resize(_w, _h, ratio) {
      dpr = ratio;
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uRes, canvas.width, canvas.height);
    },
    setPalette(p: Palette) {
      const bg = n(p.bg);
      // A lifted neutral: toward white in light mode, a few steps up in dark.
      const lift = p.dark
        ? (bg.map((v) => Math.min(1, v + 0.13)) as [number, number, number])
        : (bg.map((v) => v - 0.06) as [number, number, number]);
      gl.uniform3f(uBg, ...bg);
      gl.uniform3f(uLift, ...lift);
      gl.uniform3f(uAccent, ...n(p.accent));
      gl.uniform1f(uStrength, p.dark ? 0.38 : 0.2);
    },
    draw(time, pointer: Pointer) {
      gl.uniform1f(uTime, reduced.matches ? 0 : time);
      gl.uniform3f(uPointer, pointer.x * dpr, pointer.y * dpr, pointer.presence);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      return !reduced.matches;
    },
  };
}
