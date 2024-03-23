import { Vector2 } from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { PixelShader } from "three/examples/jsm/shaders/PixelShader.js";
class PostPixel extends EffectComposer {
  constructor(scene, camera, renderer) {
    super(renderer);

    this.addPass(new RenderPass(scene, camera));
    this.pixelPass = new ShaderPass(PixelShader);
    this.pixelPass.uniforms["resolution"].value = new Vector2(
      window.innerWidth,
      window.innerHeight
    );
    /*this.pixelPass.uniforms["resolution"].value.multiplyScalar(
      window.devicePixelRatio
    );*/
    this.pixelPass.uniforms["pixelSize"].value = 6;
    this.addPass(this.pixelPass);
  }
}
export { PostPixel };
