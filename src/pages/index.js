import * as React from "react"
import * as THREE from "three"
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader.js';

// styles
import * as indexStyles from "../styles/pages/index.module.scss"

// markup
class IndexPage extends React.Component {

  componentDidMount() {
    let clock = new THREE.Clock();

    const imgLoc = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/4273/";
    let camera = new THREE.PerspectiveCamera(45, 1, 0.1, 10000)
    let light = new THREE.PointLight(0xFFFFFF, 3, 5000);
    camera.position.set(1300, 0, 0)
    let scene = new THREE.Scene();

    camera.lookAt(scene.position);
    light.position.set(2000, 2000, 1500);
    scene.add(light);

    let marsGeo = new THREE.SphereGeometry(500, 32, 32),
      marsMaterial = new THREE.MeshPhongMaterial(),
      marsMesh = new THREE.Mesh(marsGeo, marsMaterial);
    scene.add(marsMesh);

    let loader = new THREE.TextureLoader();
    marsMaterial.map = loader.load(imgLoc + 'mars-map.jpg');
    marsMaterial.bumpMap = loader.load(imgLoc + 'mars-bump.jpg');
    marsMaterial.bumpScale = 8;
    marsMaterial.specular = new THREE.Color('#000000');

    scene.background = new THREE.Color( 0xffffff );

    let renderer = new THREE.WebGLRenderer({ antialiasing: true });
    renderer.setSize(120, 120)
    renderer.autoClear = false
    document.getElementById("mars").appendChild(renderer.domElement);

    //let controls = new THREE.OrbitControls(camera, renderer.domElement);
    //controls.addEventListener('change', render);

    const composer = new EffectComposer( renderer );
    composer.setSize(120, 120)
    composer.setPixelRatio(2)

    const renderPass = new RenderPass( scene, camera );
composer.addPass( renderPass ); 

    let effectFXAA = new ShaderPass( FXAAShader );

    composer.addPass(effectFXAA)

    function animate() {
      requestAnimationFrame(animate);
      // controls.update();
      render();
    }

    function render() {
      var delta = clock.getDelta();
      marsMesh.rotation.y += 0.1 * delta;
      renderer.clear();
      
      composer.render()

      // renderer.render(scene, camera);
    }

    animate();
  }

  render() {
    return (
      <main className={indexStyles.index}>
        <title>Hello Mars / The Podcast</title>

        <div id="mars"></div>

        <h1 className={indexStyles.title}>Hello Mars</h1>
        <h2 className={indexStyles.subtitle}>
          A podcast about technology, and sometimes space
        </h2>
      </main>
    )
  }
}

export default IndexPage
