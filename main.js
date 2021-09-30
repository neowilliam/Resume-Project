import './style.css'

import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'dat.gui'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';
// Debug
//const gui = new dat.GUI()


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGL1Renderer({
  canvas: document.querySelector('#bg'),
  alpha: true
})


const controls = new OrbitControls(camera, renderer.domElement);

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

// initial camera position
camera.position.setZ(30);
camera.position.setY(0.5);

// resizes the window if resized 
window.addEventListener('resize', function()
{
  var width = window.innerWidth;
  var height = window.innerHeight;
  renderer.setSize(width, height)
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
});


// Background
//const spaceTexture = new THREE.TextureLoader().load('img/13.jpg');
//scene.background = spaceTexture;

// Creating Terrain 

   // Texture Loader
   const loader2 = new THREE.TextureLoader()
   const height = loader2.load('img/height.png')
   const texture2 = loader2.load('img/texture2.jpg')

  // Plane Geometry 
  const Pgeometry = new THREE.PlaneBufferGeometry(750,750,100,100)

  // Plane Material 
  const Pmaterial = new THREE.MeshStandardMaterial({
    color: 0x008F11,
    wireframe: true,
    map: texture2,
    displacementScale: 10000,
    displacementMap: height,
  })

  // Plane Mesh
  const plane = new THREE.Mesh(Pgeometry,Pmaterial);
    plane.rotation.x = 1.6;
    plane.position.y = -50;
    scene.add(plane);

 // gui.add(plane.rotation,'x').min(0).max(3)

// Torus Shape
  const geometry = new THREE.TorusGeometry(12, 2.5, 25, 100)
  const material = new THREE.MeshPhongMaterial({ 
    color: 0x969CBA, 
    map: texture2,
    wireframe: true,
  });

  const torus = new THREE.Mesh(geometry, material);
  scene.add(torus)

// Rotating Headshot Cube
  const neoTexture = new THREE.TextureLoader().load('img/wneo_headshot.png');
  const neo = new THREE.Mesh(
    new THREE.BoxGeometry(3,3,3),
    new THREE.MeshBasicMaterial({
      map: neoTexture, 
    })
  );

  neo.position.y = -0.5;
  neo.position.x = 2.75;
  neo.position.z = -2.5;

// GetVirtual Cube
  const GVTexture = new THREE.TextureLoader().load('img/1.png');
  const GV = new THREE.Mesh(
    new THREE.BoxGeometry(3.5,3.5,3.5),
    new THREE.MeshBasicMaterial({
      map:GVTexture,
    })
  );
    GV.position.z = 40;
    GV.position.x = 4;
    GV.position.y = 3;

// Outhrive Cube
const OTTexture = new THREE.TextureLoader().load('img/2.jpg');
  const OT = new THREE.Mesh(
    new THREE.BoxGeometry(3.5,3.5,3.5),
    new THREE.MeshBasicMaterial({
      map:OTTexture,
    })
  );
    OT.position.z = 40;
    OT.position.x = 6;
    OT.position.y = -2.5;


scene.add(GV, neo, OT)

// Importing 3d Object 
const GLTFloader = new GLTFLoader();
GLTFloader.load ('models/cat/scene.gltf', function (gltf){
  const [x,y,z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(500));
gltf.scene.position.set(x,y,z);
  scene.add(gltf.scene);
  gltf.scene.scale.set(0.005, 0.005, 0.005);
});

var obj;
const GLTFloader2 = new GLTFLoader();
GLTFloader2.load ('models/bridge/scene.gltf', function (gltf){
  gltf.scene.scale.set(5, 5, 5);
  gltf.scene.position.y = -4.5;
  gltf.scene.position.x = 2.5;
  gltf.scene.position.z = 19;
  gltf.scene.rotation.z = -0.2;
  obj = gltf.scene;
  scene.add(gltf.scene);
})

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(ambientLight)
    //const gridHelper = new THREE.GridHelper(200,200)
    //scene.add(gridHelper)

    const pointLight = new THREE.PointLight(0xffffff,1)
    pointLight.position.x = 0
    pointLight.position.y = 3
    pointLight.position.z = 4
    scene.add(pointLight)


// Adding Random Stars
function addStar(){
  const geometry = new THREE.SphereGeometry(0.09,24,24);
  const material = new THREE.MeshPhongMaterial( {
    color: 0xadd8e6,
  })
  const star = new THREE.Mesh(geometry,material);

  const [x,y,z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(500));
  star.position.set(x,y + 100,z);
  scene.add(star)

}
Array(500).fill().forEach(addStar)

function moveCamera() {

  const t = document.body.getBoundingClientRect().top;

  torus.rotation.z += -0.0075;

  neo.rotation.y += 0.025;
  neo.rotation.z += 0.025;
  GV.rotation.y += 0.025;
  GV.rotation.z += 0.025;
  OT.rotation.y -= 0.025;
  OT.rotation.z -= 0.025;
  obj.rotation.y += 0.025;

  camera.position.z = t * -0.025 + 3.5;
  camera.position.x = t * -0.0002;
  camera.rotation.y = t * -0.0002;

}

document.body.onscroll = moveCamera
document.addEventListener('mousemove', animateTerrain)
let mouseY = 1 
function animateTerrain(event) {
    mouseY = event.clientY
}

// Run animation loop, update + render
function GameLoop() {
  requestAnimationFrame(GameLoop);

  obj.rotation.y +=0.001;
  GV.rotation.y +=0.001;
  OT.rotation.y -=0.001;

  neo.rotation.y += 0.001; 
  torus.rotation.z += 0.001;
  plane.material.displacementScale = mouseY * 0.08;

  controls.update()
  renderer.render(scene,camera)
}

//fingers crossed
GameLoop();