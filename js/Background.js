import {
    BackSide,
    CylinderGeometry,
    Mesh,
    MeshBasicMaterial,
    NearestFilter,
    TextureLoader
  } from "three";
  import texTokyo from "../media/Tokyo.png";
  
  class Background extends Mesh {
    constructor() {
      let g = new CylinderGeometry(2000, 2000, 4000, 60, 1, true);
      let m = new MeshBasicMaterial({
        side: BackSide,
        transparent: false,
        onBeforeCompile: (shader) => {
          shader.uniforms.time = this.totalTime;
          shader.uniforms.texTokyo = {
            value: new TextureLoader().load(texTokyo, (tex) => {
              tex.minFilter = NearestFilter;
              tex.magFilter = NearestFilter;
            })
          };
          shader.fragmentShader = `
            uniform float time;
            uniform sampler2D texTokyo;
            float gradSteps(float f, float steps){return ceil(f * steps) / steps;}
            ${shader.fragmentShader}
          `.replace(
            `vec4 diffuseColor = vec4( diffuse, opacity );`,
            /*glsl*/ `
            vec3 col = vec3(128, 64, 128) / 255.;
            float f = 0.;
  
            vec2 uv = (vUv - 0.5) * vec2(-1., 1.) * 2.;
            
            float c = clamp(uv.y / 0.5, 0., 1.);
            c = gradSteps(c, 7.);
            f += c;
            col = mix(col, vec3(0.25, 0.125, 0.25), c);
  
            float c1 = 1. - clamp(length(uv * vec2(PI, 1.)) / 0.5, 0., 1.);
            c1 = gradSteps(c1, 7.);
            f += c1;
            col = mix(col, vec3(1, 0.75, 1), c1);
  
            vec2 cUv = uv * 20.; // vertical stripes
            vec3 cc = vec3(
              cUv.x > 0. && cUv.x < 0.33,
              cUv.x >= 0.33 && cUv.x < 0.67,
              cUv.x >= 0.67 && cUv.x < 1.
            );
            col = mix(col, cc, step(cUv.x, 0.) - step(cUv.x, 1.));
            
            vec2 tUv = uv * 7.;
            tUv += vec2(0.5, -1.25);
            vec4 tokyo = texture2D(texTokyo, tUv);
            col = mix(col, tokyo.rgb, tokyo.a);
  
            vec4 diffuseColor = vec4( col, clamp(f, 0., 1.) );`
          );
          console.log(shader.fragmentShader);
        }
      });
      m.defines = { USE_UV: "" };
      super(g, m);
      this.totalTime = { value: 0 };
      this.update = (t) => {
        this.totalTime.value += t;
      };
    }
  }
  export { Background };
  