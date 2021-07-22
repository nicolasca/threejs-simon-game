import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as Tone from "tone";

const CUBE_1_COLOR = 0xff3344;
const CUBE_2_COLOR = 0x2222ff;
const CUBE_3_COLOR = 0x661166;

function createCube(color) {
  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshStandardMaterial({
    color
  });
  return new THREE.Mesh(geometry, material);
}

/**
 * Sounds
 */
//create a synth and connect it to the main output (your speakers)
const synth = new Tone.Synth().toDestination();

const scene = new THREE.Scene();

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
camera.position.z = 3;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

const cube1 = createCube(CUBE_1_COLOR);
cube1.position.x = -1.5;
const cube2 = createCube(CUBE_2_COLOR);
const cube3 = createCube(CUBE_3_COLOR);
cube3.position.x = 1.5;
scene.add(cube1, cube2, cube3);

/**
 * Event listeners
 */

document.addEventListener("keydown", (e) => {
  if (e.key === "a") {
    cube1.material.color.set("yellow");
    //play a middle 'C' for the duration of an 8th note
    synth.triggerAttackRelease("A4", "8n");
  } else if (e.key === "z") {
    cube2.material.color.set("yellow");
    synth.triggerAttackRelease("B4", "8n");
  } else if (e.key === "e") {
    cube3.material.color.set("yellow");
    synth.triggerAttackRelease("C5", "8n");
  }
});

window.addEventListener("keyup", (e) => {
  if (e.key === "a") {
    cube1.material.color.set(CUBE_1_COLOR);
  } else if (e.key === "z") {
    cube2.material.color.set(CUBE_2_COLOR);
  } else if (e.key === "e") {
    cube3.material.color.set(CUBE_3_COLOR);
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

var animate = function () {
  requestAnimationFrame(animate);
  // cube.rotation.x += 0.01;
  //cube.rotation.y += 0.01;
  controls.update();
  render();
};

function render() {
  renderer.render(scene, camera);
}

animate();
