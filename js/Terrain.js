import {
    Group,
    Mesh,
    MeshBasicMaterial,
    MeshStandardMaterial,
    PlaneGeometry,
    Vector2
  } from "three";
  import { ImprovedNoise } from "three/examples/jsm/math/ImprovedNoise.js";
  
  class Terrain extends Group {
    constructor(chW, chH, chWSeg, chHSeg) {
      const perlin = new ImprovedNoise();
  
      super();
      let that = this;
      this.userData.chunkCounter = 0;
      this.userData.totalTime = 0;
      let g = new PlaneGeometry(chW, chH, chWSeg, chHSeg);
      g.rotateX(Math.PI * -0.5);
      let m = new MeshBasicMaterial({
        color: 0x0000aa,
        //roughness: 0.6,
        //metalness: 0.5,
        onBeforeCompile: (shader) => {
          shader.fragmentShader = shader.fragmentShader.replace(
            /*glsl*/ `#include <fog_fragment>`,
            /*glsl*/ `
              // http://madebyevan.com/shaders/grid/
              vec2 coord = vUv * vec2(${chWSeg}, ${chHSeg}) * 2.;
              vec2 grid = abs(fract(coord - 0.5) - 0.5) / fwidth(coord) / 1.5;
              float line = min(grid.x, grid.y);
              line = min(line, 1.0);
              line = smoothstep(0.99, 1., line);
  
              vec3 col = mix(vec3(1, 0.5, 0.75), gl_FragColor.rgb, line);
              float rf = smoothstep(0.0, 0.0175, abs(vUv.x - 0.5));
              rf = floor(rf * 7.) / 7.; // gradiental steps for the road
              col = mix(vec3(0, 1, 0.75), col, rf);
  
              gl_FragColor = vec4(col, opacity);
            `
          );
        }
      });
      m.defines = { USE_UV: "" };
      //let m2 = new MeshLambertMaterial({ color: "aqua", wireframe: true });
      this.add(new Mesh(g.clone(), m), new Mesh(g.clone(), m));
  
      this.children[1].position.z = -chH;
      this.children[1].userData.initPos = -chH;
  
      this.children[0].userData.initPos = 0;
  
      this.children.forEach((_) => {
        updatePlane(_.geometry);
      });
  
      this.update = (t) => {
        this.userData.totalTime += t;
        this.children.forEach((ch) => {
          let ud = ch.userData;
          let iPos = ud.initPos;
          let tPos = iPos + this.userData.totalTime - chH;
          ch.position.z += t;
          if (ch.position.z > chH) {
            ch.position.z = -chH + (tPos % (chH * 2));
            updatePlane(ch.geometry);
          }
        });
      };
  
      function updatePlane(g) {
        let pos = g.attributes.position;
        let uv = g.attributes.uv;
        let vUv = new Vector2();
        let uvScale = new Vector2(10, 25);
        for (let i = 0; i < pos.count; i++) {
          vUv.fromBufferAttribute(uv, i);
          let s = smoothstep(0.025, 0.125, Math.abs(vUv.x - 0.5));
          vUv.multiply(uvScale);
          vUv.y += uvScale.y * that.userData.chunkCounter;
          let y = perlin.noise(vUv.x, vUv.y, 1) * 0.5 + 0.5;
          pos.setY(i, Math.pow(y, 5) * 75 * s);
        }
        g.computeVertexNormals();
        pos.needsUpdate = true;
  
        that.userData.chunkCounter++;
      }
  
      //https://github.com/gre/smoothstep/blob/master/index.js
      function smoothstep(min, max, value) {
        var x = Math.max(0, Math.min(1, (value - min) / (max - min)));
        return x * x * (3 - 2 * x);
      }
    }
  }
  export { Terrain };
  