import * as dat from "dat.gui";
import * as THREE from "three";
import * as CANNON from "cannon-es";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { createCubes } from "./cube-manager";
import {
  wallMeshBack,
  wallMeshLeft,
  wallMeshRight,
  wallMeshFront
} from "./walls";
import { textures } from "./textures";

let gui, scene, camera, controls, renderer, world, cubes;

export const initScene = () => {
  gui = new dat.GUI();
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );
  camera.position.y = 3;
  camera.position.z = 9;

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  controls = new OrbitControls(camera, renderer.domElement);

  /**
   * Objects
   */
  cubes = createCubes();

  // Add cubes to gui
  const params = [0, 1, 0.001]; // min max step
  const colors = {
    0: 0xff0000,
    1: 0x0ff000,
    2: 0x00ff00,
    3: 0x000ff0
  };
  cubes.forEach((cube, index) => {
    const guiFolderCube = gui.addFolder("Cube " + index);
    guiFolderCube.add(cube.mesh.material, "metalness", ...params);
    guiFolderCube.add(cube.mesh.material, "roughness", ...params);
    guiFolderCube.add(cube.mesh.material, "emissiveIntensity", ...params);

    guiFolderCube
      .addColor(colors, `${index}`)
      .name("color")
      .onChange(function () {
        cube.mesh.material.color.set(colors[index]);
      });
  });

  // Add all the meshes to the scene
  scene.add(...cubes.map((cube) => cube.mesh));
  // Add the walls
  scene.add(wallMeshLeft, wallMeshRight, wallMeshBack, wallMeshFront);

  // Add the ground
  const groundMaterial = new THREE.MeshStandardMaterial({
    map: textures.groundDiffuseTexture,
    aoMap: textures.groundAoTexture,
    metalness: 0.2,
    roughness: 0.5
  });
  const groundGeometry = new THREE.PlaneGeometry(10, 5, 200, 200);
  const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
  groundMesh.rotation.x = -Math.PI / 2;
  groundMesh.position.x = 0;
  scene.add(groundMesh);
  const guiFolderGround = gui.addFolder("Ground");
  guiFolderGround.add(groundMaterial, "metalness").min(0).max(1).step(0.001);
  guiFolderGround.add(groundMaterial, "roughness").min(0).max(1).step(0.001);

  /**
   * Physics
   */
  world = new CANNON.World();
  world.gravity.set(0, -9.82, 0);

  // Add all the bodies to the world
  cubes.forEach((cube) => {
    world.addBody(cube.body);
  });
  // Debugger
  //cannonDebugger(scene, world.bodies);

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
    cubes[0].material,
    {
      friction: 0.1,
      restitution: 0.5
    }
  );
  world.addContactMaterial(concretePlasticContactMaterial);

  return {
    gui,
    scene,
    camera,
    controls
  };
};

export const startAnimate = () => {
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
  const animate = function () {
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

    controls.update();
    render();
    requestAnimationFrame(animate);
  };

  function render() {
    renderer.render(scene, camera);
  }

  animate();
};
