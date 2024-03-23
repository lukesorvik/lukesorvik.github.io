import './style.css' //import the css file
import * as THREE from 'three'; //import the three.js library

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement )


renderer.setPixelRatio(window.devicePixelRatio); //set pixel ratio to device pixel ratio
renderer.setSize(window.innerWidth, window.innerHeight); //set size of renderer to window size, full screen canvas

camera.position.setZ(30); //set camera position to 30 units back


renderer.render(scene, camera); //render the scene with the camera

const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );

camera.position.z = 5;
//we want to set up a recursive function to set up infinite loop to animate automatically
function animate() {
  requestAnimationFrame(animate); //request animation frame to animate
  cube.rotation.x += 0.01;
cube.rotation.y += 0.01;
  renderer.render(scene, camera); //render the scene with the camera
}

animate(); //call the animate function