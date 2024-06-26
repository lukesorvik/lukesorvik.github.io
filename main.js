import './style.css' //import the css file
import * as THREE from 'three'; //import the three.js library
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'; //import the orbit controls from three.js
import imgUrl from './space.jpg' //have to import the path for the image, since once we build it will be a different url


const scene = new THREE.Scene(); //create a scene
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 ); //create a camera with perspective projection

//create a renderer, with a canvas element
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

renderer.setSize(window.innerWidth, window.innerHeight); // set the size of the renderer to the window size
renderer.setSize( window.innerWidth, window.innerHeight ); //set the size of the renderer to the window size
renderer.setPixelRatio(window.devicePixelRatio); //set pixel ratio to device pixel ratio
document.body.appendChild( renderer.domElement ) //append the renderer's DOM element to the body

camera.position.z = 10; //set the camera's z position to 5
camera.position.x = 0; //set the camera's z position to 5




//create an ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 10); //ambient light, with color white and intensity 0.5
scene.add(ambientLight);

/*
//create a directional light helper shows where the light is in the scene
const lighthelper = new THREE.DirectionalLightHelper(light, 1); //create a directional light helper
scene.add(lighthelper); //add the light helper to the scene

//create a grid helper, to show the grid in the scene
const gridHelper = new THREE.GridHelper(200, 50); //create a grid helper
scene.add(gridHelper); //add the grid helper to the scene
*/
//create an orbit controls, allows us to move around the scene
const controls = new OrbitControls(camera, renderer.domElement); //create orbit controls with camera and renderer's DOM element


function addStar() {
  const geometry = new THREE.OctahedronGeometry(Math.random() * 0.5 + 0.1, 0); //create a sphere geometry with random size
  const material = new THREE.MeshStandardMaterial({ color: 0xfcf003 }); //create a material with color white
  const star = new THREE.Mesh(geometry, material); //create a mesh with geometry and material

  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100)); //create random x, y, z positions
  //create an array of 3 values and map, the values are random float values between -100 and 100
  star.position.set(x, y, z); //set the position of the star
  scene.add(star); //add the star to the scene
}

Array(500).fill().forEach(addStar); //create array of 200, call to create 200 stars in the scene

//create a background texture
var bgTexture = new THREE.TextureLoader().load(imgUrl);
bgTexture.minFilter = THREE.LinearFilter;
scene.background = bgTexture;

function moveCamera() {
  const t = document.body.getBoundingClientRect().top;

  camera.position.z = t * -0.01;

}

document.body.onscroll = moveCamera;
moveCamera();

window.addEventListener( 'resize', onWindowResize, false );

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
      /*
      object.position.y += Math.random() * 0.01 - 0.005; // float the star in a random direction
      object.position.x += Math.random() * 0.01 - 0.005; // float the star in a random direction
      object.position.z += Math.random() * 0.01 - 0.005; // float the star in a random direction
      */
    }
  });
}


//we want to set up a recursive function to set up infinite loop to animate automatically
function animate() {
  requestAnimationFrame(animate);
  animateStars(); // call the animateStars function to animate the stars
  renderer.render(scene, camera);
}




animate(); //call the animate function