import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as CANNON from "cannon-es";
import cannonDebugger from "cannon-es-debugger";
import { Cube } from "./Cube";
import { RepeatWrapping } from "three";
import * as dat from "dat.gui";

const CUBE_1_COLOR = 0xff3344;
const CUBE_2_COLOR = 0x2222ff;
const CUBE_3_COLOR = 0x661166;
const CUBE_4_COLOR = 0x118811;

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

const scene = new THREE.Scene();

/**
 * Loader
 */
const textureLoader = new THREE.TextureLoader();
const wallDiffuseTexture = textureLoader.load(
  "src/assets/wood-wall/wood-wall-diffuse.jpg"
);
const wallHeightTexture = textureLoader.load(
  "src/assets/wood-wall/wood-wall-height.png"
);
const wallAoTexture = textureLoader.load(
  "src/assets/wood-wall/wood-wall-ao.jpg"
);
const wallRoughnessTexture = textureLoader.load(
  "src/assets/wood-wall/wood-wall-roughness.jpg"
);

const groundDiffuseTexture = textureLoader.load(
  "src/assets/ground-leaves/ground-leaves-diffuse.jpg"
);
const groundHeightTexture = textureLoader.load(
  "src/assets/ground-leaves/ground-leaves-height.png"
);

const groundAoTexture = textureLoader.load(
  "src/assets/ground-leaves/ground-leaves-ao.png"
);

//groundDiffuseTexture.wrapS = THREE.RepeatWrapping;
//groundDiffuseTexture.wrapT = THREE.RepeatWrapping;
//groundDiffuseTexture.repeat.set(3, 3);

// Light
const light = new THREE.AmbientLight(0xffffff, 0.5);
const lightFolderGui = gui.addFolder("LIght");
lightFolderGui.add(light, "intensity").min(0).max(2).step(0.001);
scene.add(light);

const blueLight = new THREE.PointLight(0xffffff, 1, 100);
light.position.set(0, 5, 2);
scene.add(blueLight);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.y = 3;
camera.position.z = 9;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

/**
 * Objects
 */
const plasticMaterial = new CANNON.Material("plastic");
const cube1 = new Cube(0.5, CUBE_1_COLOR, plasticMaterial, [-3, 1, 0], "G4");
const cube2 = new Cube(0.5, CUBE_2_COLOR, plasticMaterial, [-1, 1, 0], "A4");
const cube3 = new Cube(0.5, CUBE_3_COLOR, plasticMaterial, [1, 1, 0], "B4");
const cube4 = new Cube(0.5, CUBE_4_COLOR, plasticMaterial, [3, 1, 0], "C5");
const cubes = [cube1, cube2, cube3, cube4];

// Add all the meshes to the scene
scene.add(...cubes.map((cube) => cube.mesh));

const WALL_DEPTH = 0.1;
const WALL_HEIGHT = 5;
const wallGeometry = new THREE.BoxGeometry(10, WALL_HEIGHT, WALL_DEPTH);
const wallMaterial = new THREE.MeshStandardMaterial({
  map: wallDiffuseTexture,
  displacementMap: wallHeightTexture,
  aoMap: wallAoTexture
  // roughnessMap: wallRoughnessTexture
});
wallMaterial.displacementScale = 0.1;
const wallMeshLeft = new THREE.Mesh(wallGeometry, wallMaterial);
wallMeshLeft.position.x = -5 - WALL_DEPTH;
wallMeshLeft.position.y = WALL_HEIGHT / 2;
wallMeshLeft.rotation.y = -Math.PI / 2;
const wallMeshRight = new THREE.Mesh(wallGeometry, wallMaterial);
wallMeshRight.position.x = 5 + WALL_DEPTH;
wallMeshRight.position.y = WALL_HEIGHT / 2;
wallMeshRight.rotation.y = -Math.PI / 2;
const wallMeshBack = new THREE.Mesh(wallGeometry, wallMaterial);
wallMeshBack.position.z = -5 - WALL_DEPTH;
wallMeshBack.position.y = WALL_HEIGHT / 2;

scene.add(wallMeshLeft, wallMeshRight, wallMeshBack);

// Add the ground
const groundMaterial = new THREE.MeshStandardMaterial({
  map: groundDiffuseTexture,
  displacementMap: groundHeightTexture
  //aoMap: groundAoTexture
  // roughnessMap: wallRoughnessTexture
});
groundMaterial.displacementScale = 1;
const groundGeometry = new THREE.PlaneGeometry(10, 10, 200, 200);
const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
groundMesh.rotation.x = -Math.PI / 2;
groundMesh.position.x = 0;
scene.add(groundMesh);

/**
 * Physics
 */
const world = new CANNON.World();
world.gravity.set(0, -9.82, 0);

// Add all the bodies to the world
cubes.forEach((cube) => {
  world.addBody(cube.body);
});

const concreteMaterial = new CANNON.Material("concrete");
const groundBody = new CANNON.Body({
  type: CANNON.Body.STATIC,
  shape: new CANNON.Plane(),
  material: concreteMaterial
});
groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0); // make it face up
groundBody.position.y = 0;
world.addBody(groundBody);

// Physics interaction
const concretePlasticContactMaterial = new CANNON.ContactMaterial(
  concreteMaterial,
  plasticMaterial,
  {
    friction: 0.1,
    restitution: 0.5
  }
);
world.addContactMaterial(concretePlasticContactMaterial);

// Debugger
//cannonDebugger(scene, world.bodies);

/**
 * Event listeners
 */

document.addEventListener("keydown", (e) => {
  if (e.key === "a") {
    cube1.activate();
  } else if (e.key === "z") {
    cube2.activate();
  } else if (e.key === "e") {
    cube3.activate();
  } else if (e.key === "r") {
    cube4.activate();
  }
});

document.addEventListener("keyup", (e) => {
  if (e.key === "a") {
    cube1.deactivate();
  } else if (e.key === "z") {
    cube2.deactivate();
  } else if (e.key === "e") {
    cube3.deactivate();
  } else if (e.key === "r") {
    cube4.deactivate();
  }
});

window.addEventListener(
  "resize",
  () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    render();
  },
  false
);

const clock = new THREE.Clock();
let oldElapsedTime = 0;
var animate = function () {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - oldElapsedTime;
  oldElapsedTime = elapsedTime;

  // Update physics
  world.step(1 / 60, deltaTime, 3);

  // update the mesh position and rotation (copy from the physic body)
  cubes.forEach((cube) => {
    cube.updateMeshPosition();
    cube.updateMeshRotation();
  });

  requestAnimationFrame(animate);
  controls.update();
  render();
};

function render() {
  renderer.render(scene, camera);
}

animate();
