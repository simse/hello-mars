import * as React from "react"
import * as THREE from "three"
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader.js';


class Mars extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            height: 120,
            width: 120,
            textureRes: "1k"
        }
    }

    componentDidMount() {
        let clock = new THREE.Clock();

        let camera = new THREE.PerspectiveCamera(45, 1, 0.1, 10000)
        let light = new THREE.PointLight(0xFFFFFF, 2.5, 5000);
        camera.position.set(1300, 0, 0)
        let scene = new THREE.Scene();

        camera.lookAt(scene.position);
        light.position.set(2000, 1000, 1500);
        scene.add(light);

        let marsGeo = new THREE.SphereGeometry(500, 32, 32),
            marsMaterial = new THREE.MeshPhongMaterial(),
            marsMesh = new THREE.Mesh(marsGeo, marsMaterial);
        scene.add(marsMesh);

        marsMesh.rotation.y = 180

        let loader = new THREE.TextureLoader();
        marsMaterial.map = loader.load(require(`../images/mars-texture-${this.state.textureRes}.jpg`).default);
        marsMaterial.bumpMap = loader.load(require(`../images/mars-bump-${this.state.textureRes}.jpg`).default);
        marsMaterial.bumpScale = 16;
        marsMaterial.specular = new THREE.Color('#000000');

        scene.background = new THREE.Color(0xffffff);

        let renderer = new THREE.WebGLRenderer({ antialiasing: true });
        renderer.setSize(this.state.height, this.state.width)
        renderer.autoClear = false
        document.getElementById("mars").appendChild(renderer.domElement);

        //let controls = new THREE.OrbitControls(camera, renderer.domElement);
        //controls.addEventListener('change', render);

        const composer = new EffectComposer(renderer);
        composer.setSize(120, 120)
        composer.setPixelRatio(2)

        const renderPass = new RenderPass(scene, camera);
        composer.addPass(renderPass);

        let effectFXAA = new ShaderPass(FXAAShader);

        composer.addPass(effectFXAA)

        function animate() {
            requestAnimationFrame(animate);
            // controls.update();
            render();
        }

        function render() {
            var delta = clock.getDelta();
            marsMesh.rotation.y += 0.15 * delta;
            renderer.clear();

            composer.render()

            // renderer.render(scene, camera);
        }

        animate();
    }

    render() {
        return (
            <div id="mars" style={{ height: 120 }}></div>
        )
    }
}

export default Mars