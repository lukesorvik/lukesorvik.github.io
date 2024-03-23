import './style.css' //import the css file
import * as THREE from 'three' //import the three.js library

const scene = new THREE.Scene(); // Create a scene
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000); // Create a camera
//(fov, aspect ratio based off users browser window, cutoff for how close objects are visible near, far)

// Create a renderer, render the canvas with the id of 'bg'
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio); //set pixel ratio to device pixel ratio
renderer.setSize(window.innerWidth, window.innerHeight); //set size of renderer to window size, full screen canvas
camera.position.setZ(30); //set camera position to 30 units back

renderer.render(scene, camera); //render the scene with the camera

const geometry = new THREE.TorusGeometry(10, 3, 16, 100); //create a torus geometry
const material = new THREE.MeshStandardMaterial({ color: 0xFF6347, wireframe : true }); //create a material with a color
const torus = new THREE.Mesh(geometry, material); //create a mesh with the geometry and material

scene.add(torus); //add the torus to the scene

//we want to set up a recursive function to set up infinite loop to animate automatically
function animate() {
  requestAnimationFrame(animate); //request animation frame to animate
  renderer.render(scene, camera); //render the scene with the camera
}

animate(); //call the animate function