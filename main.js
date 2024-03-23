import './style.css' //import the css file
import * as THREE from 'three'; //import the three.js library

const scene = new THREE.Scene(); //create a scene
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 ); //create a camera with perspective projection

//create a renderer, with a canvas element
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

renderer.setSize(window.innerWidth, window.innerHeight); // set the size of the renderer to the window size
renderer.setClearColor(0x000000, 0); // set the renderer's background color to clear color
renderer.setSize( window.innerWidth, window.innerHeight ); //set the size of the renderer to the window size
renderer.setPixelRatio(window.devicePixelRatio); //set pixel ratio to device pixel ratio
document.body.appendChild( renderer.domElement ) //append the renderer's DOM element to the body

camera.position.z = 5; //set the camera's z position to 5


const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );


//we want to set up a recursive function to set up infinite loop to animate automatically
function animate() {
  requestAnimationFrame(animate); //request animation frame to animate
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  renderer.render(scene, camera); //render the scene with the camera
}

animate(); //call the animate function