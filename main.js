import './style.css' //import the css file
import * as THREE from 'three'; //import the three.js library
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'; //import the orbit controls from three.js


let camera, controls, scene, renderer, effect;

function addStar() {
  const geometry = new THREE.OctahedronGeometry(Math.random() * 0.5 + 0.1, 0); //create a sphere geometry with random size
  const material = new THREE.MeshStandardMaterial({ color: 0xfcf003 }); //create a material with color white
  const star = new THREE.Mesh(geometry, material); //create a mesh with geometry and material

  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100)); //create random x, y, z positions
  //create an array of 3 values and map, the values are random float values between -100 and 100
  star.position.set(x, y, z); //set the position of the star
  scene.add(star); //add the star to the scene
}

function onWindowResize(){

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

}

function animateStars() {
scene.traverse((object) => {
  if (object.isMesh ) {
    object.rotation.y += 0.01; // rotate the star around the y-axis
    object.rotation.x += 0.02; // rotate the star around the y-axis
  }
});
}

function moveCamera() {
  const t = document.body.getBoundingClientRect().top;

  camera.position.z = t * -0.01;

}
//we want to set up a recursive function to set up infinite loop to animate automatically
function animate() {
  requestAnimationFrame(animate);
  animateStars(); // call the animateStars function to animate the stars
  renderer.render(scene, camera);
  }


  
function main() {
  
  scene = new THREE.Scene(); //create a scene
  camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 ); //create a camera with perspective projection
  renderer = new THREE.WebGLRenderer();

  renderer.setSize(window.innerWidth, window.innerHeight); // set the size of the renderer to the window size
  renderer.setSize( window.innerWidth, window.innerHeight ); //set the size of the renderer to the window size
  renderer.setPixelRatio(window.devicePixelRatio); //set pixel ratio to device pixel ratio
  document.body.appendChild( renderer.domElement ) //append the renderer's DOM element to the body
  
  camera.position.z = 10; //set the camera's z position to 5
  camera.position.x = 0; //set the camera's z position to 5
  
  const ambientLight = new THREE.AmbientLight(0xffffff, 10); //ambient light, with color white and intensity 0.5
  scene.add(ambientLight);

  controls = new OrbitControls(camera, renderer.domElement); //create orbit controls with camera and renderer's DOM element

  Array(500).fill().forEach(addStar); //create array of 200, call to create 200 stars in the scene
  
  scene.background = new THREE.Color(0x000000); // Set background to solid black

  document.body.onscroll = moveCamera;
  moveCamera();
  
  window.addEventListener( 'resize', onWindowResize, false );

  animate(); //call the animate function
}

main(); //call the main function