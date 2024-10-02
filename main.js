import './style.css' //import the css file
import * as THREE from 'three'; //import the three.js library
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'; //import the orbit controls from three.js
import { STLLoader } from 'three/examples/jsm/Addons.js';

let camera, controls, scene, renderer, effect;
const rotationSpeeds = [];

function addStars() {

  for (let i = 0; i < 500; i++) {
    const loader = new STLLoader();
    //have to be in public folder+ referece without directory
    loader.load('starSimple.stl', function (geometry) {
      const material = new THREE.MeshStandardMaterial({ color: 0xfcf003 });
      const newGeometry = geometry.center(); //recenter the geometry rotation point based on box of geometry
      const star = new THREE.Mesh(newGeometry, material);
      const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(200)); //create random x, y, z positions
      star.position.set(x, y, z); //set the position of the star
      const scale = Math.random() * 0.1;
      star.scale.set(scale, scale, scale); //Math.random() * 0.5 + 0.1

      //for each star, we want to add a random rotation speed to an array
      //each object is {x: random number, y: random number}
      rotationSpeeds.push({
        x: Math.random() * 0.02,
        y: Math.random() * 0.02,
      });

      star.name = `star${i}`; //set the name of the star to star


      scene.add(star);
    });
  }

  

}

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);

}

function animateStars() {
  //since we have 500 stars, we want to loop through each star and update the rotation
  //scene will have 500 stars + 1 ambient light
  for (let index = 0; index < 500; index++) {
    const object = scene.getObjectByName(`star${index}`); //get the object by name

    if(object !== undefined) { //if the object is not undefined
      object.rotation.x += rotationSpeeds[index].x;
      object.rotation.y += rotationSpeeds[index].y;
    }
  
  }
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
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000); //create a camera with perspective projection
  renderer = new THREE.WebGLRenderer();

  renderer.setSize(window.innerWidth, window.innerHeight); // set the size of the renderer to the window size
  renderer.setSize(window.innerWidth, window.innerHeight); //set the size of the renderer to the window size
  renderer.setPixelRatio(window.devicePixelRatio); //set pixel ratio to device pixel ratio
  document.body.appendChild(renderer.domElement) //append the renderer's DOM element to the body

  camera.position.z = 10; //set the camera's z position to 5
  camera.position.x = 0; //set the camera's z position to 5

  const ambientLight = new THREE.AmbientLight(0xffffff, 10); //ambient light, with color white and intensity 0.5


  controls = new OrbitControls(camera, renderer.domElement); //create orbit controls with camera and renderer's DOM element

  addStars();
  

  scene.add(ambientLight);
  scene.background = new THREE.Color(0x000000); // Set background to solid black

  document.body.onscroll = moveCamera;
  moveCamera();

  window.addEventListener('resize', onWindowResize, false);

  //add a starfield background from https://github.com/mrdoob/three.js/blob/master/examples/webgl_camera.html
  const geometry = new THREE.BufferGeometry();
  const vertices = [];

  for ( let i = 0; i < 10000; i ++ ) {

    vertices.push( THREE.MathUtils.randFloatSpread( 2000 ) ); // x
    vertices.push( THREE.MathUtils.randFloatSpread( 2000 ) ); // y
    vertices.push( THREE.MathUtils.randFloatSpread( 2000 ) ); // z

  }

  geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );

  const particles = new THREE.Points( geometry, new THREE.PointsMaterial( { color: 0x888888 } ) );
  scene.add( particles );

  animate(); //call the animate function
}

main(); //call the main function

// TODO: add min threshhold for smaller stars so dont spawn close