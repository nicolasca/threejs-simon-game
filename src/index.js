import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as CANNON from "cannon-es";
import cannonDebugger from "cannon-es-debugger";
import { Cube } from "./cube";
import * as dat from "dat.gui";
import {
  environmentMapTexture1,
  environmentMapTexture2,
  environmentMapTexture3,
  environmentMapTexture4,
  textures,
} from "./textures";
import {
  wallMaterial,
  wallMeshBack,
  wallMeshLeft,
  wallMeshRight,
} from "./walls";

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.y = 3;
camera.position.z = 9;

// Light
const ambiantLight = new THREE.AmbientLight(0xffffff, 0.8);
const lightFolderGui = gui.addFolder("Light");
scene.add(ambiantLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(0, 5, 2);
scene.add(directionalLight);

lightFolderGui
  .add(ambiantLight, "intensity")
  .min(0)
  .max(2)
  .step(0.001)
  .name("Ambiant light intensity");
lightFolderGui
  .add(directionalLight, "intensity")
  .min(0)
  .max(2)
  .step(0.001)
  .name("Directional light intensity");

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

/**
 * Objects
 */
const plasticMaterial = new CANNON.Material("plastic");
const cube1 = new Cube(
  0.5,
  plasticMaterial,
  [-3, 1, 0],
  "G4",
  environmentMapTexture1
);
const cube2 = new Cube(
  0.5,
  plasticMaterial,
  [-1, 1, 0],
  "A4",
  environmentMapTexture2
);
const cube3 = new Cube(
  0.5,
  plasticMaterial,
  [1, 1, 0],
  "B4",
  environmentMapTexture4
);
const cube4 = new Cube(
  0.5,
  plasticMaterial,
  [3, 1, 0],
  "C5",
  environmentMapTexture3
);
const cubes = [cube1, cube2, cube3, cube4];

gui.add(cube1.mesh.material, "metalness").min(0).max(1).step(0.001);
gui.add(cube1.mesh.material, "roughness").min(0).max(1).step(0.001);

// Add all the meshes to the scene
scene.add(...cubes.map((cube) => cube.mesh));

// Add the walls
scene.add(wallMeshLeft, wallMeshRight, wallMeshBack);

const wallFolderGui = gui.addFolder("Wall");
wallFolderGui.add(wallMaterial, "metalness").min(0).max(1).step(0.001);
wallFolderGui.add(wallMaterial, "roughness").min(0).max(1).step(0.001);

// Add the ground
const groundMaterial = new THREE.MeshStandardMaterial({
  map: textures.groundDiffuseTexture,
  //displacementMap: textures.groundHeightTexture,
  //aoMap: groundAoTexture
  // roughnessMap: wallRoughnessTexture
});
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
  material: concreteMaterial,
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
    restitution: 0.5,
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
  try {
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
  } catch (err) {
    console.log("Error during the render", err);
  }
};

function render() {
  renderer.render(scene, camera);
}

animate();
