import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as CANNON from "cannon-es";
import cannonDebugger from "cannon-es-debugger";
import { Cube } from "./Cube";

const CUBE_1_COLOR = 0xff3344;
const CUBE_2_COLOR = 0x2222ff;
const CUBE_3_COLOR = 0x661166;
const CUBE_4_COLOR = 0x118811;

const scene = new THREE.Scene();

// Light
const light = new THREE.AmbientLight(0x404040);
light.intensity = 3;
scene.add(light);

const blueLight = new THREE.PointLight(0x0000fff, 1, 100);
light.position.set(10, 10, 10);
scene.add(blueLight);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.z = 6;

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
groundBody.position.y = -1;
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
cannonDebugger(scene, world.bodies);

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
